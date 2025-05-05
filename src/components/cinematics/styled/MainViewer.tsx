import styled, { keyframes } from "styled-components";
import {
  MainViewerActualShotData,
  MainViewerNextShotData,
} from "../cinematicTypes";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const MainContainer = styled.div`
  position: relative;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface CurrentPictureContainerProps {
  $widePicture: boolean;
  $bgColor: string;
}

const CurrentPictureContainer = styled.div<CurrentPictureContainerProps>`
  position: relative;
  overflow: hidden;
  width: ${({ $widePicture }) => ($widePicture ? "70vw" : "40vw")};
  aspect-ratio: ${({ $widePicture }) =>
    $widePicture ? "1376 / 768" : "1 / 1"};
  border-radius: 10px;
  background-color: ${({ $bgColor }) => ($bgColor ? $bgColor : "transparent")};
  z-index: 1;
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

interface NextPictureContainerProps {
  $widePicture: boolean;
  $bgColor: string;
  $fade: boolean;
  $fadeDuration: number;
}

const NextPictureContainer = styled(
  CurrentPictureContainer
)<NextPictureContainerProps>`
  display: ${({ $fade }) => ($fade ? "block" : "none")};
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  opacity: 0;
  animation: ${({ $fade }) => ($fade ? fadeAnimation : "none")}
    ${({ $fadeDuration }) => $fadeDuration}ms forwards;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const MainPicture = styled.img`
  width: 100%;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const NextPicture = styled.img`
  width: 100%;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface MainViewerProps {
  actualShot: MainViewerActualShotData;
  nextShot: null | MainViewerNextShotData;
}

function MainViewer({ actualShot, nextShot }: MainViewerProps) {
  const [applyFade, setApplyFade] = useState<boolean>(false);

  const nextPictureContainerElement = useRef<HTMLDivElement>(null);

  const mainContainerBgColor = actualShot.backgroundColor
    ? actualShot.backgroundColor
    : "transparent";
  const nextContainerBgColor = nextShot?.backgroundColor
    ? nextShot.backgroundColor
    : "transparent";

  //Aplica el efecto de fade mediante un timer, si corresponde.
  useEffect(() => {
    let fadeTimeout: number | undefined = undefined;
    if (actualShot.shotTransition === "fade") {
      const timeToApplyFade = actualShot.shotDuration - actualShot.fadeDuration;

      fadeTimeout = window.setTimeout(() => {
        setApplyFade(true);
      }, timeToApplyFade);
    }

    return () => {
      if (fadeTimeout) clearTimeout(fadeTimeout);
    };
  }, [
    actualShot.shotTransition,
    actualShot.shotDuration,
    actualShot.fadeDuration,
  ]);

  // Garantiza que NextPictureContainer sea invisible al comienzo de un nuevo shot.
  useLayoutEffect(() => {
    setApplyFade(false);
    if (nextPictureContainerElement.current) {
      nextPictureContainerElement.current.style.opacity = "0";
    }
  }, [actualShot.id]);

  return (
    <MainContainer id="cinematicViewerContainer">
      <CurrentPictureContainer
        id="cinemaCurrentPictureContainer"
        $widePicture={actualShot.widePicture}
        $bgColor={mainContainerBgColor}
      >
        {actualShot.mainImageAlt ? (
          <MainPicture
            key={actualShot.mainImageUrl}
            src={actualShot.mainImageUrl}
            alt={actualShot.mainImageAlt}
          />
        ) : null}
      </CurrentPictureContainer>

      {nextShot ? (
        <NextPictureContainer
          id="cinemaNextPictureContainer"
          $widePicture={nextShot.widePicture}
          $bgColor={nextContainerBgColor}
          $fade={applyFade}
          $fadeDuration={actualShot.fadeDuration}
          ref={nextPictureContainerElement}
        >
          {nextShot.mainImageUrl ? (
            <NextPicture
              key={nextShot.mainImageUrl}
              src={nextShot.mainImageUrl}
              alt={nextShot.mainImageAlt}
            />
          ) : null}
        </NextPictureContainer>
      ) : null}
    </MainContainer>
  );
}

export default MainViewer;
