import styled from "styled-components";
import { CinematicSoundManagerData } from "./cinematicTypes";
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

  const generateUniqueSounds = useCallback(() => {
    if (!cinematicSoundData[actualShotIndex]?.uniqueSounds) return;

    const currentShotSounds = cinematicSoundData[actualShotIndex].uniqueSounds;

    currentShotSounds.forEach((sound) => {
      if (sound.delay > 0) {
        const soundTimer = window.setTimeout(() => {
          SoundDirectorAPI1.playSound(
            sound.env,
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
          sound.env,
          sound.category,
          sound.soundName,
          sound.soundSrc,
          sound.config,
          sound.stereo
        );
      }
    });
  }, [cinematicSoundData, actualShotIndex]);

  useEffect(() => {
    if (isLoading) return;
    generateUniqueSounds();
  }, [isLoading, generateUniqueSounds]);

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

    return () => {
      uniqueSoundsTimersToClear.forEach((timer) => {
        window.clearTimeout(timer);
      });
    };
  }, []);

  return <GhostDiv id="CinematicSoundManager"></GhostDiv>;
}

export default CinematicSoundManager;
