// Configuration for the test environment
vi.mock("howler");

import { HowlMock } from "../../../../../__mocks__/howler";
import { Howl } from "../../../../../__mocks__/howler";
import { SoundStore1 } from "../../../../classes/sound/singletons";
import SoundStore from "../../../../classes/sound/SoundStore";
import { AudioEnvironment } from "../../../../classes/sound/soundTypes";

const goodSrc = "./rutaCorrecta";
const wrongSrc = "./rutaFalsa";

////////////////////////////////////////////////////////////////////// Test Cases
beforeEach(() => {
  vi.mocked(Howl).mockClear();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("Mock Test", () => {
  afterEach(() => (SoundStore1.audioStore.cinematic.sounds = {}));

  it("Howl mock is being used and returns a valid object when scr ir correct", async () => {
    const promise = SoundStore1.createSoundInstance(
      AudioEnvironment.Cinematic,
      "sounds",
      "mockito1",
      goodSrc,
      false
    );

    vi.advanceTimersByTime(150);

    const isCreated = await promise;
    expect(isCreated).toBe(true);

    // The getOptions() method only exists in the mocked Howl instance
    const fakeConfig = (
      SoundStore1.audioStore[AudioEnvironment.Cinematic].sounds.mockito1
        .instance as unknown as HowlMock
    ).getOptions();

    expect(fakeConfig.src[0]).toBe(goodSrc);
  });

  it("Emit loaderror event when the src is incorrect", async () => {
    const promise = SoundStore1.createSoundInstance(
      AudioEnvironment.Cinematic,
      "sounds",
      "mockito1",
      wrongSrc,
      false
    );

    vi.advanceTimersByTime(150);

    const isCreated = await promise;
    expect(isCreated).toBe(false);
  });
});

describe("The singleton pattern works correctly.", () => {
  it("getInstance always returns the same instance: ", () => {
    const newInstance1 = SoundStore.getInstance();
    const newInstance2 = SoundStore.getInstance();
    expect(newInstance1).toBe(newInstance2);
  });
});
