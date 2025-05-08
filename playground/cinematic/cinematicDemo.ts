import { AudioEnvironment } from "../../src/classes/sound/soundTypes";
import {
  SoundDirectorAPI1,
  SoundStore1,
} from "../../src/classes/sound/singletons";
import { CinematicSceneAuto } from "../../src/components/cinematics/cinematicTypes";
import {
  shot1AmbientSound,
  shot1Music,
  shot2UniqueSounds,
  // shot3Music,
  // shot3AmbientSound,
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
  },
  {
    id: 2,
    mainImageUrl: testImageWide,
    mainImageAlt: "Paisaje al atardecer, el sol se está poniendo",
    widePicture: true,
    shotTransition: "cut",
    shotDuration: 7000,
    uniqueSounds: shot2UniqueSounds,
    specialActions: function () {
      const timer1 = window.setTimeout(() => {
        SoundDirectorAPI1.setSoundRate(
          AudioEnvironment.Cinematic,
          "sounds",
          "evil1_2",
          0.7
        );
        if (this.specialActionsTimeouts) {
          this.specialActionsTimeouts.push(timer1);
        }
      }, 3500);
    },
    specialActionsTimeouts: [],
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
    ambientSound: 3500,
    // music: shot3Music,
  },
  {
    id: 4,
    backgroundColor: "#000000",
    widePicture: false,
    onEndAudioFadeDuration: 2000,
    onEnd: () => {
      const soundStoreData = SoundStore1.audioStore.cinematic;
      console.log(Object.keys(soundStoreData.music));
      console.log(Object.keys(soundStoreData.sounds));
      console.log(Object.keys(soundStoreData.soundscapes));
    },
  },
];
