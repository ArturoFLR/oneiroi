import { GLOBAL_COLORS } from "../../../theme";
import styled from "styled-components";

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

interface MainViewerProps {
  mainPicture?: string;
  mainPictureAlt?: string;
  wideMainPicture: boolean;
  mainColor?: string;
  nextPicture?: string;
  nextPictureAlt?: string;
  wideNextPicture: boolean;
  nextColor?: string;
}

const MainPicture = styled.img`
  width: 100%;
`;

const NextPicture = styled.img`
  width: 100%;
`;

function MainViewer({
  mainPicture,
  mainPictureAlt,
  wideMainPicture,
  mainColor,
  nextPicture,
  nextPictureAlt,
  wideNextPicture,
  nextColor,
}: MainViewerProps) {
  const mainContainerBgColor = mainColor ? mainColor : "transparent";
  const nextContainerBgColor = nextColor ? nextColor : "transparent";

  return (
    <MainContainer id="cinematicViewerContainer">
      <CurrentPictureContainer
        id="cinemaCurrentPictureContainer"
        $widePicture={wideMainPicture}
        $bgColor={mainContainerBgColor}
      >
        {mainPicture ? (
          <MainPicture src={mainPicture} alt={mainPictureAlt}></MainPicture>
        ) : null}
      </CurrentPictureContainer>
      <NextPictureContainer
        id="cinemaNextPictureContainer"
        $widePicture={wideNextPicture}
        $bgColor={nextContainerBgColor}
      >
        {nextPicture ? (
          <NextPicture src={nextPicture} alt={nextPictureAlt}></NextPicture>
        ) : null}
      </NextPictureContainer>
    </MainContainer>
  );
}

export default MainViewer;
