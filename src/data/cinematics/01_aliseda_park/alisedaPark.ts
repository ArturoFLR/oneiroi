import { CinematicScene } from "../../../components/cinematics/cinematicTypes";
import { GLOBAL_COLORS } from "../../../theme";

//////////////////////////////////////////////////////// ASSETS IMPORTS ///////////////////////////////////////////////////////
import shot2Img from "@assets/graphics/cinematics/01_aliseda_park/parque-aliseda_02.webp";

///////////////////////////////////////////////////////// SHOTS DATA ///////////////////////////////////////////////////////

export const alisedaParkCinematic: CinematicScene = [
  {
    id: 1,
    backgroundColor: GLOBAL_COLORS.black,
    widePicture: true,
    shotDuration: 11000,
    shotTransition: "fade",
    fadeDuration: 7000,
  },
  {
    id: 2,
    isManual: true,
    mainImageUrl: shot2Img,
    widePicture: true,
    mainImageAlt:
      "Un parque urbano, con una gran fuente representando a un ángel",
    shotTransition: "fade",
    fadeDuration: 3000,
  },
];
