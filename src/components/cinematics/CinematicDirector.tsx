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
import CinematicSoundManager from "./CinematicSoundManager";
import CinematicPreloader from "./CinematicPreloader";

interface CinematicDirectorProps {
  cinematicData: CinematicSceneAuto;
  mode: "light" | "dark" | "black";
}

function CinematicDirector({ cinematicData, mode }: CinematicDirectorProps) {
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
  const defaultShotsDuration = 5000;
  const defaultFadeDuration = 2000;
  const currentShotDuration = currentShot.shotDuration || defaultShotsDuration; // Si no se ha definido, por defecto 5 segundos.
  const nextShotDuration = nextShot.shotDuration || defaultShotsDuration;
  const currentShotTransition: ShotTransitionType =
    currentShot.shotTransition || "cut";
  const fadeTransitionDuration =
    currentShot.fadeDuration || defaultFadeDuration;
  const currentShotFX = currentShot.specialFX ? currentShot.specialFX : null;
  const nextShotFX = nextShot.specialFX ? nextShot.specialFX : null;

  // Datos a pasar al componente CinematicSoundManager.
  const cinematicSoundData: CinematicSoundManagerData = [];
  cinematicData.forEach((shot) => {
    cinematicSoundData.push({
      ambientSound: shot.ambientSound
        ? shot.ambientSound
        : shot.ambientSound === 0
          ? shot.ambientSound
          : null, //"0" es un valor válido en ms, no falsy
      uniqueSounds: shot.uniqueSounds || null,
      music: shot.music ? shot.music : shot.music === 0 ? shot.music : null, //"0" es un valor válido en milisegundos, no falsy
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
      specialFX: currentShotFX,
    };

    let mainViewerNextShot: MainViewerNextShotData | null = {
      id: nextShot.id,
      mainImageUrl: nextShot.mainImageUrl,
      mainImageAlt: nextShot.mainImageAlt,
      backgroundColor: nextShot.backgroundColor,
      widePicture: nextShot.widePicture,
      shotDuration: nextShotDuration,
      zoom: nextShot.zoom,
      specialFX: nextShotFX,
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

    return () => {
      if (currentShot.specialActionsTimeouts) {
        currentShot.specialActionsTimeouts.forEach((timer) => {
          window.clearTimeout(timer);
        });
      }

      if (currentShot.specialActionsIntervals) {
        currentShot.specialActionsIntervals.forEach((timer) => {
          window.clearInterval(timer);
        });
      }
    };
  }, [currentShot, isLoading]);

  // Se encarga de limpiar todos los timers que puedan quedar pendientes al desmontar el componente.
  useEffect(() => {
    const timersToClear = [...shotDurationTimersRef.current];
    return () => {
      timersToClear.forEach((timer) => clearTimeout(timer)); // Limpiamos todos los timers al desmontar el componente.
    };
  }, []);

  return (
    <ScreenDarkener color={mode}>
      {isLoading ? (
        <CinematicPreloader
          cinematicData={cinematicData}
          setIsLoading={setIsLoading}
        />
      ) : (
        generateCinematicShot()
      )}
      <CinematicSoundManager
        cinematicSoundData={cinematicSoundData}
        actualShotIndex={actualShotIndex}
        isLoading={isLoading}
        lastShotDuration={currentShot.onEnd ? currentShotDuration : null}
        lastShotSoundFadeDuration={
          typeof currentShot.onEndAudioFadeDuration === "number"
            ? currentShot.onEndAudioFadeDuration
            : null
        }
      />
    </ScreenDarkener>
  );
}

export default CinematicDirector;
