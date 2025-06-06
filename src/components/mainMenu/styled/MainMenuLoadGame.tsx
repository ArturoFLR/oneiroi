import TextButton from "../../buttons/TextButton";
import { GLOBAL_COLORS, GLOBAL_FONTS } from "../../../theme";
import styled from "styled-components";
import { useLayoutEffect, useState } from "react";
import { isLocalStorageAvailable } from "../../../utils/localStorageManipulation";

interface SectionTitleProps {
  $fontSize: string;
}

const SectionTitle = styled.p<SectionTitleProps>`
  width: 100%;
  color: ${GLOBAL_COLORS.buttons.MenuTextButton.text};
  font-size: ${({ $fontSize }) => $fontSize};
  font-family: ${GLOBAL_FONTS.buttons.MenuTextButton};
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface NoStorageWarningProps {
  $fontSize: string;
}

const NoStorageWarning = styled.p<NoStorageWarningProps>`
  width: 100%;
  color: ${GLOBAL_COLORS.buttons.MenuTextButton.text};
  font-size: ${({ $fontSize }) => $fontSize};
`;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////    MAIN COMPONENT   ////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface MainMenuLoadGameProps {
  setIsStorageModalShown: React.Dispatch<React.SetStateAction<boolean>>;
  onBackClick: () => void;
  titleTextSize: string;
  backButtonTextSize: string;
  noStorageWarningTextSize: string;
}

function MainMenuLoadGame({
  setIsStorageModalShown,
  onBackClick,
  titleTextSize,
  backButtonTextSize,
  noStorageWarningTextSize,
}: MainMenuLoadGameProps) {
  const [isStorageAvailable, setIsStorageAvailable] = useState<boolean>(true);

  useLayoutEffect(() => {
    // Determinamos si el Local Storage está disponible para mostrar los badges de las partidas o un aviso de que no están disponibles.
    setIsStorageAvailable(isLocalStorageAvailable());

    // Si no hay Local Storage, mostramos el modal de MainMenu para indicar por qué no se pueden guardar / salvar partidas.
    setIsStorageModalShown(!isLocalStorageAvailable());
  }, [setIsStorageModalShown]);

  return (
    <>
      <SectionTitle $fontSize={titleTextSize}>Selecciona Partida</SectionTitle>

      {!isStorageAvailable && (
        <NoStorageWarning $fontSize={noStorageWarningTextSize}>
          - No Disponible -
        </NoStorageWarning>
      )}

      <TextButton
        onClick={onBackClick}
        fontSize={backButtonTextSize}
        animated={false}
        color={GLOBAL_COLORS.buttons.MenuTextButton.text}
        textShadow={GLOBAL_COLORS.buttons.MenuTextButton.textShadow}
        hoverColor={GLOBAL_COLORS.buttons.MenuTextButton.textHover}
        fontFamily={GLOBAL_FONTS.buttons.MenuTextButton}
      >
        &lt;&lt; Volver
      </TextButton>
    </>
  );
}

export default MainMenuLoadGame;
