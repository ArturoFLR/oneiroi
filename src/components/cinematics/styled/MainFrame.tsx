import { GLOBAL_COLORS } from "../../../theme";
import styled from "styled-components";

const ScreenDarkener = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background: ${GLOBAL_COLORS.screenDarkener.light};
  z-index: 1000;
`;

type MainContainerProps = {
  $widePicture: boolean;
};

const MainContainer = styled.div<MainContainerProps>`
  width: ${({ $widePicture }) => ($widePicture ? "70vw" : "40vw")};
  height: auto;
`;

export default function MainFrame() {
  return (
    <ScreenDarkener>
      <MainContainer $widePicture={true}></MainContainer>
    </ScreenDarkener>
  );
}
