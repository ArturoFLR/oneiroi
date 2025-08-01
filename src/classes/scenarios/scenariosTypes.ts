import { Map } from "../map/mapTypes";

export interface ScenarioConfig {
  name: string;
  map: Map;
  startingCellId: number; // ID de la celda donde comienza el escenario
  onArrive: () => void; // Función que se ejecuta al llegar al escenario
  onLeave: () => void; // Función que se ejecuta al salir del escenario
}
