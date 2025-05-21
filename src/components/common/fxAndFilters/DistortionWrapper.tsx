import React from "react";
import styled from "styled-components";

// Esta función permite crear una lista de valores (fotogramas) enorme, lo que hace más suave la animación.
function generateFilterValues(
  initialValues: number[],
  maxValues: number[],
  variation: number
) {
  const valuesList = [];

  // Fase de subida (hasta alcanzar o superar el valor máximo)
  let current = [...initialValues];
  while (current[0] <= maxValues[0] && current[1] <= maxValues[1]) {
    valuesList.push([current[0].toFixed(4), current[1].toFixed(4)].join(" "));
    current = [current[0] + variation, current[1] + variation];
  }

  // Aseguramos que el último valor de subida sea exactamente el máximo
  valuesList.pop(); // Eliminamos el último que pudo pasarse
  valuesList.push([maxValues[0].toFixed(4), maxValues[1].toFixed(4)].join(" "));

  // Fase de bajada (hasta volver al valor inicial)
  current = [...maxValues];
  while (current[0] >= initialValues[0] && current[1] >= initialValues[1]) {
    current = [current[0] - variation, current[1] - variation];
    if (current[0] >= initialValues[0]) {
      // Evitamos duplicar el valor inicial
      valuesList.push([current[0].toFixed(4), current[1].toFixed(4)].join(" "));
    }
  }

  return valuesList.join(";\n") + ";"; // Formato solicitado
}

interface SVGFilterProps {
  speed?: number;
  intensity?: number;
  initialValues?: number[];
  maxValues?: number[];
  increment?: number;
}

const SVGFilter = ({
  speed = 0.099,
  intensity = 4,
  initialValues = [0.1, 0.2],
  maxValues = [0.2, 0.3],
  increment = 0.0001,
}: SVGFilterProps) => (
  <svg style={{ display: "none" }}>
    <filter id="wavy">
      <feTurbulence
        type="turbulence"
        baseFrequency="0.02 0.05"
        numOctaves="2"
        result="turbulence"
        seed="2"
      >
        <animate
          attributeName="baseFrequency"
          dur={`${speed}s`}
          values={generateFilterValues(initialValues, maxValues, increment)}
          repeatCount="indefinite"
        />
      </feTurbulence>
      <feDisplacementMap
        in="SourceGraphic"
        in2="turbulence"
        scale={intensity}
      />
    </filter>
  </svg>
);

const Distortion = styled.div`
  filter: url(#wavy);
  will-change: filter;
`;

interface DistortionWrapperProps {
  children: React.ReactNode;
  initialValues?: number[];
  maxValues?: number[];
  increment?: number;
  speed?: number;
  intensity?: number;
}

function DistortionWrapper({
  children, // El elemento sobre el que aplicar la distorsión
  initialValues, // Valores iniciales de la distorsión
  maxValues, // Valores máximos de la distorsión
  increment, // Cuánto se incrementa la distorsión en cada "fotograma". Cuanto más pequeño, más suave será la animación.
  speed, // Cuánto se mantiene en pantalla cada fotograma de la animación.
  intensity, // Cuánto se distorsiona la imagen. Cuanto más alto, más distorsión. Es como un multiplicador de los valores iniciales y máximos.
}: DistortionWrapperProps) {
  return (
    <>
      <SVGFilter
        initialValues={initialValues}
        maxValues={maxValues}
        increment={increment}
        speed={speed}
        intensity={intensity}
      />
      <Distortion>{children}</Distortion>
    </>
  );
}

export default DistortionWrapper;
