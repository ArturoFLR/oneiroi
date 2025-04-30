import { CinematicSceneAuto } from "../../src/components/cinematics/cinematicTypes";
import testImageWide from "@assets/graphics/cinematics/intro/alien-landscape_01.jpg";
import testImage from "@assets/graphics/cinematics/intro/stormy-clouds_03.jpg";

export const cinematicIntro: CinematicSceneAuto = [
  {
    id: 1,
    backgroundColor: "#000000",
    widePicture: true,
    shotTransition: "fade",
    shotDuration: 10000,
    fadeDuration: 6000,
  },
  {
    id: 2,
    mainImageUrl: testImageWide,
    mainImageAlt: "Paisaje al atardecer, el sol se está poniendo",
    widePicture: true,
    shotTransition: "cut",
    shotDuration: 5000,
  },
  {
    id: 3,
    mainImageUrl: testImage,
    mainImageAlt: "Un relámpago ilumina un cúmulo de nubes",
    widePicture: false,
    shotTransition: "fade",
    shotDuration: 10000,
    fadeDuration: 4000,
  },
  {
    id: 4,
    backgroundColor: "#000000",
    widePicture: false,
    onEnd: () => console.log("Fin de la escena"),
  },
];
