import { GLOBAL_COLORS, GLOBAL_FONTS } from "../../../theme";
import styled from "styled-components";
import PlayerInput from "./PlayerInput";
import AIResponse from "./AIResponse";
import TextButton from "../../buttons/TextButton";

import asfaltBackground from "@assets/graphics/backgrounds/asfalt-light.png";
import { ChatPhase } from "../aiChatTypes";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const MainContainer = styled.div`
  position: relative;
  width: 100%;
  height: 40vh;
  border: 3px solid ${GLOBAL_COLORS.orange.text};
  border-radius: 10px;
  padding: 2vh 4vw;
  background-image: url(${asfaltBackground});
  background-color: #3173bf12;
  background-blend-mode: saturation;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
interface NpcNameProps {
  $color: string;
  $fontSize: string;
}

const NpcName = styled.p<NpcNameProps>`
  font-size: ${({ $fontSize }) => $fontSize};
  font-family: ${GLOBAL_FONTS.aiChat.names};
  color: ${({ $color }) => $color};
  text-shadow: 0.5px 0.5px 0px ${GLOBAL_COLORS.text.manualText.npcTextShadow};
  margin-bottom: 1vh;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const ButtonsContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 1vh;
  padding: 0 1vw;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////    MAIN COMPONENT   ////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface ConversationWrapperProps {
  aiResponseText: string;
  npcName: string;
  npcNameColor: string;
  jonasNameColor: string;
  textBoxNameSize: string;
  textBoxTextSize: string;
  buttonsSize: string;
  textareaElementRef: React.RefObject<HTMLTextAreaElement | null>;
  chatPhase: ChatPhase;
  minimunTextLengthReached: boolean;
  canUserEndConversation: boolean;
  handleTextAreaChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleAIResponseComplete: () => void;
  onConversationEndClick: () => void;
  onPlayerResponseClick: () => void;
  onAIResponseClick: () => void;
}

function ConversationWrapper({
  aiResponseText,
  npcName,
  npcNameColor,
  jonasNameColor,
  textBoxNameSize,
  textBoxTextSize,
  buttonsSize,
  textareaElementRef,
  chatPhase,
  minimunTextLengthReached,
  canUserEndConversation,
  handleTextAreaChange,
  handleAIResponseComplete,
  onConversationEndClick,
  onPlayerResponseClick,
  onAIResponseClick,
}: ConversationWrapperProps) {
  return (
    <>
      <MainContainer>
        <NpcName
          $color={chatPhase === "userInput" ? jonasNameColor : npcNameColor}
          $fontSize={textBoxNameSize}
        >
          {chatPhase === "userInput" ? "Jonás:" : npcName + ":"}
        </NpcName>

        {chatPhase === "userInput" && (
          <PlayerInput
            fontSize={textBoxTextSize}
            textareaElementRef={textareaElementRef}
            handleTextAreaChange={handleTextAreaChange}
          />
        )}

        {chatPhase !== "userInput" && (
          <AIResponse
            textSize={textBoxTextSize}
            responseText={aiResponseText}
            onAIResponseComplete={handleAIResponseComplete}
          />
        )}
      </MainContainer>
      <ButtonsContainer>
        <TextButton
          fontSize={buttonsSize}
          onClick={onConversationEndClick}
          animated={canUserEndConversation}
          fontFamily={GLOBAL_FONTS.buttons.ModalTextButton}
          color={GLOBAL_COLORS.buttons.ModalTextButton.text}
          hoverColor={GLOBAL_COLORS.buttons.ModalTextButton.textHover}
          textShadow={GLOBAL_COLORS.buttons.ModalTextButton.textShadow}
          disabled={!canUserEndConversation}
        >
          Abandonar &gt;&gt;
        </TextButton>

        {chatPhase === "userInput" && (
          <TextButton
            fontSize={buttonsSize}
            onClick={onPlayerResponseClick}
            animated={minimunTextLengthReached}
            fontFamily={GLOBAL_FONTS.buttons.ModalTextButton}
            color={GLOBAL_COLORS.buttons.ModalTextButton.text}
            hoverColor={GLOBAL_COLORS.buttons.ModalTextButton.textHover}
            textShadow={GLOBAL_COLORS.buttons.ModalTextButton.textShadow}
            disabled={!minimunTextLengthReached}
          >
            Continuar &gt;&gt;
          </TextButton>
        )}

        {chatPhase !== "userInput" && (
          <TextButton
            fontSize={buttonsSize}
            onClick={onAIResponseClick}
            animated={true}
            fontFamily={GLOBAL_FONTS.buttons.ModalTextButton}
            color={GLOBAL_COLORS.buttons.ModalTextButton.text}
            hoverColor={GLOBAL_COLORS.buttons.ModalTextButton.textHover}
            textShadow={GLOBAL_COLORS.buttons.ModalTextButton.textShadow}
          >
            Ok &gt;&gt;
          </TextButton>
        )}
      </ButtonsContainer>
    </>
  );
}

export default ConversationWrapper;
