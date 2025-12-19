import { ModalData } from "../../components/scenario/scenarioTypes";

import npcPortraitImgScr from "@assets/graphics/portraits/Natalia_9.webp";
import mapIconImgSrc from "@assets/graphics/icons/scenario/icono-mapa.webp";
import personalImgSrc from "@assets/graphics/icons/scenario/icono-persona.webp";
import optionsImgSrc from "@assets/graphics/icons/scenario/icono-opciones.webp";
import inventoryImgSrc from "@assets/graphics/icons/scenario/icono-inventario.webp";
import powersImgSrc from "@assets/graphics/icons/scenario/icono-hechizos.webp";

// Se muestra al comenzar el juego
export const npcTutorialModal: ModalData = {
  text: [
    "Cuando haya un personaje cerca de tí podrás ver su retrato en la parte superior derecha de la pantalla.",
    "Pulsa sobre el retrato para entablar una conversación.",
  ],
  startImgUrl: npcPortraitImgScr,
  startImgAlt: "Retrato de NPC",
  startImgIsWide: false,
  startImgPosition: "center",
  startImgBorder: true,
};

// Se muestra al iniciar una conversación por primera vez
export const npcTutorial2Modal: ModalData = {
  text: [
    "Esta es la pantalla de diálogo.",
    'Aquí puedes hablar con los distintos personajes del juego. Para ello, escribe lo que quieras decir y pulsa "Continuar".',
    "¡Cuidado! Si no eliges bien tus palabras, puedes cabrear a tu interlocutor y complicarte la vida innecesariamente.",
    "El emoji sobre el retrato del personaje indica su actitud hacia ti.",
  ],
};

// Se muestra al iniciar una conversación por primera vez
export const npcTutorial3Modal: ModalData = {
  text: [
    "Hablar con los distintos personajes que te encuentres no sólo te proporcionará información; puedes obtener objetos, desbloquear nuevas zonas...",
    "No dudes en hablar con ellos si te quedas atascado en tu investigación.",
  ],
};

export const mapTutorialModal: ModalData = {
  text: ["Pulsa en el icono de mapa para desplazarte por el escenario."],
  startImgUrl: mapIconImgSrc,
  startImgAlt: "Icono de mapa",
  startImgIsWide: false,
  startImgPosition: "center",
  startImgBorder: false,
};

// Se muestra la primera vez que se abre el mapa
export const mapTutorialModal2: ModalData = {
  text: [
    "Este es el mapa del escenario.",
    "Solo puedes desplazarte a las casillas colindantes.",
    "Las líneas verdes representan puertas o accesos abiertas. Las rojas representan puertas cerradas u otro tipo de obstáculos.",
  ],
};

// Se muestra al acceder a scenario la primera vez. Sólo escritorio.
export const personalTutorialModal: ModalData = {
  text: [
    "Pulsando en este icono puedes acceder a tu inventario, poderes especiales y el menú de opciones.",
  ],
  startImgUrl: personalImgSrc,
  startImgAlt: "Icono de persona",
  startImgIsWide: false,
  startImgPosition: "center",
  startImgBorder: false,
};

// Se muestra al acceder a scenario la primera vez. Sólo mobile.
export const personalTutorialModalMobile: ModalData = {
  text: [
    "Pulsando en este icono puedes acceder al mapa del escenario, tu inventario, poderes especiales y el menú de opciones.",
  ],
  startImgUrl: personalImgSrc,
  startImgAlt: "Icono de persona",
  startImgIsWide: false,
  startImgPosition: "center",
  startImgBorder: false,
};

export const optionsTutorialModal: ModalData = {
  text: [
    "A través del menú de opciones podrás guardar tu progreso, cargar una partida anterior o volver al menú principal.",
  ],
  startImgUrl: optionsImgSrc,
  startImgAlt: "Icono de opciones",
  startImgIsWide: false,
  startImgPosition: "center",
  startImgBorder: false,
};

export const inventoryTutorialModal: ModalData = {
  text: ["En el inventario puedes ver y manipular los objetos que portas."],
  startImgUrl: inventoryImgSrc,
  startImgAlt: "Icono de inventario",
  startImgIsWide: false,
  startImgPosition: "center",
  startImgBorder: false,
};

export const powersTutorialModal: ModalData = {
  text: [
    "Como investigador paranormal, dispones de herramientas y poderes especiales que te ayudarán a resolver los casos.",
  ],
  startImgUrl: powersImgSrc,
  startImgAlt: "Icono de poderes especiales",
  startImgIsWide: false,
  startImgPosition: "center",
  startImgBorder: false,
};

export const powersTutorialModal2: ModalData = {
  text: [
    "Ahora mismo solo dispones de la grabadora y el poder de visión espiritual.",
    "A medida que ganes experiencia resolviendo casos, podrás desbloquear otros poderes y herramientas.",
  ],
  startImgUrl: powersImgSrc,
  startImgAlt: "Icono de poderes especiales",
  startImgIsWide: false,
  startImgPosition: "center",
  startImgBorder: false,
};
