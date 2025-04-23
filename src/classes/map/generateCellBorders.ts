import MapCell from "./MapCell";

type BordersType = "void" | "cell" | "group"; //"void" se usa cuando la casilla linda con una casilla vacía (void) o con el borde del mapa. "cell" cuando linda con una casilla que no es del mismo grupo (group).

export type BordersToShow = {
  north: BordersType;
  east: BordersType;
  south: BordersType;
  west: BordersType;
};

// Esta función comprueba las celdas adyacentes a la introducida como parámetro, y determina qué bordes deben dibujarse y cómo:
// Cuando en la celda adyacente hay otra celda con contenido, cada una dibuja un borde con la mitad del grosor deseado (si queremos un borde de 2px, cada una dibuja un borde de 1px)
// Cuando la celda adyacente con contenido forma parte del mismo grupo (y el grupo no es ""), no dibujamos ningún borde.
// Cuando en la celda adyacente hay una celda "void" o no hay celda (borde del mapa) dibujamos un borde más grueso y de otro color para que se forme un "marco" para el mapa.
function generateCellBorders(
  analizedCell: MapCell,
  cellsArray: MapCell[]
): BordersToShow {
  const analizedCellCol = analizedCell.col;
  const analizedCellRow = analizedCell.row;

  const cellToTheLeft = cellsArray.find(
    (cell) => cell.col === analizedCellCol - 1 && cell.row === analizedCellRow
  );

  const cellToTheRight = cellsArray.find(
    (cell) => cell.col === analizedCellCol + 1 && cell.row === analizedCellRow
  );

  const cellUp = cellsArray.find(
    (cell) => cell.row === analizedCellRow - 1 && cell.col === analizedCellCol
  );

  const cellDown = cellsArray.find(
    (cell) => cell.row === analizedCellRow + 1 && cell.col === analizedCellCol
  );

  return {
    north: getBorder(cellUp, analizedCell),
    east: getBorder(cellToTheRight, analizedCell),
    south: getBorder(cellDown, analizedCell),
    west: getBorder(cellToTheLeft, analizedCell),
  };
}

function getBorder(
  neighborCell: MapCell | undefined,
  analizedCell: MapCell
): BordersType {
  // Caso 1: No hay celda adyacente o es "void"/hidden
  if (!neighborCell || neighborCell.hidden || neighborCell.group === "void") {
    return "void";
  }

  // Caso 2: Celda válida, determinar si es del mismo grupo
  return analizedCell.group === neighborCell.group && analizedCell.group !== ""
    ? "group"
    : "cell";
}

export default generateCellBorders;
