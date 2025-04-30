import { useCallback, useEffect, useRef, useState } from "react";
import LoadingSpinner from "../common/LoadingSpinner";
import ScreenDarkener from "../common/ScreenDarkener";
import MainViewer from "./styled/MainViewer";
import { CinematicSceneAuto, ShotTransitionType } from "./cinematicTypes";

interface CinematicDirectorProps {
  cinematicData: CinematicSceneAuto;
}

function CinematicDirector({ cinematicData }: CinematicDirectorProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [actualShotIndex, setActualShotIndex] = useState<number>(0);

  const cinematicDataRef = useRef<CinematicSceneAuto>(cinematicData); // Hacemos una copia para evitar modificar la prop original (rompemos la inmutabilidad del componente => malas prácticas).
  const shotDurationTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]); // Los timers de cada plano, para poder limpiarlos desde useEffect.

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
  const currentShotDuration = currentShot.shotDuration || 4000; // Si no se ha definido, por defecto 5 segundos.
  const currentShotTransition: ShotTransitionType =
    currentShot.shotTransition || "cut";
  const fadeTransition = currentShot.fadeTransition || 2000;

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

  function generateCinematicShot() {
    if (actualShotIndex <= cinematicDataRef.current.length - 1) {
      return (
        <MainViewer
          mainPicture={currentShot?.mainImageUrl}
          mainPictureAlt={currentShot?.mainImageAlt}
          wideMainPicture={currentShot.widePicture}
          mainColor={currentShot?.backgroundColor}
          nextPicture={nextShot?.mainImageUrl}
          nextPictureAlt={nextShot?.mainImageAlt}
          wideNextPicture={nextShot.widePicture}
          nextColor={nextShot?.backgroundColor}
        />
      );
    } else {
      return (
        <MainViewer
          mainPicture={lastShot?.mainImageUrl}
          mainPictureAlt={lastShot?.mainImageAlt}
          wideMainPicture={lastShot.widePicture}
          mainColor={lastShot?.backgroundColor}
          nextPicture={lastShot?.mainImageUrl}
          nextPictureAlt={lastShot?.mainImageAlt}
          wideNextPicture={lastShot.widePicture}
          nextColor={lastShot?.backgroundColor}
        />
      );
    }
  }

  useEffect(() => {
    if (isLoading) {
      preloadImages();
    }
  }, [isLoading, preloadImages]);

  useEffect(() => {
    if (isLoading) return; // Si aún estamos cargando, no hacemos nada.

    if (actualShotIndex <= cinematicData.length - 1) {
      const shotDurationTimer = setTimeout(
        () => {
          setActualShotIndex((prevIndex) => prevIndex + 1); // Cambiamos al siguiente plano
        },
        currentShotTransition === "cut"
          ? currentShotDuration
          : currentShotDuration + fadeTransition
      );

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
    fadeTransition,
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
    <ScreenDarkener color="dark">
      {isLoading ? (
        <LoadingSpinner progress={loadingProgress} />
      ) : (
        generateCinematicShot()
      )}
    </ScreenDarkener>
  );
}

export default CinematicDirector;
