import { Subject } from "rxjs";
import { SoundDirectorAPI1, SoundPlayer1, SoundStore1 } from "./singletons";
import {
  AudioEnvironment,
  ChangeParamEvent,
  FadeValuesType,
  ModifyTimersEvent,
  PlayEvent,
  SoundCategory,
} from "./soundTypes";
import { HowlOptions } from "howler";
import { PausableTimeout } from "../../utils/PausableTimeout";
import { PausableInterval } from "../../utils/PausableInterval";

// Genera efectos complejos, como stereo animado, fade, loop con fade...
export default class SoundEffects {
  //// Patrón Singleton
  private static instance: SoundEffects;
  private constructor() {}
  public static getInstance(): SoundEffects {
    if (!SoundEffects.instance) {
      SoundEffects.instance = new SoundEffects();
    }
    return SoundEffects.instance;
  }
  //// FIN Patrón Singleton

  playEventEmitter = new Subject<PlayEvent>();

  changeParamEventEmitter = new Subject<ChangeParamEvent>();

  modifyTimersEventEmitter = new Subject<ModifyTimersEvent>();

  ////////////////////////////////////////////////////////////////////// MÉTODOS

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

  // Aunque Howler.js tiene un método fade, no es operativo, ya que hay que introducir el volumen desde el que comienza el fundido.
  // Lo lógico para evitar saltos de volumen es que este sea el volumen actual, pero podemos desconocerlo. Este método lo obtiene antes de aplicar fade.
  // Además, para el sonido y lo elimina (si procede) cuando el fundido es a "0".
  // Este método acepta un "soundId" porque es necesario para el método "createLoopWhithFade";
  fadeSound(
    env: AudioEnvironment,
    category: SoundCategory,
    soundName: string,
    fadeValues: FadeValuesType,
    soundId?: number
  ) {
    const updateFunction = (instance: Howl, playIds: number[], id?: number) => {
      if (id) {
        //No queda más remedio que usar aserción de tipos porque TypeScript infiere incorrectamente que el tipo de currentVolume cuando se usa .volume() usando "unknown" para el 1º parámetro (para que nos devuelva el volumen actual y no lo modifique) es "Howl", cuando en realidad es "number"
        const currentVolume = instance.volume(
          undefined!,
          id
        ) as unknown as number;
        instance.fade(
          currentVolume,
          fadeValues.final,
          fadeValues.milliseconds,
          id
        );
      } else {
        playIds.forEach((playId) => {
          const currentVolume = instance.volume(
            undefined!,
            playId
          ) as unknown as number;
          instance.fade(
            currentVolume,
            fadeValues.final,
            fadeValues.milliseconds,
            playId
          );
        });
      }

      //Si el fundido es hacia silencio total, añadimos listener para parar la reproducción y eliminar su id, pero sólo si queda tiempo
      // para que el fundido termine antes de que se acabe el sonido. Esto es así porque Howler dispara el evento "fade" cuando el sonido
      // llega hasta el final y termina su reproducción (evento "end"), aunque no haya dado tiempo a terminar el fade. Esto provoca que se
      // intente borrar el sonido 2 veces, una por el evento "end" y otra por "fade". Esto no pasa al revés: si se provoca un stop() del sonido
      // a causa del evento "fade", esto no activará el evento "end".
      const soundDuration = instance.duration();
      const currentTime = instance.seek(id);
      const soundTimeRemaining = (soundDuration - currentTime) * 1000;

      if (
        (fadeValues.final === 0 &&
          soundTimeRemaining > fadeValues.milliseconds) ||
        (fadeValues.final === 0 && category === "soundscapes")
      ) {
        instance.once("fade", () => {
          if (id) {
            this.emitNewPlayEvent({
              eventType: "stopId",
              env,
              category,
              soundName,
              id: id,
            });
          } else {
            this.emitNewPlayEvent({
              eventType: "stop",
              env,
              category,
              soundName,
            });
          }
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

  fadeCategory(
    env: AudioEnvironment,
    category: SoundCategory,
    fadeValues: FadeValuesType
  ) {
    const updateFunction = (
      instance: Howl,
      playIds: number[],
      soundName?: string
    ) => {
      playIds.forEach((playId) => {
        const currentVolume = instance.volume(
          undefined!,
          playId
        ) as unknown as number;
        instance.fade(
          currentVolume,
          fadeValues.final,
          fadeValues.milliseconds,
          playId
        );
      });

      //Si el fundido es hacia silencio total, añadimos listener para parar la reproducción y eliminar su id, pero sólo si queda tiempo
      // para que el fundido termine antes de que se acabe el sonido. Esto es así porque Howler dispara el evento "fade" cuando el sonido
      // llega hasta el final y termina su reproducción (evento "end"), aunque no haya dado tiempo a terminar el fade. Esto provoca que se
      // intente borrar el sonido 2 veces, una por el evento "end" y otra por "fade". Esto no pasa al revés: si se provoca un stop() del sonido
      // a causa del evento "fade", esto no activará el evento "end".
      const soundDuration = instance.duration();
      const currentTime = instance.seek();
      const soundTimeRemaining = (soundDuration - currentTime) * 1000;

      if (
        (fadeValues.final === 0 &&
          soundTimeRemaining > fadeValues.milliseconds) ||
        (fadeValues.final === 0 && category === "soundscapes")
      ) {
        instance.once("fade", () => {
          if (soundName) {
            this.emitNewPlayEvent({
              eventType: "stop",
              env,
              category,
              soundName,
            });
          }
        });
      }
    };

    return this.updateCategoryProperty(env, category, updateFunction);
  }

  fadeGlobal(fadeValues: FadeValuesType) {
    const updateFunction = (
      instance: Howl,
      playIds: number[],
      env?: AudioEnvironment,
      category?: SoundCategory,
      soundName?: string
    ) => {
      playIds.forEach((playId) => {
        const currentVolume = instance.volume(
          undefined!,
          playId
        ) as unknown as number;

        instance.fade(
          currentVolume,
          fadeValues.final,
          fadeValues.milliseconds,
          playId
        );
      });

      //Si el fundido es hacia silencio total, añadimos listener para parar la reproducción y eliminar su id, pero sólo si queda tiempo
      // para que el fundido termine antes de que se acabe el sonido. Esto es así porque Howler dispara el evento "fade" cuando el sonido
      // llega hasta el final y termina su reproducción (evento "end"), aunque no haya dado tiempo a terminar el fade. Esto provoca que se
      // intente borrar el sonido 2 veces, una por el evento "end" y otra por "fade". Esto no pasa al revés: si se provoca un stop() del sonido
      // a causa del evento "fade", esto no activará el evento "end".
      const soundDuration = instance.duration();
      const currentTime = instance.seek();
      const soundTimeRemaining = (soundDuration - currentTime) * 1000;

      if (
        (fadeValues.final === 0 &&
          soundTimeRemaining > fadeValues.milliseconds) ||
        (fadeValues.final === 0 && category === "soundscapes")
      ) {
        instance.once("fade", () => {
          if (env && category && soundName) {
            this.emitNewPlayEvent({
              eventType: "stop",
              env,
              category,
              soundName,
            });
          }
        });
      }
    };

    return this.updateGlobalProperty(updateFunction);
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
    //Creamos la reproducción.
    const playId = await SoundDirectorAPI1.playSound(
      env,
      category,
      soundName,
      src,
      config
    );

    //Establecemos el valor inicial de stereo, si se ha podido iniciar la reproducción.
    if (typeof playId === "number") {
      this.emitNewChangeParamEvent({
        parameterType: "stereo",
        env,
        category,
        soundName,
        newValue: initialStereoValue,
        id: playId,
      });
    } else {
      console.warn(
        `createAnimatedPanSound: No se ha podido crear la reproducción en el método "playSound" de ${soundName} en ${env}, ${category}`
      );
      return false;
    }

    let animationFrameId: number;
    let startTime: number; // Almacena cuándo se inició la animación

    // Programar el inicio después del delay y almacenar el id del timeout para poder cancelarlo si se detiene (stop) la reproducción.
    const userDelayTimeout = new PausableTimeout(() => {
      startTime = Date.now();
      animationFrameId = requestAnimationFrame(animate);
      this.emitNewModifyTimersEvent({
        eventType: "addAnimationFrame",
        env,
        category,
        soundName,
        timer: animationFrameId,
      });
    }, delayMs);

    this.emitNewModifyTimersEvent({
      eventType: "addTimeout",
      env,
      category,
      soundName,
      timer: userDelayTimeout,
    });

    const animate = () => {
      // 1. Verificamos que el sonido sigue activo (existe y no se ha parado)
      if (
        !SoundStore1.audioStore[env][category]?.[soundName] ||
        !SoundStore1.audioStore[env][category][soundName].ids.includes(playId)
      ) {
        cancelAnimationFrame(animationFrameId);
        return;
      }

      // 2. Calcular el tiempo transcurrido desde que comenzó la animación
      const timeElapsed = Date.now() - startTime;

      // 3. Calcula el progreso de la animación entre 0 y 1. Si timeElapsed / durationMS es 0.1, representa un 10% de progreso.
      // Cuando timeElapsed sea igual a durationMS, el resultado de dividirlos será 1 = 100%
      // Se usa Math.min para asegurarnos de que el valor de progress no supere nunca "1"
      // (timeElapsed / durationMs puede ser mayor que durationMs si se retrasa la animación por sobrecarga de trabajo).
      const progress = Math.min(timeElapsed / durationMs, 1);

      // 4. Calcular valor estéreo actual. (finalStereoValue - initialStereoValue) es la diferencia entre dichos valores,
      // es decir, el total del camino a recorrer.
      // Cuando progress es menor a 1, el valor de currentStereo será una fracción de ese camino. Cuando progress sea 1, habremos llegado al final.
      const currentStereo =
        initialStereoValue + (finalStereoValue - initialStereoValue) * progress;

      // 5. Aplicamos el valor
      this.emitNewChangeParamEvent({
        parameterType: "stereo",
        env,
        category,
        soundName,
        newValue: currentStereo,
        id: playId,
      });

      // 6. Continuamos la animación si progress es menor a 1
      if (progress < 1) {
        // Eliminamos el frame Id anterior:
        this.emitNewModifyTimersEvent({
          eventType: "deleteAnimationFrame",
          env,
          category,
          soundName,
          timer: animationFrameId,
        });

        // Generamos el nuevo frame y lo almacenamos:
        animationFrameId = requestAnimationFrame(animate);

        this.emitNewModifyTimersEvent({
          eventType: "addAnimationFrame",
          env,
          category,
          soundName,
          timer: animationFrameId,
        });
      } else {
        // Aseguramos que el valor final sea exacto
        this.emitNewChangeParamEvent({
          parameterType: "stereo",
          env,
          category,
          soundName,
          newValue: finalStereoValue,
          id: playId,
        });
      }
    };
  }

  // Este método crea un loop para un sonido no optimizado para ello (el final y el principio son muy distintos y se notaría el corte).
  // Para sonidos optimizados, utilizar directamente la propiedad "loop: true" de config al reproducir el sonido (.playSound())
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
    // Creamos el primer Playback
    const playback1Id = await SoundDirectorAPI1.playSound(
      env,
      category,
      soundName,
      src,
      config
    );

    if (typeof playback1Id !== "number") {
      console.warn(
        `SoundEffects - createLoopWhithFade: No se ha podido crear la reproducción de ${soundName} en ${env}, ${category}`
      );
      return false;
    }

    const instanceData =
      SoundStore1.audioStore[env][category][soundName].instance;

    // Aplicamos el valor de stereo, si se ha indicado.
    if (typeof stereoValue === "number") {
      this.emitNewChangeParamEvent({
        parameterType: "stereo",
        env,
        category,
        soundName,
        newValue: stereoValue,
        id: playback1Id,
      });
    }

    // Determinamos la duración de la reproducción actual.
    const playbackDuration: number = instanceData.duration(playback1Id);

    // Calculamos el momento en que debe comenzar el fade-out
    const timeToFade =
      playbackDuration - fadeDuration / 1000 - securityMargin / 1000;

    const intervalDuration = 150; // Esta cifra se puede disminuir si se quiere una transición más suave, con más pasos.
    let intervalId: PausableInterval;

    // Creamos una función que se encargará de generar los siguientes Playbacks para mantener el loop.
    const generateNewPlayback = async (
      currentPlaybackId: number
    ): Promise<boolean> => {
      // Howler no permite disparar un evento cuando se alcanza un determinado tiempo de reproducción, por lo que debemos crear un Interval
      // que compruebe continuamente el tiempo de reproducción y ejecute las acciones correspondientes (fade-out del primer Playback y creación del 2º Playback).

      // Verificamos si el playback sigue activo
      if (
        !SoundStore1.audioStore[env][category]?.[soundName]?.ids.includes(
          currentPlaybackId
        )
      ) {
        return false;
      }

      intervalId = new PausableInterval(async () => {
        const currentTime = instanceData.seek(currentPlaybackId);

        if (currentTime >= timeToFade) {
          intervalId.clear();

          // Fade-out del primer Playback
          this.fadeSound(
            env,
            category,
            soundName,
            { final: 0, milliseconds: fadeDuration },
            currentPlaybackId
          );

          // Creación del 2º Playback
          const newPlaybackConfig = { ...config, volume: 0, src: src };
          const newPlaybackId = await SoundPlayer1.playSound(
            env,
            category,
            soundName,
            src,
            newPlaybackConfig
          );

          if (typeof newPlaybackId === "number") {
            // Aplicamos el valor de stereo, si se ha indicado.
            if (typeof stereoValue === "number")
              instanceData.stereo(stereoValue, newPlaybackId);

            // Aplicamos Fade-in al 2º playback
            this.fadeSound(
              env,
              category,
              soundName,
              {
                final: typeof config?.volume === "number" ? config.volume : 1,
                milliseconds: fadeDuration,
              },
              newPlaybackId
            );

            // Aplicamos el callback para que se generen nuevos Playbacks indefinidamente.
            instanceData.once("fade", () => generateNewPlayback(newPlaybackId));
          } else {
            console.warn(
              "SoundEffects - createLoopWhithFade: Fallo al crear segundo playback"
            );
            this.emitNewPlayEvent({
              eventType: "stop",
              env,
              category,
              soundName,
            });
          }
        }
      }, intervalDuration);
      // Como sólo se llega a esta parte si el interval anterior ya ha cumplido su función, podemos limpiar todos los intervals (aunque sólo habrá 1, el anterior) antes de añadir el nuevo.
      this.emitNewModifyTimersEvent({
        eventType: "deleteInterval",
        env,
        category,
        soundName,
      });

      this.emitNewModifyTimersEvent({
        eventType: "addInterval",
        env,
        category,
        soundName,
        timer: intervalId,
      });
      return true;
    };

    // Ejecutamos la función para iniciar el loop.
    const isLoopCreated = await generateNewPlayback(playback1Id);

    if (!isLoopCreated) {
      return false;
    } else return true;
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
