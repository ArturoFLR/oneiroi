import { Howl, HowlOptions } from "howler";
import { PausableTimeout } from "../../utils/PausableTimeout";
import { PausableInterval } from "../../utils/PausableInterval";

export type FadeValuesType = {
  final: number;
  milliseconds: number;
};

export type SoundscapesRegister = string[];

export type SoundscapesLibrary = {
  [env in AudioEnvironment]: {
    [key: string]: SoundscapesRegister;
  };
};

export type MainAmbientSound = {
  name: string;
  src: string;
  fadeDuration: number;
  securityMargin: number;
  config?: HowlOptions;
  stereoValue?: number;
};

export type SecondarySound = {
  name: string;
  src: string;
  delay: number;
  minLoopTime: number;
  maxLoopTime: number;
  config?: HowlOptions;
  stereoValue?: number;
};

export type PlayEventName =
  | "autoEnd"
  | "autoEndSoundscape"
  | "stop"
  | "stopId"
  | "pause"
  | "resume";

export type PlayEvent = {
  eventType: PlayEventName;
  env: AudioEnvironment;
  category: SoundCategory;
  soundName: string;
  id?: number;
};

export type ChangeParamEventName = "volume" | "rate" | "stereo";

export type ChangeParamEvent = {
  parameterType: ChangeParamEventName;
  env: AudioEnvironment;
  category: SoundCategory;
  soundName: string;
  newValue: number;
  id?: number;
};

export type ModifyTimersEventName =
  | "addTimeout"
  | "addInterval"
  | "addAnimationFrame"
  | "deleteTimeout"
  | "deleteInterval"
  | "deleteAnimationFrame";

export type ModifyTimersEvent = {
  eventType: ModifyTimersEventName;
  env: AudioEnvironment;
  category: SoundCategory;
  soundName: string;
  timer?: number | PausableTimeout | PausableInterval;
};

export type AddPlayIdEvent = {
  env: AudioEnvironment;
  category: SoundCategory;
  soundName: string;
  soundId: number;
};

export type PropertiesToNormalize = "volume" | "rate" | "fade" | "stereo";

export type TimeoutActions = "pause" | "resume" | "clear";
export type IntervalActions = TimeoutActions;

export type HowlInstance = {
  instance: Howl; // La instancia de Howl.
  ids: number[]; // Una lista de reproducciones en curso de la instancia.
  pausableTimeoutsIds: PausableTimeout[]; // Una lista de PausableTimeouts de tipo PausableTimeout en curso de la instancia.
  pausableIntervalsIds: PausableInterval[]; // Una lista de PausableIntervals en curso de la instancia.
  animationFrameIds: number[]; // Una lista de animaciones en curso de la instancia.
};

export type HowlLibrary = {
  [key: string]: HowlInstance;
};

export enum AudioEnvironment {
  MainMenu = "mainMenu",
  Map = "map",
  Cinematic = "cinematic",
  Minigame = "minigame",
  InterfacePreloaded = "interfacePreloaded",
}

// "sounds" almacena tanto sonidos precargados como no precargados. "soundscapes" almacena sonidos precargados.
// Se guardan aparte ya que no se autoeliminan cuando termina su reproducción. Son eliminados manualmente por la clase SoundscapesCreator cuando es necesario.
export type SoundCategory = "sounds" | "music" | "soundscapes";

export type AudioStore = {
  [env in AudioEnvironment]: {
    [category in SoundCategory]: HowlLibrary;
  };
};
