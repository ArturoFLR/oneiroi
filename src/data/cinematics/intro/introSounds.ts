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
import softWind1 from "@assets/audio/sounds/ambient/wind/soft-wind.mp3";
import ominousDrone1_01 from "@assets/audio/sounds/ambient/ominous/ominous-drone.mp3";
import thunderMedium1 from "@assets/audio/sounds/effects/thunder/thunder_2.mp3";
import thunderMedium2 from "@assets/audio/sounds/effects/thunder/thunder_3.mp3";
import thunderMedium3 from "@assets/audio/sounds/effects/thunder/thunder_1.mp3";
import thunderStrong1 from "@assets/audio/sounds/effects/thunder/thunder-strong_01.mp3";
import thunderStrong2 from "@assets/audio/sounds/effects/thunder/thunder-strong_03.mp3";
import thunderStrong3 from "@assets/audio/sounds/effects/thunder/thunder-strong_04.mp3";
import thunderStrong4 from "@assets/audio/sounds/effects/thunder/thunder-strong_02.mp3";
import strongWindAndRain1 from "@assets/audio/sounds/ambient/wind-rain/strong-wind-rain_01.mp3";
import musicTenseShort1 from "@assets/audio/music/tension-short_01.mp3";
import musicVeryTense1 from "@assets/audio/music/great-tension-excerpt_01.mp3";
import hatmanSpeaks1 from "@assets/audio/sounds/effects/evil/evil-man-speaks_01.mp3";
import womanScream1 from "@assets/audio/sounds/human/woman/screams/woman-scream_04.mp3";
import evilAh1 from "@assets/audio/sounds/effects/evil/evil-man-ah_02.mp3";
import manSurprise1 from "@assets/audio/sounds/human/man/man-surprise_04.mp3";
import manBreath1 from "@assets/audio/sounds/human/man/man_breathing_heavy_01.mp3";
import musicPianoCue1 from "@assets/audio/music/piano-short-cue_01.mp3";
import cityAmbient1 from "@assets/audio/sounds/ambient/city/city-one-siren.mp3";

///////////////////////////////////////////   SHOT 1  ///////////////////////////////////////////

// AMBIENT SOUNDS
// MAIN SOUNDS
const mainAmbientSound1_1: MainAmbientSound = {
  name: "softWind1_01",
  src: softWind1,
  fadeDuration: 2500,
  securityMargin: 1000,
  config: {
    volume: 0.6,
    src: [softWind1],
  },
};

const mainAmbientSound2_1: MainAmbientSound = {
  name: "drone1_01",
  src: ominousDrone1_01,
  fadeDuration: 3500,
  securityMargin: 1000,
  config: {
    volume: 0.7,
    src: [ominousDrone1_01],
  },
};

const mainAmbientSounds1 = [mainAmbientSound1_1, mainAmbientSound2_1];

export const shot1AmbientSound: CinematicAmbientSound = {
  soundscapeName: "softWindy_1",
  mainAmbientSounds: mainAmbientSounds1,
  prevAmbientFadeDuration: 0,
  delay: 0,
  initialFadeDuration: 10000,
  toVolume: 1,
};

///////////////////////////////////////////   SHOT 2  ///////////////////////////////////////////

///////////////////////////////////////////   SHOT 3  ///////////////////////////////////////////

// UNIQUE SOUNDS
const softThunder1_03: CinematicUniqueSound = {
  category: "sounds",
  soundName: "softThunder1_03",
  soundSrc: thunderMedium1,
  delay: 3200,
  config: {
    volume: 0.7,
    src: [thunderMedium1],
  },
  loop: false,
  stereo: 0,
};

const softExplosion1_03: CinematicUniqueSound = {
  category: "sounds",
  soundName: "softExplosion1_03",
  soundSrc: thunderStrong1,
  delay: 3500,
  config: {
    volume: 0.08,
    rate: 0.7,
    src: [thunderStrong1],
  },
  loop: false,
  stereo: -0.4,
};

const softExplosion2_03: CinematicUniqueSound = {
  category: "sounds",
  soundName: "softExplosion2_03",
  soundSrc: thunderStrong1,
  delay: 5000,
  config: {
    volume: 0.09,
    rate: 0.85,
    src: [thunderStrong1],
  },
  loop: false,
  stereo: 0.4,
};

const softExplosion3_03: CinematicUniqueSound = {
  category: "sounds",
  soundName: "softExplosion3_03",
  soundSrc: thunderStrong1,
  delay: 6800,
  config: {
    volume: 0.3,
    rate: 1,
    src: [thunderStrong1],
  },
  loop: false,
  stereo: -0.1,
};

export const shot3UniqueSounds: CinematicUniqueSounds = [
  softThunder1_03,
  softExplosion1_03,
  softExplosion2_03,
  softExplosion3_03,
];

// MUSIC

export const shot3Music: CinematicMusic = {
  soundName: "Music_03",
  soundSrc: musicTenseShort1,
  config: {
    volume: 0,
    src: [musicTenseShort1],
  },
  loop: false,
  delay: 7000,
  prevMusicFadeDuration: 0,
  initialFadeDuration: 3000,
  toVolume: 1,
};

///////////////////////////////////////////   SHOT 4  ///////////////////////////////////////////

///////////////////////////////////////////   SHOT 5  ///////////////////////////////////////////

///////////////////////////////////////////   SHOT 6  ///////////////////////////////////////////

///////////////////////////////////////////   SHOT 7  ///////////////////////////////////////////

// AMBIENT SOUNDS
// MAIN SOUNDS
// El objetivo de este sonido ambiente es símplemente crear silencio antes del siguiente.
const mainAmbientSound1_07: MainAmbientSound = {
  name: "strongWind1_07",
  src: strongWindAndRain1,
  fadeDuration: 2500,
  securityMargin: 1000,
  config: {
    volume: 0,
    src: [strongWindAndRain1],
  },
};

const mainAmbientSounds7 = [mainAmbientSound1_07];

export const shot7AmbientSound: CinematicAmbientSound = {
  soundscapeName: "silence",
  mainAmbientSounds: mainAmbientSounds7,
  prevAmbientFadeDuration: 6500,
  delay: 0,
  initialFadeDuration: 0,
  toVolume: 0,
};

// MUSIC
// El objetivo es crear silencio
export const shot7Music: CinematicMusic = {
  soundName: "Music_07",
  soundSrc: musicTenseShort1,
  config: {
    volume: 0,
    rate: 0.95,
    src: [musicTenseShort1],
  },
  loop: false,
  delay: 0,
  prevMusicFadeDuration: 3500,
  initialFadeDuration: 0,
  toVolume: 0,
};

///////////////////////////////////////////   SHOT 8  ///////////////////////////////////////////

// AMBIENT SOUNDS
// MAIN SOUNDS
const mainAmbientSound1_08: MainAmbientSound = {
  name: "strongWind1_08",
  src: strongWindAndRain1,
  fadeDuration: 2500,
  securityMargin: 1000,
  config: {
    volume: 0.7,
    rate: 0.85,
    src: [strongWindAndRain1],
  },
};

const mainAmbientSound2_08: MainAmbientSound = {
  name: "drone1_08",
  src: ominousDrone1_01,
  fadeDuration: 3500,
  securityMargin: 1000,
  config: {
    volume: 0.8,
    src: [ominousDrone1_01],
  },
};

const mainAmbientSounds8 = [mainAmbientSound1_08, mainAmbientSound2_08];

// SECONDARY SOUNDS

const secondarySound1_08: SecondarySound = {
  name: "softThunder1_08",
  src: thunderMedium1,
  delay: 20000,
  minLoopTime: 10000,
  maxLoopTime: 25000,
  stereoValue: 0.7,
};

const secondarySound2_08: SecondarySound = {
  name: "softThunder2_08",
  src: thunderMedium2,
  delay: 2500,
  minLoopTime: 15000,
  maxLoopTime: 25000,
  stereoValue: 0,
};

const secondarySound3_08: SecondarySound = {
  name: "softThunder3_08",
  src: thunderMedium3,
  delay: 4500,
  minLoopTime: 20000,
  maxLoopTime: 39000,
  stereoValue: -0.6,
};

const secondarySounds8 = [
  secondarySound1_08,
  secondarySound2_08,
  secondarySound3_08,
];

export const shot8AmbientSound: CinematicAmbientSound = {
  soundscapeName: "strongWind_1",
  mainAmbientSounds: mainAmbientSounds8,
  secondaryAmbientSounds: secondarySounds8,
  prevAmbientFadeDuration: 0,
  delay: 0,
  initialFadeDuration: 0,
  toVolume: 1,
};

// UNIQUE SOUNDS
const strongThunder1_08: CinematicUniqueSound = {
  category: "sounds",
  soundName: "strongThunder1_08",
  soundSrc: thunderStrong2,
  delay: 0,
  config: {
    volume: 0.7,
    src: [thunderStrong2],
  },
  loop: false,
  stereo: 0,
};

const strongThunder2_08: CinematicUniqueSound = {
  category: "sounds",
  soundName: "strongThunder2_08",
  soundSrc: thunderStrong3,
  delay: 1800,
  config: {
    volume: 0.6,
    rate: 0.9,
    src: [thunderStrong3],
  },
  loop: false,
  stereo: -0.65,
};

export const shot8UniqueSounds: CinematicUniqueSounds = [
  strongThunder1_08,
  strongThunder2_08,
];

///////////////////////////////////////////   SHOT 9  ///////////////////////////////////////////

// UNIQUE SOUNDS
const strongThunder1_09: CinematicUniqueSound = {
  category: "sounds",
  soundName: "strongThunder1_09",
  soundSrc: thunderStrong2,
  delay: 0,
  config: {
    volume: 0.5,
    rate: 0.85,
    src: [thunderStrong2],
  },
  loop: false,
  stereo: -0.65,
};

export const shot9UniqueSounds: CinematicUniqueSounds = [strongThunder1_09];

///////////////////////////////////////////   SHOT 10  ///////////////////////////////////////////

// UNIQUE SOUNDS
const strongThunder1_10: CinematicUniqueSound = {
  category: "sounds",
  soundName: "strongThunder1_10",
  soundSrc: thunderStrong2,
  delay: 0,
  config: {
    volume: 0.7,
    rate: 0.9,
    src: [thunderStrong2],
  },
  loop: false,
  stereo: 0.45,
};

export const shot10UniqueSounds: CinematicUniqueSounds = [strongThunder1_10];

///////////////////////////////////////////   SHOT 11  ///////////////////////////////////////////

// UNIQUE SOUNDS
const strongThunder1_11: CinematicUniqueSound = {
  category: "sounds",
  soundName: "strongThunder1_11",
  soundSrc: thunderStrong3,
  delay: 0,
  config: {
    volume: 1,
    rate: 0.9,
    src: [thunderStrong3],
  },
  loop: false,
  stereo: 0,
};

export const shot11UniqueSounds: CinematicUniqueSounds = [strongThunder1_11];

///////////////////////////////////////////   SHOT 12  ///////////////////////////////////////////

// UNIQUE SOUNDS
const strongThunder1_12: CinematicUniqueSound = {
  category: "sounds",
  soundName: "strongThunder1_12",
  soundSrc: thunderStrong4,
  delay: 0,
  config: {
    volume: 0.9,
    rate: 0.8,
    src: [thunderStrong4],
  },
  loop: false,
  stereo: -0.65,
};

export const shot12UniqueSounds: CinematicUniqueSounds = [strongThunder1_12];

///////////////////////////////////////////   SHOT 13  ///////////////////////////////////////////

// MUSIC
export const shot13Music: CinematicMusic = {
  soundName: "Music_14",
  soundSrc: musicVeryTense1,
  config: {
    volume: 0,
    rate: 1,
    src: [musicVeryTense1],
  },
  loop: false,
  delay: 1000,
  prevMusicFadeDuration: 0,
  initialFadeDuration: 4500,
  toVolume: 1,
};

///////////////////////////////////////////   SHOT 14  ///////////////////////////////////////////

// UNIQUE SOUNDS
const strongThunder1_14: CinematicUniqueSound = {
  category: "sounds",
  soundName: "strongThunder1_14",
  soundSrc: thunderStrong3,
  delay: 0,
  config: {
    volume: 0.7,
    rate: 0.85,
    src: [thunderStrong3],
  },
  loop: false,
  stereo: 0,
};

export const shot14UniqueSounds: CinematicUniqueSounds = [strongThunder1_14];

///////////////////////////////////////////   SHOT 15  ///////////////////////////////////////////

///////////////////////////////////////////   SHOT 16  ///////////////////////////////////////////

// UNIQUE SOUNDS
const strongThunder1_16: CinematicUniqueSound = {
  category: "sounds",
  soundName: "strongThunder1_16",
  soundSrc: thunderStrong2,
  delay: 0,
  config: {
    volume: 0.9,
    rate: 0.85,
    src: [thunderStrong2],
  },
  loop: false,
  stereo: 0,
};

const strongThunder2_16: CinematicUniqueSound = {
  category: "sounds",
  soundName: "strongThunder2_16",
  soundSrc: thunderStrong4,
  delay: 1700,
  config: {
    volume: 0.9,
    rate: 0.95,
    src: [thunderStrong4],
  },
  loop: false,
  stereo: 0,
};

export const shot16UniqueSounds: CinematicUniqueSounds = [
  strongThunder1_16,
  strongThunder2_16,
];

///////////////////////////////////////////   SHOT 17  ///////////////////////////////////////////

///////////////////////////////////////////   SHOT 18  ///////////////////////////////////////////

// UNIQUE SOUNDS
const strongThunder1_18: CinematicUniqueSound = {
  category: "sounds",
  soundName: "strongThunder1_18",
  soundSrc: thunderStrong3,
  delay: 0,
  config: {
    volume: 0.9,
    rate: 1,
    src: [thunderStrong3],
  },
  loop: false,
  stereo: 0,
};

const strongThunder2_18: CinematicUniqueSound = {
  category: "sounds",
  soundName: "strongThunder2_18",
  soundSrc: thunderStrong1,
  delay: 1500,
  config: {
    volume: 0.7,
    rate: 0.9,
    src: [thunderStrong1],
  },
  loop: false,
  stereo: 0,
};

const strongThunder3_18: CinematicUniqueSound = {
  category: "sounds",
  soundName: "strongThunder3_18",
  soundSrc: thunderStrong4,
  delay: 2800,
  config: {
    volume: 0.8,
    rate: 0.9,
    src: [thunderStrong4],
  },
  loop: false,
  stereo: 0,
};

const evilSpeak1_18: CinematicUniqueSound = {
  category: "sounds",
  soundName: "evilSpeak1_18",
  soundSrc: hatmanSpeaks1,
  delay: 2000,
  config: {
    volume: 1,
    rate: 0.9,
    src: [hatmanSpeaks1],
  },
  loop: false,
  stereo: 0,
};

export const shot18UniqueSounds: CinematicUniqueSounds = [
  strongThunder1_18,
  strongThunder2_18,
  strongThunder3_18,
  evilSpeak1_18,
];

///////////////////////////////////////////   SHOT 19  ///////////////////////////////////////////

// UNIQUE SOUNDS
const evilAh1_19: CinematicUniqueSound = {
  category: "sounds",
  soundName: "evilAh1_19",
  soundSrc: evilAh1,
  delay: 2000,
  config: {
    volume: 1,
    rate: 0.94,
    src: [evilAh1],
  },
  loop: false,
  stereo: -0.85,
};

const evilAh2_19: CinematicUniqueSound = {
  category: "sounds",
  soundName: "evilAh2_19",
  soundSrc: evilAh1,
  delay: 2000,
  config: {
    volume: 1,
    rate: 0.98,
    src: [evilAh1],
  },
  loop: false,
  stereo: 1,
};

export const shot19UniqueSounds: CinematicUniqueSounds = [
  evilAh1_19,
  evilAh2_19,
];
///////////////////////////////////////////   SHOT 20  ///////////////////////////////////////////

///////////////////////////////////////////   SHOT 21  ///////////////////////////////////////////

// AMBIENT SOUNDS
// MAIN SOUNDS
// El objetivo de este sonido ambiente es símplemente crear silencio antes del siguiente.
const mainAmbientSound1_21: MainAmbientSound = {
  name: "strongWind1_07",
  src: strongWindAndRain1,
  fadeDuration: 2500,
  securityMargin: 1000,
  config: {
    volume: 0,
    src: [strongWindAndRain1],
  },
};

const mainAmbientSounds21 = [mainAmbientSound1_21];

export const shot21AmbientSound: CinematicAmbientSound = {
  soundscapeName: "silence",
  mainAmbientSounds: mainAmbientSounds21,
  prevAmbientFadeDuration: 1500,
  delay: 0,
  initialFadeDuration: 0,
  toVolume: 0,
};

// MUSIC
// El objetivo es crear silencio
export const shot21Music: CinematicMusic = {
  soundName: "Music_07",
  soundSrc: musicTenseShort1,
  config: {
    volume: 0,
    rate: 0.95,
    src: [musicTenseShort1],
  },
  loop: false,
  delay: 0,
  prevMusicFadeDuration: 1000,
  initialFadeDuration: 0,
  toVolume: 0,
};

// UNIQUE SOUNDS
const womanScream1_21: CinematicUniqueSound = {
  category: "sounds",
  soundName: "womanScream1_21",
  soundSrc: womanScream1,
  delay: 0,
  config: {
    volume: 1,
    rate: 1,
    src: [womanScream1],
  },
  loop: false,
  stereo: 0,
};

export const shot21UniqueSounds: CinematicUniqueSounds = [womanScream1_21];

///////////////////////////////////////////   SHOT 22  ///////////////////////////////////////////

// UNIQUE SOUNDS
const manSurprise1_22: CinematicUniqueSound = {
  category: "sounds",
  soundName: "manSurprise1_22",
  soundSrc: manSurprise1,
  delay: 0,
  config: {
    volume: 1,
    rate: 0.9,
    src: [manSurprise1],
  },
};

export const shot22UniqueSounds: CinematicUniqueSounds = [manSurprise1_22];

///////////////////////////////////////////   SHOT 23  ///////////////////////////////////////////

// UNIQUE SOUNDS
const manBreath1_23: CinematicUniqueSound = {
  category: "sounds",
  soundName: "manBreath1_23",
  soundSrc: manBreath1,
  delay: 0,
  config: {
    volume: 0.4,
    rate: 1,
    src: [manBreath1],
  },
};

const cityAmbient1_23: CinematicUniqueSound = {
  category: "sounds",
  soundName: "cityAmbient1_23",
  soundSrc: cityAmbient1,
  delay: 2500,
  config: {
    volume: 0.3,
    rate: 0.9,
    src: [cityAmbient1],
  },
};

export const shot23UniqueSounds: CinematicUniqueSounds = [
  manBreath1_23,
  cityAmbient1_23,
];

// MUSIC
export const shot23Music: CinematicMusic = {
  soundName: "Music_23",
  soundSrc: musicPianoCue1,
  config: {
    volume: 1,
    rate: 0.8,
    src: [musicPianoCue1],
  },
  loop: false,
  delay: 3000,
  prevMusicFadeDuration: 0,
  initialFadeDuration: 0,
};

///////////////////////////////////////////   SHOT 24  ///////////////////////////////////////////
