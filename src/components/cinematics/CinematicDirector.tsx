import { useCallback, useEffect, useRef, useState } from "react";
import LoadingSpinner from "../common/LoadingSpinner";
import ScreenDarkener from "../common/ScreenDarkener";
import MainViewer from "./styled/MainViewer";
import {
  CinematicSceneAuto,
  MainViewerActualShotData,
  MainViewerNextShotData,
  ShotTransitionType,
} from "./cinematicTypes";

interface CinematicDirectorProps {
  cinematicData: CinematicSceneAuto;
}

function CinematicDirector({ cinematicData }: CinematicDirectorProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [actualShotIndex, setActualShotIndex] = useState<number>(0);

  const cinematicDataRef = useRef<CinematicSceneAuto>(cinematicData); // Hacemos una copia para evitar modificar la prop original (rompemos la inmutabilidad del componente => malas prácticas).
  const shotDurationTimersRef = useRef<number[]>([]); // Los timers de cada plano, para poder limpiarlos desde useEffect.

  const lastShot =
    cinematicDataRef.current[cinematicDataRef.current.length - 1];

  const currentShot =
    actualShotIndex <= cinematicDataRef.current.length - 1
      ? cinematicDataRef.current[actualShotIndex]
      : lastShot;

  const nextShot =
    actualShotIndex < cinematicDataRef.current.length - 1
      ? cinematicDataRef.current[actualShotIndex + 1]
      : lastShot;

  // Valores por defecto para el plano actual.
  const currentShotDuration = currentShot.shotDuration || 5000; // Si no se ha definido, por defecto 5 segundos.
  const currentShotTransition: ShotTransitionType =
    currentShot.shotTransition || "cut";
  const fadeTransitionDuration = currentShot.fadeDuration || 2000;

  // Calcula el número total de items a cargar, entre imágenes y sonidos.

  const preloadImages = useCallback(() => {
    let completionPercentage = 0;
    const totalImages = cinematicDataRef.current.length;

    cinematicDataRef.current.forEach((shot) => {
      const advanceCompletion = () => {
        completionPercentage += 100 / totalImages;
        setLoadingProgress(completionPercentage);
        if (completionPercentage >= 100) {
          setIsLoading(false);
        }
      };

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
      } else {
        advanceCompletion();
      }
    });
  }, []);

  function preloadSounds() {
    cinematicData.forEach((shot) => {
      if (shot.ambientSound && shot.ambientSound.secondaryAmbientSounds) {
        shot.ambientSound.secondaryAmbientSounds.forEach((secSound) => {});
      }
    });
  }

  function generateCinematicShot() {
    const mainViewerActualShot: MainViewerActualShotData = {
      id: currentShot.id,
      mainImageUrl: currentShot.mainImageUrl,
      mainImageAlt: currentShot.mainImageAlt,
      backgroundColor: currentShot.backgroundColor,
      widePicture: currentShot.widePicture,
      shotDuration: currentShotDuration,
      shotTransition: currentShotTransition,
      fadeDuration: fadeTransitionDuration,
      zoom: currentShot.zoom,
    };

    let mainViewerNextShot: MainViewerNextShotData | null = {
      id: nextShot.id,
      mainImageUrl: nextShot.mainImageUrl,
      mainImageAlt: nextShot.mainImageAlt,
      backgroundColor: nextShot.backgroundColor,
      widePicture: nextShot.widePicture,
      zoom: nextShot.zoom,
    };

    if (actualShotIndex >= cinematicDataRef.current.length - 1) {
      mainViewerNextShot = null;
    }

    return (
      <MainViewer
        actualShot={mainViewerActualShot}
        nextShot={mainViewerNextShot}
      />
    );
  }

  // Realiza la pregarga de imágenes y sonidos antes de que comience la cinemática.
  useEffect(() => {
    if (isLoading) {
      preloadImages();
    }
  }, [isLoading, preloadImages]);

  // Establece la duración del plano actual mediante un setTimeout y gestiona el cambio al plano siguiente.
  useEffect(() => {
    if (isLoading) return; // Si aún estamos cargando, no hacemos nada.

    if (actualShotIndex <= cinematicData.length - 1) {
      const shotDurationTimer = window.setTimeout(() => {
        setActualShotIndex((prevIndex) => prevIndex + 1); // Cambiamos al siguiente plano
      }, currentShotDuration);

      shotDurationTimersRef.current.push(shotDurationTimer);
    } else {
      // Si ya se ha reproducido el último plano, ejecutamos el método onEnd del último plano.
      if (lastShot.onEnd) {
        lastShot.onEnd();
      } else {
        console.error(
          "Cinematic Director: No existe método onEnd en el último plano de la cinemática."
        );
      }
    }
    const timersToClear = [...shotDurationTimersRef.current];

    return () => {
      timersToClear.forEach((timer) => clearTimeout(timer));
    };
  }, [
    actualShotIndex,
    isLoading,
    currentShotTransition,
    currentShotDuration,
    fadeTransitionDuration,
    cinematicData.length,
    lastShot,
  ]);

  // Se encarga de limpiar todos los timers que puedan quedar pendientes al desmontar el componente.
  useEffect(() => {
    const timersToClear = [...shotDurationTimersRef.current];
    return () => {
      timersToClear.forEach((timer) => clearTimeout(timer)); // Limpiamos todos los timers al desmontar el componente.
    };
  }, []);

  return (
    <ScreenDarkener color="black">
      {isLoading ? (
        <LoadingSpinner progress={loadingProgress} />
      ) : (
        generateCinematicShot()
      )}
    </ScreenDarkener>
  );
}

export default CinematicDirector;
