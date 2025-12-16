import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Este slice controla las propiedades del tutorial.

interface TutorialData {
  isNPCTutorialSeen: boolean;
  isNPCTutorial2Seen: boolean;
  isMapTutorialSeen: boolean;
  isMapTutorial2Seen: boolean;
  isPersonalTutorialSeen: boolean;
  isOptionsTutorialSeen: boolean;
  isInventoryTutorialSeen: boolean;
  isPowersTutorialSeen: boolean;
}

const initialState: TutorialData = {
  isNPCTutorialSeen: false,
  isNPCTutorial2Seen: false,
  isMapTutorialSeen: false,
  isMapTutorial2Seen: false,
  isPersonalTutorialSeen: false,
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
    setIsNPCTutorial2Seen: (state, action: PayloadAction<boolean>) => {
      state.isNPCTutorial2Seen = action.payload;
    },
    setIsMapTutorialSeen: (state, action: PayloadAction<boolean>) => {
      state.isMapTutorialSeen = action.payload;
    },
    setIsMapTutorial2Seen: (state, action: PayloadAction<boolean>) => {
      state.isMapTutorial2Seen = action.payload;
    },
    setIsPersonalTutorialSeen: (state, action: PayloadAction<boolean>) => {
      state.isPersonalTutorialSeen = action.payload;
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

export const {
  setIsNPCTutorialSeen,
  setIsNPCTutorial2Seen,
  setIsMapTutorialSeen,
  setIsMapTutorial2Seen,
  setIsPersonalTutorialSeen,
  setIsOptionsTutorialSeen,
  setIsInventoryTutorialSeen,
  setIsPowersTutorialSeen,
} = soundSlice.actions;
export default soundSlice.reducer;
