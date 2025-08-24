import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Este slice controla los datos del chat de IA, como el interlocutor actual.

export type NPCName = "Natalia"; // Añadir aqui los nombres de los NPCs que vayamos creando.

interface AIChatData {
  currentNPCName: NPCName; // Nombre del NPC con el que se está interactuando
}

const initialState: AIChatData = {
  currentNPCName: "Natalia", // Nombre del primer NPC cone el que se interactúa
};

const aiChatSlice = createSlice({
  name: "aiChatData",
  initialState,
  reducers: {
    setCurrentNPCName: (state, action: PayloadAction<NPCName>) => {
      state.currentNPCName = action.payload;
    },
  },
});

export const { setCurrentNPCName } = aiChatSlice.actions;
export default aiChatSlice.reducer;
