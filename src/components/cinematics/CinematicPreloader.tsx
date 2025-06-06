import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import LoadingSpinner from "../common/LoadingSpinner";
import { CinematicMusic, CinematicSceneAuto } from "./cinematicTypes";
import { SoundDirectorAPI1, SoundStore1 } from "../../classes/sound/singletons";
import { AudioEnvironment } from "../../classes/sound/soundTypes";

interface LoaderProps {
  cinematicData: CinematicSceneAuto;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

function CinematicPreloader({ cinematicData, setIsLoading }: LoaderProps) {
  const [loadingProgress, setLoadingProgress] = useState<number>(0);

  //Estas referencias se encargan de que no se intenten precargar 2 veces (StricMode) los recursos.
  const areImagesPreloadingRef = useRef<boolean>(false);
  const areUniqueSoundsPreloadingRef = useRef<boolean>(false);
  const isMusicPreloadingRef = useRef<boolean>(false);
  const areAmbientSoundsPreloadingRef = useRef<boolean>(false);
  const areVideosPreloadingRef = useRef<boolean>(false);

  // Calcula el número total de items a cargar, entre imágenes y sonidos.
  const getTotalItemsToLoad = useMemo(() => {
    let totalItems = 0;

    cinematicData.forEach((shot) => {
      if (shot.mainImageUrl) {
        totalItems += 1;
      }

      if (shot.uniqueSounds) {
        totalItems += shot.uniqueSounds.length;
      }

      if (shot?.music && typeof shot.music !== "number") {
        totalItems += 1;
      }

      if (shot.ambientSound && typeof shot.ambientSound !== "number") {
        totalItems += shot.ambientSound.mainAmbientSounds.length;

        if (shot.ambientSound.secondaryAmbientSounds) {
          totalItems += shot.ambientSound.secondaryAmbientSounds.length;
        }
      }

      if (shot.specialFX?.videoFx) {
        totalItems += shot.specialFX.videoFx.length;
      }
    });

    return totalItems;
  }, [cinematicData]);

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

    cinematicData.forEach((shot) => {
      if (shot.mainImageUrl) {
        const img = new Image();
        img.src = shot.mainImageUrl; // Hace que la imagen se precargue en la caché del navegador, aunque no la guardemos en ningún sitio.
        img.onload = () => {
          advanceCompletion();
        };

        img.onerror = () => {
          console.error(
            `Cinematic Director: Error cargando la imagen: ${shot.mainImageUrl}`
          );
          advanceCompletion();
        };
      }
    });
  }, [advanceCompletion, cinematicData]);

  const preloadSounds = useCallback(() => {
    if (areUniqueSoundsPreloadingRef.current) return;
    areUniqueSoundsPreloadingRef.current = true;

    cinematicData.forEach((shot) => {
      if (shot.uniqueSounds) {
        shot.uniqueSounds.forEach((uniqueSound) => {
          if (
            !SoundStore1.audioStore.cinematic[uniqueSound.category][
              uniqueSound.soundName
            ]
          ) {
            SoundDirectorAPI1.preloadSound(
              AudioEnvironment.Cinematic,
              uniqueSound.category,
              uniqueSound.soundName,
              uniqueSound.soundSrc,
              uniqueSound.config
            ).then((result) => {
              if (result) {
                advanceCompletion();
              } else {
                console.error(
                  `Cinematic Director: Error cargando el sonido: ${uniqueSound.soundSrc}`
                );
                advanceCompletion();
              }
            });
          }
        });
      }
    });
  }, [advanceCompletion, cinematicData]);

  const preloadMusic = useCallback(() => {
    if (isMusicPreloadingRef.current) return;
    isMusicPreloadingRef.current = true;

    cinematicData.forEach((shot) => {
      if (
        shot?.music &&
        typeof shot.music !== "number" &&
        !SoundStore1.audioStore.cinematic.music[shot.music.soundName]
      ) {
        SoundDirectorAPI1.preloadSound(
          AudioEnvironment.Cinematic,
          "music",
          shot.music.soundName,
          shot.music.soundSrc,
          shot.music.config
        ).then((result) => {
          if (result) {
            advanceCompletion();
          } else {
            console.error(
              `Cinematic Director: Error cargando la música: ${(shot.music as CinematicMusic).soundSrc}`
            );
            advanceCompletion();
          }
        });
      }
    });
  }, [cinematicData, advanceCompletion]);

  const preloadAmbientSounds = useCallback(() => {
    if (areAmbientSoundsPreloadingRef.current) return;
    areAmbientSoundsPreloadingRef.current = true;

    cinematicData.forEach((shot) => {
      if (shot.ambientSound && typeof shot.ambientSound !== "number") {
        shot.ambientSound.mainAmbientSounds.forEach((mainSound) => {
          SoundDirectorAPI1.preloadSound(
            AudioEnvironment.Cinematic,
            "soundscapes",
            mainSound.name,
            mainSound.src,
            mainSound.config
          ).then((result) => {
            if (result) {
              advanceCompletion();
            } else {
              console.error(
                `Cinematic Director: Error cargando la música: ${(shot.music as CinematicMusic).soundSrc}`
              );
              advanceCompletion();
            }
          });
        });

        if (shot.ambientSound.secondaryAmbientSounds) {
          shot.ambientSound.secondaryAmbientSounds.forEach((secSound) => {
            SoundDirectorAPI1.preloadSound(
              AudioEnvironment.Cinematic,
              "soundscapes",
              secSound.name,
              secSound.src,
              secSound.config
            ).then((result) => {
              if (result) {
                advanceCompletion();
              } else {
                console.error(
                  `Cinematic Director: Error cargando la música: ${(shot.music as CinematicMusic).soundSrc}`
                );
                advanceCompletion();
              }
            });
          });
        }
      }
    });
  }, [cinematicData, advanceCompletion]);

  const preloadVideos = useCallback(() => {
    if (areVideosPreloadingRef.current) return;
    areVideosPreloadingRef.current = true;

    cinematicData.forEach((shot) => {
      const videoData = shot.specialFX?.videoFx;

      if (videoData) {
        videoData.forEach((video) => {
          const preloadedVideo = document.createElement("video");
          preloadedVideo.preload = "auto"; // Indica al navegador que precargue el video
          preloadedVideo.src = video.src;

          //Forzar la carga del video incluso si no está en el DOM
          preloadedVideo.load();

          preloadedVideo.oncanplaythrough = () => {
            advanceCompletion(); // Video listo para reproducirse
          };

          preloadedVideo.onerror = () => {
            console.error(`Error cargando el video: ${video.src}`);
            advanceCompletion();
          };
        });
      }
    });
  }, [advanceCompletion, cinematicData]);

  // Realiza la precarga de imágenes y sonidos antes de que comience la cinemática.
  useEffect(() => {
    preloadVideos();
    preloadImages();
    preloadSounds();
    preloadMusic();
    preloadAmbientSounds();
    //La precarga de fuentes se realiza directamente en el return del componente, generando contenido no visible.

    // Si no hubiera nada que cargar, no se ejecutaría advanceCompletion() en las funciones anteriores, por lo que lo hacemos manualmente.
    if (getTotalItemsToLoad === 0) {
      advanceCompletion();
    }
  }, [
    preloadVideos,
    preloadImages,
    preloadSounds,
    preloadMusic,
    preloadAmbientSounds,
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
        {/* Listamos todas las fuentes, pesos y estilos necesarios. Realmente sólo se usan con peso 400 */}
        <p style={{ fontFamily: "Protest Revolution", fontWeight: 400 }}>
          Preload
        </p>
        <p style={{ fontFamily: "Cabin Condensed", fontWeight: 400 }}>
          Preload
        </p>
      </div>
    </>
  );
}

export default CinematicPreloader;
