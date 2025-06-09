import { CinematicScene } from "../../components/cinematics/cinematicTypes";
import { introCinematic } from "./intro/intro";
import { CinematicName } from "../../store/slices/cinematicSlice";
import { alisedaParkCinematic } from "./01_aliseda_park/alisedaPark";

// Añadir aquí la correlación entre nombre único de cada cinemática y la variable que la contiene.
export const cinematicsMap: Record<CinematicName, CinematicScene> = {
  intro: introCinematic,
  alisedaPark01: alisedaParkCinematic,
};
