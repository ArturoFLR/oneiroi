import Scenario from "../../../classes/scenarios/Scenario";
import { ScenarioConfig } from "../../../classes/scenarios/scenariosTypes";
import nataliaHouseMap from "./nataliaHouseMap";

const nataliaHouseConfig: ScenarioConfig = {
  name: "Casa de Natalia",
  map: nataliaHouseMap,
  startingCellId: 11,
  visited: false,
  solved: false,
  onArrive: () => {},
  onLeave: () => {},
};

const nataliaHouseScenario = new Scenario(nataliaHouseConfig);

export default nataliaHouseScenario;
