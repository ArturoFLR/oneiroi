import LightningFX from "../../common/fxAndFilters/LightningFX";
import styled from "styled-components";
import { CinematicFXData, TextCaptionData } from "../cinematicTypes";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import RainFx from "../../common/fxAndFilters/RainFx";
import VideoFx from "../../common/fxAndFilters/VideoFx";
import ManualFadeInFx from "../../common/fxAndFilters/ManualFadeInFx";
import TextCaption from "../../common/fxAndFilters/TextCaption";

const MainContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////    MAIN COMPONENT   ////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface CinematicFxFrameProps {
  isForCurrentShot: boolean;
  currentShotFx: CinematicFXData | null;
  nextShotFx: CinematicFXData | null;
  zoomableFx: boolean;
  currentShotId: number;
}

function CinematicFxFrame({
  isForCurrentShot,
  zoomableFx,
  currentShotFx,
  nextShotFx,
  currentShotId,
}: CinematicFxFrameProps) {
  const [showRain, setShowRain] = useState<boolean>(false);
  const rainfallTimeoutsRef = useRef<number[]>([]);

  ////////////////////////////////////////////    LIGHTNING FX   ////////////////////////////////////////////////////
  //Este fx sólo se va a generar en el current shot, nunca en el next shot (no funciona bien el efecto durante los fades)

  const generateLightningFx = useCallback(() => {
    if (currentShotFx?.lightning && isForCurrentShot) {
      const lightningComponentsToShow: React.ReactNode[] = [];

      currentShotFx.lightning.map((lightningData, index) => {
        //Sólo creamos el efecto si su propiedad isZoomable coincide con la prop zoomableFx
        if (lightningData.isZoomable === zoomableFx) {
          lightningComponentsToShow.push(
            <LightningFX
              size={lightningData.size}
              delay={lightningData.delay}
              id={`fxLightning${index}`}
              key={`fxLightning${index}`}
            />
          );
        }
      });
      return lightningComponentsToShow;
    } else {
      return null;
    }
  }, [currentShotFx, isForCurrentShot, zoomableFx]);

  ////////////////////////////////////////////    RAINFALL FX   ////////////////////////////////////////////////////

  const generateRainfallFx = useCallback(() => {
    if (isForCurrentShot && currentShotFx?.rain) {
      if (currentShotFx.rain.isZoomable !== zoomableFx) return null;

      const rainData = currentShotFx.rain;
      return (
        <RainFx
          intensity={rainData.intensity}
          size={rainData.size}
          isStarting={rainData.isStarting}
        />
      );
    } else if (
      !isForCurrentShot &&
      nextShotFx?.rain &&
      nextShotFx.rain.delay === 0
    ) {
      if (nextShotFx.rain.isZoomable !== zoomableFx) return null;
      const rainData = nextShotFx.rain;

      return (
        <RainFx
          intensity={rainData.intensity}
          size={rainData.size}
          isStarting={rainData.isStarting}
        />
      );
    } else {
      return null;
    }
  }, [isForCurrentShot, currentShotFx?.rain, nextShotFx?.rain, zoomableFx]);

  //Activa o desactiva la lluvia usando "showRain"
  useLayoutEffect(() => {
    //Si no hay datos para lluvia, la desactivamos
    if (
      (isForCurrentShot && !currentShotFx?.rain) ||
      (!isForCurrentShot && (!nextShotFx?.rain || nextShotFx.rain.delay > 0))
    ) {
      setShowRain(false);
    }

    //Si existen datos, dependiendo del delay, ejecutamos o programamos un timeout
    if (isForCurrentShot && currentShotFx?.rain) {
      if (currentShotFx.rain.isZoomable !== zoomableFx) return;

      if (currentShotFx.rain.delay > 0) {
        const rainTimeout = window.setTimeout(() => {
          setShowRain(true);
        }, currentShotFx?.rain?.delay);

        rainfallTimeoutsRef.current.push(rainTimeout);
      } else {
        setShowRain(true);
      }
    }

    if (!isForCurrentShot && nextShotFx?.rain && nextShotFx.rain.delay === 0) {
      if (nextShotFx.rain.isZoomable !== zoomableFx) return;
      setShowRain(true);
    }
  }, [isForCurrentShot, currentShotFx?.rain, nextShotFx?.rain, zoomableFx]);

  ////////////////////////////////////////////    VIDEO FX   ////////////////////////////////////////////////////
  //Este fx sólo se va a generar en el current shot, nunca en el next shot (habría que parar el vídeo en un componente CinematicFxFrame e iniciarlo
  //desde ahí en otro distinto, por lo que necesitaríamos un contenedor de ambos que regulara estos datos)

  const generateVideoFx = useCallback(() => {
    const videoData = currentShotFx?.videoFx;

    if (videoData && isForCurrentShot) {
      const videosToGenerate: React.ReactNode[] = [];

      videoData.forEach((video, index) => {
        if (video.isZoomable !== zoomableFx) return;

        videosToGenerate.push(
          <VideoFx
            key={index}
            src={video.src}
            size={video.size}
            positionTop={video.positionTop}
            positionLeft={video.positionLeft}
            delay={video.delay}
            initialFadeDuration={video.initialFadeDuration}
            finalFadeDuration={video.finalFadeDuration}
            loop={video.loop}
            playFrom={video.playFrom}
            opacity={video.opacity}
            speed={video.speed}
            extraCss={video.extraCss}
          />
        );
      });

      return videosToGenerate;
    } else return null;
  }, [currentShotFx?.videoFx, isForCurrentShot, zoomableFx]);

  ////////////////////////////////////////////   MANUAL FADE-IN FX   ////////////////////////////////////////////////////
  //Este fx sólo se va a generar en el current shot, nunca en el next shot, ya que está pensado para simular un fade-in a un plano con
  //VídeoFx ya aplicado cuando comienza el fundido (VideoFx no funciona durante los fundidos normales).
  const generateManualFadeIn = useCallback(() => {
    if (zoomableFx || !isForCurrentShot) return;

    if (currentShotFx?.manualFadeIn) {
      const manualFadeInData = currentShotFx.manualFadeIn;

      return (
        <ManualFadeInFx
          color={manualFadeInData.color}
          delay={manualFadeInData.delay}
          duration={manualFadeInData.duration}
        />
      );
    } else {
      return null;
    }
  }, [zoomableFx, isForCurrentShot, currentShotFx?.manualFadeIn]);

  ////////////////////////////////////////////   TEXT CAPTION   ////////////////////////////////////////////////////
  //Este fx sólo se va a generar en el current shot, nunca en el next shot, ya que no tiene sentido fundir a un plano con subtítulos ya en pantalla.

  const generateTextCaption = useCallback(() => {
    if (!isForCurrentShot) return;

    if (currentShotFx?.textCaption) {
      const zoomableTextArray: TextCaptionData[] = [];
      const notZoomableTextArray: TextCaptionData[] = [];

      //Separamos el texto que admite zoom del que no.
      currentShotFx.textCaption.forEach((text) => {
        if (text.isZoomable) zoomableTextArray.push(text);
        if (!text.isZoomable) notZoomableTextArray.push(text);
      });

      return (
        <TextCaption
          key={`text${currentShotId}`}
          textsArray={zoomableFx ? zoomableTextArray : notZoomableTextArray}
        />
      );
    } else {
      return null;
    }
  }, [isForCurrentShot, currentShotFx?.textCaption, zoomableFx, currentShotId]);

  // Limpieza de timeouts
  useEffect(() => {
    const timersToClear = rainfallTimeoutsRef.current;
    return () => {
      timersToClear.forEach((timer) => {
        window.clearTimeout(timer);
      });
    };
  }, []);

  return (
    <MainContainer>
      {generateLightningFx()}
      {showRain ? generateRainfallFx() : null}
      {generateVideoFx()}
      {generateManualFadeIn()}
      {generateTextCaption()}
    </MainContainer>
  );
}

export default CinematicFxFrame;
