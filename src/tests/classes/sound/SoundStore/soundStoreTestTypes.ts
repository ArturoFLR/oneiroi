import {
  AudioEnvironment,
  IntervalActions,
  SoundCategory,
  TimeoutActions,
} from "../../../../classes/sound/soundTypes";

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
}
