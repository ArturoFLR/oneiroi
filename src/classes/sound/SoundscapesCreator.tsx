import { HowlOptions } from "howler";
import {
  AudioEnvironment,
  ChangeParamEvent,
  MainAmbientSound,
  ModifyTimersEvent,
  PlayEvent,
  SecondarySound,
  SoundscapesLibrary,
} from "./soundTypes";
import { SoundDirectorAPI1, SoundStore1 } from "./singletons";
import { PausableTimeout } from "../../utils/PausableTimeout";
import { Subject } from "rxjs";
import { getRandomBetweenValues } from "../../utils/getRandomBetweenValues";

export default class SoundscapesCreator {
  playEventEmitter = new Subject<PlayEvent>();

  changeParamEventEmitter = new Subject<ChangeParamEvent>();

  modifyTimersEventEmitter = new Subject<ModifyTimersEvent>();

  soundscapesLibrary: SoundscapesLibrary = {
    [AudioEnvironment.MainMenu]: {},
    [AudioEnvironment.Map]: {},
    [AudioEnvironment.Cinematic]: {},
    [AudioEnvironment.Minigame]: {},
    [AudioEnvironment.InterfacePreloaded]: {},
  };

  playEventReceiver = {
    next: (eventObject: PlayEvent) => {
      const { eventType, env, soundName } = eventObject;

      switch (eventType) {
        case "autoEnd":
        case "autoEndSoundscape":
        case "stopId":
        case "pause":
        case "resume":
          break;

        case "stop":
          for (const soundscape in this.soundscapesLibrary[env]) {
            this.soundscapesLibrary[env][soundscape] = this.soundscapesLibrary[
              env
            ][soundscape].filter((sound) => sound !== soundName);

            if (this.soundscapesLibrary[env][soundscape].length === 0) {
              delete this.soundscapesLibrary[env][soundscape];
            }
          }

          break;
        default:
          break;
      }
    },
  };

  //// Patrón Singleton
  private static instance: SoundscapesCreator;
  private constructor() {}
  public static getInstance(): SoundscapesCreator {
    if (!SoundscapesCreator.instance) {
      SoundscapesCreator.instance = new SoundscapesCreator();
    }
    return SoundscapesCreator.instance;
  }
  //// FIN Patrón Singleton

  ////////////////////////////////////////////////////////////////////// MÉTODOS

  // Siempre que se utilice este método, usar un nombre de sonido único, para que sus timeouts no sean eliminados por otra reproducción del mismo sonido al terminar.
  async createSoundscape(
    env: AudioEnvironment, // No necesitamos category: todos serán "soundscapes"
    soundscapeName: string,
    mainAmbientSound: MainAmbientSound[],
    secondarySounds?: SecondarySound[]
  ) {
    // Almacenamos el nombre del soundscape y todos sus sonidos en soundscapesLibrary
    const soundsList: string[] = [];

    mainAmbientSound.forEach((sound) => {
      soundsList.push(sound.name);
    });

    if (secondarySounds) {
      secondarySounds.forEach((sound) => {
        soundsList.push(sound.name);
      });
    }

    this.soundscapesLibrary[env][soundscapeName] = soundsList;

    // Vamos precargando los sonidos secundarios mediante una promesa a la que esperamos, ya que si no es así, no estará el sonido aún creado cuando
    // se intente añadir el timeout de su delay a su lista de timeouts, y generará un error.

    if (secondarySounds) {
      for (const secSound of secondarySounds) {
        try {
          await SoundDirectorAPI1.preloadSound(
            env,
            "soundscapes",
            secSound.name,
            secSound.src,
            secSound.config
          );
        } catch (error) {
          console.warn(
            `SoundscapesCreator - createSoundscape: Error al precargar el sonido ${secSound.name} en el entorno ${env} del soundscape ${soundscapeName}. Error: ${error}`
          );
        }
      }
    }

    // Creamos los sonidos ambiente principales
    if (mainAmbientSound.length > 0) {
      mainAmbientSound.forEach((mainSound) => {
        SoundDirectorAPI1.createLoopWhithFade(
          env,
          "soundscapes",
          mainSound.name,
          mainSound.src,
          mainSound.fadeDuration,
          mainSound.securityMargin,
          mainSound.config,
          mainSound.stereoValue
        );
      });
    }

    // Creamos el delay para los sonidos secundarios.
    if (secondarySounds) {
      secondarySounds.forEach((sound) => {
        if (sound.delay > 0) {
          const delayNormalTimeout = new PausableTimeout(() => {
            this.loopSoundscapeSound(
              env,
              soundscapeName,
              sound.name,
              sound.src,
              sound.minLoopTime,
              sound.maxLoopTime,
              sound.config,
              sound.stereoValue
            );

            this.emitNewModifyTimersEvent({
              eventType: "deleteTimeout",
              env,
              category: "soundscapes",
              soundName: sound.name,
              timer: delayNormalTimeout,
            });
          }, sound.delay);
          this.emitNewModifyTimersEvent({
            eventType: "addTimeout",
            env,
            category: "soundscapes",
            soundName: sound.name,
            timer: delayNormalTimeout,
          });
        } else {
          this.loopSoundscapeSound(
            env,
            soundscapeName,
            sound.name,
            sound.src,
            sound.minLoopTime,
            sound.maxLoopTime,
            sound.config,
            sound.stereoValue
          );
        }
      });
    }
  }

  // Reproduce un sonido en bucle, con un tiempo de espera aleatorio entre cada reproducción.
  private async loopSoundscapeSound(
    env: AudioEnvironment,
    soundscapeName: string,
    soundName: string,
    src: string,
    minTimeBetweenLoops: number,
    maxTimeBetweenLoops: number,
    config?: HowlOptions,
    stereoValue?: number
  ): Promise<boolean> {
    // Creamos el Playback
    const playbackId = await SoundDirectorAPI1.playSound(
      env,
      "soundscapes",
      soundName,
      src,
      config
    );

    // Si no se ha podido crear el Playback, devolvemos false.
    if (typeof playbackId !== "number") {
      console.warn(
        `SoundscapesCreator - loopSoundscapeSound: Error al crear reproducción principal para el sonido ${soundName} en el entorno ${env} del soundscape ${soundscapeName}`
      );
      return false;
    }

    // Si se indicó un valor de stereo lo aplicamos
    if (typeof stereoValue === "number") {
      this.emitNewChangeParamEvent({
        parameterType: "stereo",
        env,
        category: "soundscapes",
        soundName: soundName,
        newValue: stereoValue,
        id: playbackId,
      });
    }

    // Esta función se encarga de programar un nuevo loop y llamarse a sí misma cuando termine la reproducción actual.
    const generateNewLoop = async (
      currentPlaybackId: number
    ): Promise<boolean> => {
      const randomTimer = getRandomBetweenValues(
        minTimeBetweenLoops,
        maxTimeBetweenLoops
      );

      // Aplicamos listener para que se programe una nueva reproducción cuando termine la actual.
      SoundStore1.audioStore[env].soundscapes[soundName].instance.once(
        "end",
        () => {
          // Creamos un timeot pausable para programar la nueva reproducción.
          const nextPlaybackTimeout = new PausableTimeout(async () => {
            const nextPlaybackId = await SoundDirectorAPI1.playSound(
              env,
              "soundscapes",
              soundName,
              src,
              config
            );

            if (typeof nextPlaybackId !== "number") {
              console.warn(
                `SoundscapesCreator - loopSoundscapeSound: Error al crear el loop para el sonido ${soundName} en el entorno ${env} del soundscape ${soundscapeName}`
              );
              return false;
            }

            if (typeof stereoValue === "number") {
              this.emitNewChangeParamEvent({
                parameterType: "stereo",
                env,
                category: "soundscapes",
                soundName,
                newValue: stereoValue,
                id: nextPlaybackId,
              });
            }

            // Borramos el timeout actual de la lista de timeouts para este soundscape.
            this.emitNewModifyTimersEvent({
              eventType: "deleteTimeout",
              env,
              category: "soundscapes",
              soundName,
              timer: nextPlaybackTimeout,
            });

            generateNewLoop(nextPlaybackId);
          }, randomTimer);

          // Almacenamos el timeout.
          this.emitNewModifyTimersEvent({
            eventType: "addTimeout",
            env,
            category: "soundscapes",
            soundName,
            timer: nextPlaybackTimeout,
          });
        },
        currentPlaybackId
      );

      return true;
    };

    // Iniciamos el loop.
    const isLoopCreated = await generateNewLoop(playbackId);

    if (isLoopCreated) {
      return true;
    } else {
      return false;
    }
  }

  controlSoundscapeReproduction(
    env: AudioEnvironment,
    soundscapeName: string,
    controlEvent: "stop" | "pause" | "resume"
  ) {
    if (soundscapeName in this.soundscapesLibrary[env]) {
      this.soundscapesLibrary[env][soundscapeName].forEach((soundName) => {
        this.emitNewPlayEvent({
          eventType: controlEvent,
          env,
          category: "soundscapes",
          soundName,
        });
      });
      if (controlEvent === "stop")
        delete this.soundscapesLibrary[env][soundscapeName];
    } else {
      console.warn(
        `SoundscapesCreator - stopSoundscape: El soundscape ${soundscapeName} no existe en el entorno ${env}. No se pudo detener`
      );
    }
  }

  //Si no se indica el soundscapeName, se aplica el fade a todos los soundscapes que existan en ese momento.
  //endValue y initialValue no son valores absolutos. Son multiplicadores (volumen actual x endValue, etc). Esto es así para preservar las diferencias
  //de volumen entre los sonidos que componen el soundscape.
  fadeSoundscape(
    env: AudioEnvironment,
    fadeDuration: number,
    endValue: number,
    initialValue?: number,
    soundscapeName?: string
  ) {
    const soundscapesInEnvironment = Object.keys(this.soundscapesLibrary[env]);

    //Si no existen soundscapes activos en el env indicado no se puede hacer fade.
    if (soundscapesInEnvironment.length === 0) return;

    const soundscapesToFade = soundscapeName
      ? [soundscapeName]
      : soundscapesInEnvironment;

    soundscapesToFade.forEach((soundscape) => {
      const soundscapeSounds = this.soundscapesLibrary[env][soundscape];

      soundscapeSounds.forEach((sound) => {
        //Obtenemos el volumen actual del sonido. Usaremos esto para que no se pierda la diferencia de volúmenes entre sonidos de un soundscape
        const currentVolume =
          SoundStore1.audioStore[env].soundscapes[sound].instance.volume();

        // Calcular volúmenes inicial y final
        const targetVolume = endValue * currentVolume; // Volumen final proporcional
        const initialVolume =
          typeof initialValue === "number"
            ? initialValue * currentVolume // Si hay initialValue, se aplica como multiplicador
            : currentVolume; // Si no, se usa el volumen actual como punto de partida

        //Si se ha indicado un valor inicial de volumen para el fundido, lo aplicamos.
        if (typeof initialValue === "number") {
          this.emitNewChangeParamEvent({
            parameterType: "volume",
            env,
            category: "soundscapes",
            soundName: sound,
            newValue: initialVolume,
          });
        }
        //Si va a ser un fade-out a 0, eliminamos todos los timers (timeouts e intervals) de los sonidos, para que no vuelvan a reproducirse
        //una vez terminado el fade-out.
        if (endValue <= 0) {
          this.emitNewModifyTimersEvent({
            env,
            category: "soundscapes",
            soundName: sound,
            eventType: "deleteTimeout",
          });

          this.emitNewModifyTimersEvent({
            env,
            category: "soundscapes",
            soundName: sound,
            eventType: "deleteInterval",
          });

          //Si el sonido no se está reproduciendo, lo paramos directamente.
          if (SoundStore1.audioStore[env].soundscapes[sound].ids.length === 0) {
            this.emitNewPlayEvent({
              eventType: "stop",
              env,
              category: "soundscapes",
              soundName: sound,
            });
          } else {
            SoundDirectorAPI1.fadeSound(env, "soundscapes", sound, {
              final: targetVolume,
              milliseconds: fadeDuration,
            });
          }
        } else {
          SoundDirectorAPI1.fadeSound(env, "soundscapes", sound, {
            final: targetVolume,
            milliseconds: fadeDuration,
          });
        }
      });
    });
  }

  private emitNewPlayEvent(eventObject: PlayEvent) {
    this.playEventEmitter.next(eventObject);
  }

  private emitNewChangeParamEvent(eventObject: ChangeParamEvent) {
    this.changeParamEventEmitter.next(eventObject);
  }

  private emitNewModifyTimersEvent(eventObjet: ModifyTimersEvent) {
    this.modifyTimersEventEmitter.next(eventObjet);
  }
}
