import Item from "../item/Item";
import {
  DoorsToShow,
  MapCellConfig,
  NamePosition,
  ReachableCell,
} from "./mapTypes";

export default class MapCell {
  id: number;
  col: number;
  row: number;
  group: string; // Las celdas vacías pertenecerán al grupo "void". "pasilloH" es para pasillos horizontales, "pasilloV" para verticales. Las que no pertenezcan a un grupo tendrán "";
  name: string; // Nombre de la celda que aparecerá en el mapa. Cuando hay un grupo de celdas, sólo se debe poner "name" en una de ellas.
  namePosition: NamePosition;
  visited: boolean;
  hidden: boolean;
  reachableCells: null | ReachableCell[];
  doorsToShow: DoorsToShow; // Sólo se usa para representarlas gráficamente. Se puede ir de una celda a otra aunque no haya puerta (si, por ejemplo, pertenecen al mismo grupo "salón")
  event: string; // Si no hay ninguno usaremos ""
  hasPuzzle: boolean;
  hasNpc: boolean;
  hasSpirit: boolean;
  imageSrc: string;
  items: null | Item[];

  constructor(config: MapCellConfig) {
    this.id = config.id;
    this.col = config.col;
    this.row = config.row;
    this.group = config.group ?? "void";
    this.name = config.name ?? "";
    this.namePosition = config.namePosition ?? "middle";
    this.visited = config.visited ?? false;
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
    this.event = config.event ?? "";
    this.hasPuzzle = config.hasPuzzle ?? false;
    this.hasNpc = config.hasNpc ?? false;
    this.hasSpirit = config.hasSpirit ?? false;
    this.imageSrc =
      config.imageSrc ?? "../../public/images/maps/placeholder-background.jpg";
    this.items = config.items ?? null;
  }
}
