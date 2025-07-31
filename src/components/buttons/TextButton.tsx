import { GLOBAL_COLORS, GLOBAL_FONTS } from "../../theme";
import styled, { css, keyframes } from "styled-components";

const pulseAnimation = keyframes`
  0% {
    scale: 1;
  }
  100% {
    scale: 1.05;
  }
`;

interface StyledButtonProps {
  $fontSize: string;
  $fontFamily: string;
  $color?: string;
  $textShadow?: string;
  $hoverColor?: string;
  $animated?: boolean;
}

const StyledButton = styled.button<StyledButtonProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  color: ${({ $color }) => $color};
  font-family: ${({ $fontFamily }) => $fontFamily};
  font-size: ${({ $fontSize }) => $fontSize};
  filter: drop-shadow(0.7px 0.7px 0px ${({ $textShadow }) => $textShadow});
  background-color: transparent;
  border: 0px;
  cursor: pointer;
  animation: ${({ $animated }) => {
    if ($animated) {
      return css`
        ${pulseAnimation} 0.9s ease-in-out infinite alternate
      `;
    } else {
      return "none";
    }
  }};
  transition-duration: 200ms;

  &:hover {
    animation-play-state: paused;
    /* animation: none; */
    scale: 1.15;
    color: ${({ $hoverColor }) => $hoverColor};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
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
  fontSize: string; // Usar la dunción "calcFontSize" en /utils para pasarle este valor.
  fontFamily?: string;
  color?: string;
  textShadow?: string;
  hoverColor?: string;
  animated?: boolean;
  disabled?: boolean;
}

function TextButton({
  onClick,
  children,
  fontSize,
  fontFamily,
  color,
  textShadow,
  hoverColor,
  animated,
  disabled,
}: TextButtonProps) {
  // Valores por defecto
  fontFamily = fontFamily || GLOBAL_FONTS.buttons.ModalTextButton;
  color = color || GLOBAL_COLORS.buttons.ModalTextButton.text;
  textShadow = textShadow || GLOBAL_COLORS.buttons.ModalTextButton.textShadow;
  hoverColor = hoverColor || GLOBAL_COLORS.buttons.ModalTextButton.textHover;
  animated = typeof animated === "undefined" ? true : animated;
  disabled = typeof disabled === "undefined" ? false : disabled;

  return (
    <StyledButton
      onClick={onClick}
      disabled={disabled}
      $fontSize={fontSize}
      $fontFamily={fontFamily}
      $color={color}
      $textShadow={textShadow}
      $hoverColor={hoverColor}
      $animated={animated}
    >
      {children}
    </StyledButton>
  );
}

export default TextButton;
