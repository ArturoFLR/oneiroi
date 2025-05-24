import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type GameMainState = "init" | "mainMenu" | "cinematic"; //Añadir según sea necesario

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
