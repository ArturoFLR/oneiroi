import { NPCName } from "../../store/slices/aiChatSlice";
import Item from "../item/Item";
import { DoorsToShow, MapCellConfig, NamePosition } from "./mapTypes";

import placeholderBackgSrc from "@assets/graphics/scenarios/placeholder-background.jpg";

export default class MapCell {
  id: number;
  col: number;
  row: number;
  group: string; // Las celdas vacías pertenecerán al grupo "void". Las que no pertenezcan a un grupo tendrán ""; Las celdas que forman parte de un mismo grupo compartirán su imagen, items, npcs, etc (se tomarán de la primera que tenga esos datos). Si queremos que una habitación tenga dos zonas diferenciadas, deberemos crear 2 grupos (salón A y salón B, por ejemplo).
  mainGroupCellId: number; // Si la celda pertenece a un grupo, aquí irá el id de la celda principal del grupo (la que tiene la imagen, npcs, items, etc). Si no pertenece a ningún grupo, será null.
  name: string; // Nombre de la celda que aparecerá en el mapa. Cuando hay un grupo de celdas, sólo se debe poner "name" en una de ellas.
  namePosition: NamePosition; //  Dónde se colocará el nombre de la celda para que quede bien cuando forma parte de un grupo.
  numberOfVisits: number; // Las veces que ha estado el jugador. Más flexible que un boolena a la hora de crear eventos.
  hidden: boolean; // Afecta a su representación en el mapa. Para ver si es accesible se tendrá en cuenta el "reachableCells" de las demás casillas.
  reachableCells: null | number[]; // Lista de ids de celdas a las que se puede ir desde esta celda.
  doorsToShow: DoorsToShow; // Sólo se usa para representarlas gráficamente. Se puede ir de una celda a otra aunque no haya puerta (si, por ejemplo, pertenecen al mismo grupo "salón")
  npcsList: NPCName[] | null; // Si la celda pertenece a un grupo, solo se tomarán los npcs de la celda principal del grupo.
  hasPuzzle: boolean;
  hasNpc: boolean;
  hasSpirit: boolean;
  imageSrc: string; // Si la celda pertenece a un grupo, solo se tomará la imagen de la celda principal del grupo.
  widePicture: boolean;
  items: null | Item[]; // Si la celda pertenece a un grupo, solo se tomarán los items de la celda principal del grupo.
  onEnter: null | (() => void); // Eventos a ejecutar al entrar en una casilla (puede no hacer nada hasta que "numberOfVisits" tenga un valor concreto)
  onExit: null | (() => void); // Eventos a ejecutar al salir de una casilla.
  pausableTimeouts: number[] = []; // Colección de timeouts, para poder ser pausados (por ej. durante una cinemática o combate) o limpiados al salir del mapa.
  pausableIntervals: number[] = []; // Colección de intervals. Ver punto anterior.

  constructor(config: MapCellConfig) {
    this.id = config.id;
    this.col = config.col;
    this.row = config.row;
    this.group = config.group ?? "void";
    this.mainGroupCellId = config.mainGroupCellId ?? this.id;
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
    this.npcsList = config.npcsList ?? null;
    this.hasPuzzle = config.hasPuzzle ?? false;
    this.hasNpc = config.hasNpc ?? false;
    this.hasSpirit = config.hasSpirit ?? false;
    this.imageSrc = config.imageSrc ?? placeholderBackgSrc;
    this.widePicture = config.widePicture ?? true;
    this.items = config.items ?? null;
    this.onEnter = config.onEnter ?? null;
    this.onExit = config.onExit ?? null;
  }
}
