import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

interface AnimatedParagraphProps {
  $fontSize: string;
  $fontFamily: string;
  $color: string;
  $lineHeight: string;
}

const AnimatedParagraph = styled.p<AnimatedParagraphProps>`
  display: block;
  width: 100%;
  font-size: ${({ $fontSize }) => $fontSize};
  font-family: ${({ $fontFamily }) => $fontFamily};
  line-height: ${({ $lineHeight }) => $lineHeight};
  color: ${({ $color }) => $color};
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////    MAIN COMPONENT   ////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface AnimatedTextProps {
  text: string;
  animationTime: number; // Cuántos milisegundos pasan antes de mostrar la siguiente letra.
  fontSize: string;
  color: string;
  fontFamily: string;
  lineHeight?: string;
  onEnd: () => void;
}

function AnimatedText({
  text,
  animationTime,
  fontSize,
  color,
  fontFamily,
  lineHeight = "125%",
  onEnd,
}: AnimatedTextProps) {
  const [textToShow, setTextToShow] = useState<string>("");

  const actualTextIndexRef = useRef<number>(0);
  const textIntervalRef = useRef<number>(0);
  const hasOnEndBeenExecutedRef = useRef<boolean>(false);

  useEffect(() => {
    textIntervalRef.current = window.setInterval(() => {
      if (actualTextIndexRef.current < text.length) {
        setTextToShow(textToShow + text[actualTextIndexRef.current]);
        actualTextIndexRef.current++;
      } else {
        window.clearInterval(textIntervalRef.current);
        if (!hasOnEndBeenExecutedRef.current) {
          hasOnEndBeenExecutedRef.current = true;
          onEnd();
        }
      }
    }, animationTime);

    return () => {
      window.clearInterval(textIntervalRef.current);
    };
  }, [animationTime, text, textToShow, onEnd]);

  return (
    <AnimatedParagraph
      $fontSize={fontSize}
      $fontFamily={fontFamily}
      $color={color}
      $lineHeight={lineHeight}
    >
      {textToShow}
    </AnimatedParagraph>
  );
}

export default AnimatedText;
