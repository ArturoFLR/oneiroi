import styled, { keyframes } from "styled-components";
import TextButton from "../../buttons/TextButton";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import calcFontSize from "../../../utils/calcFontSize";
import { GLOBAL_COLORS, GLOBAL_FONTS } from "../../../theme";
// import MainMenuLoadGame from "./MainMenuLoadGame";

const skewAnim = keyframes`
	0% {
		transform: rotateX(-90deg);
	}
	100% {
		transform: rotateX(0deg);
	}
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const MainContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  ${() =>
    window.innerWidth < window.innerHeight ? "align-items: center;" : null}
  row-gap: 1rem;
  width: 100%;
  z-index: 2;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const ButtonAnimationWrapper1 = styled.div`
  width: fit-content;
  transform-origin: bottom;
  transform: rotateX(-90deg);
  animation: ${skewAnim} 1.5s 0.1s ease-in-out forwards;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const ButtonAnimationWrapper2 = styled.div`
  width: fit-content;
  transform-origin: bottom;
  transform: rotateX(-90deg);
  animation: ${skewAnim} 1.5s 0.4s ease-in-out forwards;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const ButtonAnimationWrapper3 = styled.div`
  width: fit-content;
  transform-origin: bottom;
  transform: rotateX(-90deg);
  animation: ${skewAnim} 1.5s 0.7s ease-in-out forwards;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const ButtonAnimationWrapper4 = styled.div`
  width: fit-content;
  transform-origin: bottom;
  transform: rotateX(-90deg);
  animation: ${skewAnim} 1.5s 1s ease-in-out forwards;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////    MAIN COMPONENT   ////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface MainMenuOptionsProps {
  onWatchIntroClick: () => void;
}

function MainMenuOptions({ onWatchIntroClick }: MainMenuOptionsProps) {
  const [optionsType, setOptionsType] = useState<"main" | "load">("main");
  const [buttonsTextSize, setButtonsTextSize] = useState<string>("16px");

  const mainContainerElement = useRef<HTMLDivElement>(null);

  // Proporción de los textos
  const buttonTextProportion = 9;

  function placeholder() {
    console.log("Click!");
  }

  // Recalcula el tamaño de las distintas fuentes usando la utility calcFontSize
  const setNewFontSize = useCallback(() => {
    setButtonsTextSize(
      calcFontSize(mainContainerElement.current, buttonTextProportion, 37)
    );
  }, []);

  function onContinueClick() {
    setOptionsType("load");
  }

  function handleExitContinueClick() {
    setOptionsType("main");
  }

  // Establece el tamaño inicial de las fuentes usando setNewFontSize y crea un listener para recalcularlos
  // cuando hay un resize en la ventana del navegador
  useLayoutEffect(() => {
    if (mainContainerElement.current) {
      setNewFontSize();
    }

    const handleResize = () => {
      if (mainContainerElement.current) {
        setNewFontSize();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setNewFontSize]);

  return (
    <MainContainer ref={mainContainerElement}>
      {optionsType === "main" && (
        <>
          <ButtonAnimationWrapper1>
            <TextButton
              onClick={placeholder}
              fontSize={buttonsTextSize}
              animated={false}
              color={GLOBAL_COLORS.buttons.MenuTextButton.text}
              textShadow={GLOBAL_COLORS.buttons.MenuTextButton.textShadow}
              hoverColor={GLOBAL_COLORS.buttons.MenuTextButton.textHover}
              fontFamily={GLOBAL_FONTS.buttons.MenuTextButton}
            >
              Nueva Partida
            </TextButton>
          </ButtonAnimationWrapper1>

          <ButtonAnimationWrapper2>
            <TextButton
              onClick={onContinueClick}
              fontSize={buttonsTextSize}
              animated={false}
              color={GLOBAL_COLORS.buttons.MenuTextButton.text}
              textShadow={GLOBAL_COLORS.buttons.MenuTextButton.textShadow}
              hoverColor={GLOBAL_COLORS.buttons.MenuTextButton.textHover}
              fontFamily={GLOBAL_FONTS.buttons.MenuTextButton}
            >
              Continuar
            </TextButton>
          </ButtonAnimationWrapper2>

          <ButtonAnimationWrapper3>
            <TextButton
              onClick={onWatchIntroClick}
              fontSize={buttonsTextSize}
              animated={false}
              color={GLOBAL_COLORS.buttons.MenuTextButton.text}
              textShadow={GLOBAL_COLORS.buttons.MenuTextButton.textShadow}
              hoverColor={GLOBAL_COLORS.buttons.MenuTextButton.textHover}
              fontFamily={GLOBAL_FONTS.buttons.MenuTextButton}
            >
              Ver Intro
            </TextButton>
          </ButtonAnimationWrapper3>

          <ButtonAnimationWrapper4>
            <TextButton
              onClick={placeholder}
              fontSize={buttonsTextSize}
              animated={false}
              color={GLOBAL_COLORS.buttons.MenuTextButton.text}
              textShadow={GLOBAL_COLORS.buttons.MenuTextButton.textShadow}
              hoverColor={GLOBAL_COLORS.buttons.MenuTextButton.textHover}
              fontFamily={GLOBAL_FONTS.buttons.MenuTextButton}
            >
              Créditos
            </TextButton>
          </ButtonAnimationWrapper4>
        </>
      )}

      {/* {optionsType === "load" && <MainMenuLoadGame />} */}
    </MainContainer>
  );
}

export default MainMenuOptions;
