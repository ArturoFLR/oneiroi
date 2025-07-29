import { GLOBAL_COLORS, GLOBAL_FONTS } from "../../../theme";
import { CinematicFXData } from "../../../components/cinematics/cinematicTypes";

//////////////////////////////////////////////////////// ASSETS IMPORTS ///////////////////////////////////////////////////////
import fume1 from "@assets/graphics/videofx/effects/Particle_Stream_02.webm";
import smokeAtmos1 from "@assets/graphics/videofx/atmosphere/Atmosphere_06.webm";
import dirtCharge2 from "@assets/graphics/videofx/effects/Dirt_Charge_17.webm";

///////////////////////////////////////////   SHOT 1  ///////////////////////////////////////////

///////////////////////////////////////////   SHOT 2  ///////////////////////////////////////////
export const shot2Fx: CinematicFXData = {
  textCaption: [
    {
      isZoomable: true,
      text: "El sol se está poniendo",
      fontFamily: GLOBAL_FONTS.textCinematics.narratorEmotional,
      delay: 0,
      duration: 3500,
      position: "center",
      positionTop: 5,
      positionLeft: 5,
      fontSize: "medium",
      fadeInDuration: 1500,
      fadeOutDuration: 1500,
    },
    {
      isZoomable: true,
      text: "No debería estar aquí",
      fontFamily: GLOBAL_FONTS.textCinematics.narratorEmotional,
      delay: 6000,
      duration: 10000,
      position: "center",
      positionTop: 14,
      positionLeft: 11,
      fontSize: "medium",
      fadeInDuration: 1500,
      fadeOutDuration: 1000,
    },
  ],
};

///////////////////////////////////////////   SHOT 3  ///////////////////////////////////////////

export const shot3Fx: CinematicFXData = {
  textCaption: [
    {
      isZoomable: false,
      text: "Entre estas ruinas mancilladas",
      delay: 1000,
      duration: 3300,
      fadeInDuration: 2000,
      fadeOutDuration: 2000,
      position: "center",
      fontSize: "medium",
      fontFamily: GLOBAL_FONTS.textCinematics.narratorEmotional,
      zIndex: 1,
    },
  ],
  lightning: [
    { isZoomable: true, delay: 3000, size: "small" },
    { isZoomable: true, delay: 6500, size: "small" },
  ],
  videoFx: [
    {
      isZoomable: true,
      src: fume1,
      size: "30%",
      positionTop: "53%",
      positionLeft: "35%",
      initialFadeDuration: 0,
      finalFadeDuration: 0,
      delay: 3500,
      loop: false,
      speed: 0.8,
      opacity: 0.5,
      extraCss: "mix-blend-mode: exclusion;",
    },
    {
      isZoomable: true,
      src: dirtCharge2,
      size: "3%",
      positionTop: "79.3%",
      positionLeft: "73.9%",
      initialFadeDuration: 0,
      finalFadeDuration: 0,
      delay: 4600,
      loop: false,
      speed: 0.8,
      opacity: 0.65,
      extraCss: "mix-blend-mode: exclusion;",
    },
    {
      isZoomable: true,
      src: fume1,
      size: "45%",
      positionTop: "40%",
      positionLeft: "55%",
      initialFadeDuration: 0,
      finalFadeDuration: 0,
      delay: 5000,
      loop: false,
      speed: 0.75,
      opacity: 0.5,
      extraCss: "mix-blend-mode: exclusion;",
    },
    {
      isZoomable: true,
      src: dirtCharge2,
      size: "8%",
      positionTop: "74%",
      positionLeft: "57.9%",
      initialFadeDuration: 0,
      finalFadeDuration: 0,
      delay: 6500,
      loop: false,
      speed: 0.7,
      opacity: 0.7,
      extraCss: "mix-blend-mode: exclusion;",
    },
    {
      isZoomable: true,
      src: fume1,
      size: "70%",
      positionTop: "14%",
      positionLeft: "30%",
      initialFadeDuration: 0,
      finalFadeDuration: 0,
      delay: 6800,
      loop: false,
      speed: 0.8,
      opacity: 0.5,
      extraCss: "mix-blend-mode: exclusion;",
    },
  ],
};

///////////////////////////////////////////   SHOT 4  ///////////////////////////////////////////

export const shot4Fx: CinematicFXData = {
  textCaption: [
    {
      isZoomable: false,
      text: "En estos bosques muertos",
      delay: 0,
      duration: 3300,
      fadeInDuration: 2000,
      fadeOutDuration: 2000,
      position: "center",
      positionLeft: 0,
      positionTop: 5,
      fontSize: "medium",
      fontFamily: GLOBAL_FONTS.textCinematics.narratorEmotional,
    },
  ],
};

///////////////////////////////////////////   SHOT 5  ///////////////////////////////////////////

///////////////////////////////////////////   SHOT 6  ///////////////////////////////////////////

export const shot6Fx: CinematicFXData = {
  textCaption: [
    {
      isZoomable: false,
      text: "El sol se está poniendo...",
      delay: 0,
      duration: 3500,
      fadeInDuration: 2000,
      fadeOutDuration: 1000,
      position: "bottom",
      fontSize: "medium",
      fontFamily: GLOBAL_FONTS.textCinematics.narratorEmotional,
    },
  ],
};

///////////////////////////////////////////   SHOT 7  ///////////////////////////////////////////

export const shot7Fx: CinematicFXData = {
  textCaption: [
    {
      isZoomable: false,
      text: "Ya viene",
      delay: 6000,
      duration: 10000,
      fadeInDuration: 200,
      fadeOutDuration: 0,
      position: "center",
      fontSize: "big",
      fontFamily: GLOBAL_FONTS.textCinematics.narratorEmotional,
    },
  ],
};

///////////////////////////////////////////   SHOT 8  ///////////////////////////////////////////

export const shot8Fx: CinematicFXData = {
  lightning: [
    { isZoomable: true, delay: 0, size: "big" },
    { isZoomable: true, delay: 1400, size: "medium" },
  ],
  rain: {
    isZoomable: true,
    delay: 0,
    intensity: "high",
    isStarting: false,
    size: 0.8,
  },
};

///////////////////////////////////////////   SHOT 9  ///////////////////////////////////////////

export const shot9Fx: CinematicFXData = {
  lightning: [
    { isZoomable: false, delay: 10, size: "big" },
    { isZoomable: true, delay: 3000, size: "medium" },
  ],
  rain: {
    isZoomable: true,
    delay: 0,
    intensity: "high",
    isStarting: false,
    size: 0.8,
  },
};

///////////////////////////////////////////   SHOT 10  ///////////////////////////////////////////

export const shot10Fx: CinematicFXData = {
  lightning: [{ isZoomable: true, delay: 10, size: "big" }],
  rain: {
    isZoomable: true,
    delay: 0,
    intensity: "high",
    isStarting: false,
    size: 0.8,
  },
};

///////////////////////////////////////////   SHOT 11  ///////////////////////////////////////////

export const shot11Fx: CinematicFXData = {
  lightning: [{ isZoomable: false, delay: 10, size: "big" }],
  rain: {
    isZoomable: true,
    delay: 0,
    intensity: "high",
    isStarting: false,
    size: 0.8,
  },
};

///////////////////////////////////////////   SHOT 12  ///////////////////////////////////////////

export const shot12Fx: CinematicFXData = {
  lightning: [{ isZoomable: true, delay: 10, size: "big" }],
  rain: {
    isZoomable: true,
    delay: 0,
    intensity: "high",
    isStarting: false,
    size: 0.8,
  },
};

///////////////////////////////////////////   SHOT 13  ///////////////////////////////////////////

///////////////////////////////////////////   SHOT 14  ///////////////////////////////////////////

export const shot14Fx: CinematicFXData = {
  lightning: [
    { isZoomable: true, delay: 2500, size: "medium" },
    { isZoomable: false, delay: 9500, size: "big" },
  ],
  rain: {
    isZoomable: true,
    delay: 0,
    intensity: "high",
    isStarting: false,
    size: 0.8,
  },
  videoFx: [
    {
      isZoomable: true,
      src: smokeAtmos1,
      size: "100%",
      positionTop: "0",
      positionLeft: "0",
      initialFadeDuration: 0,
      finalFadeDuration: 0,
      delay: 0,
      loop: false,
      speed: 0.7,
      opacity: 0.9,
      extraCss: "mix-blend-mode: exclusion;",
    },
  ],
  manualFadeIn: {
    color: GLOBAL_COLORS.black,
    delay: 0,
    duration: 5000,
  },
};

///////////////////////////////////////////   SHOT 15  ///////////////////////////////////////////

///////////////////////////////////////////   SHOT 16  ///////////////////////////////////////////

export const shot16Fx: CinematicFXData = {
  lightning: [
    { isZoomable: true, delay: 0, size: "big" },
    { isZoomable: true, delay: 1700, size: "medium" },
  ],
  rain: {
    isZoomable: true,
    delay: 0,
    intensity: "high",
    isStarting: false,
    size: 0.8,
  },
};

///////////////////////////////////////////   SHOT 17  ///////////////////////////////////////////

export const shot17Fx: CinematicFXData = {
  lightning: [{ isZoomable: false, delay: 100, size: "medium" }],
  rain: {
    isZoomable: true,
    delay: 0,
    intensity: "high",
    isStarting: false,
    size: 0.9,
  },
};

///////////////////////////////////////////   SHOT 18  ///////////////////////////////////////////

export const shot18Fx: CinematicFXData = {
  lightning: [
    { isZoomable: true, delay: 0, size: "big" },
    { isZoomable: false, delay: 1500, size: "medium" },
    { isZoomable: true, delay: 2800, size: "big" },
  ],
  rain: {
    isZoomable: true,
    delay: 0,
    intensity: "high",
    isStarting: false,
    size: 0.8,
  },
};

///////////////////////////////////////////   SHOT 19  ///////////////////////////////////////////

export const shot19Fx: CinematicFXData = {
  lightning: [
    { isZoomable: false, delay: 500, size: "medium" },
    { isZoomable: true, delay: 2000, size: "big" },
  ],
  rain: {
    isZoomable: true,
    delay: 0,
    intensity: "high",
    isStarting: false,
    size: 0.9,
  },
};

///////////////////////////////////////////   SHOT 20  ///////////////////////////////////////////

export const shot20Fx: CinematicFXData = {
  tremor: {
    delay: 0,
    intensity: "low",
  },
  lightning: [
    { isZoomable: false, delay: 500, size: "big" },
    // { isZoomable: true, delay: 1000, size: "big" },
  ],
  rain: {
    isZoomable: false,
    delay: 0,
    intensity: "high",
    isStarting: false,
    size: 0.8,
  },
};

///////////////////////////////////////////   SHOT 21  ///////////////////////////////////////////

///////////////////////////////////////////   SHOT 22  ///////////////////////////////////////////
