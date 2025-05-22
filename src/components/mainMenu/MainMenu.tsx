import { useLayoutEffect, useRef, useState } from "react";
import MainMenuPreloader from "./MainMenuPreloader";
import MainMenuBg from "./MainMenuBg";
import { SoundDirectorAPI1 } from "../../classes/sound/singletons";
import { AudioEnvironment } from "../../classes/sound/soundTypes";

import mainMenuMusic from "@assets/audio/music/crystal-oasis.mp3";
import gongSound from "@assets/audio/sounds/effects/gong/gong.mp3";

function MainMenu() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isMusicPlaying = useRef<boolean>(false);

  useLayoutEffect(() => {
    if (isLoading) {
      SoundDirectorAPI1.stopAllSounds();
      return;
    }

    if (isMusicPlaying.current) return;

    SoundDirectorAPI1.createLoopWhithFade(
      AudioEnvironment.MainMenu,
      "music",
      "mainMenuMusic",
      mainMenuMusic,
      1000,
      5000,
      { volume: 0.8, src: mainMenuMusic }
    );

    //Reproducimos con delay el sonido de un gong, haciéndolo coincidir con la aparición del logo.
    const delay = 7900; //
    const timer = window.setTimeout(() => {
      SoundDirectorAPI1.createAnimatedPanSound(
        AudioEnvironment.MainMenu,
        "sounds",
        "gong",
        gongSound,
        -0.6,
        0.75,
        1700,
        500,
        { volume: 0.45, src: gongSound, rate: 0.9 }
      );
    }, delay);

    isMusicPlaying.current = true;

    return () => {
      SoundDirectorAPI1.stopAllSounds();
      window.clearTimeout(timer);
    };
  }, [isLoading]);

  return (
    <>
      {isLoading ? (
        <MainMenuPreloader setIsLoading={setIsLoading} />
      ) : (
        <MainMenuBg />
      )}
    </>
  );
}

export default MainMenu;
