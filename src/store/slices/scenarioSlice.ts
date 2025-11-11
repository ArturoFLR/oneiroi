import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Este slice controla los datos del escenario actual.

export type ScenarioNameType = "alisedaPark" | "nataliaHouse"; // Añadir aqui los nombres de los escenarios que vayamos creando.

interface ScenarioData {
  scenarioName: ScenarioNameType; // con esto podemos buscar en allScenariosData el escenario actual.}
  mapCellId: number; // id de la celda del mapa en la que se encuentra el jugador.
}

const initialState: ScenarioData = {
  scenarioName: "alisedaPark",
  mapCellId: 1,
};

const scenarioSlice = createSlice({
  name: "scenarioData",
  initialState,
  reducers: {
    setCurrentScenarioName: (
      state,
      action: PayloadAction<ScenarioNameType>
    ) => {
      state.scenarioName = action.payload;
    },
    setCurrentMapCellId: (state, action: PayloadAction<number>) => {
      state.mapCellId = action.payload;
    },
  },
});

export const { setCurrentScenarioName, setCurrentMapCellId } =
  scenarioSlice.actions;
export default scenarioSlice.reducer;
