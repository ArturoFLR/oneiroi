import { LightningSize, RainIntensity } from "../cinematics/cinematicTypes";

export type ModalImgPosition = "left" | "center" | "right";

export interface ModalData {
  startImgUrl?: string;
  startImgAlt?: string;
  startImgIsWide?: boolean;
  startImgPosition?: ModalImgPosition;
  startImgBorder?: boolean; // Aplica un borde de 2px blanco
  text: string[];
  endImgUrl?: string;
  endImgAlt?: string;
  endImgIsWide?: boolean;
  endImgPosition?: ModalImgPosition;
  endImgBorder?: boolean; // Aplica un borde de 2px blanco
  onOkClick?: () => void;
}

export type ScenarioRainData = {
  intensity: RainIntensity; //Genera más o menos gotas que caen a más o menos velocidad.
  isStarting: boolean; // Si es true, comenzará a llover en ese momento. Si es false, las gotas estarán por toda la pantalla desde el inicio.
  size: number; //El tamaño de las gotas. 1 se ve bien en la mayoría de los casos.
};

export type ScenarioLightningData = {
  size: LightningSize[]; //Fuerza del rayo. Si se quieren rayos de varias intensidades, se pueden poner varias en el array. Si no, se pone solo una.
  intervalRange: [number, number]; //Intervalo de tiempo (en ms) mínimo y máximo entre rayos.
};

export type ScenarioDistortionData = {
  showDistortion: boolean; // Es obligatorio este parámetro porque todos los demás son opcionales. Si no se usara, no habría diferencia entre no querer distorsión y querer distorsión con los valores por defecto.
  initialValues?: number[]; // Valores por defecto: [0.1, 0.2]
  maxValues?: number[]; // Valores por defecto:  [0.2, 0.3]
  increment?: number; // Valor por defecto: 0.0001. Cuanto mayor sea el valor, más suave es la ondulación.
  speed?: number; // Valor por defecto: 0.099
  intensity?: number; // Valor por defecto: 4
};

export type ScenarioVideoFxData = {
  // TODO: Hay que pensar bien cómo gestionar el loop de los vídeos, ya que no va a funcionar igual que en las cinemáticas.
  src: string; //La url del video.
  size: string; //El width en porcentaje respecto al contenedor padre. Ejemplo: "100%" o "50%"
  positionTop: string; //Valor de top (posicionamiento absoluto) en porcentaje
  positionLeft: string; //Valor de left (posicionamiento absoluto) en porcentaje
  delay: number; //Retraso en el comienzo, en milisegundos
  initialFadeDuration: number; //Tiempo en ms de fade-in cuando comienza el vídeo (por si el inicio del mismo es abrupto, como el humo)
  finalFadeDuration: number; // Tiempo en ms de fade-out al acabar el vídeo, por si es abrupto. Sólo se aplica si no hay loop.
  loop: boolean; //Se reproduce en loop?  El loop se aplicará sin fade entre reproducciones, por lo que sólo se deben poner en loop los vídeos cuyo final encaje con una nueva reproducción. Si no, mejor usar varios videoFx y coordinarlos mediante delay y sus fade-outs con los fade-in de los siguientes

  // El siguiente parámetro lo he añadido yo, hay que implementar su uso:
  loopInterval: number; // Intervalo en ms entre el final de un loop y el comienzo del siguiente. Sólo se aplica si loop es true.

  playFrom?: number; //Permite que el vídeo comience su reproducción desde el ms indicado.
  opacity?: number; //Opacidad del vídeo, de 0 a 1. Por defecto es 1.
  extraCss?: string; //Se utiliza para poder añadir filtros o efectos css que ayuden a integrar el vídeo con el fondo. Funciona bien esto: "mix-blend-mode: exclusion;"
  speed?: number; // Velocidad de reproducción. Velocidad por defecto: 1. Usar 2 para el doble, 0.5 para la mitad, -1 para reproducir en reversa.
};
