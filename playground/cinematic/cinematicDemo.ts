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
import stormyClouds2 from "@assets/graphics/cinematics/intro/stormy-clouds_02.webp";
import ruins1 from "@assets/graphics/cinematics/intro/alien-landscape_06.webp";
import ambientSmoke from "@assets/graphics/videofx/atmosphere/Atmosphere_06.webm";
import fume1 from "@assets/graphics/videofx/effects/Particle_Stream_01.webm";
import fume2 from "@assets/graphics/videofx/effects/Particle_Stream_02.webm";
import { GLOBAL_FONTS } from "../../src/theme";

export const cinematicIntro: CinematicSceneAuto = [
  {
    id: 1,
    backgroundColor: "#000000",
    widePicture: true,
    shotTransition: "fade",
    shotDuration: 10000,
    fadeDuration: 5500,
    ambientSound: shot1AmbientSound,
    music: shot1Music,
    specialFX: {
      textCaption: [
        {
          isZoomable: false,
          text: "No quiero estar aquí.",
          fontSize: 2.5,
          fontFamily: GLOBAL_FONTS.textCinematics.narratorEmotional,
          duration: 4500,
          fadeInDuration: 2000,
          fadeOutDuration: 300,
        },
      ],
    },
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
    specialFX: {
      textCaption: [
        {
          isZoomable: false,
          text: "El sol se está poniendo...",
          fontSize: "medium",
          fontFamily: GLOBAL_FONTS.textCinematics.narratorEmotional,
          fadeInDuration: 2000,
          delay: 1,
        },
        {
          isZoomable: false,
          text: "y no quiero estar aquí.",
          fontFamily: GLOBAL_FONTS.textCinematics.narratorEmotional,
          delay: 2000,
          position: "center",
          positionTop: 11,
          positionLeft: 10,
          fontSize: "medium",
          fadeInDuration: 1000,
        },
      ],
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
  },
  {
    id: 3,
    mainImageUrl: alienRuins1,
    mainImageAlt: "Ruinas en un paisaje alienígena",
    widePicture: true,
    shotTransition: "cut",
    shotDuration: 8000,
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
        left: -15,
      },
      animType: "linear",
    },
    specialFX: {
      textCaption: [
        {
          isZoomable: true,
          text: "Entre sus ruinas",
          delay: 1500,
          duration: 4500,
          fadeInDuration: 1200,
          fadeOutDuration: 2000,
          position: "center",
          positionLeft: 10,
          positionTop: 5,
          fontSize: "small",
          fontFamily: GLOBAL_FONTS.textCinematics.narratorEmotional,
          zIndex: 0,
        },
      ],
      lightning: [{ isZoomable: true, delay: 0, size: "medium" }],
      videoFx: [
        {
          isZoomable: true,
          src: fume2,
          size: "70%",
          positionTop: "15%",
          positionLeft: "24%",
          initialFadeDuration: 0,
          finalFadeDuration: 0,
          delay: 500,
          loop: true,
          speed: 0.8,
          extraCss: "mix-blend-mode: exclusion;",
        },
        {
          isZoomable: true,
          src: fume2,
          size: "70%",
          positionTop: "15%",
          positionLeft: "24%",
          initialFadeDuration: 0,
          finalFadeDuration: 0,
          delay: 500,
          loop: true,
          speed: 0.8,
          extraCss: "mix-blend-mode: exclusion;",
        },
        {
          isZoomable: true,
          src: fume2,
          size: "75%",
          positionTop: "15%",
          positionLeft: "30%",
          initialFadeDuration: 0,
          finalFadeDuration: 0,
          delay: 2400,
          loop: true,
          speed: 0.75,
          extraCss: "mix-blend-mode: exclusion;",
        },
        {
          isZoomable: true,
          src: fume2,
          size: "75%",
          positionTop: "15%",
          positionLeft: "30%",
          initialFadeDuration: 0,
          finalFadeDuration: 0,
          delay: 2400,
          loop: true,
          speed: 0.75,
          extraCss: "mix-blend-mode: exclusion;",
        },
        {
          isZoomable: true,
          src: fume2,
          size: "75%",
          positionTop: "15%",
          positionLeft: "36%",
          initialFadeDuration: 0,
          finalFadeDuration: 0,
          delay: 2800,
          loop: true,
          speed: 0.65,
          extraCss: "mix-blend-mode: exclusion;",
        },
      ],
    },
  },
  {
    id: 4,
    mainImageUrl: stormyClouds2,
    mainImageAlt: "Un relámpago ilumina un cúmulo de nubes",
    widePicture: true,
    shotTransition: "cut",
    shotDuration: 8000,
    uniqueSounds: shot3UniqueSounds,
    // music: shot3Music,
    zoom: {
      zoomStartSize: 1,
      zoomStartPosition: {
        top: 0,
        left: 0,
      },
      zoomEndSize: 1.35,
      zoomEndPosition: {
        top: 15,
        left: 0,
      },
      animType: "linear",
    },
    specialFX: {
      // tremor: {
      //   delay: 0,
      //   intensity: "medium",
      // },
      lightning: [
        { isZoomable: true, delay: 0, size: "big" },
        { isZoomable: true, delay: 4000, size: "small" },
      ],
      rain: {
        isZoomable: false,
        delay: 0,
        intensity: "medium",
        isStarting: false,
        size: 0.8,
      },
    },
  },
  {
    id: 5,
    mainImageUrl: ruins1,
    mainImageAlt: "Unas ruinas en ambiente nocturno",
    widePicture: true,
    shotTransition: "fade",
    shotDuration: 12000,
    fadeDuration: 4000,
    // uniqueSounds: shot3UniqueSounds,
    // music: shot3Music,
    zoom: {
      animType: "ease-in",
      zoomStartSize: 1,
      zoomStartPosition: {
        top: 0,
        left: 0,
      },
      zoomEndSize: 1.7,
      zoomEndPosition: {
        top: -10,
        left: -20,
      },
    },
    specialFX: {
      // tremor: {
      //   delay: 0,
      //   intensity: "medium",
      // },
      textCaption: [
        {
          isZoomable: false,
          text: "El Barraco, 1936",
          position: "bottom",
          positionLeft: -30,
          fontSize: 3,
          duration: 7000,
          fadeInDuration: 0,
          fadeOutDuration: 800,
        },
      ],
      lightning: [{ isZoomable: true, delay: 2000, size: "medium" }],
      rain: {
        isZoomable: false,
        delay: 0,
        intensity: "high",
        isStarting: false,
        size: 0.8,
      },
      videoFx: [
        {
          isZoomable: true,
          src: ambientSmoke,
          size: "100%",
          positionTop: "0%",
          positionLeft: "0%",
          initialFadeDuration: 0,
          finalFadeDuration: 0,
          delay: 0,
          loop: false,
          speed: 0.7,
        },
        {
          isZoomable: true,
          src: ambientSmoke,
          size: "100%",
          positionTop: "0%",
          positionLeft: "0%",
          initialFadeDuration: 0,
          finalFadeDuration: 0,
          delay: 0,
          loop: false,
          speed: 0.7,
        },
      ],
    },
  },
  {
    id: 6,
    backgroundColor: "#000000",
    widePicture: true,
    onEndAudioFadeDuration: 2000,
    onEnd: () => {
      const soundStoreData = SoundStore1.audioStore.cinematic;
      console.log(Object.keys(soundStoreData.music));
      console.log(Object.keys(soundStoreData.sounds));
      console.log(Object.keys(soundStoreData.soundscapes));
    },
  },
];
