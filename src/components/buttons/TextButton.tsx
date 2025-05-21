import { GLOBAL_COLORS, GLOBAL_FONTS } from "../../theme";
import styled, { keyframes } from "styled-components";

const pulseAnimation = keyframes`
  0% {
    scale: 1;
  }
  100% {
    scale: 1.05;
  }
`;

interface StyledButtonProps {
  $fontSize: "small" | "medium" | "big";
}

const fontSizeMap = {
  small: "1.4vw",
  medium: "1.7vw",
  big: "2.6vw",
};

const StyledButton = styled.button<StyledButtonProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  color: ${GLOBAL_COLORS.buttons.TextButton.text};
  font-family: ${GLOBAL_FONTS.buttons.TextButton};
  font-size: ${({ $fontSize }) => fontSizeMap[$fontSize]};
  filter: drop-shadow(
    0.7px 0.7px 0px ${GLOBAL_COLORS.buttons.TextButton.textShadow}
  );
  background-color: transparent;
  border: 0px;
  cursor: pointer;
  animation: ${pulseAnimation} 0.9s ease-in-out infinite alternate;
  transition-duration: 200ms;

  &:hover {
    animation-play-state: paused;
    /* animation: none; */
    scale: 1.15;
    color: ${GLOBAL_COLORS.buttons.TextButton.textHover};
  }
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////    MAIN COMPONENT   ////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface TextButtonProps {
  onClick: () => void;
  children?: React.ReactNode;
  fontSize?: "small" | "medium" | "big";
}

function TextButton({ onClick, children, fontSize }: TextButtonProps) {
  fontSize = fontSize || "medium"; //Valor por defecto

  return (
    <StyledButton onClick={onClick} $fontSize={fontSize}>
      {children}
    </StyledButton>
  );
}

export default TextButton;
