import { Howl, HowlOptions } from "howler";
import {
  AddPlayIdEvent,
  AudioEnvironment,
  AudioStore,
  IntervalActions,
  ModifyTimersEvent,
  PlayEvent,
  SoundCategory,
  TimeoutActions,
} from "./soundTypes";
import { PausableTimeout } from "../../utils/PausableTimeout";
import { PausableInterval } from "../../utils/PausableInterval";

/**
 * Almacena todas las instancias de sonidos junto con sus id´s de reproducción y timeouts.
 *
 * Contiene los métodos necesarios para crear y eliminar (unload) instancias.
 * @class
 */
export default class SoundStore {
  /**
   * Almacena todas las instancias de Howler, divididas en environments y categories, de forma que los sonidos se puedan reproducir, pausar, parar o reanudar por grupos además de individualmente.
   * En el environment "InterfacePreloaded" se guardan instancias de sonidos del interface que deben ser ágiles a la hora de reproducirse. Todos son preloaded y todos se almacenan en la categoría "sounds". Las otras dos categorías no se usan, pero se mantienen en el objeto por coherencia. Nunca se borran."
   * Junto con cada instancia se almacenan los id´s que generan y que deben ser controlados: id´s de reproducción, timeouts, intervals...
   * "sounds" almacena tanto sonidos precargados (para sonidos que deben sonar en el momento preciso, como una cinemática) como no precargados (sonidos que pueden demorarse un poco mientras cargan). Todos se autoeliminan después de sonar (lógica implementada desde SoundPlayer).
   * "soundscapes" almacena sonidos precargados por la clase SoundscapesCreator. Se guardan aparte ya que no se autoeliminan cuando termina su reproducción => son eliminados manualmente por la clase SoundscapesCreator cuando es necesario.
   */
  audioStore: AudioStore = {
    [AudioEnvironment.MainMenu]: { sounds: {}, music: {}, soundscapes: {} },
    [AudioEnvironment.Map]: { sounds: {}, music: {}, soundscapes: {} },
    [AudioEnvironment.Cinematic]: { sounds: {}, music: {}, soundscapes: {} },
    [AudioEnvironment.Minigame]: { sounds: {}, music: {}, soundscapes: {} },
    [AudioEnvironment.InterfacePreloaded]: {
      sounds: {},
      music: {},
      soundscapes: {},
    },
  };

  // Mapa de promesas utilizado por "createNotPreloadedInstance" para evitar crear varias veces la misma instancia si le llegan
  // dos peticiones con el mismo nombre de sonido muy rápido(race condition).
  private pendingInstances: Map<string, Promise<boolean>> = new Map();

  playEventReceiver = {
    next: (eventObject: PlayEvent) => {
      const { eventType, env, category, soundName, id } = eventObject;

      switch (eventType) {
        case "autoEnd":
          this.stopSoundAnimationFrames(env, category, soundName);
          this.applySoundTimeoutsAction("clear", env, category, soundName);
          this.applySoundIntervalsActions("clear", env, category, soundName);
          if (id) {
            this.deletePlayingId(env, category, soundName, id);
          } else {
            console.warn(
              `SoundStore - playEventReceiver: No se ha indicado Id del sonido ${soundName} en ${env}, ${category} para el tipo de evento ${eventType}.`
            );
          }
          this.unloadInstance(env, category, soundName);
          break;

        case "autoEndSoundscape":
          if (id) {
            this.deletePlayingId(env, category, soundName, id);
          } else {
            console.warn(
              `SoundStore - playEventReceiver: No se ha indicado Id del sonido ${soundName} en ${env}, ${category} para el tipo de evento ${eventType}.`
            );
          }
          break;

        case "stop":
          this.stopSoundAnimationFrames(env, category, soundName);
          this.applySoundTimeoutsAction("clear", env, category, soundName);
          this.applySoundIntervalsActions("clear", env, category, soundName);
          this.audioStore[env][category][soundName].ids = [];
          this.unloadInstance(env, category, soundName);
          break;

        case "stopId":
          if (id) {
            this.deletePlayingId(env, category, soundName, id);
          } else {
            console.warn(
              `SoundStore - playEventReceiver: No se ha indicado Id del sonido ${soundName} en ${env}, ${category} para el tipo de evento ${eventType}.`
            );
          }
          this.unloadInstance(env, category, soundName);
          break;

        case "pause":
          this.applySoundTimeoutsAction("pause", env, category, soundName);
          this.applySoundIntervalsActions("pause", env, category, soundName);
          break;

        case "resume":
          this.applySoundTimeoutsAction("resume", env, category, soundName);
          this.applySoundIntervalsActions("resume", env, category, soundName);
          break;

        default:
          break;
      }
    },
  };

  modifyTimersEventReceiver = {
    next: (eventObject: ModifyTimersEvent) => {
      const { eventType, env, category, soundName, timer } = eventObject;

      switch (eventType) {
        case "addTimeout":
        case "addInterval":
        case "addAnimationFrame":
          if (timer) {
            this.addTimerToSound(env, category, soundName, timer);
          } else {
            console.warn(
              `SoundStore - modifyTimersEventReceiver: No se ha incluido parámetro timer del sonido ${soundName} en ${env}, ${category} para el tipo de evento ${eventType}.`
            );
          }
          break;

        case "deleteTimeout":
          this.applySoundTimeoutsAction("clear", env, category, soundName);
          break;

        case "deleteInterval":
          this.applySoundIntervalsActions("clear", env, category, soundName);
          break;

        case "deleteAnimationFrame":
          this.stopSoundAnimationFrames(env, category, soundName);
          break;

        default:
          break;
      }
    },
  };

  addPlayIdEventReceiver = {
    next: (eventObject: AddPlayIdEvent) => {
      const { env, category, soundName, soundId } = eventObject;

      this.audioStore[env][category][soundName].ids.push(soundId);
    },
  };

  //// Patrón Singleton
  private static instance: SoundStore;
  private constructor() {}
  public static getInstance(): SoundStore {
    if (!SoundStore.instance) {
      SoundStore.instance = new SoundStore();
    }
    return SoundStore.instance;
  }
  //// FIN Patrón Singleton

  //////////////////////////////////////////////////////////////// MÉTODOS

  // Helper común para crear instancias de Howl
  private createHowlInstance(soundName: string, config: HowlOptions): Howl {
    return new Howl({
      ...config,
      onloaderror: (_, error) => this.handleLoadError(soundName, error),
    });
  }

  // Helper para crear nueva entrada en audiostore
  private createAudioStoreEntry(
    env: AudioEnvironment,
    category: SoundCategory,
    soundName: string,
    instance: Howl
  ) {
    this.audioStore[env][category][soundName] = {
      instance,
      ids: [],
      pausableTimeoutsIds: [],
      pausableIntervalsIds: [],
      animationFrameIds: [],
    };
  }

  // Helper para eliminar un Id de reproducción.
  private deletePlayingId(
    env: AudioEnvironment,
    category: SoundCategory,
    soundName: string,
    idToDelete: number
  ) {
    this.audioStore[env][category][soundName].ids = this.audioStore[env][
      category
    ][soundName].ids.filter((id) => id !== idToDelete);
  }

  private addTimerToSound(
    env: AudioEnvironment,
    category: SoundCategory,
    soundName: string,
    timer: number | PausableTimeout | PausableInterval
  ) {
    if (typeof timer === "number") {
      this.audioStore[env][category][soundName].animationFrameIds.push(timer);
    } else if (timer instanceof PausableTimeout) {
      this.audioStore[env][category][soundName].pausableTimeoutsIds.push(timer);
    } else if (timer instanceof PausableInterval) {
      this.audioStore[env][category][soundName].pausableIntervalsIds.push(
        timer
      );
    }
  }

  // Se utiliza para crear cualquier sonido que no sea del Interface (env = InterfacePreloaded).
  async createSoundInstance(
    env: AudioEnvironment,
    category: SoundCategory,
    soundName: string,
    src: string,
    preload: boolean,
    config?: HowlOptions
  ): Promise<boolean> {
    // Si ya existe la instancia, salimos del método con "true".
    if (this.audioStore[env][category][soundName]) return true;

    // Key para guardar en "pendingInstances" la promesa (creación de instancia) que vamos a generar:
    const key = `${env}-${category}-${soundName}`;

    // Si hay una promesa (creación) pendiente para esta instancia...
    if (this.pendingInstances.has(key)) {
      // ...esperamos a que se resuelva...
      await this.pendingInstances.get(key);
      // ...y comprobamos de nuevo si la instancia existe o no. Si no existe, es porque ha habido un error y devolvemos false.
      if (this.audioStore[env][category][soundName]) return true;
      return false;
    }

    // Usamos las preferencias de config para crear una configuración personalizada y controlada.
    const newSoundConfig: HowlOptions = {
      ...config,
      src: [src],
      preload: category === "soundscapes" ? true : preload ? true : "metadata", // soundscapes son siempre preload. En el resto se puede elegir. Si se ha elegido "false", el valor será "metadata".
      html5: false,
    };

    // Como no hay una promesa pendiente para la instancia, creamos una nueva promesa y la guardamos en el mapa de promesas.
    try {
      const creationPromise = new Promise<boolean>((resolve, reject) => {
        const newInstance = this.createHowlInstance(soundName, newSoundConfig);

        // Según se cargue el sonido correctamente o no, rechazamos la promesa o la resolvemos y guardamos la instancia en audiostore.
        newInstance.once("loaderror", () => reject(false));

        newInstance.once("load", () => {
          this.createAudioStoreEntry(env, category, soundName, newInstance);
          resolve(true);
        });

        // Si Howler es muy rápido al cargar el audio puede que la promesa no se resuelva, porque los eventos "load" o "loaderror" han ocurrido antes
        // de que se registren los listeners con "once". Para evitar esto, forzamos una nueva carga del audio después de haber registrado los listeners.
        newInstance.load();
      });

      this.pendingInstances.set(key, creationPromise);

      // Esperar a que la promesa se resuelva/rechace
      const result = await creationPromise;
      return result;
    } catch (error) {
      console.warn(
        `createNotPreloadedInstance: no se ha podido crear la instancia ${soundName} en ${env}, ${category}. Error: ${error}`
      );
      return false;
    } finally {
      // Eliminamos siempre la promesa, se haya resulto correctamente o no.
      this.pendingInstances.delete(key);
    }
  }

  // Se utiliza sólo para crear instancias de sonidos de interfaz, que son siempre preloaded.
  // Aquí no hay controles de race condition, ya que se cargan al inicio a patir de una lista controlada y no se vuelve a usar.
  createInterfaceSoundInstance(
    soundName: string,
    soundSrc: string,
    config?: HowlOptions
  ): boolean {
    if (this.audioStore[AudioEnvironment.InterfacePreloaded].sounds[soundName])
      return false;

    const newSoundConfig: HowlOptions = {
      ...config,
      src: [soundSrc],
      preload: true,
      html5: false,
    };

    const newInterfaceSound = this.createHowlInstance(
      soundName,
      newSoundConfig
    );

    this.createAudioStoreEntry(
      AudioEnvironment.InterfacePreloaded,
      "sounds",
      soundName,
      newInterfaceSound
    );

    return true;
  }

  // El siguiente método comprueba que no haya reproducciones de la instancia en curso y que no sea un sonido "InterfacePreloaded".
  // Si esto se cumple, se destruye la instancia.
  private unloadInstance(
    env: AudioEnvironment,
    category: SoundCategory,
    name: string
  ) {
    if (
      env !== AudioEnvironment.InterfacePreloaded &&
      this.audioStore[env][category][name].ids.length === 0
    ) {
      try {
        this.audioStore[env][category][name].instance.unload();
        delete this.audioStore[env][category][name];
      } catch (error) {
        console.warn(
          `SoundDirector - playSound: No se ha podido eliminar la instancia de ${name} en ${env}, ${category}. Error: ${error}`
        );
      }
    }
  }

  private applySoundTimeoutsAction(
    actionType: TimeoutActions,
    env: AudioEnvironment,
    category: SoundCategory,
    soundName: string
  ) {
    this.audioStore[env][category][soundName].pausableTimeoutsIds.forEach(
      (timeout) => {
        if (actionType === "clear") {
          timeout.clear();
        } else if (actionType === "pause") {
          timeout.pause();
        } else {
          timeout.resume();
        }
      }
    );

    if (actionType === "clear")
      this.audioStore[env][category][soundName].pausableTimeoutsIds = [];
  }

  private applySoundIntervalsActions(
    actionType: IntervalActions,
    env: AudioEnvironment,
    category: SoundCategory,
    soundName: string
  ) {
    this.audioStore[env][category][soundName].pausableIntervalsIds.forEach(
      (interval) => {
        if (actionType === "clear") {
          interval.clear();
        } else if (actionType === "pause") {
          interval.pause();
        } else {
          interval.resume();
        }
      }
    );

    if (actionType === "clear")
      this.audioStore[env][category][soundName].pausableIntervalsIds = [];
  }

  private stopSoundAnimationFrames(
    env: AudioEnvironment,
    category: SoundCategory,
    soundName: string
  ) {
    this.audioStore[env][category][soundName].animationFrameIds.forEach(
      (animationFrameId) => {
        cancelAnimationFrame(animationFrameId);
      }
    );
    this.audioStore[env][category][soundName].animationFrameIds = [];
  }

  private handleLoadError(soundName: string, error: unknown) {
    console.warn(
      `No se ha podido reproducir la instancia ${soundName}. Error: ${error}`
    );
  }
}
