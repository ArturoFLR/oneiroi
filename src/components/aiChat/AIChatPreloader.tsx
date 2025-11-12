import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GLOBAL_FONTS } from "../../theme";
import LoadingSpinner from "../common/LoadingSpinner";
import { AIChatSoundData, ChatPhase } from "./aiChatTypes";
import { SoundDirectorAPI1, SoundStore1 } from "../../classes/sound/singletons";
import { AudioEnvironment } from "../../classes/sound/soundTypes";
import styled from "styled-components";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const PreloaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////    MAIN COMPONENT   ////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface AIChatPreloaderProps {
  chatPhase: ChatPhase;
  setChatPhase: React.Dispatch<React.SetStateAction<ChatPhase>>;
  jonasPortraitSrc: string;
  npcPortraitSrc: string;
  soundsToLoad: AIChatSoundData | null;
}

function AIChatPreloader({
  chatPhase,
  setChatPhase,
  jonasPortraitSrc,
  npcPortraitSrc,
  soundsToLoad,
}: AIChatPreloaderProps) {
  const [loadingProgress, setLoadingProgress] = useState<number>(0);

  //Estas referencias se encargan de que no se intenten precargar 2 veces (StricMode) los recursos.
  const areImagesPreloadingRef = useRef<boolean>(false);
  const isMusicPreloadingRef = useRef<boolean>(false);
  const areAmbientSoundsPreloadingRef = useRef<boolean>(false);

  // Calcula el número total de items a cargar, entre imágenes y sonidos.
  const getTotalItemsToLoad = useMemo(() => {
    // El número de items totales comienza siendo 2 porque siempre habrá una imagen de Jonas y una del NPC.
    let totalItems = 2;

    // Sumamos sonidos ambiente
    if (soundsToLoad?.ambientSound) {
      totalItems += soundsToLoad.ambientSound.mainAmbientSounds.length;
      if (soundsToLoad.ambientSound.secondaryAmbientSounds) {
        totalItems += soundsToLoad.ambientSound.secondaryAmbientSounds.length;
      }
    }

    //Sumamos música
    if (soundsToLoad?.music) {
      totalItems += 1;
    }

    return totalItems;
  }, [soundsToLoad]);

  // Hace avanzar el porcentaje de carga y comprueba si ha fincalizado.
  const advanceCompletion = useCallback(() => {
    setLoadingProgress((prev) => {
      if (prev >= 100) return 100;

      const totalItems = getTotalItemsToLoad;
      if (totalItems === 0) return 100;

      const itemPercentage = 100 / totalItems;
      const newProgress = prev + itemPercentage;

      return Math.min(newProgress, 100); // Asegura no pasar de 100
    });
  }, [getTotalItemsToLoad]);

  // Precarga las imágenes
  const preloadImages = useCallback(() => {
    if (areImagesPreloadingRef.current) return;
    areImagesPreloadingRef.current = true;

    const imagesSRC = [jonasPortraitSrc, npcPortraitSrc];

    imagesSRC.forEach((imageURL) => {
      const img = new Image();
      img.src = imageURL; // Hace que la imagen se precargue en la caché del navegador, aunque no la guardemos en ningún sitio.
      img.onload = () => {
        advanceCompletion();
      };

      img.onerror = () => {
        console.error(
          `AI Chat Preloader: Error precargando la imagen: ${imageURL}`
        );
        advanceCompletion();
      };
    });
  }, [jonasPortraitSrc, npcPortraitSrc, advanceCompletion]);

  // Precarga la música
  const preloadMusic = useCallback(() => {
    if (isMusicPreloadingRef.current) return;
    isMusicPreloadingRef.current = true;

    if (
      soundsToLoad?.music &&
      !SoundStore1.audioStore.aiChat.music[soundsToLoad.music.soundName]
    ) {
      const musicData = soundsToLoad.music;
      SoundDirectorAPI1.preloadSound(
        AudioEnvironment.AIChat,
        "music",
        musicData.soundName,
        musicData.soundSrc,
        musicData.config
      ).then((result) => {
        if (result) {
          advanceCompletion();
        } else {
          console.error(
            `AI Chat Preloader: Error precargando la música: ${musicData.soundSrc}`
          );
          advanceCompletion();
        }
      });
    }
  }, [advanceCompletion, soundsToLoad?.music]);

  // Precarga el soundscape.
  const preloadAmbientSounds = useCallback(() => {
    if (areAmbientSoundsPreloadingRef.current) return;
    areAmbientSoundsPreloadingRef.current = true;

    if (soundsToLoad?.ambientSound) {
      const ambientSoundData = soundsToLoad.ambientSound;

      ambientSoundData.mainAmbientSounds.forEach((mainSound) => {
        SoundDirectorAPI1.preloadSound(
          AudioEnvironment.AIChat,
          "soundscapes",
          mainSound.name,
          mainSound.src,
          mainSound.config
        ).then((result) => {
          if (result) {
            advanceCompletion();
          } else {
            console.error(
              `AI Chat Preloader: Error precargando el sonido principal: ${mainSound.src}`
            );
            advanceCompletion();
          }
        });
      });

      if (ambientSoundData?.secondaryAmbientSounds) {
        ambientSoundData.secondaryAmbientSounds.forEach((secSound) => {
          SoundDirectorAPI1.preloadSound(
            AudioEnvironment.AIChat,
            "soundscapes",
            secSound.name,
            secSound.src,
            secSound.config
          ).then((result) => {
            if (result) {
              advanceCompletion();
            } else {
              console.error(
                `AI Chat Preloader: Error precargando el sonido secundario: ${secSound.src}`
              );
              advanceCompletion();
            }
          });
        });
      }
    }
  }, [advanceCompletion, soundsToLoad?.ambientSound]);

  // Realiza la precarga de datos.
  useEffect(() => {
    if (chatPhase !== "preloading") return;

    preloadImages();
    preloadMusic();
    preloadAmbientSounds();
    //La precarga de fuentes se realiza directamente en el return del componente, generando contenido no visible.

    // Si no hubiera nada que cargar, no se ejecutaría advanceCompletion() en las funciones anteriores, por lo que lo hacemos manualmente.
    if (getTotalItemsToLoad === 0) {
      advanceCompletion();
    }
  }, [
    chatPhase,
    preloadImages,
    preloadMusic,
    preloadAmbientSounds,
    advanceCompletion,
    getTotalItemsToLoad,
  ]);

  //Si se ha llegado al 100% de carga, se comienza la conversación.
  useEffect(() => {
    //Establecemos un margen de error, ya que puede haber errores de redondeo que provocan una cifra de carga de 99.999999999999
    const securityMargin = 0.05;

    if (loadingProgress >= 100 - securityMargin) {
      setChatPhase("userInput");
    }
  }, [loadingProgress, setChatPhase]);

  return (
    <PreloaderContainer>
      <LoadingSpinner progress={loadingProgress} />
      <div
        style={{
          position: "absolute",
          opacity: 0,
          top: 0,
          left: 0,
          pointerEvents: "none",
        }}
      >
        {/* Listamos todas las fuentes, pesos y estilos necesarios. */}
        <p
          style={{
            fontFamily: GLOBAL_FONTS.aiChat.playerText,
            fontWeight: 400,
          }}
        >
          Preload Jonas Text Font
        </p>
        <p style={{ fontFamily: GLOBAL_FONTS.aiChat.aiText, fontWeight: 400 }}>
          Preload NPC Text Font
        </p>
        <p style={{ fontFamily: GLOBAL_FONTS.aiChat.names, fontWeight: 400 }}>
          Preload Names Font
        </p>
      </div>
    </PreloaderContainer>
  );
}

export default AIChatPreloader;
