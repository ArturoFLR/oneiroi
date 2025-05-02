import {
  AudioEnvironment,
  MainAmbientSound,
} from "../../src/classes/sound/soundTypes";
import {
  CinematicAmbientSound,
  CinematicMusic,
  CinematicUniqueSound,
  CinematicUniqueSounds,
} from "src/components/cinematics/cinematicTypes";

import ambientWind from "@assets/audio/sounds/ambient/wind/strong_wind.mp3";
import ominousDrone from "@assets/audio/sounds/ambient/ominous/ominous-drone.mp3";
import thunder1_3 from "@assets/audio/sounds/effects/thunder/thunder_3.mp3";

import shot1MusicSrc from "@assets/audio/music/track_01.mp3";

///////////////////////////////////////////   SHOT 1  ///////////////////////////////////////////

// AMBIENT SOUNDS
const mainAmbientSound1_1: MainAmbientSound = {
  name: "introWind",
  src: ambientWind,
  fadeDuration: 2500,
  securityMargin: 1000,
  config: {
    volume: 0.8,
    src: [ambientWind],
  },
};

const mainAmbientSound2_1: MainAmbientSound = {
  name: "introDrone",
  src: ominousDrone,
  fadeDuration: 3500,
  securityMargin: 1000,
  config: {
    volume: 0.8,
    src: [ominousDrone],
  },
};

const mainAmbientSounds = [mainAmbientSound1_1, mainAmbientSound2_1];

export const shot1AmbientSound: CinematicAmbientSound = {
  env: AudioEnvironment.Cinematic,
  soundscapeName: "windy",
  mainAmbientSounds: mainAmbientSounds,
  fadeOutDuration: 2000,
  delay: 0,
  initialFadeDuration: 3500,
};

// MUSIC
export const shot1Music: CinematicMusic = {
  env: AudioEnvironment.Cinematic,
  category: "music",
  soundName: "introFirstMusic",
  soundSrc: shot1MusicSrc,
  loop: false,
  delay: 3500,
  initialFadeDuration: 0,
};

///////////////////////////////////////////   SHOT 3   ///////////////////////////////////////////

// UNIQUE SOUNDS
const thunder1: CinematicUniqueSound = {
  env: AudioEnvironment.Cinematic,
  category: "sounds",
  soundName: "thunder1_3",
  soundSrc: thunder1_3,
  delay: 0,
};

export const shot3UniqueSounds: CinematicUniqueSounds = [thunder1];
