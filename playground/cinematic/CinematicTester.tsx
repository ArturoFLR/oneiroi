import { useState } from "react";
import { SoundDirectorAPI1 } from "../../src/classes/sound/singletons";
import CinematicDirector from "../../src/components/cinematics/CinematicDirector";
import styled from "styled-components";
import { cinematicIntro } from "./cinematicDemo";

const AudioContextButton = styled.button`
  position: absolute;
  top: 50%;
  left: 40%;
`;

function CinematicTester() {
  const [audioContextCreated, setAudioContextCreated] = useState(false);

  function handleClick() {
    SoundDirectorAPI1.initAudio();
    setAudioContextCreated(true);
  }

  return (
    <>
      {audioContextCreated ? (
        <CinematicDirector cinematicData={cinematicIntro} mode="black" />
      ) : (
        <AudioContextButton onClick={handleClick}>
          Crear Sound Context
        </AudioContextButton>
      )}
    </>
  );
}

export default CinematicTester;
