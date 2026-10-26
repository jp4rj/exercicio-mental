// utils/taskSwitchGenerator.js

const VOWELS = ["A","E","I","O","U"];
const CONSONANTS = ["B","C","D","F","G","H","J","K","L","M","N","P","Q","R","S","T","V","W","X","Y","Z"];

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[randInt(0, arr.length - 1)];

/**
 * Gera N itens de Tarefa de Troca.
 * Regra alterna a cada item: "par" (fundo azul) / "vogal" (fundo verde).
 * Estímulo é número na regra "par" e letra na regra "vogal".
 * Evita repetir o mesmo estímulo em sequência.
 *
 * Retorna: { rule, stimulus, answer, label }
 *   rule: "even" | "vowel"
 *   answer: true (Sim) | false (Não)
 */
export function generateTaskSwitchList(count) {
  const list = [];
  let lastStimulus = null;
  let rule = Math.random() < 0.5 ? "even" : "vowel";

  while (list.length < count) {
    // alterna a regra a cada item
    if (list.length > 0) rule = rule === "even" ? "vowel" : "even";

    let stimulus, answer;
    let guard = 0;

    if (rule === "even") {
      // número: metade par, metade ímpar
      do {
        const n = randInt(1, 99);
        stimulus = String(n);
        answer = n % 2 === 0;
        guard++;
      } while (stimulus === lastStimulus && guard < 20);
    } else {
      // letra: metade vogal, metade consoante
      do {
        if (Math.random() < 0.5) {
          stimulus = pick(VOWELS);
          answer = true;
        } else {
          stimulus = pick(CONSONANTS);
          answer = false;
        }
        guard++;
      } while (stimulus === lastStimulus && guard < 20);
    }

    list.push({ rule, stimulus, answer });
    lastStimulus = stimulus;
  }

  return list;
}
