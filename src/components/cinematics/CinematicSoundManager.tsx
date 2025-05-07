import styled from "styled-components";
import {
  CinematicAmbientSound,
  CinematicMusic,
  CinematicSoundManagerData,
} from "./cinematicTypes";
import { useCallback, useEffect, useRef } from "react";
import {
  SoundDirectorAPI1,
  SoundscapesCreator1,
} from "../../classes/sound/singletons";
import { AudioEnvironment } from "../../classes/sound/soundTypes";

const GhostDiv = styled.div`
  display: none;
`;

interface CinematicSoundManagerProps {
  cinematicSoundData: CinematicSoundManagerData;
  actualShotIndex: number;
  isLoading: boolean;
  lastShotDuration: number | null;
  lastShotSoundFadeDuration: number | null;
}

function CinematicSoundManager({
  cinematicSoundData,
  actualShotIndex,
  isLoading,
  lastShotDuration,
  lastShotSoundFadeDuration,
}: CinematicSoundManagerProps) {
  const uniqueSoundsTimersRef = useRef<number[]>([]);
  const musicTimersRef = useRef<number[]>([]);
  const ambientSoundsTimersRef = useRef<number[]>([]);

  const generateUniqueSounds = useCallback(() => {
    if (!cinematicSoundData[actualShotIndex]?.uniqueSounds) return;

    const currentShotSounds = cinematicSoundData[actualShotIndex].uniqueSounds;

    currentShotSounds.forEach((sound) => {
      if (sound.delay > 0) {
        const soundTimer = window.setTimeout(() => {
          SoundDirectorAPI1.playSound(
            AudioEnvironment.Cinematic,
            sound.category,
            sound.soundName,
            sound.soundSrc,
            sound.config,
            sound.stereo
          );
        }, sound.delay);
        uniqueSoundsTimersRef.current.push(soundTimer);
      } else {
        SoundDirectorAPI1.playSound(
          AudioEnvironment.Cinematic,
          sound.category,
          sound.soundName,
          sound.soundSrc,
          sound.config,
          sound.stereo
        );
      }
    });
  }, [cinematicSoundData, actualShotIndex]);

  const stopPreviousMusic = useCallback((fadeDuration: number) => {
    if (fadeDuration > 0) {
      SoundDirectorAPI1.fadeCategory(AudioEnvironment.Cinematic, "music", {
        final: 0,
        milliseconds: fadeDuration,
      });
    } else {
      SoundDirectorAPI1.stopCategorySounds(AudioEnvironment.Cinematic, "music");
    }
  }, []);

  const generateNewMusic = useCallback((musicData: CinematicMusic) => {
    const defaultNewMusicFadeOutDuration = 3500;
    const newMusicFadeOutDuration = musicData?.fadeOutDuration
      ? musicData.fadeOutDuration
      : defaultNewMusicFadeOutDuration;
    const newMusicDelay = musicData.delay;

    //Reproducimos la nueva música, con el delay indicado por el usuario.
    const musicStartTimer = window.setTimeout(() => {
      //Aplicamos loop si se especifica
      if (musicData.loop) {
        SoundDirectorAPI1.createLoopWhithFade(
          AudioEnvironment.Cinematic,
          "music",
          musicData.soundName,
          musicData.soundSrc,
          2500,
          1000,
          musicData.config,
          musicData.stereo
        );
      } else {
        SoundDirectorAPI1.playSound(
          AudioEnvironment.Cinematic,
          "music",
          musicData.soundName,
          musicData.soundSrc,
          musicData.config,
          musicData.stereo
        );
      }
    }, newMusicDelay);

    //Si se ha especificado un tiempo concreto en el que la música debe parar, se aplica:
    if (musicData.endTime) {
      const musicEndTimer = window.setTimeout(() => {
        SoundDirectorAPI1.fadeCategory(AudioEnvironment.Cinematic, "music", {
          final: 0,
          milliseconds: newMusicFadeOutDuration,
        });
      }, musicData.endTime);

      musicTimersRef.current.push(musicEndTimer);
    }

    musicTimersRef.current.push(musicStartTimer);
  }, []);

  const stopPreviousAmbientSnd = useCallback(
    (fadeDuration: number, soundscapeName: string) => {
      if (fadeDuration > 0) {
        SoundDirectorAPI1.fadeSoundscape(
          AudioEnvironment.Cinematic,
          fadeDuration,
          0,
          undefined,
          soundscapeName
        );
      } else {
        SoundDirectorAPI1.stopSoundscape(
          AudioEnvironment.Cinematic,
          soundscapeName
        );
      }
    },
    []
  );

  const generateAmbientSound = useCallback(
    (ambientSoundData: CinematicAmbientSound) => {
      const newAmbientSoundTimer = window.setTimeout(() => {
        SoundDirectorAPI1.createSoundscape(
          AudioEnvironment.Cinematic,
          ambientSoundData.soundscapeName,
          ambientSoundData.mainAmbientSounds,
          ambientSoundData.secondaryAmbientSounds
        );

        window.setTimeout(() => {
          const defaultAmbientVolume = 1;

          //Si se ha indicado un fade-in, lo aplicamos. Usamos timer porque si no esto se ejecuta antes de que se haya creado y registrado el soundscape (paso anterior)
          if (ambientSoundData.initialFadeDuration > 0) {
            SoundDirectorAPI1.fadeSoundscape(
              AudioEnvironment.Cinematic,
              ambientSoundData.initialFadeDuration,
              ambientSoundData.toVolume
                ? ambientSoundData.toVolume
                : defaultAmbientVolume,
              0,
              ambientSoundData.soundscapeName
            );
          }
        }, 0);
      }, ambientSoundData.delay);

      ambientSoundsTimersRef.current.push(newAmbientSoundTimer);

      //Si se ha indicado un tiempo determinado para terminar el soundscape, lo aplicamos
      if (typeof ambientSoundData.endTime === "number") {
        const stopNewAmbientSoundTimer = window.setTimeout(() => {
          //Si se ha indicado un tiempo de fade-out, lo aplicamos
          if (typeof ambientSoundData.fadeOutDuration === "number") {
            SoundDirectorAPI1.fadeSoundscape(
              AudioEnvironment.Cinematic,
              ambientSoundData.fadeOutDuration,
              0,
              undefined,
              ambientSoundData.soundscapeName
            );
          } else {
            //Si no se indicó un tiempo de fade-out, lo paramos directamente:
            SoundDirectorAPI1.stopSoundscape(
              AudioEnvironment.Cinematic,
              ambientSoundData.soundscapeName
            );
          }
        }, ambientSoundData.endTime + ambientSoundData.delay);

        ambientSoundsTimersRef.current.push(stopNewAmbientSoundTimer);
      }
    },
    []
  );

  // Genera sonidos únicos y música
  useEffect(() => {
    if (isLoading) return;

    const actualShotSoundData = cinematicSoundData[actualShotIndex];

    //Sonidos únicos
    generateUniqueSounds();

    //Música
    if (actualShotSoundData?.music) {
      if (typeof actualShotSoundData.music === "number") {
        stopPreviousMusic(actualShotSoundData.music);
      } else {
        generateNewMusic(actualShotSoundData.music);
      }
    }

    // Sonido Ambiente (soundscape)
    const previousSoundscapes = Object.keys(
      SoundscapesCreator1.soundscapesLibrary.cinematic
    );

    if (actualShotSoundData?.ambientSound) {
      //Paramos los sonidos ambientes anteriores
      previousSoundscapes.forEach((soundscapeName) => {
        stopPreviousAmbientSnd(
          typeof actualShotSoundData.ambientSound === "number"
            ? actualShotSoundData.ambientSound
            : (actualShotSoundData.ambientSound as CinematicAmbientSound)
                .prevAmbientFadeDuration,
          soundscapeName
        );
      });

      //Generamos los nuevos sonidos ambiente, si los hay:
      if (typeof actualShotSoundData.ambientSound !== "number") {
        generateAmbientSound(actualShotSoundData.ambientSound);
      }
    }
  }, [
    isLoading,
    generateUniqueSounds,
    cinematicSoundData,
    actualShotIndex,
    stopPreviousMusic,
    generateNewMusic,
    stopPreviousAmbientSnd,
    generateAmbientSound,
  ]);

  //Si este es el último plano de la cinemática, aplicamos un fade-out a sonidos y música antes de que termine el plano => evitamos que la cinemática termine y sigan sonando.
  useEffect(() => {
    if (!lastShotDuration) return;

    const defaultFadeOutDuration = 3500;
    const fadeDuration = lastShotSoundFadeDuration
      ? lastShotSoundFadeDuration
      : defaultFadeOutDuration;
    const securityMargin = 200;
    const momentToAplly: number =
      lastShotDuration - (fadeDuration + securityMargin);

    const fadeOutSoundsTimer = window.setTimeout(() => {
      //Fade para unique sounds:
      SoundDirectorAPI1.fadeCategory(AudioEnvironment.Cinematic, "sounds", {
        final: 0,
        milliseconds: fadeDuration,
      });

      //Fade para la música:
      SoundDirectorAPI1.fadeCategory(AudioEnvironment.Cinematic, "music", {
        final: 0,
        milliseconds: fadeDuration,
      });

      //Fade para soundscape sounds
      SoundDirectorAPI1.fadeSoundscape(
        AudioEnvironment.Cinematic,
        fadeDuration,
        0
      );
    }, momentToAplly);

    return () => {
      window.clearTimeout(fadeOutSoundsTimer);
    };
  }, [lastShotDuration, lastShotSoundFadeDuration]);

  // Elimina todos los timers pendientes al desmontar el componente.
  useEffect(() => {
    const uniqueSoundsTimersToClear = uniqueSoundsTimersRef.current;
    const musicTimersToClear = musicTimersRef.current;

    return () => {
      uniqueSoundsTimersToClear.forEach((timer) => {
        window.clearTimeout(timer);
      });

      musicTimersToClear.forEach((timer) => {
        window.clearTimeout(timer);
      });
    };
  }, []);

  return <GhostDiv id="CinematicSoundManager"></GhostDiv>;
}

export default CinematicSoundManager;
