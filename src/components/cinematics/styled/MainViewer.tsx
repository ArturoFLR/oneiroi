import { GLOBAL_COLORS } from "../../../theme";
import styled from "styled-components";
import {
  MainViewerActualShotData,
  MainViewerNextShotData,
} from "../cinematicTypes";
import { useEffect, useState } from "react";

const MainContainer = styled.div`
  position: relative;
`;

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
  border-radius: 20px;
  border: 2px solid ${GLOBAL_COLORS.orange.highlightedText};
  background-color: ${({ $bgColor }) => ($bgColor ? $bgColor : "transparent")};
  z-index: 1;
`;

const NextPictureContainer = styled(CurrentPictureContainer)`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  opacity: 0;
`;

const MainPicture = styled.img`
  width: 100%;
`;

const NextPicture = styled.img`
  width: 100%;
`;

interface MainViewerProps {
  actualShot: MainViewerActualShotData;
  nextShot: null | MainViewerNextShotData;
}

function MainViewer({ actualShot, nextShot }: MainViewerProps) {
  const [applyFade, setApplyFade] = useState<boolean>(false);

  const mainContainerBgColor = actualShot.backgroundColor
    ? actualShot.backgroundColor
    : "transparent";
  const nextContainerBgColor = nextShot?.backgroundColor
    ? nextShot.backgroundColor
    : "transparent";

  useEffect(() => {
    if (actualShot.shotTransition === "fade") {
      const timeToApplyFade = actualShot.shotDuration - actualShot.fadeDuration;
    }

    return () => {};
  }, [actualShot.shotTransition]);

  return (
    <MainContainer id="cinematicViewerContainer">
      <CurrentPictureContainer
        id="cinemaCurrentPictureContainer"
        $widePicture={actualShot.widePicture}
        $bgColor={mainContainerBgColor}
      >
        {actualShot.mainImageAlt ? (
          <MainPicture
            src={actualShot.mainImageUrl}
            alt={actualShot.mainImageAlt}
          ></MainPicture>
        ) : null}
      </CurrentPictureContainer>

      {nextShot ? (
        <NextPictureContainer
          id="cinemaNextPictureContainer"
          $widePicture={nextShot.widePicture}
          $bgColor={nextContainerBgColor}
        >
          {nextShot.mainImageUrl ? (
            <NextPicture
              src={nextShot.mainImageUrl}
              alt={nextShot.mainImageAlt}
            ></NextPicture>
          ) : null}
        </NextPictureContainer>
      ) : null}
    </MainContainer>
  );
}

export default MainViewer;
