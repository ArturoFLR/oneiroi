import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CinematicSceneAuto } from "../../components/cinematics/cinematicTypes";
import { placeholderCinematic } from "../../data/cinematics/placeholder";

// Este slice controla qué cinemática será reproducida si el estado principal cambia a "cinematic"

interface CinematicData {
  cinematicToPlay: CinematicSceneAuto;
}

const initialState: CinematicData = {
  cinematicToPlay: placeholderCinematic,
};

const cinematicSlice = createSlice({
  name: "cinematicData",
  initialState,
  reducers: {
    setCinematicToPlay: (state, action: PayloadAction<CinematicSceneAuto>) => {
      state.cinematicToPlay = action.payload;
    },
  },
});

export const { setCinematicToPlay } = cinematicSlice.actions;
export default cinematicSlice.reducer;
