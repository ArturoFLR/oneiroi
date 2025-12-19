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
import ClickableIconContainer from "../common/icons/ClickableIconContainer";
import calcFontSize from "../../utils/calcFontSize";
import MapGenerator from "../map/MapGenerator";
import MapCell from "../../classes/map/MapCell";
import { setCurrentMapCellId } from "../../store/slices/scenarioSlice";
import getMainCell from "../../utils/scenario/getMainCell";
import { NPCName, setCurrentNPCName } from "../../store/slices/aiChatSlice";
import {
  setIsInventoryTutorialSeen,
  setIsMapTutorial2Seen,
  setIsMapTutorialSeen,
  setIsNPCTutorialSeen,
  setIsOptionsTutorialSeen,
  setIsPersonalTutorialSeen,
  setIsPowersTutorialSeen,
} from "../../store/slices/tutorialSlice";
import TextViewer from "./styled/TextViewer";
import { ModalData } from "./scenarioTypes";
import {
  inventoryTutorialModal,
  mapTutorialModal,
  mapTutorialModal2,
  npcTutorialModal,
  optionsTutorialModal,
  personalTutorialModal,
  personalTutorialModalMobile,
  powersTutorialModal,
} from "../../data/tutorialData/tutorialModalsData";
import ModalWithPictures from "../common/modals/ModalWithPictures";

///////////////////////////////////////////  ASSET IMPORTS  ////////////////////////////////////////////////////////

import mapIconImgSrc from "@assets/graphics/icons/scenario/icono-mapa.webp";
import personalImgSrc from "@assets/graphics/icons/scenario/icono-persona.webp";
import optionsImgSrc from "@assets/graphics/icons/scenario/icono-opciones.webp";
import inventoryImgSrc from "@assets/graphics/icons/scenario/icono-inventario.webp";
import powersImgSrc from "@assets/graphics/icons/scenario/icono-hechizos.webp";
import ExpandableOptionsIcon, {
  OptionData,
} from "../common/optionsCombo/ExpandableOptionsIcon";

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
  const [isModalWithPicturesOpen, setIsModalWithPicturesOpen] =
    useState<boolean>(false);
  const [isModalWithPicturesFadingOut, setIsModalWithPicturesFadingOut] =
    useState<boolean>(false);
  const [modalWithPicturesBuffer, setModalWithPicturesBuffer] = useState<
    ModalData[]
  >([]);

  const [isMapOpen, setIsMapOpen] = useState<boolean>(false);
  const [fadeOutMap, setFadeOutMap] = useState<boolean>(false);

  const [fadeOutRoomViewer, setFadeOutRoomViewer] = useState<boolean>(false);

  // const [isCharacterMenuOpen, setIsCharacterMenuOpen] =
  //   useState<boolean>(false);
  const [isPersonalOpen, setIsPersonalOpen] = useState<boolean>(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState<boolean>(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState<boolean>(false);
  const [isPowersMenuOpen, setIsPowersMenuOpen] = useState<boolean>(false);

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
  const [modalWithPicturesTextSize, setModalWithPicturesTextSize] =
    useState<string>("0px");
  const [modalWithPicturesButtonSize, setModalWithPicturesButtonSize] =
    useState<string>("0px");

  const screenFaderRef = useRef<HTMLDivElement>(null);
  const fadeOutTimerRef = useRef<number>(0);
  const closeMapTimerRef = useRef<number>(0);
  const fadeOutRoomViewerTimerRef = useRef<number>(0);
  const modalViewerFadeTimerRef = useRef<number>(0);
  const tutorialWaitingTimerRef = useRef<number>(0);

  // Flag que evita que se ejecuten eventos del escenario cuando ya se ha iniciado el fundido que precede al cambio hacia aiChat
  const isNPCProtraitClicked = useRef<boolean>(false);

  const mainFadeDuration = 1500;
  const mapFadeDuration = 500;
  const roomViewerFadeDuration = 800;
  const textViewerTextAnimationTime = 18;
  const modalWithPicturesFadeDuration = 500;
  const tutorialWaitingTime = 1000;

  ///////////////////////////////////////////////////REDUX y datos del escenario actual.
  const dispatch = useAppDispatch();

  const scenarioData = useAppSelector(
    (state) => allScenariosData[state.scenarioData.scenarioName]
  );
  const mapCellId = useAppSelector((state) => state.scenarioData.mapCellId);
  const tutorialData = useAppSelector((state) => state.tutorialData);

  const scenarioMapData: MapCell[] = scenarioData.map;
  const actualCellData = scenarioData.map.find(
    (cell) => cell.id === mapCellId
  )!;
  const actualCellImageSrc = actualCellData.imageSrc;
  const isActualImgWide = actualCellData.widePicture;
  const actualCellNPCList = actualCellData?.npcsList;

  /////////////////////////////////////////////////////REDUX FIN

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

  // Gestiona los cambios cuando el usuario pulsa sobre un retrato de NPC
  function handlePortraitClick(npcName: NPCName) {
    isNPCProtraitClicked.current = true;
    dispatch(setCurrentNPCName(npcName));
    changeMainStateWithFadeout("aiChat");
  }

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

  // Cuando cambia la celda actual, hacemos visibles las celdas alcanzables desde ella, si no lo son ya.
  useEffect(() => {
    makeReachableCellsVisible();
  }, [mapCellId, makeReachableCellsVisible]);

  //////////////////////////////////////////////////// MAP HANDLERS FIN ///////////////////////////////////////////////////////

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
    setIsModalWithPicturesOpen(true);
  }

  function closeModalViewer(callback?: () => void) {
    setIsModalWithPicturesFadingOut(true);

    modalViewerFadeTimerRef.current = window.setTimeout(() => {
      setIsModalWithPicturesOpen(false);
      if (callback) callback();
    }, modalWithPicturesFadeDuration);
  }

  function addNewModalToBuffer(modal: ModalData) {
    setModalWithPicturesBuffer((prevBuffer) => [...prevBuffer, modal]);
  }

  // Si hay modales en el buffer y no hay ninguno abierto en este momento, abre el más antiguo y lo borra del buffer.
  useEffect(() => {
    if (modalWithPicturesBuffer.length > 0 && !isModalWithPicturesOpen) {
      setModalViewerData(modalWithPicturesBuffer[0]);
      modalWithPicturesBuffer.shift();

      setIsModalWithPicturesFadingOut(false);
      openModalViewer();
    }
  }, [modalWithPicturesBuffer, isModalWithPicturesOpen]);

  ////////////////////////////////////////////////////   MODAL VIEWER HANDLERS FIN  ////////////////////////////////////////////

  ////////////////////////////////////////////////////   TUTORIAL HANDLERS   //////////////////////////////////////////////////

  // Lanza los tutoriales que se ven nada más entrar en el escenario
  useEffect(() => {
    tutorialWaitingTimerRef.current = window.setTimeout(() => {
      if (isNPCProtraitClicked.current) return;
      window.clearTimeout(tutorialWaitingTimerRef.current);

      // Diálogo con NPC. Común a móvil y escritorio
      if (!tutorialData.isNPCTutorialSeen) {
        addNewModalToBuffer(npcTutorialModal);
        dispatch(setIsNPCTutorialSeen(true));
      }

      // Mapa. Sólo en escritorio (en móvil está dentro del combo "Persona")
      if (!tutorialData.isMapTutorialSeen && windowSize[0] > windowSize[1]) {
        addNewModalToBuffer(mapTutorialModal);
        dispatch(setIsMapTutorialSeen(true));
      }

      // Personal. Escritorio y móvil (cambia el texto)
      if (!tutorialData.isPersonalTutorialSeen) {
        if (windowSize[0] > windowSize[1]) {
          addNewModalToBuffer(personalTutorialModal);
        } else addNewModalToBuffer(personalTutorialModalMobile);

        dispatch(setIsPersonalTutorialSeen(true));
      }
    }, tutorialWaitingTime);
  }, [
    dispatch,
    tutorialData.isNPCTutorialSeen,
    tutorialData.isMapTutorialSeen,
    tutorialData.isPersonalTutorialSeen,
    windowSize,
  ]);

  // Lanza el tutorial para mapa2 (cuando el usuario pulsa en él)
  useEffect(() => {
    if (isMapOpen && !tutorialData.isMapTutorial2Seen) {
      tutorialWaitingTimerRef.current = window.setTimeout(() => {
        addNewModalToBuffer(mapTutorialModal2);
        dispatch(setIsMapTutorial2Seen(true));
      }, tutorialWaitingTime);
    }
  }, [dispatch, tutorialData.isMapTutorial2Seen, isMapOpen]);

  // Se usa para controlar si el combo "Persona" está abierto o cerrado y así poder mostrar tutoriales.
  function handlePersonalIconClick() {
    setIsPersonalOpen((prevIsOpen) => !prevIsOpen);
  }

  // Lanza el tutorial para el desplegable "Persona"
  useEffect(() => {
    if (!isPersonalOpen) return;

    tutorialWaitingTimerRef.current = window.setTimeout(() => {
      // Volvemos a comprobar si el combo está abierto, porque el usuario lo ha podido cerrar antes de que se ejecute el timer.
      if (isPersonalOpen) {
        if (!tutorialData.isOptionsTutorialSeen) {
          addNewModalToBuffer(optionsTutorialModal);
          dispatch(setIsOptionsTutorialSeen(true));
        }

        if (!tutorialData.isInventoryTutorialSeen) {
          addNewModalToBuffer(inventoryTutorialModal);
          dispatch(setIsInventoryTutorialSeen(true));
        }

        if (!tutorialData.isPowersTutorialSeen) {
          addNewModalToBuffer(powersTutorialModal);
          dispatch(setIsPowersTutorialSeen(true));
        }

        if (!tutorialData.isMapTutorialSeen && windowSize[0] <= windowSize[1]) {
          addNewModalToBuffer(mapTutorialModal);
          dispatch(setIsMapTutorialSeen(true));
        }
      }
    }, tutorialWaitingTime);
  }, [
    dispatch,
    tutorialData.isOptionsTutorialSeen,
    isPersonalOpen,
    windowSize,
    tutorialData.isInventoryTutorialSeen,
    tutorialData.isPowersTutorialSeen,
    tutorialData.isMapTutorialSeen,
  ]);

  ////////////////////////////////////////////////////   TUTORIAL HANDLERS FIN  ////////////////////////////////////////////

  //////////////////////////////////////////////////// CÁLCULO DEL TAMAÑO DE LOS ELEMENTOS ///////////////////////////////////

  const portraitNameProportion = 80;
  const portraitWidthProportion = 11;
  const textViewerTextProportion = 67;
  const textViewerArrowButtonProportion = 35;
  const iconsProportion = 25;
  const modalWithPicturesButtonProportion = 30;
  const modalWithPicturesTextProportion = 50;

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

      setIconsSize(calcFontSize(screenFaderRef.current, iconsProportion, 60));

      setModalWithPicturesButtonSize(
        calcFontSize(
          screenFaderRef.current,
          modalWithPicturesButtonProportion,
          30
        )
      );
      setModalWithPicturesTextSize(
        calcFontSize(
          screenFaderRef.current,
          modalWithPicturesTextProportion,
          22
        )
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
    iconsProportion,
    portraitNameProportion,
    portraitWidthProportion,
    textViewerArrowButtonProportion,
    textViewerTextProportion,
  ]);

  //////////////////////////////////////////////////// FIN CÁLCULO DEL TAMAÑO DE LOS ELEMENTOS ////////////////////////////////

  ////////////////////////////////////////////////////   DATOS PARA ICONO "PERSONA"   ////////////////////////////////////////

  const optionsIconData: OptionData = {
    iconImgUrl: optionsImgSrc,
    iconImgAlt: "Opciones",
    onClick: () => setIsOptionsOpen(true),
  };

  const inventoryIconData: OptionData = {
    iconImgUrl: inventoryImgSrc,
    iconImgAlt: "Inventario",
    onClick: () => setIsInventoryOpen(true),
  };

  const powersIconData: OptionData = {
    iconImgUrl: powersImgSrc,
    iconImgAlt: "Poderes",
    onClick: () => setIsPowersMenuOpen(true),
  };

  const expandablePersonaIconData: OptionData[] = [
    optionsIconData,
    inventoryIconData,
    powersIconData,
  ];

  const mapIconData: OptionData = {
    iconImgUrl: mapIconImgSrc,
    iconImgAlt: "Mapa",
    onClick: openMap,
  };

  const expandablePersonaIconDataMobile: OptionData[] = [
    optionsIconData,
    inventoryIconData,
    powersIconData,
    mapIconData,
  ];

  ////////////////////////////////////////////////////   DATOS PARA ICONO "PERSONA" FIN  /////////////////////////////////////

  // Limpieza de Timers
  useEffect(() => {
    return () => {
      clearTimeout(fadeOutTimerRef.current);
      clearTimeout(closeMapTimerRef.current);
      clearTimeout(fadeOutRoomViewerTimerRef.current);
      clearTimeout(modalViewerFadeTimerRef.current);
      clearTimeout(tutorialWaitingTimerRef.current);
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
          <ClickableIconContainer
            iconUrl={mapIconImgSrc}
            iconImgAlt="Mapa"
            position="absolute"
            top="1.5%"
            left="9%"
            mobileTop="auto"
            mobileBottom="3%"
            mobileLeft="auto"
            mobileRight="3%"
            width={iconsSize}
            onClick={openMap}
          />
        )}

        {/* Icono de Persona */}
        {windowSize[0] > windowSize[1] && (
          <ExpandableOptionsIcon
            mainIconImgUrl={personalImgSrc}
            mainIconImgAlt="Opciones de Personaje"
            iconWidth={iconsSize}
            expansionDirection="down"
            optionsListData={expandablePersonaIconData}
            animationDurationMs={700}
            position="absolute"
            top="0.2%"
            left="1%"
            onClickEffect={handlePersonalIconClick}
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

      {/* Icono de Persona */}
      {windowSize[0] <= windowSize[1] && (
        <ExpandableOptionsIcon
          mainIconImgUrl={personalImgSrc}
          mainIconImgAlt="Opciones de Personaje"
          iconWidth={iconsSize}
          expansionDirection="right"
          optionsListData={expandablePersonaIconDataMobile}
          animationDurationMs={700}
          position="absolute"
          top="3%"
          right="4%"
          mobileTop="auto"
          mobileBottom="3%"
          mobileLeft="3%"
          mobileRight="auto"
          onClickEffect={handlePersonalIconClick}
        />
      )}

      {isModalWithPicturesOpen && (
        <ModalWithPictures
          windowSize={windowSize}
          modalData={modalViewerData}
          fadeDuration={modalWithPicturesFadeDuration}
          isFadingOut={isModalWithPicturesFadingOut}
          textSize={modalWithPicturesTextSize}
          buttonSize={modalWithPicturesButtonSize}
          onOkButtonClick={closeModalViewer}
        ></ModalWithPictures>
      )}
    </ScreenFader>
  );
}

export default ScenarioDirector;
