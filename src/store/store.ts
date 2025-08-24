import { configureStore } from "@reduxjs/toolkit";
import mainStateReducer from "./slices/mainStateSlice";
import cinematicDataReducer from "./slices/cinematicSlice";
import aiChatDataReducer from "./slices/aiChatSlice";

export const store = configureStore({
  reducer: {
    mainState: mainStateReducer,
    cinematicData: cinematicDataReducer,
    aiChatData: aiChatDataReducer,
  },
});

// Inferir tipos para useDispatch() y useSelector()
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
