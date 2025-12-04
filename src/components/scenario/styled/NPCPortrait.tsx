import { NPCName } from "../../../store/slices/aiChatSlice";
import { GLOBAL_COLORS } from "../../../theme";
import styled from "styled-components";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface MainContainerProps {
  $width: string;
}

const MainContainer = styled.div<MainContainerProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: ${({ $width }) => $width};
  background-color: ${GLOBAL_COLORS.scenario.portraitBackground};
  border-radius: 10px;
  border: 2px solid ${GLOBAL_COLORS.white};
  cursor: pointer;
  box-shadow: 3px 3px 8px 0px ${GLOBAL_COLORS.black};
  transition:
    opacity 0.3s ease-in-out,
    box-shadow 0.3s ease-in-out;

  &:hover {
    box-shadow: 0px 0px 8px 4px ${GLOBAL_COLORS.white};
    opacity: 0.8;
  }
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const Portrait = styled.img`
  width: 100%;
  height: auto;
  border-radius: 10px;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface NPCNameTextProps {
  $fontSize: string;
}

const NPCNameText = styled.p<NPCNameTextProps>`
  margin: 0.8vh 0;
  font-size: ${({ $fontSize }) => $fontSize};
  color: ${GLOBAL_COLORS.scenario.npcName};
  text-align: center;
  letter-spacing: 1.1px;
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////    MAIN COMPONENT   ////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface NPCPortraitProps {
  portraitSrc: string;
  portraitWidth: string;
  npcName: NPCName;
  npcNameSize: string;
  onClick: (npcName: NPCName) => void;
}

function NPCPortrait({
  portraitSrc,
  portraitWidth,
  npcName,
  npcNameSize,
  onClick,
}: NPCPortraitProps) {
  return (
    <MainContainer
      id="portrait-main-container"
      $width={portraitWidth}
      onClick={() => onClick(npcName)}
    >
      <Portrait src={portraitSrc} alt={`Retrato de ${npcName}`} />
      <NPCNameText $fontSize={npcNameSize}>{npcName}</NPCNameText>
    </MainContainer>
  );
}

export default NPCPortrait;
