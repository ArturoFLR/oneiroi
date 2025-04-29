import { GLOBAL_COLORS } from "../../theme";
import styled from "styled-components";

interface MainFrameProps {
  $color: "light" | "dark";
}

const MainFrame = styled.div<MainFrameProps>`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background: ${({ $color }) =>
    $color === "light"
      ? GLOBAL_COLORS.screenDarkener.light
      : GLOBAL_COLORS.screenDarkener.dark};
  z-index: 1000;
`;

interface ScreenDarkenerProps {
  color?: "light" | "dark";
  children?: React.ReactNode;
}

export default function ScreenDarkener({
  color = "dark",
  children,
}: ScreenDarkenerProps) {
  return <MainFrame $color={color}>{children}</MainFrame>;
}
