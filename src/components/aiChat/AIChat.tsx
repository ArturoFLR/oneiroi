import { useEffect, useLayoutEffect, useRef, useState } from "react";
import calcFontSize from "../../utils/calcFontSize";
import AIChatVista from "./styled/AIChatVista";
import { useAppDispatch, useAppSelector } from "../../store/hooks/reduxHooks";
import allNPCsData from "../../data/npcs/allNPCsData";
import { GLOBAL_COLORS } from "../../theme";
import allScenariosData from "../../data/scenarios/allScenariosData";
import { getNPCResponseAndVars } from "../../interfaces/groq/getNPCResponseAndVars";
import { getChatResume } from "../../interfaces/groq/getChatResume";
import { AIResponseAndVars, ChatPhase } from "./aiChatTypes";
import ModalOneButton from "../common/modals/ModalOneButton";
import { setCinematicToPlay } from "../../store/slices/cinematicSlice";
import { setMainState } from "../../store/slices/mainStateSlice";
import {
  setCurrentMapCellId,
  setCurrentScenarioName,
} from "../../store/slices/scenarioSlice";

import jonasPortrait from "@assets/graphics/portraits/Jonas-portrait_02.jpg";
import AIChatSoundManager from "./AIChatSoundManager";
import MainAIChatContainer from "./styled/MainAIChatContainer";
import { aiChatSoundsMap } from "../../data/aiChatAmbientSounds/aiChatAmbientSoundsMap";
import AIChatPreloader from "./AIChatPreloader";

function AIChat() {
  const [chatPhase, setChatPhase] = useState<ChatPhase>("stopPreviousSounds");
  const [aiResponse, setAIResponse] = useState<AIResponseAndVars>({
    disposition: 0,
    flirt: 0,
    hostile: 0,
    bye: false,
    responseText: "",
    specificNpcVars: {},
  });
  const [minimunTextLengthReached, setMinimunTextLengthReached] =
    useState<boolean>(false);

  const [canUserEndConversation, setCanUserEndConversation] =
    useState<boolean>(false);

  const [serverErrorModalText, setServerErrorModalText] = useState<{
    mainText: string;
    secText: string;
  }>({ mainText: "", secText: "" });

  const [forbiddenTopicModalText, setForbiddenTopicModalText] =
    useState<string>("");

  const [windowSize, setWindowSize] = useState<[number, number]>([0, 0]);
  const [portraitNameSize, setPortraitNameSize] = useState<string>("0px");
  const [portraitEmojiSize, setPortraitEmojiSize] = useState<string>("0px");
  const [textBoxNameSize, setTextBoxNameSize] = useState<string>("0px");
  const [textBoxTextSize, setTextBoxTextSize] = useState<string>("0px");
  const [buttonsSize, setButtonsSize] = useState<string>("0px");

  const userTextRef = useRef<string>("");
  const mainContainerElement = useRef<HTMLDivElement>(null);
  const textareaElementRef = useRef<HTMLTextAreaElement>(null);
  const chatPhaseTimeoutRef = useRef<number>(0);
  const chatFadeOutTimeoutRef = useRef<number>(0);

  const fadeDuration = 1500;

  //Redux
  const dispatch = useAppDispatch();

  const npcData = useAppSelector(
    (state) => allNPCsData[state.aiChatData.currentNPCName]
  );

  const scenarioName = useAppSelector(
    (state) => state.scenarioData.scenarioName
  );
  //Redux Fin

  const npcName = npcData ? npcData.name : "";

  const soundScapeReturnedByNpc = npcData.returnSoundscape(
    allNPCsData,
    allScenariosData,
    scenarioName
  );
  const soundScapeToUse = soundScapeReturnedByNpc
    ? aiChatSoundsMap[soundScapeReturnedByNpc]
    : null;

  const portraitNameProportion = 58;
  const portraitEmojiProportion = 50;
  const textBoxNameProportion = 40;
  const textBoxTextProportion = 58;
  const buttonsProportion = 40;

  const generateChatResume = async (
    textToResume: string,
    NPCName: string,
    keyTopics: string
  ) => {
    try {
      const response = await getChatResume(textToResume, NPCName, keyTopics);
      // Si response es una string, es que hemos recibido un mensaje de error 429 (demasiadas peticiones).
      if (typeof response === "string" || !response) {
        console.error("Error generando resumen de la conversación:");
        return null;
      }

      if (response?.summary) {
        console.log("Resumen generado:", response.summary);
        return response.summary;
      }
    } catch (error) {
      console.error("Error generando resumen de la conversación:", error);
      return null;
    }
  };

  // Las siguientes funciones son pasadas por props a los componentes hijos.
  const handleTextAreaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    userTextRef.current = event.target.value;

    if (userTextRef.current.length >= 2) {
      setMinimunTextLengthReached(true);
    } else {
      setMinimunTextLengthReached(false);
    }
  };

  const handleAIResponseComplete = () => {};

  const onConversationEndClick = async () => {
    const conversationEndResult = npcData.endConversation(
      aiResponse,
      allNPCsData,
      allScenariosData,
      scenarioName
    );

    const chatResume = await generateChatResume(
      npcData.pastConversations,
      npcName,
      npcData.getKeyTopics(allNPCsData, allScenariosData, scenarioName)
    );

    if (chatResume) {
      npcData.resumedPastConversation = chatResume + " ";
    }

    setChatPhase("endConversation");

    chatFadeOutTimeoutRef.current = window.setTimeout(() => {
      if (conversationEndResult.cinematic) {
        dispatch(setCinematicToPlay(conversationEndResult.cinematic));
        dispatch(setMainState("cinematic"));
      } else if (conversationEndResult.newScenario) {
        dispatch(setCurrentScenarioName(conversationEndResult.newScenario));

        if (conversationEndResult.mapCellID) {
          dispatch(setCurrentMapCellId(conversationEndResult.mapCellID));
        } else {
          dispatch(
            setCurrentMapCellId(allScenariosData[scenarioName].startingCellId)
          );
        }

        dispatch(setMainState("map"));
      } else {
        dispatch(setMainState("map"));
      }
    }, fadeDuration);
  };

  const onPlayerResponseClick = () => {
    setChatPhase("dialogPhase1");
  };

  const onAIResponseClick = async () => {
    setMinimunTextLengthReached(false);

    const analyzeResponseResult = npcData.analyzeResponse(
      aiResponse,
      allNPCsData,
      allScenariosData,
      scenarioName
    );

    setAIResponse({
      disposition: 0,
      flirt: 0,
      hostile: 0,
      bye: false,
      responseText: "",
      specificNpcVars: {},
    });

    if (analyzeResponseResult.cinematic || analyzeResponseResult.newScenario) {
      const chatResume = await generateChatResume(
        npcData.pastConversations,
        npcName,
        npcData.getKeyTopics(allNPCsData, allScenariosData, scenarioName)
      );

      if (chatResume) {
        npcData.resumedPastConversation = chatResume + " ";
      }

      setChatPhase("endConversation");
    } else {
      setChatPhase("userInput");
    }

    if (analyzeResponseResult.cinematic) {
      chatFadeOutTimeoutRef.current = window.setTimeout(() => {
        dispatch(setCinematicToPlay(analyzeResponseResult.cinematic!));
        dispatch(setMainState("cinematic"));
      }, fadeDuration);
    } else if (analyzeResponseResult.newScenario) {
      chatFadeOutTimeoutRef.current = window.setTimeout(() => {
        dispatch(setCurrentScenarioName(analyzeResponseResult.newScenario!));

        if (analyzeResponseResult.mapCellID) {
          dispatch(setCurrentMapCellId(analyzeResponseResult.mapCellID));
        } else {
          dispatch(
            setCurrentMapCellId(allScenariosData[scenarioName].startingCellId)
          );
        }

        dispatch(setMainState("map"));
      }, fadeDuration);
    }
  };

  const onServerErrorModalClick = () => {
    setChatPhase("userInput");
  };

  const onForbiddenTopicModalClick = () => {
    setChatPhase("userInput");
  };

  // Calcula la proporción de la pantalla y el tamaño de las fuentes, y establece un listener
  // para que se recalculen si hay un "resize" de la pantalla.
  useLayoutEffect(() => {
    function setNewFontSize() {
      setPortraitNameSize(
        calcFontSize(mainContainerElement.current, portraitNameProportion, 16)
      );

      setPortraitEmojiSize(
        calcFontSize(mainContainerElement.current, portraitEmojiProportion, 20)
      );

      setTextBoxNameSize(
        calcFontSize(mainContainerElement.current, textBoxNameProportion, 25)
      );

      setTextBoxTextSize(
        calcFontSize(mainContainerElement.current, textBoxTextProportion, 20)
      );

      setButtonsSize(
        calcFontSize(mainContainerElement.current, buttonsProportion, 25)
      );
    }

    function setNewWindowSize() {
      setWindowSize([window.innerWidth, window.innerHeight]);
    }

    function handleResize() {
      setNewFontSize();
      setNewWindowSize();
    }

    // Hace el cálculo inicial
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [portraitNameProportion, textBoxNameProportion, textBoxTextProportion]);

  // Comprueba si el usuario puede abandonar la conversación en este momento.
  useEffect(() => {
    const result = npcData.canEndConversation(
      allNPCsData,
      allScenariosData,
      scenarioName
    );

    setCanUserEndConversation(result);
  }, [chatPhase, npcData, scenarioName]);

  // Aquí se gestiona la 1º parte de un diálogo: el usuario envía su texto y la IA responde, informándonos de si el usuario está hablando de temas "prohibidos" (no debería conocelos aún). En función de eso cortamos el diálogo mostrando un modal, o pasamos al estado dialogPhase2, que gestiona el resto del diálogo.
  useEffect(() => {
    if (chatPhase !== "dialogPhase1") return;

    const aiPrompt = npcData.generatePrompt(
      scenarioName,
      allNPCsData,
      allScenariosData
    );

    getNPCResponseAndVars(aiPrompt, userTextRef.current)
      .then((response) => {
        // Si response es una string, es que hemos recibido un mensaje de error 429 (demasiadas peticiones), y se nos facilita el tiempo que queda para poder volver a hacer peticiones.
        if (typeof response === "string") {
          setServerErrorModalText({
            mainText:
              "Superado el número de peticiones permitidas por el servidor de IA.",
            secText: `Puede volver a intentarlo en ${response}.`,
          });

          setChatPhase("serverErrorModal");
          return;
        }

        if (!response?.responseText) {
          setServerErrorModalText({
            mainText: "Error del servidor, inténtelo más tarde.",
            secText: "",
          });

          setChatPhase("serverErrorModal");
          return;
        }

        if (response?.responseText) {
          const forbiddenTopicResult = npcData.checkForbiddenTopics(
            response,
            allNPCsData,
            allScenariosData,
            scenarioName
          );

          if (forbiddenTopicResult) {
            setForbiddenTopicModalText(forbiddenTopicResult);
            setChatPhase("forbiddenTopicModal");
            return;
          } else {
            setAIResponse(response);
            setChatPhase("dialogPhase2");
          }
        }
      })
      .catch((error) => {
        setServerErrorModalText({
          mainText: "Error del servidor, inténtelo más tarde.",
          secText: error instanceof Error ? error.message : String(error),
        });

        setChatPhase("serverErrorModal");
      });
  }, [chatPhase, npcData, scenarioName]);

  // Aquí se gestiona la 2º parte de un diálogo: el texto del usuario es aceptado y se muestra la respuesta de la IA. Se almacena la conversación en el "pastConversations" del NPC y se generan nuevos sonidos o modifican los existentes.
  useEffect(() => {
    if (chatPhase !== "dialogPhase2") return;

    npcData.firstTime = false;
    const conversationRecord = `${npcData.resumedPastConversation} *Usuario*: ${userTextRef.current}. *${npcName}*: ${aiResponse.responseText}. `;
    npcData.resumedPastConversation = conversationRecord;

    npcData.modifySoundscape(
      aiResponse,
      allNPCsData,
      allScenariosData,
      scenarioName
    );
    npcData.actualizeDisposition(aiResponse, allNPCsData);

    npcData.pastConversations =
      npcData.pastConversations +
      `*Usuario*: ${userTextRef.current}. *IA*: ${aiResponse.responseText}.`;

    chatPhaseTimeoutRef.current = window.setTimeout(() => {
      setChatPhase("aiResponse");
    }, 1000);

    return () => {
      window.clearTimeout(chatPhaseTimeoutRef.current);
    };
  }, [chatPhase, aiResponse, dispatch, npcData, scenarioName, npcName]);

  // Aquí se limpia el timeout del efecto fade-out cuando se desmonta el componente
  useEffect(() => {
    return () => {
      window.clearTimeout(chatFadeOutTimeoutRef.current);
    };
  }, []);

  return (
    <MainAIChatContainer
      elementReference={mainContainerElement}
      fadeDuration={fadeDuration}
      chatPhase={chatPhase}
    >
      <AIChatSoundManager
        chatPhase={chatPhase}
        setChatPhase={setChatPhase}
        soundData={soundScapeToUse}
        fadeOutDurationMs={fadeDuration}
      />

      {(chatPhase === "preloading" || chatPhase === "stopPreviousSounds") && (
        <AIChatPreloader
          chatPhase={chatPhase}
          setChatPhase={setChatPhase}
          jonasPortraitSrc={jonasPortrait}
          npcPortraitSrc={npcData.portraitSrc}
          soundsToLoad={soundScapeToUse}
        />
      )}

      {chatPhase !== "stopPreviousSounds" && chatPhase !== "preloading" && (
        <AIChatVista
          windowSize={windowSize}
          textareaElementRef={textareaElementRef}
          portraitNameSize={portraitNameSize}
          portraitEmojiSize={portraitEmojiSize}
          textBoxNameSize={textBoxNameSize}
          textBoxTextSize={textBoxTextSize}
          buttonsSize={buttonsSize}
          npcName={npcName}
          npcNameColor={npcData.nameColor}
          npcDistortion={npcData.distortion}
          jonasNameColor={GLOBAL_COLORS.aiChat.playerNameColor}
          jonasPortraitSrc={jonasPortrait}
          npcPortraitSrc={npcData.portraitSrc}
          npcDisposition={npcData.disposition}
          isNpcThinking={
            chatPhase === "dialogPhase1" || chatPhase === "dialogPhase2"
          }
          chatPhase={chatPhase}
          aiResponseText={aiResponse.responseText}
          minimunTextLengthReached={minimunTextLengthReached}
          canUserEndConversation={canUserEndConversation}
          handleTextAreaChange={handleTextAreaChange}
          handleAIResponseComplete={handleAIResponseComplete}
          onConversationEndClick={onConversationEndClick}
          onPlayerResponseClick={onPlayerResponseClick}
          onAIResponseClick={onAIResponseClick}
        />
      )}

      {chatPhase === "serverErrorModal" && (
        <ModalOneButton
          onClick={onServerErrorModalClick}
          screenDarkenerColor="dark"
          mainText={serverErrorModalText.mainText}
          secondaryText={serverErrorModalText.secText}
          buttonText="Ok"
        />
      )}

      {chatPhase === "forbiddenTopicModal" && (
        <ModalOneButton
          onClick={onForbiddenTopicModalClick}
          screenDarkenerColor="dark"
          mainText={forbiddenTopicModalText}
          secondaryText=""
          buttonText="Ok"
        />
      )}
    </MainAIChatContainer>
  );
}

export default AIChat;
