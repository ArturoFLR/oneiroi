import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Este slice controla las propiedades del tutorial.

interface TutorialData {
  isNPCTutorialSeen: boolean;
  isMapTutorialSeen: boolean;
  isPersonaTutorialSeen: boolean;
  isOptionsTutorialSeen: boolean;
  isInventoryTutorialSeen: boolean;
  isPowersTutorialSeen: boolean;
}

const initialState: TutorialData = {
  isNPCTutorialSeen: false,
  isMapTutorialSeen: false,
  isPersonaTutorialSeen: false,
  isOptionsTutorialSeen: false,
  isInventoryTutorialSeen: false,
  isPowersTutorialSeen: false,
};

const soundSlice = createSlice({
  name: "tutorialData",
  initialState,
  reducers: {
    setIsNPCTutorialSeen: (state, action: PayloadAction<boolean>) => {
      state.isNPCTutorialSeen = action.payload;
    },
    setIsMapTutorialSeen: (state, action: PayloadAction<boolean>) => {
      state.isMapTutorialSeen = action.payload;
    },
    setIsPersonaTutorialSeen: (state, action: PayloadAction<boolean>) => {
      state.isPersonaTutorialSeen = action.payload;
    },
    setIsOptionsTutorialSeen: (state, action: PayloadAction<boolean>) => {
      state.isOptionsTutorialSeen = action.payload;
    },
    setIsInventoryTutorialSeen: (state, action: PayloadAction<boolean>) => {
      state.isInventoryTutorialSeen = action.payload;
    },
    setIsPowersTutorialSeen: (state, action: PayloadAction<boolean>) => {
      state.isPowersTutorialSeen = action.payload;
    },
  },
});

export const { setIsNPCTutorialSeen } = soundSlice.actions;
export default soundSlice.reducer;
