import styled, { css, keyframes } from "styled-components";
import ScreenDarkener from "../ScreenDarkener";
import TextButton from "../../buttons/TextButton";
import { GLOBAL_COLORS, GLOBAL_FONTS } from "../../../theme";
import { useEffect, useRef, useState } from "react";

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
  max-width: 75%;
  padding: 2.5vh 3.5vw;
  border: 2px solid ${GLOBAL_COLORS.orange.text};
  border-radius: 15px;
  background-color: ${GLOBAL_COLORS.black};
  color: ${GLOBAL_COLORS.orange.text};
  font-family: ${GLOBAL_FONTS.modal.mainText};

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
  font-size: 2vw;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const SecondaryText = styled.p`
  font-size: 1.6vw;
  margin-top: 1rem;
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
}

function ModalOneButton({
  onClick,
  mainText,
  secondaryText,
  buttonText,
}: ModalOneButtonProps) {
  const [isClicked, setIsClicked] = useState(false);
  const timerRef = useRef<number>(0);

  function handleClick() {
    setIsClicked(true);

    const clickTimer = window.setTimeout(() => {
      onClick();
    }, 350);

    timerRef.current = clickTimer;
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <ScreenDarkener>
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
