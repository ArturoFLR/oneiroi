import { Map } from "../map/mapTypes";

export type ScenarioNameType =
  | "Parque Aliseda"
  | "Casa de Natalia"
  | "Casa de Julián";

export interface ScenarioConfig {
  name: ScenarioNameType;
  map: Map;
  stage: number; // Etapa del escenario, para controlar el progreso realizado en él
  startingCellId: number; // ID de la celda donde comienza el escenario
  visited: boolean;
  solved: boolean;

  onArrive: () => void; // Función que se ejecuta al llegar al escenario
  onLeave: () => void; // Función que se ejecuta al salir del escenario
}
