import { GLOBAL_COLORS } from "../../../theme";
import styled from "styled-components";
import DistortionWrapper from "../fxAndFilters/DistortionWrapper";

import speechBubble from "@assets/graphics/icons/npc_portraits/speech-bubble.webp";
import loadingGif from "@assets/graphics/icons/npc_portraits/loading.gif";

interface MainContainerProps {
  $isSpeaking: boolean;
  $windowSize: [number, number];
}

const MainContainer = styled.div<MainContainerProps>`
  overflow: hidden;
  position: relative;
  height: ${({ $windowSize }) =>
    $windowSize[0] < $windowSize[1] ? "auto" : "40vh"};

  width: ${({ $windowSize }) =>
    $windowSize[0] < $windowSize[1] ? "35%" : "auto"};

  max-height: 40vh;
  max-width: 40vh;
  aspect-ratio: 1/1;
  border: 3px solid ${GLOBAL_COLORS.white};
  border-radius: 10px;
  scale: ${({ $isSpeaking }) => ($isSpeaking ? 1.15 : 1)};
  transition: scale 0.5s ease-in-out;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const NPCImage = styled.img`
  width: 100%;
  z-index: 1;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const NPCNameContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding-top: 0.4vh;
  background-image: linear-gradient(to bottom, transparent 10%, #00000093 35%);
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface NPCNameProps {
  $fontSize: string;
  $color: string;
}

const NPCName = styled.p<NPCNameProps>`
  width: 100%;
  text-align: center;
  font-size: ${({ $fontSize }) => $fontSize};
  font-weight: bold;
  color: ${({ $color }) => $color};
  text-shadow: 1px 1px 0.3px
    ${GLOBAL_COLORS.text.manualText.npcPortraitNameSahdow};
  z-index: 2;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface EmojiProps {
  $fontSize: string;
}

const Emoji = styled.p<EmojiProps>`
  position: absolute;
  top: 2%;
  right: 1%;
  font-size: ${({ $fontSize }) => $fontSize};
  text-shadow: 0px 0px 5px ${GLOBAL_COLORS.text.manualText.npcTextShadow};
  z-index: 2;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface SpeechBubbleProps {
  $position: string;
  $content: string;
}

const SpeechBubble = styled.div<SpeechBubbleProps>`
  position: absolute;
  top: 3%;
  ${({ $position }) => ($position === "left" ? "left: 0;" : "right: 0;")};
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 5%;
  width: 30%;
  aspect-ratio: 450/480;
  scale: ${({ $content }) => ($content === "loading" ? 1 : 0)};
  transform: scaleX(-1);
  transition: scale 0.3s ease-in-out;
  background-image: url(${speechBubble});
  background-size: cover;
  background-repeat: no-repeat;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const LoadingIcon = styled.img`
  width: 30%;
  margin-top: 10%;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////    MAIN COMPONENT   ////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// No se reutiliza el componente NPCCinematicPortrait (en la carpeta "cinematics/styled") porque
// este está pensado para conversaciones y necesita emojis, nombre y un posicionamiento distinto.
// Este sí se puede reutilizar en modales y otras partes del juego, pero no en cinemáticas.

interface NPCPortraitProps {
  windowSize: [number, number];
  isSpeaking: boolean; // Indica si el NPC está hablando o no. Cuando está hablando, se aumenta el tamaño de su retrato.
  portraitSrc: string;
  npcName: string;
  npcNameSize: string; // El tamaño de la fuente, en formato final (ej: "18px"). Pensado para recibir los resultados de calcFontSize.
  npcEmojiSize: string; // El tamaño del emoji de actitud del NPC, en formato final (ej: "18px"). Pensado para recibir los resultados de calcFontSize.
  npcNameColor?: string;
  disposition: undefined | number; // Actitud del NPC hacia el jugador.
  speechBubblePosition?: "left" | "right";
  speechBubbleContent?: "none" | "loading"; // Si es "loading", se muestra el gif de carga dentro de un bocadillo. No tiene nada que ver con los emojis de estado.
  distortion?: boolean;
}

function NPCPortrait({
  windowSize,
  isSpeaking,
  portraitSrc,
  npcName,
  npcNameSize,
  npcEmojiSize,
  npcNameColor = GLOBAL_COLORS.white,
  disposition,
  speechBubblePosition = "left",
  speechBubbleContent = "none",
  distortion = false,
}: NPCPortraitProps) {
  // Emojis de actitud del NPC hacia el jugador:
  const emojisMap: string[] = ["😡", "😠", "🤨", "😐", "🙂", "😊", "😍"];
  const emojiIndex = typeof disposition === "number" ? disposition + 3 : null;
  const usedEmoji = emojiIndex !== null ? emojisMap[emojiIndex] : undefined;

  return (
    <MainContainer $isSpeaking={isSpeaking} $windowSize={windowSize}>
      {distortion ? (
        <DistortionWrapper increment={0.001} intensity={3}>
          <NPCImage src={portraitSrc} alt={npcName}></NPCImage>
        </DistortionWrapper>
      ) : (
        <NPCImage src={portraitSrc} alt={npcName}></NPCImage>
      )}

      <NPCNameContainer>
        <NPCName $fontSize={npcNameSize} $color={npcNameColor}>
          {npcName}
        </NPCName>
      </NPCNameContainer>

      {usedEmoji !== undefined && (
        <Emoji $fontSize={npcEmojiSize}>{usedEmoji}</Emoji>
      )}

      <SpeechBubble
        id="speech-bubble"
        $position={speechBubblePosition}
        $content={speechBubbleContent}
      >
        <LoadingIcon
          src={loadingGif}
          alt={speechBubbleContent === "loading" ? "loading" : ""}
        />
      </SpeechBubble>
    </MainContainer>
  );
}

export default NPCPortrait;
