import { SoundStore1 } from "./singletons";
import {
  AudioEnvironment,
  ChangeParamEvent,
  SoundCategory,
} from "./soundTypes";

// Modifica parámetros básicos de un sonido, como volumen, rate y stereo.
export default class SoundParameterController {
  //// Patrón Singleton
  private static instance: SoundParameterController;
  private constructor() {}
  public static getInstance(): SoundParameterController {
    if (!SoundParameterController.instance) {
      SoundParameterController.instance = new SoundParameterController();
    }
    return SoundParameterController.instance;
  }
  //// FIN Patrón Singleton

  changeParamEventReceiver = {
    next: (eventObject: ChangeParamEvent) => {
      const { parameterType, env, category, soundName, newValue, id } =
        eventObject;

      switch (parameterType) {
        case "volume":
          this.setSoundVolume(env, category, soundName, newValue, id);
          break;

        case "rate":
          this.setSoundRate(env, category, soundName, newValue, id);
          break;

        case "stereo":
          this.setStereoForSound(env, category, soundName, newValue, id);
          break;

        default:
          break;
      }
    },
  };

  //////////////////////////////////////////////////////////////// MÉTODOS

  // Las siguientes 3 funciones aplican propiedades a nivel de Id de reproducción, y no de instancia.
  // Esto es así para evitar errores: Si aplicamos un fade-out a 0 en una instancia, cuando se necesite obtener el volumen actual de la instancia
  // siempre será 0 (aunque al generar una nueva reproducción se oirá correctamente, porque "SoundPlayer - playSound()" normaliza los parámetros de
  // cada nueva reproducción), lo que genera errores en "SoundEffects - createLoopWhithFade", por ejemplo.
  private updateSoundProperty(
    env: AudioEnvironment,
    category: SoundCategory,
    soundName: string,
    updateFunction: (instance: Howl, playIds: number[], id?: number) => void,
    soundId?: number
  ): boolean {
    const instanceData = SoundStore1.audioStore[env]?.[category]?.[soundName];

    if (!instanceData) {
      console.warn(
        `SoundParameterController - updateSoundProperty: No se ha podido modificar propiedad de ${soundName} con Id: "${soundId}" en ${env}, ${category}. La instancia no existe. `
      );
      return false;
    }

    if (soundId && instanceData.ids.includes(soundId)) {
      updateFunction(instanceData.instance, instanceData.ids, soundId);
    } else {
      updateFunction(instanceData.instance, instanceData.ids);
    }

    return true;
  }

  private updateCategoryProperty(
    env: AudioEnvironment,
    category: SoundCategory,
    updateFunction: (
      instance: Howl,
      playIds: number[],
      soundName?: string
    ) => void
  ): boolean {
    for (const soundName in SoundStore1.audioStore[env][category]) {
      try {
        updateFunction(
          SoundStore1.audioStore[env][category][soundName].instance,
          SoundStore1.audioStore[env][category][soundName].ids,
          soundName
        );
      } catch (error) {
        console.warn(
          `SoundParameterController - updateCategoryProperty: No ha sido posible modificar propiedad de ${soundName} en ${env}, ${category}.  Error: ${error}`
        );
        return false;
      }
    }

    return true;
  }

  private updateGlobalProperty(
    updateFunction: (
      instance: Howl,
      playIds: number[],
      env?: AudioEnvironment,
      category?: SoundCategory,
      soundName?: string
    ) => void
  ): boolean {
    for (const [envKey, envValue] of Object.entries(SoundStore1.audioStore)) {
      const environment = envKey as AudioEnvironment;

      for (const [catKey, catValue] of Object.entries(envValue)) {
        const category = catKey as SoundCategory;

        // // Iteramos sobre copia de las claves para evitar modificar elementos del propio elemento sobre el que iteramos (posible corrupción de índices)
        const soundNames = Object.keys(catValue);

        for (const soundName of soundNames) {
          try {
            updateFunction(
              SoundStore1.audioStore[environment][category][soundName].instance,
              SoundStore1.audioStore[environment][category][soundName].ids,
              environment,
              category,
              soundName
            );
          } catch (error) {
            console.warn(
              `SoundParameterController - updateCategoryProperty: No ha sido posible modificar propiedad de ${soundName} en ${environment}, ${category}.  Error: ${error}`
            );
            return false;
          }
        }
      }
    }
    return true;
  }

  setSoundVolume(
    env: AudioEnvironment,
    category: SoundCategory,
    soundName: string,
    newVolume: number,
    soundId?: number
  ) {
    const updateFunction = (instance: Howl, playIds: number[], id?: number) => {
      if (id) {
        instance.volume(newVolume, id);
      } else {
        playIds.forEach((playId) => {
          instance.volume(newVolume, playId);
        });
      }
    };

    return this.updateSoundProperty(
      env,
      category,
      soundName,
      updateFunction,
      soundId
    );
  }

  setCategoryVolume(
    env: AudioEnvironment,
    category: SoundCategory,
    newVolume: number
  ) {
    const updateFunction = (instance: Howl, playIds: number[]) => {
      playIds.forEach((playId) => {
        instance.volume(newVolume, playId);
      });
    };

    return this.updateCategoryProperty(env, category, updateFunction);
  }

  setGlobalVolume(newVolume: number) {
    try {
      Howler.volume(newVolume);
      return true;
    } catch (error) {
      console.warn(
        `setGlobalVolume: No ha sido posible modificar el volumen global de Howler. Error: ${error}`
      );
      return false;
    }
  }

  setSoundRate(
    env: AudioEnvironment,
    category: SoundCategory,
    soundName: string,
    newRate: number,
    soundId?: number
  ) {
    const updateFunction = (instance: Howl, playIds: number[], id?: number) => {
      if (id) {
        instance.rate(newRate, id);
      } else {
        playIds.forEach((playId) => {
          instance.rate(newRate, playId);
        });
      }
    };

    return this.updateSoundProperty(
      env,
      category,
      soundName,
      updateFunction,
      soundId
    );
  }

  setCategoryRate(
    env: AudioEnvironment,
    category: SoundCategory,
    newRate: number
  ) {
    const updateFunction = (instance: Howl, playIds: number[]) => {
      playIds.forEach((playId) => {
        instance.rate(newRate, playId);
      });
    };

    return this.updateCategoryProperty(env, category, updateFunction);
  }

  setGlobalRate(newRate: number) {
    const updateFunction = (instance: Howl, playIds: number[]) => {
      playIds.forEach((playId) => {
        instance.rate(newRate, playId);
      });
    };

    return this.updateGlobalProperty(updateFunction);
  }

  setStereoForSound(
    env: AudioEnvironment,
    category: SoundCategory,
    soundName: string,
    newStereoValue: number,
    soundId?: number
  ) {
    const updateFunction = (instance: Howl, playIds: number[], id?: number) => {
      if (id) {
        instance.stereo(newStereoValue, id);
      } else {
        playIds.forEach((playId) => {
          instance.stereo(newStereoValue, playId);
        });
      }
    };

    return this.updateSoundProperty(
      env,
      category,
      soundName,
      updateFunction,
      soundId
    );
  }

  setStereoForCategory(
    env: AudioEnvironment,
    category: SoundCategory,
    newStereoValue: number
  ) {
    const updateFunction = (instance: Howl, playIds: number[]) => {
      playIds.forEach((playId) => {
        instance.stereo(newStereoValue, playId);
      });
    };

    return this.updateCategoryProperty(env, category, updateFunction);
  }

  setStereoGlobal(newStereoValue: number) {
    const updateFunction = (instance: Howl, playIds: number[]) => {
      playIds.forEach((playId) => {
        instance.stereo(newStereoValue, playId);
      });
    };

    return this.updateGlobalProperty(updateFunction);
  }
}
