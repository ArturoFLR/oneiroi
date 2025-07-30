import { useEffect } from "react";
import ModalOneButton from "./common/modals/ModalOneButton";
import { SoundDirectorAPI1 } from "../classes/sound/singletons";
import MainMenu from "./mainMenu/MainMenu";
import { useAppDispatch, useAppSelector } from "../store/hooks/reduxHooks";
import { setMainState } from "../store/slices/mainStateSlice";
import CinematicDirector from "./cinematics/CinematicDirector";
import { cinematicsMap } from "../data/cinematics/cinematicsMap";
import AIChat from "./aiChat/AIChat";

function GameDirector() {
  //Redux
  const gameMainState = useAppSelector(
    (state) => state.mainState.gameMainState
  );
  const cinematicToPlayName = useAppSelector(
    (state) => state.cinematicData.cinematicToPlayName
  );
  const dispatch = useAppDispatch();
  //Redux Fin

  // Convertimos el nombre de la cinemática a reproducir a la variable que la contiene:
  const cinematicToPlayData = cinematicsMap[cinematicToPlayName];

  function initAudio() {
    SoundDirectorAPI1.initAudio();
    dispatch(setMainState("mainMenu"));
  }

  type FullscreenElement = HTMLElement & {
    webkitRequestFullscreen?: () => Promise<void>;
    msRequestFullscreen?: () => void;
  };

  function goFullscreen() {
    const element = document.documentElement as FullscreenElement;

    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  }

  function handleInitGameClick() {
    initAudio();
    goFullscreen();
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
            onClick={handleInitGameClick}
            screenDarkenerColor="black"
          />
        </>
      )}

      {gameMainState === "mainMenu" && <MainMenu />}

      {gameMainState === "cinematic" && (
        <CinematicDirector mode="black" cinematicData={cinematicToPlayData} />
      )}

      {gameMainState === "aiChat" && <AIChat />}
    </>
  );
}

export default GameDirector;
