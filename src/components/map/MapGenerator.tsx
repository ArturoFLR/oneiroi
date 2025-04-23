import React from "react";

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
          />
        );
      }
    });

    return result;
  }

  return <MapContainer $cols={colsNumber}>{generateMapCells()}</MapContainer>;
}

export default MapGenerator;
