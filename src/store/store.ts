import { configureStore } from "@reduxjs/toolkit";
import mainStateReducer from "./slices/mainStateSlice";
import cinematicDataReducer from "./slices/cinematicSlice";

export const store = configureStore({
  reducer: {
    mainState: mainStateReducer,
    cinematicData: cinematicDataReducer,
  },
});

// Inferir tipos para useDispatch() y useSelector()
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
