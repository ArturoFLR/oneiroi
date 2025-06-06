import { GLOBAL_COLORS } from "../../../theme";
import styled, { css, keyframes } from "styled-components";
import DistortionWrapper from "../../common/fxAndFilters/DistortionWrapper";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import bgImage from "@assets/graphics/backgrounds/clouds-stars_02.webp";
import posterImg from "@assets/graphics/backgrounds/main-menu-bg.webp";
import posterLogo from "@assets/graphics/logo/oneiroi-logo_1.webp";

const posterAnimation1 = keyframes`
  0% {
    scale: 0.8;
    opacity: 0.3;
  }
  100% {
    scale: 1;
    opacity: 1;
  }
`;

const posterAnimation2 = (distance: string) => keyframes`
  0% {
    left: 0%; 
  }
  100% {
    left: ${distance};
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

interface MainContainerProps {
  $animationToPlay: number;
}

const MainContainer = styled.div<MainContainerProps>`
  position: relative;
  display: flex;
  ${({ $animationToPlay }) => {
    // Si PosterContainer aún no tiene su posición final
    if ($animationToPlay !== 0) {
      if (window.innerWidth > window.innerHeight) {
        return css`
          justify-content: center;
        `;
      }
      // Si PosterContainer ya tiene su posición final
    } else {
      if (window.innerWidth > window.innerHeight) {
        return css`
          flex-direction: row;
          justify-content: flex-end;
          align-items: flex-start;
        `;
      } else {
        return css`
          flex-direction: column-reverse;
          justify-content: center;
          align-items: center;
        `;
      }
    }
  }}

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
    filter: brightness(0.6) blur(6px);
    z-index: 0;
  }
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface PosterContainerProps {
  $distanceToBorder: string;
  $animationToPlay: number;
}

const PosterContainer = styled.div<PosterContainerProps>`
  position: relative;
  overflow: hidden;
  flex-grow: 0;
  width: ${() => (window.innerWidth > window.innerHeight ? "auto" : "99.9%")};
  height: ${() =>
    window.innerWidth > window.innerHeight ? "99.5%" : "fit-content"};
  aspect-ratio: 1/1;
  margin-top: 0.25vh;
  border: 4px solid ${GLOBAL_COLORS.white};
  border-radius: 10px;
  will-change: opacity scale;
  animation: ${({ $animationToPlay, $distanceToBorder }) => {
    if ($animationToPlay === 1) {
      return css`
        ${posterAnimation1} 8s ease-in-out forwards
      `;
    } else if ($animationToPlay === 2) {
      return css`
        ${posterAnimation2($distanceToBorder)} 2s ${window.innerWidth >
        window.innerHeight
          ? "2s"
          : "0.1s"} ease-in-out forwards
      `;
    } else {
      return "none;";
    }
  }};
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
  animation: ${fadeIn} 2s 7.6s ease-in-out forwards;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const Logo = styled.img`
  width: 100%;
  filter: drop-shadow(2px 2px 0px ${GLOBAL_COLORS.black});
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface OptionsContainer {
  $visible: boolean;
}

const OptionsContainer = styled.div<OptionsContainer>`
  display: ${({ $visible }) => ($visible ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  padding: ${() => (window.innerWidth > window.innerHeight ? "0" : "2rem")};
  margin-top: ${() => (window.innerWidth > window.innerHeight ? "5vh" : "0")};
  margin-left: ${() => (window.innerWidth > window.innerHeight ? "6vw" : "0")};
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////    MAIN COMPONENT   ////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface MainMenuBGProps {
  isUserWatchingCinematics: boolean;
  children: React.ReactElement;
}

function MainMenuBg({ children, isUserWatchingCinematics }: MainMenuBGProps) {
  const [animationDistance, setAnimationDistance] = useState<string>("0px");
  const [animationToPlay, setAnimationToPlay] = useState<number>(1);

  const posterContainerElement = useRef<HTMLDivElement>(null);

  // Calcula la distancia que debe recorrer la animación del poster para quedar a la derecha de la pantalla en cualquier resolución
  const calcDistance = useCallback(() => {
    if (posterContainerElement.current) {
      const rect = posterContainerElement.current.getBoundingClientRect();
      const distance = window.innerWidth - rect.right;
      const distanceString = `${distance}px`;

      setAnimationDistance(distanceString);
    }
  }, []);

  // Establece un listener para el evento resize de window y recalcula la distancia de la animación cuando se produce.
  useLayoutEffect(() => {
    const handleResize = () => {
      calcDistance();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [calcDistance]);

  // Establece un listener para saber cuándo ha terminado una animación, para poder aplicar la siguiente.
  useEffect(() => {
    // Si el usuario viene de ver una cinemática voluntariamente, es porque ya ha visto la animación del menú principal. Nos la ahorramos.
    if (isUserWatchingCinematics) {
      setAnimationToPlay(0);
      return;
    }

    const posterElement = posterContainerElement.current;

    // Como Styled Components hashea el nombre de las animaciones, necesitamos saber qué nombre les dará:
    const actualAnimation1Name = posterAnimation1.getName();
    const actualAnimation2Name = posterAnimation2(animationDistance).getName();

    function handleAnimationEnd(event: AnimationEvent) {
      if (event.animationName === actualAnimation1Name) {
        setAnimationToPlay(2);
        calcDistance();
      } else if (event.animationName === actualAnimation2Name) {
        setAnimationToPlay(0);
      }
    }

    if (posterElement) {
      posterElement.addEventListener("animationend", handleAnimationEnd);
    }

    return () => {
      posterElement?.removeEventListener("animationend", handleAnimationEnd);
    };
  }, [
    calcDistance,
    animationToPlay,
    animationDistance,
    isUserWatchingCinematics,
  ]);

  return (
    <MainContainer $animationToPlay={animationToPlay}>
      <OptionsContainer $visible={animationToPlay === 0 ? true : false}>
        {animationToPlay === 0 ? children : null}
      </OptionsContainer>

      <PosterContainer
        ref={posterContainerElement}
        $distanceToBorder={animationDistance}
        $animationToPlay={animationToPlay}
      >
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
