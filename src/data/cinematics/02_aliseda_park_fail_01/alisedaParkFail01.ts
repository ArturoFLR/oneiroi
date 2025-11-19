import { CinematicScene } from "../../../components/cinematics/cinematicTypes";
import { GLOBAL_COLORS } from "../../../theme";
import { resetObjectsAndVariables } from "../../../utils/resetObjectsAndVariables";

//////////////////////////////////////////////////////// ASSETS IMPORTS ///////////////////////////////////////////////////////
import shot2Img from "@assets/graphics/cinematics/02_aliseda_park_fail_01/jonas-house_01.webp";
import shot3Img from "@assets/graphics/cinematics/02_aliseda_park_fail_01/bad-ending-jhonas_1.webp";
import shot4Img from "@assets/graphics/cinematics/02_aliseda_park_fail_01/natalia-leaving-aliseda-park_01.webp";
import shot5Img from "@assets/graphics/cinematics/02_aliseda_park_fail_01/plethysmograph_4.webp";
import shot6Img from "@assets/graphics/cinematics/02_aliseda_park_fail_01/fail-diary_01.webp";
import shot10Img from "@assets/graphics/cinematics/02_aliseda_park_fail_01/natalia-hospital_01.webp";

import {
  shot10Fx,
  shot2Fx,
  shot3Fx,
  shot4Fx,
  shot6Fx,
  shot8Fx,
} from "./alisedaParkFail01Fx";
import {
  shot10UniqueSounds,
  shot18UniqueSounds,
  shot2AmbientSound,
  shot2Music,
  shot3AmbientSound,
  shot4AmbientSound,
  shot5UniqueSounds,
} from "./alisedaParkFail01Sounds";

///////////////////////////////////////////////////////// SHOTS DATA ///////////////////////////////////////////////////////

export const alisedaParkFail01Cinematic: CinematicScene = [
  {
    id: 1,
    isManual: false,
    backgroundColor: GLOBAL_COLORS.black,
    widePicture: true,
    shotDuration: 7000,
    fadeDuration: 6000,
    shotTransition: "fade",
    ambientSound: shot2AmbientSound,
  },
  {
    id: 2,
    isManual: false,
    mainImageUrl: shot2Img,
    mainImageAlt: "Una gran ciudad al atardecer",
    widePicture: true,
    shotDuration: 5000,
    shotTransition: "cut",
    specialFX: shot2Fx,
    music: shot2Music,
  },
  {
    id: 3,
    isManual: false,
    mainImageUrl: shot3Img,
    widePicture: true,
    mainImageAlt:
      "Un hombre mira cómo atardece en la ciudad, desde la ventana de su piso",
    shotDuration: 11000,
    fadeDuration: 4000,
    shotTransition: "fade",
    specialFX: shot3Fx,
    ambientSound: shot3AmbientSound,
  },
  {
    id: 4,
    isManual: false,
    mainImageUrl: shot4Img,
    widePicture: true,
    mainImageAlt: "Una mujer caminando por un parque al atardecer",
    shotDuration: 11000,
    shotTransition: "cut",
    specialFX: shot4Fx,
    ambientSound: shot4AmbientSound,
  },
  {
    id: 5,
    isManual: false,
    mainImageUrl: shot5Img,
    widePicture: true,
    mainImageAlt: "La señal de un monitor cardíaco",
    shotDuration: 200,
    shotTransition: "cut",
    uniqueSounds: shot5UniqueSounds,
    ambientSound: 10,
  },
  {
    id: 6,
    isManual: false,
    mainImageUrl: shot6Img,
    widePicture: true,
    mainImageAlt: "La portada de un periódico con un titular sobre estafadores",
    shotDuration: 11000,
    shotTransition: "cut",
    specialFX: shot6Fx,
  },
  {
    id: 7,
    isManual: false,
    mainImageUrl: shot5Img,
    widePicture: true,
    mainImageAlt: "La señal de un monitor cardíaco",
    shotDuration: 200,
    shotTransition: "cut",
    uniqueSounds: shot5UniqueSounds,
  },
  {
    id: 8,
    isManual: false,
    mainImageUrl: shot3Img,
    widePicture: true,
    mainImageAlt:
      "Un hombre mira el cómo atardece en la ciudad, desde la ventana de su piso",
    shotDuration: 13500,
    shotTransition: "cut",
    specialFX: shot8Fx,
    ambientSound: shot3AmbientSound,
  },
  {
    id: 9,
    isManual: false,
    mainImageUrl: shot5Img,
    widePicture: true,
    mainImageAlt: "La señal de un monitor cardíaco",
    shotDuration: 200,
    shotTransition: "cut",
    uniqueSounds: shot5UniqueSounds,
    ambientSound: 10,
  },
  {
    id: 10,
    isManual: false,
    mainImageUrl: shot10Img,
    widePicture: false,
    mainImageAlt:
      "Una mujer inconsciente acostada en una cama de hospital, de noche",
    shotDuration: 10000,
    shotTransition: "cut",
    specialFX: shot10Fx,
    uniqueSounds: shot10UniqueSounds,
    music: 6500,
    zoom: {
      zoomStartSize: 1,
      zoomStartPosition: {
        top: 0,
        left: 0,
      },
      zoomEndSize: 1.7,
      zoomEndPosition: {
        top: -15,
        left: -20,
      },
      animType: "ease-in",
    },
  },
  {
    id: 11,
    isManual: false,
    mainImageUrl: shot5Img,
    widePicture: true,
    mainImageAlt: "La señal de un monitor cardíaco",
    shotDuration: 200,
    shotTransition: "cut",
    uniqueSounds: shot5UniqueSounds,
  },
  {
    id: 12,
    isManual: false,
    backgroundColor: GLOBAL_COLORS.black,
    widePicture: true,
    mainImageAlt: "",
    shotDuration: 700,
    shotTransition: "cut",
  },
  {
    id: 13,
    isManual: false,
    mainImageUrl: shot5Img,
    widePicture: true,
    mainImageAlt: "La señal de un monitor cardíaco",
    shotDuration: 200,
    shotTransition: "cut",
    uniqueSounds: shot5UniqueSounds,
  },
  {
    id: 14,
    isManual: false,
    backgroundColor: GLOBAL_COLORS.black,
    widePicture: true,
    mainImageAlt: "",
    shotDuration: 700,
    shotTransition: "cut",
  },
  {
    id: 15,
    isManual: false,
    mainImageUrl: shot5Img,
    widePicture: true,
    mainImageAlt: "La señal de un monitor cardíaco",
    shotDuration: 200,
    shotTransition: "cut",
    uniqueSounds: shot5UniqueSounds,
  },
  {
    id: 16,
    isManual: false,
    backgroundColor: GLOBAL_COLORS.black,
    widePicture: true,
    mainImageAlt: "",
    shotDuration: 700,
    shotTransition: "cut",
  },
  {
    id: 17,
    isManual: false,
    mainImageUrl: shot5Img,
    widePicture: true,
    mainImageAlt: "La señal de un monitor cardíaco",
    shotDuration: 200,
    shotTransition: "cut",
    uniqueSounds: shot5UniqueSounds,
  },
  {
    id: 18,
    backgroundColor: GLOBAL_COLORS.black,
    widePicture: true,
    shotDuration: 7000,
    shotTransition: "cut",
    uniqueSounds: shot18UniqueSounds,
    onEnd: () => {
      resetObjectsAndVariables();
    },
  },
];
