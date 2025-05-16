import { useRef, useEffect, useCallback, useState } from "react";
import { RainIntensity } from "../../cinematics/cinematicTypes";

interface Drop {
  x: number;
  y: number;
  speed: number;
  length: number;
  opacity: number;
}

interface RainFxProps {
  intensity: RainIntensity;
  size: number;
  isStarting: boolean;
}

const RainFx = ({ intensity, size, isStarting }: RainFxProps) => {
  const [resize, setResize] = useState<number>(0);
  const lastResolutionRef = useRef<number>(window.innerWidth);

  let nbDrop: number = 0;
  let baseSpeed: number = 0;
  let baseLenght: number = 0;
  let baseWidth: number = 0.5;

  switch (intensity) {
    case "low":
      nbDrop = 380;
      baseSpeed = 22;
      baseLenght = 25;
      baseWidth = 0.5;
      break;

    case "medium":
      nbDrop = 750;
      baseSpeed = 35;
      baseLenght = 70;
      baseWidth = 0.7;
      break;

    case "high":
      nbDrop = 980;
      baseSpeed = 50;
      baseLenght = 120;
      baseWidth = 0.75;
      break;

    default:
      break;
  }

  //Modifica los valores base de las partículas.
  function modifyParticlesValues(modifyFactor: number) {
    nbDrop = nbDrop * modifyFactor;
    baseSpeed = baseSpeed * modifyFactor;
    baseLenght = baseLenght * modifyFactor;
    baseWidth = baseWidth * modifyFactor;
  }

  // Restamos partículas a la simulación para pantallas pequeñas.
  const mediumWidth = 650;
  const lowWidth = 450;
  if (window.innerWidth <= lowWidth) {
    const reduceFactor = 0.55;
    modifyParticlesValues(reduceFactor);
  } else if (window.innerWidth <= mediumWidth) {
    const reduceFactor = 0.65;
    modifyParticlesValues(reduceFactor);
  }

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drops = useRef<Drop[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const updateDimensions = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDimensions({
        width: rect.width,
        height: rect.height,
      });
    }
  }, []);

  const initDrops = useCallback(() => {
    const newDrops = [];
    const { width, height } = dimensions;

    for (let i = 0; i < nbDrop; i++) {
      const sizeFactor = Math.random() * 0.7 + 0.3;

      newDrops.push({
        x: Math.random() * width,
        y: Math.random() * (isStarting ? -height : height),
        speed: sizeFactor * baseSpeed,
        length: sizeFactor * baseLenght,
        opacity: 0.3 + sizeFactor * 0.3,
      });
    }
    drops.current = newDrops;
  }, [nbDrop, baseSpeed, baseLenght, dimensions, isStarting]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    if (!canvas) return;

    const actualWidth = dimensions.width;
    const actualHeight = dimensions.height;
    const ratio = Math.min(window.devicePixelRatio, 1.2); //Este 1.2 limita el máximo de resolución. Se puede bajar más. Mejora mucho el rendimiento.
    const ctx = canvas.getContext("2d");

    // Ajustar solo si hay cambios reales
    if (
      canvas.width !== actualWidth * ratio ||
      canvas.height !== actualHeight * ratio
    ) {
      canvas.width = actualWidth * ratio;
      canvas.height = actualHeight * ratio;
      ctx?.scale(ratio, ratio);
    }
    initDrops();
  }, [dimensions, initDrops]);

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      updateDimensions();
      if (window.innerWidth !== lastResolutionRef.current) {
        setResize((previous) => previous++);
      }
    });

    if (containerRef.current) {
      updateDimensions();
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [updateDimensions, resize]);

  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;

    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    let animationFrameId: number;

    const animate = () => {
      if (!ctx) return;

      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      drops.current.forEach((drop) => {
        ctx.strokeStyle = `rgba(174, 194, 224, ${drop.opacity})`;

        ctx.beginPath();
        ctx.lineWidth = (baseWidth + drop.speed * 0.1) * size;

        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x, drop.y + drop.length);
        ctx.stroke();

        drop.y += drop.speed;

        if (drop.y > dimensions.height) {
          const newSizeFactor = Math.random() * 0.9 + 0.1;
          drop.y = Math.random() * -dimensions.height;
          drop.x = Math.random() * dimensions.width;
          drop.speed = newSizeFactor * baseSpeed;
          drop.length = newSizeFactor * baseLenght;
          drop.opacity = 0.1 + newSizeFactor * 0.2;
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [resizeCanvas, dimensions, baseSpeed, baseLenght, baseWidth, size]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        top: "-17%",
        left: "-17%",
        width: "160%",
        height: "160%",
        zIndex: 4,
        willChange: "transform",
        transform: "rotate(20deg) translateZ(0)",
        isolation: "isolate",
        backfaceVisibility: "hidden",
        perspective: "1000",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />
    </div>
  );
};

export default RainFx;
