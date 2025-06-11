import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

interface AnimatedParagraphProps {
  $fontSize: string;
  $fontFamily: string;
  $color: string;
}

const AnimatedParagraph = styled.p<AnimatedParagraphProps>`
  display: block;
  width: 100%;
  font-size: ${({ $fontSize }) => $fontSize};
  font-family: ${({ $fontFamily }) => $fontFamily};
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
  onEnd: () => void;
}

function AnimatedText({
  text,
  animationTime,
  fontSize,
  color,
  fontFamily,
  onEnd,
}: AnimatedTextProps) {
  const [textToShow, setTextToShow] = useState<string>("");

  const actualTextIndexRef = useRef<number>(0);
  const textIntervalRef = useRef<number>(0);
  const hasOnEndBeenExecutedRef = useRef<boolean>(false);

  useEffect(() => {
    textIntervalRef.current = window.setInterval(() => {
      if (actualTextIndexRef.current < text.length - 1) {
        setTextToShow((prev) => prev + text[actualTextIndexRef.current]);
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
  }, [animationTime, text, onEnd]);

  return (
    <AnimatedParagraph
      $fontSize={fontSize}
      $fontFamily={fontFamily}
      $color={color}
    >
      {textToShow}
    </AnimatedParagraph>
  );
}

export default AnimatedText;
