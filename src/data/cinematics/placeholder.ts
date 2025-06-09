import { GLOBAL_COLORS } from "../../theme";
import { CinematicScene } from "../../components/cinematics/cinematicTypes";

// Esta cinemática no es más que un plano en negro. Se usa como valor inicial de cinematicData en cinematicSlice.ts, y se usa para
// evitar un error en la store, que se producía si se usaba como valor inicial una cinemática que usara la store en el código de la
// propiedad "onEnd()" en su último plano. Esto producía una importación circular.

export const placeholderCinematic: CinematicScene = [
  {
    id: 1,
    backgroundColor: GLOBAL_COLORS.black,
    widePicture: true,
  },
];
