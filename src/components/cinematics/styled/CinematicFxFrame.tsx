import styled, { css, keyframes } from "styled-components";
import {
  CinematicFxFrameActualShotData,
  CinematicFxFrameNextShotData,
} from "../cinematicTypes";
import { useState } from "react";

const tremorLight = keyframes`
  0%, 100% { transform: translate(0, 0) rotate(0); }
  10% { transform: translate(-0.5px, -0.5px) rotate(-0.3deg); }
  30% { transform: translate(0.7px, 0.7px) rotate(0.1deg); }
  50% { transform: translate(-0.3px, 0.4px) rotate(0.05deg); }
  70% { transform: translate(0.4px, -0.2px) rotate(-0.05deg); }
  90% { transform: translate(-0.2px, 0.3px) rotate(0.07deg); }
`;

const tremorMedium = keyframes`
  0%, 100% { transform: translate(0, 0) rotate(0); }
  10% { transform: translate(-2px, -3px) rotate(-0.3deg); }
  30% { transform: translate(3px, 2px) rotate(0.4deg); }
  50% { transform: translate(-3px, 1px) rotate(0.5deg); }
  70% { transform: translate(2px, -2px) rotate(-0.2deg); }
  90% { transform: translate(-1px, 3px) rotate(0.6deg); }
`;

const tremorHigh = keyframes`
  0%, 100% { transform: translate(0, 0) rotate(0); }
  10% { transform: translate(-6px, -8px) rotate(-1.2deg); }
  30% { transform: translate(8px, 5px) rotate(1.5deg); }
  50% { transform: translate(-7px, 4px) rotate(2deg); }
  70% { transform: translate(5px, -6px) rotate(-1.8deg); }
  90% { transform: translate(-4px, 7px) rotate(2.2deg); }
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const MainContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 3;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface CurrentShotFxProps {
  $widePicture: boolean;
  $tremorIntensity: string | undefined;
}

const CurrentShotFx = styled.div<CurrentShotFxProps>`
  position: relative;
  width: ${({ $widePicture }) => ($widePicture ? "70vw" : "40vw")};
  aspect-ratio: ${({ $widePicture }) =>
    $widePicture ? "1376 / 768" : "1 / 1"};
  z-index: 1;
  transform-origin: center;

  ${({ $tremorIntensity }) => {
    if ($tremorIntensity) {
      let animationToApply = tremorLight;
      let animationTime = "";

      switch ($tremorIntensity) {
        case "low":
          animationToApply = tremorLight;
          animationTime = "150ms";
          break;

        case "medium":
          animationToApply = tremorMedium;
          animationTime = "120ms";
          break;

        case "high":
          animationToApply = tremorHigh;
          animationTime = "100ms";
          break;

        default:
          break;
      }

      return css`
        animation: ${animationToApply} ${animationTime} infinite linear;
      `;
    }
  }}
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const fadeAnimation = keyframes`
0% {
	opacity: 0;
}
100% {
	opacity: 1;
}
`;

interface NextShotFxProps {
  $widePicture: boolean;
  $fade: boolean;
  $fadeDuration: number;
  $tremorIntensity: string | undefined;
}

const NextShotFx = styled(CurrentShotFx)<NextShotFxProps>`
  display: ${({ $fade }) => ($fade ? "block" : "none")};
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  opacity: 0;

  ${({ $fade, $fadeDuration, $tremorIntensity }) => {
    const parts: Array<ReturnType<typeof css>> = [];

    if ($fade) {
      parts.push(css`
        ${fadeAnimation} ${$fadeDuration}ms forwards
      `);
    }

    let animationToApply = tremorLight;
    let animationTime = "";

    switch ($tremorIntensity) {
      case "low":
        animationToApply = tremorLight;
        animationTime = "150ms";
        break;

      case "medium":
        animationToApply = tremorMedium;
        animationTime = "120ms";
        break;

      case "high":
        animationToApply = tremorHigh;
        animationTime = "100ms";
        break;

      default:
        break;
    }

    parts.push(css`
      ${animationToApply} ${animationTime} infinite linear
    `);

    if (parts.length === 0) return "";

    /* Une las animaciones con comas */
    return css`
      animation: ${parts[0]}${parts.slice(1).map((p) => css`, ${p}`)};
    `;
  }}
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////    MAIN COMPONENT   ////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface CinematicFxFrameProps {
  fxActualShot: CinematicFxFrameActualShotData | null;
  fxNextShot: CinematicFxFrameNextShotData | null;
}

function CinematicFxFrame({ fxActualShot, fxNextShot }: CinematicFxFrameProps) {
  const [applyFade, setApplyFade] = useState<boolean>(false);
  const [isCurrentContainerTrembling, setIsCurrentContainerTrembling] =
    useState<boolean>(false);
  const [isNextContainerTrembling, setIsNextContainerTrembling] =
    useState<boolean>(false);

  const defaultFadeDuration = 2000;
  const fadeTransitionDuration =
    fxActualShot?.fadeDuration || defaultFadeDuration;

  return (
    <MainContainer>
      <CurrentShotFx
        $widePicture={
          fxActualShot?.widePicture ? fxActualShot.widePicture : true
        }
        $tremorIntensity={
          isCurrentContainerTrembling
            ? fxActualShot?.specialFX?.tremor?.intensity
            : undefined
        }
      ></CurrentShotFx>
      <NextShotFx
        $widePicture={fxNextShot?.widePicture ? fxNextShot.widePicture : true}
        $fade={applyFade}
        $fadeDuration={fadeTransitionDuration}
        $tremorIntensity={
          isNextContainerTrembling
            ? fxNextShot?.specialFX?.tremor?.intensity
            : undefined
        }
      ></NextShotFx>
    </MainContainer>
  );
}

export default CinematicFxFrame;
