import {
  MainMenuImgData,
  MainMenuInterfaceSoundData,
  MainMenuMusic,
  MainMenuSounds,
} from "../../components/mainMenu/mainMenuTypes";

import click1Sound from "@assets/audio/sounds/interface/interface-click.mp3";
import chime01Sound from "@assets/audio/sounds/interface/congratulations-chime_01.mp3";
import failureSound01 from "@assets/audio/sounds/interface/failure-sound_01.mp3";

import blurredImageBg from "@assets/graphics/backgrounds/clouds-stars_02.webp";
import mainMenuBg from "@assets/graphics/backgrounds/main-menu-bg.webp";
import mainMenuLogo from "@assets/graphics/logo/oneiroi-logo_1.webp";

import mainMenuMusic1 from "@assets/audio/music/crystal-oasis.mp3";
import gongSound from "@assets/audio/sounds/effects/gong/gong.mp3";

export const mainMenuInterfaceSounds: MainMenuInterfaceSoundData[] = [
  {
    soundName: "click1",
    soundSrc: click1Sound,
  },
  {
    soundName: "successChime01",
    soundSrc: chime01Sound,
  },
  {
    soundName: "failureSound01",
    soundSrc: failureSound01,
  },
];

export const mainMenuImages: MainMenuImgData[] = [
  {
    src: blurredImageBg,
    alt: "Fondo de nubes y estrellas",
  },
  {
    src: mainMenuBg,
    alt: "Portada de Oneiroi",
  },
  {
    src: mainMenuLogo,
    alt: "Logo de Oneiroi",
  },
];

export const mainMenuMusics: MainMenuMusic[] = [
  {
    soundName: "mainMenuMusic",
    soundSrc: mainMenuMusic1,
  },
];

export const mainMenuSounds: MainMenuSounds[] = [
  {
    soundName: "gong",
    soundSrc: gongSound,
  },
];
