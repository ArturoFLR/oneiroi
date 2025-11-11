import { NPCName } from "../../store/slices/aiChatSlice";
import NPC from "./NPC";
import Scenario from "../scenarios/Scenario";
import { ScenarioNameType } from "../../store/slices/scenarioSlice";
import { CinematicName } from "../../store/slices/cinematicSlice";
import {
  AIChatAmbientSoundName,
  AIResponseAndVars,
} from "../../components/aiChat/aiChatTypes";

export type AnalyzeResponseFunctionReturn = {
  cinematic: null | CinematicName; // Si después de esta respuesta debe reproducirse una cinemática, se indica aquí su nombre.
  newScenario: null | ScenarioNameType; // Si después de esta respuesta debe cambiarse a otro escenario, se indica aquí su nombre.
  mapCellID: null | number; // Si se debe cambiar a otro escenario, se indica aquí el ID de la celda del mapa a la que se debe mover el jugador.
};

export type DispositionType = -3 | -2 | -1 | 0 | 1 | 2 | 3;

export interface NPCConfig {
  name: string;
  portraitSrc: string;
  distortion: boolean; // ¿El retrato del NPC tiene distorsión, como si fuera un fantasma?
  nameColor: string; // Color del nombre del NPC en conversaciones
  firstTime: boolean; // Es la primera vez que se interactúa con el NPC?
  disposition: DispositionType; // 0 = neutral, 1 = friendly, 2 = very friendly, 3 = in love, -1 = unfriendly, -2 = very unfriendly, -3 = hostile

  // Las variables flirt y hostile no se definen aquí, ya que por defecto siempre comienzan siendo "0". Estas variables nos dan más información sobre cómo se está comportando el jugador con el NPC. Si el jugador aún no ha hablado con el NPC, estas variables no pueden ser distintas de "0".

  scenario: string; // El escenario en el que se encuentra el NPC
  pastConversations: string; // Conversaciones pasadas con el NPC en bruto, sin resumir.
  resumedPastConversation: string; // Conversación pasadas resumidas por la IA

  // Devuelve el sonido ambiente que se debe reproducir en la conversación. Si no tiene un sonido único, devuelve "null" y se seguirá reproduciendo lo que sea que estuviera sonando antes de la conversación.
  returnSoundscape: (
    allNPCsData: Record<NPCName, NPC>,
    allScenariosData: Record<ScenarioNameType, Scenario>,
    actualScenario: ScenarioNameType
  ) => null | AIChatAmbientSoundName;

  // Genera el prompt para la IA
  generatePrompt: (
    actualScenario: ScenarioNameType, // El escenario en el que se produce la conversación.
    allNPCsData: Record<NPCName, NPC>, // Todos los NPCs del juego, con su estado actualizado.
    allScenariosData: Record<ScenarioNameType, Scenario> // Todos los escenarios del juego, con su estado actualizado.
  ) => string;

  getKeyTopics: (
    allNPCsData: Record<NPCName, NPC>,
    allScenariosData: Record<ScenarioNameType, Scenario>,
    actualScenario: ScenarioNameType
  ) => string; // Qué datos deben conservarse siempre en los resúmenes hechos por la IA, para que no se pierdan cuando se acumulen conversaciones y la IA deba descartar cosas.

  // Comprueba si la conversación puede ser abandonada por el usuario en cualquier momento (habilitando el botón "Abandonar").
  canEndConversation: (
    allNPCsData: Record<NPCName, NPC>,
    allScenariosData: Record<ScenarioNameType, Scenario>,
    actualScenario: ScenarioNameType
  ) => boolean;

  // Analiza la respuesta de la IA para comprobar si el jugador está intentando hablar de cosas que aún no debería saber, y que probablemente conoce de una partida anterior. Si es así mostraremos un modal con el texto adecuado, y no se guardará en el histórico de conversaciones este diálogo.
  checkForbiddenTopics: (
    response: AIResponseAndVars,
    allNPCsData: Record<NPCName, NPC>,
    allScenariosData: Record<ScenarioNameType, Scenario>,
    actualScenario: ScenarioNameType
  ) => string | null;

  // Actualiza la disposición del NPC (disposition). Se hace aparte porque esto debe ocurrir antes de que el usuario pulse el botón "Ok" tras leer la respuesta del NPC, para que se actualice el emoji inmediatamente, mientras que analyzeResponse se llama justo después de que se pulse "Ok". Además, controla posibles errores de la IA al puntuar.
  actualizeDisposition: (
    response: AIResponseAndVars,
    allNPCsData: Record<NPCName, NPC>
  ) => void;

  // Analiza la respuesta de la IA y actualiza el estado del NPC y/o el escenario. Devuelve un objeto que indica a AIChat si hay que cambiar de escenario o reproducir una cinemática.
  analyzeResponse: (
    response: AIResponseAndVars,
    allNPCsData: Record<NPCName, NPC>,
    allScenariosData: Record<ScenarioNameType, Scenario>,
    actualScenario: ScenarioNameType
  ) => AnalyzeResponseFunctionReturn;

  // En base a la respuesta de la IA y el estado de NPC´s y escenarios, reproduce, para o modifica sonidos / música.
  modifySoundscape: (
    response: AIResponseAndVars,
    allNPCsData: Record<NPCName, NPC>,
    allScenariosData: Record<ScenarioNameType, Scenario>,
    actualScenario: ScenarioNameType
  ) => void;

  // Determina qué ocurre cuando el jugador decide terminar la conversación.
  endConversation: (
    response: AIResponseAndVars,
    allNPCsData: Record<NPCName, NPC>,
    allScenariosData: Record<ScenarioNameType, Scenario>,
    actualScenario: ScenarioNameType
  ) => AnalyzeResponseFunctionReturn;
}
