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

import alienSunset1 from "@assets/graphics/cinematics/intro/alien-landscape_01.webp";
import alienRuins1 from "@assets/graphics/cinematics/intro/alien-landscape_05.webp";
import stormyClouds1 from "@assets/graphics/cinematics/intro/stormy-clouds_03.webp";

export const cinematicIntro: CinematicSceneAuto = [
  {
    id: 1,
    backgroundColor: "#000000",
    widePicture: true,
    shotTransition: "fade",
    shotDuration: 9000,
    fadeDuration: 5500,
    ambientSound: shot1AmbientSound,
    music: shot1Music,
  },
  {
    id: 2,
    mainImageUrl: alienSunset1,
    mainImageAlt: "Paisaje al atardecer, el sol se está poniendo",
    widePicture: true,
    shotTransition: "fade",
    fadeDuration: 3000,
    shotDuration: 7000,
    // uniqueSounds: shot2UniqueSounds,
    zoom: {
      zoomStartSize: 1,
      zoomStartPosition: {
        top: 0,
        left: 0,
      },
      zoomEndSize: 1.4,
      zoomEndPosition: {
        top: -15,
        left: -15,
      },
      animType: "ease-in",
    },
    // specialActions: function () {
    //   const timer1 = window.setTimeout(() => {
    //     SoundDirectorAPI1.setSoundRate(
    //       AudioEnvironment.Cinematic,
    //       "sounds",
    //       "evil1_2",
    //       0.7
    //     );
    //     if (this.specialActionsTimeouts) {
    //       this.specialActionsTimeouts.push(timer1);
    //     }
    //   }, 3500);
    // },
    specialActionsTimeouts: [],
    specialFX: {
      tremor: {
        delay: 2000,
        intensity: "medium",
      },
    },
  },
  {
    id: 3,
    mainImageUrl: alienRuins1,
    mainImageAlt: "Ruinas en un paisaje alienígena",
    widePicture: true,
    shotTransition: "cut",
    shotDuration: 6000,
    // music: shot3Music,
    zoom: {
      zoomStartSize: 1.4,
      zoomStartPosition: {
        top: 0,
        left: 10,
      },
      zoomEndSize: 1.4,
      zoomEndPosition: {
        top: 0,
        left: -10,
      },
      animType: "linear",
    },
    specialFX: {
      tremor: {
        delay: 0,
        intensity: "low",
      },
    },
  },
  {
    id: 4,
    mainImageUrl: stormyClouds1,
    mainImageAlt: "Un relámpago ilumina un cúmulo de nubes",
    widePicture: false,
    shotTransition: "fade",
    shotDuration: 10000,
    fadeDuration: 4000,
    uniqueSounds: shot3UniqueSounds,
    // music: shot3Music,
    zoom: {
      zoomStartSize: 1.3,
      zoomStartPosition: {
        top: 0,
        left: 0,
      },
      zoomEndSize: 1.7,
      zoomEndPosition: {
        top: 15,
        left: 0,
      },
      animType: "linear",
    },
    specialFX: {
      tremor: {
        delay: 2000,
        intensity: "medium",
      },
    },
  },
  {
    id: 5,
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
