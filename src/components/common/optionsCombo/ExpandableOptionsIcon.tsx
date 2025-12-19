import { useState } from "react";
import ClickableIconContainer from "../icons/ClickableIconContainer";
import styled, { css } from "styled-components";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface MainContainerProps {
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
  $iconWidthInPxNumber: number;
  $expansionDirection: string;
  $numberOfIcons: number;
}

const MainContainer = styled.div<MainContainerProps>`
  display: flex;
  overflow: hidden;
  pointer-events: none;

  ${({ $expansionDirection }) => {
    if ($expansionDirection === "up") {
      return css`
        flex-direction: column-reverse;
        row-gap: 2rem;
      `;
    } else if ($expansionDirection === "down") {
      return css`
        flex-direction: column;
        row-gap: 2rem;
      `;
    } else if ($expansionDirection === "left") {
      return css`
        flex-direction: row-reverse;
        column-gap: 2rem;
      `;
    } else if ($expansionDirection === "right") {
      return css`
        flex-direction: row;
        column-gap: 2rem;
      `;
    }
  }}

  ${({ $position }) => $position && `position: ${$position};`}
  ${({ $top }) => $top && `top: ${$top};`}
	${({ $bottom }) => $bottom && `bottom: ${$bottom};`}
	${({ $left }) => $left && `left: ${$left};`}
	${({ $right }) => $right && `right: ${$right};`}
	
  ${({ $iconWidthInPxNumber, $expansionDirection, $numberOfIcons }) => {
    if ($expansionDirection === "up" || $expansionDirection === "down") {
      return css`
        height: ${$iconWidthInPxNumber * ($numberOfIcons + 2)}px;
        width: auto;
      `;
    } else {
      return css`
        height: auto;
        width: ${$iconWidthInPxNumber * ($numberOfIcons + 2)}px;
      `;
    }
  }}

  padding: 0.7rem;

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

interface OptionsIconsContainerProps {
  $expansionDirection: string;
  $isExpanded: boolean;
  $animationDurationMs: number;
}

const OptionsIconsContainer = styled.div<OptionsIconsContainerProps>`
  display: flex;
  pointer-events: auto;
  position: relative;
  z-index: 1;
  transition:
    top ${({ $animationDurationMs }) => $animationDurationMs}ms ease-in-out,
    left ${({ $animationDurationMs }) => $animationDurationMs}ms ease-in-out,
    opacity 300ms linear;

  ${({ $expansionDirection, $isExpanded }) => {
    if ($expansionDirection === "up") {
      return css`
        flex-direction: column-reverse;
        row-gap: 1rem;
        top: ${() => ($isExpanded ? "0%" : "100%")};
        opacity: ${() => ($isExpanded ? 1 : 0)};
      `;
    } else if ($expansionDirection === "down") {
      return css`
        flex-direction: column;
        row-gap: 1rem;
        top: ${() => ($isExpanded ? "0%" : "-100%")};
        opacity: ${() => ($isExpanded ? 1 : 0)};
      `;
    } else if ($expansionDirection === "left") {
      return css`
        flex-direction: row-reverse;
        column-gap: 1rem;
        left: ${() => ($isExpanded ? "0%" : "100%")};
        opacity: ${() => ($isExpanded ? 1 : 0)};
      `;
    } else if ($expansionDirection === "right") {
      return css`
        flex-direction: row;
        column-gap: 1rem;
        left: ${() => ($isExpanded ? "0%" : "-100%")};
        opacity: ${() => ($isExpanded ? 1 : 0)};
      `;
    }
  }}
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////    MAIN COMPONENT   ////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type OptionData = {
  iconImgUrl: string;
  iconImgAlt: string;
  onClick: () => void;
};

interface ExpandableOptionsIconProps {
  mainIconImgUrl: string;
  mainIconImgAlt: string;
  optionsListData: OptionData[];
  iconWidth: string;
  expansionDirection: "up" | "down" | "left" | "right";
  animationDurationMs?: number;
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
  onClickEffect?: () => void; // El componente tiene la lógica necesaria para expandirse, pero a veces nos interesa ejecutar algún efecto cuando se pulse, desde un componente superior.
}

function ExpandableOptionsIcon({
  mainIconImgUrl,
  mainIconImgAlt,
  optionsListData,
  iconWidth,
  expansionDirection,
  animationDurationMs = 500,
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
  onClickEffect,
}: ExpandableOptionsIconProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const iconWidthInPxNumber = Number(iconWidth.replace("px", ""));

  function onMainIconClick() {
    if (onClickEffect) onClickEffect();
    setIsExpanded(!isExpanded);
  }

  return (
    <MainContainer
      id="expandable-options-main-container"
      $iconWidthInPxNumber={iconWidthInPxNumber}
      $expansionDirection={expansionDirection}
      $numberOfIcons={optionsListData.length}
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
    >
      <ClickableIconContainer
        iconUrl={mainIconImgUrl}
        iconImgAlt={mainIconImgAlt}
        width={iconWidth}
        zIndex={2}
        onClick={onMainIconClick}
      />

      <OptionsIconsContainer
        $expansionDirection={expansionDirection}
        $isExpanded={isExpanded}
        $animationDurationMs={animationDurationMs}
      >
        {optionsListData.map((optionData, index) => (
          <ClickableIconContainer
            key={index}
            iconUrl={optionData.iconImgUrl}
            iconImgAlt={optionData.iconImgAlt}
            width={iconWidth}
            onClick={optionData.onClick}
          />
        ))}
      </OptionsIconsContainer>
    </MainContainer>
  );
}

export default ExpandableOptionsIcon;
