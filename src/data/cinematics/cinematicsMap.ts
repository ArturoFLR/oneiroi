import { CinematicScene } from "../../components/cinematics/cinematicTypes";
import { introCinematic } from "./intro/intro";
import { CinematicName } from "../../store/slices/cinematicSlice";

// Añadir aquí la correlación entre nombre único de cada cinemática y la variable que la contiene.
export const cinematicsMap: Record<CinematicName, CinematicScene> = {
  intro: introCinematic,
};
