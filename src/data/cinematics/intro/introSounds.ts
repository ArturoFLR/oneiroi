import {
  MainAmbientSound,
  SecondarySound,
} from "../../../classes/sound/soundTypes";
import { CinematicAmbientSound } from "../../../components/cinematics/cinematicTypes";

//////////////////////////////////////////////////////// ASSETS IMPORTS ///////////////////////////////////////////////////////
import softWind from "@assets/audio/sounds/ambient/wind/soft-wind.mp3";
import strongWind from "@assets/audio/sounds/ambient/wind/soft-wind.mp3";
import ominousDrone from "@assets/audio/sounds/ambient/ominous/ominous-drone.mp3";
import thunder1_1 from "@assets/audio/sounds/effects/thunder/thunder_2.mp3";
import thunder1_3 from "@assets/audio/sounds/effects/thunder/thunder_3.mp3";
import thunder2_3 from "@assets/audio/sounds/effects/thunder/thunder_1.mp3";

import shot1MusicSrc from "@assets/audio/music/track_01.mp3";

///////////////////////////////////////////   SHOT 1  ///////////////////////////////////////////

// AMBIENT SOUNDS
const mainAmbientSound1_1: MainAmbientSound = {
  name: "introWind1",
  src: softWind,
  fadeDuration: 2500,
  securityMargin: 1000,
  config: {
    volume: 0.3,
    src: [softWind],
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
