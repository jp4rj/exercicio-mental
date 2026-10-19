// utils/calcGenerator.js
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function generateOperation(operator) {
  let a = randInt(1, 9);
  let b = randInt(1, 9);
  if (operator === "-" && a < b) [a, b] = [b, a];
  const answer =
    operator === "+" ? a + b :
    operator === "-" ? a - b :
    a * b;
  return { a, b, operator, answer };
}

export function generateCalcList(count, operators = ["+", "-", "×"]) {
  const list = [];
  let last = null;
  while (list.length < count) {
    const op = operators[randInt(0, operators.length - 1)];
    const item = generateOperation(op);
    if (last && last.a === item.a && last.b === item.b && last.operator === item.operator) continue;
    list.push(item);
    last = item;
  }
  return list;
}
