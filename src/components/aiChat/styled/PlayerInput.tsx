import { useState } from "react";
import { GLOBAL_COLORS, GLOBAL_FONTS } from "../../../theme";
import styled, { keyframes } from "styled-components";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const MainContainer = styled.div`
  position: relative;
  margin-top: 2vh;
  width: 100%;
  height: 100%;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const textareaAnimation = keyframes`
  0% {
    opacity: 0.2;
    }
  100% { 
    opacity: 1;
  }
`;

interface TextAreaLabelProps {
  $fontSize: string;
  $visible: boolean;
}

const TextAreaLabel = styled.label<TextAreaLabelProps>`
  position: absolute;
  color: ${GLOBAL_COLORS.text.manualText.inputPlaceholderText};
  text-shadow: 0.5px 0.5px 0px ${GLOBAL_COLORS.text.manualText.npcTextShadow};
  font-family: ${GLOBAL_FONTS.aiChat.playerText};
  font-size: ${({ $fontSize }) => $fontSize};
  top: 1vh;
  display: ${({ $visible }) => ($visible ? "block" : "none")};
  pointer-events: none;
  animation: ${textareaAnimation} 1s infinite alternate ease-in-out;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface TextAreaProps {
  $fontSize: string;
}

const TextArea = styled.textarea<TextAreaProps>`
  width: 100%;
  height: 75%;
  color: ${GLOBAL_COLORS.aiChat.playerText};
  text-shadow: 0.5px 0.5px 0px ${GLOBAL_COLORS.text.manualText.npcTextShadow};
  font-family: ${GLOBAL_FONTS.aiChat.playerText};
  font-size: ${({ $fontSize }) => $fontSize};
  line-height: 140%;
  outline: none;
  resize: none;
  background-color: transparent;
  border: none;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////    MAIN COMPONENT   ////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface PlayerInputProps {
  fontSize: string;
  textareaElementRef: React.RefObject<HTMLTextAreaElement | null>;
  handleTextAreaChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

function PlayerInput({
  fontSize,
  textareaElementRef,
  handleTextAreaChange,
}: PlayerInputProps) {
  const [isTextAreaFocused, setIsTextAreaFocused] = useState(false);

  return (
    <MainContainer>
      <TextAreaLabel $fontSize={fontSize} $visible={!isTextAreaFocused}>
        Escribe aquí...
      </TextAreaLabel>
      <TextArea
        ref={textareaElementRef}
        onChange={handleTextAreaChange}
        onFocus={() => setIsTextAreaFocused(true)}
        $fontSize={fontSize}
        maxLength={230}
      />
    </MainContainer>
  );
}

export default PlayerInput;
