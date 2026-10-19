// utils/stroopGenerator.js
import { CONFIG } from "../js/config.js";

const LABELS = { red: "VERMELHO", blue: "AZUL", green: "VERDE", yellow: "AMARELO" };
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export function generateStroopList(count) {
  const colors = CONFIG.stroop.colors;
  const ratio = CONFIG.stroop.congruentRatio;
  const list = [];
  let last = null;

  while (list.length < count) {
    const congruent = Math.random() < ratio;
    const word = colors[randInt(0, colors.length - 1)];
    let ink;
    if (congruent) ink = word;
    else { do { ink = colors[randInt(0, colors.length - 1)]; } while (ink === word); }

    if (last && last.word === word && last.ink === ink) continue;

    list.push({ word, ink, congruent, label: LABELS[word] });
    last = { word, ink };
  }
  return list;
}
