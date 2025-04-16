import { HowlOptions } from "howler";
import { Mock } from "vitest";

export type HowlMock = {
  src: string | string[];
  play: Mock;
  pause: Mock;
  stop: Mock;
  getOptions: () => HowlOptions;
  on: Mock<(event: string, handler: () => void) => void>;
  once: Mock<(event: string, handler: () => void) => void>;
  load: Mock<() => void>;
  unload: Mock<() => void>;
};

export const Howl = vi.fn((config: HowlOptions): HowlMock => {
  // Almacena los handlers de eventos
  const onEventHandlers: {
    load: Array<() => void>;
    loaderror: Array<() => void>;
  } = { load: [], loaderror: [] };

  const onceEventHandlers: {
    load: Array<() => void>;
    loaderror: Array<() => void>;
  } = { load: [], loaderror: [] };

  if (config.onloaderror && config.src.includes("./rutaFalsa")) {
    const onloadErrorCallback = config.onloaderror;
    onloadErrorCallback(57, "generic error");
  }

  return {
    src: config.src ? config.src : "",
    play: vi.fn(),
    pause: vi.fn(),
    stop: vi.fn(),
    getOptions: vi.fn(() => config),
    on: vi.fn((event: "load" | "loaderror", handler: () => void) => {
      onEventHandlers[event].push(handler);

      const timer1 = setTimeout(() => {
        if (event === "load" && config.src.includes("./rutaCorrecta")) {
          onEventHandlers.load.forEach((handler) => handler());
          clearTimeout(timer1);
        } else if (
          event === "loaderror" &&
          config.src.includes("./rutaFalsa")
        ) {
          onEventHandlers.loaderror.forEach((handler) => handler());
          clearTimeout(timer1);
        }
      }, 50);
    }),
    once: vi.fn((event: "load" | "loaderror", handler: () => void) => {
      onceEventHandlers[event].push(handler);

      const timer2 = setTimeout(() => {
        if (event === "load" && config.src.includes("./rutaCorrecta")) {
          onceEventHandlers.load.forEach((handler) => handler());
          clearTimeout(timer2);
        } else if (
          event === "loaderror" &&
          config.src.includes("./rutaFalsa")
        ) {
          onceEventHandlers.loaderror.forEach((handler) => handler());
          clearTimeout(timer2);
        }
      }, 50);
    }),
    load: vi.fn(() => {
      const timer3 = setTimeout(() => {
        if (config.src.includes("./rutaCorrecta")) {
          onEventHandlers.load.forEach((handler) => handler());
          onceEventHandlers.load.forEach((handler) => handler());
          clearTimeout(timer3);
        } else if (config.src.includes("./rutaFalsa")) {
          onEventHandlers.loaderror.forEach((handler) => handler());
          onceEventHandlers.loaderror.forEach((handler) => handler());
          clearTimeout(timer3);
        }
      }, 100);
    }),
    unload: vi.fn(),
  };
});
