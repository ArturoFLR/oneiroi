import { Keyframes } from "styled-components/dist/types";
import { LightningSize } from "../../cinematics/cinematicTypes";
import styled, { css, keyframes } from "styled-components";

// Usar con duración de 3s
const lightningStrikeSmall = keyframes`
0%, 65%, 100% {
    opacity: 0;
    filter: brightness(1) contrast(1);
		backdrop-filter: contrast(100%);
  }
  
  /* Flash principal */
  10%, 19%, 22%, 27% {
    opacity: 0.3;
    filter: brightness(1.2) contrast(1.5);
    background: linear-gradient(
      -190deg,
      rgba(255,255,255,0.4) 0%,
      rgba(255,255,255,0.1) 50%
    );
		backdrop-filter: contrast(135%) brightness(1.7);
	}

  11%, 24%, 28% {
    opacity: 0.5;
    filter: brightness(0.6) contrast(1.8);
    background: linear-gradient(
      -190deg,
      rgba(255,255,255,0.4) 0%,
      rgba(255,255,255,0.1) 50%
    );
		backdrop-filter: contrast(145%) brightness(2) hue-rotate(50%);
  }
`;

// Usar con duración de 4s
const lightningStrikeMedium = keyframes`
3%, 16%, 100% {
    opacity: 0;
    filter: brightness(1) contrast(1);

		backdrop-filter: contrast(100%);
  }
  
  /* Flash principal */
  0%, 4% {
    opacity: 1;
    filter: brightness(1.8) contrast(2.5);
    background: linear-gradient(
      180deg,
      rgba(255,255,230,0.4) 0%,
      rgba(255,255,210,0.3) 20%,
      rgba(255,150,100,0.2) 40%,
      rgba(255,255,255,0) 100%
    );
		backdrop-filter: contrast(200%) hue-rotate(50%);
  }
  /* Sub-flash */
  6% {
    filter: brightness(1.5) contrast(2);
    background: linear-gradient(
      -145deg,
      rgba(255,255,255,0.5) 0%,
      rgba(255,255,255,0.3) 30%,
      rgba(100,150,255,0.2) 50%,
      rgba(255,255,255,0) 100%
    );
		backdrop-filter: contrast(160%);
  }
  
  /* Flash secundario */
  35% {
    opacity: 0.3;
    filter: brightness(1.4) contrast(1.8);
    background: linear-gradient(
      -190deg,
      rgba(255,255,255,0.4) 0%,
      rgba(255,255,255,0.1) 50%
    );
		backdrop-filter: contrast(145%) brightness(2);
	}

	90% {
		opacity: 0;
		filter: brightness(1) contrast(1);
	}
`;

// Usar con duración de 5s
const lightningStrikeBig = keyframes`
3%, 10%,  100% {
    opacity: 0;
    filter: brightness(1) contrast(1);

		backdrop-filter: contrast(100%);
  }
  
  /* Flash principal */
  0%, 4% {
    opacity: 1;
    filter: brightness(1.8) contrast(2.5);
    background: linear-gradient(
      180deg,
      rgba(255,255,230,0.4) 0%,
      rgba(255,255,210,0.3) 20%,
      rgba(255,150,100,0.2) 40%,
      rgba(255,255,255,0) 100%
    );
		backdrop-filter: contrast(200%) hue-rotate(50%);
  } 
  8%, 12% {
    opacity: 1;
    filter: brightness(0.3) contrast(3.5);
    background: linear-gradient(
      180deg,
      rgba(255,255,230,0.4) 0%,
      rgba(255,255,210,0.3) 20%,
      rgba(255,150,100,0.2) 40%,
      rgba(255,255,255,0) 100%
    );
		backdrop-filter: contrast(300%) hue-rotate(80%);
  } 
  /* Sub-flash */
  24% {
    filter: brightness(1.5) contrast(2);
    background: linear-gradient(
      -145deg,
      rgba(255,255,255,0.5) 0%,
      rgba(255,255,255,0.3) 30%,
      rgba(100,150,255,0.2) 50%,
      rgba(255,255,255,0) 100%
    );
		backdrop-filter: contrast(160%);
  }
  
  /* Flash secundario */
  35% {
    opacity: 0.4;
    filter: brightness(1.4) contrast(1.8);
    background: linear-gradient(
      -190deg,
      rgba(255,255,255,0.4) 0%,
      rgba(255,255,255,0.1) 50%
    );
		backdrop-filter: contrast(185%) brightness(2.5);
	}

	90% {
		opacity: 0;
		filter: brightness(1) contrast(1);
	}
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type LightningSizeMap = {
  [key: string]: Keyframes;
};

const lightningSizeMap: LightningSizeMap = {
  small: lightningStrikeSmall,
  medium: lightningStrikeMedium,
  big: lightningStrikeBig,
};

const lightningDurationMap = {
  small: "3s",
  medium: "4s",
  big: "3s",
};

interface MainContainerProps {
  $size: LightningSize;
  $delay: number;
}

const MainContainer = styled.div<MainContainerProps>`
  position: absolute;
  overflow: hidden;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  will-change: filter, opacity;
  z-index: 3;

  ${({ $size, $delay }) => {
    return css`
      animation: ${lightningSizeMap[$size]} ${lightningDurationMap[$size]}
        ${$delay}ms linear none;
    `;
  }}
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////    MAIN COMPONENT   ////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface LightningFXProps {
  size: LightningSize;
  delay: number;
  id: string;
}

function LightningFX({ size, delay, id }: LightningFXProps) {
  return <MainContainer id={id} $size={size} $delay={delay}></MainContainer>;
}

export default LightningFX;
