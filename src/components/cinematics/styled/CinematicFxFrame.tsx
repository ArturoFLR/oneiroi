import LightningFX from "../../common/fxAndFilters/LightningFX";
import styled from "styled-components";
import { CinematicFXData } from "../cinematicTypes";
import { useCallback, useEffect, useRef } from "react";

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
}

function CinematicFxFrame({
  isForCurrentShot,
  currentShotFx,
  nextShotFx,
}: CinematicFxFrameProps) {
  const lightningTimeoutsRef = useRef<number[]>([]);

  ////////////////////////////////////////////    LIGHTNING FX   ////////////////////////////////////////////////////
  //Este fx sólo se va a generar en el current shot, nunca en el next shot (no funciona bien el efecto durante los fades)

  const generateLightningFx = useCallback(() => {
    if (currentShotFx?.lightning && isForCurrentShot) {
      const lightningComponentsToShow: React.ReactNode[] = [];

      currentShotFx.lightning.map((lightningData) => {
        lightningComponentsToShow.push(
          <LightningFX size={lightningData.size} delay={lightningData.delay} />
        );
      });
      return lightningComponentsToShow;
    } else {
      return null;
    }
  }, [currentShotFx, isForCurrentShot]);

  useEffect(() => {
    const timersToClear = lightningTimeoutsRef.current;
    return () => {
      timersToClear.forEach((timer) => {
        window.clearTimeout(timer);
      });
    };
  }, [currentShotFx]);

  return <MainContainer>{generateLightningFx()}</MainContainer>;
}

export default CinematicFxFrame;
