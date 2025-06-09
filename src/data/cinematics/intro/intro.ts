import { store } from "../../../store/store";
import { setMainState } from "../../../store/slices/mainStateSlice";
import { CinematicScene } from "../../../components/cinematics/cinematicTypes";
import { SoundDirectorAPI1 } from "../../../classes/sound/singletons";
import { AudioEnvironment } from "../../../classes/sound/soundTypes";
import { GLOBAL_COLORS } from "../../../theme";
import {
  shot10UniqueSounds,
  shot11UniqueSounds,
  shot12UniqueSounds,
  shot13Music,
  shot16UniqueSounds,
  shot18UniqueSounds,
  shot19UniqueSounds,
  shot1AmbientSound,
  shot21AmbientSound,
  shot21Music,
  shot21UniqueSounds,
  shot22UniqueSounds,
  shot23Music,
  shot23UniqueSounds,
  shot3Music,
  shot3UniqueSounds,
  shot7AmbientSound,
  shot7Music,
  shot8AmbientSound,
  shot8UniqueSounds,
  shot9UniqueSounds,
} from "./introSounds";
import {
  shot10Fx,
  shot11Fx,
  shot12Fx,
  shot14Fx,
  shot16Fx,
  shot17Fx,
  shot18Fx,
  shot19Fx,
  shot20Fx,
  shot2Fx,
  shot3Fx,
  shot4Fx,
  shot6Fx,
  shot7Fx,
  shot8Fx,
  shot9Fx,
} from "./introFx";

//////////////////////////////////////////////////////// ASSETS IMPORTS ///////////////////////////////////////////////////////
import shot2Img from "@assets/graphics/cinematics/intro/alien-landscape_01.webp";
import shot3Img from "@assets/graphics/cinematics/intro/alien-landscape_05.webp";
import shot4Img from "@assets/graphics/cinematics/intro/alien-landscape_07.webp";
import shot5Img from "@assets/graphics/cinematics/intro/alien-landscape_10.webp";
import shot6Img from "@assets/graphics/cinematics/intro/alien-landscape_11.webp";
import shot8Img from "@assets/graphics/cinematics/intro/alien-landscape-lightning_23.webp";
import shot9Img from "@assets/graphics/cinematics/intro/alien-landscape_06.webp";
import shot10Img from "@assets/graphics/cinematics/intro/alien-landscape-lightning_14.webp";
import shot11Img from "@assets/graphics/cinematics/intro/alien-landscape-lightning_20.webp";
import shot12Img from "@assets/graphics/cinematics/intro/creepy-statue_01.webp";
import shot14Img from "@assets/graphics/cinematics/intro/alien-landscape_14.webp";
import shot16Img from "@assets/graphics/cinematics/intro/alice-lighting_9.webp";
import shot17Img from "@assets/graphics/cinematics/intro/alicia-eyes_05.webp";
import shot18Img from "@assets/graphics/cinematics/intro/hatman-lighting_04.webp";
import shot19Img from "@assets/graphics/cinematics/intro/alicia-eyes_04.webp";
import shot20Img from "@assets/graphics/cinematics/intro/hatman-lighting_08.webp";
import shot22Img from "@assets/graphics/cinematics/intro/jhonas-eyes_09.webp";
import shot23Img from "@assets/graphics/cinematics/intro/jhonas-waking_14.webp";
import shot24Img from "@assets/graphics/cinematics/intro/building-at-night_01.webp";

///////////////////////////////////////////////////////// SHOTS DATA ///////////////////////////////////////////////////////
export const introCinematic: CinematicScene = [
  {
    id: 1,
    backgroundColor: GLOBAL_COLORS.black,
    widePicture: true,
    shotDuration: 11000,
    shotTransition: "fade",
    fadeDuration: 7000,
    ambientSound: shot1AmbientSound,
  },
  {
    id: 2,
    mainImageUrl: shot2Img,
    mainImageAlt: "Paisaje al atardecer, el sol se está poniendo",
    widePicture: true,
    shotDuration: 14000,
    shotTransition: "fade",
    fadeDuration: 3000,
    specialFX: shot2Fx,
    zoom: {
      zoomStartSize: 1,
      zoomStartPosition: {
        top: 0,
        left: 0,
      },
      zoomEndSize: 1.4,
      zoomEndPosition: {
        top: -15,
        left: -14,
      },
      animType: "ease-in",
    },
  },
  {
    id: 3,
    mainImageUrl: shot3Img,
    mainImageAlt: "Ruinas alienígenas al atardecer",
    widePicture: true,
    shotDuration: 13000,
    shotTransition: "fade",
    fadeDuration: 3500,
    uniqueSounds: shot3UniqueSounds,
    music: shot3Music,
    specialFX: shot3Fx,
    zoom: {
      zoomStartSize: 1.4,
      zoomStartPosition: {
        top: 0,
        left: 8,
      },
      zoomEndSize: 1.4,
      zoomEndPosition: {
        top: 0,
        left: -15,
      },
      animType: "linear",
    },
  },
  {
    id: 4,
    mainImageUrl: shot4Img,
    mainImageAlt: "Bosque de árboles muertos y rocas",
    widePicture: true,
    shotDuration: 10000,
    shotTransition: "fade",
    fadeDuration: 2500,
    specialFX: shot4Fx,
    zoom: {
      zoomStartSize: 1.35,
      zoomStartPosition: {
        top: 0,
        left: 0,
      },
      zoomEndSize: 1.35,
      zoomEndPosition: {
        top: 0,
        left: -14,
      },
      animType: "linear",
    },
  },
  {
    id: 5,
    mainImageUrl: shot5Img,
    mainImageAlt: "Bosque de árboles muertos y rocas",
    widePicture: true,
    shotDuration: 4200,
    shotTransition: "fade",
    fadeDuration: 1500,
    zoom: {
      zoomStartSize: 1.25,
      zoomStartPosition: {
        top: -9,
        left: 0,
      },
      zoomEndSize: 1.25,
      zoomEndPosition: {
        top: -2,
        left: -10,
      },
      animType: "linear",
    },
  },
  {
    id: 6,
    mainImageUrl: shot6Img,
    mainImageAlt: "Bosque de árboles muertos y rocas",
    widePicture: true,
    shotDuration: 8500,
    shotTransition: "fade",
    fadeDuration: 2500,
    specialFX: shot6Fx,
    zoom: {
      zoomStartSize: 1,
      zoomStartPosition: {
        top: 0,
        left: 0,
      },
      zoomEndSize: 1.8,
      zoomEndPosition: {
        top: 0,
        left: 0,
      },
      animType: "ease-in",
    },
  },
  {
    id: 7,
    backgroundColor: GLOBAL_COLORS.black,
    widePicture: true,
    shotDuration: 7300,
    shotTransition: "cut",
    ambientSound: shot7AmbientSound,
    music: shot7Music,
    specialFX: shot7Fx,
  },
  {
    id: 8,
    mainImageUrl: shot8Img,
    mainImageAlt: "Un relámpago ilumina unos árboles muertos",
    widePicture: true,
    shotTransition: "cut",
    shotDuration: 1900,
    uniqueSounds: shot8UniqueSounds,
    ambientSound: shot8AmbientSound,
    // music: shot3Music,
    specialFX: shot8Fx,
    zoom: {
      zoomStartSize: 1.15,
      zoomStartPosition: {
        top: 0,
        left: 0,
      },
      zoomEndSize: 1.15,
      zoomEndPosition: {
        top: 0,
        left: 0,
      },
      animType: "linear",
    },
  },
  {
    id: 9,
    mainImageUrl: shot9Img,
    mainImageAlt: "Las ruinas de una antigua iglesia por la noche",
    widePicture: true,
    shotTransition: "cut",
    shotDuration: 5000,
    uniqueSounds: shot9UniqueSounds,
    specialFX: shot9Fx,
    zoom: {
      zoomStartSize: 1,
      zoomStartPosition: {
        top: 0,
        left: 0,
      },
      zoomEndSize: 1.2,
      zoomEndPosition: {
        top: -8,
        left: -10,
      },
      animType: "linear",
    },
  },
  {
    id: 10,
    mainImageUrl: shot10Img,
    mainImageAlt: "Un rayo cae sobre unas ruinas",
    widePicture: true,
    shotDuration: 900,
    shotTransition: "cut",
    uniqueSounds: shot10UniqueSounds,
    specialFX: shot10Fx,
  },
  {
    id: 11,
    mainImageUrl: shot11Img,
    mainImageAlt: "Un rayo cae sobre unas ruinas",
    widePicture: true,
    shotDuration: 900,
    shotTransition: "cut",
    uniqueSounds: shot11UniqueSounds,
    specialFX: shot11Fx,
  },
  {
    id: 12,
    mainImageUrl: shot12Img,
    mainImageAlt: "Un rayo cae sobre unas ruinas",
    widePicture: true,
    shotDuration: 800,
    shotTransition: "fade",
    fadeDuration: 150,
    uniqueSounds: shot12UniqueSounds,
    specialFX: shot12Fx,
  },
  {
    id: 13,
    backgroundColor: GLOBAL_COLORS.black,
    widePicture: true,
    shotDuration: 6000,
    shotTransition: "cut",
    music: shot13Music,
  },
  {
    id: 14,
    mainImageUrl: shot14Img,
    mainImageAlt: "Mujer de perfil en las montañas bajo una tormenta",
    widePicture: true,
    shotDuration: 10000,
    shotTransition: "cut",
    specialFX: shot14Fx,
    zoom: {
      zoomStartSize: 1,
      zoomStartPosition: {
        top: 0,
        left: 0,
      },
      zoomEndSize: 1.37,
      zoomEndPosition: {
        top: -16,
        left: 14,
      },
      animType: "ease-in-out",
    },
  },
  {
    id: 16,
    mainImageUrl: shot16Img,
    mainImageAlt: "Silueta de una mujer contra un rayo",
    widePicture: true,
    shotDuration: 2000,
    shotTransition: "cut",
    uniqueSounds: shot16UniqueSounds,
    specialFX: shot16Fx,
  },
  {
    id: 17,
    mainImageUrl: shot17Img,
    mainImageAlt: "Primerísimo primer plano de los ojos de una mujer",
    widePicture: true,
    shotDuration: 2000,
    shotTransition: "cut",
    specialFX: shot17Fx,
  },
  {
    id: 18,
    mainImageUrl: shot18Img,
    mainImageAlt: "Silueta de un hombre con sombrero y ojos malignos",
    widePicture: true,
    shotDuration: 4000,
    shotTransition: "cut",
    uniqueSounds: shot18UniqueSounds,
    specialFX: shot18Fx,
  },
  {
    id: 19,
    mainImageUrl: shot19Img,
    mainImageAlt: "Primerísimo primer plano de los ojos de una mujer asustada",
    widePicture: true,
    shotDuration: 3200,
    shotTransition: "cut",
    uniqueSounds: shot19UniqueSounds,
    specialFX: shot19Fx,
    zoom: {
      zoomStartSize: 1.1,
      zoomStartPosition: {
        top: 0,
        left: 0,
      },
      zoomEndSize: 1.3,
      zoomEndPosition: {
        top: 3,
        left: 0,
      },
      animType: "ease-in",
    },
  },
  {
    id: 20,
    mainImageUrl: shot20Img,
    mainImageAlt: "Primer plano de un hombre con sombrero y ojos malignos",
    widePicture: true,
    shotDuration: 2600,
    shotTransition: "fade",
    fadeDuration: 700,
    specialFX: shot20Fx,
    zoom: {
      zoomStartSize: 2,
      zoomStartPosition: {
        top: 0,
        left: 0,
      },
      zoomEndSize: 6.5,
      zoomEndPosition: {
        top: 53,
        left: 25,
      },
      animType: "linear",
    },
  },
  {
    id: 21,
    backgroundColor: GLOBAL_COLORS.black,
    widePicture: true,
    shotDuration: 3200,
    ambientSound: shot21AmbientSound,
    music: shot21Music,
    uniqueSounds: shot21UniqueSounds,
  },
  {
    id: 22,
    mainImageUrl: shot22Img,
    mainImageAlt: "Primer plano de los ojos de un hombre asustado",
    widePicture: true,
    shotDuration: 1300,
    uniqueSounds: shot22UniqueSounds,
    zoom: {
      zoomStartSize: 1.2,
      zoomStartPosition: {
        top: 4,
        left: 0,
      },
      zoomEndSize: 1.2,
      zoomEndPosition: {
        top: 4,
        left: 0,
      },
      animType: "ease-in",
    },
  },
  {
    id: 23,
    mainImageUrl: shot23Img,
    mainImageAlt: "Silueta de un hombre sentado en la cama",
    widePicture: true,
    shotDuration: 10000,
    shotTransition: "fade",
    fadeDuration: 2000,
    uniqueSounds: shot23UniqueSounds,
    music: shot23Music,
    zoom: {
      zoomStartSize: 1.6,
      zoomStartPosition: {
        top: 0,
        left: 0,
      },
      zoomEndSize: 1.2,
      zoomEndPosition: {
        top: 0,
        left: 0,
      },
      animType: "ease-in",
    },
    specialActions: function (this) {
      const delay =
        this.fadeDuration && this.shotDuration
          ? this.shotDuration - this.fadeDuration
          : 0;
      const duration = this.fadeDuration ? this.fadeDuration : 1000;

      const timer = window.setTimeout(() => {
        SoundDirectorAPI1.fadeSound(
          AudioEnvironment.Cinematic,
          "sounds",
          "cityAmbient1_23",
          {
            final: 1,
            milliseconds: duration,
          }
        );
      }, delay);

      this.specialActionsTimeouts?.push(timer);
    },
    specialActionsTimeouts: [],
  },
  {
    id: 24,
    mainImageUrl: shot24Img,
    mainImageAlt: "Exterior de un edificio en una gran ciudad",
    widePicture: true,
    shotDuration: 14000,
    shotTransition: "fade",
    fadeDuration: 4000,
    zoom: {
      zoomStartSize: 2.1,
      zoomStartPosition: {
        top: 20,
        left: 8,
      },
      zoomEndSize: 1,
      zoomEndPosition: {
        top: 0,
        left: 0,
      },
      animType: "ease-out",
    },
  },
  {
    id: 25,
    backgroundColor: GLOBAL_COLORS.black,
    widePicture: true,
    shotDuration: 2000,
    onEndAudioFadeDuration: 2000,
    onEnd: () => {
      store.dispatch(setMainState("mainMenu"));
    },
  },
];
