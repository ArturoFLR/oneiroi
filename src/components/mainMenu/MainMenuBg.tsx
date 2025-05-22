import { GLOBAL_COLORS } from "../../theme";
import styled, { keyframes } from "styled-components";
import DistortionWrapper from "../common/fxAndFilters/DistortionWrapper";
import { useLayoutEffect, useState } from "react";

import bgImage from "@assets/graphics/backgrounds/clouds-stars_02.webp";
import posterImg from "@assets/graphics/backgrounds/main-menu-bg.webp";
import posterLogo from "@assets/graphics/logo/oneiroi-logo_1.webp";

const posterAnimation = keyframes`
  0% {
    scale: 0.8;
    opacity: 0.3;
  }
  100% {
    scale: 1;
    opacity: 1;
  }
`;

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const MainContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100vw;
  height: 100vh;
  z-index: 1;
  overflow: hidden;
  animation: ${fadeIn} 4s ease-in-out forwards;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-image: url(${bgImage});
    background-size: cover;
    background-repeat: no-repeat;
    filter: brightness(0.9) blur(6px);
    z-index: 0;
  }
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const PosterContainer = styled.div`
  position: relative;
  overflow: hidden;
  width: ${() => (window.innerWidth > window.innerHeight ? "auto" : "99.5%")};
  height: ${() => (window.innerWidth > window.innerHeight ? "99.5%" : "auto")};
  aspect-ratio: 1/1;
  border: 4px solid ${GLOBAL_COLORS.white};
  border-radius: 10px;
  opacity: 0;
  will-change: opacity scale;
  animation: ${posterAnimation} 8s ease-in-out forwards;
  z-index: 2;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const Poster = styled.img`
  width: 100%;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const LogoContainer = styled.div`
  position: absolute;
  bottom: 7%;
  left: 25%;
  width: 50%;
  opacity: 0;
  will-change: opacity;
  animation: ${fadeIn} 2s 8s ease-in-out forwards;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const Logo = styled.img`
  width: 100%;
  filter: drop-shadow(2px 2px 0px ${GLOBAL_COLORS.black});
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////    MAIN COMPONENT   ////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function MainMenuBg() {
  const [, setHasWindowResized] = useState(false);

  useLayoutEffect(() => {
    const handleResize = () => {
      setHasWindowResized((prev) => !prev);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  return (
    <MainContainer>
      <PosterContainer>
        <Poster src={posterImg} alt="Portada de Oneiroi" />

        <LogoContainer>
          <DistortionWrapper increment={0.001} intensity={3}>
            <Logo src={posterLogo} alt="Logo de Oneiroi" />
          </DistortionWrapper>
        </LogoContainer>
      </PosterContainer>
    </MainContainer>
  );
}

export default MainMenuBg;
