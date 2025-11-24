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
}

const MainContainer = styled.div<MainContainerProps>`
  position: fixed;
  width: 100vw;
  height: 100vh;

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
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////    MAIN COMPONENT   ////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Se utiliza para hacer un fadein y fadeout de pantalla, aplicándolo sobre todo el contenido.

interface ScreenFadderProps {
  elementReference: React.RefObject<HTMLDivElement | null>; //Se usa para calcular los tamaños de fuentes en función del tamaño de la ventana
  visible: boolean; //Indica si el contenido debe ser visible (fadein) o no (fadeout)
  fadeDuration: number;
  children: React.ReactNode;
}

function ScreenFader({
  elementReference,
  visible,
  fadeDuration,
  children,
}: ScreenFadderProps) {
  return (
    <MainContainer
      ref={elementReference}
      $visible={visible}
      $fadeDuration={fadeDuration}
    >
      {children}
    </MainContainer>
  );
}

export default ScreenFader;
