import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type GameMainState = "init" | "mainMenu" | "cinematicS"; //Añadir según sea necesario

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
    changeMainState: (state, action: PayloadAction<GameMainState>) => {
      state.gameMainState = action.payload;
    },
  },
});

export const { changeMainState } = mainStateSlice.actions;
export default mainStateSlice.reducer;
