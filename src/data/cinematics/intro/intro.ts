import { CinematicSceneAuto } from "../../../components/cinematics/cinematicTypes";
import { GLOBAL_COLORS } from "../../../theme";
import { shot1AmbientSound, shot1Music } from "./introSounds";
import { shot1Fx } from "./introFx";

//////////////////////////////////////////////////////// ASSETS IMPORTS ///////////////////////////////////////////////////////
import shot2Img from "../../../assets/graphics/cinematics/intro/alien-landscape_01.webp";
import shot3Img from "../../../assets/graphics/cinematics/intro/alien-landscape_05.webp";

///////////////////////////////////////////////////////// SHOTS DATA ///////////////////////////////////////////////////////
export const introCinematic: CinematicSceneAuto = [
  {
    id: 1,
    backgroundColor: GLOBAL_COLORS.black,
    widePicture: true,
    shotDuration: 14000,
    shotTransition: "fade",
    fadeDuration: 5000,
    ambientSound: shot1AmbientSound,
    music: shot1Music,
    specialFX: shot1Fx,
  },
  {
    id: 2,
    mainImageUrl: shot2Img,
    mainImageAlt: "Paisaje al atardecer, el sol se está poniendo",
    widePicture: true,
    shotTransition: "fade",
    shotDuration: 7000,
    fadeDuration: 3000,
  },
];
