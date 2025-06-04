import styled, { css, keyframes } from "styled-components";
import ScreenDarkener, { ScreenDarkenerColor } from "../ScreenDarkener";
import TextButton from "../../buttons/TextButton";
import { GLOBAL_COLORS, GLOBAL_FONTS } from "../../../theme";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import calcFontSize from "../../../utils/calcFontSize";

const clickedAnimation = keyframes`
  0%{
    scale: 1;  
  }
  100% {
    scale: 0;
  }
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface MainContainerProps {
  $isClicked: boolean;
}

const MainContainer = styled.div<MainContainerProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 65%;
  padding: 2.5vh 1.5vw;
  border: 2px solid ${GLOBAL_COLORS.modals.configModals.border};
  border-radius: 15px;
  background-color: ${GLOBAL_COLORS.modals.configModals.background};
  font-family: ${GLOBAL_FONTS.modal.mainText};
  text-align: center;

  ${({ $isClicked }) => {
    if ($isClicked) {
      return css`
        animation: ${clickedAnimation} 0.3s linear forwards;
      `;
    } else {
      return null;
    }
  }}

  @media (max-width: 600px) {
    max-width: 90%;
  }
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface MainTextProps {
  $fontSize: string;
}

const MainText = styled.p<MainTextProps>`
  width: 100%;
  color: ${GLOBAL_COLORS.modals.configModals.mainText};
  font-size: ${({ $fontSize }) => $fontSize};
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface SecondaryTextProps {
  $fontSize: string;
}

const SecondaryText = styled.p<SecondaryTextProps>`
  width: 90%;
  color: ${GLOBAL_COLORS.modals.configModals.secondaryText};
  font-size: ${({ $fontSize }) => $fontSize};
  margin-top: 2rem;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 3rem;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////    MAIN COMPONENT   ////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface ModalOneButtonProps {
  onClick: () => void;
  mainText?: string;
  secondaryText?: string;
  buttonText: string;
  screenDarkenerColor?: ScreenDarkenerColor;
}

function ModalOneButton({
  onClick,
  mainText,
  secondaryText,
  buttonText,
  screenDarkenerColor,
}: ModalOneButtonProps) {
  const [isClicked, setIsClicked] = useState(false);
  const [buttonTextSize, setButtonTextSize] = useState<string>("18px");
  const [mainTextSize, setMainTextSize] = useState<string>("22px");
  const [secondaryTextSize, setSecondaryTextSize] = useState<string>("16px");

  const mainContainerElement = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number>(0);

  // Proporción de los textos
  const buttonTextProportion = 16;
  const mainTextProportion = 22;
  const secondaryTextProportin = 28;

  const handleClick = useCallback(() => {
    setIsClicked(true);

    const clickTimer = window.setTimeout(() => {
      onClick();
    }, 350);

    timerRef.current = clickTimer;
  }, [onClick]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        handleClick();
      }
    },
    [handleClick]
  );

  // Gestiona el evento keydown cuando pulsamos "Enter" y limpia el timer de la animación cuando pulsamos.
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    //Limpiamos timers y eventos
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  // Recalcula el tamaño de las distintas fuentes usando la utility calcFontSize
  const setNewFontSize = useCallback(() => {
    setButtonTextSize(
      calcFontSize(mainContainerElement.current, buttonTextProportion)
    );
    setMainTextSize(
      calcFontSize(mainContainerElement.current, mainTextProportion)
    );
    setSecondaryTextSize(
      calcFontSize(mainContainerElement.current, secondaryTextProportin)
    );
  }, []);

  // Establece el tamaño inicial de los textos usando calcFontSize y crea un listener para recalcularlos
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
    <ScreenDarkener color={screenDarkenerColor}>
      <MainContainer ref={mainContainerElement} $isClicked={isClicked}>
        {mainText && <MainText $fontSize={mainTextSize}>{mainText}</MainText>}
        {secondaryText && (
          <SecondaryText $fontSize={secondaryTextSize}>
            {secondaryText}
          </SecondaryText>
        )}

        <ButtonContainer>
          <TextButton onClick={handleClick} fontSize={buttonTextSize}>
            {buttonText}
          </TextButton>
        </ButtonContainer>
      </MainContainer>
    </ScreenDarkener>
  );
}

export default ModalOneButton;
