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
  SoundStore1,
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
  const generalTimersRef = useRef<number[]>([]);

  const generateUniqueSounds = useCallback(() => {
    if (!cinematicSoundData[actualShotIndex]?.uniqueSounds) return;

    const currentShotSounds = cinematicSoundData[actualShotIndex].uniqueSounds;

    currentShotSounds.forEach((sound) => {
      if (sound.delay > 0) {
        const soundTimer = window.setTimeout(() => {
          if (sound.loop) {
            SoundDirectorAPI1.createLoopWhithFade(
              AudioEnvironment.Cinematic,
              "sounds",
              sound.soundName,
              sound.soundSrc,
              500,
              200
            );
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
        }, sound.delay);
        uniqueSoundsTimersRef.current.push(soundTimer);
      } else {
        if (sound.loop) {
          SoundDirectorAPI1.createLoopWhithFade(
            AudioEnvironment.Cinematic,
            "sounds",
            sound.soundName,
            sound.soundSrc,
            500,
            200,
            sound.config,
            sound.stereo
          );
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
      }
    });
  }, [cinematicSoundData, actualShotIndex]);

  const stopPreviousMusic = useCallback((fadeDuration: number) => {
    //Hay que controlar que sea música que está sonando en este momento. Si lo hacemos a nivel de categoría,
    // nos cargamos también la nueva música precargada para este plano.
    const musicToStop: string[] = [];
    for (const musicEntry in SoundStore1.audioStore.cinematic.music) {
      if (SoundStore1.audioStore.cinematic.music[musicEntry].ids.length > 0) {
        musicToStop.push(musicEntry);
      }
    }

    musicToStop.forEach((item) => {
      if (fadeDuration === 0) {
        SoundDirectorAPI1.stopSound(AudioEnvironment.Cinematic, "music", item);
      } else {
        SoundDirectorAPI1.fadeSound(AudioEnvironment.Cinematic, "music", item, {
          final: 0,
          milliseconds: fadeDuration,
        });
      }
    });
  }, []);

  const generateNewMusic = useCallback((musicData: CinematicMusic) => {
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

      //Aplicamos un fade-in, si el tiempo especificado en initialFadeDuration es > 0.
      if (musicData.initialFadeDuration > 0) {
        //Lo metemos dentro de un timer (aunque tenga retardo = 0) para que dé tiempo a que el sonido se haya iniciado.
        const musicFadeInTimer = window.setTimeout(() => {
          SoundDirectorAPI1.fadeSound(
            AudioEnvironment.Cinematic,
            "music",
            musicData.soundName,
            {
              final: musicData.toVolume ? musicData.toVolume : 1,
              milliseconds: musicData.initialFadeDuration,
            }
          );
        }, 0);

        musicTimersRef.current.push(musicFadeInTimer);
      }
    }, musicData.delay);

    musicTimersRef.current.push(musicStartTimer);

    //Si se ha especificado un tiempo concreto en el que la música debe parar, se aplica:
    if (musicData.endTime) {
      const musicEndTimer = window.setTimeout(() => {
        // Si se ha especificado un tiempo de fade-out se aplica, si no, se para (stop) inmediatamente.
        if (typeof musicData.fadeOutDuration === "number") {
          SoundDirectorAPI1.fadeCategory(AudioEnvironment.Cinematic, "music", {
            final: 0,
            milliseconds: musicData.fadeOutDuration,
          });
        } else {
          SoundDirectorAPI1.stopCategorySounds(
            AudioEnvironment.Cinematic,
            "music"
          );
        }
      }, musicData.endTime + musicData.delay);

      musicTimersRef.current.push(musicEndTimer);
    }
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
        stopPreviousMusic(actualShotSoundData.music.prevMusicFadeDuration);
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
    const defaultFadeOutDuration = 2000;
    const fadeDuration =
      typeof lastShotSoundFadeDuration === "number"
        ? lastShotSoundFadeDuration
        : defaultFadeOutDuration;
    const securityMargin = 200;
    const momentToAplly: number =
      lastShotDuration - (fadeDuration + securityMargin);

    const fadeOutSoundsTimer = window.setTimeout(() => {
      //Eliminamos los timers de los unique sounds, ya que si están en un loop con fade, aunque hagamos fade de una reproducción, pueden ya tener programada otra.
      const soundsToCheck: string[] = Object.keys(
        SoundStore1.audioStore.cinematic.sounds
      );
      soundsToCheck.forEach((sound) => {
        const soundPausableIntervals =
          SoundStore1.audioStore.cinematic.sounds[sound].pausableIntervalsIds;
        if (soundPausableIntervals.length > 0) {
          soundPausableIntervals.forEach((pausableInterval) => {
            pausableInterval.clear();
          });
        }
      });

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

    //Por último aplicamos un stop para todo el entorno cinematics, para limpiar cualquier posible sonido que permanezca guardado.
    const endCinematicStopSoundTimer = window.setTimeout(() => {
      SoundDirectorAPI1.stopEnvSounds(AudioEnvironment.Cinematic);
    }, momentToAplly + fadeDuration);

    generalTimersRef.current.push(endCinematicStopSoundTimer);

    return () => {
      window.clearTimeout(fadeOutSoundsTimer);
      window.clearTimeout(endCinematicStopSoundTimer);
    };
  }, [lastShotDuration, lastShotSoundFadeDuration]);

  // Elimina todos los timers pendientes al desmontar el componente.
  useEffect(() => {
    const uniqueSoundsTimersToClear = uniqueSoundsTimersRef.current;
    const musicTimersToClear = musicTimersRef.current;
    const ambientTimersToClear = ambientSoundsTimersRef.current;
    const generalTimersToClear = generalTimersRef.current;

    return () => {
      uniqueSoundsTimersToClear.forEach((timer) => {
        window.clearTimeout(timer);
      });

      musicTimersToClear.forEach((timer) => {
        window.clearTimeout(timer);
      });

      ambientTimersToClear.forEach((timer) => {
        window.clearTimeout(timer);
      });

      generalTimersToClear.forEach((timer) => {
        window.clearTimeout(timer);
      });
    };
  }, []);

  return <GhostDiv id="CinematicSoundManager"></GhostDiv>;
}

export default CinematicSoundManager;
