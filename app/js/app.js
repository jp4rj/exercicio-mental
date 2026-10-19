// js/app.js
import { CONFIG } from "./config.js";
import { generateCalcList } from "../utils/calcGenerator.js";
import { drawWords } from "../utils/wordsBank.js";

const $ = (id) => document.getElementById(id);
const show = (id) => {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  $(id).classList.add("active");
};

let mode = "full";
let session = null;

/* ---------- EX1: CÁLCULO ---------- */
let calcTimerId = null;
let itemStart = 0;
let calcStartedAt = 0;

function startCalc() {
  const count = CONFIG[mode].calcCount;
  session = {
    mode,
    calc: { list: generateCalcList(count), index: 0, results: [] }
  };
  calcStartedAt = performance.now();
  itemStart = calcStartedAt;
  $("calc-counter").textContent = `1 / ${count}`;
  $("calc-progress").style.width = "0%";
  show("screen-calc");
  renderCalcItem();
  calcTimerId = setInterval(() => {
    $("calc-timer").textContent = ((performance.now() - calcStartedAt) / 1000).toFixed(1) + "s";
  }, 100);
}

function renderCalcItem() {
  const { list, index } = session.calc;
  if (index >= list.length) return finishCalc();
  const item = list[index];
  $("calc-counter").textContent = `${index + 1} / ${list.length}`;
  $("calc-progress").style.width = `${(index / list.length) * 100}%`;
  $("calc-question").textContent = `${item.a} ${item.operator} ${item.b} =`;
  $("calc-input").value = "";
  $("calc-input").focus();
  itemStart = performance.now();
}

function submitCalc() {
  const val = $("calc-input").value;
  if (val === "") return;
  const item = session.calc.list[session.calc.index];
  const given = Number(val);
  session.calc.results.push({
    ...item,
    given,
    isCorrect: given === item.answer,
    timeMs: performance.now() - itemStart,
  });
  session.calc.index++;
  renderCalcItem();
}

function finishCalc() {
  clearInterval(calcTimerId);
  $("calc-progress").style.width = "100%";
  const r = session.calc.results;
  const correct = r.filter(x => x.isCorrect).length;
  const wrong = r.length - correct;
  const avg = Math.round(r.reduce((s, x) => s + x.timeMs, 0) / r.length);
  const total = ((performance.now() - calcStartedAt) / 1000).toFixed(1);
  $("calc-summary").textContent =
    `Acertos: ${correct} · Erros: ${wrong} · Tempo médio: ${avg}ms · Total: ${total}s`;
  show("screen-calc-result");
}

/* ---------- EX2: PALAVRAS (esqueleto) ---------- */
let wordsTimerId = null;

function startWords() {
  const { wordsCount, wordsDisplayMs } = CONFIG[mode];
  const words = drawWords(wordsCount);
  session.words = { words, startAt: performance.now() };

  // renderizar grade
  const grid = $("words-grid");
  grid.innerHTML = "";
  words.forEach(w => {
    const el = document.createElement("span");
    el.textContent = w;
    el.className = "word";
    grid.appendChild(el);
  });

  show("screen-words");

  const end = performance.now() + wordsDisplayMs;
  wordsTimerId = setInterval(() => {
    const left = Math.max(0, end - performance.now());
    const s = Math.ceil(left / 1000);
    $("words-timer").textContent =
      `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
    if (left <= 0) {
      clearInterval(wordsTimerId);
      finishWordsDisplay();
    }
  }, 100);
}

function finishWordsDisplay() {
  // Próxima parte: tela de transição (10s) → recordação → validação
  alert("Tempo esgotado. Próximo passo: transição + recordação (implementar na Parte 2).");
}

/* ---------- EVENTOS ---------- */
$("btn-full").addEventListener("click", () => { mode = "full"; startCalc(); });
$("btn-short").addEventListener("click", () => { mode = "short"; startCalc(); });
$("calc-confirm").addEventListener("click", submitCalc);
$("calc-input").addEventListener("keydown", e => { if (e.key === "Enter") submitCalc(); });
$("btn-to-words").addEventListener("click", startWords);
$("btn-words-done").addEventListener("click", finishWordsDisplay);

/* ---------- PWA ---------- */
if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js");
