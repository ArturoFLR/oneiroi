import { HowlOptions } from "howler";
import {
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
  soundscapeName: string;
  mainAmbientSounds: MainAmbientSound[];
  secondaryAmbientSounds?: SecondarySound[];
  delay: number; //Tiempo de espera antes de iniciar el sonido ambiente.
  initialFadeDuration: number; //Duración del fade-in inicial del sonido ambiente. Puede ser 0.
  endTime?: number; //Cuándo se detiene el sonido ambiente, en milisegundos. Si no se indica, se detiene cuando llegue otro plano con ambiente distinto.
  fadeOutDuration?: number; //Duración del fade-out  del sonido ambiente. Si no se indica, se detiene inmediatamente.
}

export interface CinematicUniqueSound {
  category: SoundCategory;
  soundName: string;
  soundSrc: string;
  config?: HowlOptions;
  stereo?: number;
  delay: number; //Tiempo de espera antes de reproducir el sonido.
}

export type CinematicUniqueSounds = CinematicUniqueSound[];

export interface CinematicMusic {
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
  ambientSound?: CinematicAmbientSound | number; // Si indicamos un number estamos dando la orden de hacer un fade-out y estamos indicando la duración. Puede ser "0"
  uniqueSounds?: CinematicUniqueSounds;
  music?: CinematicMusic | number; // Si indicamos un number estamos dando la orden de hacer un fade-out y estamos indicando la duración. Puede ser "0"
  onEndAudioFadeDuration?: number; // Usar en el último plano, para indicar cuánto durará el fade-out de sonido y música antes de que acabe la cinemática.
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
  ambientSound?: CinematicAmbientSound | number | null;
  uniqueSounds?: CinematicUniqueSounds | null;
  music?: CinematicMusic | number | null;
  onEndAudioFadeDuration?: number;
}

export type CinematicSoundManagerData = CinematicSoundManagerShotData[];
