import { GLOBAL_COLORS } from "../../theme";
import styled, { css, keyframes } from "styled-components";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const fadeInAnim = keyframes`
0% {
	opacity: 0;
} 
100% {
	opacity: 1;
}
`;

const fadeOutAnim = keyframes`
0% {
	opacity: 1;
} 
100% {
	opacity: 0;
}
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface MainContainerProps {
  $visible: boolean;
  $fadeDuration: number;
  $color: "light" | "dark" | "none";
  $zIndex?: number;
  $flex?: boolean;
  $flexDirection?: string;
  $justifyContent?: string;
  $alignItems?: string;
}

const MainContainer = styled.div<MainContainerProps>`
  display: ${(props) => (props.$flex ? "flex" : "block")};
  ${({ $flexDirection }) =>
    $flexDirection && `flex-direction: ${$flexDirection};`}
  ${({ $justifyContent }) =>
    $justifyContent && `justify-content: ${$justifyContent};`}
  ${({ $alignItems }) => $alignItems && `align-items: ${$alignItems};`}

  position: fixed;
  width: 100vw;
  height: 100vh;

  ${({ $color }) => {
    if ($color === "light") {
      return css`
        background-color: ${GLOBAL_COLORS.screenDarkener.light};
        backdrop-filter: blur(2px);
      `;
    } else if ($color === "dark") {
      return css`
        background-color: ${GLOBAL_COLORS.screenDarkener.dark};
        backdrop-filter: blur(2px);
      `;
    } else {
      return css`
        background-color: transparent;
      `;
    }
  }}

  ${({ $visible, $fadeDuration }) => {
    if ($visible !== false) {
      return css`
        animation: ${fadeInAnim} ${$fadeDuration}ms ease-out forwards;
      `;
    } else {
      return css`
        animation: ${fadeOutAnim} ${$fadeDuration}ms ease-in forwards;
      `;
    }
  }}

  ${({ $zIndex }) => $zIndex && `z-index: ${$zIndex};`}
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////    MAIN COMPONENT   ////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Se utiliza para hacer un fadein y fadeout de pantalla, aplicándolo sobre todo el contenido.

interface ScreenFadderProps {
  elementReference?: React.RefObject<HTMLDivElement | null>; //Se usa para calcular los tamaños de fuentes en función del tamaño de la ventana
  visible: boolean; //Indica si el contenido debe ser visible (fadein) o no (fadeout)
  fadeDuration: number;
  color?: "light" | "dark" | "none";
  zIndex?: number;
  flex?: boolean;
  flexDirection?: string;
  justifyContent?: string;
  alignItems?: string;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}

function ScreenFader({
  elementReference,
  visible,
  fadeDuration,
  color = "none",
  zIndex,
  flex,
  flexDirection,
  justifyContent,
  alignItems,
  children,
  onClick,
}: ScreenFadderProps) {
  return (
    <MainContainer
      id="screenFader"
      ref={elementReference}
      $visible={visible}
      $fadeDuration={fadeDuration}
      $color={color}
      $zIndex={zIndex}
      $flex={flex}
      $flexDirection={flexDirection}
      $justifyContent={justifyContent}
      $alignItems={alignItems}
      onClick={onClick}
    >
      {children}
    </MainContainer>
  );
}

export default ScreenFader;
