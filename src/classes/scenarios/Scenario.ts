import { Map } from "../map/mapTypes";
import { ScenarioConfig } from "./scenariosTypes";

export default class Scenario {
  name: string;
  map: Map;
  startingCellId: number; // ID de la celda donde comienza el escenario
  visited: boolean;
  solved: boolean;

  onArrive: () => void; // Función que se ejecuta al llegar al escenario
  onLeave: () => void; // Función que se ejecuta al salir del escenario

  constructor(config: ScenarioConfig) {
    this.name = config.name;
    this.map = config.map;
    this.startingCellId = config.startingCellId;
    this.visited = config.visited;
    this.solved = config.solved;

    this.onArrive =
      config.onArrive ?? (() => console.log(`Llegaste a ${this.name}`));
    this.onLeave =
      config.onLeave ?? (() => console.log(`Saliste de ${this.name}`));
  }
}
