import { HowlOptions } from "howler";
import {
  MainAmbientSound,
  SecondarySound,
  SoundCategory,
} from "src/classes/sound/soundTypes";

export type ShotTransitionType = "cut" | "fade";

export interface CinematicTremorFXData {
  intensity: "low" | "medium" | "high";
  delay: number;
  // Hay que tener en cuenta que si aplicamos un delay de 1000 y venimos de un fade-in de 5000, el temblor
  //empezará a verse a los 6000ms (No se puede empezar un temblor en mitad de un fade). Pero si indicamos
  //delay = 0, el temblor se aplicará en todo el fade-in.
}

export type LightningSize = "small" | "medium" | "big";
export type RainIntensity = "low" | "medium" | "high";

export interface LightningData {
  delay: number; //Retraso en su ejecución, en milisegundos
  size: LightningSize; //Fuerza del rayo
}

export interface RainData {
  delay: number; //Retraso en su ejecución, en milisegundos
  intensity: RainIntensity; //Genera más o menos gotas que caen a más o menos velocidad.
  isStarting: boolean; // Si es true, comenzará a llover en ese momento. Si es false, las gotas estarán por toda la pantalla desde el inicio.
  size: number; //El tamaño de las gotas. 1 se ve bien en planos sin zoom. Cuanto mayor sea el zoom, menor debería ser el tamaño que indiquemos.
}

export interface VideoFxData {
  static: boolean; //Indica si el efecto permite ser movido por un efecto de zoom / panning (ocupa sólo una parte de la pantalla) o no (ocupa toda la pantalla y si se desplaza la imagen se verá donde se corta )
  src: string; //La url del video.
  size: string; //El width en porcentaje
  positionTop: string; //Valor de top (posicionamiento absoluto) en porcentaje
  positionLeft: string; //Valor de left en porcentaje
  delay: number; //Retraso en el comienzo, en milisegundos
  initialFadeDuration: number; //Tiempo en ms de fade cuando comienza el vídeo (por si el inicio del mismo es abrupto, como el humo)
  finalFadeDuration: number; // Tiempo en ms al acabar el vídeo, por si es abrupto. Sólo se aplica si no hay loop.
  loop: boolean; //Se reproduce en loop?  El loop se aplicará sin fade entre reproducciones, por lo que sólo se deben poner en loop los vídeos cuyo final encaje con una nueva reproducción. Si no, mejor usar varios videoFx y coordinarlos mediante delay y sus fade-outs con los fade-in de los siguientes
  opacity?: number; //Por defecto es 1
  speed?: number; // Velocidad de reproducción. Velocidad por defecto: 1. Usar 2 para el doble, 0.5 para la mitad, -1 para reproducir en reversa.
  extraCss?: string; //Se utiliza para poder añadir filtros o efectos css que ayuden a integrar el vídeo con el fondo. Funciona bien esto: "mix-blend-mode: exclusion;"
}

export interface CinematicFXData {
  tremor?: CinematicTremorFXData;
  lightning?: LightningData[];
  rain?: RainData;
  videoFx?: VideoFxData[];
}

export interface ZoomData {
  zoomStartSize: number; //Tamaño inicial de la imagen, '1' para tamaño completo normal (modifica el estilo "scale"). Por regla general aplicaremos el doble de aumento que el desplazamiento. Ej. si queremos mover la imagen un 10% hacia la izq. necesitamos un aumento del 20% para que no se vea un espacio en negro por la dcha.
  zoomStartPosition: {
    top: number; //Posición inicial de la imagen en el eje Y (vertical). Se convertirá en PORCENTAJE. 10 => 10%
    left: number; //Posición inicial de la imagen en el eje X (horizontal). Se convertirá en PORCENTAJE. 10 => 10%
  };
  zoomEndSize: number; //Tamaño final de la imagen, '1' para tamaño completo normal (modifica el estilo "scale").
  zoomEndPosition: {
    top: number; //Se convertirá en PORCENTAJE. 10 => 10%
    left: number; //Se convertirá en PORCENTAJE. 10 => 10%
  };
  animType: "linear" | "ease-in" | "ease-out" | "ease-in-out";
}

export interface CinematicAmbientSound {
  soundscapeName: string;
  mainAmbientSounds: MainAmbientSound[];
  secondaryAmbientSounds?: SecondarySound[];
  delay: number; //Tiempo de espera antes de iniciar el sonido ambiente.
  prevAmbientFadeDuration: number; //Duración del fade-out del sonido ambiente al que vamos a sustituir. 0 es un corte abrupto.
  initialFadeDuration: number; //Duración del fade-in inicial del sonido ambiente. Puede ser 0.
  toVolume?: number; //Si usamos un fade inicial, podemos indicar hasta qué volumen subirá el sonido. Si no, será 1
  endTime?: number; //Cuándo se detiene el sonido ambiente, en milisegundos. Si no se indica, se detiene cuando llegue otro plano con ambiente distinto.
  fadeOutDuration?: number; //Duración del fade-out del sonido ambiente. Se usa cuando se ha especificado "endTime". Si no se indica, se detiene inmediatamente.
}

export interface CinematicUniqueSound {
  category: SoundCategory;
  soundName: string;
  soundSrc: string;
  config?: HowlOptions;
  stereo?: number;
  delay: number; //Tiempo de espera antes de reproducir el sonido.
  loop?: boolean; //Debe repetirse? Si usamos esto, sólo podremos parar el sonido mediante las "specialActions" de un plano posterior.
}

export type CinematicUniqueSounds = CinematicUniqueSound[];

export interface CinematicMusic {
  soundName: string;
  soundSrc: string;
  config?: HowlOptions; // Si queremos un fade-in inicial, debemos usar este parámetro para especificar volume = 0; Ajustaremos el volumen final con toVolume
  stereo?: number;
  loop: boolean; //Si la música se repite o no.
  delay: number;
  prevMusicFadeDuration: number; //Duración del fade-out de la música a la que vamos a sustituir. 0 es un corte abrupto.
  initialFadeDuration: number; //Duración del fade-in inicial. Puede ser 0.
  toVolume?: number; //Si usamos un fade inicial, podemos indicar hasta qué volumen subirá la música. Si no, será 1
  endTime?: number; //Cuándo se detiene la música, en milisegundos. Si no se indica, se detiene cuando llegue otro plano con música distinta o con valor "null".
  fadeOutDuration?: number; //Duración del fade-out de la música. Si no se indica, se detiene inmediatamente.
}

export interface CinematicShotAuto {
  id: number;
  mainImageUrl?: string; //Si no se define, se aplica el "backgroundColor"
  mainImageAlt?: string; //Texto alternativo para la imagen
  backgroundColor?: string; //Color que sustituye a la imagen de fondo
  widePicture: boolean; //Aunque no se indique imagen porque se quiera un color plano, hay que indicar qué tamaño de marco se desea.
  shotDuration?: number; //Duración del plano en milisegundos
  shotTransition?: ShotTransitionType; //Tipo de transición hacia el siguiente plano
  fadeDuration?: number; // Si optamos por una transición de tipo "fade", aquí podemos indicar su duración en milisegundos.
  zoom?: ZoomData;
  ambientSound?: CinematicAmbientSound | number; // Si indicamos un number estamos dando la orden de hacer un fade-out y estamos indicando la duración. Puede ser "0"
  uniqueSounds?: CinematicUniqueSounds;
  music?: CinematicMusic | number; // Si indicamos un number estamos dando la orden de hacer un fade-out y estamos indicando la duración. Puede ser "0"
  onEndAudioFadeDuration?: number; // Usar en el último plano, para indicar cuánto durará el fade-out de sonido y música antes de que acabe la cinemática.
  specialActions?: () => void; //Acciones especiales a realizar al iniciar el plano, como por ejemplo cambiar el volumen del sonido ambiente.
  specialActionsTimeouts?: number[]; //Almacena los posibles timeouts creados por specialActions, para que CinematicDirector pueda limpiarlos.
  specialActionsIntervals?: number[]; //Almacena los posibles intervals creados por specialActions, para que CinematicDirector pueda limpiarlos.
  specialFX?: CinematicFXData;
  onEnd?: () => void; // Usar en el último plano, para decidir a qué parte del juego vamos al acabar la cinemática.
}

export type CinematicSceneAuto = CinematicShotAuto[];

// Versiones simplificadas de CinematicShotAuto, sólo con los datos necesarios para el componente MainViewer.
export interface MainViewerActualShotData {
  id: number;
  mainImageUrl?: string; //Si no se define, se aplica el "backgroundColor"
  mainImageAlt?: string; //Texto alternativo para la imagen
  backgroundColor?: string; //Color que sustituye a la imagen de fondo
  widePicture: boolean; //Aunque no se indique imagen porque se quiera un color plano, hay que indicar qué tamaño de marco se desea.
  shotDuration: number; //Duración del plano en milisegundos
  shotTransition: ShotTransitionType; //Tipo de transición hacia el siguiente plano
  fadeDuration: number; // Si optamos por una transición de tipo "fade", aquí podemos indicar su duración en milisegundos.
  zoom?: ZoomData;
  specialFX: CinematicFXData | null;
}

export interface MainViewerNextShotData {
  id: number;
  mainImageUrl?: string; //Si no se define, se aplica el "backgroundColor"
  mainImageAlt?: string; //Texto alternativo para la imagen
  backgroundColor?: string; //Color que sustituye a la imagen de fondo
  widePicture: boolean; //Aunque no se indique imagen porque se quiera un color plano, hay que indicar qué tamaño de marco se desea.
  shotDuration: number; //Duración del plano en milisegundos
  zoom?: ZoomData;
  specialFX: CinematicFXData | null;
}

// Versión simplificada de  CinematicShotAuto, sólo con los datos necesarios para el componente CinematicSoundManager.
export interface CinematicSoundManagerShotData {
  ambientSound?: CinematicAmbientSound | number | null;
  uniqueSounds?: CinematicUniqueSounds | null;
  music?: CinematicMusic | number | null;
  onEndAudioFadeDuration?: number;
}

////////////////  Used in MainViewer.tsx
export interface ZoomAnimationData {
  data: Animation | null;
  progress: number;
  keyframes: Keyframe[] | null;
  options: KeyframeEffectOptions | null;
  shotId: number;
}

export type CinematicSoundManagerData = CinematicSoundManagerShotData[];
