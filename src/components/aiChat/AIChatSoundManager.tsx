import styled from "styled-components";
import { AIChatSoundData, ChatPhase } from "./aiChatTypes";
import { useCallback, useEffect, useRef } from "react";
import { SoundDirectorAPI1, SoundStore1 } from "../../classes/sound/singletons";
import { AudioEnvironment } from "../../classes/sound/soundTypes";

const GhostDiv = styled.div`
  display: none;
`;

// Si el método "getAmbientSound()" de la clase NPC devuelve el nombre de un sonido ambiente creado en data/aiChatAmbientSounds, se reproducirá este sonido ambiente. Si devuelve "null", símplemente se seguirán reproduciendo los sonidos que estén sonando en ese momento. Esto hace que podamos aprovechas los soundscapes ya creados para el mapa, si no queremos crear uno específico para la conversación.

interface AIChatSoundManagerProps {
  chatPhase: ChatPhase;
  setChatPhase: React.Dispatch<React.SetStateAction<ChatPhase>>;
  soundData: null | AIChatSoundData;
  fadeOutDurationMs: number; // Cuánto dura el fundido a negro cuando se acaba una conversación y, por tanto, cuánto debe durar el fade-out del sonido.
}

function AIChatSoundManager({
  chatPhase,
  setChatPhase,
  soundData,
  fadeOutDurationMs,
}: AIChatSoundManagerProps) {
  const isUserFirstInteraction = useRef<boolean>(true); // Flag que se usa para no inicializar el audio cada vez que llega el turno del usuario.
  const fadeOutTimer = useRef<number>(0);

  // Si tenemos nuevo sonido ambiente y nueva música, paramos todos los sonidos actuales. Si sólo hay nueva música, sólo paramos la música actual, no los sonidos ambiente. Si sólo hay nuevos sonidos ambiente, sólo paramos los sonidos ambiente actuales y dejamos que siga sonando la música actual.
  const stopPreviousSounds = useCallback(() => {
    if (soundData?.ambientSound && soundData.music) {
      SoundDirectorAPI1.stopAllSounds();
    } else if (soundData?.ambientSound) {
      const audioEnvironments = Object.keys(SoundStore1.audioStore);

      audioEnvironments.forEach((environment) => {
        if (environment !== AudioEnvironment.InterfacePreloaded) {
          SoundDirectorAPI1.stopCategorySounds(
            environment as AudioEnvironment,
            "sounds"
          );
          SoundDirectorAPI1.stopCategorySounds(
            environment as AudioEnvironment,
            "soundscapes"
          );
        }
      });
    } else if (soundData?.music) {
      const audioEnvironments = Object.keys(SoundStore1.audioStore);

      audioEnvironments.forEach((environment) => {
        if (environment !== AudioEnvironment.InterfacePreloaded) {
          SoundDirectorAPI1.stopCategorySounds(
            environment as AudioEnvironment,
            "music"
          );
        }
      });
    }
  }, [soundData]);

  const playAmbientSounds = useCallback(() => {
    if (soundData?.ambientSound) {
      const ambientSoundData = soundData.ambientSound;
      const defaultAmbientVolume = 1;

      SoundDirectorAPI1.createSoundscape(
        AudioEnvironment.AIChat,
        ambientSoundData.soundscapeName,
        ambientSoundData.mainAmbientSounds,
        ambientSoundData.secondaryAmbientSounds
      );

      //Si se ha indicado un fade-in, lo aplicamos. Usamos timer porque si no esto se ejecuta antes de que se haya creado y registrado el soundscape (paso anterior).
      window.setTimeout(() => {
        SoundDirectorAPI1.fadeSoundscape(
          AudioEnvironment.AIChat,
          2000,
          ambientSoundData.toVolume
            ? ambientSoundData.toVolume
            : defaultAmbientVolume,
          0
        );
      }, 0);
    }
  }, [soundData]);

  const playMusic = useCallback(() => {
    if (soundData?.music) {
      const musicData = soundData.music;
      const defaultAmbientVolume = 1;

      //Aplicamos loop si se especifica
      if (musicData.loop) {
        SoundDirectorAPI1.createLoopWhithFade(
          AudioEnvironment.AIChat,
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
          AudioEnvironment.AIChat,
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
        window.setTimeout(() => {
          SoundDirectorAPI1.fadeSound(
            AudioEnvironment.AIChat,
            "music",
            musicData.soundName,
            {
              final: musicData.toVolume
                ? musicData.toVolume
                : defaultAmbientVolume,
              milliseconds: musicData.initialFadeDuration,
            }
          );
        }, 0);
      }
    }
  }, [soundData]);

  const fadeOutAllSounds = useCallback(() => {
    //Eliminamos los timers de los unique sounds (creados directamente por los NPC cuando analizan la respuesta de la IA, no por este componente), ya que si están en un loop con fade, aunque hagamos fade de una reproducción, pueden ya tener programada otra.
    const soundsToCheck: string[] = Object.keys(
      SoundStore1.audioStore.aiChat.sounds
    );
    soundsToCheck.forEach((sound) => {
      const soundPausableIntervals =
        SoundStore1.audioStore.aiChat.sounds[sound].pausableIntervalsIds;
      if (soundPausableIntervals.length > 0) {
        soundPausableIntervals.forEach((pausableInterval) => {
          pausableInterval.clear();
        });
      }
    });

    //Fade para unique sounds:
    SoundDirectorAPI1.fadeCategory(AudioEnvironment.AIChat, "sounds", {
      final: 0,
      milliseconds: fadeOutDurationMs,
    });

    //Fade para la música:
    SoundDirectorAPI1.fadeCategory(AudioEnvironment.AIChat, "music", {
      final: 0,
      milliseconds: fadeOutDurationMs,
    });

    //Fade para soundscape sounds
    SoundDirectorAPI1.fadeSoundscape(
      AudioEnvironment.AIChat,
      fadeOutDurationMs,
      0
    );

    // Paramos todos los sonidos del environment AIChat cuando termina el fade-out, para limpiar cualquier sonido que haya podido quedar.
    fadeOutTimer.current = window.setTimeout(() => {
      SoundDirectorAPI1.stopEnvSounds(AudioEnvironment.AIChat);
    }, fadeOutDurationMs);
  }, [fadeOutDurationMs]);

  useEffect(() => {
    if (chatPhase === "stopPreviousSounds") {
      stopPreviousSounds();
      setChatPhase("preloading");
    }

    if (chatPhase === "userInput" && isUserFirstInteraction.current) {
      isUserFirstInteraction.current = false;

      // Reproducimos los sonidos ambiente.
      playAmbientSounds();

      // Reproducimos la música.
      playMusic();
    }

    if (chatPhase === "endConversation") {
      fadeOutAllSounds();
    }
  }, [
    stopPreviousSounds,
    playAmbientSounds,
    fadeOutAllSounds,
    playMusic,
    soundData,
    chatPhase,
    setChatPhase,
  ]);

  // Limpia timers al desmontar el componente.
  useEffect(() => {
    return () => {
      clearTimeout(fadeOutTimer.current);
    };
  }, []);

  return <GhostDiv id="AIChatSoundManager"></GhostDiv>;
}

export default AIChatSoundManager;
