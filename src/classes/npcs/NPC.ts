import { NPCName } from "../../store/slices/aiChatSlice";
import { AnalyzeResponseFunctionReturn, NPCConfig } from "./npcsTypes";
import { ScenarioNameType } from "../../store/slices/scenarioSlice";
import Scenario from "../scenarios/Scenario";
import {
  AIChatAmbientSoundName,
  AIResponseAndVars,
} from "../../components/aiChat/aiChatTypes";

export default class NPC {
  name: string;
  portraitSrc: string;
  distortion: boolean; // ¿El retrato del NPC tiene distorsión, como si fuera un fantasma?
  nameColor: string; // Color del nombre del NPC en conversaciones
  firstTime: boolean; // Es la primera vez que se interactúa con el NPC?
  disposition: number; // 0 = neutral, 1 = friendly, 2 = very friendly, 3 = in love, -1 = unfriendly, -2 = very unfriendly, -3 = hostile

  // Las siguientes 2 variables nos dan más información sobre cómo se está comportando el jugador con el NPC.
  flirt: number; // 0 = no flirtea, 1 = flirtea sutilmente, 2 = flirtea descaradamente de forma grosera.
  hostile: number; // 0 = no es agresivo, 1 = es ligeramente agresivo, 2 = es muy agresivo o ha sido ligeramente hostil antes.

  scenario: string; // El escenario en el que se encuentra el NPC
  pastConversations: string; // Conversaciones pasadas con el NPC
  resumedPastConversation: string; // Conversación pasadas resumidas por la IA

  // Devuelve el sonido ambiente que se debe reproducir en la conversación. Si no tiene un sonido único, devuelve "null" y se seguirá reproduciendo lo que sea que estuviera sonando antes de la conversación.
  returnSoundscape: (
    allNPCsData: Record<NPCName, NPC>,
    allScenariosData: Record<ScenarioNameType, Scenario>,
    actualScenario: ScenarioNameType
  ) => null | AIChatAmbientSoundName;

  // Genera el prompt que pasamos a la IA basado en la información del NPC y el escenario, para que genere un comportamiento adecuado.
  generatePrompt: (
    actualScenario: ScenarioNameType,
    allNPCsData: Record<NPCName, NPC>,
    allScenariosData: Record<ScenarioNameType, Scenario>
  ) => string;

  getKeyTopics: (
    allNPCsData: Record<NPCName, NPC>,
    allScenariosData: Record<ScenarioNameType, Scenario>,
    actualScenario: ScenarioNameType
  ) => string; // Qué datos deben conservarse siempre en los resúmenes hechos por la IA, para que no se pierdan cuando se acumulen conversaciones y la IA deba descartar cosas.

  // Esta función comprueba si la conversación puede ser abandonada por el usuario en cualquier momento (habilitando el botón "Abandonar").
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

  constructor(config: NPCConfig) {
    this.name = config.name;
    this.portraitSrc = config.portraitSrc;
    this.distortion = config.distortion;
    this.nameColor = config.nameColor;
    this.firstTime = config.firstTime;
    this.disposition = config.disposition;
    this.flirt = 0;
    this.hostile = 0;
    this.scenario = config.scenario;
    this.pastConversations = config.pastConversations;
    this.resumedPastConversation = config.resumedPastConversation;

    this.returnSoundscape = config.returnSoundscape;
    this.generatePrompt = config.generatePrompt;
    this.getKeyTopics = config.getKeyTopics;
    this.canEndConversation = config.canEndConversation;
    this.checkForbiddenTopics = config.checkForbiddenTopics;
    this.actualizeDisposition = config.actualizeDisposition;
    this.analyzeResponse = config.analyzeResponse;
    this.modifySoundscape = config.modifySoundscape;
    this.endConversation = config.endConversation;
  }
}
