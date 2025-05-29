import { useEffect, useRef, useState } from "react";
import { GLOBAL_COLORS, GLOBAL_FONTS } from "../../theme";
import styled, { css, keyframes } from "styled-components";

const borderGlow = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const textGlow = keyframes`
	0% {
    filter: drop-shadow(0 0 0px ${GLOBAL_COLORS.orange.glow});
  }
  50% {
    filter: drop-shadow(0 0 5px ${GLOBAL_COLORS.orange.glow});
  }
  100% {
    filter: drop-shadow(0 0 0px ${GLOBAL_COLORS.orange.glow});
  }
`;

const reduceScale = keyframes`
	0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface PositionerContainerProps {
  $animateClick: boolean;
}

const PositionerContainer = styled.div<PositionerContainerProps>`
  position: absolute;
  top: 5%;
  left: 90%;

  ${({ $animateClick }) => {
    return css`
      animation: ${$animateClick ? reduceScale : "none"} 0.19s linear forwards;
    `;
  }}
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const TextContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: ${GLOBAL_COLORS.orange.text};
  font-size: 2rem;
  font-weight: 500;
  font-family: ${GLOBAL_FONTS.map.cellName};
  z-index: 3;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const StyledButton = styled.button`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  width: 80px;
  height: 80px;
  border: none;
  border-radius: 100%;
  background: ${GLOBAL_COLORS.buttons.AnimatedCircleButton.background1};
  overflow: hidden;
  user-select: none;
  transition: scale 200ms;

  &:hover,
  &:focus {
    scale: 1.1;

    ${TextContainer} {
      animation: ${textGlow} 1.5s infinite linear;
    }
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    scale: 4;
    border-radius: 100%;
    background: conic-gradient(
      from 0deg,
      rgb(83, 74, 37) 0%,
      rgb(83, 74, 37) 37%,
      ${GLOBAL_COLORS.buttons.AnimatedCircleButton.backgorund2} 40%,
      ${GLOBAL_COLORS.buttons.AnimatedCircleButton.backgorund2} 44%,
      rgb(83, 74, 37) 47%,
      rgb(83, 74, 37) 85%,
      ${GLOBAL_COLORS.buttons.AnimatedCircleButton.backgorund2} 88%,
      ${GLOBAL_COLORS.buttons.AnimatedCircleButton.backgorund2} 92%,
      rgb(83, 74, 37) 95%
    );
    background-size: 100% 100%;
    animation: ${borderGlow} 3s infinite linear;
    z-index: 1;
  }

  &::after {
    content: "";
    position: absolute;
    top: 2px;
    left: 2px;
    right: 2px;
    bottom: 2px;
    background: ${GLOBAL_COLORS.buttons.AnimatedCircleButton.background1};
    border-radius: 100%;
    z-index: 2;
  }
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////    MAIN COMPONENT   ////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface SkipCinematicProps {
  onClick: () => void;
  children?: React.ReactNode;
}

function AnimatedCircleButton({ onClick, children }: SkipCinematicProps) {
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const timeoutRef = useRef<number>(0);

  function handleClick() {
    setIsClicked(true);

    const timeout = window.setTimeout(() => {
      onClick();
    }, 200);

    timeoutRef.current = timeout;
  }

  useEffect(() => {
    return () => {
      window.clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <PositionerContainer $animateClick={isClicked}>
      <StyledButton onClick={handleClick}>
        <TextContainer>{children}</TextContainer>
      </StyledButton>
    </PositionerContainer>
  );
}

export default AnimatedCircleButton;
