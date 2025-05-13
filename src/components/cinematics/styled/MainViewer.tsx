import styled, { css, keyframes } from "styled-components";
import {
  MainViewerActualShotData,
  MainViewerNextShotData,
  ZoomAnimationData,
  ZoomData,
} from "../cinematicTypes";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import CinematicFxFrame from "./CinematicFxFrame";

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
  position: relative;
  overflow: hidden;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface CurrentPictureContainerProps {
  $widePicture: boolean;
  $bgColor: string;
  $tremorIntensity: string | undefined;
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

interface NextPictureContainerProps {
  $widePicture: boolean;
  $bgColor: string;
  $fade: boolean;
  $fadeDuration: number;
  $tremorIntensity: string | undefined;
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
  transform-origin: center;

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

const MainPicture = styled.img`
  position: relative;
  width: 100%;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const NextPicture = styled(MainPicture)`
  position: relative;
  width: 100%;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const zoomAnimation = (props: ZoomData) => keyframes`
0% {
  scale: ${props.zoomStartSize};
  top: ${props.zoomStartPosition.top}%;
  left: ${props.zoomStartPosition.left}%;
}
100% {
  scale: ${props.zoomEndSize};
  top: ${props.zoomEndPosition.top}%;
  left: ${props.zoomEndPosition.left}%;
}
`;

interface CurrentPictureAndFxWrapperProps {
  $zoomData: ZoomData | undefined;
  $shotDuration: number;
}

const CurrentPictureAndFxWrapper = styled.div<CurrentPictureAndFxWrapperProps>`
  position: relative;
  scale: ${({ $zoomData }) => ($zoomData ? $zoomData.zoomStartSize : 1)};
  top: ${({ $zoomData }) => ($zoomData ? $zoomData.zoomStartPosition.top : 0)}%;
  left: ${({ $zoomData }) =>
    $zoomData ? $zoomData.zoomStartPosition.left : 0}%;
  width: 100%;
  height: 100%;

  ${({ $zoomData, $shotDuration }) => {
    if ($zoomData)
      return css`
        animation: ${zoomAnimation($zoomData)} ${$shotDuration}ms forwards
          ${$zoomData.animType};
      `;
  }}
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const NextPictureAndFxWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////    MAIN COMPONENT   ////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface MainViewerProps {
  actualShot: MainViewerActualShotData;
  nextShot: null | MainViewerNextShotData;
}

function MainViewer({ actualShot, nextShot }: MainViewerProps) {
  const [applyFade, setApplyFade] = useState<boolean>(false);
  const [isZoomAPIAnimPlaying, setIsZoomAPIAnimPlaying] =
    useState<boolean>(false);
  const [isCurrentContainerTrembling, setIsCurrentContainerTrembling] =
    useState<boolean>(false);
  const [isNextContainerTrembling, setIsNextContainerTrembling] =
    useState<boolean>(false);

  const nextPictureContainerElement = useRef<HTMLDivElement>(null);
  const currentPictureAndFxWrapperElement = useRef<HTMLDivElement>(null);
  const nextPictureAndFxWrapperElement = useRef<HTMLDivElement>(null);

  const zoomAnimation1DataRef = useRef<ZoomAnimationData>({
    data: null,
    progress: 0,
    keyframes: null,
    options: null,
    shotId: -1,
  });
  const zoomAnimation2DataRef = useRef<ZoomAnimationData>({
    data: null,
    progress: 0,
    keyframes: null,
    options: null,
    shotId: -1,
  });

  const animationTimersRef = useRef<number[]>([]);
  const trembleAnimTimersRef = useRef<number[]>([]);

  const mainContainerBgColor = actualShot.backgroundColor
    ? actualShot.backgroundColor
    : "transparent";
  const nextContainerBgColor = nextShot?.backgroundColor
    ? nextShot.backgroundColor
    : "transparent";

  function resetZoomAnimValues(animData: React.RefObject<ZoomAnimationData>) {
    animData.current.data?.cancel();
    animData.current.data = null;
    animData.current.progress = 0;
    animData.current.keyframes = null;
    animData.current.options = null;
    animData.current.shotId = -1;
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////  FADE  ////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////// ZOOM / PANNING  ////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //Las animaciones que gestionan los siguientes useLayoutEffect son creadas con Web Animations API y sólo se aplican si
  //el siguiente plano tiene un efecto de zoom / panning y la transición es por "fade".
  //Es estos casos, la animación debe empezar a verse en NextPicture cuando comienza a hacer el fade al siguiente plano.
  //Para ello, se inicia la animación en NextPicture y al cambiar de plano, se replica la misma animación en
  //CurrentPicture continuando por donde se quedó al cambiar de plano.
  //Los procesos están duplicados para dos posibles animaciones: zoomAnimation1DataRef y zoomAnimation2DataRef, para
  //los casos en los que en el plano actual estamos terminando de aplicar una animación y, como en el siguiente plano también
  //hay animación de zoom / panning y la transición es por "fade", tenemos que iniciar otra nueva.
  //IMPORTANTE: para animaciones de zoom / panning cuando la transición es por corte (cut), se usan animaciones CSS convencionales.

  //Calcula y actualiza el progreso de la animación de zoom /panning:
  useLayoutEffect(() => {
    //Actualizamos el progreso de la animación 1
    if (zoomAnimation1DataRef.current.data) {
      const animation1TotalDuration =
        zoomAnimation1DataRef.current?.data.effect?.getTiming().duration;

      const animation1CurrentTime =
        zoomAnimation1DataRef.current?.data.currentTime;

      if (
        typeof animation1TotalDuration === "number" &&
        typeof animation1CurrentTime === "number"
      )
        zoomAnimation1DataRef.current.progress =
          (animation1CurrentTime / animation1TotalDuration) * 100;
    }

    //Actualizamos el progreso de la animación 2
    if (zoomAnimation2DataRef.current.data) {
      const animation2TotalDuration =
        zoomAnimation2DataRef.current?.data.effect?.getTiming().duration;

      const animation2CurrentTime =
        zoomAnimation2DataRef.current?.data.currentTime;

      if (
        typeof animation2TotalDuration === "number" &&
        typeof animation2CurrentTime === "number"
      )
        zoomAnimation2DataRef.current.progress =
          (animation2CurrentTime / animation2TotalDuration) * 100;
    }
  }, [actualShot]);

  //Finaliza las animaciones de zoom / panning y resetea sus variables si han terminado.
  //Utiliza el estado-flag "setIsZoomAPIAnimPlaying" para evitar que se ejecute dos veces el siguiente useLayoutEffect a casusa del <StrictMode>.
  useLayoutEffect(() => {
    //Establecemos un margen de seguridad, ya que puede haber un ligero retraso en el comienzo de los timers por tener que hacer cálculos antes de
    //iniciar, pausar o resumir la animación => La animación puede estar al 99.8657% cuando ya debería haber terminado.
    const securityMargin = 3;

    if (zoomAnimation1DataRef.current.progress >= 100 - securityMargin) {
      resetZoomAnimValues(zoomAnimation1DataRef);
    }

    if (zoomAnimation2DataRef.current.progress >= 100 - securityMargin) {
      resetZoomAnimValues(zoomAnimation2DataRef);
    }

    if (nextShot && nextShot.zoom && actualShot.shotTransition === "fade") {
      setIsZoomAPIAnimPlaying(true);
    } else {
      setIsZoomAPIAnimPlaying(false);
    }

    return () => {
      setIsZoomAPIAnimPlaying(false);
    };
  }, [nextShot, actualShot.shotTransition]);

  //Este 2º useLayoutEffect se encarga de retomar en el CurrentPicture una animación de zoom / panning iniciada en el NextPicture
  //en el plano anterior.
  // Es importante que este layoutEffect esté antes del que crea la animación. Si no es así, se pausaría la animación en el NextPicture
  // y se aplicaría la nueva a CurrentPicture en el mismo plano.
  // Sólo se ejecuta si ya hay una animación iniciada (con datos).
  useLayoutEffect(() => {
    //Pausamos la animación 1 y obtenemos su "currentTime".
    if (zoomAnimation1DataRef.current.data) {
      zoomAnimation1DataRef.current.data.pause();

      const remainingAnimation1Time =
        zoomAnimation1DataRef.current.data.currentTime;

      // Creamos una nueva animación
      const effect2 = new KeyframeEffect(
        currentPictureAndFxWrapperElement.current,
        zoomAnimation1DataRef.current.keyframes,
        zoomAnimation1DataRef.current.options
          ? zoomAnimation1DataRef.current.options
          : undefined
      );

      //Cancelamos la animación original, ya que hemos creado una nueva, para que no siga aplicada al NextPictureContainer, aunque esté pausada.
      zoomAnimation1DataRef.current.data.cancel();
      zoomAnimation1DataRef.current.data = new Animation(
        effect2,
        document.timeline
      );

      //Asignamos a esta nueva animación el tiempo transcurrido de la primera, para que continúe en el punto exacto en que se pausó.
      if (remainingAnimation1Time)
        zoomAnimation1DataRef.current.data.currentTime =
          remainingAnimation1Time;

      zoomAnimation1DataRef.current.data.play();
    }

    //Hacemos exactamente lo mismo para la animación 2.
    if (zoomAnimation2DataRef.current.data) {
      zoomAnimation2DataRef.current.data.pause();

      const remainingAnimation2Time =
        zoomAnimation2DataRef.current.data.currentTime;

      const effect2 = new KeyframeEffect(
        currentPictureAndFxWrapperElement.current,
        zoomAnimation2DataRef.current.keyframes,
        zoomAnimation2DataRef.current.options
          ? zoomAnimation2DataRef.current.options
          : undefined
      );

      zoomAnimation2DataRef.current.data.cancel();
      zoomAnimation2DataRef.current.data = new Animation(
        effect2,
        document.timeline
      );

      if (remainingAnimation2Time)
        zoomAnimation2DataRef.current.data.currentTime =
          remainingAnimation2Time;

      zoomAnimation2DataRef.current.data.play();
    }
  }, [actualShot]);

  //Se encarga de crear una nueva animación y iniciarla en NextPicture.
  // En el siguiente cambio de plano, el layoutEffect anterior pausará la animación y aplicará la parte que falta a  CurrentPicture.
  // Es importante que este layoutEffect esté después del anterior. Si no es así, se pausaría la animación en NextPicture y se
  // aplicaría la nueva a CurrentPicture en el mismo plano.
  useLayoutEffect(() => {
    if (
      isZoomAPIAnimPlaying &&
      nextShot &&
      nextShot.zoom &&
      actualShot.shotTransition === "fade"
    ) {
      const {
        zoomStartSize,
        zoomEndSize,
        zoomStartPosition,
        zoomEndPosition,
        animType,
      } = nextShot.zoom;

      //Datos de la animación y sus opciones.
      const animationKeyframes = [
        {
          transform: `scale(${zoomStartSize}) translate(${zoomStartPosition.left}%, ${zoomStartPosition.top}%)`,
        },
        {
          transform: `scale(${zoomEndSize}) translate(${zoomEndPosition.left}%, ${zoomEndPosition.top}%)`,
        },
      ];

      const animationOptions = {
        duration: actualShot.fadeDuration + nextShot.shotDuration,
        easing: animType,
      };

      // Crear efecto y animación
      const effect1 = new KeyframeEffect(
        nextPictureAndFxWrapperElement.current,
        animationKeyframes,
        animationOptions
      );

      const animationData = new Animation(effect1, document.timeline);

      //Los datos de la animación se guardan en Refs porque con el cambio de plano las variables que usan cambiarán de valor,
      //y debemos de reproducirlas exactamente igual en el siguiente plano (siguiente useLayoutEffect).
      if (!zoomAnimation1DataRef.current.data) {
        zoomAnimation1DataRef.current.data = animationData;
        zoomAnimation1DataRef.current.keyframes = animationKeyframes;
        zoomAnimation1DataRef.current.options = animationOptions;
        zoomAnimation1DataRef.current.shotId = nextShot.id;
      } else {
        zoomAnimation2DataRef.current.data = animationData;
        zoomAnimation2DataRef.current.keyframes = animationKeyframes;
        zoomAnimation2DataRef.current.options = animationOptions;
        zoomAnimation2DataRef.current.shotId = nextShot.id;
      }

      //Iniciar la animación cuando empiece el fade
      const timeToPlayAnimation =
        actualShot.shotDuration - actualShot.fadeDuration;

      const zoomAnimationTimer = window.setTimeout(() => {
        if (
          zoomAnimation1DataRef.current.data &&
          zoomAnimation1DataRef.current.progress === 0
        ) {
          zoomAnimation1DataRef.current.data.play();
        } else if (
          zoomAnimation2DataRef.current.data &&
          zoomAnimation2DataRef.current.progress === 0
        ) {
          zoomAnimation2DataRef.current.data.play();
        }
      }, timeToPlayAnimation);

      animationTimersRef.current.push(zoomAnimationTimer);
    }

    return () => {
      animationTimersRef.current.forEach((timer) => {
        window.clearTimeout(timer);
      });
      animationTimersRef.current = [];
    };
  }, [
    actualShot.shotTransition,
    actualShot.fadeDuration,
    actualShot.shotDuration,
    nextShot,
    isZoomAPIAnimPlaying,
  ]);

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////  TREMBLING  /////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //El temblor se aplica a los contenedores CurrentPictureContainer y NextPictureContainer para que no interfiera con
  //la animación de zoom / panning hecha con Web Animations API en CurrentPicture y NextPicturen, ya que ambas usan "traslate".
  useLayoutEffect(() => {
    if (actualShot?.specialFX?.tremor) {
      const { delay } = actualShot.specialFX.tremor;

      if (delay === 0) {
        setIsCurrentContainerTrembling(true);
      } else {
        const trembleTimer = window.setTimeout(() => {
          setIsCurrentContainerTrembling(true);
        }, delay);

        trembleAnimTimersRef.current.push(trembleTimer);
      }
    } else {
      setIsCurrentContainerTrembling(false);
    }

    if (nextShot?.specialFX?.tremor) {
      const { delay } = nextShot.specialFX.tremor;

      if (delay === 0) {
        setIsNextContainerTrembling(true);
      } else {
        setIsNextContainerTrembling(false);
      }
    } else {
      setIsNextContainerTrembling(false);
    }

    const timersToClear = trembleAnimTimersRef.current;

    return () => {
      timersToClear.forEach((timer) => {
        window.clearTimeout(timer);

        trembleAnimTimersRef.current = [];
      });
    };
  }, [actualShot?.specialFX?.tremor, nextShot?.specialFX?.tremor]);

  return (
    <MainContainer id="cinematicViewerContainer">
      <CurrentPictureContainer
        id="cinemaCurrentPictureContainer"
        $widePicture={actualShot.widePicture}
        $bgColor={mainContainerBgColor}
        $tremorIntensity={
          isCurrentContainerTrembling
            ? actualShot.specialFX?.tremor?.intensity
            : undefined
        }
      >
        <CurrentPictureAndFxWrapper
          ref={currentPictureAndFxWrapperElement}
          $zoomData={
            zoomAnimation1DataRef.current.shotId === actualShot.id ||
            zoomAnimation2DataRef.current.shotId === actualShot.id
              ? undefined
              : actualShot.zoom
          }
          $shotDuration={actualShot.shotDuration}
        >
          {actualShot.mainImageAlt ? (
            <MainPicture
              key={actualShot.mainImageUrl}
              src={actualShot.mainImageUrl}
              alt={actualShot.mainImageAlt}
            />
          ) : null}

          <CinematicFxFrame
            isForCurrentShot={true}
            currentShotFx={actualShot.specialFX}
            nextShotFx={nextShot?.specialFX ? nextShot.specialFX : null}
          />
        </CurrentPictureAndFxWrapper>
      </CurrentPictureContainer>

      {nextShot ? (
        <NextPictureContainer
          id="cinemaNextPictureContainer"
          $widePicture={nextShot.widePicture}
          $bgColor={nextContainerBgColor}
          $fade={applyFade}
          $fadeDuration={actualShot.fadeDuration}
          ref={nextPictureContainerElement}
          $tremorIntensity={
            isNextContainerTrembling
              ? nextShot.specialFX?.tremor?.intensity
              : undefined
          }
        >
          <NextPictureAndFxWrapper ref={nextPictureAndFxWrapperElement}>
            {nextShot.mainImageUrl ? (
              <NextPicture
                key={nextShot.mainImageUrl}
                src={nextShot.mainImageUrl}
                alt={nextShot.mainImageAlt}
                style={{
                  display:
                    actualShot.shotTransition === "cut" && !applyFade
                      ? "none"
                      : "block",
                  // Forzar capa de composición
                  willChange:
                    actualShot.shotTransition === "fade" ? "opacity" : "auto",
                }}
              />
            ) : null}

            <CinematicFxFrame
              isForCurrentShot={false}
              currentShotFx={actualShot.specialFX}
              nextShotFx={nextShot?.specialFX ? nextShot.specialFX : null}
            />
          </NextPictureAndFxWrapper>
        </NextPictureContainer>
      ) : null}
    </MainContainer>
  );
}

export default MainViewer;
