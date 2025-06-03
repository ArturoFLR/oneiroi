import Item from "../item/Item";

export interface ReachableCell {
  col: number;
  row: number;
}

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
  name?: string;
  namePosition?: NamePosition;
  numberOfVisits?: number;
  hidden?: boolean;
  reachableCells?: ReachableCell[];
  doorsToShow?: SomeDoorsToShow;
  hasPuzzle?: boolean;
  hasNpc?: boolean;
  hasSpirit?: boolean;
  imageSrc?: string;
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
