import { Subject } from "rxjs";
import {
  AddPlayIdEvent,
  AudioEnvironment,
  HowlInstance,
} from "../../../../classes/sound/soundTypes";

// Configuration for the test environment
vi.mock("howler");

import { SoundStore1 } from "../../../../classes/sound/singletons";
import { Howl } from "../../../../../__mocks__/howler";

const addPlayIdEventEmitter = new Subject<AddPlayIdEvent>();
addPlayIdEventEmitter.subscribe(SoundStore1.addPlayIdEventReceiver);

const goodSrc = "./rutaCorrecta";

////////////////////////////////////////////////////////////////////// Test Cases
beforeEach(() => {
  vi.mocked(Howl).mockClear();
});

describe("AddPlayIdEvent type events are received and processed correctly", () => {
  let soundData: HowlInstance;
  const fakeHowlInstance = new Howl({
    src: [goodSrc],
    preload: false,
    html5: false,
  });

  const fakePlayIds = [2750, 2751];
  const newIdToAdd = 3250;

  const genericAddPlayIdEventWithTimer: AddPlayIdEvent = {
    env: AudioEnvironment.Cinematic,
    category: "sounds",
    soundName: "testSound",
    soundId: newIdToAdd,
  };

  beforeEach(() => {
    const testSoundData = {
      instance: fakeHowlInstance as unknown as Howl,
      ids: [...fakePlayIds],
      pausableTimeoutsIds: [],
      pausableIntervalsIds: [],
      animationFrameIds: [],
    };

    SoundStore1.audioStore[AudioEnvironment.Cinematic].sounds.testSound =
      testSoundData;

    soundData =
      SoundStore1.audioStore[AudioEnvironment.Cinematic].sounds.testSound;

    addPlayIdEventEmitter.next(genericAddPlayIdEventWithTimer);
  });

  it("Adds the right play id to the ids array in testSound", () => {
    expect(soundData.ids).toContain(newIdToAdd);
  });

  it("Does not delete existing ids", () => {
    expect(soundData.ids.length).toBe(fakePlayIds.length + 1);
  });
});
