import {
  MainAmbientSound,
  SecondarySound,
} from "../../../classes/sound/soundTypes";

import {
  AIChatAmbientSound,
  AIChatSoundData,
} from "../../../components/aiChat/aiChatTypes";

//////////////////////////////////////////////////////// ASSETS IMPORTS ///////////////////////////////////////////////////////

import fountain1 from "@assets/audio/sounds/ambient/water/fountain-water.mp3";
import crowd1 from "@assets/audio/sounds/ambient/crowd/crowd-ambience1.mp3";
import traffic1 from "@assets/audio/sounds/ambient/city/city-ambient-loopable_01.mp3";
import birds1 from "@assets/audio/sounds/ambient/animals/birds_01.mp3";
import dogBark1 from "@assets/audio/sounds/effects/animals/dog-bark_01.mp3";
import dogBark2 from "@assets/audio/sounds/effects/animals/dog-bark_02.mp3";
import dogBark3 from "@assets/audio/sounds/effects/animals//dog-bark-reverb_01.mp3";
import carHorn1 from "@assets/audio/sounds/effects/vehicles/car-double-horn-distant_02.mp3";
import carHorn2 from "@assets/audio/sounds/effects/vehicles/car-double-horn_02.mp3";
import carHorn3 from "@assets/audio/sounds/effects/vehicles/car-horn-distant_01.mp3";

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

const aliseda01AmbientSound: AIChatAmbientSound = {
  soundscapeName: "parkAmbient_5",
  mainAmbientSounds: mainAmbientSounds5,
  secondaryAmbientSounds: secondarySounds5,
  toVolume: 1,
};

const aliseda01SoundData: AIChatSoundData = {
  ambientSound: aliseda01AmbientSound,
};

export default aliseda01SoundData;
