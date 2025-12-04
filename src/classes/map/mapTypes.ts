import { NPCName } from "src/store/slices/aiChatSlice";
import Item from "../item/Item";
import MapCell from "./MapCell";

export type DoorsToShow = {
  north: "none" | "open" | "closed";
  east: "none" | "open" | "closed";
  south: "none" | "open" | "closed";
  west: "none" | "open" | "closed";
};

export type SomeDoorsToShow = {
  north?: "none" | "open" | "closed";
  east?: "none" | "open" | "closed";
  south?: "none" | "open" | "closed";
  west?: "none" | "open" | "closed";
};

export type NamePosition = "top" | "middle" | "bottom";

export interface MapCellConfig {
  id: number;
  col: number;
  row: number;
  group?: string;
  mainGroupCellId?: number;
  name?: string;
  namePosition?: NamePosition;
  numberOfVisits?: number;
  hidden?: boolean;
  reachableCells?: number[];
  npcsList?: NPCName[];
  doorsToShow?: SomeDoorsToShow;
  hasPuzzle?: boolean;
  hasNpc?: boolean;
  hasSpirit?: boolean;
  imageSrc?: string;
  widePicture?: boolean;
  items?: Item[];
  onEnter?: () => void;
  onExit?: () => void;
}

export type BordersType = "void" | "cell" | "group"; //"void" se usa cuando la casilla linda con una casilla vacía (void) o con el borde del mapa. "cell" cuando linda con una casilla que no es del mismo grupo (group).

export type BordersToShow = {
  north: BordersType;
  east: BordersType;
  south: BordersType;
  west: BordersType;
};

export type Map = MapCell[];
