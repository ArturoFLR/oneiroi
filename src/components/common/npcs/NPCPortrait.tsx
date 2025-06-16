import { useLayoutEffect, useState } from "react";
import styled, { css } from "styled-components";
import DistortionWrapper from "../fxAndFilters/DistortionWrapper";
import { GLOBAL_COLORS } from "../../../theme";

interface MainContainerProps {
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

  z-index: 6;
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
  $landscapeWidth: number;
  $portraitWidth: number;
}

const ImgContainer = styled.img<ImgContainerProps>`
  position: ${({ $centered }) => ($centered ? "relative" : "absolute")};

  ${({ $positionTop }) =>
    typeof $positionTop === "number"
      ? css`
          ${$positionTop}%
        `
      : null}

  ${({ $positionBottom }) =>
    typeof $positionBottom === "number"
      ? css`
          ${$positionBottom}%
        `
      : null}

	${({ $positionLeft }) =>
    typeof $positionLeft === "number"
      ? css`
          ${$positionLeft}%
        `
      : null}

	${({ $positionRight }) =>
    typeof $positionRight === "number"
      ? css`
          ${$positionRight}%
        `
      : null}

	width: ${({ $windowWidth, $windowHeight, $landscapeWidth, $portraitWidth }) =>
    $windowWidth >= $windowHeight ? $landscapeWidth : $portraitWidth};

  border: 2px solid ${GLOBAL_COLORS.white};
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

interface DistortionValues {
  initialValues?: number[];
  maxValues?: number[];
  increment?: number;
  speed?: number;
  intensity?: number;
}

interface NPCPortraitProps {
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
  const [windowSize, setWindowSize] = useState<number[]>([0, 0]);

  // Calcula la proporción de la pantalla, y establece un listener
  // para que se recalcule si hay un "resize" de la pantalla.
  useLayoutEffect(() => {
    function setNewWindowSize() {
      setWindowSize([window.innerWidth, window.innerHeight]);
    }

    // Hace el cálculo inicial
    setNewWindowSize();

    window.addEventListener("resize", setNewWindowSize);

    return () => {
      window.removeEventListener("resize", setNewWindowSize);
    };
  }, []);

  //Valores por defecto:
  const finalLandscapeWidth =
    typeof landscapeWidth === "number" ? landscapeWidth : 25;
  const finalPortraitWidth =
    typeof portraitWidth === "number" ? portraitWidth : 35;
  const finalCentered = centered === true ? centered : false;

  return (
    <MainContainer $centered={finalCentered}>
      <ImgContainer
        $windowWidth={windowSize[0]}
        $windowHeight={windowSize[1]}
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
