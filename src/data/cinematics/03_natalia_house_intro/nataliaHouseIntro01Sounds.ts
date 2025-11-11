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
import crowd1 from "@assets/audio/sounds/ambient/crowd/crowd-ambience1.mp3";
import doorBang1 from "@assets/audio/sounds/effects/doors/heavy-door-closing_02.mp3";
import footsteps1 from "@assets/audio/sounds/effects/footsteps/footsteps-eco_01.mp3";
import droneAmbient1 from "@assets/audio/sounds/ambient/ominous/ominous-drone.mp3";
import musicPianoCue1 from "@assets/audio/music/piano-short-cue_01.mp3";

///////////////////////////////////////////   SHOT 1  ///////////////////////////////////////////

// AMBIENT SOUNDS
// MAIN SOUNDS
const mainAmbientSound1_1: MainAmbientSound = {
  name: "traffic1_01",
  src: traffic1,
  fadeDuration: 1000,
  securityMargin: 1000,
  config: {
    volume: 0.9,
    src: [traffic1],
  },
};
const mainAmbientSound2_1: MainAmbientSound = {
  name: "crowd1_01",
  src: crowd1,
  fadeDuration: 2500,
  securityMargin: 1000,
  config: {
    volume: 1,
    src: [crowd1],
  },
};

const mainAmbientSounds1 = [mainAmbientSound1_1, mainAmbientSound2_1];

// SECONDARY SOUNDS
const secondarySound1_01: SecondarySound = {
  name: "carHorn1_01",
  src: carHorn1,
  delay: 5500,
  minLoopTime: 18000,
  maxLoopTime: 46000,
  stereoValue: -0.4,
  config: {
    src: carHorn1,
    volume: 0.04,
  },
};

const secondarySounds1 = [secondarySound1_01];

export const shot1AmbientSound: CinematicAmbientSound = {
  soundscapeName: "cityAmbient_1",
  mainAmbientSounds: mainAmbientSounds1,
  secondaryAmbientSounds: secondarySounds1,
  prevAmbientFadeDuration: 0,
  delay: 0,
  initialFadeDuration: 2000,
  toVolume: 0.6,
};

///////////////////////////////////////////   SHOT 2.1  ///////////////////////////////////////////

///////////////////////////////////////////   SHOT 2.2  ///////////////////////////////////////////

// UNIQUE SOUNDS
const doorBang1_02_2: CinematicUniqueSound = {
  category: "sounds",
  soundName: "doorBang1_02_2",
  soundSrc: doorBang1,
  delay: 4200,
  config: {
    volume: 0.8,
    src: [doorBang1],
  },
  loop: false,
  stereo: 0,
};

export const shot2_2UniqueSounds: CinematicUniqueSounds = [doorBang1_02_2];

///////////////////////////////////////////   SHOT 3  ///////////////////////////////////////////

// UNIQUE SOUNDS
const footsteps1_03: CinematicUniqueSound = {
  category: "sounds",
  soundName: "footsteps1_03",
  soundSrc: footsteps1,
  delay: 3500,
  config: {
    volume: 0.8,
    src: [footsteps1],
  },
  loop: false,
  stereo: 0,
};

export const shot3UniqueSounds: CinematicUniqueSounds = [footsteps1_03];

///////////////////////////////////////////   SHOT 4  ///////////////////////////////////////////

// UNIQUE SOUNDS
const footsteps1_04: CinematicUniqueSound = {
  category: "sounds",
  soundName: "footsteps1_04",
  soundSrc: footsteps1,
  delay: 4500,
  config: {
    volume: 0.8,
    src: [footsteps1],
  },
  loop: false,
  stereo: 0,
};

export const shot4UniqueSounds: CinematicUniqueSounds = [footsteps1_04];

///////////////////////////////////////////   SHOT 6  ///////////////////////////////////////////

// UNIQUE SOUNDS
const droneAmbient1_6: CinematicUniqueSound = {
  category: "sounds",
  soundName: "droneAmbient1_6",
  soundSrc: droneAmbient1,
  delay: 0,
  config: {
    volume: 0.1,
    src: [droneAmbient1],
  },
  loop: false,
  stereo: 0,
};

export const shot6UniqueSounds: CinematicUniqueSounds = [droneAmbient1_6];

// MUSIC
export const shot6Music: CinematicMusic = {
  soundName: "Music_6",
  soundSrc: musicPianoCue1,
  config: {
    volume: 1,
    rate: 0.8,
    src: [musicPianoCue1],
  },
  loop: false,
  delay: 500,
  prevMusicFadeDuration: 0,
  initialFadeDuration: 0,
};
