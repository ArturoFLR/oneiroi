import { useEffect, useLayoutEffect, useRef, useState } from "react";
import calcFontSize from "../../../utils/calcFontSize";
import styled, { css, keyframes } from "styled-components";
import AnimatedText from "../text/AnimatedText";
import { GLOBAL_COLORS, GLOBAL_FONTS } from "../../../theme";
import TextButton from "../../buttons/TextButton";

const scaleDownAnim = keyframes`
  0% {
    scale: 1;
  }
  100% {
    scale: 0;
  }
`;

const scaleUpAnim = keyframes`
  0% {
    scale: 0;
  }
  100% {
    scale: 1;
  }
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface MainContainerProps {
  $windowWidth: number;
  $windowHeight: number;
  $scaleUpAnim: boolean;
  $scaleDownAnim: boolean;
  $height: number;
  $animationsDuration: number;
}

const MainContainer = styled.div<MainContainerProps>`
  position: absolute;

  ${({ $windowWidth, $windowHeight, $height }) => {
    if ($windowWidth >= $windowHeight) {
      return css`
        bottom: 0;
        width: 100%;
        height: ${$height}%;
      `;
    } else {
      return css`
        bottom: ${$height > 31.5 ? `-${33 + 1.5}vh` : `-${$height + 1.5}vh`};
        width: 98%;
        margin: 1vh 0vh 0vh 1%;
        height: ${$height > 33 ? "33vh" : `${$height}vh`};
      `;
    }
  }}

  background-color: ${GLOBAL_COLORS.screenDarkener.dark};

  ${({ $windowWidth, $windowHeight }) => {
    if ($windowWidth < $windowHeight) {
      return css`
        border: 1px solid ${GLOBAL_COLORS.orange.text};
        border-radius: 10px;
      `;
    } else return null;
  }}

  padding: 2rem 0rem;

  ${({ $scaleDownAnim, $scaleUpAnim, $animationsDuration }) => {
    if ($scaleDownAnim) {
      return css`
        animation: ${scaleDownAnim} ${$animationsDuration}ms ease-in forwards;
      `;
    } else if ($scaleUpAnim) {
      return css`
        animation: ${scaleUpAnim} ${$animationsDuration}ms ease-out forwards;
      `;
    } else return null;
  }}

  z-index: 3;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const RelativeContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 0rem 2.5rem 0rem 2rem;
  overflow-y: auto;
  overflow-x: hidden;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface NpcNameProps {
  $color: string;
  $fontSize: string;
}

const NpcName = styled.p<NpcNameProps>`
  font-size: ${({ $fontSize }) => $fontSize};
  color: ${({ $color }) => $color};
  text-shadow: 0.5px 0.5px 1px ${GLOBAL_COLORS.text.manualText.npcTextShadow};
  margin-bottom: 1vh;
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

const NextButtonContainer = styled.div`
  position: absolute;
  bottom: -5vh;
  right: 1.5vw;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////    MAIN COMPONENT   ////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface AnimatedTextFrameProps {
  isContinuation: boolean;
  nextShotIsContinuation: boolean;
  text: string[];
  size?: number;
  npcName?: string;
  npcColor?: string;
  animationTime?: number; // Cuántos milisegundos pasan antes de mostrar la siguiente letra.
  textProportion?: number;
  buttonProportion?: number;
  color?: string;
  fontFamily?: string;
  handleNextShotClick: () => void;
}

function AnimatedTextFrame({
  isContinuation,
  nextShotIsContinuation,
  text,
  size,
  npcName,
  npcColor,
  animationTime,
  textProportion,
  buttonProportion,
  fontFamily,
  color,
  handleNextShotClick,
}: AnimatedTextFrameProps) {
  const [paragraphsToShow, setParagraphsToShow] = useState<number>(0);
  const [showNpcName, setShowNpcName] = useState<boolean>(false);
  const [showNextButton, setShowNextButton] = useState<boolean>(false);
  const [isScaleDownAnim, setIsScaleDownAnim] = useState<boolean>(false);

  const [windowSize, setWindowSize] = useState<number[]>([0, 0]);
  const [textSize, setTextSize] = useState<string>("0px");
  const [npcNameSize, setNpcNameSize] = useState<string>("0px");
  const [buttonSize, setButtonSize] = useState<string>("0px");

  const mainContainerElement = useRef<HTMLDivElement>(null);
  const textTimeoutsRef = useRef<number[]>([]);
  const scaleDownTimeoutRef = useRef<number>(0);

  // Valores por defecto
  const finalSize = size ? size : 30;
  const finalNpcName = npcName ? npcName : "";
  const finalNpcColor = npcColor
    ? npcColor
    : GLOBAL_COLORS.text.manualText.npcColor1;
  const finalTextProportion = textProportion ? textProportion : 45;
  const finalNpcNameProportion = textProportion ? textProportion - 5 : 40;
  const finalButtonPorportion = buttonProportion ? buttonProportion : 45;
  const finalAnimationTime = animationTime ? animationTime : 10;
  const finalFontFamily = fontFamily
    ? fontFamily
    : GLOBAL_FONTS.manualText.narrator;
  const finalColor = color ? color : GLOBAL_COLORS.text.manualText.narrator;

  const animationsDuration = 1000; // La duración, en ms, de scaleUpAnim y scaleDownAnim

  //Esta función se pasa al componente AnimatedText para que aumente el número de párrafos a mostrar (paragraphsToShow)
  // cuando ha terminado de mostrar uno. Si ya se han mostrado todos, hace aparecer el botón "Siguiente".
  function handleTextAnimationEnd() {
    if (paragraphsToShow < text.length) {
      setParagraphsToShow(paragraphsToShow + 1);
    } else {
      setShowNextButton(true);
    }
  }

  // Esta función va generando los componentes "AnimatedText" necesarios, en función del valor de paragraphsToShow
  function generateParagraphs() {
    const elementsToRender: React.ReactElement[] = [];

    for (let index = 0; index < paragraphsToShow; index++) {
      if (index === 0) {
        elementsToRender.push(
          <FirstParagraphContainer key={index}>
            <AnimatedText
              text={text[index]}
              fontSize={textSize}
              animationTime={finalAnimationTime}
              fontFamily={finalFontFamily}
              color={finalColor}
              onEnd={handleTextAnimationEnd}
            ></AnimatedText>
          </FirstParagraphContainer>
        );
      } else {
        elementsToRender.push(
          <ParagraphContainer key={index}>
            <AnimatedText
              text={text[index]}
              fontSize={textSize}
              animationTime={finalAnimationTime}
              fontFamily={finalFontFamily}
              color={finalColor}
              onEnd={handleTextAnimationEnd}
            ></AnimatedText>
          </ParagraphContainer>
        );
      }
    }

    return elementsToRender;
  }

  // Esta función hace que:
  // - Si en el siguiente plano no hay texto manual, o lo hay pero el NPC que habla es diferente
  // (basándose en el id), aplica una animación (scaleDownAnim) y un timer que cambiará el plano
  // cuando la animación termine. Esto se hace porque podemos tener un tamaño de container diferente y el cambio sería muy brusco.
  //
  // - Si en el plano siguiente habla el mismo NPC, no hay animación, para no romper la continuidad.

  function handleNextShotClickAnims() {
    setShowNextButton(false);
    setParagraphsToShow(0);

    if (!nextShotIsContinuation) {
      setIsScaleDownAnim(true);

      const scaleDownTimer = window.setTimeout(() => {
        handleNextShotClick();
      }, animationsDuration);

      scaleDownTimeoutRef.current = scaleDownTimer;
    } else {
      handleNextShotClick();
    }
  }

  // Al comienzo de un nuevo plano, elimina una posible animación isScaleDown del plano anterior, para que se vea el componente.
  // useLayoutEffect(() => {
  //   setIsScaleDownAnim(false);
  // }, [text]);

  // Establece el delay necesario para que termine la animación scaleUpAnim antes de que se muestre
  // el nombre del NPC y comience a renderizarse el texto.
  useEffect(() => {
    setIsScaleDownAnim(false);

    const localtextTimeoutsRef = textTimeoutsRef.current;
    const npcNameDelay = isContinuation ? 0 : animationsDuration + 100;
    const textDelay = isContinuation ? 100 : animationsDuration + 200;

    const showNpcNameTimer = window.setTimeout(() => {
      setShowNpcName(true);
    }, npcNameDelay);

    const scaleUpTimer = window.setTimeout(() => {
      setParagraphsToShow(1);
    }, textDelay);

    localtextTimeoutsRef.push(scaleUpTimer);
    localtextTimeoutsRef.push(showNpcNameTimer);

    return () => {
      localtextTimeoutsRef.forEach((timer) => {
        window.clearTimeout(timer);
      });
    };
  }, [isContinuation, text]);

  // Calcula la proporción de la pantalla y el tamaño de las fuentes, y establece un listener
  // para que se recalculen si hay un "resize" de la pantalla.
  useLayoutEffect(() => {
    function setNewFontSize() {
      setTextSize(
        calcFontSize(mainContainerElement.current, finalTextProportion, 18)
      );

      setButtonSize(
        calcFontSize(mainContainerElement.current, finalButtonPorportion, 22)
      );

      setNpcNameSize(
        calcFontSize(mainContainerElement.current, finalNpcNameProportion, 22)
      );
    }

    function setNewWindowSize() {
      setWindowSize([window.innerWidth, window.innerHeight]);
    }

    function handleResize() {
      setNewFontSize();
      setNewWindowSize();
    }

    // Hace el cálculo inicial
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [finalButtonPorportion, finalTextProportion, finalNpcNameProportion]);

  // Limpia el timeout de la animación isScaleDown
  useEffect(() => {
    return () => {
      window.clearTimeout(scaleDownTimeoutRef.current);
    };
  }, []);

  return (
    <MainContainer
      id="AnimatedTextFrameContainer"
      ref={mainContainerElement}
      $windowWidth={windowSize[0]}
      $windowHeight={windowSize[1]}
      $scaleUpAnim={!isContinuation}
      $scaleDownAnim={isScaleDownAnim}
      $height={finalSize}
      $animationsDuration={animationsDuration}
    >
      <RelativeContainer>
        {npcName && showNpcName && (
          <NpcName $color={finalNpcColor} $fontSize={npcNameSize}>
            {finalNpcName}:
          </NpcName>
        )}
        {generateParagraphs()}
      </RelativeContainer>

      {showNextButton && (
        <NextButtonContainer>
          <TextButton
            fontSize={buttonSize}
            onClick={handleNextShotClickAnims}
            animated={true}
            fontFamily={GLOBAL_FONTS.buttons.ModalTextButton}
            color={GLOBAL_COLORS.buttons.ModalTextButton.text}
            hoverColor={GLOBAL_COLORS.buttons.ModalTextButton.textHover}
            textShadow={GLOBAL_COLORS.buttons.ModalTextButton.textShadow}
          >
            Siguiente &gt;&gt;
          </TextButton>
        </NextButtonContainer>
      )}
    </MainContainer>
  );
}

export default AnimatedTextFrame;
