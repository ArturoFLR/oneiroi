import { BaseItemConfig } from "./itemTypes";

export default class Item {
  hidden: boolean;
  name: string;
  description: string;
  isLooked: boolean;
  isOpen: boolean;
  isPushed: boolean;
  isTaken: boolean;
  imageSrc: string;
  //TODO: Implementar métodos para manejar el sonido / música.

  // Métodos con comportamientos por defecto
  onLook: () => string;
  onTake: () => string;
  onOpen: () => string;
  onClose: () => string;
  onPush: () => string;
  useWith: (item: Item) => string;
  launchEvent: (event: string) => void;

  constructor(config: BaseItemConfig) {
    this.hidden = config.hidden ?? false;
    this.name = config.name;
    this.description = config.description;
    this.isLooked = config.isLooked ?? false;
    this.isOpen = config.isOpen ?? false;
    this.isPushed = config.isPushed ?? false;
    this.isTaken = config.isTaken ?? false;
    this.imageSrc =
      config.imageSrc ?? "../../public/icons/placeholder-icon.webp";

    // Asignamos o definimos defaults
    this.onLook = config.onLook ?? (() => this.description);
    this.onTake = config.onTake ?? (() => `Has tomado ${this.name}.`);
    this.onOpen = config.onOpen ?? (() => `No parece que se pueda abrir.`);
    this.onClose = config.onClose ?? (() => `No parece que se pueda cerrar.`);
    this.onPush = config.onPush ?? (() => "Empujas, pero no pasa nada.");
    this.useWith = config.useWith ?? (() => "No sucede nada destacable.");
    this.launchEvent = (ev: string) => {
      console.log(`Evento lanzado: ${ev}`); //TODO: Implementar el lanzamiento de eventos.
    };
    //TODO: Implementar métodos para manejar el sonido / música.
  }
}
