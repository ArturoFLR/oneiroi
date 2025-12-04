import { NPCName } from "../../store/slices/aiChatSlice";
import NPC from "../../classes/npcs/NPC";
import nataliaConfig from "./natalia/nataliaConfig";

// Usamos comillas en los nombres de las propiedades para poder usar nombres complejos como "Ana María", que llevan espacios o tildes
const allNPCsData: Record<NPCName, NPC> = {
  Natalia: new NPC(nataliaConfig),
};

export default allNPCsData;
