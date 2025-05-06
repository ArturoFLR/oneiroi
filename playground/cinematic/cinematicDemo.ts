import { SoundDirectorAPI1 } from "../../src/classes/sound/singletons";
import { CinematicSceneAuto } from "../../src/components/cinematics/cinematicTypes";
import {
  shot1AmbientSound,
  shot1Music,
  shot3UniqueSounds,
} from "./cinematicDemoSound";

import testImageWide from "@assets/graphics/cinematics/intro/alien-landscape_01.jpg";
import testImage from "@assets/graphics/cinematics/intro/stormy-clouds_03.jpg";

export const cinematicIntro: CinematicSceneAuto = [
  {
    id: 1,
    backgroundColor: "#000000",
    widePicture: true,
    shotTransition: "fade",
    shotDuration: 9000,
    fadeDuration: 4000,
    ambientSound: shot1AmbientSound,
    music: shot1Music,
    specialActions: () => SoundDirectorAPI1.initAudio(),
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
    uniqueSounds: shot3UniqueSounds,
  },
  {
    id: 4,
    backgroundColor: "#000000",
    widePicture: false,
    onEnd: () => console.log("Fin de la escena"),
  },
];
