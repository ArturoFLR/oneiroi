import LightningFX from "../../common/fxAndFilters/LightningFX";
import styled from "styled-components";
import { CinematicFXData } from "../cinematicTypes";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import RainFx from "../../common/fxAndFilters/RainFx";

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
}

function CinematicFxFrame({
  isForCurrentShot,
  zoomableFx,
  currentShotFx,
  nextShotFx,
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
        if (
          (lightningData.isZoomable && zoomableFx) ||
          (!lightningData.isZoomable && !zoomableFx)
        ) {
          lightningComponentsToShow.push(
            <LightningFX
              size={lightningData.size}
              delay={lightningData.delay}
              id={`fxLightning${index}`}
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
    </MainContainer>
  );
}

export default CinematicFxFrame;
