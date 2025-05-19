import { ReactNode, useCallback } from "react";
import {
  TextCaptionData,
  TextCaptionFontSize,
  TextCaptionPosition,
} from "../../cinematics/cinematicTypes";
import styled, { css, keyframes } from "styled-components";
import { GLOBAL_COLORS, GLOBAL_FONTS } from "../../../theme";

interface MainContainerProps {
  $zIndex: number;
}

const MainContainer = styled.div<MainContainerProps>`
  position: absolute;
  overflow: hidden;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: ${({ $zIndex }) => $zIndex};
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Este contenedor únicamente cumple la función de tener position relative, para que los elementos absolute se posicionen aquí.

const RelativeContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface PositionMap {
  [key: string]: string;
}

const positionMap: PositionMap = {
  top: "flex-start",
  center: "center",
  bottom: "flex-end",
};

interface TextContainerProps {
  $position: string;
}

const TextContainer = styled.div<TextContainerProps>`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: ${({ $position }) => positionMap[$position]};
  width: 100%;
  height: 100%;
  padding: 5%;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const fadeIn = keyframes`
	0% {opacity: 0;}
	100% {opacity: 1;}
`;

const fadeOut = keyframes`
	0% {opacity: 1;}
	100% {opacity: 0;}
`;

interface FontSizeMap {
  [key: string]: string;
}

const fontSizeMap: FontSizeMap = {
  small: "2vw",
  medium: "3vw",
  big: "4vw",
};

interface TextBlockProps {
  $delay: number;
  $duration: number | null;
  $fontSize: TextCaptionFontSize | number;
  $fontFamily: string;
  $color: string;
  $textShadow: string;
  $width: number;
  $fadeInDuration: number;
  $fadeOutDuration: number;
  $positionTop?: number;
  $positionLeft?: number;
}

const TextBlock = styled.p<TextBlockProps>`
  ${({
    $delay,
    $duration,
    $fontSize,
    $fontFamily,
    $color,
    $textShadow,
    $width,
    $fadeInDuration,
    $fadeOutDuration,
    $positionLeft,
    $positionTop,
  }) => {
    return css`
      ${typeof $positionTop === "number" ? `top: ${$positionTop}%;` : null}
      ${typeof $positionLeft === "number" ? `left: ${$positionLeft}%;` : null}
      width: ${$width}%;
      color: ${$color};
      filter: drop-shadow(0.2vw 0.2vw 0.2vw ${$textShadow});
      font-size: ${typeof $fontSize === "number"
        ? $fontSize + "vw"
        : fontSizeMap[$fontSize]};
      font-family: ${$fontFamily};
      animation: ${fadeIn} ${$fadeInDuration}ms linear ${$delay}ms forwards
        ${typeof $duration === "number"
          ? css`, ${fadeOut} ${$fadeOutDuration}ms linear ${$duration}ms forwards;`
          : null};
    `;
  }}

  position: relative;
  opacity: 0;
  will-change: opacity;
  text-align: center;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////    MAIN COMPONENT   ////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface TextCaptionProps {
  textsArray: TextCaptionData[];
}

function TextCaption({ textsArray }: TextCaptionProps) {
  /////////Valores por defecto para los parámetros:

  const defaultDelay: number = 0;
  const defaultFontSize: TextCaptionFontSize = "medium";
  const defaultFontFamily: string = GLOBAL_FONTS.textCinematics.narratorNeutral;
  const defaultColor: string = GLOBAL_COLORS.text.textCaption;
  const defaultTextShadow: string = GLOBAL_COLORS.text.textCaptionShadow;
  const defaultWidth: number = 80;
  const defaultPosition: TextCaptionPosition = "center";
  const defaultFadeInDuration: number = 300;
  const defaultFadeOutDuration: number = 300;
  const defaultZIndex: number = 6;

  const generateTextElements = useCallback(() => {
    const componentsToRender: ReactNode[] = [];

    textsArray.forEach((text, index) => {
      /////////Valores por defecto para los parámetros:
      componentsToRender.push(
        <TextContainer
          key={String(index)}
          $position={text.position ? text.position : defaultPosition}
        >
          <TextBlock
            $delay={typeof text.delay === "number" ? text.delay : defaultDelay}
            $duration={typeof text.duration === "number" ? text.duration : null}
            $positionTop={
              typeof text.positionTop === "number"
                ? text.positionTop
                : undefined
            }
            $positionLeft={
              typeof text.positionLeft === "number"
                ? text.positionLeft
                : undefined
            }
            $fontSize={
              typeof text.fontSize !== "undefined"
                ? text.fontSize
                : defaultFontSize
            }
            $fontFamily={text.fontFamily ? text.fontFamily : defaultFontFamily}
            $color={text.color ? text.color : defaultColor}
            $textShadow={text.textShadow ? text.textShadow : defaultTextShadow}
            $width={text.width ? text.width : defaultWidth}
            $fadeInDuration={
              typeof text.fadeInDuration === "number"
                ? text.fadeInDuration
                : defaultFadeInDuration
            }
            $fadeOutDuration={
              typeof text.fadeOutDuration === "number"
                ? text.fadeOutDuration
                : defaultFadeOutDuration
            }
          >
            {text.text}
          </TextBlock>
        </TextContainer>
      );
    });

    return componentsToRender;
  }, [textsArray, defaultColor, defaultFontFamily, defaultTextShadow]);

  return (
    <MainContainer
      $zIndex={
        typeof textsArray[0]?.zIndex === "number"
          ? textsArray[0].zIndex
          : defaultZIndex
      }
    >
      <RelativeContainer>{generateTextElements()}</RelativeContainer>
    </MainContainer>
  );
}

export default TextCaption;
