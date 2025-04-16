// Configuration for the test environment
vi.mock("howler");

import { SoundStore1 } from "../../../../classes/sound/singletons";
import { HowlMock } from "../../../../../__mocks__/howler";
import { Howl } from "../../../../../__mocks__/howler";
import { AudioEnvironment } from "../../../../classes/sound/soundTypes";
import { HowlOptions } from "howler";
import { SoundStorePrivate } from "./soundStoreTestTypes";

const goodSrc = "./rutaCorrecta";
const wrongSrc = "./rutaFalsa";

let genericConfigNoPreload: HowlOptions;
let genericConfigHtml5: HowlOptions;
let howlMockSound: HowlMock;

const spyOnCreateHowlInstance = vi.spyOn(
  SoundStore1 as unknown as SoundStorePrivate,
  "createHowlInstance"
);
const spyOnCreateAudioStoreEntry = vi.spyOn(
  SoundStore1 as unknown as SoundStorePrivate,
  "createAudioStoreEntry"
);
const spyOnpendingInstancesSet = vi.spyOn(
  (SoundStore1 as unknown as SoundStorePrivate).pendingInstances,
  "set"
);

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

////////////////////////////////////////////////////////////////////// Test Cases

beforeEach(() => {
  vi.clearAllMocks();
  resetAudioStore();

  genericConfigNoPreload = {
    volume: 0.8,
    rate: 1.1,
    src: [goodSrc],
    preload: false,
    html5: false,
  };

  genericConfigHtml5 = {
    volume: 0.8,
    rate: 1.1,
    src: [goodSrc],
    preload: false,
    html5: true,
  };

  howlMockSound = new Howl(genericConfigNoPreload);
});

afterAll(() => {
  resetAudioStore();
});

describe("The createHowlInstance method works as expected", () => {
  it("Returns an instance of the Howl mock when the src is valid.", () => {
    const howlInstance = (
      SoundStore1 as unknown as SoundStorePrivate
    ).createHowlInstance("testInstance", genericConfigNoPreload);

    //getOptions is a property of the Howl mock that does not exist in the real Howl
    expect(howlInstance).toHaveProperty("getOptions");
  });

  it("Adds an onloaderror event to the instance, which calls the handleLoadError method when the src is incorrect.", () => {
    genericConfigNoPreload.src = [wrongSrc];
    const spyOnHandleLoadError = vi.spyOn(
      SoundStore1 as unknown as SoundStorePrivate,
      "handleLoadError"
    );

    const howlInstance = (
      SoundStore1 as unknown as SoundStorePrivate
    ).createHowlInstance("testInstance", genericConfigNoPreload);

    expect(howlInstance).toHaveProperty("getOptions");
    expect(spyOnHandleLoadError).toHaveBeenCalledTimes(1);
  });
});

describe("The createAudioStoreEntry method works as expected", () => {
  beforeEach(() => {
    (SoundStore1 as any).createAudioStoreEntry(
      AudioEnvironment.Map,
      "music",
      "testEntry",
      howlMockSound
    );
  });

  it("Creates a HowlInstance at the correct path within audiostore.", () => {
    expect(SoundStore1.audioStore.map.music).toHaveProperty("testEntry");
  });

  it("Creates a HowlInstance with all the necessary properties (instance, ids, pausableTimeoutsIds, pausableIntervalsIds and animationFrameIds) and its value is correct.", () => {
    const soundData = SoundStore1.audioStore.map.music.testEntry;
    expect(soundData).toHaveProperty("instance.getOptions");
    expect(soundData).toHaveProperty("ids", []);
    expect(soundData).toHaveProperty("pausableTimeoutsIds", []);
    expect(soundData).toHaveProperty("pausableIntervalsIds", []);
    expect(soundData).toHaveProperty("animationFrameIds", []);
  });
});

describe("The createInterfaceSoundInstance method works as expected", () => {
  beforeEach(() => {
    (SoundStore1 as any).createInterfaceSoundInstance(
      "interfaceTestSound",
      goodSrc,
      genericConfigHtml5
    );
  });

  it("Creates a HowlInstance at the correct path within audiostore (interfacePreloaded.sounds).", () => {
    expect(
      SoundStore1.audioStore[AudioEnvironment.InterfacePreloaded].sounds
    ).toHaveProperty("interfaceTestSound");
  });

  it("Does not overwrite a HowlInstance if one with the same name already exists => It does not call the createHowlInstance or createAudioStoreEntry methods.", () => {
    vi.clearAllMocks();

    (SoundStore1 as any).createInterfaceSoundInstance(
      "interfaceTestSound",
      goodSrc,
      genericConfigHtml5
    );

    expect(spyOnCreateHowlInstance).not.toBeCalled();
    expect(spyOnCreateAudioStoreEntry).not.toBeCalled();
  });

  it("Creates the instance overwriting incorrect configuration => preload must be true, html5 must be false", () => {
    const configData = (
      SoundStore1.audioStore.interfacePreloaded.sounds.interfaceTestSound
        .instance as any as HowlMock
    ).getOptions();

    expect(configData.preload).toBe(true);
    expect(configData.html5).toBe(false);
  });

  it("Creates the instance applying the correct volume and rate settings.", () => {
    const configData = (
      SoundStore1.audioStore.interfacePreloaded.sounds.interfaceTestSound
        .instance as any as HowlMock
    ).getOptions();

    expect(configData.volume).toBe(genericConfigHtml5.volume);
    expect(configData.rate).toBe(genericConfigHtml5.rate);
  });
});

describe("The createSoundInstance method works as expected", () => {
  let newInstance: boolean;

  beforeEach(async () => {
    newInstance = await SoundStore1.createSoundInstance(
      AudioEnvironment.Minigame,
      "soundscapes",
      "testSound",
      goodSrc,
      false,
      genericConfigHtml5
    );
  });

  it("Returns true and does not create a new instance when one with the same name exists.", async () => {
    vi.clearAllMocks();

    newInstance = await SoundStore1.createSoundInstance(
      AudioEnvironment.Minigame,
      "soundscapes",
      "testSound",
      goodSrc,
      false,
      genericConfigHtml5
    );

    expect(newInstance).toBe(true);
    //Comprobamos que no se ha creado ninguna nueva promesa de creación de instancias:
    expect(spyOnpendingInstancesSet).not.toHaveBeenCalled();
  });

  it("Removes the promise from the promise map when the instance is created.", () => {
    const promieStillExists: boolean = (
      SoundStore1 as any
    ).pendingInstances.has("minigame-soundscapes-testSound");
    expect(promieStillExists).toBe(false);
  });

  it("Removes the promise from the promise map when the instance is not created.", async () => {
    newInstance = await SoundStore1.createSoundInstance(
      AudioEnvironment.Minigame,
      "soundscapes",
      "anotherTestSound",
      wrongSrc,
      false,
      genericConfigHtml5
    );

    expect(newInstance).toBe(false);
    const promieStillExists: boolean = (
      SoundStore1 as any
    ).pendingInstances.has("minigame-soundscapes-testSound");

    expect(promieStillExists).toBe(false);
  });

  it("Does not generate a race condition when quickly requesting the creation of 2 instances with the same name => only one promise is created", async () => {
    vi.clearAllMocks();
    const promise1 = await SoundStore1.createSoundInstance(
      AudioEnvironment.Minigame,
      "soundscapes",
      "testSound2",
      goodSrc,
      false,
      genericConfigHtml5
    );

    const promise2 = await SoundStore1.createSoundInstance(
      AudioEnvironment.Minigame,
      "soundscapes",
      "testSound2",
      goodSrc,
      false,
      genericConfigHtml5
    );

    const [result1, result2] = await Promise.all([promise1, promise2]);

    expect(spyOnpendingInstancesSet).toHaveBeenCalledTimes(1);
    expect(result1).toBe(true);
    expect(result2).toBe(true);
  });

  it("Assign the correct settings to volume and rate.", () => {
    const configData = (
      SoundStore1.audioStore.minigame.soundscapes.testSound
        .instance as any as HowlMock
    ).getOptions();
    expect(configData.volume).toBe(genericConfigHtml5.volume);
    expect(configData.rate).toBe(genericConfigHtml5.rate);
  });

  it("Overwrites the instance config and sets html5 to 'false'.", () => {
    const configData = (
      SoundStore1.audioStore.minigame.soundscapes.testSound
        .instance as any as HowlMock
    ).getOptions();
    expect(configData.html5).toBe(false);
  });

  it("Set preload = true when SoundCategory = soundscapes", () => {
    const configData = (
      SoundStore1.audioStore.minigame.soundscapes.testSound
        .instance as any as HowlMock
    ).getOptions();
    expect(configData.preload).toBe(true);
  });

  it("Set preload = metadata when SoundCategory != soundscapes and the user wants preload to be 'false'", async () => {
    await SoundStore1.createSoundInstance(
      AudioEnvironment.Minigame,
      "sounds",
      "testSound3",
      goodSrc,
      false,
      genericConfigHtml5
    );

    const configData = (
      SoundStore1.audioStore.minigame.sounds.testSound3
        .instance as any as HowlMock
    ).getOptions();

    expect(configData.preload).toBe("metadata");
  });
});

describe("The unloadInstance method works as expected", async () => {
  let fakeNormalHowlInstance: HowlMock;
  let fakeInterfaceHowlInstance: HowlMock;

  beforeEach(() => {
    const fakePlayIds = [2750, 2751];

    fakeNormalHowlInstance = new Howl({
      src: [goodSrc],
      preload: false,
      html5: false,
    });

    fakeInterfaceHowlInstance = new Howl({
      src: [goodSrc],
      preload: false,
      html5: false,
    });

    const normalSoundData = {
      instance: fakeNormalHowlInstance as unknown as Howl,
      ids: [...fakePlayIds],
      pausableTimeoutsIds: [],
      pausableIntervalsIds: [],
      animationFrameIds: [],
    };

    const interfaceSoundData = {
      instance: fakeInterfaceHowlInstance as unknown as Howl,
      ids: [],
      pausableTimeoutsIds: [],
      pausableIntervalsIds: [],
      animationFrameIds: [],
    };

    SoundStore1.audioStore[AudioEnvironment.Cinematic].sounds.normalSound =
      normalSoundData;

    SoundStore1.audioStore[
      AudioEnvironment.InterfacePreloaded
    ].sounds.interfaceSound = interfaceSoundData;
  });

  it("Does not call the unload method of the instance or remove it from the audiostore if there are still pending plays (the instance has play ids)", () => {
    (SoundStore1 as any).unloadInstance(
      AudioEnvironment.Cinematic,
      "sounds",
      "normalSound"
    );

    expect(fakeNormalHowlInstance.unload).not.toBeCalled();
    expect(SoundStore1.audioStore.cinematic.sounds).toHaveProperty(
      "normalSound"
    );
  });

  it("Does not call the unload method of the instance or remove it from the audiostore if the sound environment is 'interfacePreloaded'", () => {
    (SoundStore1 as any).unloadInstance(
      AudioEnvironment.InterfacePreloaded,
      "sounds",
      "interfaceSound"
    );

    expect(fakeInterfaceHowlInstance.unload).not.toBeCalled();
    expect(SoundStore1.audioStore.interfacePreloaded.sounds).toHaveProperty(
      "interfaceSound"
    );
  });

  it("Calls the unload method of the instance and remove it from the audiostore if the sound environment is != 'interfacePreloaded' and the instance has no play ids", () => {
    SoundStore1.audioStore.cinematic.sounds.normalSound.ids = [];

    (SoundStore1 as any).unloadInstance(
      AudioEnvironment.Cinematic,
      "sounds",
      "normalSound"
    );

    expect(fakeNormalHowlInstance.unload).toBeCalled();
    expect(SoundStore1.audioStore.cinematic.sounds).not.toHaveProperty(
      "normalSound"
    );
  });
});
