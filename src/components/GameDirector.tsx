import { useEffect, useState } from "react";
import ModalOneButton from "./common/modals/ModalOneButton";
import { SoundDirectorAPI1 } from "../classes/sound/singletons";
import MainMenu from "./mainMenu/MainMenu";
import { GameMainState } from "../store/slices/mainStateSlice";

function GameDirector() {
  const [gameMainState, setGameMainState] = useState<GameMainState>("init");

  function handleAudioInitClick() {
    SoundDirectorAPI1.initAudio();
    setGameMainState("mainMenu");
  }

  useEffect(() => {
    const handleBeforeUnload = () => {
      SoundDirectorAPI1.stopAllSounds();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <>
      {gameMainState === "init" && (
        <>
          <ModalOneButton
            mainText="No borres la caché del navegador, o perderás tus partidas guardadas"
            secondaryText="Si juegas desde un móvil, te recomendamos usar auriculares"
            buttonText="Continuar"
            onClick={handleAudioInitClick}
            screenDarkenerColor="black"
          />
        </>
      )}

      {gameMainState === "mainMenu" && <MainMenu />}
    </>
  );
}

export default GameDirector;
