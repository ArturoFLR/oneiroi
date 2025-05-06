import { SoundDirectorAPI1 } from "../../src/classes/sound/singletons";
import {
  AudioEnvironment,
  FadeValuesType,
  MainAmbientSound,
  SecondarySound,
} from "../../src/classes/sound/soundTypes";

let preloadedID: number = 0;

export const activateAudio = () => {
  SoundDirectorAPI1.initAudio();
};

export function playMusic() {
  SoundDirectorAPI1.playSound(
    AudioEnvironment.Cinematic,
    "music",
    "soule1",
    "../../src/assets/audio/music/track_01.mp3",
    {
      volume: 1,
      src: "",
    }
  );
}

export function playNormalSound() {
  SoundDirectorAPI1.playSound(
    AudioEnvironment.Cinematic,
    "sounds",
    "wind1Normal",
    "../../src/assets/audio/sounds/ambient/wind/soft-wind.mp3"
  );
}

export function preloadCinematicSound() {
  SoundDirectorAPI1.preloadSound(
    AudioEnvironment.Cinematic,
    "sounds",
    "wind2Preloaded",
    "../../src/assets/audio/sounds/ambient/wind/soft-wind.mp3"
  );
}

export function preloadInterfaceSound() {
  SoundDirectorAPI1.preloadInterfaceSound(
    "fountain",
    "../../src/assets/audio/sounds/ambient/fountain-water.mp3"
  );
}

export function playPreloadedCinematicSound() {
  SoundDirectorAPI1.playSound(
    AudioEnvironment.Cinematic,
    "sounds",
    "wind2Preloaded",
    ""
  );
}

export function playInterfaceSound() {
  SoundDirectorAPI1.playSound(
    AudioEnvironment.InterfacePreloaded,
    "sounds",
    "fountain",
    ""
  )
    .then((result) => {
      if (result !== false) preloadedID = result as number;
    })
    .catch((error) => {
      console.warn(
        "Error en función playPreloadedSound del fichero soundTest.ts",
        error
      );
    });
}

export function clearCinematicMusicCat() {
  SoundDirectorAPI1.stopCategorySounds(AudioEnvironment.Cinematic, "music");
}

export function clearCinematicSoundsCat() {
  SoundDirectorAPI1.stopCategorySounds(AudioEnvironment.Cinematic, "sounds");
}

export function clearCinematicEnv() {
  SoundDirectorAPI1.stopEnvSounds(AudioEnvironment.Cinematic);
}

export function stopAllSounds() {
  SoundDirectorAPI1.stopAllSounds();
}

export function pauseMusic() {
  SoundDirectorAPI1.pauseSound(AudioEnvironment.Cinematic, "music", "soule1");
}

export function resumeMusic() {
  SoundDirectorAPI1.resumeSound(AudioEnvironment.Cinematic, "music", "soule1");
}

export function pauseNormalSound() {
  SoundDirectorAPI1.pauseSound(
    AudioEnvironment.Cinematic,
    "sounds",
    "wind1Normal"
  );
}

export function resumeNormalSound() {
  SoundDirectorAPI1.resumeSound(
    AudioEnvironment.Cinematic,
    "sounds",
    "wind1Normal"
  );
}

export function pauseInterfacelSound() {
  SoundDirectorAPI1.pauseSound(
    AudioEnvironment.InterfacePreloaded,
    "sounds",
    "fountain"
  );
}

export function resumeInterfaceSound() {
  SoundDirectorAPI1.resumeSound(
    AudioEnvironment.InterfacePreloaded,
    "sounds",
    "fountain"
  );
}

export function pauseEnvironment() {
  SoundDirectorAPI1.pauseEnvSounds(AudioEnvironment.Cinematic);
}

export function resumeEnvironment() {
  SoundDirectorAPI1.resumeEnvSounds(AudioEnvironment.Cinematic);
}

export function pauseAll() {
  SoundDirectorAPI1.pauseAllSounds();
}

export function resumeAll() {
  SoundDirectorAPI1.resumeAllSounds();
}

export function changeMusicVolume(volume: number) {
  SoundDirectorAPI1.setSoundVolume(
    AudioEnvironment.Cinematic,
    "music",
    "soule1",
    volume
  );
}

export function changeCategoryVolume(volume: number) {
  SoundDirectorAPI1.setCategoryVolume(
    AudioEnvironment.Cinematic,
    "sounds",
    volume
  );
}

export function changePreloadedIdVolume(volume: number) {
  SoundDirectorAPI1.setSoundVolume(
    AudioEnvironment.InterfacePreloaded,
    "sounds",
    "fountain",
    volume,
    preloadedID
  );
}

export function changeGeneralVolume(volume: number) {
  SoundDirectorAPI1.setGlobalVolume(volume);
}

export function playPreloadedWithVolume(volume: number) {
  SoundDirectorAPI1.playSound(
    AudioEnvironment.InterfacePreloaded,
    "sounds",
    "fountain",
    "",
    { volume: volume, src: "" }
  )
    .then((result) => {
      preloadedID = result !== false ? (result as number) : preloadedID;
    })
    .catch((error) => {
      console.warn(
        "Error en función playPreloadedWithVolume del fichero soundTest.ts",
        error
      );
    });
}

export function changeSoundRate(newRate: number) {
  SoundDirectorAPI1.setSoundRate(
    AudioEnvironment.InterfacePreloaded,
    "sounds",
    "fountain",
    newRate,
    preloadedID
  );
}

export function changeCategoryRate(newRate: number) {
  SoundDirectorAPI1.setCategoryRate(
    AudioEnvironment.Cinematic,
    "sounds",
    newRate
  );
}

export function changeGlobalRate(newRate: number) {
  SoundDirectorAPI1.setGlobalRate(newRate);
}

export function fadeMusic(fadeValues: FadeValuesType) {
  SoundDirectorAPI1.fadeSound(
    AudioEnvironment.Cinematic,
    "music",
    "soule1",
    fadeValues
  );
}

export function fadePreloadSound(fadeValues: FadeValuesType) {
  SoundDirectorAPI1.fadeSound(
    AudioEnvironment.InterfacePreloaded,
    "sounds",
    "fountain",
    fadeValues,
    preloadedID
  );
}

export function fadeAll(fadeValues: FadeValuesType) {
  SoundDirectorAPI1.fadeGlobal(fadeValues);
}

export function changeSoundStereo(stereoValue: number) {
  SoundDirectorAPI1.setStereoForSound(
    AudioEnvironment.InterfacePreloaded,
    "sounds",
    "fountain",
    stereoValue,
    preloadedID
  );
}

export function changeAllStereo(stereoValue: number) {
  SoundDirectorAPI1.setStereoGlobal(stereoValue);
}

export function createDinamicPan() {
  SoundDirectorAPI1.createAnimatedPanSound(
    AudioEnvironment.Cinematic,
    "sounds",
    "evil",
    "../../src/assets/audio/sounds/effects/evil-man-laught.mp3",
    -0.9,
    0.9,
    2000,
    300
  );
}

export function createDinamicPan2() {
  SoundDirectorAPI1.createAnimatedPanSound(
    AudioEnvironment.InterfacePreloaded,
    "sounds",
    "fountain",
    "../../src/assets/audio/sounds/ambient/fountain-water.mp3",
    -0.9,
    0.9,
    3500,
    3000
  );
}

export async function createLoop1() {
  SoundDirectorAPI1.createLoopWhithFade(
    AudioEnvironment.Cinematic,
    "sounds",
    "evil2",
    "../../src/assets/audio/sounds/effects/evil-man-laught.mp3",
    700,
    400,
    { volume: 0.7, src: "" },
    1
  );
}

export async function createLoop2() {
  SoundDirectorAPI1.createLoopWhithFade(
    AudioEnvironment.Cinematic,
    "music",
    "soule2",
    "../../src/assets/audio/music/track_01.mp3",
    8000,
    7000
  );
}

export function createSoundscape1() {
  const mainSoundRain: MainAmbientSound = {
    name: "rain1",
    src: "../../src/assets/audio/sounds/ambient/rain/rain-on-metal.mp3",
    fadeDuration: 2000,
    securityMargin: 700,
    config: { volume: 0.6, src: "" },
  };

  const mainSoundWind: MainAmbientSound = {
    name: "wind1",
    src: "../../src/assets/audio/sounds/ambient/wind/soft-wind.mp3",
    fadeDuration: 2000,
    securityMargin: 1000,
    config: { volume: 0.6, src: "" },
  };

  const thunder1: SecondarySound = {
    name: "thunder1",
    src: "../../src/assets/audio/sounds/effects/thunder/thunder_1.mp3",
    delay: 20000,
    minLoopTime: 25000,
    maxLoopTime: 35000,
    stereoValue: 0.7,
  };

  const thunder2: SecondarySound = {
    name: "thunder2",
    src: "../../src/assets/audio/sounds/effects/thunder/thunder_2.mp3",
    delay: 5500,
    minLoopTime: 25000,
    maxLoopTime: 32000,
    stereoValue: 0,
  };

  const thunder3: SecondarySound = {
    name: "thunder3",
    src: "../../src/assets/audio/sounds/effects/thunder/thunder_3.mp3",
    delay: 45000,
    minLoopTime: 30000,
    maxLoopTime: 49000,
    stereoValue: -0.6,
  };

  const mainSounds = [mainSoundRain, mainSoundWind];
  const secondarySoundsArray = [thunder1, thunder2, thunder3];

  SoundDirectorAPI1.createSoundscape(
    AudioEnvironment.Cinematic,
    "stormyRain1",
    mainSounds,
    secondarySoundsArray
  );
}

export function stopSoundscape() {
  SoundDirectorAPI1.stopSoundscape(AudioEnvironment.Cinematic, "stormyRain1");
}

export function pauseSoundscape() {
  SoundDirectorAPI1.pauseSoundscape(AudioEnvironment.Cinematic, "stormyRain1");
}

export function resumeSoundscape() {
  SoundDirectorAPI1.resumeSoundscape(AudioEnvironment.Cinematic, "stormyRain1");
}

export function fadeSoundscape() {
  SoundDirectorAPI1.fadeSoundscape(AudioEnvironment.Cinematic, 4000, 0);
}
