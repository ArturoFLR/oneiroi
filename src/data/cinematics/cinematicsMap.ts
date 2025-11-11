import { CinematicScene } from "../../components/cinematics/cinematicTypes";
import { introCinematic } from "./intro/intro";
import { CinematicName } from "../../store/slices/cinematicSlice";
import { alisedaParkCinematic } from "./01_aliseda_park/alisedaPark";
import { alisedaParkFail01Cinematic } from "./02_aliseda_park_fail_01/alisedaParkFail01";
import { nataliaHouseIntro01Cinematic } from "./03_natalia_house_intro/nataliaHouseIntro01";

// Añadir aquí la correlación entre nombre único de cada cinemática y la variable que la contiene.
export const cinematicsMap: Record<CinematicName, CinematicScene> = {
  intro: introCinematic,
  alisedaPark01: alisedaParkCinematic,
  alisedaParkFail01: alisedaParkFail01Cinematic,
  nataliaHouseIntro01: nataliaHouseIntro01Cinematic,
};
