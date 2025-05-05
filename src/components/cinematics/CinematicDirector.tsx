import { useEffect, useRef, useState } from "react";
import ScreenDarkener from "../common/ScreenDarkener";
import MainViewer from "./styled/MainViewer";
import {
  CinematicSceneAuto,
  CinematicSoundManagerData,
  MainViewerActualShotData,
  MainViewerNextShotData,
  ShotTransitionType,
} from "./cinematicTypes";
import Loader from "./Loader";
import CinematicSoundManager from "./CinematicSoundManager";

interface CinematicDirectorProps {
  cinematicData: CinematicSceneAuto;
}

function CinematicDirector({ cinematicData }: CinematicDirectorProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [actualShotIndex, setActualShotIndex] = useState<number>(0);

  const cinematicDataRef = useRef<CinematicSceneAuto>(cinematicData); // Hacemos una copia para evitar modificar la prop original (rompemos la inmutabilidad del componente => malas prácticas).
  const shotDurationTimersRef = useRef<number[]>([]); // Los timers de cada plano, para poder limpiarlos desde useEffect.
  const isSpecialActionsExecutedRef = useRef<boolean>(false);

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

  // Datos a pasar al componente CinematicSoundManager.
  const cinematicSoundData: CinematicSoundManagerData = [];
  cinematicData.forEach((shot) => {
    cinematicSoundData.push({
      ambientSound: shot.ambientSound || null,
      uniqueSounds: shot.uniqueSounds || null,
      music: shot.music || null,
    });
  });

  //////////////////////////////////////////////////////////////     MÉTODOS    ///////////////////////////////////////////////////////

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

  // Establece la duración del plano actual mediante un setTimeout y gestiona el cambio al plano siguiente.
  useEffect(() => {
    if (isLoading) return; // Si aún estamos cargando, no hacemos nada.

    if (actualShotIndex <= cinematicData.length - 1) {
      const shotDurationTimer = window.setTimeout(() => {
        isSpecialActionsExecutedRef.current = false;
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

  // Ejecuta el método specialActions del plano actual, si existe y no se ha ejecutado ya.
  useEffect(() => {
    if (isLoading) return;
    if (isSpecialActionsExecutedRef.current) return;
    if (currentShot.specialActions) {
      currentShot.specialActions();
      isSpecialActionsExecutedRef.current = true;
    }
  }, [currentShot, isLoading]);

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
        <Loader cinematicData={cinematicData} setIsLoading={setIsLoading} />
      ) : (
        generateCinematicShot()
      )}
      <CinematicSoundManager
        cinematicSoundData={cinematicSoundData}
        actualShotIndex={actualShotIndex}
        isLoading={isLoading}
        lastShotDuration={currentShot.onEnd ? currentShotDuration : null}
        lastShotSoundFadeDuration={
          currentShot.onEndAudioFadeDuration
            ? currentShot.onEndAudioFadeDuration
            : null
        }
      />
    </ScreenDarkener>
  );
}

export default CinematicDirector;
