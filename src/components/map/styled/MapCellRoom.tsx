import styled, { css, keyframes } from "styled-components";
import { useLayoutEffect, useRef, useState } from "react";
import { GLOBAL_COLORS, GLOBAL_FONTS } from "../../../theme";
import { BordersToShow } from "../helpers/generateCellBorders";
import { NamePosition, SomeDoorsToShow } from "../../../classes/map/mapTypes";
import calcFontSize from "../../../utils/calcFontSize";
import CustomLightbulbIcon from "../../common/icons/CustomLightbulbIcon";
import CustomNpcIcon from "../../common/icons/CustomNpcIcon";

import spiritImgSrc from "@assets/graphics/icons/map/spirit-icon.png";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const clickableCellAnim = keyframes`
  0% {
    background-color: ${GLOBAL_COLORS.map.cellBackground};
  }
  100% {
    background-color: ${GLOBAL_COLORS.map.cellClickable};
  }
`;

type CellMainFrameProps = {
  $cliCkable: boolean;
  $bordersToShow: BordersToShow;
  $name: string;
};

const bordersMap = {
  void: `2px solid ${GLOBAL_COLORS.map.cellOuterBorder}`,
  cell: `1px solid ${GLOBAL_COLORS.map.cellInnerBorder}`,
  group: `1px solid transparent`,
};

const CellMainFrame = styled.div<CellMainFrameProps>`
  position: relative;
  aspect-ratio: 1 / 0.8;
  border-left: ${({ $bordersToShow }) => bordersMap[$bordersToShow.west]};
  border-right: ${({ $bordersToShow }) => bordersMap[$bordersToShow.east]};
  border-top: ${({ $bordersToShow }) => bordersMap[$bordersToShow.north]};
  border-bottom: ${({ $bordersToShow }) => bordersMap[$bordersToShow.south]};
  background-color: ${GLOBAL_COLORS.map.cellBackground};
  z-index: ${({ $name }) => ($name ? "2" : "1")};

  ${({ $cliCkable }) => {
    if ($cliCkable) {
      return css`
        cursor: pointer;
        animation: ${clickableCellAnim} 700ms ease-in-out alternate infinite;
      `;
    }
  }}
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type CellDoorProps = {
  $doorsToShow: SomeDoorsToShow;
};

const doorStylesMap = {
  none: "0px solid transparent",
  open: "5px solid #a7c957",
  closed: "5px solid red",
};

const CellDoorVertical = styled.div<CellDoorProps>`
  position: absolute;
  top: -3%;
  left: 35%;
  width: 30%;
  height: 106.5%;
  border-top: ${({ $doorsToShow }) =>
    doorStylesMap[$doorsToShow.north ?? "none"]};
  border-bottom: ${({ $doorsToShow }) =>
    doorStylesMap[$doorsToShow.south ?? "none"]};
  pointer-events: none;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const CellDoorHorizontal = styled.div<CellDoorProps>`
  position: absolute;
  top: 35%;
  left: -2%;
  width: 104%;
  height: 30%;
  border-left: ${({ $doorsToShow }) =>
    doorStylesMap[$doorsToShow.west ?? "none"]};
  border-right: ${({ $doorsToShow }) =>
    doorStylesMap[$doorsToShow.east ?? "none"]};
  pointer-events: none;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type MapNameProps = {
  $namePosition: NamePosition;
  $fontSize: string;
};

const mapNameTopPosition = {
  top: "-10%",
  middle: "40%",
  bottom: "90%",
};

const MapName = styled.p<MapNameProps>`
  position: absolute;
  top: ${({ $namePosition }) => mapNameTopPosition[$namePosition]};
  left: 5%;
  width: 90%;
  text-align: center;
  font-weight: 800;
  color: #6798a1;
  font-size: ${({ $fontSize }) => $fontSize};
  font-family: ${GLOBAL_FONTS.map.cellName};
  filter: drop-shadow(1px 3px 0.5px black);
  pointer-events: none;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type MapIconsContainerProps = {
  $namePosition: NamePosition;
};

const mapIconsPositionMap = {
  top: "40%",
  middle: "18%",
  bottom: "40%",
};

const MapIconsContainer = styled.div<MapIconsContainerProps>`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  column-gap: 7%;
  top: ${({ $namePosition }) => mapIconsPositionMap[$namePosition]};
  left: 10%;
  width: 80%;
  pointer-events: none;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const floatAnimation = keyframes`
0% {
  transform: translateY(-25%);
}
100% {
  transform: translateY(10%);
}
`;

const SpiritIcon = styled.img`
  width: 15%;
  animation: ${floatAnimation} 2s ease-in-out alternate infinite;
  filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.4));
  /* Asegurar que la animación funcione suavemente */
  will-change: transform, opacity;
  pointer-events: none;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type NpcIconConfigProps = {
  $fontSize: string;
};

const NpcIconConfig = styled.div<NpcIconConfigProps>`
  display: block;
  font-size: ${({ $fontSize }) => $fontSize};
  color: ${GLOBAL_COLORS.icons.npcColor};
  pointer-events: none;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const lightbulbGlowAnim = keyframes`
  0% {
    filter: drop-shadow(0px 0px 1px ${GLOBAL_COLORS.icons.bulbGlow})
      drop-shadow(0px 0px 4px ${GLOBAL_COLORS.icons.bulbGlow});
  }
  100% {
    filter: drop-shadow(0px 0px 12px $orangeGlowEffect)
      drop-shadow(0px 0px 12px $orangeGlowEffect);
  }
`;

type LightBulbIconConfigProps = {
  $fontSize: string;
};

const LightBulbIconConfig = styled.div<LightBulbIconConfigProps>`
  display: block;
  font-size: ${({ $fontSize }) => $fontSize};
  color: ${GLOBAL_COLORS.icons.bulbColor};
  filter: drop-shadow(0 0 6px ${GLOBAL_COLORS.icons.bulbGlow});
  animation: ${lightbulbGlowAnim} 1s linear alternate infinite;
  pointer-events: none;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type MapCellRoomProps = {
  id: string | number;
  clickable: boolean;
  doorsToShow: SomeDoorsToShow;
  bordersToShow: BordersToShow;
  name: string;
  namePosition: NamePosition;
  hasPuzzle: boolean;
  hasNpc: boolean;
  hasSpirit: boolean;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
};

const MapCellRoom = ({
  id,
  clickable,
  doorsToShow,
  bordersToShow,
  name,
  namePosition,
  hasPuzzle,
  hasNpc,
  hasSpirit,
  onClick,
}: MapCellRoomProps) => {
  const [fontSize, setFontSize] = useState<string>("0px");
  const cellMainFrameElement = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (cellMainFrameElement.current) {
        setFontSize(calcFontSize(cellMainFrameElement.current, 8));
      }
    };

    window.addEventListener("resize", handleResize);

    handleResize(); // La ejecutamos para que, sin tener que cambiar el ancho de "window", en el 1º renderizado, el valor por defecto de fontSize (0px) sea sustituido por el valor calculado correcto.

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <CellMainFrame
      id={id.toString()}
      $cliCkable={clickable}
      $bordersToShow={bordersToShow}
      $name={name}
      ref={cellMainFrameElement}
      onClick={onClick}
    >
      <CellDoorVertical $doorsToShow={doorsToShow} />
      <CellDoorHorizontal $doorsToShow={doorsToShow} />
      <MapName $namePosition={namePosition} $fontSize={fontSize}>
        {name}
      </MapName>

      <MapIconsContainer $namePosition={namePosition}>
        {hasPuzzle ? (
          <LightBulbIconConfig $fontSize={fontSize}>
            <CustomLightbulbIcon />
          </LightBulbIconConfig>
        ) : null}

        {hasNpc ? (
          <NpcIconConfig $fontSize={fontSize}>
            <CustomNpcIcon />
          </NpcIconConfig>
        ) : null}

        {hasSpirit ? <SpiritIcon src={spiritImgSrc} /> : null}
      </MapIconsContainer>
    </CellMainFrame>
  );
};

export default MapCellRoom;
