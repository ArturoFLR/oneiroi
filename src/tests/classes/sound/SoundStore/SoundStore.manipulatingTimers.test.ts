// Configuration for the test environment
vi.mock("howler");

import { HowlMock } from "../../../../../__mocks__/howler";
import { SoundStore1 } from "../../../../classes/sound/singletons";
import {
  AudioEnvironment,
  HowlInstance,
} from "../../../../classes/sound/soundTypes";
import { Howl } from "../../../../../__mocks__/howler";
import { PausableTimeout } from "../../../../utils/PausableTimeout";
import { PausableInterval } from "../../../../utils/PausableInterval";
import { MockInstance } from "vitest";
import { SoundStorePrivate } from "./soundStoreTestTypes";

// Helper
function resetAudioStore() {
  SoundStore1.audioStore = {
    [AudioEnvironment.MainMenu]: { sounds: {}, music: {}, soundscapes: {} },
    [AudioEnvironment.Map]: { sounds: {}, music: {}, soundscapes: {} },
    [AudioEnvironment.Cinematic]: { sounds: {}, music: {}, soundscapes: {} },
    [AudioEnvironment.Minigame]: { sounds: {}, music: {}, soundscapes: {} },
    [AudioEnvironment.InterfacePreloaded]: {
      sounds: {},
      music: {},
      soundscapes: {},
    },
  };
}

const goodSrc = "./rutaCorrecta";
let fakeHowlInstance: HowlMock;
let pausableTimeout1: PausableTimeout;
let pausableInterval1: PausableInterval;
let pausableTimeout2: PausableTimeout;
let pausableInterval2: PausableInterval;

let spyOnTimeout1Pause: MockInstance;
let spyOnTimeout1Resume: MockInstance;
let spyOnTimeout1Clear: MockInstance;

let spyOnInterval1Pause: MockInstance;
let spyOnInterval1Resume: MockInstance;
let spyOnInterval1Clear: MockInstance;

let spyOnTimeout2Pause: MockInstance;
let spyOnTimeout2Resume: MockInstance;
let spyOnTimeout2Clear: MockInstance;

let spyOnInterval2Pause: MockInstance;
let spyOnInterval2Resume: MockInstance;
let spyOnInterval2Clear: MockInstance;

let spyOnCancelAnimationFrame: MockInstance;

let testSoundData: HowlInstance;

////////////////////////////////////////////////////////////////////// Test Cases

beforeEach(() => {
  vi.clearAllMocks();
  resetAudioStore();

  pausableTimeout1 = new PausableTimeout(() => {}, 500);
  pausableInterval1 = new PausableInterval(() => {}, 500);
  pausableTimeout2 = new PausableTimeout(() => {}, 1500);
  pausableInterval2 = new PausableInterval(() => {}, 1500);

  spyOnTimeout1Pause = vi.spyOn(pausableTimeout1, "pause");
  spyOnTimeout1Resume = vi.spyOn(pausableTimeout1, "resume");
  spyOnTimeout1Clear = vi.spyOn(pausableTimeout1, "clear");

  spyOnInterval1Pause = vi.spyOn(pausableInterval1, "pause");
  spyOnInterval1Resume = vi.spyOn(pausableInterval1, "resume");
  spyOnInterval1Clear = vi.spyOn(pausableInterval1, "clear");

  spyOnTimeout2Pause = vi.spyOn(pausableTimeout2, "pause");
  spyOnTimeout2Resume = vi.spyOn(pausableTimeout2, "resume");
  spyOnTimeout2Clear = vi.spyOn(pausableTimeout2, "clear");

  spyOnInterval2Pause = vi.spyOn(pausableInterval2, "pause");
  spyOnInterval2Resume = vi.spyOn(pausableInterval2, "resume");
  spyOnInterval2Clear = vi.spyOn(pausableInterval2, "clear");

  spyOnCancelAnimationFrame = vi.spyOn(window, "cancelAnimationFrame");

  fakeHowlInstance = new Howl({
    src: [goodSrc],
    preload: false,
    html5: false,
  });

  const soundData = {
    instance: fakeHowlInstance as unknown as Howl,
    ids: [1050, 1060],
    pausableTimeoutsIds: [pausableTimeout1, pausableTimeout2],
    pausableIntervalsIds: [pausableInterval1, pausableInterval2],
    animationFrameIds: [50, 60],
  };

  SoundStore1.audioStore[AudioEnvironment.Cinematic].sounds.testSound =
    soundData;

  testSoundData =
    SoundStore1.audioStore[AudioEnvironment.Cinematic].sounds.testSound;
});

describe("The addTimerToSound method works as expected", () => {
  it("Correctly detects and assigns animationFrameIds without deleting existing ones.", () => {
    (SoundStore1 as unknown as SoundStorePrivate).addTimerToSound(
      AudioEnvironment.Cinematic,
      "sounds",
      "testSound",
      70
    );
    const expectedArray = [50, 60, 70];

    expect(testSoundData.animationFrameIds).toEqual(expectedArray);
  });

  it("Correctly detects and assigns pausableTimeoutsIds without deleting existing ones.", () => {
    const pausableTimeoutToAdd = new PausableTimeout(() => {}, 200);

    (SoundStore1 as unknown as SoundStorePrivate).addTimerToSound(
      AudioEnvironment.Cinematic,
      "sounds",
      "testSound",
      pausableTimeoutToAdd
    );

    expect(testSoundData.pausableTimeoutsIds).toContain(pausableTimeoutToAdd);
    expect(testSoundData.pausableTimeoutsIds).toContain(pausableTimeout1);
    expect(testSoundData.pausableTimeoutsIds).toContain(pausableTimeout2);
  });

  it("Correctly detects and assigns pausableIntervalsIds without deleting existing ones.", () => {
    const pausableIntervalToAdd = new PausableInterval(() => {}, 400);

    (SoundStore1 as unknown as SoundStorePrivate).addTimerToSound(
      AudioEnvironment.Cinematic,
      "sounds",
      "testSound",
      pausableIntervalToAdd
    );

    expect(testSoundData.pausableIntervalsIds).toContain(pausableIntervalToAdd);
    expect(testSoundData.pausableIntervalsIds).toContain(pausableInterval1);
    expect(testSoundData.pausableIntervalsIds).toContain(pausableInterval2);
  });
});

describe("The applySoundTimeoutsAction method works as expected", () => {
  it("Correctly detects and apply 'clear' action: It calls the clear method of all timeouts and then deletes them.", () => {
    (SoundStore1 as unknown as SoundStorePrivate).applySoundTimeoutsAction(
      "clear",
      AudioEnvironment.Cinematic,
      "sounds",
      "testSound"
    );

    expect(spyOnTimeout1Clear).toHaveBeenCalledOnce();
    expect(spyOnTimeout2Clear).toHaveBeenCalledOnce();
    expect(testSoundData.pausableTimeoutsIds.length).toBe(0);
  });

  it("Correctly detects and apply 'pause' action: It calls the pause method of all timeouts and don't delete them.", () => {
    (SoundStore1 as unknown as SoundStorePrivate).applySoundTimeoutsAction(
      "pause",
      AudioEnvironment.Cinematic,
      "sounds",
      "testSound"
    );

    expect(spyOnTimeout1Pause).toHaveBeenCalledOnce();
    expect(spyOnTimeout2Pause).toHaveBeenCalledOnce();
    expect(testSoundData.pausableTimeoutsIds.length).toBe(2);
  });

  it("Correctly detects and apply 'resume' action: It calls the resume method of all timeouts and don't delete them.", () => {
    (SoundStore1 as unknown as SoundStorePrivate).applySoundTimeoutsAction(
      "resume",
      AudioEnvironment.Cinematic,
      "sounds",
      "testSound"
    );

    expect(spyOnTimeout1Resume).toHaveBeenCalledOnce();
    expect(spyOnTimeout2Resume).toHaveBeenCalledOnce();
    expect(testSoundData.pausableTimeoutsIds.length).toBe(2);
  });
});

describe("The applySoundIntervalsActions method works as expected", () => {
  it("Correctly detects and apply 'clear' action: It calls the clear method of all timeouts and then deletes them.", () => {
    (SoundStore1 as unknown as SoundStorePrivate).applySoundIntervalsActions(
      "clear",
      AudioEnvironment.Cinematic,
      "sounds",
      "testSound"
    );

    expect(spyOnInterval1Clear).toHaveBeenCalledOnce();
    expect(spyOnInterval2Clear).toHaveBeenCalledOnce();
    expect(testSoundData.pausableIntervalsIds.length).toBe(0);
  });

  it("Correctly detects and apply 'pause' action: It calls the pause method of all timeouts and don't delete them.", () => {
    (SoundStore1 as unknown as SoundStorePrivate).applySoundIntervalsActions(
      "pause",
      AudioEnvironment.Cinematic,
      "sounds",
      "testSound"
    );

    expect(spyOnInterval1Pause).toHaveBeenCalledOnce();
    expect(spyOnInterval2Pause).toHaveBeenCalledOnce();
    expect(testSoundData.pausableIntervalsIds.length).toBe(2);
  });

  it("Correctly detects and apply 'resume' action: It calls the resume method of all timeouts and don't delete them.", () => {
    (SoundStore1 as unknown as SoundStorePrivate).applySoundIntervalsActions(
      "resume",
      AudioEnvironment.Cinematic,
      "sounds",
      "testSound"
    );

    expect(spyOnInterval1Resume).toHaveBeenCalledOnce();
    expect(spyOnInterval2Resume).toHaveBeenCalledOnce();
    expect(testSoundData.pausableIntervalsIds.length).toBe(2);
  });
});

describe("The stopSoundAnimationFrames method works as expected", () => {
  it("Correctly detects and apply 'clear' action: It calls the clear method of all timeouts and then deletes them.", () => {
    (SoundStore1 as unknown as SoundStorePrivate).stopSoundAnimationFrames(
      AudioEnvironment.Cinematic,
      "sounds",
      "testSound"
    );

    expect(spyOnCancelAnimationFrame).toHaveBeenNthCalledWith(1, 50);
    expect(spyOnCancelAnimationFrame).toHaveBeenNthCalledWith(2, 60);
    expect(testSoundData.animationFrameIds.length).toBe(0);
  });
});
