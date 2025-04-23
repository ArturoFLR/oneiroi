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
  visited?: boolean;
  hidden?: boolean;
  reachableCells?: ReachableCell[];
  doorsToShow?: SomeDoorsToShow;
  event?: string;
  hasPuzzle?: boolean;
  hasNpc?: boolean;
  hasSpirit?: boolean;
  imageSrc?: string;
  items?: Item[];
}
