// js/config.js
export const CONFIG = {
  full: {
    calcCount: 50,
    wordsCount: 30,
    wordsDisplayMs: 120_000,
    wordsTransitionMs: 10_000,
    stroopCount: 30,
    taskSwitchCount: 15,
  },
  short: {
    calcCount: 25,
    wordsCount: 15,
    wordsDisplayMs: 60_000,
    wordsTransitionMs: 10_000,
    stroopCount: 15,
    taskSwitchCount: 15,
  },
  stroop: {
    congruentRatio: 0.2,
    colors: ["red", "blue", "green", "yellow"],
  },
  calc: {
    milestones: 25,
  },
};