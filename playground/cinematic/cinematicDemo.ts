import { CinematicSceneAuto } from "../../src/components/cinematics/cinematicTypes";
import testImageWide from "@assets/graphics/cinematics/intro/alien-landscape_01.jpg";
import testImage from "@assets/graphics/cinematics/intro/stormy-clouds_03.jpg";

export const cinematicIntro: CinematicSceneAuto = [
  {
    id: 1,
    backgroundColor: "#000000",
    widePicture: true,
    shotTransition: "fade",
    fadeDuration: 3000,
  },
  {
    id: 2,
    mainImageUrl: testImageWide,
    mainImageAlt: "Paisaje al atardecer, el sol se está poniendo",
    widePicture: true,
    shotTransition: "cut",
  },
  {
    id: 3,
    mainImageUrl: testImage,
    mainImageAlt: "Un relámpago ilumina un cúmulo de nubes",
    widePicture: false,
    shotTransition: "cut",
  },
  {
    id: 4,
    backgroundColor: "#000000",
    widePicture: false,
    onEnd: () => console.log("Fin de la escena"),
  },
];
