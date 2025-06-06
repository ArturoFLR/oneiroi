import styled, { css, keyframes } from "styled-components";
import TextButton from "../../buttons/TextButton";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import calcFontSize from "../../../utils/calcFontSize";
import { GLOBAL_COLORS, GLOBAL_FONTS } from "../../../theme";
import MainMenuLoadGame from "./MainMenuLoadGame";

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

interface ButtonAnimationWrapperProps {
  $playAnimation: boolean;
}

const ButtonAnimationWrapper = styled.div<ButtonAnimationWrapperProps>`
  width: fit-content;
  transform-origin: bottom;

  ${({ $playAnimation }) =>
    $playAnimation ? "transform: rotateX(-90deg);" : null}

  animation: ${({ $playAnimation }) => {
    if ($playAnimation) {
      return css`
        ${skewAnim} 1.5s 0.1s ease-in-out forwards
      `;
    } else return "none";
  }};
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const ButtonAnimationWrapper2 = styled(ButtonAnimationWrapper)`
  animation: ${({ $playAnimation }) => {
    if ($playAnimation) {
      return css`
        ${skewAnim} 1.5s 0.4s ease-in-out forwards
      `;
    } else return "none";
  }};
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const ButtonAnimationWrapper3 = styled(ButtonAnimationWrapper)`
  animation: ${({ $playAnimation }) => {
    if ($playAnimation) {
      return css`
        ${skewAnim} 1.5s 0.7s ease-in-out forwards
      `;
    } else return "none";
  }};
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const ButtonAnimationWrapper4 = styled(ButtonAnimationWrapper)`
  animation: ${({ $playAnimation }) => {
    if ($playAnimation) {
      return css`
        ${skewAnim} 1.5s 1s ease-in-out forwards
      `;
    } else return "none";
  }};
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////    MAIN COMPONENT   ////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface MainMenuOptionsProps {
  setIsStorageModalShown: React.Dispatch<React.SetStateAction<boolean>>;
  onNewGameClick: () => void;
  onWatchIntroClick: () => void;
}

function MainMenuOptions({
  setIsStorageModalShown,
  onWatchIntroClick,
  onNewGameClick,
}: MainMenuOptionsProps) {
  const [optionsType, setOptionsType] = useState<"main" | "load">("main");
  const [buttonsTextSize, setButtonsTextSize] = useState<string>("16px");
  const [backButtonSize, setBackButtonSize] = useState<string>("16px");
  const [noStorageWarningSize, setNoStorageWarningSize] =
    useState<string>("16px");

  const mainContainerElement = useRef<HTMLDivElement>(null);
  const hasTextAnimationPlayed = useRef<boolean>(false);

  // Proporción de los textos
  const buttonTextProportion = 9;
  const backButtonProportion = 12;
  const noStorageWarningProportion = 17;

  function placeholder() {
    console.log("Click!");
  }

  // Recalcula el tamaño de las distintas fuentes usando la utility calcFontSize
  const setNewFontSize = useCallback(() => {
    setButtonsTextSize(
      calcFontSize(mainContainerElement.current, buttonTextProportion, 37)
    );

    setBackButtonSize(
      calcFontSize(mainContainerElement.current, backButtonProportion, 25)
    );

    setNoStorageWarningSize(
      calcFontSize(mainContainerElement.current, noStorageWarningProportion, 20)
    );
  }, []);

  function onContinueClick() {
    hasTextAnimationPlayed.current = true;
    setOptionsType("load");
  }

  function handleBackClick() {
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
          <ButtonAnimationWrapper
            $playAnimation={!hasTextAnimationPlayed.current}
          >
            <TextButton
              onClick={onNewGameClick}
              fontSize={buttonsTextSize}
              animated={false}
              color={GLOBAL_COLORS.buttons.MenuTextButton.text}
              textShadow={GLOBAL_COLORS.buttons.MenuTextButton.textShadow}
              hoverColor={GLOBAL_COLORS.buttons.MenuTextButton.textHover}
              fontFamily={GLOBAL_FONTS.buttons.MenuTextButton}
            >
              Nueva Partida
            </TextButton>
          </ButtonAnimationWrapper>

          <ButtonAnimationWrapper2
            $playAnimation={!hasTextAnimationPlayed.current}
          >
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

          <ButtonAnimationWrapper3
            $playAnimation={!hasTextAnimationPlayed.current}
          >
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

          <ButtonAnimationWrapper4
            $playAnimation={!hasTextAnimationPlayed.current}
          >
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

      {optionsType === "load" && (
        <MainMenuLoadGame
          setIsStorageModalShown={setIsStorageModalShown}
          onBackClick={handleBackClick}
          titleTextSize={buttonsTextSize}
          backButtonTextSize={backButtonSize}
          noStorageWarningTextSize={noStorageWarningSize}
        />
      )}
    </MainContainer>
  );
}

export default MainMenuOptions;
