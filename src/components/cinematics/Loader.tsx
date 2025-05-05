import { useCallback, useEffect, useMemo, useState } from "react";
import LoadingSpinner from "../common/LoadingSpinner";
import { CinematicSceneAuto } from "./cinematicTypes";
import { SoundDirectorAPI1, SoundStore1 } from "../../classes/sound/singletons";

interface LoaderProps {
  cinematicData: CinematicSceneAuto;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

function Loader({ cinematicData, setIsLoading }: LoaderProps) {
  const [loadingProgress, setLoadingProgress] = useState<number>(0);

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
    cinematicData.forEach((shot) => {
      if (shot.uniqueSounds) {
        shot.uniqueSounds.forEach((uniqueSound) => {
          if (
            !SoundStore1.audioStore[uniqueSound.env][uniqueSound.category][
              uniqueSound.soundName
            ]
          ) {
            SoundDirectorAPI1.preloadSound(
              uniqueSound.env,
              uniqueSound.category,
              uniqueSound.soundName,
              uniqueSound.soundSrc
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

  // Realiza la pregarga de imágenes y sonidos antes de que comience la cinemática.
  useEffect(() => {
    preloadImages();
    preloadSounds();

    // Si no hubiera nada que cargar, no se ejecutaría advanceCompletion() en las funciones anteriores, por lo que lo hacemos manualmente.
    if (getTotalItemsToLoad === 0) {
      advanceCompletion();
    }
  }, [preloadImages, preloadSounds, advanceCompletion, getTotalItemsToLoad]);

  //Si se ha llegado al 100% de carga, se inicia la cinemática.
  useEffect(() => {
    if (loadingProgress >= 100) {
      setIsLoading(false);
    }
  }, [loadingProgress, setIsLoading]);

  return <LoadingSpinner progress={loadingProgress} />;
}

export default Loader;
