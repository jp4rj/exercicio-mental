// js/config.js
export const CONFIG = {
  full: {
    calcCount: 100,
    wordsCount: 30,
    wordsDisplayMs: 120_000,   // 2 minutos
    wordsTransitionMs: 10_000, // tela "feche os olhos"
    stroopCount: 30,
  },
  short: {
    calcCount: 50,
    wordsCount: 15,
    wordsDisplayMs: 60_000,
    wordsTransitionMs: 10_000,
    stroopCount: 15,
  },
  stroop: {
    congruentRatio: 0.2,       // 20% congruente
    colors: ["red", "blue", "green", "yellow"],
  },
  calc: {
    milestones: 25,            // marco na barra de progresso
  },
};
