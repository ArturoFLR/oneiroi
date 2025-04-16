import { Subject } from "rxjs";
import { MockInstance } from "vitest";

import {
  AudioEnvironment,
  HowlInstance,
  ModifyTimersEvent,
} from "../../../../classes/sound/soundTypes";

// Configuration for the test environment
vi.mock("howler");

import { SoundStore1 } from "../../../../classes/sound/singletons";
import { HowlMock } from "../../../../../__mocks__/howler";
import { Howl } from "../../../../../__mocks__/howler";
import { PausableTimeout } from "../../../../utils/PausableTimeout";
import { PausableInterval } from "../../../../utils/PausableInterval";

const modifyTimersEventEmitter = new Subject<ModifyTimersEvent>();
modifyTimersEventEmitter.subscribe(SoundStore1.modifyTimersEventReceiver);

const goodSrc = "./rutaCorrecta";

////////////////////////////////////////////////////////////////////// Test Cases
beforeEach(() => {
  vi.mocked(Howl).mockClear();
});

describe("ModifyTimersEvent type events are received and processed correctly", () => {
  // Variables disponibles para todos los tests.
  const fakePlayIds = [2750, 2751];
  const fakeAnimationFrameId = 50;
  let fakeHowlInstance: HowlMock;
  let fakePausebleTimeout: PausableTimeout;
  let fakePausableInterval: PausableInterval;
  let testSoundData: HowlInstance;

  let spyOnStopSoundAnimationFrames: MockInstance;
  let spyOnApplySoundTimeoutsAction: MockInstance;
  let spyOnApplySoundIntervalsActions: MockInstance;
  let spyOnAddTimerToSound: MockInstance;

  const pausableTimeout1 = new PausableTimeout(() => {}, 5500);
  const pausableInterval1 = new PausableInterval(() => {}, 5500);
  const frameAnimation = 75;

  beforeEach(() => {
    // Antes de cada test creamos un sonido completamente nuevo (testSound) y lo metemos en la SoundStore.
    fakeHowlInstance = new Howl({
      src: [goodSrc],
      preload: false,
      html5: false,
    });
    fakePausebleTimeout = new PausableTimeout(() => {}, 1000);
    fakePausableInterval = new PausableInterval(() => {}, 1000);

    testSoundData = {
      instance: fakeHowlInstance as unknown as Howl,
      ids: [...fakePlayIds],
      pausableTimeoutsIds: [fakePausebleTimeout],
      pausableIntervalsIds: [fakePausableInterval],
      animationFrameIds: [fakeAnimationFrameId],
    };

    SoundStore1.audioStore[AudioEnvironment.Cinematic].sounds.testSound =
      testSoundData;

    // Dado que vamos a espiar métodos privados, debemos convertir SoundStore en "any" para que TypeScript no de error.
    spyOnStopSoundAnimationFrames = vi.spyOn(
      SoundStore1 as any,
      "stopSoundAnimationFrames"
    );
    spyOnApplySoundTimeoutsAction = vi.spyOn(
      SoundStore1 as any,
      "applySoundTimeoutsAction"
    );
    spyOnApplySoundIntervalsActions = vi.spyOn(
      SoundStore1 as any,
      "applySoundIntervalsActions"
    );
    spyOnAddTimerToSound = vi.spyOn(SoundStore1 as any, "addTimerToSound");
  });

  describe("Correctly processes the addTimeout event", () => {
    const genericModifyTimersEventWithTimer: ModifyTimersEvent = {
      eventType: "addTimeout",
      env: AudioEnvironment.Cinematic,
      category: "sounds",
      soundName: "testSound",
      timer: pausableTimeout1,
    };

    beforeEach(() => {
      //Antes de cada test emitimos un nuevo evento PlayEvent, ya que antes de cada test se está reseteando la información de testSound en la audiostore.
      modifyTimersEventEmitter.next(genericModifyTimersEventWithTimer);
    });

    it("Calls the addTimerToSound method once with the right values if the timer param is provided.", () => {
      expect(spyOnAddTimerToSound).toHaveBeenCalledExactlyOnceWith(
        genericModifyTimersEventWithTimer.env,
        genericModifyTimersEventWithTimer.category,
        genericModifyTimersEventWithTimer.soundName,
        pausableTimeout1
      );
    });

    it("Does not call addTimerToSound method if the timer param is not provided.", () => {
      const genericModifyTimersEventWithoutTimer: ModifyTimersEvent = {
        eventType: "addTimeout",
        env: AudioEnvironment.Cinematic,
        category: "sounds",
        soundName: "testSound",
      };

      modifyTimersEventEmitter.next(genericModifyTimersEventWithoutTimer);
      expect(spyOnAddTimerToSound).toHaveBeenCalledOnce();
    });
  });

  describe("Correctly processes the addInterval event", () => {
    const genericModifyTimersEventWithTimer: ModifyTimersEvent = {
      eventType: "addInterval",
      env: AudioEnvironment.Cinematic,
      category: "sounds",
      soundName: "testSound",
      timer: pausableInterval1,
    };

    beforeEach(() => {
      //Antes de cada test emitimos un nuevo evento PlayEvent, ya que antes de cada test se está reseteando la información de testSound en la audiostore.
      modifyTimersEventEmitter.next(genericModifyTimersEventWithTimer);
    });

    it("Calls the addTimerToSound method once with the right values if the timer param is provided.", () => {
      expect(spyOnAddTimerToSound).toHaveBeenCalledExactlyOnceWith(
        genericModifyTimersEventWithTimer.env,
        genericModifyTimersEventWithTimer.category,
        genericModifyTimersEventWithTimer.soundName,
        pausableInterval1
      );
    });

    it("Does not call addTimerToSound method if the timer param is not provided.", () => {
      const genericModifyTimersEventWithoutTimer: ModifyTimersEvent = {
        eventType: "addInterval",
        env: AudioEnvironment.Cinematic,
        category: "sounds",
        soundName: "testSound",
      };

      modifyTimersEventEmitter.next(genericModifyTimersEventWithoutTimer);
      expect(spyOnAddTimerToSound).toHaveBeenCalledOnce();
    });
  });

  describe("Correctly processes the addAnimationFrame event", () => {
    const genericModifyTimersEventWithTimer: ModifyTimersEvent = {
      eventType: "addAnimationFrame",
      env: AudioEnvironment.Cinematic,
      category: "sounds",
      soundName: "testSound",
      timer: frameAnimation,
    };

    beforeEach(() => {
      //Antes de cada test emitimos un nuevo evento PlayEvent, ya que antes de cada test se está reseteando la información de testSound en la audiostore.
      modifyTimersEventEmitter.next(genericModifyTimersEventWithTimer);
    });

    it("Calls the addTimerToSound method once with the right values if the timer param is provided.", () => {
      expect(spyOnAddTimerToSound).toHaveBeenCalledExactlyOnceWith(
        genericModifyTimersEventWithTimer.env,
        genericModifyTimersEventWithTimer.category,
        genericModifyTimersEventWithTimer.soundName,
        frameAnimation
      );
    });

    it("Does not call addTimerToSound method if the timer param is not provided.", () => {
      const genericModifyTimersEventWithoutTimer: ModifyTimersEvent = {
        eventType: "addAnimationFrame",
        env: AudioEnvironment.Cinematic,
        category: "sounds",
        soundName: "testSound",
      };

      modifyTimersEventEmitter.next(genericModifyTimersEventWithoutTimer);
      expect(spyOnAddTimerToSound).toHaveBeenCalledOnce();
    });
  });

  describe("Correctly processes the deleteTimeout event", () => {
    const genericModifyTimersEventWithoutTimer: ModifyTimersEvent = {
      eventType: "deleteTimeout",
      env: AudioEnvironment.Cinematic,
      category: "sounds",
      soundName: "testSound",
    };

    beforeEach(() => {
      //Antes de cada test emitimos un nuevo evento PlayEvent, ya que antes de cada test se está reseteando la información de testSound en la audiostore.
      modifyTimersEventEmitter.next(genericModifyTimersEventWithoutTimer);
    });

    it("Calls the applySoundTimeoutsAction method once with the right values.", () => {
      expect(spyOnApplySoundTimeoutsAction).toHaveBeenCalledExactlyOnceWith(
        "clear",
        genericModifyTimersEventWithoutTimer.env,
        genericModifyTimersEventWithoutTimer.category,
        genericModifyTimersEventWithoutTimer.soundName
      );
    });
  });

  describe("Correctly processes the deleteTimeout event", () => {
    const genericModifyTimersEventWithoutTimer: ModifyTimersEvent = {
      eventType: "deleteTimeout",
      env: AudioEnvironment.Cinematic,
      category: "sounds",
      soundName: "testSound",
    };

    beforeEach(() => {
      //Antes de cada test emitimos un nuevo evento PlayEvent, ya que antes de cada test se está reseteando la información de testSound en la audiostore.
      modifyTimersEventEmitter.next(genericModifyTimersEventWithoutTimer);
    });

    it("Calls the applySoundTimeoutsAction method once with the right values.", () => {
      expect(spyOnApplySoundTimeoutsAction).toHaveBeenCalledExactlyOnceWith(
        "clear",
        genericModifyTimersEventWithoutTimer.env,
        genericModifyTimersEventWithoutTimer.category,
        genericModifyTimersEventWithoutTimer.soundName
      );
    });
  });

  describe("Correctly processes the deleteInterval event", () => {
    const genericModifyTimersEventWithoutTimer: ModifyTimersEvent = {
      eventType: "deleteInterval",
      env: AudioEnvironment.Cinematic,
      category: "sounds",
      soundName: "testSound",
    };

    beforeEach(() => {
      //Antes de cada test emitimos un nuevo evento PlayEvent, ya que antes de cada test se está reseteando la información de testSound en la audiostore.
      modifyTimersEventEmitter.next(genericModifyTimersEventWithoutTimer);
    });

    it("Calls the applySoundIntervalsActions method once with the right values.", () => {
      expect(spyOnApplySoundIntervalsActions).toHaveBeenCalledExactlyOnceWith(
        "clear",
        genericModifyTimersEventWithoutTimer.env,
        genericModifyTimersEventWithoutTimer.category,
        genericModifyTimersEventWithoutTimer.soundName
      );
    });
  });

  describe("Correctly processes the deleteAnimationFrame event", () => {
    const genericModifyTimersEventWithoutTimer: ModifyTimersEvent = {
      eventType: "deleteAnimationFrame",
      env: AudioEnvironment.Cinematic,
      category: "sounds",
      soundName: "testSound",
    };

    beforeEach(() => {
      //Antes de cada test emitimos un nuevo evento PlayEvent, ya que antes de cada test se está reseteando la información de testSound en la audiostore.
      modifyTimersEventEmitter.next(genericModifyTimersEventWithoutTimer);
    });

    it("Calls the stopSoundAnimationFrames method once with the right values.", () => {
      expect(spyOnStopSoundAnimationFrames).toHaveBeenCalledExactlyOnceWith(
        genericModifyTimersEventWithoutTimer.env,
        genericModifyTimersEventWithoutTimer.category,
        genericModifyTimersEventWithoutTimer.soundName
      );
    });
  });
});
