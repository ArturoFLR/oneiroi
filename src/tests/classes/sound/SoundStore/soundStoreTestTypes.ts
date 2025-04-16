import {
  AudioEnvironment,
  IntervalActions,
  SoundCategory,
  TimeoutActions,
} from "../../../../classes/sound/soundTypes";
import { PausableInterval } from "../../../../utils/PausableInterval";
import { PausableTimeout } from "../../../../utils/PausableTimeout";

export interface SoundStorePrivate {
  stopSoundAnimationFrames: (
    env: AudioEnvironment,
    category: SoundCategory,
    soundName: string
  ) => void;

  applySoundTimeoutsAction: (
    actionType: TimeoutActions,
    env: AudioEnvironment,
    category: SoundCategory,
    soundName: string
  ) => void;

  applySoundIntervalsActions: (
    actionType: IntervalActions,
    env: AudioEnvironment,
    category: SoundCategory,
    soundName: string
  ) => void;

  deletePlayingId: (
    env: AudioEnvironment,
    category: SoundCategory,
    soundName: string,
    idToDelete: number
  ) => void;

  unloadInstance: (
    env: AudioEnvironment,
    category: SoundCategory,
    name: string
  ) => void;

  addTimerToSound: (
    env: AudioEnvironment,
    category: SoundCategory,
    soundName: string,
    timer: number | PausableTimeout | PausableInterval
  ) => void;
}
