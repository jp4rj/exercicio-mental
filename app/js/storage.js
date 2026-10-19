// js/storage.js
const KEY = "treino-mental:sessions";
const KEY_STREAK = "treino-mental:streak";

export function saveSession(session) {
  const all = loadSessions();
  all.push(session);
  localStorage.setItem(KEY, JSON.stringify(all));
  updateStreak();
}

export function loadSessions() {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); }
  catch { return []; }
}

export function updateStreak() {
  const sessions = loadSessions();
  if (!sessions.length) { localStorage.setItem(KEY_STREAK, "0"); return 0; }

  const days = new Set(sessions.map(s => new Date(s.date).toDateString()));
  const today = new Date();
  let streak = 0;
  const cursor = new Date(today);
  while (days.has(cursor.toDateString())) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  localStorage.setItem(KEY_STREAK, String(streak));
  return streak;
}

export function getStreak() {
  return Number(localStorage.getItem(KEY_STREAK) || "0");
}
