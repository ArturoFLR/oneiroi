import styled, { css, keyframes } from "styled-components";
import { ChatPhase } from "../aiChatTypes";

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

interface ContinerProps {
  $chatPhase: ChatPhase;
  $fadeDuration: number;
}

const Container = styled.div<ContinerProps>`
  width: 100vw;
  height: 100vh;

  ${({ $chatPhase, $fadeDuration }) => {
    if ($chatPhase !== "endConversation") {
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

// Este componente sólo se usa para calcular los tamaños de fuentes en función del tamaño de la ventana, y para aplicar un fade-in y un fade-out de todo el chat cuando comienza y cuando acaba.

interface MainAIChatContainerProps {
  elementReference: React.RefObject<HTMLDivElement | null>;
  chatPhase: ChatPhase;
  fadeDuration: number;
  children: React.ReactNode;
}

function MainAIChatContainer({
  elementReference,
  chatPhase,
  fadeDuration,
  children,
}: MainAIChatContainerProps) {
  return (
    <Container
      ref={elementReference}
      $chatPhase={chatPhase}
      $fadeDuration={fadeDuration}
    >
      {children}
    </Container>
  );
}

export default MainAIChatContainer;
