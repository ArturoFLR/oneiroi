import {
  use,
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
import TextViewer from "./styled/TextViewer";
import { ModalData } from "./scenarioTypes";
import ModalViewer from "./styled/ModalViewer";

import nataliaImg from "@assets/graphics/portraits/Natalia_9.webp";
import jonasImg from "@assets/graphics/portraits/Jonas-portrait_02.jpg";
import wideImg1 from "@assets/graphics/backgrounds/clouds-stars_02.webp";
import wideImg2 from "@assets/graphics/scenarios/casa_natalia/rooms/casa-natalia-salon_01.webp";
import squareImg1 from "@assets/graphics/backgrounds/main-menu-bg.webp";

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function ScenarioDirector() {
  // const [loadState, setLoadState] = useState<"loading" | "loaded">("loading");

  const [textViewerText, setTextViewerText] = useState<string[]>([]);
  const [isTextViewerOpen, setIsTextViewerOpen] = useState<boolean>(false);
  const [isTextViewerWriting, setIsTextViewerWriting] =
    useState<boolean>(false);
  const [textViewerBuffer, setTextViewerBuffer] = useState<string[]>([]);

  const [modalViewerData, setModalViewerData] = useState<ModalData>({
    text: ["Placeholder Modal"],
  });
  const [isModalViewerOpen, setIsModalViewerOpen] = useState<boolean>(false);
  const [isModalViewerFadingOut, setIsModalViewerFadingOut] =
    useState<boolean>(false);
  const [modalViewerBuffer, setModalViewerBuffer] = useState<ModalData[]>([]);

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
  const [textViewerTextSize, setTextViewerTextSize] = useState<string>("0px");
  const [textViewerArrowButtonSize, setTextViewerArrowButtonSize] =
    useState<string>("0px");
  const [modalViewerTextSize, setModalViewerTextSize] = useState<string>("0px");
  const [modalViewerButtonSize, setModalViewerButtonSize] =
    useState<string>("0px");

  const screenFaderRef = useRef<HTMLDivElement>(null);
  const fadeOutTimerRef = useRef<number>(0);
  const closeMapTimerRef = useRef<number>(0);
  const fadeOutRoomViewerTimerRef = useRef<number>(0);
  const modalViewerFadeTimerRef = useRef<number>(0);

  const mainFadeDuration = 1500;
  const mapFadeDuration = 500;
  const roomViewerFadeDuration = 800;
  const textViewerTextAnimationTime = 18;
  const modalViewerFadeDuration = 500;

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

  ////////////////////////////////////////////////////   TEXT VIEWER HANDLERS   ///////////////////////////////////////////////////////

  // Abre o cierra TextViewer
  const toogleTextViewerVisibility = useCallback(() => {
    setIsTextViewerOpen(!isTextViewerOpen);
  }, [isTextViewerOpen]);

  // Determina si la animación del texto en curso ha terminado o no
  const setTextAnimHasEnded = useCallback(() => {
    setIsTextViewerWriting(false);
  }, []);

  // Envia un nuevo mensaje al TextViewer (a su buffer)
  const sendMessageToTextViewer = useCallback(
    (message: string) => {
      if (!isTextViewerOpen) {
        toogleTextViewerVisibility();
      }

      setTextViewerBuffer((prevBuffer) => [...prevBuffer, message]);
    },
    [isTextViewerOpen, toogleTextViewerVisibility]
  );

  // Si hay mensajes en el buffer y no hay animación del texto en curso, imprime uno de los mensajes del buffer y lo borra.
  useEffect(() => {
    if (textViewerBuffer.length > 0 && !isTextViewerWriting) {
      setIsTextViewerWriting(true);

      const newTextViewerText = [...textViewerText, textViewerBuffer[0]];
      setTextViewerText(newTextViewerText);
      textViewerBuffer.shift();
    }
  }, [textViewerBuffer, isTextViewerWriting, textViewerText]);

  ////////////////////////////////////////////////////   TEXT VIEWER HANDLERS FIN  ///////////////////////////////////////////////////

  ////////////////////////////////////////////////////   MODAL VIEWER HANDLERS   ///////////////////////////////////////////////////////

  function openModalViewer() {
    setIsModalViewerOpen(true);
  }

  function closeModalViewer(callback?: () => void) {
    setIsModalViewerFadingOut(true);

    modalViewerFadeTimerRef.current = window.setTimeout(() => {
      setIsModalViewerOpen(false);
      if (callback) callback();
    }, modalViewerFadeDuration);
  }

  function addNewModalToBuffer(modal: ModalData) {
    setModalViewerBuffer((prevBuffer) => [...prevBuffer, modal]);
  }

  // Si hay modales en el buffer y no hay ninguno abierto en este momento, abre el más antiguo y lo borra del buffer.
  useEffect(() => {
    if (modalViewerBuffer.length > 0 && !isModalViewerOpen) {
      setModalViewerData(modalViewerBuffer[0]);
      modalViewerBuffer.shift();

      setIsModalViewerFadingOut(false);
      openModalViewer();
    }
  }, [modalViewerBuffer, isModalViewerOpen]);

  // Modal Viewer TEST
  // const modalViewerTestFlag = useRef(false);

  // useEffect(() => {
  //   if (modalViewerTestFlag.current) return;
  //   modalViewerTestFlag.current = true;

  //   const modal1: ModalData = {
  //     text: ["Este modal solo tiene texto. A ver qué tal."],
  //   };

  //   const modal2: ModalData = {
  //     text: [
  //       "Este modal también tiene únicamente texto, pero tiene dos párrafos, para ver qué tal andan de espacio entre ellos.",
  //       "El párrafo anterior era bastante largo para poder comprobar qué tal están los espacios entre líneas.",
  //     ],
  //   };

  //   const modal3: ModalData = {
  //     text: ["Este modal tiene texto y un retrato de NPC. A ver qué tal."],
  //     startImgUrl: nataliaImg,
  //     startImgAlt: "Natalia",
  //     startImgBorder: true,
  //     startImgIsWide: false,
  //     startImgPosition: "center",
  //     endImgUrl: wideImg1,
  //     endImgAlt: "Nubes",
  //     endImgBorder: false,
  //     endImgIsWide: true,
  //     endImgPosition: "center",
  //   };

  //   const modal4: ModalData = {
  //     text: [
  //       "Jonas, te pido por favor que dejes en paz la ropa de mi abuela. No me parece serio que andes por la casa con sus enaguas.",
  //       "Hazme caso o te enciendo el pelo lumbre.",
  //     ],
  //     startImgUrl: nataliaImg,
  //     startImgAlt: "Natalia",
  //     startImgBorder: true,
  //     startImgIsWide: false,
  //     startImgPosition: "center",
  //   };

  //   const modal5: ModalData = {
  //     text: [
  //       "En la parte superior izquierda de la pantalla puedes ver el icono mapa, que te permite moverte por los escenarios.",
  //     ],
  //     startImgUrl: wideImg1,
  //     startImgAlt: "Nubes",
  //     startImgBorder: true,
  //     startImgIsWide: true,
  //     startImgPosition: "center",
  //     onOkClick: () => console.log("Click!"),
  //   };

  //   window.setTimeout(() => {
  //     addNewModalToBuffer(modal1);
  //   }, 3000);

  //   window.setTimeout(() => {
  //     addNewModalToBuffer(modal2);
  //   }, 6000);

  //   window.setTimeout(() => {
  //     addNewModalToBuffer(modal3);
  //   }, 10000);

  //   window.setTimeout(() => {
  //     addNewModalToBuffer(modal4);
  //   }, 12000);

  //   window.setTimeout(() => {
  //     addNewModalToBuffer(modal5);
  //   }, 15000);
  // }, []);

  // Modal Viewer TEST FIN

  ////////////////////////////////////////////////////   MODAL VIEWER HANDLERS FIN  ////////////////////////////////////////////////////

  //////////////////////////////////////////////////// CÁLCULO DEL TAMAÑO DE LOS ELEMENTOS ///////////////////////////////////

  const portraitNameProportion = 80;
  const portraitWidthProportion = 11;
  const textViewerTextProportion = 67;
  const textViewerArrowButtonProportion = 35;
  const IconsProportion = 25;
  const ModalViewerButtonProportion = 30;
  const ModalViewerTextProportion = 50;

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
      setTextViewerTextSize(
        calcFontSize(screenFaderRef.current, textViewerTextProportion, 18)
      );
      setTextViewerArrowButtonSize(
        calcFontSize(
          screenFaderRef.current,
          textViewerArrowButtonProportion,
          20
        )
      );

      setIconsSize(calcFontSize(screenFaderRef.current, IconsProportion, 80));

      setModalViewerButtonSize(
        calcFontSize(screenFaderRef.current, ModalViewerButtonProportion, 30)
      );
      setModalViewerTextSize(
        calcFontSize(screenFaderRef.current, ModalViewerTextProportion, 22)
      );
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
  }, [
    IconsProportion,
    portraitNameProportion,
    portraitWidthProportion,
    textViewerArrowButtonProportion,
    textViewerTextProportion,
  ]);

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
      clearTimeout(modalViewerFadeTimerRef.current);
    };
  }, []);

  return (
    <ScreenFader
      elementReference={screenFaderRef}
      fadeDuration={mainFadeDuration}
      visible={!applyFadeOut}
      flex={true}
      flexDirection="column"
      justifyContent={windowSize[0] > windowSize[1] ? "center" : "flex-start"}
      alignItems="center"
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
        {windowSize[0] >= windowSize[1] && (
          <TextViewer
            windowSize={windowSize}
            isOpen={isTextViewerOpen}
            textToShow={textViewerText}
            animationTime={textViewerTextAnimationTime}
            textSize={textViewerTextSize}
            buttonSize={textViewerArrowButtonSize}
            onArrowButtonClick={toogleTextViewerVisibility}
            onTextAnimationEnd={setTextAnimHasEnded}
          />
        )}

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

      {windowSize[0] < windowSize[1] && (
        <TextViewer
          windowSize={windowSize}
          isOpen={isTextViewerOpen}
          textToShow={textViewerText}
          animationTime={textViewerTextAnimationTime}
          textSize={textViewerTextSize}
          buttonSize={textViewerArrowButtonSize}
          onArrowButtonClick={toogleTextViewerVisibility}
          onTextAnimationEnd={setTextAnimHasEnded}
        />
      )}

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

      {isModalViewerOpen && (
        <ModalViewer
          windowSize={windowSize}
          modalData={modalViewerData}
          fadeDuration={modalViewerFadeDuration}
          isFadingOut={isModalViewerFadingOut}
          textSize={modalViewerTextSize}
          buttonSize={modalViewerButtonSize}
          onOkButtonClick={closeModalViewer}
        ></ModalViewer>
      )}
    </ScreenFader>
  );
}

export default ScenarioDirector;
