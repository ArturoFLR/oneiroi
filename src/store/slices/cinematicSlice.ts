import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Este slice controla qué cinemática será reproducida si el estado principal cambia a "cinematic"

// Añadir aquí los nombres únicos de las cinemáticas que vayamos creando.
export type CinematicName = "intro" | "alisedaPark01";

interface CinematicData {
  cinematicToPlayName: CinematicName; // Qué cinemática se reproduce si cambiamos el estado generar a "cinematic"
  isUserWatchingCinematics: boolean; // Se usa para saber si el usuario está viendo una cinemática desde el menú ppal, no desde el juego.
  //  De esta manera, al terminar la cinemática lo tenemos en cuenta para saber a qué parte de la app volver.
}

const initialState: CinematicData = {
  cinematicToPlayName: "intro",
  isUserWatchingCinematics: false,
};

const cinematicSlice = createSlice({
  name: "cinematicData",
  initialState,
  reducers: {
    setCinematicToPlay: (state, action: PayloadAction<CinematicName>) => {
      state.cinematicToPlayName = action.payload;
    },
    setIsUserWatchingCinematics: (state, action: PayloadAction<boolean>) => {
      state.isUserWatchingCinematics = action.payload;
    },
  },
});

export const { setCinematicToPlay, setIsUserWatchingCinematics } =
  cinematicSlice.actions;
export default cinematicSlice.reducer;
