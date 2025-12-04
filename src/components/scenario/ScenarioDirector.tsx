import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks/reduxHooks";
import ScreenFader from "../common/ScreenFader";
import { GameMainState, setMainState } from "../../store/slices/mainStateSlice";
import allScenariosData from "../../data/scenarios/allScenariosData";
import RoomViewer from "./styled/RoomViewer";
import IconContainer from "./styled/IconContainer";
import calcFontSize from "../../utils/calcFontSize";
import MapGenerator from "../map/MapGenerator";
import MapCell from "../../classes/map/MapCell";
import { setCurrentMapCellId } from "../../store/slices/scenarioSlice";
import getMainCell from "../../utils/scenario/getMainCell";
import { NPCName, setCurrentNPCName } from "../../store/slices/aiChatSlice";

///////////////////////////////////////////  ASSET IMPORTS  ////////////////////////////////////////////////////////

import mapIconImgSrc from "@assets/graphics/icons/scenario/icono-mapa.webp";

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function ScenarioDirector() {
  // const [loadState, setLoadState] = useState<"loading" | "loaded">("loading");
  const [isMapOpen, setIsMapOpen] = useState<boolean>(false);
  const [fadeOutMap, setFadeOutMap] = useState<boolean>(false);

  const [fadeOutRoomViewer, setFadeOutRoomViewer] = useState<boolean>(false);

  // const [isCharacterMenuOpen, setIsCharacterMenuOpen] =
  //   useState<boolean>(false);
  // const [isOptionsOpen, setIsOptionsOpen] = useState<boolean>(false);
  // const [isInventoryOpen, setIsInventoryOpen] = useState<boolean>(false);
  // const [isSpellListOpen, setIsSpellListOpen] = useState<boolean>(false);

  // const [isRoomObjectsListOpen, setIsRoomObjectsListOpen] =
  //   useState<boolean>(false);

  // Este fadeout se aplica cuando cambiamos a otro estado principal del juego (por ejemplo una conversación, una cinemática, etc)
  const [applyFadeOut, setApplyFadeOut] = useState<boolean>(false);

  const [windowSize, setWindowSize] = useState<[number, number]>([0, 0]);

  const [iconsSize, setIconsSize] = useState<string>("0px");
  const [portraitWideSize, setPortraitWideSize] = useState<string>("0px");
  const [portraitNameSize, setPortraitNameSize] = useState<string>("0px");

  const screenFaderRef = useRef<HTMLDivElement>(null);
  const fadeOutTimerRef = useRef<number>(0);
  const closeMapTimerRef = useRef<number>(0);
  const fadeOutRoomViewerTimerRef = useRef<number>(0);

  const mainFadeDuration = 1500;
  const mapFadeDuration = 500;
  const roomViewerFadeDuration = 800;

  ///////////////////////////////////////////////////Redux y datos del escenario actual.
  const dispatch = useAppDispatch();

  const scenarioData = useAppSelector(
    (state) => allScenariosData[state.scenarioData.scenarioName]
  );

  const mapCellId = useAppSelector((state) => state.scenarioData.mapCellId);

  const scenarioMapData: MapCell[] = scenarioData.map;
  const actualCellData = scenarioData.map.find(
    (cell) => cell.id === mapCellId
  )!;
  const actualCellImageSrc = actualCellData.imageSrc;
  const isActualImgWide = actualCellData.widePicture;
  const actualCellNPCList = actualCellData?.npcsList;

  /////////////////////////////////////////////////////Redux Fin

  //Esta función permite pasar a otro estado principal (aiChat, cinematic, main menu, etc) aplicando un fadeout primero.
  function changeMainStateWithFadeout(newMainState: GameMainState) {
    setApplyFadeOut(true);

    fadeOutTimerRef.current = window.setTimeout(() => {
      dispatch(setMainState(newMainState));
    }, mainFadeDuration);
  }

  // Hace visibles las celdas alcanzables desde la actual.
  const makeReachableCellsVisible = useCallback(() => {
    const reachableCells = actualCellData.reachableCells;
    scenarioMapData.forEach((mapCell) => {
      if (reachableCells?.includes(mapCell.id)) {
        mapCell.hidden = false;
      }
    });
  }, [actualCellData, scenarioMapData]);

  /////////////////////////////////////////////////////   MAP HANDLERS   ///////////////////////////////////////////////////////
  function openMap() {
    setFadeOutMap(false);
    setIsMapOpen(true);
  }

  function closeMap(e: React.MouseEvent<HTMLElement>) {
    // Evitamos que el evento se propague al contenedor padre si se ha pulsado en el mapa
    if (e.target === e.currentTarget) {
      setFadeOutMap(true);

      closeMapTimerRef.current = window.setTimeout(() => {
        setIsMapOpen(false);
      }, mapFadeDuration);
    }
  }

  // Función que maneja el cambio de celda cerrando el mapa y creando un fadeout - fadein del RoomViewer
  function handleGoToNewCell(newCellId: number) {
    setFadeOutMap(true);

    closeMapTimerRef.current = window.setTimeout(() => {
      setIsMapOpen(false);
      setFadeOutRoomViewer(true);

      fadeOutRoomViewerTimerRef.current = window.setTimeout(() => {
        dispatch(setCurrentMapCellId(newCellId));
        setFadeOutRoomViewer(false);
      }, roomViewerFadeDuration);
    }, mapFadeDuration);
  }

  function handleCellClick(e: React.MouseEvent<HTMLElement>) {
    const clickedCell = e.target as HTMLDivElement;
    const clickedCellId = Number(clickedCell.id);

    const isClickedCellReachable =
      actualCellData.reachableCells?.includes(clickedCellId);

    if (isClickedCellReachable) {
      // Si la celda clicada forma parte de un grupo, obtenemos el id de la celda principal del grupo
      const mainGroupCellId = getMainCell(scenarioData, clickedCellId);

      handleGoToNewCell(mainGroupCellId);
    } else return; //Si la celda no es alcanzable, no hacemos nada
  }

  //////////////////////////////////////////////////// MAP HANDLERS FIN ///////////////////////////////////////////////////////

  // Gestiona los cambios cuando el usuario pulsa sobre un retrato de NPC
  function handlePortraitClick(npcName: NPCName) {
    dispatch(setCurrentNPCName(npcName));
    changeMainStateWithFadeout("aiChat");
  }

  //////////////////////////////////////////////////// CÁLCULO DEL TAMAÑO DE LOS ELEMENTOS ///////////////////////////////////

  const portraitNameProportion = 80;
  const portraitWidthProportion = 11;
  // const textBoxNameProportion = 40;
  const IconsProportion = 25;

  // Calcula la proporción de la pantalla y el tamaño de las fuentes, y establece un listener
  // para que se recalculen si hay un "resize" de la pantalla.
  useLayoutEffect(() => {
    function setNewFontSize() {
      setPortraitNameSize(
        calcFontSize(screenFaderRef.current, portraitNameProportion, 16)
      );
      setPortraitWideSize(
        calcFontSize(screenFaderRef.current, portraitWidthProportion, 80)
      );
      //     setTextBoxNameSize(
      //       calcFontSize(mainContainerElement.current, textBoxNameProportion, 25)
      //     );
      //     setTextBoxTextSize(
      //       calcFontSize(mainContainerElement.current, textBoxTextProportion, 20)
      //     );

      setIconsSize(calcFontSize(screenFaderRef.current, IconsProportion, 80));
    }
    function setNewWindowSize() {
      setWindowSize([window.innerWidth, window.innerHeight]);
    }
    function handleResize() {
      setNewFontSize();
      setNewWindowSize();
    }
    //   // Hace el cálculo inicial
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [IconsProportion, portraitNameProportion, portraitWidthProportion]);

  //////////////////////////////////////////////////// FIN CÁLCULO DEL TAMAÑO DE LOS ELEMENTOS ////////////////////////////////

  // Cuando cambia la celda actual, hacemos visibles las celdas alcanzables desde ella, si no lo son ya.
  useEffect(() => {
    makeReachableCellsVisible();
  }, [mapCellId, makeReachableCellsVisible]);

  // Limpieza de Timers
  useEffect(() => {
    return () => {
      clearTimeout(fadeOutTimerRef.current);
      clearTimeout(closeMapTimerRef.current);
      clearTimeout(fadeOutRoomViewerTimerRef.current);
    };
  }, []);

  return (
    <ScreenFader
      elementReference={screenFaderRef}
      fadeDuration={mainFadeDuration}
      visible={!applyFadeOut}
      flex={true}
      justifyContent="center"
      alignItems={windowSize[0] > windowSize[1] ? "center" : undefined}
    >
      {isMapOpen && (
        <MapGenerator
          actualCellData={actualCellData}
          mapCells={scenarioMapData}
          visible={!fadeOutMap}
          fadeDuration={mapFadeDuration}
          onClickOutsideMap={closeMap}
          onCellClick={handleCellClick}
        />
      )}

      <RoomViewer
        fadeOut={fadeOutRoomViewer}
        fadeDuration={roomViewerFadeDuration}
        windowSize={windowSize}
        roomImgUrl={actualCellImageSrc}
        widePicture={isActualImgWide}
        npcList={actualCellNPCList ? actualCellNPCList : undefined}
        npcNameSize={portraitNameSize}
        npcPortraitSize={portraitWideSize}
        handlePortraitClick={handlePortraitClick}
      >
        {/* Icono del Mapa */}
        {windowSize[0] > windowSize[1] && (
          <IconContainer
            iconUrl={mapIconImgSrc}
            iconImgAlt="Mapa"
            position="absolute"
            top="1%"
            left="1%"
            mobileTop="auto"
            mobileBottom="3%"
            mobileLeft="auto"
            mobileRight="3%"
            width={iconsSize}
            onClick={openMap}
          />
        )}
      </RoomViewer>

      {/* Icono del Mapa */}
      {windowSize[0] < windowSize[1] && (
        <IconContainer
          iconUrl={mapIconImgSrc}
          iconImgAlt="Mapa"
          position="absolute"
          top="3%"
          right="4%"
          mobileTop="auto"
          mobileBottom="3%"
          mobileLeft="auto"
          mobileRight="3%"
          width={iconsSize}
          onClick={openMap}
        />
      )}
    </ScreenFader>
  );
}

export default ScenarioDirector;
