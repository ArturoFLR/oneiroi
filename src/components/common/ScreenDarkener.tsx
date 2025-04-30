import { GLOBAL_COLORS } from "../../theme";
import styled from "styled-components";

interface MainFrameProps {
  $color: "light" | "dark" | "black";
}

const bgColorMap = {
  light: GLOBAL_COLORS.screenDarkener.light,
  dark: GLOBAL_COLORS.screenDarkener.dark,
  black: GLOBAL_COLORS.screenDarkener.black,
};

const MainFrame = styled.div<MainFrameProps>`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background: ${({ $color }) => bgColorMap[$color]};
  z-index: 1000;
`;

interface ScreenDarkenerProps {
  color?: "light" | "dark" | "black";
  children?: React.ReactNode;
}

export default function ScreenDarkener({
  color = "dark",
  children,
}: ScreenDarkenerProps) {
  return <MainFrame $color={color}>{children}</MainFrame>;
}
