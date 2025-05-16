import { useEffect, useState } from "react";
import styled, { css, keyframes } from "styled-components";

const fadeIn = keyframes`
      0% {opacity: 1}
      100% {opacity: 0}
    `;

interface MainContainerProps {
  $color: string;
  $duration: number;
  $isFading: boolean;
}

const MainContainer = styled.div<MainContainerProps>`
  position: absolute;
  overflow: hidden;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  will-change: opacity;
  background-color: ${({ $color }) => $color};
  z-index: 7;

  ${({ $duration, $isFading }) => {
    return css`
      animation: ${$isFading ? fadeIn : "none"} ${$duration}ms linear forwards;
    `;
  }}
`;

interface ManualFadeInFxProps {
  color: string;
  delay: number;
  duration: number;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////    MAIN COMPONENT   ////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function ManualFadeInFx({ color, delay, duration }: ManualFadeInFxProps) {
  const [isFading, setIsFading] = useState<boolean>(false);

  useEffect(() => {
    let fadeTimer: number = 0;

    if (delay > 0) {
      fadeTimer = window.setTimeout(() => {
        setIsFading(true);
      }, delay);
    } else {
      setIsFading(true);
    }

    return () => {
      window.clearTimeout(fadeTimer);
    };
  }, [delay]);

  return (
    <MainContainer
      $color={color}
      $duration={duration}
      $isFading={isFading}
    ></MainContainer>
  );
}

export default ManualFadeInFx;
