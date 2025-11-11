import { CinematicScene } from "../../../components/cinematics/cinematicTypes";
import { GLOBAL_COLORS } from "../../../theme";
import { store } from "../../../store/store";
import { setMainState } from "../../../store/slices/mainStateSlice";
import {
  setCurrentMapCellId,
  setCurrentScenarioName,
} from "../../../store/slices/scenarioSlice";

//////////////////////////////////////////////////////// ASSETS IMPORTS ///////////////////////////////////////////////////////

import nataliaBuilding01 from "@assets/graphics/cinematics/03_natalia_house_01/Casa_Natalia11.webp";
import stairs01 from "@assets/graphics/cinematics/03_natalia_house_01/natalia-house-stairs_09.webp";
import hallway01 from "@assets/graphics/cinematics/03_natalia_house_01/Casa_Natalia_Descansillo_4.webp";
import {
  shot2_2Fx,
  shot3Fx,
  shot4_1Fx,
  shot4Fx,
  shot5Fx,
} from "./nataliaHouseIntro01Fx";
import {
  shot1AmbientSound,
  shot2_2UniqueSounds,
  shot3UniqueSounds,
  shot4UniqueSounds,
  shot6Music,
  shot6UniqueSounds,
} from "./nataliaHouseIntro01Sounds";

///////////////////////////////////////////////////////// SHOTS DATA ///////////////////////////////////////////////////////

export const nataliaHouseIntro01Cinematic: CinematicScene = [
  {
    id: 1,
    isManual: false,
    backgroundColor: GLOBAL_COLORS.black,
    widePicture: false,
    shotDuration: 4500,
    fadeDuration: 4000,
    shotTransition: "fade",
    ambientSound: shot1AmbientSound,
  },
  {
    id: 2.1,
    isManual: false,
    mainImageUrl: nataliaBuilding01,
    mainImageAlt: "Un barrio residencial de una ciudad al atardecer",
    widePicture: false,
    shotDuration: 5000,
    shotTransition: "cut",
    zoom: {
      zoomStartSize: 1.4,
      zoomStartPosition: {
        top: 0,
        left: 0,
      },
      zoomEndSize: 1.4,
      zoomEndPosition: {
        top: -14,
        left: 0,
      },
      animType: "ease-in-out",
    },
  },
  {
    id: 2.2,
    isManual: false,
    mainImageUrl: nataliaBuilding01,
    mainImageAlt: "Un barrio residencial de una ciudad al atardecer",
    widePicture: false,
    shotDuration: 4500,
    shotTransition: "cut",
    specialFX: shot2_2Fx,
    uniqueSounds: shot2_2UniqueSounds,
    zoom: {
      zoomStartSize: 1.4,
      zoomStartPosition: {
        top: -19.6,
        left: 0,
      },
      zoomEndSize: 1.4,
      zoomEndPosition: {
        top: -19.6,
        left: 0,
      },
      animType: "linear",
    },
  },
  {
    id: 3,
    isManual: false,
    backgroundColor: GLOBAL_COLORS.black,
    widePicture: true,
    shotDuration: 10500,
    fadeDuration: 1000,
    shotTransition: "fade",
    specialFX: shot3Fx,
    uniqueSounds: shot3UniqueSounds,
    ambientSound: 350,
  },
  {
    id: 4,
    isManual: false,
    mainImageUrl: stairs01,
    mainImageAlt:
      "Un hombre con bigote baja las escaleras de un edificio antiguo",
    widePicture: true,
    shotDuration: 5500,
    fadeDuration: 1500,
    shotTransition: "fade",
    specialFX: shot4Fx,
    uniqueSounds: shot4UniqueSounds,
  },
  {
    id: 4.1,
    isManual: false,
    backgroundColor: GLOBAL_COLORS.black,
    widePicture: true,
    shotDuration: 7500,
    fadeDuration: 2000,
    shotTransition: "fade",
    specialFX: shot4_1Fx,
  },
  {
    id: 5,
    isManual: false,
    mainImageUrl: hallway01,
    mainImageAlt: "El descansillo de un edificio antiguo, con varias puertas",
    widePicture: true,
    shotDuration: 7500,
    fadeDuration: 0,
    shotTransition: "cut",
    specialFX: shot5Fx,
  },
  {
    id: 6,
    isManual: false,
    mainImageUrl: hallway01,
    mainImageAlt: "El descansillo de un edificio antiguo, con varias puertas",
    widePicture: true,
    shotDuration: 8500,
    fadeDuration: 2500,
    shotTransition: "fade",
    uniqueSounds: shot6UniqueSounds,
    music: shot6Music,
    zoom: {
      zoomStartSize: 1,
      zoomStartPosition: {
        top: 0,
        left: 0,
      },
      zoomEndSize: 1.4,
      zoomEndPosition: {
        top: -15,
        left: 0,
      },
      animType: "ease-in",
    },
  },
  {
    id: 7,
    backgroundColor: GLOBAL_COLORS.black,
    widePicture: true,
    shotDuration: 3000,
    shotTransition: "cut",
    onEnd: () => {
      store.dispatch(setCurrentScenarioName("nataliaHouse"));
      store.dispatch(setCurrentMapCellId(1));
      store.dispatch(setMainState("map"));
    },
  },
];
