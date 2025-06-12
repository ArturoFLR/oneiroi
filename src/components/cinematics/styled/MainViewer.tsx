import styled, { css, keyframes } from "styled-components";
import {
  MainViewerActualShotData,
  MainViewerNextShotData,
  ZoomAnimationData,
  ZoomData,
} from "../cinematicTypes";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import CinematicFxFrame from "./CinematicFxFrame";
import AnimatedTextFrame from "../../common/fxAndFilters/AnimatedTextFrame";

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

interface MainContainerPositionerProps {
  $windowWidth: number;
  $windowHeight: number;
}

const MainContainerPositioner = styled.div<MainContainerPositionerProps>`
  ${({ $windowWidth, $windowHeight }) => {
    if ($windowWidth >= $windowHeight) {
      return css`
        position: relative;
      `;
    } else {
      return css`
        position: absolute;
        top: 0.5vh;
      `;
    }
  }}
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const MainContainer = styled.div`
  position: relative;
  /* overflow: hidden; */
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
  width: ${({ $widePicture }) => ($widePicture ? "75vw" : "40vw")};
  aspect-ratio: ${({ $widePicture }) =>
    $widePicture ? "1376 / 768" : "1 / 1"};
  border-radius: 10px;
  background-color: ${({ $bgColor }) => ($bgColor ? $bgColor : "transparent")};
  margin: auto;
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

  @media screen and (orientation: portrait) {
    width: 99vw;
  }
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
        ${fadeAnimation} ${$fadeDuration}ms linear forwards
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

const CurrentPictureAndZoomableFxWrapper = styled.div<CurrentPictureAndFxWrapperProps>`
  position: relative;
  scale: ${({ $zoomData }) => ($zoomData ? $zoomData.zoomStartSize : 1)};
  top: ${({ $zoomData }) => ($zoomData ? $zoomData.zoomStartPosition.top : 0)}%;
  left: ${({ $zoomData }) =>
    $zoomData ? $zoomData.zoomStartPosition.left : 0}%;
  width: 100%;
  height: 100%;
  margin: auto;

  ${({ $zoomData, $shotDuration }) => {
    if ($zoomData)
      return css`
        animation: ${zoomAnimation($zoomData)} ${$shotDuration}ms forwards
          ${$zoomData.animType};
      `;
  }}
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const NextPictureAndZoomableFxWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  margin: auto;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////    MAIN COMPONENT   ////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface MainViewerProps {
  onNextShotClick: () => void;
  actualShot: MainViewerActualShotData;
  nextShot: null | MainViewerNextShotData;
}

function MainViewer({
  actualShot,
  nextShot,
  onNextShotClick,
}: MainViewerProps) {
  const [applyFade, setApplyFade] = useState<boolean>(false);
  const [isZoomAPIAnimPlaying, setIsZoomAPIAnimPlaying] =
    useState<boolean>(false);
  const [isCurrentContainerTrembling, setIsCurrentContainerTrembling] =
    useState<boolean>(false);
  const [isNextContainerTrembling, setIsNextContainerTrembling] =
    useState<boolean>(false);
  const [isManualTextShown, setIsManualTextShown] = useState<boolean>(false);
  const [windowSize, setWindowSize] = useState<number[]>([0, 0]);

  const nextPictureContainerElement = useRef<HTMLDivElement>(null);
  const currentPictureAndZoomableFxWrapperElement =
    useRef<HTMLDivElement>(null);
  const nextPictureAndZoomableFxWrapperElement = useRef<HTMLDivElement>(null);

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

  // En esta función se incluye el código que debe ejecutarse en MainViewer para cambiar de plano manualmente,
  // al pulsar el botón "Siguiente" en una cinemática manual. Incluye la función que llega de CinematicDirector,
  // con el código que debe ejecutarse en ese componente también, y si hay un fundido se hará mediante un timer.
  const nextShotClickTimerRef = useRef<number>(0);

  function handleNextShotClick() {
    if (actualShot.shotTransition === "cut") {
      onNextShotClick();
    } else {
      setApplyFade(true);
      const nextShotButtonTimer = window.setTimeout(() => {
        onNextShotClick();
      }, actualShot.fadeDuration);

      nextShotClickTimerRef.current = nextShotButtonTimer;
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////  MANUAL TEXT  ////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // Esta función devuelve el componente AnimatedTextFrame, si corresponde. Se usa en el "return" de MainViewer
  function generateManualText() {
    if (actualShot.specialFX?.manualText) {
      const manualTextData = actualShot.specialFX.manualText;

      const nextShotIsContinuationInfo =
        nextShot?.specialFX?.manualText?.isContinuation;
      const nextShotIsContinuation = nextShotIsContinuationInfo
        ? nextShotIsContinuationInfo
        : false;

      return (
        <AnimatedTextFrame
          isContinuation={manualTextData.isContinuation}
          nextShotIsContinuation={nextShotIsContinuation}
          text={manualTextData.text}
          size={manualTextData.size}
          npcName={manualTextData.npcName}
          npcColor={manualTextData.npcColor}
          fontFamily={manualTextData.fontFamily}
          color={manualTextData.color}
          animationTime={manualTextData.animationTime}
          textProportion={manualTextData.textProportion}
          buttonProportion={manualTextData.buttonProportion}
          handleNextShotClick={handleNextShotClick}
        />
      );
    } else return null;
  }

  // Genera el delay indicado por el usuario para mostrar el texto.
  useLayoutEffect(() => {
    // Comenzamos no mostrando el texto si el plano no tiene este efecto, o lo tiene con delay.
    if (
      !actualShot.specialFX?.manualText ||
      (actualShot.specialFX.manualText.delay &&
        actualShot.specialFX.manualText.delay > 0)
    ) {
      setIsManualTextShown(false);
    }

    let manualTextTimer: number = 0;

    // Si en este plano hay texto manual, creamos un timer para mostrarlo
    if (actualShot.specialFX?.manualText) {
      const textDelay = actualShot.specialFX?.manualText.delay
        ? actualShot.specialFX?.manualText.delay
        : 0;

      if (textDelay === 0) {
        setIsManualTextShown(true);
      } else {
        manualTextTimer = window.setTimeout(() => {
          setIsManualTextShown(true);
        }, textDelay);
      }
    }

    return () => {
      window.clearTimeout(manualTextTimer);
    };
  }, [actualShot.specialFX?.manualText]);

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////  FADE  ////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //Aplica el efecto de fade mediante un timer, si corresponde.
  useEffect(() => {
    let fadeTimeout: number | undefined = undefined;
    if (actualShot.shotTransition === "fade" && !actualShot.isManual) {
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
    actualShot.isManual,
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
  //Es estos casos, la animación debe empezar a verse en NextPictureAndZoomableFxWrapper cuando comienza a hacer el fade al siguiente plano.
  //Para ello, se inicia la animación en NextPictureAndZoomableFxWrapper y al cambiar de plano, se replica la misma animación en
  //CurrentPictureAndZoomableFxWrapper continuando por donde se quedó al cambiar de plano.
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

  //Este 2º useLayoutEffect se encarga de retomar en el CurrentPictureAndZoomableFxWrapper una animación de zoom / panning iniciada en el NextPictureAndZoomableFxWrapper
  //en el plano anterior.
  // Es importante que este layoutEffect esté antes del que crea la animación. Si no es así, se pausaría la animación en el NextPictureAndZoomableFxWrapper
  // y se aplicaría la nueva a CurrentPictureAndZoomableFxWrapper en el mismo plano.
  // Sólo se ejecuta si ya hay una animación iniciada (con datos).
  useLayoutEffect(() => {
    //Pausamos la animación 1 y obtenemos su "currentTime".
    if (zoomAnimation1DataRef.current.data) {
      zoomAnimation1DataRef.current.data.pause();

      const remainingAnimation1Time =
        zoomAnimation1DataRef.current.data.currentTime;

      // Creamos una nueva animación
      const effect2 = new KeyframeEffect(
        currentPictureAndZoomableFxWrapperElement.current,
        zoomAnimation1DataRef.current.keyframes,
        zoomAnimation1DataRef.current.options
          ? zoomAnimation1DataRef.current.options
          : undefined
      );

      //Cancelamos la animación original, ya que hemos creado una nueva, para que no siga aplicada al NextPictureAndZoomableFxWrapper, aunque esté pausada.
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
        currentPictureAndZoomableFxWrapperElement.current,
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

  //Se encarga de crear una nueva animación y iniciarla en NextPictureAndZoomableFxWrapper.
  // En el siguiente cambio de plano, el layoutEffect anterior pausará la animación y aplicará la parte que falta a  CurrentPictureAndZoomableFxWrapper.
  // Es importante que este layoutEffect esté después del anterior. Si no es así, se pausaría la animación en NextPictureAndZoomableFxWrapper y se
  // aplicaría la nueva a CurrentPictureAndZoomableFxWrapper en el mismo plano.
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
        nextPictureAndZoomableFxWrapperElement.current,
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
  //la animación de zoom / panning hecha con Web Animations API en CurrentPictureAndZoomableFxWrapper y NextPictureAndZoomableFxWrapper,
  //ya que ambas usan "traslate".
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

  // Limpieza de los timers del botón "Siguiente" para las cinemáticas manuales
  useEffect(() => {
    return () => {
      window.clearTimeout(nextShotClickTimerRef.current);
    };
  }, []);

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////  EFECTOS PARA ESTILOS  ////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // Calcula la proporción de la pantalla y la distancia que hay entre el contenedor principal y el borde superior
  // de Window (para poder situar el contenedor en la parte superior de la pantalla sin hacerlo absolute). Establece un listener
  // para que se recalcule todo esto si hay un "resize" de la pantalla.
  useLayoutEffect(() => {
    function setNewWindowSize() {
      setWindowSize([window.innerWidth, window.innerHeight]);
    }

    // Hace el cálculo inicial
    setNewWindowSize();

    window.addEventListener("resize", setNewWindowSize);

    return () => {
      window.removeEventListener("resize", setNewWindowSize);
    };
  }, []);

  return (
    <MainContainerPositioner
      $windowWidth={windowSize[0]}
      $windowHeight={windowSize[1]}
    >
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
          <CurrentPictureAndZoomableFxWrapper
            ref={currentPictureAndZoomableFxWrapperElement}
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
              currentShotId={actualShot.id}
              zoomableFx={true}
              isForCurrentShot={true}
              currentShotFx={actualShot.specialFX}
              nextShotFx={nextShot?.specialFX ? nextShot.specialFX : null}
            />
          </CurrentPictureAndZoomableFxWrapper>

          <CinematicFxFrame
            currentShotId={actualShot.id}
            zoomableFx={false}
            isForCurrentShot={true}
            currentShotFx={actualShot.specialFX}
            nextShotFx={nextShot?.specialFX ? nextShot.specialFX : null}
          />
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
            <NextPictureAndZoomableFxWrapper
              ref={nextPictureAndZoomableFxWrapperElement}
            >
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
                currentShotId={actualShot.id}
                zoomableFx={true}
                isForCurrentShot={false}
                currentShotFx={actualShot.specialFX}
                nextShotFx={nextShot?.specialFX ? nextShot.specialFX : null}
              />
            </NextPictureAndZoomableFxWrapper>

            <CinematicFxFrame
              currentShotId={actualShot.id}
              zoomableFx={false}
              isForCurrentShot={false}
              currentShotFx={actualShot.specialFX}
              nextShotFx={nextShot?.specialFX ? nextShot.specialFX : null}
            />
          </NextPictureContainer>
        ) : null}

        {isManualTextShown && generateManualText()}
      </MainContainer>
    </MainContainerPositioner>
  );
}

export default MainViewer;
