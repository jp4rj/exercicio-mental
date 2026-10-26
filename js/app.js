// js/app.js
import { CONFIG } from "./config.js";
import { generateCalcList } from "../utils/calcGenerator.js";
import { drawWords } from "../utils/wordsBank.js";
import { generateStroopList } from "../utils/stroopGenerator.js";
import { saveSession, getStreak, updateStreak } from "./storage.js";

const $ = (id) => document.getElementById(id);
const show = (id) => {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  $(id).classList.add("active");
};

const fmt = (ms) => {
  const total = Math.round(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

/* mode: "full" | "short" — controla parâmetros
   flow: "session" | "single" — controla o que fazer ao final */
let mode = "full";
let flow = "session";
let session = null;

/* ============ EX1 — CÁLCULO ============ */
let calcTimerId = null, itemStart = 0, calcStartedAt = 0;
let calcBuffer = "";

function startCalc() {
  const count = CONFIG[mode].calcCount;
  if (!session) {
    session = { mode, flow, date: new Date().toISOString(), calc: null, words: null, stroop: null };
  }
  session.calc = { list: generateCalcList(count), index: 0, results: [] };
  calcStartedAt = performance.now();
  $("calc-counter").textContent = `1 / ${count}`;
  $("calc-progress").style.width = "0%";
  show("screen-calc");
  renderCalcItem();
  calcTimerId = setInterval(() => {
    $("calc-timer").textContent = fmt(performance.now() - calcStartedAt);
  }, 200);
}

function renderCalcItem() {
  const { list, index } = session.calc;
  if (index >= list.length) return finishCalc();
  const item = list[index];
  $("calc-counter").textContent = `${index + 1} / ${list.length}`;
  $("calc-progress").style.width = `${(index / list.length) * 100}%`;
  $("calc-question").textContent = `${item.a} ${item.operator} ${item.b} =`;
  calcBuffer = "";
  $("calc-answer").textContent = "—";
  itemStart = performance.now();
}

function pressKey(key) {
  if (key === "back") {
    calcBuffer = calcBuffer.slice(0, -1);
  } else if (key === "enter") {
    submitCalc();
    return;
  } else {
    if (calcBuffer.length < 4) calcBuffer += key;
  }
  $("calc-answer").textContent = calcBuffer || "—";
}

function submitCalc() {
  if (calcBuffer === "") return;
  const item = session.calc.list[session.calc.index];
  const given = Number(calcBuffer);
  session.calc.results.push({
    ...item, given, isCorrect: given === item.answer, timeMs: performance.now() - itemStart
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
  const avg = r.reduce((s, x) => s + x.timeMs, 0) / r.length;
  const totalMs = performance.now() - calcStartedAt;
  session.calc.stats = { correct, wrong, avgTimeMs: avg, durationMs: totalMs };
  $("calc-summary").textContent =
    `Acertos: ${correct} · Erros: ${wrong} · Tempo médio: ${fmt(avg)} · Total: ${fmt(totalMs)}`;

  // No fluxo individual, "Continuar" leva ao resumo
  const nextBtn = $("btn-calc-next");
  if (flow === "single") {
    nextBtn.textContent = "Ver resumo";
    nextBtn.onclick = showSummary;
  } else {
    nextBtn.textContent = "Continuar";
    nextBtn.onclick = startWords;
  }

  show("screen-calc-result");
}

/* ============ EX2 — PALAVRAS ============ */
let wordsTimerId = null;

function startWords() {
  const { wordsCount, wordsDisplayMs } = CONFIG[mode];
  const words = drawWords(wordsCount);
  if (!session) {
    session = { mode, flow, date: new Date().toISOString(), calc: null, words: null, stroop: null };
  }
  session.words = { words, recalled: [] };

  const grid = $("words-grid");
  grid.innerHTML = "";
  words.forEach(w => {
    const el = document.createElement("span");
    el.className = "word";
    el.textContent = w;
    grid.appendChild(el);
  });

  show("screen-words");
  const end = performance.now() + wordsDisplayMs;
  wordsTimerId = setInterval(() => {
    const left = Math.max(0, end - performance.now());
    const s = Math.ceil(left / 1000);
    $("words-timer").textContent =
      `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
    if (left <= 0) { clearInterval(wordsTimerId); goTransition(); }
  }, 100);
}

function goTransition() {
  show("screen-transition");
  let left = Math.ceil(CONFIG[mode].wordsTransitionMs / 1000);
  $("transition-timer").textContent = left;
  const id = setInterval(() => {
    left--;
    if (left <= 0) { clearInterval(id); startRecall(); return; }
    $("transition-timer").textContent = left;
  }, 1000);
}

const norm = (s) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, "").trim();

function startRecall() {
  $("recall-chips").innerHTML = "";
  $("recall-input").value = "";
  show("screen-recall");
  $("recall-input").focus();
}

function addRecall() {
  const raw = $("recall-input").value.trim();
  if (!raw) return;
  const n = norm(raw);
  if (!n) return;
  if (session.words.recalled.some(x => norm(x) === n)) { $("recall-input").value = ""; return; }
  session.words.recalled.push(raw);
  const chip = document.createElement("span");
  chip.className = "chip";
  chip.textContent = raw;
  $("recall-chips").appendChild(chip);
  $("recall-input").value = "";
  $("recall-input").focus();
}

function finishRecall() {
  const original = session.words.words;
  const recalledNorm = new Set(session.words.recalled.map(norm));
  const originalNorm = original.map(norm);

  const hits = original.filter((w) => recalledNorm.has(norm(w)));
  const miss = original.filter((w) => !recalledNorm.has(norm(w)));
  const invented = session.words.recalled.filter((w) => !originalNorm.includes(norm(w)));

  session.words.stats = {
    shown: original.length,
    recalled: hits.length,
    missed: miss.length,
    invented: invented.length,
  };

  $("words-summary").textContent =
    `Lembradas: ${hits.length} / ${original.length} · Esquecidas: ${miss.length} · Inventadas: ${invented.length}`;

  const detail = $("words-detail");
  detail.innerHTML = "";
  original.forEach((w) => {
    const el = document.createElement("span");
    el.className = "word " + (recalledNorm.has(norm(w)) ? "hit" : "miss");
    el.textContent = w;
    detail.appendChild(el);
  });

  // "Continuar" varia conforme o fluxo
  const nextBtn = $("btn-words-next");
  if (flow === "single") {
    nextBtn.textContent = "Ver resumo";
    nextBtn.onclick = showSummary;
  } else {
    nextBtn.textContent = "Continuar";
    nextBtn.onclick = () => show("screen-stroop-intro");
  }

  show("screen-words-result");
}

/* ============ EX3 — STROOP ============ */
let stroopTimerId = null, stroopItemStart = 0, stroopStartedAt = 0;

function startStroop() {
  const count = CONFIG[mode].stroopCount;
  if (!session) {
    session = { mode, flow, date: new Date().toISOString(), calc: null, words: null, stroop: null };
  }
  session.stroop = { list: generateStroopList(count), index: 0, results: [] };
  stroopStartedAt = performance.now();
  $("stroop-counter").textContent = `1 / ${count}`;
  $("stroop-progress").style.width = "0%";
  show("screen-stroop");
  renderStroopItem();
  stroopTimerId = setInterval(() => {
    $("stroop-timer").textContent = fmt(performance.now() - stroopStartedAt);
  }, 200);
}

function renderStroopItem() {
  const { list, index } = session.stroop;
  if (index >= list.length) return finishStroop();
  const item = list[index];
  $("stroop-counter").textContent = `${index + 1} / ${list.length}`;
  $("stroop-progress").style.width = `${(index / list.length) * 100}%`;
  const el = $("stroop-word");
  el.textContent = item.label;
  el.style.color = ({
    red: "#ef4444", blue: "#3b82f6", green: "#22c55e", yellow: "#eab308"
  })[item.ink];
  stroopItemStart = performance.now();
}

function submitStroop(givenColor) {
  const item = session.stroop.list[session.stroop.index];
  session.stroop.results.push({
    ...item,
    givenColor,
    isCorrect: givenColor === item.ink,
    reactionMs: performance.now() - stroopItemStart,
  });
  session.stroop.index++;
  renderStroopItem();
}

function finishStroop() {
  clearInterval(stroopTimerId);
  $("stroop-progress").style.width = "100%";
  const r = session.stroop.results;
  const correct = r.filter(x => x.isCorrect).length;
  const wrong = r.length - correct;
  const avg = r.reduce((s, x) => s + x.reactionMs, 0) / r.length;
  session.stroop.stats = { correct, wrong, avgReactionMs: avg };
  $("stroop-summary").textContent =
    `Acertos: ${correct} · Erros: ${wrong} · Tempo de reação médio: ${fmt(avg)}`;

  // "Ver resumo" sempre leva ao resumo — no fluxo individual também
  $("btn-stroop-next").textContent = "Ver resumo";
  $("btn-stroop-next").onclick = showSummary;

  show("screen-stroop-result");
}

/* ============ RESUMO + PERSISTÊNCIA ============ */
function showSummary() {
  const { calc, words, stroop } = session;
  const cards = [];
  if (calc)   cards.push({ title: "Cálculo",  text: `${calc.stats.correct} acertos · ${fmt(calc.stats.avgTimeMs)}/op` });
  if (words)  cards.push({ title: "Palavras", text: `${words.stats.recalled} / ${words.stats.shown} lembradas` });
  if (stroop) cards.push({ title: "Cores",    text: `${stroop.stats.correct} acertos · ${fmt(stroop.stats.avgReactionMs)}` });

  const wrap = $("summary-cards");
  wrap.innerHTML = "";
  cards.forEach(c => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `<h3>${c.title}</h3><p>${c.text}</p>`;
    wrap.appendChild(div);
  });

  saveSession(session);
  show("screen-summary");
}

function goHome() {
  updateStreak();
  $("streak").textContent = `🔥 ${getStreak()} dias seguidos`;
  session = null;
  flow = "session";
  mode = "full";
  show("screen-home");
}

/* ============ EVENTOS ============ */
$("btn-full").addEventListener("click",  () => { mode = "full";  flow = "session"; session = null; startCalc(); });
$("btn-short").addEventListener("click", () => { mode = "short"; flow = "session"; session = null; startCalc(); });

// treino individual
document.querySelectorAll(".single-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    flow = "single";
    mode = "full";          // usa parâmetros completos no treino individual
    session = null;
    const which = btn.dataset.single;
    if (which === "calc")   startCalc();
    if (which === "words")  startWords();
    if (which === "stroop") show("screen-stroop-intro");
  });
});

// teclado numérico próprio
document.querySelectorAll(".keypad .key").forEach(btn => {
  btn.addEventListener("click", () => pressKey(btn.dataset.key));
});

$("btn-words-done").addEventListener("click", () => { clearInterval(wordsTimerId); goTransition(); });

$("recall-add").addEventListener("click", addRecall);
$("recall-input").addEventListener("keydown", e => { if (e.key === "Enter") addRecall(); });
$("recall-done").addEventListener("click", finishRecall);

$("btn-stroop-start").addEventListener("click", startStroop);

document.querySelectorAll("#screen-stroop .color-btn").forEach(btn => {
  btn.addEventListener("click", () => submitStroop(btn.dataset.color));
});

$("btn-home").addEventListener("click", goHome);

// "Voltar à Home" nas telas de resultado
$("btn-calc-home").addEventListener("click", goHome);
$("btn-words-home").addEventListener("click", goHome);
$("btn-stroop-home").addEventListener("click", goHome);

/* ============ INICIALIZAÇÃO ============ */
updateStreak();
$("streak").textContent = `🔥 ${getStreak()} dias seguidos`;

if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js");
