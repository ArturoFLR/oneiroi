import { Map } from "../map/mapTypes";
import { ScenarioConfig, ScenarioNameType } from "./scenariosTypes";

export default class Scenario {
  name: ScenarioNameType;
  map: Map;
  stage: number; // Etapa del escenario, para controlar el progreso realizado en él
  startingCellId: number; // ID de la celda donde comienza el escenario
  visited: boolean;
  solved: boolean;

  onArrive: () => void; // Función que se ejecuta al llegar al escenario
  onLeave: () => void; // Función que se ejecuta al salir del escenario

  constructor(config: ScenarioConfig) {
    this.name = config.name;
    this.map = config.map;
    this.stage = config.stage;
    this.startingCellId = config.startingCellId;
    this.visited = config.visited;
    this.solved = config.solved;

    this.onArrive =
      config.onArrive ?? (() => console.log(`Llegaste a ${this.name}`));
    this.onLeave =
      config.onLeave ?? (() => console.log(`Saliste de ${this.name}`));
  }
}
