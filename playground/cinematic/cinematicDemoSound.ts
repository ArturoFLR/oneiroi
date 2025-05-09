import {
  MainAmbientSound,
  SecondarySound,
} from "../../src/classes/sound/soundTypes";
import {
  CinematicAmbientSound,
  CinematicMusic,
  CinematicUniqueSound,
  CinematicUniqueSounds,
} from "src/components/cinematics/cinematicTypes";

import ambientWind from "@assets/audio/sounds/ambient/wind/strong_wind.mp3";
import ominousDrone from "@assets/audio/sounds/ambient/ominous/ominous-drone.mp3";
import thunder1_1 from "@assets/audio/sounds/effects/thunder/thunder_2.mp3";
import thunder1_3 from "@assets/audio/sounds/effects/thunder/thunder_3.mp3";
import thunder2_3 from "@assets/audio/sounds/effects/thunder/thunder_1.mp3";
import evil1_2 from "@assets/audio/sounds/effects/evil/evil-man-laught.mp3";

import shot1MusicSrc from "@assets/audio/music/track_01.mp3";

///////////////////////////////////////////   SHOT 1  ///////////////////////////////////////////

// AMBIENT SOUNDS
const mainAmbientSound1_1: MainAmbientSound = {
  name: "introWind1",
  src: ambientWind,
  fadeDuration: 2500,
  securityMargin: 1000,
  config: {
    volume: 0.3,
    src: [ambientWind],
  },
};

const mainAmbientSound2_1: MainAmbientSound = {
  name: "introDrone1",
  src: ominousDrone,
  fadeDuration: 3500,
  securityMargin: 1000,
  config: {
    volume: 0.7,
    src: [ominousDrone],
  },
};

const mainAmbientSounds1 = [mainAmbientSound1_1, mainAmbientSound2_1];

const secAmbientSound1_1: SecondarySound = {
  name: "softThunder1",
  src: thunder1_1,
  delay: 4000,
  minLoopTime: 15000,
  maxLoopTime: 30000,
  config: {
    volume: 0.2,
    src: [thunder1_1],
  },
  stereoValue: 0.3,
};

const secAmbientSounds1 = [secAmbientSound1_1];

export const shot1AmbientSound: CinematicAmbientSound = {
  soundscapeName: "windy_1",
  mainAmbientSounds: mainAmbientSounds1,
  secondaryAmbientSounds: secAmbientSounds1,
  prevAmbientFadeDuration: 0,
  delay: 0,
  initialFadeDuration: 10000,
  toVolume: 1,
};

// MUSIC
export const shot1Music: CinematicMusic = {
  soundName: "introFirstMusic_1",
  soundSrc: shot1MusicSrc,
  config: {
    volume: 0,
    src: [shot1MusicSrc],
  },
  loop: false,
  delay: 2500,
  prevMusicFadeDuration: 100,
  initialFadeDuration: 10000,
  toVolume: 0.8,
};

///////////////////////////////////////////   SHOT 2   ///////////////////////////////////////////
// UNIQUE SOUNDS
const evil1: CinematicUniqueSound = {
  category: "sounds",
  soundName: "evil1_2",
  soundSrc: evil1_2,
  delay: 0,
  config: {
    volume: 0.2,
    rate: 1,
    src: [evil1_2],
  },
  loop: true,
};

export const shot2UniqueSounds: CinematicUniqueSounds = [evil1];

///////////////////////////////////////////   SHOT 3   ///////////////////////////////////////////

// UNIQUE SOUNDS
const thunder1: CinematicUniqueSound = {
  category: "sounds",
  soundName: "thunder1_3",
  soundSrc: thunder1_3,
  delay: 0,
  stereo: -0.6,
  config: {
    volume: 1,
    src: [thunder1_3],
  },
};

const thunder2: CinematicUniqueSound = {
  category: "sounds",
  soundName: "thunder2_3",
  soundSrc: thunder2_3,
  delay: 1500,
  stereo: 0.8,
  config: {
    volume: 1,
    src: [thunder2_3],
  },
};

export const shot3UniqueSounds: CinematicUniqueSounds = [thunder1, thunder2];

// MUSIC
export const shot3Music: CinematicMusic = {
  soundName: "introFirstMusic_3",
  soundSrc: shot1MusicSrc,
  config: {
    volume: 0.8,
    src: [shot1MusicSrc],
  },
  loop: false,
  delay: 0,
  prevMusicFadeDuration: 4000,
  initialFadeDuration: 0,
};

//SOUNDSCAPES
const mainAmbientSound1_3: MainAmbientSound = {
  name: "introWind_3",
  src: ambientWind,
  fadeDuration: 2500,
  securityMargin: 1000,
  config: {
    volume: 1,
    src: [ambientWind],
  },
};

const mainAmbientSound2_3: MainAmbientSound = {
  name: "introDrone_3",
  src: ominousDrone,
  fadeDuration: 3500,
  securityMargin: 1000,
  config: {
    volume: 0.7,
    src: [ominousDrone],
  },
};

const mainAmbientSounds3 = [mainAmbientSound1_3, mainAmbientSound2_3];

const secAmbientSound1_3: SecondarySound = {
  name: "softThunder_3",
  src: thunder1_1,
  delay: 4000,
  minLoopTime: 15000,
  maxLoopTime: 30000,
  config: {
    volume: 0.2,
    src: [thunder1_1],
  },
  stereoValue: 0.3,
};

const secAmbientSounds3 = [secAmbientSound1_3];

export const shot3AmbientSound: CinematicAmbientSound = {
  soundscapeName: "windy_3",
  mainAmbientSounds: mainAmbientSounds3,
  secondaryAmbientSounds: secAmbientSounds3,
  prevAmbientFadeDuration: 0,
  delay: 0,
  initialFadeDuration: 3000,
  toVolume: 1,
  endTime: 3000,
  fadeOutDuration: 4000,
};
