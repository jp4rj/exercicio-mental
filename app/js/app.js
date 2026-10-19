import { generateCalcList } from "../utils/calcGenerator.js";

const $ = (id) => document.getElementById(id);
const show = (id) => {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  $(id).classList.add("active");
};

let session = null;

function startCalc() {
  const list = generateCalcList(20);
  session = {
    startedAt: performance.now(),
    index: 0,
    list,
    results: []
  };
  show("screen-calc");
  renderCalcItem();
  startCalcTimer();
}

function renderCalcItem() {
  const { list, index } = session;
  if (index >= list.length) return finishCalc();
  const item = list[index];
  $("calc-counter").textContent = `${index + 1} / ${list.length}`;
  $("calc-question").textContent = `${item.a} ${item.operator} ${item.b} =`;
  $("calc-input").value = "";
  $("calc-input").focus();
}

let calcTimerId = null;
let itemStart = 0;

function startCalcTimer() {
  const t0 = performance.now();
  itemStart = t0;
  calcTimerId = setInterval(() => {
    $("calc-timer").textContent = ((performance.now() - t0) / 1000).toFixed(1) + "s";
  }, 100);
}

function submitCalcAnswer() {
  const val = $("calc-input").value;
  if (val === "") return;
  const item = session.list[session.index];
  const given = Number(val);
  const timeMs = performance.now() - itemStart;

  session.results.push({
    ...item,
    given,
    isCorrect: given === item.answer,
    timeMs
  });

  session.index++;
  renderCalcItem();
}

function finishCalc() {
  clearInterval(calcTimerId);
  const totalMs = performance.now() - session.startedAt;
  const correct = session.results.filter(r => r.isCorrect).length;
  const wrong = session.results.length - correct;
  const avg = Math.round(session.results.reduce((s, r) => s + r.timeMs, 0) / session.results.length);

  $("calc-summary").textContent =
    `Acertos: ${correct} · Erros: ${wrong} · Tempo médio: ${avg}ms · Total: ${(totalMs/1000).toFixed(1)}s`;

  show("screen-calc-result");
  // salvar no histórico (próxima iteração)
}

// Eventos
$("btn-start").addEventListener("click", startCalc);
$("calc-confirm").addEventListener("click", submitCalcAnswer);
$("calc-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") submitCalcAnswer();
});
$("btn-to-words").addEventListener("click", () => {
  alert("Próxima etapa: memória de palavras (ainda não implementada neste protótipo)");
});

// Registro do service worker (PWA)
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js");
}
