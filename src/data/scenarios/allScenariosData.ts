import { ScenarioNameType } from "../../store/slices/scenarioSlice";
import Scenario from "../../classes/scenarios/Scenario";
import nataliaHouseScenario from "./natalia_house/nataliaHouseScenario";

const allScenariosData: Record<ScenarioNameType, Scenario> = {
  alisedaPark: nataliaHouseScenario, // TODO: Modificar esto cuando estén creados los datos del escenario.
  nataliaHouse: nataliaHouseScenario,
};

export default allScenariosData;
