import { useEffect } from "react";
import ModalOneButton from "./common/modals/ModalOneButton";
import { SoundDirectorAPI1 } from "../classes/sound/singletons";
import MainMenu from "./mainMenu/MainMenu";
import { useAppDispatch, useAppSelector } from "../store/hooks/reduxHooks";
import { setMainState } from "../store/slices/mainStateSlice";

function GameDirector() {
  //Redux
  const gameMainState = useAppSelector(
    (state) => state.mainState.gameMainState
  );
  const dispatch = useAppDispatch();
  //Redux Fin

  function handleAudioInitClick() {
    SoundDirectorAPI1.initAudio();
    dispatch(setMainState("mainMenu"));
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
