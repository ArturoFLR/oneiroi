import Item from "../item/Item";
import {
  DoorsToShow,
  MapCellConfig,
  NamePosition,
  ReachableCell,
} from "./mapTypes";

import placeholderBackgSrc from "@assets/graphics/scenes/placeholder-background.jpg";

export default class MapCell {
  id: number;
  col: number;
  row: number;
  group: string; // Las celdas vacías pertenecerán al grupo "void". "pasilloH" es para pasillos horizontales, "pasilloV" para verticales. Las que no pertenezcan a un grupo tendrán "";
  name: string; // Nombre de la celda que aparecerá en el mapa. Cuando hay un grupo de celdas, sólo se debe poner "name" en una de ellas.
  namePosition: NamePosition; //  Dónde se colocará el nombre de la celda para que quede bien cuando forma parte de un grupo.
  numberOfVisits: number; // Las veces que ha estado el jugador. Más flexible que un boolena a la hora de crear eventos.
  hidden: boolean; // Afecta a su representación en el mapa. Para ver si es accesible se tendrá en cuenta el "reachableCells" de las demás casillas.
  reachableCells: null | ReachableCell[];
  doorsToShow: DoorsToShow; // Sólo se usa para representarlas gráficamente. Se puede ir de una celda a otra aunque no haya puerta (si, por ejemplo, pertenecen al mismo grupo "salón")
  hasPuzzle: boolean;
  hasNpc: boolean;
  hasSpirit: boolean;
  imageSrc: string;
  items: null | Item[];
  onEnter: null | (() => void); // Eventos a ejecutar al entrar en una casilla (puede no hacer nada hasta que "numberOfVisits" tenga un valor concreto)
  onExit: null | (() => void); // Eventos a ejecutar al salir de una casilla.
  pausableTimeouts: number[] = []; // Colección de timeouts, para poder ser pausados (por ej. durante una cinemática o combate) o limpiados al salir del mapa.
  pausableIntervals: number[] = []; // Colección de intervals. Ver punto anterior.

  constructor(config: MapCellConfig) {
    this.id = config.id;
    this.col = config.col;
    this.row = config.row;
    this.group = config.group ?? "void";
    this.name = config.name ?? "";
    this.namePosition = config.namePosition ?? "middle";
    this.numberOfVisits = config.numberOfVisits ?? 0;
    this.hidden = config.hidden ?? false;
    this.reachableCells = config.reachableCells ?? null;
    this.doorsToShow = {
      north: "none",
      east: "none",
      south: "none",
      west: "none",
    };
    this.doorsToShow.north = config.doorsToShow?.north ?? "none";
    this.doorsToShow.east = config.doorsToShow?.east ?? "none";
    this.doorsToShow.south = config.doorsToShow?.south ?? "none";
    this.doorsToShow.west = config.doorsToShow?.west ?? "none";
    this.hasPuzzle = config.hasPuzzle ?? false;
    this.hasNpc = config.hasNpc ?? false;
    this.hasSpirit = config.hasSpirit ?? false;
    this.imageSrc = config.imageSrc ?? placeholderBackgSrc;
    this.items = config.items ?? null;
    this.onEnter = config.onEnter ?? null;
    this.onExit = config.onExit ?? null;
  }
}
