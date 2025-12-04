import React from "react";
import getMaxColsRows from "./helpers/getMaxColsRows";
import generateCellBorders from "./helpers/generateCellBorders";
import MapCell from "../../classes/map/MapCell";
import MapCellVoid from "./styled/MapCellVoid";
import MapCellRoom from "./styled/MapCellRoom";
import MapContainer from "./styled/MapContainer";
import ScreenFader from "../common/ScreenFader";

type MapGeneratorProps = {
  actualCellData: MapCell;
  mapCells: MapCell[];
  visible: boolean;
  fadeDuration: number;
  onClickOutsideMap: (e: React.MouseEvent<HTMLElement>) => void;
  onCellClick: (e: React.MouseEvent<HTMLElement>) => void;
};

function MapGenerator({
  actualCellData,
  mapCells,
  visible,
  fadeDuration,
  onClickOutsideMap,
  onCellClick,
}: MapGeneratorProps) {
  const colsNumber = getMaxColsRows(mapCells, "col");

  function generateMapCells(): React.JSX.Element[] {
    const result: React.JSX.Element[] = [];

    mapCells.forEach((mapCell) => {
      if (mapCell.group === "void" || mapCell.hidden === true) {
        result.push(
          <MapCellVoid key={mapCell.id} id={mapCell.id.toString()} />
        );
        return;
      } else {
        const cellBorders = generateCellBorders(mapCell, mapCells);
        const isCellClickable = actualCellData.reachableCells?.includes(
          mapCell.id
        );

        result.push(
          <MapCellRoom
            key={mapCell.id}
            id={mapCell.id.toString()}
            clickable={isCellClickable === true}
            doorsToShow={mapCell.doorsToShow}
            bordersToShow={cellBorders}
            name={mapCell.name}
            namePosition={mapCell.namePosition}
            hasPuzzle={mapCell.hasPuzzle}
            hasNpc={mapCell.hasNpc}
            hasSpirit={mapCell.hasSpirit}
            onClick={onCellClick}
          />
        );
      }
    });

    return result;
  }

  return (
    <ScreenFader
      visible={visible}
      fadeDuration={fadeDuration}
      color="light"
      zIndex={50}
      flex={true}
      onClick={(e: React.MouseEvent<HTMLElement>) => onClickOutsideMap(e)}
    >
      <MapContainer $cols={colsNumber}>{generateMapCells()}</MapContainer>;
    </ScreenFader>
  );
}

export default MapGenerator;
