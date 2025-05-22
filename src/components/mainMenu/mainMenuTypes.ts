import { HowlOptions } from "howler";

export interface MainMenuInterfaceSoundData {
  soundName: string;
  soundSrc: string;
  config?: HowlOptions;
}

export interface MainMenuImgData {
  src: string;
  alt: string;
}

export interface MainMenuMusic {
  soundName: string;
  soundSrc: string;
  config?: HowlOptions;
}

export interface MainMenuSounds {
  soundName: string;
  soundSrc: string;
  config?: HowlOptions;
}
