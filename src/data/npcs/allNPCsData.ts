import { NPCName } from "../../store/slices/aiChatSlice";
import NPC from "../../classes/npcs/NPC";
import nataliaConfig from "./natalia/nataliaConfig";

const allNPCsData: Record<NPCName, NPC> = {
  natalia: new NPC(nataliaConfig),
};

export default allNPCsData;
