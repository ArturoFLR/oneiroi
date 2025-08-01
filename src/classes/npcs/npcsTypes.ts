export interface NPCConfig {
  name: string;
  portraitSrc: string;
  nameColor: string; // Color del nombre del NPC en conversaciones
  firstTime: boolean; // Es la primera vez que se interactúa con el NPC?
  disposition: number; // 0 = neutral, 1 = friendly, 2 = very friendly, 3 = in love, -1 = unfriendly, -2 = very unfriendly, -3 = hostile
  scenario: string; // El escenario en el que se encuentra el NPC
  pastConversations: string; // Conversaciones pasadas con el NPC
  resumedPastConversation: string; // Conversación pasadas resumidas por la IA
}
