import { Subject } from "rxjs";
import { MockInstance } from "vitest";

import {
  AudioEnvironment,
  HowlInstance,
  PlayEvent,
} from "../../../../classes/sound/soundTypes";

// Configuration for the test environment
vi.mock("howler");

import { SoundStore1 } from "../../../../classes/sound/singletons";
import { HowlMock } from "../../../../../__mocks__/howler";
import { Howl } from "../../../../../__mocks__/howler";
import { PausableTimeout } from "../../../../utils/PausableTimeout";
import { PausableInterval } from "../../../../utils/PausableInterval";
import { SoundStorePrivate } from "./soundStoreTestTypes";

const playEventEmitter = new Subject<PlayEvent>();
playEventEmitter.subscribe(SoundStore1.playEventReceiver);

const goodSrc = "./rutaCorrecta";

////////////////////////////////////////////////////////////////////// Test Cases
beforeEach(() => {
  vi.mocked(Howl).mockClear();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("PlayEvent type events are received and processed correctly", () => {
  // Variables disponibles para todos los tests.
  const fakePlayIds = [2750, 2751];
  const fakeAnimationFrameId = 50;
  let fakeHowlInstance: HowlMock;
  let fakePausebleTimeout: PausableTimeout;
  let fakePausableInterval: PausableInterval;
  let testSoundData: HowlInstance;
  let soundData: HowlInstance;
  let spyOnStopSoundAnimationFrames: MockInstance;
  let spyOnApplySoundTimeoutsAction: MockInstance;
  let spyOnApplySoundIntervalsActions: MockInstance;
  let spyOnDeletePlayingId: MockInstance;
  let spyOnUnloadInstance: MockInstance;

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

    soundData =
      SoundStore1.audioStore[AudioEnvironment.Cinematic].sounds.testSound;

    // Dado que vamos a espiar métodos privados, debemos convertir SoundStore en "any" para que TypeScript no de error.
    spyOnStopSoundAnimationFrames = vi.spyOn(
      SoundStore1 as unknown as SoundStorePrivate,
      "stopSoundAnimationFrames"
    );
    spyOnApplySoundTimeoutsAction = vi.spyOn(
      SoundStore1 as unknown as SoundStorePrivate,
      "applySoundTimeoutsAction"
    );
    spyOnApplySoundIntervalsActions = vi.spyOn(
      SoundStore1 as unknown as SoundStorePrivate,
      "applySoundIntervalsActions"
    );
    spyOnDeletePlayingId = vi.spyOn(
      SoundStore1 as unknown as SoundStorePrivate,
      "deletePlayingId"
    );
    spyOnUnloadInstance = vi.spyOn(
      SoundStore1 as unknown as SoundStorePrivate,
      "unloadInstance"
    );
  });

  describe("Correctly processes the autoEnd event", () => {
    const genericPlayEventWithId: PlayEvent = {
      eventType: "autoEnd",
      env: AudioEnvironment.Cinematic,
      category: "sounds",
      soundName: "testSound",
      id: fakePlayIds[1],
    };

    beforeEach(() => {
      //Antes de cada test emitimos un nuevo evento PlayEvent, ya que antes de cada test se está reseteando la información de testSound en la audiostore.
      playEventEmitter.next(genericPlayEventWithId);
    });

    it("Calls the stopSoundAnimationFrames method once with the right values.", () => {
      expect(spyOnStopSoundAnimationFrames).toHaveBeenCalledExactlyOnceWith(
        genericPlayEventWithId.env,
        genericPlayEventWithId.category,
        genericPlayEventWithId.soundName
      );
    });

    it("Calls the applySoundTimeoutsAction method.", () => {
      expect(spyOnApplySoundTimeoutsAction).toHaveBeenCalledExactlyOnceWith(
        "clear",
        genericPlayEventWithId.env,
        genericPlayEventWithId.category,
        genericPlayEventWithId.soundName
      );
    });

    it("Calls the applySoundIntervalsActions method.", () => {
      expect(spyOnApplySoundIntervalsActions).toHaveBeenCalledExactlyOnceWith(
        "clear",
        genericPlayEventWithId.env,
        genericPlayEventWithId.category,
        genericPlayEventWithId.soundName
      );
    });

    it("Calls the deletePlayingId method when an id is sent.", () => {
      expect(spyOnDeletePlayingId).toHaveBeenCalledExactlyOnceWith(
        genericPlayEventWithId.env,
        genericPlayEventWithId.category,
        genericPlayEventWithId.soundName,
        genericPlayEventWithId.id
      );
    });

    it("Does not call the deletePlayingId method if there is no id.", () => {
      const genericPlayEventWithoutId: PlayEvent = {
        eventType: "autoEnd",
        env: AudioEnvironment.Cinematic,
        category: "sounds",
        soundName: "testSound",
      };

      playEventEmitter.next(genericPlayEventWithoutId);
      // El método ya ha sido llamado una vez por la emisión que se produce en el beforeEach definido en el "describre" de esta sección.
      // Sólo nos aseguramos de que no sea llamado una segunda.
      expect(spyOnDeletePlayingId).toHaveBeenCalledOnce();
    });

    it("Calls the unloadInstance method.", () => {
      expect(spyOnUnloadInstance).toHaveBeenCalledExactlyOnceWith(
        genericPlayEventWithId.env,
        genericPlayEventWithId.category,
        genericPlayEventWithId.soundName
      );
    });
  });

  describe("Correctly processes the autoEndSoundscape event", () => {
    const genericPlayEventWithoutId: PlayEvent = {
      eventType: "autoEndSoundscape",
      env: AudioEnvironment.Cinematic,
      category: "sounds",
      soundName: "testSound",
    };

    beforeEach(() => {
      playEventEmitter.next(genericPlayEventWithoutId);
    });

    it("Does not call the deletePlayingId method if there is no id.", () => {
      expect(spyOnDeletePlayingId).not.toHaveBeenCalledOnce();
    });

    it("Calls the deletePlayingId method when an id is sent.", () => {
      const genericPlayEventWithId: PlayEvent = {
        eventType: "autoEndSoundscape",
        env: AudioEnvironment.Cinematic,
        category: "sounds",
        soundName: "testSound",
        id: fakePlayIds[0],
      };

      playEventEmitter.next(genericPlayEventWithId);
      expect(spyOnDeletePlayingId).toHaveBeenCalledExactlyOnceWith(
        genericPlayEventWithId.env,
        genericPlayEventWithId.category,
        genericPlayEventWithId.soundName,
        genericPlayEventWithId.id
      );
    });

    it("Does not call the stopSoundAnimationFrames, applySoundTimeoutsAction, applySoundIntervalsActions and unloadInstance methods. ", () => {
      expect(spyOnStopSoundAnimationFrames).not.toHaveBeenCalledOnce();
      expect(spyOnApplySoundTimeoutsAction).not.toHaveBeenCalledOnce();
      expect(spyOnApplySoundIntervalsActions).not.toHaveBeenCalledOnce();
      expect(spyOnUnloadInstance).not.toHaveBeenCalledOnce();
    });
  });

  describe("Correctly processes the stop event", () => {
    const genericPlayEventWithoutId: PlayEvent = {
      eventType: "stop",
      env: AudioEnvironment.Cinematic,
      category: "sounds",
      soundName: "testSound",
    };

    beforeEach(() => {
      playEventEmitter.next(genericPlayEventWithoutId);
    });

    it("Calls the stopSoundAnimationFrames method once with the right values.", () => {
      expect(spyOnStopSoundAnimationFrames).toHaveBeenCalledExactlyOnceWith(
        genericPlayEventWithoutId.env,
        genericPlayEventWithoutId.category,
        genericPlayEventWithoutId.soundName
      );
    });

    it("Calls the applySoundTimeoutsAction method.", () => {
      expect(spyOnApplySoundTimeoutsAction).toHaveBeenCalledExactlyOnceWith(
        "clear",
        genericPlayEventWithoutId.env,
        genericPlayEventWithoutId.category,
        genericPlayEventWithoutId.soundName
      );
    });

    it("Calls the applySoundIntervalsActions method.", () => {
      expect(spyOnApplySoundIntervalsActions).toHaveBeenCalledExactlyOnceWith(
        "clear",
        genericPlayEventWithoutId.env,
        genericPlayEventWithoutId.category,
        genericPlayEventWithoutId.soundName
      );
    });

    it("Deletes all sound play id´s.", () => {
      console.log(SoundStore1.audioStore.cinematic.sounds);
      expect(soundData.ids.length).toBe(0);
    });

    it("Calls the unloadInstance method.", () => {
      expect(spyOnUnloadInstance).toHaveBeenCalledExactlyOnceWith(
        genericPlayEventWithoutId.env,
        genericPlayEventWithoutId.category,
        genericPlayEventWithoutId.soundName
      );
    });
  });

  describe("Correctly processes the stopId event", () => {
    const genericPlayEventWithoutId: PlayEvent = {
      eventType: "stopId",
      env: AudioEnvironment.Cinematic,
      category: "sounds",
      soundName: "testSound",
    };

    beforeEach(() => {
      playEventEmitter.next(genericPlayEventWithoutId);
    });

    it("Does not call the deletePlayingId method if there is no id.", () => {
      expect(spyOnDeletePlayingId).not.toHaveBeenCalledOnce();
    });

    it("Calls the deletePlayingId method when an id is sent.", () => {
      const genericPlayEventWithId: PlayEvent = {
        eventType: "stopId",
        env: AudioEnvironment.Cinematic,
        category: "sounds",
        soundName: "testSound",
        id: fakePlayIds[0],
      };

      playEventEmitter.next(genericPlayEventWithId);

      expect(spyOnDeletePlayingId).toHaveBeenCalledExactlyOnceWith(
        genericPlayEventWithId.env,
        genericPlayEventWithId.category,
        genericPlayEventWithId.soundName,
        genericPlayEventWithId.id
      );
    });

    it("Calls the unloadInstance method.", () => {
      expect(spyOnUnloadInstance).toHaveBeenCalledExactlyOnceWith(
        genericPlayEventWithoutId.env,
        genericPlayEventWithoutId.category,
        genericPlayEventWithoutId.soundName
      );
    });

    it("Does not call the stopSoundAnimationFrames, applySoundTimeoutsAction and applySoundIntervalsActions methods. ", () => {
      expect(spyOnStopSoundAnimationFrames).not.toHaveBeenCalledOnce();
      expect(spyOnApplySoundTimeoutsAction).not.toHaveBeenCalledOnce();
      expect(spyOnApplySoundIntervalsActions).not.toHaveBeenCalledOnce();
    });
  });

  describe("Correctly processes the pause event", () => {
    const genericPlayEventWithoutId: PlayEvent = {
      eventType: "pause",
      env: AudioEnvironment.Cinematic,
      category: "sounds",
      soundName: "testSound",
    };

    beforeEach(() => {
      playEventEmitter.next(genericPlayEventWithoutId);
    });

    it("Calls the applySoundTimeoutsAction method.", () => {
      expect(spyOnApplySoundTimeoutsAction).toHaveBeenCalledExactlyOnceWith(
        "pause",
        genericPlayEventWithoutId.env,
        genericPlayEventWithoutId.category,
        genericPlayEventWithoutId.soundName
      );
    });

    it("Calls the applySoundIntervalsActions method.", () => {
      expect(spyOnApplySoundIntervalsActions).toHaveBeenCalledExactlyOnceWith(
        "pause",
        genericPlayEventWithoutId.env,
        genericPlayEventWithoutId.category,
        genericPlayEventWithoutId.soundName
      );
    });
  });

  describe("Correctly processes the resume event", () => {
    const genericPlayEventWithoutId: PlayEvent = {
      eventType: "resume",
      env: AudioEnvironment.Cinematic,
      category: "sounds",
      soundName: "testSound",
    };

    beforeEach(() => {
      playEventEmitter.next(genericPlayEventWithoutId);
    });

    it("Calls the applySoundTimeoutsAction method.", () => {
      expect(spyOnApplySoundTimeoutsAction).toHaveBeenCalledExactlyOnceWith(
        "resume",
        genericPlayEventWithoutId.env,
        genericPlayEventWithoutId.category,
        genericPlayEventWithoutId.soundName
      );
    });

    it("Calls the applySoundIntervalsActions method.", () => {
      expect(spyOnApplySoundIntervalsActions).toHaveBeenCalledExactlyOnceWith(
        "resume",
        genericPlayEventWithoutId.env,
        genericPlayEventWithoutId.category,
        genericPlayEventWithoutId.soundName
      );
    });
  });
});
