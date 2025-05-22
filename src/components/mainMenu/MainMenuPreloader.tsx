import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import LoadingSpinner from "../common/LoadingSpinner";
import {
  mainMenuImages,
  mainMenuInterfaceSounds,
  mainMenuMusics,
} from "../../data/dataToPreload/mainMenuPreloadData";
import { SoundDirectorAPI1, SoundStore1 } from "../../classes/sound/singletons";
import { AudioEnvironment } from "../../classes/sound/soundTypes";

interface MainMenuPreloaderProps {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

function MainMenuPreloader({ setIsLoading }: MainMenuPreloaderProps) {
  const [loadingProgress, setLoadingProgress] = useState<number>(0);

  //Estas referencias se encargan de que no se intenten precargar 2 veces (StricMode) los recursos.
  const areImagesPreloadingRef = useRef<boolean>(false);
  const areInterfaceSoundsPreloadingRef = useRef<boolean>(false);
  const isMusicPreloadingRef = useRef<boolean>(false);

  // Calcula el número total de items a cargar, entre imágenes y sonidos.
  const getTotalItemsToLoad = useMemo(() => {
    let totalItems = 0;

    // Sonidos de interfaz
    totalItems += mainMenuInterfaceSounds.length;

    // Imágen de fondo
    totalItems += 1;

    // Música
    totalItems += 1;

    return totalItems;
  }, []);

  // Hace avanzar el porcentaje de carga y comprueba si ha finalizado.
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

  const preloadMusic = useCallback(() => {
    if (isMusicPreloadingRef.current) return;
    isMusicPreloadingRef.current = true;

    mainMenuMusics.forEach((music) => {
      if (!SoundStore1.audioStore.mainMenu.music[music.soundName]) {
        SoundDirectorAPI1.preloadSound(
          AudioEnvironment.MainMenu,
          "music",
          music.soundName,
          music.soundSrc,
          music.config
        ).then((result) => {
          if (result) {
            advanceCompletion();
          } else {
            console.error(
              `Cinematic Director: Error cargando la música: ${music.soundName} con src: ${music.soundSrc}`
            );
            advanceCompletion();
          }
        });
      } else {
        advanceCompletion();
      }
    });
  }, [advanceCompletion]);

  const preloadInterfaceSounds = useCallback(() => {
    if (areInterfaceSoundsPreloadingRef.current) return;
    areInterfaceSoundsPreloadingRef.current = true;

    mainMenuInterfaceSounds.forEach((sound) => {
      if (!SoundStore1.audioStore.interfacePreloaded.sounds[sound.soundName]) {
        const isSoundPreloaded = SoundDirectorAPI1.preloadInterfaceSound(
          sound.soundName,
          sound.soundSrc,
          sound.config
        );

        if (isSoundPreloaded) {
          advanceCompletion();
        } else {
          console.error(
            `Cinematic Director: Error cargando el sonido: ${sound.soundSrc}`
          );
          advanceCompletion();
        }
      } else {
        advanceCompletion();
      }
    });
  }, [advanceCompletion]);

  const preloadImages = useCallback(() => {
    if (areImagesPreloadingRef.current) return;
    areImagesPreloadingRef.current = true;

    mainMenuImages.forEach((image) => {
      const newImg = new Image();
      newImg.src = image.src; // Hace que la imagen se precargue en la caché del navegador, aunque no la guardemos en ningún sitio.
      newImg.onload = () => {
        advanceCompletion();
      };

      newImg.onerror = () => {
        console.error(
          `Cinematic Director: Error cargando la imagen: ${image.src}`
        );
        advanceCompletion();
      };
    });
  }, [advanceCompletion]);

  // Realiza la precarga elementos.
  useEffect(() => {
    preloadMusic();
    preloadInterfaceSounds();
    preloadImages();
    //La precarga de fuentes se realiza directamente en el return del componente, generando contenido no visible.

    // Si no hubiera nada que cargar, no se ejecutaría advanceCompletion() en las funciones anteriores, por lo que lo hacemos manualmente.
    if (getTotalItemsToLoad === 0) {
      advanceCompletion();
    }
  }, [
    preloadImages,
    preloadMusic,
    preloadInterfaceSounds,
    advanceCompletion,
    getTotalItemsToLoad,
  ]);

  //Si se ha llegado al 100% de carga, se inicia la cinemática.
  useEffect(() => {
    //Establecemos un margen de error, ya que puede haber errores de redondeo que provocan una cifra de carga de 99.999999999999
    const securityMargin = 0.05;

    if (loadingProgress >= 100 - securityMargin) {
      setIsLoading(false);
    }
  }, [loadingProgress, setIsLoading]);

  return (
    <>
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
        <p style={{ fontFamily: "Shadows Into Light", fontWeight: 400 }}>
          Preload
        </p>
      </div>
    </>
  );
}

export default MainMenuPreloader;
