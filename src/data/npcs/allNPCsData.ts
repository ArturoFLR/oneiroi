import { NPCName } from "../../store/slices/aiChatSlice";
import NPC from "../../classes/npcs/NPC";
import nataliaNPC from "./natalia/nataliaNPC";

const allNPCsData: Record<NPCName, NPC> = {
  natalia: nataliaNPC,
};

export default allNPCsData;
