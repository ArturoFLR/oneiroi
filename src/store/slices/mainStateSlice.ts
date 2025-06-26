import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Este slice controla el estado principal del juego (nos encontramos en el menú principal, en una cinemática, en un mapa...)

export type GameMainState = "init" | "mainMenu" | "cinematic" | "aiChat"; //Añadir según sea necesario

interface MainState {
  gameMainState: GameMainState;
}

const initialState: MainState = {
  gameMainState: "init",
};

const mainStateSlice = createSlice({
  name: "mainState",
  initialState,
  reducers: {
    setMainState: (state, action: PayloadAction<GameMainState>) => {
      state.gameMainState = action.payload;
    },
  },
});

export const { setMainState } = mainStateSlice.actions;
export default mainStateSlice.reducer;
