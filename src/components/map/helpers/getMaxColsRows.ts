import MapCell from "../../../classes/map/MapCell";

// Facilita el número de columnas o filas del mapa.
const getMaxColsRows = (cells: MapCell[], dimension: "col" | "row"): number => {
  if (cells.length === 0) return 0;
  return Math.max(...cells.map((cell) => cell[dimension]));
};

export default getMaxColsRows;
