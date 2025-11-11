import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Este slice controla las propiedades del sonido.

interface SoundData {
  isSoundEnabled: boolean; // El usuario permite o no el uso de sonido.
}

const initialState: SoundData = {
  isSoundEnabled: true, // El sonido está activado por defecto.
};

const soundSlice = createSlice({
  name: "soundData",
  initialState,
  reducers: {
    setIsSoundEnabled: (state, action: PayloadAction<boolean>) => {
      state.isSoundEnabled = action.payload;
    },
  },
});

export const { setIsSoundEnabled } = soundSlice.actions;
export default soundSlice.reducer;
