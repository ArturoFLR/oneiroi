import allNPCsData from "../data/npcs/allNPCsData";
import NPC from "../classes/npcs/NPC";
import nataliaConfig from "../data/npcs/natalia/nataliaConfig";
import allScenariosData from "../data/scenarios/allScenariosData";
import Scenario from "../classes/scenarios/Scenario";
import nataliaHouseConfig from "../data/scenarios/natalia_house/nataliaHouseConfig";
import { store } from "../store/store";
import {
  setCurrentMapCellId,
  setCurrentScenarioName,
} from "../store/slices/scenarioSlice";
import { setCurrentNPCName } from "../store/slices/aiChatSlice";
import {
  setCinematicToPlay,
  setIsUserWatchingCinematics,
} from "../store/slices/cinematicSlice";
import { setMainState } from "../store/slices/mainStateSlice";
import { setIsSoundEnabled } from "../store/slices/soundSlice";

// Esta función resetea los objetos y variables al producirse un game over

export function resetObjectsAndVariables() {
  // RESETEA LA STORE
  resetStore();

  // RESETEA NPCS
  resetNPCs();

  // RESETEA ESCENARIOS
  resetScenarios();
}

function resetNPCs() {
  allNPCsData.natalia = new NPC(nataliaConfig);
}

function resetScenarios() {
  allScenariosData.alisedaPark = new Scenario(nataliaHouseConfig);
  allScenariosData.nataliaHouse = new Scenario(nataliaHouseConfig);
}

function resetStore() {
  // mainStateSlice
  store.dispatch(setMainState("mainMenu"));

  // aiChatSlice
  store.dispatch(setCurrentNPCName("natalia"));

  // cinematicSlice
  store.dispatch(setCinematicToPlay("intro"));
  store.dispatch(setIsUserWatchingCinematics(false));

  // scenarioSlice
  store.dispatch(setCurrentScenarioName("alisedaPark"));
  store.dispatch(setCurrentMapCellId(1));

  // soundSlice
  store.dispatch(setIsSoundEnabled(true));
}
