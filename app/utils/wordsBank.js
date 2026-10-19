// utils/wordsBank.js
export const WORDS = [
  "casa","mesa","cachorro","janela","livro","praia","montanha","relógio",
  "cadeira","flor","rio","nuvem","sapato","cidade","carro","árvore",
  "peixe","fogo","pedra","porta","chave","lua","sol","estrela",
  "ponte","torre","jardim","papel","caneta","espelho","mel","limão",
  "areia","vento","chuva","trem","barco","avião","campo","folha",
  "raiz","fruta","leite","pão","queijo","café","prato","faca",
  "garfo","colher","panela","fogão","geladeira","sofá","cama","travesseiro",
  "cobertor","tapete","quadro","parede","teto","chão","escada","telhado",
  "vila","praça","igreja","escola","hospital","mercado","farmácia","banco",
  "rua","avenida","farol","sinal","bicicleta","moto","ônibus","metrô",
  "jornada","viagem","mala","mapa","bússola","tesouro","castelo","dragão",
  "fada","bruxa","gigante","anão","príncipe","princesa","rei","rainha",
];

export function drawWords(n) {
  const pool = [...WORDS];
  const out = [];
  for (let i = 0; i < n && pool.length; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    out.push(pool.splice(idx, 1)[0]);
  }
  return out;
}
