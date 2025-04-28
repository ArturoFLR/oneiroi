import testImageWide from "@assets/graphics/cinematics/intro/alien-landscape_01.jpg";
// import testImage from "@assets/graphics/cinematics/intro/stormy-clouds_03.jpg";
import styled from "styled-components";

const MainPicture = styled.img`
  width: 100%;
`;

function MainViewer() {
  return <MainPicture src={testImageWide}></MainPicture>;
}

export default MainViewer;
