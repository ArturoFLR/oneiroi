import { Howl, HowlOptions } from "howler";
import {
  AudioEnvironment,
  FadeValuesType,
  MainAmbientSound,
  PropertiesToNormalize,
  SecondarySound,
  SoundCategory,
} from "./soundTypes";
import {
  SoundEffects1,
  SoundParameterController1,
  SoundPlayer1,
  SoundscapesCreator1,
  SoundStore1,
} from "./singletons";

import initSound from "@assets/audio/sounds/interface/interface-click.mp3";

export default class SoundDirectorAPI {
  //// Patrón Singleton
  private static instance: SoundDirectorAPI;
  private constructor() {}
  public static getInstance(): SoundDirectorAPI {
    if (!SoundDirectorAPI.instance) {
      SoundDirectorAPI.instance = new SoundDirectorAPI();
    }
    return SoundDirectorAPI.instance;
  }
  //// FIN Patrón Singleton

  private isAudioInitialized: boolean = false;

  ////////////////////////////////////////////////////////////////////// MÉTODOS

  // Este método debe ser llamado una vez al iniciar la aplicación, antes de usar cualquier otro método de la API. Inicializa el contexto de audio
  // y registra los observables.
  initAudio = () => {
    //Evitamos inicializar más de una vez (múltiples suscripciones a observables provocan que un único evento se reciba varias veces por los observers)
    if (this.isAudioInitialized) return;

    // Activa el audio globalmente
    // Forzar la creación del contexto con un sonido "dummy"
    const dummy = new Howl({ src: [initSound], volume: 1 });
    dummy.play();
    Howler.volume(1.0);

    // Resumir el contexto si es necesario
    if (Howler.ctx && Howler.ctx.state === "suspended") {
      Howler.ctx.resume();
    }

    // Registrar los observer y observables de todas las clases de sonido.
    try {
      SoundPlayer1.playEventEmitter.subscribe(SoundStore1.playEventReceiver);
      SoundPlayer1.playEventEmitter.subscribe(
        SoundscapesCreator1.playEventReceiver
      );
      SoundPlayer1.addPlayIdEventEmitter.subscribe(
        SoundStore1.addPlayIdEventReceiver
      );

      SoundEffects1.playEventEmitter.subscribe(SoundPlayer1.playEventReceiver);
      SoundEffects1.modifyTimersEventEmitter.subscribe(
        SoundStore1.modifyTimersEventReceiver
      );
      SoundEffects1.changeParamEventEmitter.subscribe(
        SoundParameterController1.changeParamEventReceiver
      );

      SoundscapesCreator1.playEventEmitter.subscribe(
        SoundPlayer1.playEventReceiver
      );
      SoundscapesCreator1.modifyTimersEventEmitter.subscribe(
        SoundStore1.modifyTimersEventReceiver
      );
      SoundscapesCreator1.changeParamEventEmitter.subscribe(
        SoundParameterController1.changeParamEventReceiver
      );

      this.isAudioInitialized = true;
    } catch (error) {
      console.warn(
        `SoundDirectorAPI - initAudio: No se han podido registrar correctamente los observers. Error: ${error}`
      );
    }
  };

  private normalizeConfigValues(
    property: PropertiesToNormalize,
    value: number | FadeValuesType
  ) {
    const maxVolumeAndFade: number = 1.0;
    const minVolumeAndFade: number = 0.0;

    const maxRate: number = 4.0;
    const minRate: number = 0.5;

    const maxStereo: number = 1.0;
    const minStereo: number = -1.0;

    if (property === "volume") {
      if ((value as number) > maxVolumeAndFade) {
        return maxVolumeAndFade;
      } else if ((value as number) < minVolumeAndFade) {
        return minVolumeAndFade;
      } else return value;
    } else if (property === "rate") {
      if ((value as number) > maxRate) {
        return maxRate;
      } else if ((value as number) < minRate) {
        return minRate;
      } else return value;
    } else if (property === "stereo") {
      if ((value as number) > maxStereo) {
        return maxStereo;
      } else if ((value as number) < minStereo) {
        return minStereo;
      } else return value;
    } else {
      const newFadeValues: FadeValuesType = {
        ...(value as FadeValuesType),
      };
      if (newFadeValues.final > maxVolumeAndFade) {
        newFadeValues.final = maxVolumeAndFade;
      } else if (newFadeValues.final < minVolumeAndFade)
        newFadeValues.final = minVolumeAndFade;

      return newFadeValues as FadeValuesType;
    }
  }

  private getNormalizedStereo(stereo: number | undefined): number | undefined {
    if (typeof stereo === "number") {
      return this.normalizeConfigValues("stereo", stereo) as number;
    } else return stereo;
  }

  private getNormalizedVolume(volume: number) {
    return this.normalizeConfigValues("volume", volume) as number;
  }

  private getNormalizedRate(rate: number) {
    return this.normalizeConfigValues("rate", rate) as number;
  }

  private getNormalizedFadeValues(values: FadeValuesType) {
    return this.normalizeConfigValues("fade", values) as FadeValuesType;
  }

  private getNormalizedConfig(
    config: HowlOptions | undefined
  ): HowlOptions | undefined {
    if (config) {
      if (config.volume) {
        const normalizedVolume = this.normalizeConfigValues(
          "volume",
          config.volume
        ) as number;

        config.volume = normalizedVolume;
      }

      if (config.rate) {
        const normalizedRate = this.normalizeConfigValues(
          "rate",
          config.rate
        ) as number;
        config.rate = normalizedRate;
      }

      return config;
    } else return config;
  }

  // Sólo debería utilizarse una vez, al inicio de la aplicación, y sólo para sonidos cortos del interface.
  // Si queremos algún efecto de "stereo", lo indicamos al reproducirlo (playSound()), no aquí.
  preloadInterfaceSound(
    soundName: string,
    soundSrc: string,
    config?: HowlOptions
  ): boolean {
    // Normalizamos los valores de "config", si existen:
    config = this.getNormalizedConfig(config);

    // Creamos la instancia
    const isSoundPreLoaded = SoundStore1.createInterfaceSoundInstance(
      soundName,
      soundSrc,
      config
    );

    if (isSoundPreLoaded) return true;
    return false;
  }

  // Para precargar sonidos de interfaz, usar preloadInterfaceSound().
  // Sólo debe usarse para sonidos que deben estar precargados porque deben sonar en un momento muy preciso, normalmente en cinemáticas.
  // El sonido debe precargarse lo más cerca posible de su uso, ya que en cuanto haya un stop() a nivel de categoría o global será eliminado.
  // Para sonidos que no necesitan estar precargados, utilizar directamente "playSound()"
  // Si queremos algún efecto de "stereo", lo indicamos al reproducirlo (playSound()), no aquí.
  async preloadSound(
    env: AudioEnvironment,
    category: SoundCategory,
    soundName: string,
    soundSrc: string,
    config?: HowlOptions
  ): Promise<boolean> {
    // Normalizamos los valores de "config", si existen:
    config = this.getNormalizedConfig(config);

    // Creamos la instancia
    const isSoundPreLoaded = await SoundStore1.createSoundInstance(
      env,
      category,
      soundName,
      soundSrc,
      true,
      config
    );

    if (isSoundPreLoaded) return true;
    return false;
  }

  // Si el sonido a reproducir es del interface y está precargado, env siempre será "AudioEnvironment.InterfacePreloaded" y la category = "sounds"
  async playSound(
    env: AudioEnvironment,
    category: SoundCategory,
    soundName: string,
    soundSrc: string,
    config?: HowlOptions,
    stereo?: number
  ): Promise<boolean | number> {
    // Normalizamos los valores de "stereo" y "config", si los hay.
    stereo = this.getNormalizedStereo(stereo);
    config = this.getNormalizedConfig(config);

    const newReproductionId = await SoundPlayer1.playSound(
      env,
      category,
      soundName,
      soundSrc,
      config,
      stereo
    );

    // Devolverá el id de la reproducción creada o "false".
    return newReproductionId;
  }

  stopSound(
    env: AudioEnvironment,
    category: SoundCategory,
    soundName: string,
    soundId?: number
  ) {
    SoundPlayer1.stopSound(env, category, soundName, soundId);
  }

  stopCategorySounds(env: AudioEnvironment, category: SoundCategory) {
    SoundPlayer1.stopCategorySounds(env, category);
  }

  stopEnvSounds(env: AudioEnvironment) {
    SoundPlayer1.stopEnvSounds(env);
  }

  stopAllSounds() {
    SoundPlayer1.stopAllSounds();
  }

  pauseSound(
    env: AudioEnvironment,
    category: SoundCategory,
    soundName: string
  ) {
    SoundPlayer1.pauseSound(env, category, soundName);
  }

  pauseCategorySounds(env: AudioEnvironment, category: SoundCategory) {
    SoundPlayer1.pauseCategorySounds(env, category);
  }

  pauseEnvSounds(env: AudioEnvironment) {
    SoundPlayer1.pauseEnvSounds(env);
  }

  pauseAllSounds() {
    SoundPlayer1.pauseAllSounds();
  }

  resumeSound(
    env: AudioEnvironment,
    category: SoundCategory,
    soundName: string
  ) {
    SoundPlayer1.resumeSound(env, category, soundName);
  }

  resumeCategorySounds(env: AudioEnvironment, category: SoundCategory) {
    SoundPlayer1.resumeCategorySounds(env, category);
  }

  resumeEnvSounds(env: AudioEnvironment) {
    SoundPlayer1.resumeEnvSounds(env);
  }

  resumeAllSounds() {
    SoundPlayer1.resumeAllSounds();
  }

  setSoundVolume(
    env: AudioEnvironment,
    category: SoundCategory,
    soundName: string,
    newVolume: number,
    soundId?: number
  ) {
    const normalizedVolume = this.getNormalizedVolume(newVolume);

    const result = SoundParameterController1.setSoundVolume(
      env,
      category,
      soundName,
      normalizedVolume,
      soundId
    );

    return result;
  }

  setCategoryVolume(
    env: AudioEnvironment,
    category: SoundCategory,
    newVolume: number
  ) {
    const normalizedVolume = this.getNormalizedVolume(newVolume);

    SoundParameterController1.setCategoryVolume(
      env,
      category,
      normalizedVolume
    );
  }

  setEnvVolume(env: AudioEnvironment, newVolume: number) {
    const normalizedVolume = this.getNormalizedVolume(newVolume);

    for (const cat in SoundStore1.audioStore[env]) {
      const category = cat as SoundCategory;

      SoundParameterController1.setCategoryVolume(
        env,
        category,
        normalizedVolume
      );
    }
  }

  setGlobalVolume(newVolume: number) {
    const normalizedVolume = this.getNormalizedVolume(newVolume);

    SoundParameterController1.setGlobalVolume(normalizedVolume);
  }

  setSoundRate(
    env: AudioEnvironment,
    category: SoundCategory,
    soundName: string,
    newRate: number,
    soundId?: number
  ) {
    const normalizedRate = this.getNormalizedRate(newRate);

    SoundParameterController1.setSoundRate(
      env,
      category,
      soundName,
      normalizedRate,
      soundId
    );
  }

  setCategoryRate(
    env: AudioEnvironment,
    category: SoundCategory,
    newRate: number
  ) {
    const normalizedRate = this.getNormalizedRate(newRate);

    SoundParameterController1.setCategoryRate(env, category, normalizedRate);
  }

  setEnvRate(env: AudioEnvironment, newRate: number) {
    const normalizedRate = this.getNormalizedRate(newRate);

    for (const cat in SoundStore1.audioStore[env]) {
      const category = cat as SoundCategory;

      SoundParameterController1.setCategoryRate(env, category, normalizedRate);
    }
  }

  setGlobalRate(newRate: number) {
    const normalizedRate = this.getNormalizedRate(newRate);

    SoundParameterController1.setGlobalRate(normalizedRate);
  }

  setStereoForSound(
    env: AudioEnvironment,
    category: SoundCategory,
    soundName: string,
    newStereoValue: number,
    soundId?: number
  ) {
    const normalizedStereo = this.normalizeConfigValues(
      "stereo",
      newStereoValue
    ) as number;

    SoundParameterController1.setStereoForSound(
      env,
      category,
      soundName,
      normalizedStereo,
      soundId
    );
  }

  setStereoForCategory(
    env: AudioEnvironment,
    category: SoundCategory,
    newStereoValue: number
  ) {
    const normalizedStereo = this.normalizeConfigValues(
      "stereo",
      newStereoValue
    ) as number;

    SoundParameterController1.setStereoForCategory(
      env,
      category,
      normalizedStereo
    );
  }

  setStereoForEnv(env: AudioEnvironment, newStereoValue: number) {
    const normalizedStereo = this.normalizeConfigValues(
      "stereo",
      newStereoValue
    ) as number;

    for (const cat in SoundStore1.audioStore[env]) {
      const category = cat as SoundCategory;

      SoundParameterController1.setStereoForCategory(
        env,
        category,
        normalizedStereo
      );
    }
  }

  setStereoGlobal(newStereoValue: number) {
    const normalizedStereo = this.normalizeConfigValues(
      "stereo",
      newStereoValue
    ) as number;

    SoundParameterController1.setStereoGlobal(normalizedStereo);
  }

  fadeSound(
    env: AudioEnvironment,
    category: SoundCategory,
    soundName: string,
    fadeValues: FadeValuesType,
    soundId?: number
  ) {
    const normalizedFade = this.getNormalizedFadeValues(fadeValues);

    SoundEffects1.fadeSound(env, category, soundName, normalizedFade, soundId);
  }

  fadeCategory(
    env: AudioEnvironment,
    category: SoundCategory,
    fadeValues: FadeValuesType
  ) {
    const normalizedFade = this.getNormalizedFadeValues(fadeValues);

    SoundEffects1.fadeCategory(env, category, normalizedFade);
  }

  fadeEnv(env: AudioEnvironment, fadeValues: FadeValuesType) {
    const normalizedFade = this.getNormalizedFadeValues(fadeValues);

    for (const cat in SoundStore1.audioStore[env]) {
      const category = cat as SoundCategory;

      SoundEffects1.fadeCategory(env, category, normalizedFade);
    }
  }

  fadeGlobal(fadeValues: FadeValuesType) {
    const normalizedFade = this.getNormalizedFadeValues(fadeValues);

    SoundEffects1.fadeGlobal(normalizedFade);
  }

  // Crea una nueva reproducción (e instancia, si no existía ya) y le aplica un valor stereo que cambia con el tiempo.
  // Siempre que se utilice este método, usar un nombre de sonido único, para que sus timeouts no sean eliminados por otra reproducción del mismo sonido al terminar.
  async createAnimatedPanSound(
    env: AudioEnvironment,
    category: SoundCategory,
    soundName: string,
    src: string,
    initialStereoValue: number,
    finalStereoValue: number,
    durationMs: number,
    delayMs: number = 0,
    config?: HowlOptions
  ) {
    // Normalizamos los valores:
    initialStereoValue = this.normalizeConfigValues(
      "stereo",
      initialStereoValue
    ) as number;

    finalStereoValue = this.normalizeConfigValues(
      "stereo",
      finalStereoValue
    ) as number;

    SoundEffects1.createAnimatedPanSound(
      env,
      category,
      soundName,
      src,
      initialStereoValue,
      finalStereoValue,
      durationMs,
      delayMs,
      config
    );
  }

  // Este método crea un loop para un sonido no optimizado para ello (el final y el principio son muy distintos y se notaría el corte).
  // Para sonidos optimizados, utilizar directamente la propiedad "loop: true" al reproducir el sonido (.playSound())
  // Este método crea una nueva instancia - reproducción  a través de ".playSound()".
  // Si queremos crear un loop con valores stereo personalizados, debemos indicarlos en "stereoValue", ya que no hay forma en Howler de obtener el valor
  // de estereo de una reproducción en curso.
  // Siempre que se utilice este método, usar un nombre de sonido único, para que sus intervals no sean eliminados por otra reproducción del mismo sonido al terminar.
  async createLoopWhithFade(
    env: AudioEnvironment,
    category: SoundCategory,
    soundName: string,
    src: string,
    fadeDuration: number, // Duración del fundido en milisegundos.
    securityMargin: number, // Margen de seguridad en milisegundos para asegurarnos de que el fundido se ha completado antes de que termine la reproducción, y para evitar finales abruptos en algunos ficheros de audio.
    config?: HowlOptions,
    stereoValue?: number
  ): Promise<boolean> {
    stereoValue = this.getNormalizedStereo(stereoValue);

    const result = await SoundEffects1.createLoopWhithFade(
      env,
      category,
      soundName,
      src,
      fadeDuration,
      securityMargin,
      config,
      stereoValue
    );

    return result;
  }

  // Siempre que se utilice este método, usar un nombre de sonido único, para que sus timeouts no sean eliminados
  // por otra reproducción del mismo sonido al terminar.
  createSoundscape(
    env: AudioEnvironment,
    soundscapeName: string,
    mainAmbientSound: MainAmbientSound[],
    secondarySounds?: SecondarySound[]
  ) {
    // Normalizamos los valores de "config" y "stereoValue" para todos los sonidos, si existen:
    mainAmbientSound.forEach((mainSound) => {
      mainSound.config = this.getNormalizedConfig(mainSound.config);
      mainSound.stereoValue = this.getNormalizedStereo(mainSound.stereoValue);
    });

    if (secondarySounds) {
      secondarySounds.forEach((secSound) => {
        secSound.config = this.getNormalizedConfig(secSound.config);
        secSound.stereoValue = this.getNormalizedStereo(secSound.stereoValue);
      });
    }

    SoundscapesCreator1.createSoundscape(
      env,
      soundscapeName,
      mainAmbientSound,
      secondarySounds
    );
  }

  pauseSoundscape(env: AudioEnvironment, soundscapeName: string) {
    SoundscapesCreator1.controlSoundscapeReproduction(
      env,
      soundscapeName,
      "pause"
    );
  }

  resumeSoundscape(env: AudioEnvironment, soundscapeName: string) {
    SoundscapesCreator1.controlSoundscapeReproduction(
      env,
      soundscapeName,
      "resume"
    );
  }

  stopSoundscape(env: AudioEnvironment, soundscapeName: string) {
    SoundscapesCreator1.controlSoundscapeReproduction(
      env,
      soundscapeName,
      "stop"
    );
  }

  fadeSoundscape(
    env: AudioEnvironment,
    fadeDuration: number,
    endValue: number,
    initialValue?: number,
    soundscapeName?: string
  ) {
    const normalizedFade = this.getNormalizedFadeValues({
      final: endValue,
      milliseconds: fadeDuration,
    });

    let normalizedInitialValue: number | undefined = undefined;

    if (initialValue) {
      normalizedInitialValue = this.getNormalizedVolume(initialValue);
    }

    SoundscapesCreator1.fadeSoundscape(
      env,
      normalizedFade.milliseconds,
      normalizedFade.final,
      normalizedInitialValue,
      soundscapeName
    );
  }
}
