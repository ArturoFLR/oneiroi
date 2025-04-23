import styled from "styled-components";
import { GLOBAL_COLORS } from "../../../theme";

import asfaltLightImgSrc from "@assets/graphics/backgrounds/asfalt-light.png";

type MapContainerProps = {
  $cols: number;
};

const MapContainer = styled.div<MapContainerProps>`
  position: relative;
  display: grid;
  grid-template-columns: repeat(${(props) => props.$cols}, 1fr);
  grid-template-rows: 1fr;
  width: 97%;
  border: 2px solid black;
  border-radius: 15px;
  padding: 2rem;
  background-image: linear-gradient(
    45deg,
    ${GLOBAL_COLORS.map.backgrGradient1},
    ${GLOBAL_COLORS.map.backgrGradient2}
  );
  box-shadow: 3px 3px 15px 2px black;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: green;
    border-radius: 15px;
    background: url(${asfaltLightImgSrc}); /* Imagen de ruido */
    mix-blend-mode: hard-light; /* Mezcla el ruido con el degradado */
    opacity: 0.7; /* Ajusta la intensidad */
  }

  @media (min-width: 768px) {
    width: 60%;
  }

  @media (min-width: 1025px) {
    width: 50%;
  }

  @media (min-width: 1600px) {
    width: 43%;
  }

  @media (min-width: 1800px) {
    width: 50%;
  }
`;

export default MapContainer;
