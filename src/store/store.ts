import { configureStore } from "@reduxjs/toolkit";
import mainStateReducer from "./slices/mainStateSlice";

export const store = configureStore({
  reducer: {
    mainState: mainStateReducer,
  },
});

// Inferir tipos para useDispatch() y useSelector()
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
