import AnimatedText from "../../common/text/AnimatedText";
import { GLOBAL_COLORS, GLOBAL_FONTS } from "../../../theme";
import styled, { css, keyframes } from "styled-components";

//////////////////////////////////////////////////   ASSETS   ////////////////////////////////////////////////////////

import arrowButton from "@assets/graphics/icons/scenario/icono-flecha-arriba.webp";
import { useEffect, useRef } from "react";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const scaleDownAnim = keyframes`
	0% {
		bottom: 0;
	}
	100% {
		bottom: -20vh;
	}
`;

const scaleUpAnim = keyframes`
	0% {
		bottom: -20vh;
	}
	100% {
		bottom: 0;
	}
`;

const scaleUpAnimMobile = keyframes`
	0% {
		transform: scaleY(0);
	}
	100% {
		transform: scaleY(1);
	}
`;

interface MainContainerProps {
  $windowWidth: number;
  $windowHeight: number;
  $isOpen: boolean;
  $animationsTimeInMs: number;
}

const MainContainer = styled.div<MainContainerProps>`
  transform-origin: bottom;
  padding: 2.7rem 0rem 2rem 0rem;
  background-image: linear-gradient(
    to bottom,
    transparent,
    ${GLOBAL_COLORS.screenDarkener.dark} 10px
  );
  z-index: 6;

  ${({ $windowWidth, $windowHeight }) => {
    if ($windowWidth >= $windowHeight) {
      return css`
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 20vh;
      `;
    } else {
      return css`
        width: 98%;
        height: 33vh;
        margin: 2vh 0vh 0vh 0vh;
      `;
    }
  }}

  ${({ $windowWidth, $windowHeight }) => {
    if ($windowWidth < $windowHeight) {
      return css`
        border: 1px solid ${GLOBAL_COLORS.orange.text};
        border-radius: 10px;
      `;
    } else return null;
  }}

		${({ $isOpen, $animationsTimeInMs, $windowWidth, $windowHeight }) => {
    if (!$isOpen && $windowWidth >= $windowHeight) {
      return css`
        animation: ${scaleDownAnim} ${$animationsTimeInMs}ms ease-in forwards;
      `;
    } else if ($isOpen && $windowWidth >= $windowHeight) {
      return css`
        animation: ${scaleUpAnim} ${$animationsTimeInMs}ms ease-out forwards;
      `;
    } else {
      return css`
        animation: ${scaleUpAnimMobile} ${$animationsTimeInMs}ms ease-out
          forwards;
      `;
    }
  }}
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Este contenedor únicamente cumple la función de tener position relative, para que los elementos absolute se posicionen aqui (botón de cerrar).
const RelativeContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 0rem 2.5rem 0rem 2rem;
  overflow-y: auto;
  overflow-x: hidden;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const FirstParagraphContainer = styled.div`
  margin-top: 0vh;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const ParagraphContainer = styled.div`
  margin-top: 2vh;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface ArrowButtonProps {
  $width: string;
}

const ArrowButton = styled.button<ArrowButtonProps>`
  position: absolute;
  top: -3vh;
  right: 46%;
  width: ${({ $width }) => $width};
  height: ${({ $width }) => $width};
  background-color: transparent;
  background-image: linear-gradient(
    to top,
    transparent,
    ${GLOBAL_COLORS.screenDarkener.light} 50%
  );
  border-radius: 100%;
  border: 0px;
  outline: none;
  cursor: pointer;
  z-index: 7;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const ArrowButtonDownAnim = keyframes`
0% {
  transform: rotate(0deg)
}
100% {
  transform: rotate(180deg)
}
`;

const ArrowButtonUpAnim = keyframes`
0% {
  transform: rotate(180deg)
}
100% {
  transform: rotate(0deg)
}
`;

interface ArrowButtonIconProps {
  $isOpen: boolean;
  $animationsTimeInMs: number;
}

const ArrowButtonIcon = styled.img<ArrowButtonIconProps>`
  height: 70%;
  width: auto;
  animation: ${({ $isOpen }) =>
      $isOpen ? ArrowButtonDownAnim : ArrowButtonUpAnim}
    ${({ $animationsTimeInMs }) => $animationsTimeInMs}ms ease-in-out forwards;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////    MAIN COMPONENT   ////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface TextViewerProps {
  windowSize: [number, number];
  textToShow: string[];
  isOpen: boolean;
  animationTime?: number; // Cuántos milisegundos pasan antes de mostrar la siguiente letra.
  textSize: string;
  buttonSize: string;
  onArrowButtonClick: () => void;
  onTextAnimationEnd: () => void;
}

function TextViewer({
  windowSize,
  textToShow,
  isOpen,
  animationTime = 10,
  textSize,
  buttonSize,
  onArrowButtonClick,
  onTextAnimationEnd,
}: TextViewerProps) {
  const relativeContainerElement = useRef<HTMLDivElement>(null);
  const animationsTimeInMs = 800;
  const fontFamily = GLOBAL_FONTS.scenario.textViewer;
  const textColor = GLOBAL_COLORS.scenario.textViewer;

  // Esta función va generando los componentes "AnimatedText" necesarios, en función del valor de textToShow
  function generateParagraphs() {
    const elementsToRender: React.ReactElement[] = [];

    for (let index = 0; index < textToShow.length; index++) {
      if (index === 0) {
        elementsToRender.push(
          <FirstParagraphContainer key={index}>
            <AnimatedText
              text={textToShow[index]}
              fontSize={textSize}
              animationTime={animationTime}
              fontFamily={fontFamily}
              color={textColor}
              onEnd={onTextAnimationEnd}
            ></AnimatedText>
          </FirstParagraphContainer>
        );
      } else {
        elementsToRender.push(
          <ParagraphContainer key={index}>
            <AnimatedText
              text={textToShow[index]}
              fontSize={textSize}
              animationTime={animationTime}
              fontFamily={fontFamily}
              color={textColor}
              onEnd={onTextAnimationEnd}
            ></AnimatedText>
          </ParagraphContainer>
        );
      }
    }

    return elementsToRender;
  }

  // Hace scroll automáticamente cuando aparece un mensaje nuevo, para que no haya que hacer scroll manual para verlo.
  // Usamos un MutationObserver para detectar cambios en el contenido del contenedor. De esta manera no hay que modificar
  // AnimatedText añadiéndole un prop para detectar cuándo aumenta el texto.
  useEffect(() => {
    const element = relativeContainerElement.current;
    if (!element) return;

    // Configura el MutationObserver
    const observer = new MutationObserver(() => {
      requestAnimationFrame(() => {
        element.scrollTop = element.scrollHeight;
      });
    });

    // Observa cambios en el contenido
    observer.observe(element, {
      childList: true, // Observa hijos añadidos/eliminados
      subtree: true, // Observa todos los descendientes
      characterData: true, // Observa cambios en el texto
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <MainContainer
      id="text-main-container"
      $windowWidth={windowSize[0]}
      $windowHeight={windowSize[1]}
      $isOpen={isOpen}
      $animationsTimeInMs={animationsTimeInMs}
    >
      <RelativeContainer
        id="text-viewer-relative-container"
        ref={relativeContainerElement}
      >
        {generateParagraphs()}
      </RelativeContainer>

      {windowSize[0] >= windowSize[1] && (
        <ArrowButton $width={buttonSize} onClick={onArrowButtonClick}>
          <ArrowButtonIcon
            src={arrowButton}
            $isOpen={isOpen}
            $animationsTimeInMs={animationsTimeInMs}
          ></ArrowButtonIcon>
        </ArrowButton>
      )}
    </MainContainer>
  );
}

export default TextViewer;
