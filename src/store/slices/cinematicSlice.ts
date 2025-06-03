import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Este slice controla qué cinemática será reproducida si el estado principal cambia a "cinematic"

// Añadir aquí los nombres únicos de las cinemáticas que vayamos creando.
export type CinematicName = "intro";

interface CinematicData {
  cinematicToPlayName: CinematicName;
}

const initialState: CinematicData = {
  cinematicToPlayName: "intro",
};

const cinematicSlice = createSlice({
  name: "cinematicData",
  initialState,
  reducers: {
    setCinematicToPlay: (state, action: PayloadAction<CinematicName>) => {
      state.cinematicToPlayName = action.payload;
    },
  },
});

export const { setCinematicToPlay } = cinematicSlice.actions;
export default cinematicSlice.reducer;
