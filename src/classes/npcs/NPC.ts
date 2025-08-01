import { NPCConfig } from "./npcsTypes";

export default class NPC {
  name: string;
  portraitSrc: string;
  nameColor: string; // Color del nombre del NPC en conversaciones
  firstTime: true; // Es la primera vez que se interactúa con el NPC?
  disposition: 0; // 0 = neutral, 1 = friendly, 2 = very friendly, 3 = in love, -1 = unfriendly, -2 = very unfriendly, -3 = hostile
  scenario: string; // El escenario en el que se encuentra el NPC
  pastConversations: string; // Conversaciones pasadas con el NPC
  resumedPastConversation: string; // Conversación pasadas resumidas por la IA

  constructor(config: NPCConfig) {
    this.name = config.name;
    this.portraitSrc = config.portraitSrc;
    this.nameColor = config.nameColor;
    this.firstTime = config.firstTime;
    this.disposition = config.disposition;
    this.scenario = config.scenario;
    this.pastConversations = config.pastConversations;
    this.resumedPastConversation = config.resumedPastConversation;
  }
}
