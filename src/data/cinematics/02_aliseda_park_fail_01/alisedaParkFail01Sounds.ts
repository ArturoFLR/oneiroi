import {
  MainAmbientSound,
  SecondarySound,
} from "../../../classes/sound/soundTypes";
import {
  CinematicAmbientSound,
  CinematicMusic,
  CinematicUniqueSound,
  CinematicUniqueSounds,
} from "../../../components/cinematics/cinematicTypes";

//////////////////////////////////////////////////////// ASSETS IMPORTS ///////////////////////////////////////////////////////

import traffic1 from "@assets/audio/sounds/ambient/city/city-ambient-loopable_01.mp3";
import carHorn1 from "@assets/audio/sounds/effects/vehicles/car-double-horn-distant_02.mp3";
import heartMonitorBip1 from "@assets/audio/sounds/effects/heart_monitor/heart-monitor-bip_01.mp3";
import heartMonitorFlat1 from "@assets/audio/sounds/effects/heart_monitor/heart-monitor-flat_01.mp3";
import fountain1 from "@assets/audio/sounds/ambient/water/fountain-water.mp3";
import crowd1 from "@assets/audio/sounds/ambient/crowd/crowd-ambience1.mp3";
import birds1 from "@assets/audio/sounds/ambient/animals/birds_01.mp3";
import dogBark1 from "@assets/audio/sounds/effects/animals/dog-bark_01.mp3";
import dogBark2 from "@assets/audio/sounds/effects/animals/dog-bark_02.mp3";
import dogBark3 from "@assets/audio/sounds/effects/animals//dog-bark-reverb_01.mp3";
import carHorn2 from "@assets/audio/sounds/effects/vehicles/car-double-horn_02.mp3";
import carHorn3 from "@assets/audio/sounds/effects/vehicles/car-horn-distant_01.mp3";
import musicRonroco1 from "@assets/audio/music/ushuaia-quiaca.mp3";
import droneAmbient1 from "@assets/audio/sounds/ambient/ominous/ominous-drone.mp3";

///////////////////////////////////////////   SHOT 1  ///////////////////////////////////////////

// AMBIENT SOUNDS
// MAIN SOUNDS
const mainAmbientSound1_1: MainAmbientSound = {
  name: "traffic1_02",
  src: traffic1,
  fadeDuration: 1000,
  securityMargin: 1000,
  config: {
    volume: 0.9,
    src: [traffic1],
  },
};

const mainAmbientSounds1 = [mainAmbientSound1_1];

// SECONDARY SOUNDS
const secondarySound4_01: SecondarySound = {
  name: "carHorn1_01",
  src: carHorn1,
  delay: 6500,
  minLoopTime: 18000,
  maxLoopTime: 46000,
  stereoValue: -0.4,
  config: {
    src: carHorn1,
    volume: 0.04,
  },
};

const secondarySounds1 = [secondarySound4_01];

export const shot2AmbientSound: CinematicAmbientSound = {
  soundscapeName: "cityAmbient_1",
  mainAmbientSounds: mainAmbientSounds1,
  secondaryAmbientSounds: secondarySounds1,
  prevAmbientFadeDuration: 0,
  delay: 0,
  initialFadeDuration: 3000,
  toVolume: 1,
};

///////////////////////////////////////////   SHOT 2  ///////////////////////////////////////////

// MUSIC

export const shot2Music: CinematicMusic = {
  soundName: "Music_02",
  soundSrc: musicRonroco1,
  config: {
    volume: 0,
    src: [musicRonroco1],
  },
  loop: false,
  delay: 0,
  prevMusicFadeDuration: 0,
  initialFadeDuration: 2000,
  toVolume: 0.65,
};

///////////////////////////////////////////   SHOT 3  ///////////////////////////////////////////

// AMBIENT SOUNDS
// MAIN SOUNDS
const mainAmbientSound1_3: MainAmbientSound = {
  name: "traffic1_03",
  src: traffic1,
  fadeDuration: 1000,
  securityMargin: 1000,
  stereoValue: -0.5,
  config: {
    volume: 0.3,
    src: [traffic1],
  },
};

const mainAmbientSounds3 = [mainAmbientSound1_3];

export const shot3AmbientSound: CinematicAmbientSound = {
  soundscapeName: "cityAmbient_3",
  mainAmbientSounds: mainAmbientSounds3,
  prevAmbientFadeDuration: 400,
  delay: 0,
  initialFadeDuration: 100,
};

///////////////////////////////////////////   SHOT 4  ///////////////////////////////////////////

// AMBIENT SOUNDS
// MAIN SOUNDS
const mainAmbientSound1_4: MainAmbientSound = {
  name: "fountain1_04",
  src: fountain1,
  fadeDuration: 2500,
  securityMargin: 1000,
  config: {
    volume: 0.04,
    src: [fountain1],
  },
};

const mainAmbientSound2_4: MainAmbientSound = {
  name: "crowd1_04",
  src: crowd1,
  fadeDuration: 2500,
  securityMargin: 1000,
  config: {
    volume: 0.2,
    src: [crowd1],
  },
};

const mainAmbientSound3_4: MainAmbientSound = {
  name: "traffic1_04",
  src: traffic1,
  fadeDuration: 2500,
  securityMargin: 1000,
  config: {
    volume: 0.08,
    src: [traffic1],
  },
};

const mainAmbientSound4_4: MainAmbientSound = {
  name: "birds1_04",
  src: birds1,
  fadeDuration: 2500,
  securityMargin: 1000,
  config: {
    volume: 1,
    src: [birds1],
  },
};

const mainAmbientSounds4 = [
  mainAmbientSound1_4,
  mainAmbientSound2_4,
  mainAmbientSound3_4,
  mainAmbientSound4_4,
];

// SECONDARY SOUNDS

const secondarySound1_04: SecondarySound = {
  name: "dogBark1_04",
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

const secondarySound2_04: SecondarySound = {
  name: "dogBark2_04",
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

const secondarySound3_04: SecondarySound = {
  name: "dogBark3_04",
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

const secondarySound4_04: SecondarySound = {
  name: "carHorn1_04",
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

const secondarySound5_04: SecondarySound = {
  name: "carHorn2_04",
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

const secondarySound6_04: SecondarySound = {
  name: "carHorn3_04",
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

const secondarySounds4 = [
  secondarySound1_04,
  secondarySound2_04,
  secondarySound3_04,
  secondarySound4_04,
  secondarySound5_04,
  secondarySound6_04,
];

export const shot4AmbientSound: CinematicAmbientSound = {
  soundscapeName: "parkAmbient_4",
  mainAmbientSounds: mainAmbientSounds4,
  secondaryAmbientSounds: secondarySounds4,
  prevAmbientFadeDuration: 1000,
  delay: 0,
  initialFadeDuration: 0,
  toVolume: 1,
};

///////////////////////////////////////////   SHOT 5  ///////////////////////////////////////////

// UNIQUE SOUNDS
const heartMonitorBeat1_05: CinematicUniqueSound = {
  category: "sounds",
  soundName: "heartMonitorBeat1_05",
  soundSrc: heartMonitorBip1,
  delay: 0,
  config: {
    volume: 0.7,
    src: [heartMonitorBip1],
  },
  loop: false,
  stereo: 0,
};

export const shot5UniqueSounds: CinematicUniqueSounds = [heartMonitorBeat1_05];

///////////////////////////////////////////   SHOT 6  ///////////////////////////////////////////

///////////////////////////////////////////   SHOT 7  ///////////////////////////////////////////
///////////////////////////////////////////   SHOT 8  ///////////////////////////////////////////
///////////////////////////////////////////   SHOT 9  ///////////////////////////////////////////
///////////////////////////////////////////   SHOT 10  ///////////////////////////////////////////

// UNIQUE SOUNDS
const droneAmbient1_10: CinematicUniqueSound = {
  category: "sounds",
  soundName: "droneAmbient1_10",
  soundSrc: droneAmbient1,
  delay: 3500,
  config: {
    volume: 0.2,
    src: [droneAmbient1],
  },
  loop: false,
  stereo: 0,
};

export const shot10UniqueSounds: CinematicUniqueSounds = [droneAmbient1_10];

///////////////////////////////////////////   SHOT 11  ///////////////////////////////////////////
///////////////////////////////////////////   SHOT 12  ///////////////////////////////////////////
///////////////////////////////////////////   SHOT 13  ///////////////////////////////////////////
///////////////////////////////////////////   SHOT 14  ///////////////////////////////////////////
///////////////////////////////////////////   SHOT 15  ///////////////////////////////////////////
///////////////////////////////////////////   SHOT 16  ///////////////////////////////////////////
///////////////////////////////////////////   SHOT 17  ///////////////////////////////////////////
///////////////////////////////////////////   SHOT 18  ///////////////////////////////////////////

// UNIQUE SOUNDS
const heartMonitorFlat1_18: CinematicUniqueSound = {
  category: "sounds",
  soundName: "heartMonitorFlat1_18",
  soundSrc: heartMonitorFlat1,
  delay: 1800,
  config: {
    volume: 0.8,
    src: [heartMonitorFlat1],
  },
  loop: true,
  stereo: 0,
};

export const shot18UniqueSounds: CinematicUniqueSounds = [heartMonitorFlat1_18];
