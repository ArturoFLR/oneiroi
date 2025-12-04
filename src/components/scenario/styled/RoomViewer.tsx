import styled, { css, keyframes } from "styled-components";
import {
  ScenarioDistortionData,
  ScenarioLightningData,
  ScenarioRainData,
  ScenarioVideoFxData,
} from "../scenarioTypes";
import { GLOBAL_COLORS } from "../../../theme";
import { NPCName } from "../../../store/slices/aiChatSlice";
import NPCPortrait from "./NPCPortrait";
import allNPCsData from "../../../data/npcs/allNPCsData";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const MainContainer = styled.div`
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border-radius: 10px;
  z-index: 10;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface MainPictureProps {
  $windowWidth: number;
  $windowHeight: number;
  $widePicture: boolean;
}

const MainPicture = styled.img<MainPictureProps>`
  border-radius: 10px;
  ${({ $windowWidth, $windowHeight }) => {
    if ($windowWidth >= $windowHeight) {
      return css`
        height: 90vh;
      `;
    } else {
      return css`
        width: 99%;
        margin-top: 2vh;
      `;
    }
  }}

  aspect-ratio: ${({ $widePicture }) =>
    $widePicture ? "1376 / 768" : "1 / 1"};
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const overlayFadeIn = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

const overlayFadeOut = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

interface BlackOverlayFaderProps {
  $fadeOut: boolean;
  $fadeDuration: number;
}

const BlackOverlayFader = styled.div<BlackOverlayFaderProps>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${GLOBAL_COLORS.black};
  z-index: 50;
  animation: ${({ $fadeOut, $fadeDuration }) =>
    $fadeOut
      ? css`
          ${overlayFadeOut} ${$fadeDuration}ms forwards
        `
      : css`
          ${overlayFadeIn} ${$fadeDuration}ms forwards
        `};

  pointer-events: none;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const PortraitsContainer = styled.div`
  position: absolute;
  top: 1%;
  right: 1%;
  display: flex;
  column-gap: 2vw;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////    MAIN COMPONENT   ////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface RoomViewerProps {
  fadeOut: boolean;
  fadeDuration: number;
  roomImgUrl: string;
  widePicture: boolean;
  windowSize: [number, number];
  npcList?: NPCName[];
  npcNameSize: string;
  npcPortraitSize: string;
  handlePortraitClick: (npcName: NPCName) => void;
  children?: React.ReactNode;
  rainData?: ScenarioRainData;
  lightningData?: ScenarioLightningData;
  distortionData?: ScenarioDistortionData;
  videoFxData?: ScenarioVideoFxData[];
}

function RoomViewer({
  fadeOut,
  fadeDuration,
  roomImgUrl,
  widePicture,
  windowSize,
  npcList,
  npcNameSize,
  npcPortraitSize,
  children,
  handlePortraitClick,
  // rainData,
  // lightningData,
  // distortionData,
  // videoFxData,
}: RoomViewerProps) {
  // Si hay NPC´s en la celda, genera sus retratos.
  function generateNPCPortraits(npcList: NPCName[] | undefined) {
    if (!npcList) return null;

    const result: React.JSX.Element[] = [];

    npcList.forEach((npc) => {
      const npcData = allNPCsData[npc];

      result.push(
        <NPCPortrait
          key={npc}
          npcName={npc}
          npcNameSize={npcNameSize}
          portraitWidth={npcPortraitSize}
          portraitSrc={npcData.portraitSrc}
          onClick={handlePortraitClick}
        />
      );
    });

    return result;
  }

  return (
    <MainContainer id="room-viewer-main-container">
      <MainPicture
        src={roomImgUrl}
        $widePicture={widePicture}
        $windowWidth={windowSize[0]}
        $windowHeight={windowSize[1]}
      />

      <BlackOverlayFader $fadeOut={fadeOut} $fadeDuration={fadeDuration} />

      <PortraitsContainer id="portraits-container">
        {generateNPCPortraits(npcList)}
      </PortraitsContainer>

      {children}
    </MainContainer>
  );
}

export default RoomViewer;
