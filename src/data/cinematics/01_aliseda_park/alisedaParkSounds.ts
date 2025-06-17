import {
  MainAmbientSound,
  SecondarySound,
} from "../../../classes/sound/soundTypes";
import { CinematicAmbientSound } from "../../../components/cinematics/cinematicTypes";

//////////////////////////////////////////////////////// ASSETS IMPORTS ///////////////////////////////////////////////////////

import fountain1 from "@assets/audio/sounds/ambient/water/fountain-water.mp3";
import crowd1 from "@assets/audio/sounds/ambient/crowd/crowd-ambience1.mp3";
import traffic1 from "@assets/audio/sounds/ambient/city/city-traffic_01.mp3";
import birds1 from "@assets/audio/sounds/ambient/animals/birds_01.mp3";
import dogBark1 from "@assets/audio/sounds/effects/animals/dog-bark_01.mp3";
import dogBark2 from "@assets/audio/sounds/effects/animals/dog-bark_02.mp3";
import dogBark3 from "@assets/audio/sounds/effects/animals//dog-bark-reverb_01.mp3";
import carHorn1 from "@assets/audio/sounds/effects/vehicles/car-double-horn-distant_02.mp3";
import carHorn2 from "@assets/audio/sounds/effects/vehicles/car-double-horn_02.mp3";
import carHorn3 from "@assets/audio/sounds/effects/vehicles/car-horn-distant_01.mp3";

///////////////////////////////////////////   SHOT 2  ///////////////////////////////////////////

// AMBIENT SOUNDS
// MAIN SOUNDS
const mainAmbientSound1_2: MainAmbientSound = {
  name: "fountain1_02",
  src: fountain1,
  fadeDuration: 2500,
  securityMargin: 1000,
  config: {
    volume: 0.8,
    src: [fountain1],
  },
};

const mainAmbientSound2_2: MainAmbientSound = {
  name: "crowd1_02",
  src: crowd1,
  fadeDuration: 2500,
  securityMargin: 1000,
  config: {
    volume: 1,
    src: [crowd1],
  },
};

const mainAmbientSound3_2: MainAmbientSound = {
  name: "traffic1_02",
  src: traffic1,
  fadeDuration: 2500,
  securityMargin: 1000,
  config: {
    volume: 0.5,
    src: [traffic1],
  },
};

const mainAmbientSound4_2: MainAmbientSound = {
  name: "birds1_02",
  src: birds1,
  fadeDuration: 2500,
  securityMargin: 1000,
  config: {
    volume: 1,
    src: [birds1],
  },
};

const mainAmbientSounds2 = [
  mainAmbientSound1_2,
  mainAmbientSound2_2,
  mainAmbientSound3_2,
  mainAmbientSound4_2,
];

// SECONDARY SOUNDS

const secondarySound1_02: SecondarySound = {
  name: "dogBark1_02",
  src: dogBark1,
  delay: 8000,
  minLoopTime: 10000,
  maxLoopTime: 30000,
  stereoValue: 0.5,
  config: {
    src: dogBark1,
    volume: 0.5,
  },
};

const secondarySound2_02: SecondarySound = {
  name: "dogBark2_02",
  src: dogBark2,
  delay: 10500,
  minLoopTime: 15000,
  maxLoopTime: 35000,
  stereoValue: 0.5,
  config: {
    src: dogBark2,
    volume: 0.6,
  },
};

const secondarySound3_02: SecondarySound = {
  name: "dogBark3_02",
  src: dogBark3,
  delay: 19500,
  minLoopTime: 18000,
  maxLoopTime: 46000,
  stereoValue: -0.3,
  config: {
    src: dogBark3,
    volume: 0.4,
  },
};

const secondarySound4_02: SecondarySound = {
  name: "carHorn1_02",
  src: carHorn1,
  delay: 6500,
  minLoopTime: 18000,
  maxLoopTime: 46000,
  stereoValue: -0.4,
  config: {
    src: carHorn1,
    volume: 0.09,
  },
};

const secondarySound5_02: SecondarySound = {
  name: "carHorn2_02",
  src: carHorn2,
  delay: 18500,
  minLoopTime: 22000,
  maxLoopTime: 58000,
  stereoValue: 0.7,
  config: {
    src: carHorn2,
    volume: 0.08,
  },
};

const secondarySound6_02: SecondarySound = {
  name: "carHorn3_02",
  src: carHorn3,
  delay: 28500,
  minLoopTime: 20000,
  maxLoopTime: 45000,
  stereoValue: -0.2,
  config: {
    src: carHorn3,
    volume: 0.09,
  },
};

const secondarySounds2 = [
  secondarySound1_02,
  secondarySound2_02,
  secondarySound3_02,
  secondarySound4_02,
  secondarySound5_02,
  secondarySound6_02,
];

export const shot2AmbientSound: CinematicAmbientSound = {
  soundscapeName: "parkAmbient_2",
  mainAmbientSounds: mainAmbientSounds2,
  secondaryAmbientSounds: secondarySounds2,
  prevAmbientFadeDuration: 0,
  delay: 0,
  initialFadeDuration: 10500,
  toVolume: 1,
};

///////////////////////////////////////////   SHOT 3  ///////////////////////////////////////////

///////////////////////////////////////////   SHOT 4  ///////////////////////////////////////////

///////////////////////////////////////////   SHOT 5  ///////////////////////////////////////////

// AMBIENT SOUNDS
// MAIN SOUNDS
const mainAmbientSound1_5: MainAmbientSound = {
  name: "fountain1_05",
  src: fountain1,
  fadeDuration: 2500,
  securityMargin: 1000,
  config: {
    volume: 0.04,
    src: [fountain1],
  },
};

const mainAmbientSound2_5: MainAmbientSound = {
  name: "crowd1_05",
  src: crowd1,
  fadeDuration: 2500,
  securityMargin: 1000,
  config: {
    volume: 0.2,
    src: [crowd1],
  },
};

const mainAmbientSound3_5: MainAmbientSound = {
  name: "traffic1_05",
  src: traffic1,
  fadeDuration: 2500,
  securityMargin: 1000,
  config: {
    volume: 0.08,
    src: [traffic1],
  },
};

const mainAmbientSound4_5: MainAmbientSound = {
  name: "birds1_05",
  src: birds1,
  fadeDuration: 2500,
  securityMargin: 1000,
  config: {
    volume: 1,
    src: [birds1],
  },
};

const mainAmbientSounds5 = [
  mainAmbientSound1_5,
  mainAmbientSound2_5,
  mainAmbientSound3_5,
  mainAmbientSound4_5,
];

// SECONDARY SOUNDS

const secondarySound1_05: SecondarySound = {
  name: "dogBark1_05",
  src: dogBark1,
  delay: 8000,
  minLoopTime: 10000,
  maxLoopTime: 30000,
  stereoValue: 0.5,
  config: {
    src: dogBark1,
    volume: 0.08,
  },
};

const secondarySound2_05: SecondarySound = {
  name: "dogBark2_05",
  src: dogBark2,
  delay: 10500,
  minLoopTime: 15000,
  maxLoopTime: 35000,
  stereoValue: 0.5,
  config: {
    src: dogBark2,
    volume: 0.08,
  },
};

const secondarySound3_05: SecondarySound = {
  name: "dogBark3_05",
  src: dogBark3,
  delay: 19500,
  minLoopTime: 18000,
  maxLoopTime: 46000,
  stereoValue: -0.3,
  config: {
    src: dogBark3,
    volume: 0.07,
  },
};

const secondarySound4_05: SecondarySound = {
  name: "carHorn1_05",
  src: carHorn1,
  delay: 6500,
  minLoopTime: 18000,
  maxLoopTime: 46000,
  stereoValue: -0.4,
  config: {
    src: carHorn1,
    volume: 0.01,
  },
};

const secondarySound5_05: SecondarySound = {
  name: "carHorn2_05",
  src: carHorn2,
  delay: 18500,
  minLoopTime: 22000,
  maxLoopTime: 58000,
  stereoValue: 0.7,
  config: {
    src: carHorn2,
    volume: 0.01,
  },
};

const secondarySound6_05: SecondarySound = {
  name: "carHorn3_05",
  src: carHorn3,
  delay: 28500,
  minLoopTime: 20000,
  maxLoopTime: 45000,
  stereoValue: -0.2,
  config: {
    src: carHorn3,
    volume: 0.01,
  },
};

const secondarySounds5 = [
  secondarySound1_05,
  secondarySound2_05,
  secondarySound3_05,
  secondarySound4_05,
  secondarySound5_05,
  secondarySound6_05,
];

export const shot5AmbientSound: CinematicAmbientSound = {
  soundscapeName: "parkAmbient_5",
  mainAmbientSounds: mainAmbientSounds5,
  secondaryAmbientSounds: secondarySounds5,
  prevAmbientFadeDuration: 2000,
  delay: 0,
  initialFadeDuration: 2000,
  toVolume: 1,
};

///////////////////////////////////////////   SHOT 6  ///////////////////////////////////////////
