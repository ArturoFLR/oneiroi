import React, { useEffect, useState } from "react";
import {
  activateAudio,
  changeAllStereo,
  changeCategoryRate,
  changeCategoryVolume,
  changeGeneralVolume,
  changeGlobalRate,
  changeMusicVolume,
  changePreloadedIdVolume,
  changeSoundRate,
  changeSoundStereo,
  clearCinematicEnv,
  clearCinematicMusicCat,
  clearCinematicSoundsCat,
  createDinamicPan,
  createDinamicPan2,
  createLoop1,
  createLoop2,
  createSoundscape1,
  fadeAll,
  fadeMusic,
  fadePreloadSound,
  pauseAll,
  pauseEnvironment,
  pauseInterfacelSound,
  pauseMusic,
  pauseNormalSound,
  pauseSoundscape,
  playInterfaceSound,
  playMusic,
  playNormalSound,
  playPreloadedCinematicSound,
  playPreloadedWithVolume,
  preloadCinematicSound,
  preloadInterfaceSound,
  resumeAll,
  resumeEnvironment,
  resumeInterfaceSound,
  resumeMusic,
  resumeNormalSound,
  resumeSoundscape,
  stopAllSounds,
  stopSoundscape,
} from "../../playground/sound/soundTest";
import {
  SoundscapesCreator1,
  SoundStore1,
} from "../../src/classes/sound/singletons";
import {
  AudioEnvironment,
  SoundCategory,
} from "../../src/classes/sound/soundTypes";

function SoundTesting() {
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [soundDirectorData, setSoundDirectorData] = useState(
    SoundStore1.audioStore
  );
  const [soundscapeInfo, setSoundscapeInfo] = useState(
    SoundscapesCreator1.soundscapesLibrary
  );

  function handleEnableAudio() {
    activateAudio();
    setAudioEnabled(true);
  }

  function refreshSoundDirectorData() {
    const newData = { ...SoundStore1.audioStore };
    const soundscapeData = { ...SoundscapesCreator1.soundscapesLibrary };
    setSoundDirectorData(newData);
    setSoundscapeInfo(soundscapeData);
  }

  function generateSoundscapesInfo() {
    const mainMenuSoundscapes: React.ReactElement[] = [];
    const cinematicSoundsCapes: React.ReactElement[] = [];
    const mapSounsdscapes: React.ReactElement[] = [];
    const minigameSoundsCapes: React.ReactElement[] = [];
    const interfaceSoundsCapes: React.ReactElement[] = [];

    for (const env in soundscapeInfo) {
      const environment = env as AudioEnvironment;
      const soundscapeList = [];

      for (const soundsCapeName in soundscapeInfo[environment]) {
        const soundsList: React.ReactElement[] = [];

        soundscapeInfo[environment][soundsCapeName].forEach((sound) => {
          soundsList.push(<p id={sound}>{sound}</p>);
        });
        soundscapeList.push(
          <>
            <h4>{soundsCapeName}</h4>
            {soundsList}
          </>
        );
      }
      const envInfo: React.ReactElement = <div key={env}>{soundscapeList}</div>;

      switch (environment) {
        case AudioEnvironment.MainMenu:
          mainMenuSoundscapes.push(envInfo);
          break;
        case AudioEnvironment.Cinematic:
          cinematicSoundsCapes.push(envInfo);
          break;
        case AudioEnvironment.Map:
          mapSounsdscapes.push(envInfo);
          break;
        case AudioEnvironment.Minigame:
          minigameSoundsCapes.push(envInfo);
          break;
        case AudioEnvironment.InterfacePreloaded:
          interfaceSoundsCapes.push(envInfo);
          break;
      }
    }

    return (
      <div style={{ display: "flex", flexWrap: "wrap", columnGap: "320px" }}>
        <div>
          <h3>Main Menu Soundscapes</h3>
          {mainMenuSoundscapes}
        </div>
        <div>
          <h3>Cinematic Soundscapes</h3>
          {cinematicSoundsCapes}
        </div>
        <div>
          <h3>Map Soundscapes</h3>
          {mapSounsdscapes}
        </div>
        <div>
          <h3>Minigame Soundscapes</h3>
          {minigameSoundsCapes}
        </div>
        <div>
          <h3>Interface Preloaded Soundscapes</h3>
          {interfaceSoundsCapes}
        </div>
      </div>
    );
  }

  function generateAudioStoreInfo() {
    function returnSoundsInfo(env: AudioEnvironment, category: SoundCategory) {
      const result: React.ReactElement[] = [];

      for (const soundName in soundDirectorData[env][category]) {
        result.push(
          <p
            id={`${soundName} - ${env} - ${category}`}
          >{`Sonido: ${soundName}, Id´s: ${soundDirectorData[env][category][soundName].ids}, Timeouts: ${soundDirectorData[env][category][soundName].pausableTimeoutsIds}, Intervals: ${soundDirectorData[env][category][soundName].pausableIntervalsIds}, Frame Anim: ${soundDirectorData[env][category][soundName].animationFrameIds}`}</p>
        );
      }

      return result;
    }

    return (
      <>
        <h2>Audiostore Info</h2>
        <div style={{ display: "flex", flexWrap: "wrap", columnGap: "320px" }}>
          <div>
            <h3>Main Menu:</h3>
            <div>
              <h4>Sound</h4>
              {returnSoundsInfo(AudioEnvironment.MainMenu, "sounds")}

              <h4>Music</h4>
              {returnSoundsInfo(AudioEnvironment.MainMenu, "music")}

              <h4>Soundscapes</h4>
              {returnSoundsInfo(AudioEnvironment.MainMenu, "soundscapes")}
            </div>
          </div>

          <div>
            <h3>Cinematic:</h3>
            <div>
              <h4>Sound</h4>
              {returnSoundsInfo(AudioEnvironment.Cinematic, "sounds")}

              <h4>Music</h4>
              {returnSoundsInfo(AudioEnvironment.Cinematic, "music")}

              <h4>Soundscapes</h4>
              {returnSoundsInfo(AudioEnvironment.Cinematic, "soundscapes")}
            </div>
          </div>

          <div>
            <h3>Map:</h3>
            <div>
              <h4>Sound</h4>
              {returnSoundsInfo(AudioEnvironment.Map, "sounds")}

              <h4>Music</h4>
              {returnSoundsInfo(AudioEnvironment.Map, "music")}

              <h4>Soundscapes</h4>
              {returnSoundsInfo(AudioEnvironment.Map, "soundscapes")}
            </div>
          </div>

          <div>
            <h3>Minigame:</h3>
            <div>
              <h4>Sound</h4>
              {returnSoundsInfo(AudioEnvironment.Minigame, "sounds")}

              <h4>Music</h4>
              {returnSoundsInfo(AudioEnvironment.Minigame, "music")}

              <h4>Soundscapes</h4>
              {returnSoundsInfo(AudioEnvironment.Minigame, "soundscapes")}
            </div>
          </div>

          <div>
            <h3>Interface Preloaded:</h3>
            <div>
              <h4>Sound</h4>
              {returnSoundsInfo(AudioEnvironment.InterfacePreloaded, "sounds")}

              <h4>Music</h4>
              {returnSoundsInfo(AudioEnvironment.InterfacePreloaded, "music")}

              <h4>Soundscapes</h4>
              {returnSoundsInfo(
                AudioEnvironment.InterfacePreloaded,
                "soundscapes"
              )}
            </div>
          </div>

          <div>
            <h3>Soundscapes Library:</h3>
            <div>{generateSoundscapesInfo()}</div>
          </div>
        </div>
      </>
    );
  }

  useEffect(() => {
    return () => {
      //Eliminar desde aquí las instancias de los sonidos creados por CinematicDirector cuando se desmonte (y sin afectar a las de otros módulos, que estarán en pausa)
      // clearCinematicEnv();
    };
  }, []);

  return (
    <>
      <h1>CINEMATIC DIRECTOR</h1>

      <button
        onClick={() => {
          playMusic();
          refreshSoundDirectorData();
        }}
      >
        Play Music - Cinematic Env
      </button>
      <button onClick={playNormalSound}>
        Play Normal Sound - Cinematic Env
      </button>
      <button onClick={preloadCinematicSound}>
        Preload Sound - Cinematic Env
      </button>
      <button onClick={preloadInterfaceSound}>Preload Interface Sound</button>
      <button onClick={playPreloadedCinematicSound}>
        Play Preload Sound - Cinematic Env
      </button>
      <button onClick={playInterfaceSound}>Play Interface Sound</button>

      <br></br>

      <button onClick={clearCinematicMusicCat}>Stop Cinematic - music</button>
      <button onClick={clearCinematicSoundsCat}>Stop Cinematic - sounds</button>
      <button onClick={clearCinematicEnv}>Stop Cinematic - All</button>
      <button onClick={stopAllSounds}>Stop All Sounds</button>

      <br></br>

      <button onClick={pauseMusic}>Pause Music</button>
      <button onClick={resumeMusic}>Resume Music</button>
      <button onClick={pauseNormalSound}>Pause Normal Sound</button>
      <button onClick={resumeNormalSound}>Resume Normal Sound</button>
      <button onClick={pauseInterfacelSound}>Pause Interface Sound</button>
      <button onClick={resumeInterfaceSound}>Resume Interface Sound</button>
      <button onClick={pauseEnvironment}>Pause ENV</button>
      <button onClick={resumeEnvironment}>Resume ENV</button>
      <button onClick={pauseAll}>Pause All</button>
      <button onClick={resumeAll}>Resume All</button>

      <button onClick={() => changeMusicVolume(0.1)}>
        Decrease Music Volume
      </button>
      <button onClick={() => changeMusicVolume(5.5)}>
        Increase Music Volume
      </button>
      <button onClick={() => changeCategoryVolume(0.2)}>
        Decrease Cinematic Sounds Volume
      </button>
      <button onClick={() => changeCategoryVolume(2.6)}>
        Increase Cinematic Sounds Volume
      </button>
      <button onClick={() => changePreloadedIdVolume(0.2)}>
        Decrease Last Interface Volume, id
      </button>

      <button onClick={() => changeGeneralVolume(0.4)}>
        Decrease General Volume
      </button>
      <button onClick={() => changeGeneralVolume(2.6)}>
        Increase General Volume
      </button>
      <br></br>

      <button onClick={() => playPreloadedWithVolume(1)}>
        Play new Interface sound with normal volume set
      </button>

      <br></br>
      <br></br>

      <button onClick={() => changeSoundRate(2.5)}>
        Set Preload Sound High Rate
      </button>
      <button onClick={() => changeCategoryRate(1)}>
        Set Cinematic Sounds Category Normal Rate
      </button>
      <button onClick={() => changeGlobalRate(0.7)}>
        Set Global Slow Rate
      </button>

      <br></br>
      <br></br>

      <button onClick={() => fadeMusic({ final: 0, milliseconds: 2000 })}>
        Fade-Out Music
      </button>

      <button
        onClick={() => fadePreloadSound({ final: 0, milliseconds: 2000 })}
      >
        Fade-Out Preload Sound
      </button>

      <button onClick={() => fadeAll({ final: 0, milliseconds: 2000 })}>
        Fade-Out All
      </button>

      <br></br>
      <br></br>

      <button onClick={() => changeSoundStereo(-1)}>
        Preloaded Stereo Left
      </button>

      <button onClick={() => changeSoundStereo(1)}>
        Preloaded Stereo Right
      </button>

      <button onClick={() => changeAllStereo(1)}>
        Change All Stereo Right
      </button>
      <button onClick={() => changeAllStereo(-1)}>
        Change All Stereo Left
      </button>

      <br></br>
      <br></br>

      <button onClick={() => createDinamicPan()}>
        Create Evil Dinamic Pan
      </button>

      <button onClick={() => createDinamicPan2()}>
        Create Water Dinamic Pan
      </button>

      <br></br>
      <br></br>

      <button onClick={() => createLoop1()}>Create Evil Loop</button>
      <button onClick={() => createLoop2()}>Create Music Loop</button>

      <br></br>
      <br></br>

      <button onClick={() => createSoundscape1()}>Generate Soundscape 1</button>
      <button onClick={() => pauseSoundscape()}>Pause Soundscape 1</button>
      <button onClick={() => resumeSoundscape()}>Resume Soundscape 1</button>
      <button onClick={() => stopSoundscape()}>Stop Soundscape 1</button>

      {!audioEnabled ? (
        <>
          <h2>¿Activar sonido?</h2>
          <button onClick={handleEnableAudio}>Activar Audio</button>
        </>
      ) : null}

      <br></br>
      <br></br>

      <button onClick={refreshSoundDirectorData}>Refresh Info</button>
      {generateAudioStoreInfo()}
    </>
  );
}

export default SoundTesting;
