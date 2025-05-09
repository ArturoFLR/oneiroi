import styled, { keyframes } from "styled-components";
import {
  MainViewerActualShotData,
  MainViewerNextShotData,
  ZoomAnimationData,
  ZoomData,
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

interface MainPictureProps {
  $zoomData: ZoomData | undefined;
  $shotDuration: number;
}

const MainPicture = styled.img<MainPictureProps>`
  position: relative;
  scale: ${({ $zoomData }) => ($zoomData ? $zoomData.zoomStartSize : 1)};
  top: ${({ $zoomData }) => ($zoomData ? $zoomData.zoomStartPosition.top : 0)}%;
  left: ${({ $zoomData }) =>
    $zoomData ? $zoomData.zoomStartPosition.left : 0}%;
  width: 100%;
  animation: ${({ $zoomData }) =>
      $zoomData ? zoomAnimation($zoomData) : "none"}
    ${({ $shotDuration }) => $shotDuration}ms forwards
    ${({ $zoomData }) => $zoomData?.animType};
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const NextPicture = styled.img`
  position: relative;
  width: 100%;
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

  const nextPictureContainerElement = useRef<HTMLDivElement>(null);
  const currentPictureElement = useRef<HTMLImageElement>(null);
  const nextPictureElement = useRef<HTMLImageElement>(null);

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
  //////////////////////////////////////////////////////////// ZOOM / PANNIG  ////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //Las animaciones que gestionan los siguientes useLayoutEffect son creadas con Web Animations API y sólo se aplican si
  //el siguiente plano tiene un efecto de zoom / panning y la transición es por "fade".
  //Es estos casos, la animación debe empezar a verse en el NextPictureContainer cuando comienza a hacer el fade al siguiente plano.
  //Para ello, se inicia la animación en el NextPictureContainer y al cambiar de plano, se replica la misma animación en
  //el CurrentPictureContainer continuando por donde se quedó al cambiar de plano.
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

  //Este 2º useLayoutEffect se encarga de retomar en el CurrentPictureContainer una animación de zoom / panning iniciada en el NextPictureContainer
  //en el plano anterior.
  // Es importante que este layoutEffect esté antes del que crea la animación. Si no es así, se pausaría la animación en el NextPictureContainer
  // y se aplicaría la nueva a CurrentPictureContainer en el mismo plano.
  // Sólo se ejecuta si ya hay una animación iniciada (con datos).
  useLayoutEffect(() => {
    //Pausamos la animación 1 y obtenemos su "currentTime".
    if (zoomAnimation1DataRef.current.data) {
      zoomAnimation1DataRef.current.data.pause();

      const remainingAnimation1Time =
        zoomAnimation1DataRef.current.data.currentTime;

      // Creamos una nueva animación
      const effect2 = new KeyframeEffect(
        currentPictureElement.current,
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
        currentPictureElement.current,
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

  //Se encarga de crear una nueva animación y iniciarla en el NextPictureContainer.
  // En el siguiente cambio de plano, el layoutEffect anterior pausará la animación y aplicará la parte que falta a  CurrentPictureContainer.
  // Es importante que este layoutEffect esté después del anterior. Si no es así, se pausaría la animación en el NextPictureContainer y se
  // aplicaría la nueva a CurrentPictureContainer en el mismo plano.
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
        nextPictureElement.current,
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
            ref={currentPictureElement}
            $zoomData={
              zoomAnimation1DataRef.current.shotId === actualShot.id ||
              zoomAnimation2DataRef.current.shotId === actualShot.id
                ? undefined
                : actualShot.zoom
            }
            $shotDuration={actualShot.shotDuration}
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
              ref={nextPictureElement}
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
        </NextPictureContainer>
      ) : null}
    </MainContainer>
  );
}

export default MainViewer;
