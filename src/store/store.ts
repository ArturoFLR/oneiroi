import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    //Añadir los reducers aquí
    //nombre del estado: nombre del reducer
    //Ej:
    //mainState: mainStateReducer,
    //
  },
});

// Inferir tipos para useDispatch() y useSelector()
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
