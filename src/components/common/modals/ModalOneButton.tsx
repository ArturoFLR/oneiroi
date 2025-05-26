import styled, { css, keyframes } from "styled-components";
import ScreenDarkener, { ScreenDarkenerColor } from "../ScreenDarkener";
import TextButton from "../../buttons/TextButton";
import { GLOBAL_COLORS, GLOBAL_FONTS } from "../../../theme";
import { useCallback, useEffect, useRef, useState } from "react";

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
  padding: 2.5vh;
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
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const MainText = styled.p`
  width: 100%;
  color: ${GLOBAL_COLORS.modals.configModals.mainText};
  font-size: 1.8vw;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const SecondaryText = styled.p`
  width: 90%;
  color: ${GLOBAL_COLORS.modals.configModals.secondaryText};
  font-size: 1.4vw;
  margin-top: 3vh;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 3vh;
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
  const timerRef = useRef<number>(0);

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

  return (
    <ScreenDarkener color={screenDarkenerColor}>
      <MainContainer $isClicked={isClicked}>
        {mainText && <MainText>{mainText}</MainText>}
        {secondaryText && <SecondaryText>{secondaryText}</SecondaryText>}

        <ButtonContainer>
          <TextButton onClick={handleClick} fontSize="medium">
            {buttonText}
          </TextButton>
        </ButtonContainer>
      </MainContainer>
    </ScreenDarkener>
  );
}

export default ModalOneButton;
