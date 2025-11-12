import styled from "styled-components";
import ScreenDarkener from "../../common/ScreenDarkener";
import NPCPortrait from "../../common/npcs/NPCPortrait";
import ConversationWrapper from "./ConversationWrapper";
import { ChatPhase } from "../aiChatTypes";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
interface MainContainerProps {
  $windowSize: [number, number];
}

const MainContainer = styled.div<MainContainerProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: ${({ $windowSize }) =>
    $windowSize[0] > $windowSize[1] ? "90%" : "95%"};
  height: 90%;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const PortraitsContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  margin-bottom: 5vh;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////    MAIN COMPONENT   ////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface AIChatVistaProps {
  windowSize: [number, number];
  textareaElementRef: React.RefObject<HTMLTextAreaElement | null>;
  portraitNameSize: string;
  portraitEmojiSize: string;
  textBoxNameSize: string;
  textBoxTextSize: string;
  buttonsSize: string;
  npcName: string;
  npcNameColor: string;
  npcDistortion: boolean;
  jonasNameColor: string;
  jonasPortraitSrc: string;
  npcPortraitSrc: string;
  npcDisposition: number;
  isNpcThinking: boolean;
  chatPhase: ChatPhase;
  aiResponseText: string;
  minimunTextLengthReached: boolean;
  canUserEndConversation: boolean;
  handleTextAreaChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleAIResponseComplete: () => void;
  onConversationEndClick: () => void;
  onPlayerResponseClick: () => void;
  onAIResponseClick: () => void;
}

function AIChatVista({
  windowSize,
  textareaElementRef,
  portraitNameSize,
  portraitEmojiSize,
  textBoxNameSize,
  textBoxTextSize,
  buttonsSize,
  npcName,
  npcNameColor,
  npcDistortion,
  jonasNameColor,
  jonasPortraitSrc,
  npcPortraitSrc,
  npcDisposition,
  isNpcThinking,
  chatPhase,
  aiResponseText,
  minimunTextLengthReached,
  canUserEndConversation,
  handleTextAreaChange,
  handleAIResponseComplete,
  onConversationEndClick,
  onPlayerResponseClick,
  onAIResponseClick,
}: AIChatVistaProps) {
  return (
    <ScreenDarkener color="black">
      <MainContainer $windowSize={windowSize}>
        <PortraitsContainer id="portaits-container">
          {/* Este primer NPCPortrait es siempre Jonas, el jugador. */}
          <NPCPortrait
            windowSize={windowSize}
            isSpeaking={chatPhase === "userInput" ? true : false}
            portraitSrc={jonasPortraitSrc}
            npcName="Jonás"
            npcNameSize={portraitNameSize}
            npcEmojiSize={portraitEmojiSize}
            npcNameColor={jonasNameColor}
            disposition={undefined}
            speechBubblePosition="left"
            speechBubbleContent="none"
            distortion={false}
          />

          {/* Este segundo NPCPortrait es el NPC con el que se está interactuando. */}
          <NPCPortrait
            windowSize={windowSize}
            isSpeaking={chatPhase === "userInput" ? false : true}
            portraitSrc={npcPortraitSrc}
            npcName={npcName}
            npcNameSize={portraitNameSize}
            npcEmojiSize={portraitEmojiSize}
            npcNameColor={npcNameColor}
            disposition={npcDisposition}
            speechBubblePosition="left"
            speechBubbleContent={isNpcThinking ? "loading" : "none"}
            distortion={npcDistortion}
          />
        </PortraitsContainer>

        <ConversationWrapper
          aiResponseText={aiResponseText}
          npcName={npcName}
          npcNameColor={npcNameColor}
          jonasNameColor={jonasNameColor}
          textBoxNameSize={textBoxNameSize}
          textBoxTextSize={textBoxTextSize}
          buttonsSize={buttonsSize}
          textareaElementRef={textareaElementRef}
          chatPhase={chatPhase}
          minimunTextLengthReached={minimunTextLengthReached}
          canUserEndConversation={canUserEndConversation}
          handleTextAreaChange={handleTextAreaChange}
          handleAIResponseComplete={handleAIResponseComplete}
          onConversationEndClick={onConversationEndClick}
          onPlayerResponseClick={onPlayerResponseClick}
          onAIResponseClick={onAIResponseClick}
        />
      </MainContainer>
    </ScreenDarkener>
  );
}

export default AIChatVista;
