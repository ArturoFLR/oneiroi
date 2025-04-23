import React from "react";
import MapCell from "../classes/MapCell";
import MapContainer from "./styledComponents/MapContainer";
import MapCellVoid from "./styledComponents/MapCellVoid";
import MapCellRoom from "./styledComponents/MapCellRoom";
import generateCellBorders from "../utils/generateCellBorders";
import getMaxColsRows from "../utils/getMaxColsRows";

type MapGeneratorProps = {
  mapCells: MapCell[];
};

function MapGenerator({ mapCells }: MapGeneratorProps) {
  const colsNumber = getMaxColsRows(mapCells, "col");

  function generateMapCells(): React.JSX.Element[] {
    const result: React.JSX.Element[] = [];

    mapCells.forEach((mapCell) => {
      if (mapCell.group === "void" || mapCell.hidden === true) {
        result.push(<MapCellVoid key={mapCell.id} />);
        return;
      } else {
        const cellBorders = generateCellBorders(mapCell, mapCells);

        result.push(
          <MapCellRoom
            key={mapCell.id}
            doorsToShow={mapCell.doorsToShow}
            bordersToShow={cellBorders}
            name={mapCell.name}
            namePosition={mapCell.namePosition}
            hasPuzzle={mapCell.hasPuzzle}
            hasNpc={mapCell.hasNpc}
            hasSpirit={mapCell.hasSpirit}
          />,
        );
      }
    });

    return result;
  }

  return <MapContainer $cols={colsNumber}>{generateMapCells()}</MapContainer>;
}

export default MapGenerator;
