import styled, { css, keyframes } from "styled-components";
import DistortionWrapper from "../fxAndFilters/DistortionWrapper";
import { GLOBAL_COLORS } from "../../../theme";
import { DistortionValues } from "../../cinematics/cinematicTypes";

const fadeInAnim = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const fadeOutAnim = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface MainContainerProps {
  $fadeInAnim: boolean;
  $fadeOutAnim: boolean;
  $animationDuration: number;
  $centered: boolean;
}

const MainContainer = styled.div<MainContainerProps>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  ${({ $centered }) => {
    if ($centered)
      return css`
        display: flex;
        justify-content: center;
        align-items: center;
      `;
  }}

  ${({ $fadeOutAnim, $fadeInAnim, $animationDuration }) => {
    if ($fadeOutAnim) {
      return css`
        animation: ${fadeOutAnim} ${$animationDuration}ms ease-in forwards;
      `;
    } else if ($fadeInAnim) {
      return css`
        animation: ${fadeInAnim} ${$animationDuration}ms ease-out forwards;
      `;
    } else return null;
  }}

  z-index: 1;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface ImgContainerProps {
  $windowWidth: number;
  $windowHeight: number;
  $centered: boolean;
  $positionTop: number | undefined;
  $positionBottom: number | undefined;
  $positionLeft: number | undefined;
  $positionRight: number | undefined;
  $landscapeWidth: string;
  $portraitWidth: string;
}

const ImgContainer = styled.div<ImgContainerProps>`
  position: ${({ $centered }) => ($centered ? "relative" : "absolute")};

  ${({ $positionTop }) =>
    typeof $positionTop === "number"
      ? css`
          top: ${$positionTop}%;
        `
      : null}

  ${({ $positionBottom }) =>
    typeof $positionBottom === "number"
      ? css`
          bottom: ${$positionBottom}%;
        `
      : null}

	${({ $positionLeft }) =>
    typeof $positionLeft === "number"
      ? css`
          left: ${$positionLeft}%;
        `
      : null}

	${({ $positionRight }) =>
    typeof $positionRight === "number"
      ? css`
          right: ${$positionRight}%;
        `
      : null}

	width: ${({ $windowWidth, $windowHeight, $landscapeWidth, $portraitWidth }) =>
    $windowWidth >= $windowHeight ? $landscapeWidth : $portraitWidth};

  border: 3px solid ${GLOBAL_COLORS.white};
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const ImgStyled = styled.img`
  width: 100%;
  height: auto;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////    MAIN COMPONENT   ////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface NPCPortraitProps {
  fadeInAnim: boolean;
  fadeOutAnim: boolean;
  animationsDuration: number;
  windowWidth: number;
  windowHeight: number;
  imageSrc: string;
  landscapeWidth?: number;
  portraitWidth?: number;
  centered?: boolean;
  positionTop?: number;
  positionBottom?: number;
  positionLeft?: number;
  positionRight?: number;
  distortionAnim?: boolean;
  distortionValues?: DistortionValues;
}

function NPCPortrait({
  fadeInAnim,
  fadeOutAnim,
  animationsDuration,
  windowWidth,
  windowHeight,
  imageSrc,
  landscapeWidth,
  portraitWidth,
  centered,
  positionTop,
  positionBottom,
  positionLeft,
  positionRight,
  distortionAnim,
  distortionValues,
}: NPCPortraitProps) {
  //Valores por defecto:
  const finalLandscapeWidth =
    typeof landscapeWidth === "number" ? `${landscapeWidth}%` : "25%";
  const finalPortraitWidth =
    typeof portraitWidth === "number" ? `${portraitWidth}%` : "35%";
  const finalCentered = centered === true ? centered : false;

  return (
    <MainContainer
      $centered={finalCentered}
      $fadeInAnim={fadeInAnim}
      $fadeOutAnim={fadeOutAnim}
      $animationDuration={animationsDuration}
    >
      <ImgContainer
        $windowWidth={windowWidth}
        $windowHeight={windowHeight}
        $centered={finalCentered}
        $landscapeWidth={finalLandscapeWidth}
        $portraitWidth={finalPortraitWidth}
        $positionTop={positionTop}
        $positionBottom={positionBottom}
        $positionLeft={positionLeft}
        $positionRight={positionRight}
      >
        {distortionAnim === true ? (
          <DistortionWrapper
            initialValues={distortionValues?.initialValues}
            maxValues={distortionValues?.maxValues}
            increment={distortionValues?.increment}
            intensity={distortionValues?.intensity}
            speed={distortionValues?.speed}
          >
            <ImgStyled src={imageSrc} />
          </DistortionWrapper>
        ) : (
          <ImgStyled src={imageSrc} />
        )}
      </ImgContainer>
    </MainContainer>
  );
}

export default NPCPortrait;
