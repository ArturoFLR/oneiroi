import { ScenarioNameType } from "../../store/slices/scenarioSlice";
import Scenario from "../../classes/scenarios/Scenario";
import nataliaHouseConfig from "./natalia_house/nataliaHouseConfig";

const allScenariosData: Record<ScenarioNameType, Scenario> = {
  alisedaPark: new Scenario(nataliaHouseConfig), // TODO: Modificar esto cuando estén creados los datos del escenario.
  nataliaHouse: new Scenario(nataliaHouseConfig),
};

export default allScenariosData;
