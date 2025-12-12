import ScreenFader from "../../common/ScreenFader";
import styled, { css } from "styled-components";
import { ModalData, ModalImgPosition } from "../scenarioTypes";
import { GLOBAL_COLORS, GLOBAL_FONTS } from "../../../theme";
import TextButton from "../../buttons/TextButton";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import asfaltBackground from "@assets/graphics/backgrounds/asfalt-light.png";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface MainContainerProps {
  $windowWidth: number;
  $windowHeight: number;
}

const MainContainer = styled.div<MainContainerProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: ${({ $windowWidth, $windowHeight }) =>
    $windowWidth > $windowHeight ? "60%" : "98%"};

  padding: 2vh 2vw;
  background-color: ${GLOBAL_COLORS.scenario.modalBackground};

  border-radius: 10px;
  border: 2px solid ${GLOBAL_COLORS.orange.highlightedText};
  box-shadow: 7px 7px 10px 5px ${GLOBAL_COLORS.black};

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 10px;
    background: url(${asfaltBackground});
    background-blend-mode: saturation;
    opacity: 0.6;
    z-index: 1;
  }
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface ModalImgProps {
  $windowSize: [number, number];
  $isWide: boolean;
  $position: ModalImgPosition;
  $border: boolean;
}

const ModalImg = styled.img<ModalImgProps>`
  width: ${({ $isWide, $windowSize }) => {
    if ($windowSize[0] > $windowSize[1]) return $isWide ? "40%" : "15%";
    if ($windowSize[0] <= $windowSize[1]) return $isWide ? "60%" : "25%";
  }};

  align-self: ${({ $position }) => {
    if ($position === "left") return "flex-start";
    if ($position === "right") return "flex-end";
    return "center";
  }};

  ${({ $border }) =>
    $border &&
    css`
      border: 2px solid ${GLOBAL_COLORS.white};
    `}

  border-radius: 10px;
  margin: 1.5vh 0;
  z-index: 2;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface ModalParagraphProps {
  $textSize: string;
}

const ModalParagraph = styled.p<ModalParagraphProps>`
  color: ${GLOBAL_COLORS.scenario.modalText};
  font-family: ${GLOBAL_FONTS.scenario.modalText};
  font-size: ${({ $textSize }) => $textSize};
  text-align: center;
  margin: 1.3vh 0;
  z-index: 2;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const ButtonContainer = styled.div`
  align-self: flex-end;
  margin-top: 2vh;
  z-index: 2;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////    MAIN COMPONENT   ////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface ModalViewerProps {
  windowSize: [number, number];
  modalData: ModalData;
  fadeDuration: number;
  isFadingOut: boolean;
  textSize: string;
  buttonSize: string;
  onOkButtonClick: (callback?: () => void) => void;
}

function ModalViewer({
  windowSize,
  modalData,
  fadeDuration,
  isFadingOut,
  textSize,
  buttonSize,
  onOkButtonClick,
}: ModalViewerProps) {
  // Valores por defecto del modal
  modalData.startImgAlt = modalData.startImgAlt || "";
  modalData.startImgIsWide = modalData.startImgIsWide || false;
  modalData.startImgPosition = modalData.startImgPosition || "center";
  modalData.startImgBorder = modalData.startImgBorder || false;
  modalData.endImgAlt = modalData.endImgAlt || "";
  modalData.endImgIsWide = modalData.endImgIsWide || false;
  modalData.endImgPosition = modalData.endImgPosition || "center";
  modalData.endImgBorder = modalData.endImgBorder || false;

  return (
    <ScreenFader
      flex={true}
      justifyContent="center"
      alignItems="center"
      fadeDuration={fadeDuration}
      visible={!isFadingOut}
      color="light"
      zIndex={30}
    >
      <MainContainer
        id="ModalViewer-MainContainer"
        $windowWidth={windowSize[0]}
        $windowHeight={windowSize[1]}
      >
        {modalData.startImgUrl && (
          <ModalImg
            src={modalData.startImgUrl}
            alt={modalData.startImgAlt}
            $isWide={modalData.startImgIsWide}
            $position={modalData.startImgPosition}
            $border={modalData.startImgBorder}
            $windowSize={windowSize}
          />
        )}

        {modalData.text.map((text, index) => (
          <ModalParagraph key={index} $textSize={textSize}>
            {text}
          </ModalParagraph>
        ))}

        {modalData.endImgUrl && (
          <ModalImg
            src={modalData.endImgUrl}
            alt={modalData.endImgAlt}
            $isWide={modalData.endImgIsWide}
            $position={modalData.endImgPosition}
            $border={modalData.endImgBorder}
            $windowSize={windowSize}
          />
        )}

        <ButtonContainer>
          <TextButton
            fontSize={buttonSize}
            onClick={() => onOkButtonClick(modalData.onOkClick)}
            animated={true}
            fontFamily={GLOBAL_FONTS.buttons.ModalTextButton}
            color={GLOBAL_COLORS.buttons.ModalTextButton.text}
            hoverColor={GLOBAL_COLORS.buttons.ModalTextButton.textHover}
            textShadow={GLOBAL_COLORS.buttons.ModalTextButton.textShadow}
          >
            Ok &gt;&gt;
          </TextButton>
        </ButtonContainer>
      </MainContainer>
    </ScreenFader>
  );
}

export default ModalViewer;
