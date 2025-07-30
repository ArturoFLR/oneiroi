import { CinematicScene } from "../../../components/cinematics/cinematicTypes";
import { GLOBAL_COLORS } from "../../../theme";
import { store } from "../../../store/store";
import { setMainState } from "../../../store/slices/mainStateSlice";

//////////////////////////////////////////////////////// ASSETS IMPORTS ///////////////////////////////////////////////////////
import shot2Img from "@assets/graphics/cinematics/01_aliseda_park/parque-aliseda_02.webp";
import shot3Img from "@assets/graphics/cinematics/01_aliseda_park/Natalia_Banco10.webp";
import { shot1Fx, shot3Fx, shot4Fx, shot5Fx } from "./alisedaParkFx";
import { shot2AmbientSound, shot5AmbientSound } from "./alisedaParkSounds";

///////////////////////////////////////////////////////// SHOTS DATA ///////////////////////////////////////////////////////

export const alisedaParkCinematic: CinematicScene = [
  {
    id: 1,
    isManual: true,
    backgroundColor: GLOBAL_COLORS.black,
    widePicture: true,
    shotTransition: "cut",
    specialFX: shot1Fx,
  },
  {
    id: 2,
    isManual: false,
    backgroundColor: GLOBAL_COLORS.black,
    widePicture: true,
    shotDuration: 7000,
    shotTransition: "fade",
    fadeDuration: 6000,
    ambientSound: shot2AmbientSound,
  },
  {
    id: 3,
    isManual: true,
    mainImageUrl: shot2Img,
    widePicture: true,
    mainImageAlt:
      "Un parque urbano, con una gran fuente representando a un ángel",
    shotTransition: "cut",
    specialFX: shot3Fx,
  },
  {
    id: 4,
    isManual: true,
    mainImageUrl: shot2Img,
    widePicture: true,
    mainImageAlt:
      "Un parque urbano, con una gran fuente representando a un ángel",
    shotTransition: "fade",
    fadeDuration: 2000,
    specialFX: shot4Fx,
  },
  {
    id: 5,
    isManual: true,
    mainImageUrl: shot3Img,
    widePicture: true,
    mainImageAlt:
      "Una mujer sentada en un banco de un parque, mirando la puesta de sol",
    shotTransition: "fade",
    fadeDuration: 3000,
    specialFX: shot5Fx,
    ambientSound: shot5AmbientSound,
  },
  {
    id: 6,
    backgroundColor: GLOBAL_COLORS.black,
    widePicture: true,
    shotDuration: 2000,
    shotTransition: "fade",
    onEnd: () => {
      const storeState = store.getState();
      if (storeState.cinematicData.isUserWatchingCinematics) {
        store.dispatch(setMainState("mainMenu"));
      } else {
        store.dispatch(setMainState("aiChat"));
      }
    },
  },
];
