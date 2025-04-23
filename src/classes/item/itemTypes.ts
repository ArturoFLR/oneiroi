// Este interfaz define el objeto de configuración que debemos crear para instanciar un objeto BaseItem, donde sólo es necesario especificar las propiedades

import Item from "./Item";

// que no vayan a tener el valor por defecto y los  métodos que vayan a hacer algo realmente útil. "name" y "description" sí son obligatorios, siempre cambian.
export interface BaseItemConfig {
  hidden?: boolean;
  name: string;
  description: string;
  isLooked?: boolean;
  isOpen?: boolean;
  isPushed?: boolean;
  isTaken?: boolean;
  imageSrc?: string;

  onLook?: () => string;
  onTake?: () => string;
  onOpen?: () => string;
  onClose?: () => string;
  onPush?: () => string;
  useWith?: (item: Item) => string;
}
