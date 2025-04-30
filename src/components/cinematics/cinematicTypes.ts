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

export interface CinematicShotAuto {
  id: number;
  mainImageUrl?: string; //Si no se define, se aplica el "backgroundColor"
  mainImageAlt?: string; //Texto alternativo para la imagen
  backgroundColor?: string; //Color que sustituye a la imagen de fondo
  widePicture: boolean; //Aunque no se indique imagen porque se quiera un color plano, hay que indicar qué tamaño de marco se desea.
  shotDuration?: number; //Duración del plano en milisegundos
  shotTransition?: ShotTransitionType; //Tipo de transición hacia el siguiente plano
  fadeTransition?: number; // Si optamos por una transición de tipo "fade", aquí podemos indicar su duración en milisegundos.
  zoom?: ZoomData;
  onEnd?: () => void; // Usar en el último plano, para decidir a qué parte del juego vamos al acabar la cinemática.
}

export type CinematicSceneAuto = CinematicShotAuto[];
