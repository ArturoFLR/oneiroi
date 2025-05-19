import { useEffect, useRef, useState } from "react";
import styled, { css, keyframes } from "styled-components";

interface MainContainerProps {
  $size: string;
  $positionTop: string;
  $positionLeft: string;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const MainContainer = styled.div<MainContainerProps>`
  position: absolute;
  overflow: hidden;

  ${({ $size, $positionTop, $positionLeft }) => {
    return css`
      top: ${$positionTop};
      left: ${$positionLeft};
      width: ${$size};
    `;
  }}

  height: fit-content;
  z-index: 3;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface VideoProps {
  $videoMode: VideoState;
  $fadeInDuration: number;
  $fadeOutDuration: number;
  $opacity?: number;
  $extraCss?: string;
}

const Video = styled.video<VideoProps>`
  position: relative;
  width: 100%;
  height: auto;
  will-change: opacity;
  opacity: 0;

  ${({ $videoMode, $fadeInDuration, $fadeOutDuration, $opacity }) => {
    $opacity = typeof $opacity === "number" ? $opacity : 1;

    const fadeIn = keyframes`
      0% {
        opacity: 0;
      }
      100% {
        opacity: ${$opacity};
      }
  `;

    const fadeOut = keyframes`
      0% {
        opacity: ${$opacity};
      }
      100% {
        opacity: 0;
      }
  `;

    switch ($videoMode) {
      case "hidden":
        return css`
          animation: none;
        `;
        break;
      case "fadeIn":
        return css`
          animation: ${fadeIn} ${$fadeInDuration}ms linear forwards;
        `;
        break;

      case "fadeOut":
        return css`
          animation: ${fadeOut} ${$fadeOutDuration}ms linear;
        `;
        break;

      default:
        break;
    }
  }}

  ${({ $extraCss }) => {
    if ($extraCss) {
      return css`
        ${$extraCss}
      `;
    }
  }}
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////    MAIN COMPONENT   ////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

type VideoState = "fadeIn" | "fadeOut" | "hidden";

interface AnimatedGifFxProps {
  src: string;
  size: string;
  positionTop: string;
  positionLeft: string;
  delay: number;
  initialFadeDuration: number;
  finalFadeDuration: number;
  loop: boolean;
  playFrom?: number;
  opacity?: number;
  extraCss?: string;
  speed?: number;
}

function VideoFx({
  src,
  size,
  positionTop,
  positionLeft,
  initialFadeDuration,
  finalFadeDuration,
  delay,
  loop,
  playFrom,
  opacity,
  extraCss,
  speed,
}: AnimatedGifFxProps) {
  const [videoState, setVideoState] = useState<VideoState>("hidden");
  const videoElement = useRef<HTMLVideoElement>(null);
  const videoTimersRef = useRef<number[]>([]);

  useEffect(() => {
    if (!videoElement.current) return;

    //Asignamos velocidad
    if (typeof speed === "number") videoElement.current.playbackRate = speed;

    if (delay > 0) {
      const videoTimer = window.setTimeout(() => {
        setVideoState("fadeIn");
        videoElement.current?.play();
      }, delay);

      videoTimersRef.current.push(videoTimer);
    } else {
      setVideoState("fadeIn");
      videoElement.current?.play();
    }

    const handleLoadedMetadata = () => {
      if (!videoElement.current) return;

      //Asignamos punto de reproducción
      if (typeof playFrom === "number") {
        videoElement.current.currentTime = playFrom / 1000; //Transformamos en segundos.
        console.log(videoElement.current.currentTime);
      }

      //Si hay loop, salimos
      if (loop) return;

      //Si no hay loop, establecemos timer para el fade-out.
      const videoDuration = videoElement.current.duration * 1000; //En milisegundos
      const securityMargin = 100;
      const momentToFadeOut =
        videoDuration - (finalFadeDuration + securityMargin) + delay;

      const videoTimer2 = window.setTimeout(() => {
        setVideoState("fadeOut");
      }, momentToFadeOut);

      videoTimersRef.current.push(videoTimer2);
    };

    if (!loop || typeof playFrom === "number") {
      videoElement.current.addEventListener(
        "loadedmetadata",
        handleLoadedMetadata
      );
    }

    const timersToClear = videoTimersRef.current;
    const video = videoElement.current;
    return () => {
      timersToClear.forEach((timer) => {
        window.clearTimeout(timer);
      });

      if (video)
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [delay, finalFadeDuration, loop, speed, playFrom]);

  return (
    <MainContainer
      $size={size}
      $positionTop={positionTop}
      $positionLeft={positionLeft}
    >
      <Video
        ref={videoElement}
        src={src}
        loop={loop}
        $videoMode={videoState}
        $fadeInDuration={initialFadeDuration}
        $fadeOutDuration={finalFadeDuration}
        $opacity={opacity}
        $extraCss={extraCss}
      />
    </MainContainer>
  );
}

export default VideoFx;
