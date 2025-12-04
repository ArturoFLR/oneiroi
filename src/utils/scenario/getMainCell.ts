// Esta función comprueba si la celda pasada como parámetro (id) forma parte de un grupo.
// Si es así, devuelve la celda principal del grupo. Si no, devuelve la misma celda.

import Scenario from "../../classes/scenarios/Scenario";
import MapCell from "../..//classes/map/MapCell";

export default function getMainCell(scenario: Scenario, cellId: number) {
  const cell: MapCell | undefined = scenario.map.find(
    (mapCell) => mapCell.id === cellId
  );

  if (!cell) {
    console.log(
      `Error en getMainCell: La celda con id ${cellId} no existe en el mapa del escenario ${scenario.name}.`
    );
    return cellId;
  }

  if (cell.group && cell.group !== "void") {
    if (!cell.mainGroupCellId) {
      console.log(
        `Error en getMainCell: La celda con id ${cellId} pertenece al grupo "${cell.group}", pero no tiene definido mainGroupCellId.`
      );
      return cellId;
    } else {
      return cell.mainGroupCellId;
    }
  } else {
    return cellId;
  }
}
