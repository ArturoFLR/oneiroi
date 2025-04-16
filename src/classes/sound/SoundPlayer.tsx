import { HowlOptions } from "howler";
import {
  AddPlayIdEvent,
  AudioEnvironment,
  PlayEvent,
  SoundCategory,
} from "./soundTypes";
import { SoundStore1 } from "./singletons";
import { Subject } from "rxjs";

export default class SoundPlayer {
  //// Patrón Singleton
  private static instance: SoundPlayer;
  private constructor() {}
  public static getInstance(): SoundPlayer {
    if (!SoundPlayer.instance) {
      SoundPlayer.instance = new SoundPlayer();
    }
    return SoundPlayer.instance;
  }
  //// FIN Patrón Singleton

  playEventEmitter = new Subject<PlayEvent>();

  addPlayIdEventEmitter = new Subject<AddPlayIdEvent>();

  playEventReceiver = {
    next: (eventObject: PlayEvent) => {
      const { eventType, env, category, soundName, id } = eventObject;

      switch (eventType) {
        case "autoEnd":
          break;

        case "autoEndSoundscape":
          break;

        case "stop":
          this.stopSound(env, category, soundName);
          break;

        case "stopId":
          this.stopSound(env, category, soundName, id);
          break;

        case "pause":
          this.pauseSound(env, category, soundName);
          break;

        case "resume":
          this.resumeSound(env, category, soundName);
          break;

        default:
          break;
      }
    },
  };

  /////////////////////////////////////////////////////////////////////////// MÉTODOS

  async playSound(
    env: AudioEnvironment,
    category: SoundCategory,
    soundName: string,
    src: string,
    config?: HowlOptions,
    stereo?: number
  ): Promise<boolean | number> {
    //Si es un sonido para el interface, la instancia ya debería estar creada.
    if (env !== AudioEnvironment.InterfacePreloaded) {
      const isInstanceCreated = await SoundStore1.createSoundInstance(
        env,
        category,
        soundName,
        src,
        false, // createSoundInstance ya tiene un control para que los sonidos de "soundscapes" sean siempre "true"
        config
      );

      // Si la instancia ya existía, "SoundStore1.createSoundInstance" nos devolverá "true", por lo que el siguiente if no se ejecutará:
      if (!isInstanceCreated) {
        console.warn(
          `Reproductor: no se ha podido crear la instancia ${soundName} en ${env}, ${category}.`
        );
        return false;
      }
      //Para el caso de que sea un "preloaded" pero por error no se creó la instancia al iniciar la aplicación:
    } else {
      if (
        !SoundStore1.audioStore[AudioEnvironment.InterfacePreloaded].sounds[
          soundName
        ]
      ) {
        console.warn(
          `Reproductor: no se ha encontrado una instancia precargada del sonido de interface ${soundName} en ${env}, ${category}.`
        );
        return false;
      }
    }

    // Creamos una nueva reproducción de la instancia
    const newPlayId =
      SoundStore1.audioStore[env][category][soundName].instance.play();

    // Guardamos el id de la reproducción en audioStore
    this.emitNewAddPlayIdEvent({
      env,
      category,
      soundName,
      soundId: newPlayId,
    });

    //Por si no se ha creado una nueva instancia (esto ocurre siempre con los sonidos preloaded, por ejemplo), normalizamos volume, rate y stereo,
    // que pueden estar alterados en la instancia por una modificación previa donde no se especificó Id y afectó a toda la instancia.
    // No lo hacemos sobre la propia instancia, sino sobre la reproducción concreta, para que no afecte a reproducciones en curso de la instancia, donde
    // el usuario ha podido definir parámetros diferentes.
    SoundStore1.audioStore[env][category][soundName].instance.volume(
      1,
      newPlayId
    );
    SoundStore1.audioStore[env][category][soundName].instance.rate(
      1,
      newPlayId
    );
    SoundStore1.audioStore[env][category][soundName].instance.stereo(
      0,
      newPlayId
    );

    // Si el usuario ha indicado parámetros específicos de volumen, rate o stereo, los aplicamos en la reproducción:
    if (config) {
      if (config.volume || config.volume === 0) {
        SoundStore1.audioStore[env][category][soundName].instance.volume(
          config.volume,
          newPlayId
        );
      }
      if (config.rate || config.rate === 0) {
        SoundStore1.audioStore[env][category][soundName].instance.rate(
          config.rate,
          newPlayId
        );
      }
    }

    if (typeof stereo === "number")
      SoundStore1.audioStore[env][category][soundName].instance.stereo(
        stereo,
        newPlayId
      );

    // Añadimos el evento "onend" para que al terminar de reproducirse se emita un evento a SoundStore
    // para que se borre su id del array de reproducciones en curso.
    // Si el sonido no está en "soundscapes", además se eliminan timeouts y animaciones, y se destuye la instancia (unload), si procede.
    if (category === "soundscapes") {
      SoundStore1.audioStore[env][category][soundName].instance.once(
        "end",
        () => {
          this.emitNewPlayEvent({
            eventType: "autoEndSoundscape",
            env,
            category,
            soundName,
            id: newPlayId,
          });
        },
        newPlayId
      );
    } else {
      SoundStore1.audioStore[env][category][soundName].instance.once(
        "end",
        () => {
          this.emitNewPlayEvent({
            eventType: "autoEnd",
            env,
            category,
            soundName,
            id: newPlayId,
          });
        },
        newPlayId
      );
    }

    return newPlayId;
  }

  // soundId es usado por los métodos fadeSound y createLoopWhithFade de la clase SoundEffects, ya que generan 2 reproducciones sobre la misma instancia
  // y deben poder controlarlas individualmente.
  stopSound(
    env: AudioEnvironment,
    category: SoundCategory,
    soundName: string,
    soundId?: number
  ) {
    try {
      if (typeof soundId === "number") {
        SoundStore1.audioStore[env][category][soundName].instance.stop(soundId);

        this.emitNewPlayEvent({
          eventType: "stopId",
          env,
          category,
          soundName,
          id: soundId,
        });
      } else {
        SoundStore1.audioStore[env][category][soundName].instance.stop();

        this.emitNewPlayEvent({
          eventType: "stop",
          env,
          category,
          soundName,
        });
      }
      return true;
    } catch (error) {
      console.warn(
        `SoundPlayer - stopSound: No se ha podido parar la reproducción de ${soundName} en ${env}, ${category}. Error: ${error}`
      );
      return false;
    }
  }

  stopCategorySounds(env: AudioEnvironment, category: SoundCategory) {
    try {
      for (const soundName in SoundStore1.audioStore[env][category]) {
        SoundStore1.audioStore[env][category][soundName].instance.stop();

        this.emitNewPlayEvent({
          eventType: "stop",
          env,
          category,
          soundName,
        });
      }
    } catch (error) {
      console.warn(
        `SoundPlayer - stopCategorySounds: Error al parar los sonidos de ${env}, ${category}. Error: ${error}`
      );
      return false;
    }

    return true;
  }

  stopEnvSounds(env: AudioEnvironment) {
    for (const [catKey, catValue] of Object.entries(
      SoundStore1.audioStore[env]
    )) {
      const category = catKey as SoundCategory;

      // // Iteramos sobre copia de las claves para evitar estar modificando elementos del propio elemento sobre el que iteramos (posible corrupción de índices)
      const soundNames = Object.keys(catValue);

      // 1. Detener y limpiar Id´s
      for (const soundName of soundNames) {
        try {
          SoundStore1.audioStore[env][category][soundName].instance.stop();

          this.emitNewPlayEvent({
            eventType: "stop",
            env,
            category,
            soundName,
          });
        } catch (error) {
          console.warn(
            `SoundPlayer - stopEnvSounds: Error al parar sonido "${soundName}" en ${env}, ${category}. Error: ${error}`
          );
          return false;
        }
      }
    }

    return true;
  }

  stopAllSounds() {
    for (const [envKey, envValue] of Object.entries(SoundStore1.audioStore)) {
      const environment = envKey as AudioEnvironment;

      for (const [catKey, catValue] of Object.entries(envValue)) {
        const category = catKey as SoundCategory;

        // // Iteramos sobre copia de las claves para evitar estar borrando elementos del propio elemento sobre el que iteramos (posible corrupción de índices)
        const soundNames = Object.keys(catValue);

        // 1. Detener y limpiar Id´s
        for (const soundName of soundNames) {
          try {
            catValue[soundName].instance.stop();

            this.emitNewPlayEvent({
              eventType: "stop",
              env: environment,
              category,
              soundName,
            });
          } catch (error) {
            console.warn(
              `SoundPlayer - stopAllSounds: Error al parar sonido "${soundName}" en ${environment}, ${category}. Error: ${error}`
            );
            return false;
          }
        }
      }
    }

    return true;
  }

  pauseSound(
    env: AudioEnvironment,
    category: SoundCategory,
    soundName: string
  ) {
    if (SoundStore1.audioStore[env][category][soundName].instance) {
      try {
        SoundStore1.audioStore[env][category][soundName].instance.pause();

        this.emitNewPlayEvent({
          eventType: "pause",
          env,
          category,
          soundName,
        });
        return true;
      } catch (error) {
        console.warn(
          `SoundPlayer - pauseSound: No se ha podido pausar la instancia de ${soundName} en ${env}, ${category}. Error: ${error}`
        );
        return false;
      }
    } else {
      console.warn(
        `SoundPlayer - pauseSound: No se ha podido pausar la instancia de ${soundName} en ${env}, ${category}. No existe.`
      );
      return false;
    }
  }

  pauseCategorySounds(env: AudioEnvironment, category: SoundCategory) {
    for (const soundName in SoundStore1.audioStore[env][category]) {
      try {
        SoundStore1.audioStore[env][category][soundName].instance.pause();

        this.emitNewPlayEvent({
          eventType: "pause",
          env,
          category,
          soundName,
        });
      } catch (error) {
        console.warn(
          `SoundPlayer - pauseCategorySounds: No se ha podido pausar la instancia de ${soundName} en ${env}, ${category}. Error: ${error}`
        );
        return false;
      }
    }

    return true;
  }

  pauseEnvSounds(env: AudioEnvironment) {
    for (const [catKey, catValue] of Object.entries(
      SoundStore1.audioStore[env]
    )) {
      const category = catKey as SoundCategory;

      // // Iteramos sobre copia de las claves para evitar estar borrando elementos del propio elemento sobre el que iteramos (posible corrupción de índices)
      const soundNames = Object.keys(catValue);

      for (const soundName of soundNames) {
        try {
          SoundStore1.audioStore[env][category][soundName].instance.pause();

          this.emitNewPlayEvent({
            eventType: "pause",
            env,
            category,
            soundName,
          });
        } catch (error) {
          console.warn(
            `SoundPlayer - pauseEnvSounds: No se ha podido pausar la instancia de ${soundName} en ${env}, ${category}. Error: ${error}`
          );
          return false;
        }
      }
    }

    return true;
  }

  pauseAllSounds() {
    for (const [envKey, envValue] of Object.entries(SoundStore1.audioStore)) {
      const environment = envKey as AudioEnvironment;

      for (const [catKey, catValue] of Object.entries(envValue)) {
        const category = catKey as SoundCategory;

        // // Iteramos sobre copia de las claves para evitar estar borrando elementos del propio elemento sobre el que iteramos (posible corrupción de índices)
        const soundNames = Object.keys(catValue);

        for (const soundName of soundNames) {
          try {
            SoundStore1.audioStore[environment][category][
              soundName
            ].instance.pause();

            this.emitNewPlayEvent({
              eventType: "pause",
              env: environment,
              category,
              soundName,
            });
          } catch (error) {
            console.warn(
              `SoundPlayer - pauseAllSounds: No se ha podido pausar la instancia de ${soundName} en ${environment}, ${category}. Error: ${error}`
            );
            return false;
          }
        }
      }
    }

    return true;
  }

  resumeSound(
    env: AudioEnvironment,
    category: SoundCategory,
    soundName: string
  ) {
    if (SoundStore1.audioStore[env][category][soundName].ids.length > 0) {
      SoundStore1.audioStore[env][category][soundName].ids.forEach(
        (element) => {
          try {
            SoundStore1.audioStore[env][category][soundName].instance.play(
              element
            );

            this.emitNewPlayEvent({
              eventType: "resume",
              env,
              category,
              soundName,
            });
          } catch (error) {
            console.warn(
              `SoundPlayer - resumeSound: No se ha podido continuar la reproducción con id "${element}" de ${soundName} en ${env}, ${category}. Error: ${error}`
            );
            return false;
          }
        }
      );
    } else {
      // Emitimos un evento "resume" incluso si no hay ids, para que la SoundStore reanude los timers de los soundscapes, si los hubiera
      // Esto es así porque los sonidos secundarios de los soundscapes pueden no estar reproduciéndose, pero tener una reproducción programada
      this.emitNewPlayEvent({
        eventType: "resume",
        env,
        category,
        soundName,
      });
    }
  }

  resumeCategorySounds(env: AudioEnvironment, category: SoundCategory) {
    try {
      for (const soundName in SoundStore1.audioStore[env][category]) {
        if (SoundStore1.audioStore[env][category][soundName].ids.length > 0) {
          SoundStore1.audioStore[env][category][soundName].ids.forEach((id) => {
            SoundStore1.audioStore[env][category][soundName].instance.play(id);

            this.emitNewPlayEvent({
              eventType: "resume",
              env,
              category,
              soundName,
            });
          });
        }
        // Emitimos un evento "resume" incluso si no hay ids, para que la SoundStore reanude los timers de los soundscapes, si los hubiera
        // Esto es así porque los sonidos secundarios de los soundscapes pueden no estar reproduciéndose, pero tener una reproducción programada
        this.emitNewPlayEvent({
          eventType: "resume",
          env,
          category,
          soundName,
        });
      }
    } catch (error) {
      console.warn(
        `SoundPlayer - resumeCategorySounds: Se ha producido un error al intentar reanudar los sonidos de ${env}, ${category}. Error: ${error}.`
      );
      return false;
    }

    return true;
  }

  resumeEnvSounds(env: AudioEnvironment) {
    for (const [catKey, catValue] of Object.entries(
      SoundStore1.audioStore[env]
    )) {
      const category = catKey as SoundCategory;

      // // Iteramos sobre copia de las claves para evitar estar modificando elementos del propio elemento sobre el que iteramos (posible corrupción de índices)
      const soundNames = Object.keys(catValue);

      for (const soundName of soundNames) {
        if (SoundStore1.audioStore[env][category][soundName].ids.length > 0) {
          SoundStore1.audioStore[env][category][soundName].ids.forEach((id) => {
            try {
              SoundStore1.audioStore[env][category][soundName].instance.play(
                id
              );

              this.emitNewPlayEvent({
                eventType: "resume",
                env,
                category,
                soundName,
              });
            } catch (error) {
              console.warn(
                `SoundPlayer - resumeEnvSounds: No se ha podido reanudar la reproducción con id "${id}" de ${soundName} en ${env}, ${category}. Error: ${error}`
              );
              return false;
            }
          });
        }
        // Emitimos un evento "resume" incluso si no hay ids, para que la SoundStore reanude los timers de los soundscapes, si los hubiera
        // Esto es así porque los sonidos secundarios de los soundscapes pueden no estar reproduciéndose, pero tener una reproducción programada
        this.emitNewPlayEvent({
          eventType: "resume",
          env,
          category,
          soundName,
        });
      }
    }

    return true;
  }

  resumeAllSounds() {
    for (const [envKey, envValue] of Object.entries(SoundStore1.audioStore)) {
      const environment = envKey as AudioEnvironment;

      for (const [catKey, catValue] of Object.entries(envValue)) {
        const category = catKey as SoundCategory;

        // // Iteramos sobre copia de las claves para evitar estar modificando elementos del propio elemento sobre el que iteramos (posible corrupción de índices)
        const soundNames = Object.keys(catValue);

        for (const soundName of soundNames) {
          if (
            SoundStore1.audioStore[environment][category][soundName].ids
              .length > 0
          ) {
            SoundStore1.audioStore[environment][category][
              soundName
            ].ids.forEach((id) => {
              try {
                SoundStore1.audioStore[environment][category][
                  soundName
                ].instance.play(id);

                this.emitNewPlayEvent({
                  eventType: "resume",
                  env: environment,
                  category,
                  soundName,
                });
              } catch (error) {
                console.warn(
                  `SoundPlayer - resumeAllSounds: No se ha podido reanudar la reproducción con id "${id}" de ${soundName} en ${environment}, ${category}. Error: ${error}`
                );
                return false;
              }
            });
          }
          // Emitimos un evento "resume" incluso si no hay ids, para que la SoundStore reanude los timers de los soundscapes, si los hubiera
          // Esto es así porque los sonidos secundarios de los soundscapes pueden no estar reproduciéndose, pero tener una reproducción programada
          this.emitNewPlayEvent({
            eventType: "resume",
            env: environment,
            category,
            soundName,
          });
        }
      }
    }

    return true;
  }

  private emitNewPlayEvent(eventObject: PlayEvent) {
    this.playEventEmitter.next(eventObject);
  }

  private emitNewAddPlayIdEvent(eventObject: AddPlayIdEvent) {
    this.addPlayIdEventEmitter.next(eventObject);
  }
}
