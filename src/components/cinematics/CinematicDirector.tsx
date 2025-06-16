import { useEffect, useRef, useState } from "react";
import ScreenDarkener from "../common/ScreenDarkener";
import MainViewer from "./styled/MainViewer";
import {
  CinematicScene,
  CinematicSoundManagerData,
  MainViewerActualShotData,
  MainViewerNextShotData,
  ShotTransitionType,
} from "./cinematicTypes";
import CinematicSoundManager from "./CinematicSoundManager";
import CinematicPreloader from "./CinematicPreloader";
import { SoundDirectorAPI1 } from "../../classes/sound/singletons";
import AnimatedCircleButton from "../buttons/AnimatedCircleButton";

interface CinematicDirectorProps {
  cinematicData: CinematicScene;
  mode: "light" | "dark" | "black";
}

function CinematicDirector({ cinematicData, mode }: CinematicDirectorProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [actualShotIndex, setActualShotIndex] = useState<number>(0);

  const cinematicDataRef = useRef<CinematicScene>(cinematicData); // Hacemos una copia para evitar modificar la prop original (rompemos la inmutabilidad del componente => malas prácticas).
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

  // Función que se encarga de cambiar de plano manualmente cuando se pulsa
  // el botón "Siguiente" en una cinemática manual.
  function handleNextShotClick() {
    isSpecialActionsExecutedRef.current = false;
    setActualShotIndex((prevIndex) => prevIndex + 1);
  }

  function generateCinematicShot() {
    const mainViewerActualShot: MainViewerActualShotData = {
      id: currentShot.id,
      isManual: currentShot.isManual ? true : false,
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
        onNextShotClick={handleNextShotClick}
        actualShot={mainViewerActualShot}
        nextShot={mainViewerNextShot}
      />
    );
  }

  //Se ejecuta si el usuario decide saltarse la cinemática.
  function skipCinematic() {
    // Limpiamos todos los timers.
    shotDurationTimersRef.current.forEach((timer) => {
      clearTimeout(timer);
    });

    //Paramos todos los sonidos del entorno.
    SoundDirectorAPI1.stopAllSounds();

    if (lastShot.onEnd) {
      lastShot.onEnd(); // Ejecutamos el método onEnd del último plano.
    }
  }

  // Establece la duración del plano actual mediante un setTimeout y gestiona el cambio al plano siguiente.
  useEffect(() => {
    if (isLoading) return; // Si aún estamos cargando, no hacemos nada.

    if (actualShotIndex <= cinematicData.length - 1 && !currentShot.isManual) {
      const shotDurationTimer = window.setTimeout(() => {
        isSpecialActionsExecutedRef.current = false; // EL siguiente useEffect se encargará de pasar este flag a "true" cuando las ejecute.
        setActualShotIndex((prevIndex) => prevIndex + 1); // Cambiamos al siguiente plano
      }, currentShotDuration);

      shotDurationTimersRef.current.push(shotDurationTimer);
    } else if (actualShotIndex > cinematicData.length - 1) {
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
    currentShot.isManual,
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
      <AnimatedCircleButton onClick={skipCinematic}>
        Saltar
      </AnimatedCircleButton>

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
