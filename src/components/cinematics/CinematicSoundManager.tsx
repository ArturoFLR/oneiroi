import styled from "styled-components";
import { CinematicMusic, CinematicSoundManagerData } from "./cinematicTypes";
import { useCallback, useEffect, useRef } from "react";
import { SoundDirectorAPI1 } from "../../classes/sound/singletons";
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
    const defaultOldMusicFadeDuration = 1000;
    const defaultNewMusicFadeOutDuration = 3500;
    const newMusicFadeOutDuration = musicData?.fadeOutDuration
      ? musicData.fadeOutDuration
      : defaultNewMusicFadeOutDuration;
    const newMusicDelay = musicData.delay;

    // Hacemos fade out de la música de planos anteriores, si la hay.
    SoundDirectorAPI1.fadeCategory(AudioEnvironment.Cinematic, "music", {
      final: 0,
      milliseconds: defaultOldMusicFadeDuration,
    });

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
  }, [
    isLoading,
    generateUniqueSounds,
    cinematicSoundData,
    actualShotIndex,
    stopPreviousMusic,
    generateNewMusic,
  ]);

  //Si este es el último plano de la cinemática, aplicamos un fade-out a sonidos y música antes de que termine el plano => evitamos que la cinemática termine y sigan sonando.
  useEffect(() => {
    if (!lastShotDuration) return;

    const fadeDuration = lastShotSoundFadeDuration
      ? lastShotSoundFadeDuration
      : 3500;
    const securityMargin = 100;
    const momentToAplly: number =
      lastShotDuration - (fadeDuration + securityMargin);

    const fadeOutSoundsTimer = window.setTimeout(() => {
      SoundDirectorAPI1.fadeEnv(AudioEnvironment.Cinematic, {
        final: 0,
        milliseconds: fadeDuration,
      });
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
