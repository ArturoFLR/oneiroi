import styled from "styled-components";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface MainContainerProps {
  $width: string;
  $position?: string;
  $mobilePosition?: string;
  $top?: string;
  $mobileTop?: string;
  $left?: string;
  $mobileLeft?: string;
  $bottom?: string;
  $mobileBottom?: string;
  $right?: string;
  $mobileRight?: string;
}

const MainContainer = styled.div<MainContainerProps>`
  ${({ $position }) => $position && `position: ${$position};`}
  ${({ $top }) => $top && `top: ${$top};`}
	${({ $bottom }) => $bottom && `bottom: ${$bottom};`}
	${({ $left }) => $left && `left: ${$left};`}
	${({ $right }) => $right && `right: ${$right};`}
	
	width: ${(props) => props.$width};

  aspect-ratio: 1 / 1;
  border-radius: 10%;
  cursor: pointer;
  transition: all 0.3s ease;

  &&:hover {
    opacity: 0.85;
    scale: 1.09;
    filter: drop-shadow(0px 0px 3px rgb(255, 255, 255));
  }

  @media (orientation: portrait) {
    ${({ $mobilePosition }) =>
      $mobilePosition && `position: ${$mobilePosition};`}
    ${({ $mobileTop }) => $mobileTop && `top: ${$mobileTop};`}
		${({ $mobileBottom }) => $mobileBottom && `bottom: ${$mobileBottom};`}
		${({ $mobileLeft }) => $mobileLeft && `left: ${$mobileLeft};`}
		${({ $mobileRight }) => $mobileRight && `right: ${$mobileRight};`}
  }
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const IconImage = styled.img`
  width: 100%;
  height: auto;
  margin: auto;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////    MAIN COMPONENT   ////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface IconContainerProps {
  iconUrl: string;
  iconImgAlt: string;
  width: string;
  position?: string;
  mobilePosition?: string;
  top?: string;
  mobileTop?: string;
  left?: string;
  mobileLeft?: string;
  bottom?: string;
  mobileBottom?: string;
  right?: string;
  mobileRight?: string;

  onClick: () => void;
}

function IconContainer({
  iconUrl,
  iconImgAlt,
  width,
  position,
  mobilePosition,
  top,
  mobileTop,
  left,
  mobileLeft,
  bottom,
  mobileBottom,
  right,
  mobileRight,
  onClick,
}: IconContainerProps) {
  return (
    <MainContainer
      id="icon-main-container"
      $width={width}
      $position={position}
      $mobilePosition={mobilePosition}
      $top={top}
      $mobileTop={mobileTop}
      $left={left}
      $mobileLeft={mobileLeft}
      $bottom={bottom}
      $mobileBottom={mobileBottom}
      $right={right}
      $mobileRight={mobileRight}
      onClick={onClick}
    >
      <IconImage src={iconUrl} alt={iconImgAlt} />
    </MainContainer>
  );
}

export default IconContainer;
