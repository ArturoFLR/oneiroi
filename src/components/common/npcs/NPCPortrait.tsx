import { GLOBAL_COLORS } from "../../../theme";
import styled from "styled-components";
import DistortionWrapper from "../fxAndFilters/DistortionWrapper";

import speechBubble from "@assets/graphics/icons/npc_portraits/speech-bubble.webp";
import loadingGif from "@assets/graphics/icons/npc_portraits/loading.gif";

interface MainContainerProps {
  isSpeaking: boolean;
}

const MainContainer = styled.div<MainContainerProps>`
  position: relative;
  width: 100%;
  border: 3px solid ${GLOBAL_COLORS.white};
  scale: ${({ isSpeaking }) => (isSpeaking ? 1.15 : 1)};
  transition: scale 0.5s ease-in-out;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const NPCImage = styled.img`
  width: 100%;
  z-index: 1;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface NPCNameProps {
  $fontSize: string;
  $color: string;
}

const NPCName = styled.p<NPCNameProps>`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  text-align: center;
  font-size: ${({ $fontSize }) => $fontSize};
  color: ${({ $color }) => $color};
  z-index: 2;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface EmojiProps {
  $fontSize: string;
}

const Emoji = styled.p<EmojiProps>`
  position: absolute;
  top: 0;
  right: 0;
  font-size: ${({ $fontSize }) => $fontSize};
  z-index: 2;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface SpeechBubbleProps {
  $position: string;
  $content: string;
}

const SpeechBubble = styled.div<SpeechBubbleProps>`
  position: absolute;
  top: -20%;
  ${({ $position }) => ($position === "left" ? "left: 0;" : "right: 0;")};
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 50%;
  scale: ${({ $content }) => ($content === "loading" ? 1 : 0)};
  transition: scale 0.3s ease-in-out;
  background-image: url(${speechBubble});
  background-size: cover;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const LoadingIcon = styled.img`
  width: 50%;
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
  isSpeaking: boolean; // Indica si el NPC está hablando o no. Cuando está hablando, se aumenta el tamaño de su retrato.
  portraitSrc: string;
  npcName: string;
  npcNameSize: string; // El tamaño de la fuente, en formato final (ej: "18px"). Pensado para recibir los resultados de calcFontSize.
  npcEmojiSize: string; // El tamaño del emoji de actitud del NPC, en formato final (ej: "18px"). Pensado para recibir los resultados de calcFontSize.
  npcNameColor?: string;
  disposition: // Actitud del NPC hacia el jugador.
  | "none"
    | "friendly"
    | "veryFriendly"
    | "inLove"
    | "neutral"
    | "unfriendly"
    | "veryUnfriendly"
    | "hostile";
  speechBubblePosition?: "left" | "right";
  speechBubbleContent?: "none" | "loading";
  distortion?: boolean;
}

function NPCPortrait({
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
  const emojisMap: Record<string, string | undefined> = {
    none: undefined,
    neutral: "😐",
    friendly: "🙂",
    veryFriendly: "😊",
    inLove: "😍",
    unfriendly: "🤨",
    veryUnfriendly: "😠",
    hostile: "😡",
    thinking: "🤔",
  };

  const usedEmoji = emojisMap[disposition];

  return (
    <MainContainer isSpeaking={isSpeaking}>
      {distortion ? (
        <DistortionWrapper increment={0.001} intensity={3}>
          <NPCImage src={portraitSrc} alt={npcName}></NPCImage>
        </DistortionWrapper>
      ) : (
        <NPCImage src={portraitSrc} alt={npcName}></NPCImage>
      )}

      <NPCName $fontSize={npcNameSize} $color={npcNameColor}>
        {npcName}
      </NPCName>

      {usedEmoji !== undefined && (
        <Emoji $fontSize={npcEmojiSize}>{usedEmoji}</Emoji>
      )}

      <SpeechBubble
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
