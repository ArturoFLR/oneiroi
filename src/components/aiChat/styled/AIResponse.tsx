import styled from "styled-components";
import AnimatedText from "../../common/text/AnimatedText";
import { GLOBAL_COLORS, GLOBAL_FONTS } from "../../../theme";
import { ReactElement, useRef, useState } from "react";
import splitDialoguesAndActions, {
  splitDialoguesAndActionsReturn,
} from "../../../utils/aiChat/splitDialoguesAndActions";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const MainContainer = styled.div`
  position: relative;
  width: 100%;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////    MAIN COMPONENT   ////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface AIResponseProps {
  responseText: string;
  textSize: string;
  onAIResponseComplete: () => void;
}

function AIResponse({
  responseText,
  textSize,
  onAIResponseComplete,
}: AIResponseProps) {
  const [paragraphsToShow, setParagraphsToShow] = useState<number>(1);
  const paragraphs = useRef<splitDialoguesAndActionsReturn[]>([]);

  const generateParagraphs = () => {
    paragraphs.current = splitDialoguesAndActions(
      responseText,
      GLOBAL_COLORS.aiChat.aiText,
      GLOBAL_COLORS.aiChat.aiActions
    );

    const generatedParagraphs: ReactElement[] = [];

    for (let i = 0; i < paragraphsToShow; i++) {
      generatedParagraphs.push(
        <AnimatedText
          key={i}
          text={paragraphs.current[i].text}
          fontSize={textSize}
          animationTime={10}
          fontFamily={GLOBAL_FONTS.aiChat.aiText}
          color={paragraphs.current[i].color}
          lineHeight="145%"
          onEnd={onParagraphEnd}
        ></AnimatedText>
      );
    }

    return generatedParagraphs;
  };

  const onParagraphEnd = () => {
    if (paragraphsToShow < paragraphs.current.length) {
      setParagraphsToShow(paragraphsToShow + 1);
    } else {
      onAIResponseComplete();
    }
  };

  return (
    <MainContainer>{responseText ? generateParagraphs() : ""}</MainContainer>
  );
}

export default AIResponse;
