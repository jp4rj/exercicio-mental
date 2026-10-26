// js/history.js

const MONTHS = ["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];

export function formatDate(iso) {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2,"0")} ${MONTHS[d.getMonth()]} ${d.getFullYear()} · ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
}

export function formatMMSS(ms) {
  const total = Math.round(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/**
 * Filtra sessões por período (dias). "all" = todas.
 */
export function filterSessions(sessions, range) {
  if (range === "all") return sessions;
  const days = Number(range);
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return sessions.filter(s => new Date(s.date).getTime() >= cutoff);
}

/**
 * Extrai uma série temporal de um exercício.
 * metric: função que recebe a sessão e devolve {value, label} ou null
 */
function extractSeries(sessions, hasExercise, metric) {
  return sessions
    .filter(s => s[hasExercise] && s[hasExercise].stats)
    .map(s => {
      const m = metric(s[hasExercise].stats);
      return m ? { date: s.date, value: m.value, label: m.label } : null;
    })
    .filter(Boolean);
}

/**
 * Desenha um gráfico de linha em SVG.
 * points: [{ date, value, label }]
 * opts: { color, invert (menor é melhor), unit }
 */
export function renderLineChart(points, opts = {}) {
  const { color = "#0d9488", invert = false, unit = "" } = opts;
  if (points.length === 0) return `<p class="chart-sub">Sem dados ainda.</p>`;

  const W = 320, H = 120, PAD = 8;
  const values = points.map(p => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const x = (i) => PAD + (i / Math.max(1, points.length - 1)) * (W - PAD * 2);
  const y = (v) => H - PAD - ((v - min) / range) * (H - PAD * 2);

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(p.value).toFixed(1)}`).join(" ");
  const dots = points.map((p, i) =>
    `<circle cx="${x(i).toFixed(1)}" cy="${y(p.value).toFixed(1)}" r="3" fill="${color}" />`
  ).join("");

  const last = points[points.length - 1];
  const first = points[0];
  const diff = last.value - first.value;
  const trend = points.length >= 2
    ? `<p class="chart-sub">${invert ? (diff < 0 ? "↓ melhora" : diff > 0 ? "↑ piora" : "estável") : (diff > 0 ? "↑ melhora" : diff < 0 ? "↓ piora" : "estável")} · últ. ${last.label}${unit}</p>`
    : `<p class="chart-sub">${last.label}${unit}</p>`;

  return `
    <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="gráfico">
      <path d="${linePath}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
      ${dots}
    </svg>
    ${trend}
  `;
}

/**
 * Renderiza o histórico inteiro numa tela.
 * sessions: array de sessões (do storage)
 * range: "7" | "30" | "all"
 */
export function renderHistory(sessions, range) {
  const filtered = filterSessions(sessions, range)
    .slice()
    .sort((a, b) => new Date(a.date) - new Date(b.date)); // cronológico

  const chartsWrap = document.getElementById("history-charts");
  const listWrap = document.getElementById("history-list");
  const emptyMsg = document.getElementById("history-empty");

  chartsWrap.innerHTML = "";
  listWrap.innerHTML = "";

  if (filtered.length === 0) {
    emptyMsg.hidden = false;
    return;
  }
  emptyMsg.hidden = true;

  // 1) Cálculo — tempo médio por operação (menor é melhor)
  const calcPoints = extractSeries(filtered, "calc", (st) => ({
    value: st.avgTimeMs, label: formatMMSS(st.avgTimeMs)
  }));
  if (calcPoints.length) {
    const card = document.createElement("div");
    card.className = "chart-card";
    card.innerHTML = `<h3>Cálculo</h3><p class="chart-sub">Tempo médio por operação</p>` +
      renderLineChart(calcPoints, { color: "#0d9488", invert: true });
    chartsWrap.appendChild(card);
  }

  // 2) Palavras — quantas lembrou
  const wordsPoints = extractSeries(filtered, "words", (st) => ({
    value: st.recalled, label: `${st.recalled}/${st.shown}`
  }));
  if (wordsPoints.length) {
    const card = document.createElement("div");
    card.className = "chart-card";
    card.innerHTML = `<h3>Palavras</h3><p class="chart-sub">Palavras lembradas por sessão</p>` +
      renderLineChart(wordsPoints, { color: "#f59e0b" });
    chartsWrap.appendChild(card);
  }

  // 3) Stroop — tempo de reação médio (menor é melhor)
  const stroopPoints = extractSeries(filtered, "stroop", (st) => ({
    value: st.avgReactionMs, label: formatMMSS(st.avgReactionMs)
  }));
  if (stroopPoints.length) {
    const card = document.createElement("div");
    card.className = "chart-card";
    card.innerHTML = `<h3>Cores (Stroop)</h3><p class="chart-sub">Tempo de reação médio</p>` +
      renderLineChart(stroopPoints, { color: "#3b82f6", invert: true });
    chartsWrap.appendChild(card);
  }

  // 4) Tarefa de Troca — tempo de reação médio (menor é melhor)
  const switchPoints = extractSeries(filtered, "switch", (st) => ({
    value: st.avgReactionMs, label: formatMMSS(st.avgReactionMs)
  }));
  if (switchPoints.length) {
    const card = document.createElement("div");
    card.className = "chart-card";
    card.innerHTML = `<h3>Tarefa de Troca</h3><p class="chart-sub">Tempo de reação médio</p>` +
      renderLineChart(switchPoints, { color: "#8b5cf6", invert: true });
    chartsWrap.appendChild(card);
  }

  // Lista de sessões (mais recente primeiro)
  filtered
    .slice()
    .reverse()
    .forEach(s => {
      const item = document.createElement("div");
      item.className = "history-item";
      const exercises = [];
      if (s.calc)   exercises.push("Cálculo");
      if (s.words)  exercises.push("Palavras");
      if (s.stroop) exercises.push("Cores");
      if (s.switch) exercises.push("Troca");
      const modeLabel = s.mode === "short" ? "Curta" : "Completa";
      item.innerHTML = `
        <div>
          <div class="hi-date">${formatDate(s.date)}</div>
          <div class="hi-meta">${exercises.join(" · ")}</div>
        </div>
        <span class="hi-badge">${modeLabel}</span>
      `;
      listWrap.appendChild(item);
    });
}
