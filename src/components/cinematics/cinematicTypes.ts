import { HowlOptions } from "howler";
import {
  AudioEnvironment,
  MainAmbientSound,
  SecondarySound,
  SoundCategory,
} from "src/classes/sound/soundTypes";

export type ShotTransitionType = "cut" | "fade";
export interface ZoomData {
  zoomStartSize: number; //Tamaño inicial de la imagen, '100' para tamaño completo normal.
  zoomStartPosition: {
    top: number; //Posición inicial de la imagen en el eje Y (vertical)
    left: number; //Posición inicial de la imagen en el eje X (horizontal)
  };
  zoomEndSize: number; //Tamaño final de la imagen.
  zoomEndPosition: {
    top: number;
    left: number;
  };
}

export interface CinematicAmbientSound {
  env: AudioEnvironment;
  soundscapeName: string;
  mainAmbientSounds: MainAmbientSound[];
  secondaryAmbientSounds?: SecondarySound[];
  delay: number; //Tiempo de espera antes de iniciar el sonido ambiente.
  initialFadeDuration: number; //Duración del fade-in inicial del sonido ambiente. Puede ser 0.
  endTime?: number; //Cuándo se detiene el sonido ambiente, en milisegundos. Si no se indica, se detiene cuando llegue otro plano con ambiente distinto.
  fadeOutDuration?: number; //Duración del fade-out  del sonido ambiente. Si no se indica, se detiene inmediatamente.
}

export interface CinematicUniqueSound {
  env: AudioEnvironment;
  category: SoundCategory;
  soundName: string;
  soundSrc: string;
  config?: HowlOptions;
  stereo?: number;
  delay: number; //Tiempo de espera antes de reproducir el sonido.
}

export type CinematicUniqueSounds = CinematicUniqueSound[];

export interface CinematicMusic {
  env: AudioEnvironment;
  category: SoundCategory;
  soundName: string;
  soundSrc: string;
  config?: HowlOptions;
  stereo?: number;
  loop: boolean; //Si la música se repite o no.
  delay: number;
  initialFadeDuration: number; //Duración del fade-in inicial. Puede ser 0.
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
  ambientSound?: CinematicAmbientSound | "stop"; // Si se indica stop, se detiene el sonido ambiente anterior.
  uniqueSounds?: CinematicUniqueSounds;
  music?: CinematicMusic | "stop"; // Si se indica stop, se detiene la música actual.
  specialActions?: () => void; //Acciones especiales a realizar al iniciar el plano, como por ejemplo cambiar el volumen del sonido ambiente.
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
}

export interface MainViewerNextShotData {
  id: number;
  mainImageUrl?: string; //Si no se define, se aplica el "backgroundColor"
  mainImageAlt?: string; //Texto alternativo para la imagen
  backgroundColor?: string; //Color que sustituye a la imagen de fondo
  widePicture: boolean; //Aunque no se indique imagen porque se quiera un color plano, hay que indicar qué tamaño de marco se desea.
  zoom?: ZoomData;
}

export interface CinematicSoundManagerShotData {
  ambientSound?: CinematicAmbientSound | "stop" | null;
  uniqueSounds?: CinematicUniqueSounds | null;
  music?: CinematicMusic | "stop" | null;
}

export type CinematicSoundManagerData = CinematicSoundManagerShotData[];
