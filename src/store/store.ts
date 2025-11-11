import { configureStore } from "@reduxjs/toolkit";
import mainStateReducer from "./slices/mainStateSlice";
import cinematicDataReducer from "./slices/cinematicSlice";
import aiChatDataReducer from "./slices/aiChatSlice";
import scenarioDataReducer from "./slices/scenarioSlice";
import soundDataReducer from "./slices/soundSlice";

export const store = configureStore({
  reducer: {
    mainState: mainStateReducer,
    cinematicData: cinematicDataReducer,
    aiChatData: aiChatDataReducer,
    scenarioData: scenarioDataReducer,
    soundData: soundDataReducer,
  },
});

// Inferir tipos para useDispatch() y useSelector()
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
