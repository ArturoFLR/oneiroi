import { useLayoutEffect, useRef, useState } from "react";
import MainMenuPreloader from "./MainMenuPreloader";
import MainMenuBg from "./styled/MainMenuBg";
import { SoundDirectorAPI1 } from "../../classes/sound/singletons";
import { AudioEnvironment } from "../../classes/sound/soundTypes";
import { useAppDispatch, useAppSelector } from "../../store/hooks/reduxHooks";
import { setMainState } from "../../store/slices/mainStateSlice";
import {
  isLocalStorageAvailable,
  loadFromLocalStorage,
  saveToLocalStorage,
} from "../../utils/localStorageManipulation";

import mainMenuMusic from "@assets/audio/music/crystal-oasis.mp3";
import gongSound from "@assets/audio/sounds/effects/gong/gong.mp3";
import ModalOneButton from "../common/modals/ModalOneButton";
import {
  setCinematicToPlay,
  setIsUserWatchingCinematics,
} from "../../store/slices/cinematicSlice";
import MainMenuOptions from "./styled/MainMenuOptions";
// import { SavegameData } from "../../utils/loadSaveGame/loadSaveTypes";

function MainMenu() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isStorageModalShown, setIsStorageModalShown] =
    useState<boolean>(false);
  // const [savedGamesData, setSavedGamesData] = useState<SavegameData[] | null>(
  //   null
  // );

  const isMusicPlaying = useRef<boolean>(false);

  //Redux
  const dispatch = useAppDispatch();

  const isUserWatchingCinematics = useAppSelector(
    (state) => state.cinematicData.isUserWatchingCinematics
  );
  //Redux Fin

  function handleStorageModalClick() {
    setIsStorageModalShown(false);
  }

  // Funciones para los botones de las opciones principales
  function handleNewGameClick() {
    dispatch(setIsUserWatchingCinematics(false));
    dispatch(setCinematicToPlay("alisedaPark01"));
    dispatch(setMainState("cinematic"));
  }

  function handleWatchIntroClick() {
    dispatch(setIsUserWatchingCinematics(true));
    dispatch(setCinematicToPlay("intro"));
    dispatch(setMainState("cinematic"));
  }

  //Si el usuario no ha visto la cinemática de introducción, la reproduce.
  useLayoutEffect(() => {
    if (isLocalStorageAvailable()) {
      const hasUserSeenIntro = loadFromLocalStorage("hasSeenIntro");

      if (!hasUserSeenIntro) {
        saveToLocalStorage("hasSeenIntro", true);

        dispatch(setCinematicToPlay("intro"));
        dispatch(setMainState("cinematic"));
      }
    } else {
      setIsStorageModalShown(true);
    }
  }, [dispatch]);

  //Se encarga de gestionar música y sonido en el main menu
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
    const delay = 7600; //
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
        { volume: 0.25, src: gongSound, rate: 0.8 }
      );
    }, delay);

    isMusicPlaying.current = true;

    return () => {
      SoundDirectorAPI1.stopAllSounds();
      window.clearTimeout(timer);
    };
  }, [isLoading]);

  // Se encarga de leer los datos de las partidas guardadas
  // useLayoutEffect(() => {});

  return (
    <>
      {isLoading && <MainMenuPreloader setIsLoading={setIsLoading} />}

      {!isLoading && (
        <>
          <MainMenuBg isUserWatchingCinematics={isUserWatchingCinematics}>
            <MainMenuOptions
              setIsStorageModalShown={setIsStorageModalShown}
              onWatchIntroClick={handleWatchIntroClick}
              onNewGameClick={handleNewGameClick}
            />
          </MainMenuBg>

          {isStorageModalShown && (
            <ModalOneButton
              screenDarkenerColor="dark"
              mainText="No ha sido posible usar el almacenamiento de tu navegador, por lo que algunas funciones, como cargar / salvar partida, no estarán disponibles."
              secondaryText="Asegúrate de no estar navegando en modo incógnito y de tener el 'local storage' habilitado en tu navegador."
              buttonText="Entendido"
              onClick={handleStorageModalClick}
            />
          )}
        </>
      )}
    </>
  );
}

export default MainMenu;
