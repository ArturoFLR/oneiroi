import { HowlOptions } from "howler";
import {
  MainAmbientSound,
  SecondarySound,
} from "../../classes/sound/soundTypes";

// **************** ESTADO GENERAL DEL CHAT ****************

export type ChatPhase =
  | "stopPreviousSounds"
  | "preloading"
  | "userInput"
  | "dialogPhase1"
  | "dialogPhase2"
  | "aiResponse"
  | "endConversation"
  | "forbiddenTopicModal"
  | "serverErrorModal"
  | "endConversationModal";

// *************** RESPUESTAS DE LOS INTERFACES A GROQ: ***************

export type AIResponseAndVars = {
  disposition: number;
  flirt: 0 | 1 | 2;
  hostile: 0 | 1 | 2;
  bye: boolean;
  responseText: string;
  specificNpcVars?: Record<string, number | string | boolean>;
};

export type ChatResumeReturn = {
  summary: string;
};

// *************** TIPOS DE SONIDOS ***************

// Meter en este tipo el nombre de los soundscapes que creemos para el chat.
export type AIChatAmbientSoundName = "aliseda01";

// Estos tipos son una versión simplificada de los tipos de sonidos usados en las cinemáticas.

export interface AIChatAmbientSound {
  soundscapeName: string;
  mainAmbientSounds: MainAmbientSound[];
  secondaryAmbientSounds?: SecondarySound[];
  toVolume?: number; //En el fade inicial, podemos indicar hasta qué volumen subirá el sonido. Si no, será 1.
}

export interface AIChatMusic {
  soundName: string;
  soundSrc: string;
  config?: HowlOptions; // Si queremos un fade-in inicial, debemos usar este parámetro para especificar volume = 0; Ajustaremos el volumen final con toVolume
  stereo?: number;
  loop: boolean; //Si la música se repite o no.
  initialFadeDuration: number; //Duración del fade-in inicial. Puede ser 0.
  toVolume?: number; //Si usamos un fade inicial, podemos indicar hasta qué volumen subirá la música. Si no, será 1
}

export interface AIChatSoundData {
  ambientSound?: AIChatAmbientSound;
  music?: AIChatMusic;
}

export type AIChatSoundsMapType = Record<
  AIChatAmbientSoundName,
  AIChatSoundData
>;
