import styled from "styled-components";
import { CinematicFXData } from "../cinematicTypes";

const MainContainer = styled.div``;

interface CinematicFxFrameProps {
  fxActualShot: CinematicFXData | null;
  fxNextShot: CinematicFXData | null;
}

function CinematicFxFrame({ fxActualShot, fxNextShot }: CinematicFxFrameProps) {
  return <MainContainer></MainContainer>;
}

export default CinematicFxFrame;
