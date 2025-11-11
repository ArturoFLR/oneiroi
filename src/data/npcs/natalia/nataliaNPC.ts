import nataliaPortrait from "@assets/graphics/portraits/Natalia_9.webp";
import NPC from "../../../classes/npcs/NPC";
import { NPCConfig } from "../../../classes/npcs/npcsTypes";
import { GLOBAL_COLORS } from "../../../theme";
import {
  actualizeDisposition,
  analyzeResponse,
  canEndConversation,
  checkForbiddenTopics,
  endConversation,
  generatePrompt,
  getKeyTopics,
  modifySoundscape,
  returnSoundscape,
} from "./nataliaLogic";

const nataliaConfig: NPCConfig = {
  name: "Natalia",
  portraitSrc: nataliaPortrait,
  distortion: false,
  nameColor: GLOBAL_COLORS.aiChat.npcColor1,
  firstTime: true,
  disposition: 0,
  scenario: "",
  pastConversations: "",
  resumedPastConversation:
    "Natalia lleva unos días notando fenómenos extraños en su casa. Ha quedado en el parque Aliseda con un desconocido que conoció en un foro de internet y que dice que puede ayudarla. Está atardeciendo y el desconocido se acerca a ella.",
  returnSoundscape: returnSoundscape,
  generatePrompt: generatePrompt,
  getKeyTopics: getKeyTopics,
  canEndConversation: canEndConversation,
  checkForbiddenTopics: checkForbiddenTopics,
  actualizeDisposition: actualizeDisposition,
  analyzeResponse: analyzeResponse,
  modifySoundscape: modifySoundscape,
  endConversation: endConversation,
};

const nataliaNPC = new NPC(nataliaConfig);

export default nataliaNPC;
