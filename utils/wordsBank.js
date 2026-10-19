// utils/wordsBank.js

const KEY_USED = "treino-mental:usedWords";

export const WORDS_BY_CATEGORY = {
  animais: [
    "cachorro","gato","pássaro","peixe","cavalo","vaca","porco","galinha","pato","coelho",
    "rato","leão","tigre","elefante","girafa","zebra","macaco","urso","lobo","raposa",
    "veado","cabra","ovelha","bode","touro","camelo","jacaré","cobra","tartaruga","sapo",
    "abelha","formiga","aranha","borboleta","mosquito","mosca","barata","grilo","caracol","golfinho",
    "baleia","tubarão","polvo","caranguejo","camarão","lula","pardal","coruja","águia","falcão",
    "gavião","pomba","papagaio","periquito","tucano","flamingo","cisne","galo","peru","pavão",
    "avestruz","pinguim","foca","morsa","lontra","castor","esquilo","ouriço","tatu","preguiça",
    "chipanzé","gorila","orangotango","lêmure","morcego","furão","doninha","texugo","guaxinim","canguru",
    "coala","panda","hiena","chacal","antílope","búfalo","rinoceronte","hipopótamo","camaleão","lagarto",
    "iguana","salamandra","tritão","enguia","sardinha","atum","jaguar","onça","lince","mico"
  ],
  objetos: [
    "mesa","cadeira","cama","sofá","armário","geladeira","fogão","microondas","liquidificador","torradeira",
    "panela","frigideira","prato","copo","caneca","garfo","faca","colher","concha","espátula",
    "vassoura","rodo","balde","pano","esponja","sabão","xampu","escova","pente","espelho",
    "toalha","lençol","travesseiro","cobertor","colchão","tapete","cortina","quadro","vaso","luminária",
    "lâmpada","abajur","ventilador","televisão","rádio","telefone","celular","computador","teclado","mouse",
    "impressora","scanner","monitor","caixa","fone","microfone","câmera","relógio","despertador","calendário",
    "agenda","caneta","lápis","borracha","régua","tesoura","cola","papel","caderno","livro",
    "revista","jornal","envelope","carimbo","grampeador","clipe","pasta","mochila","bolsa","carteira",
    "chave","cadeado","porta","janela","fechadura","maçaneta","campainha","sofá","poltrona","banquinho"
  ],
  natureza: [
    "árvore","flor","folha","raiz","caule","semente","fruto","grama","musgo","samambaia",
    "palmeira","pinheiro","roseira","margarida","girassol","tulipa","orquídea","violeta","cravo","jasmim",
    "rio","lago","mar","oceano","praia","areia","onda","maré","cachoeira","riacho",
    "montanha","serra","vale","colina","penhasco","rocha","pedra","terra","lama","nuvem",
    "chuva","vento","tempestade","trovão","relâmpago","arco-íris","neblina","orvalho","geada","sol",
    "lua","estrela","céu","horizonte","aurora","crepúsculo","amanhecer","entardecer","noite","fogo",
    "chama","fumaça","cinza","brasa","calor","frio","gelo","neve","granizo","deserto",
    "duna","oásis","selva","floresta","bosque","mata","campo","prado","planície","ilha",
    "arquipélago","península","enseada","baía","golfo","estuário","delta","mangue","recife","pântano"
  ],
  alimentos: [
    "pão","queijo","leite","manteiga","iogurte","requeijão","creme","ovo","carne","frango",
    "peixe","porco","boi","linguiça","salsicha","presunto","bacon","costela","filé","arroz",
    "feijão","macarrão","lasanha","pizza","hambúrguer","sanduíche","sopa","salada","torta","bolo",
    "pudim","gelatina","sorvete","chocolate","bala","doce","biscoito","bolacha","rosquinha","maçã",
    "banana","laranja","limão","uva","pera","mamão","melancia","melão","abacaxi","morango",
    "framboesa","amora","cereja","pêssego","ameixa","kiwi","manga","abacate","goiaba","cenoura",
    "batata","tomate","cebola","alho","pimentão","abobrinha","berinjela","pepino","repolho","alface",
    "rúcula","agrião","espinafre","brócolis","couve-flor","beterraba","nabo","rabanete","chuchu","café",
    "chá","suco","refrigerante","água","vinho","cerveja","whisky","vodka","licor","mel"
  ],
  lugares: [
    "casa","apartamento","prédio","edifício","torre","castelo","palácio","chácara","sítio","fazenda",
    "escola","faculdade","universidade","biblioteca","museu","teatro","cinema","galeria","auditório","ginásio",
    "hospital","clínica","farmácia","consultório","laboratório","posto","mercado","supermercado","feira","shopping",
    "padaria","açougue","peixaria","hortifruti","restaurante","lanchonete","cafeteria","bar","pizzaria","sorveteria",
    "banco","cartório","correio","delegacia","prefeitura","fórum","tribunal","presídio","quartel","bombeiro",
    "igreja","templo","mesquita","sinagoga","capela","catedral","mosteiro","cemitério","praça","parque",
    "jardim","zoológico","aquário","circo","estádio","arena","piscina","clube","hotel","pousada",
    "praia","montanha","campo","floresta","deserto","ilha","porto","aeroporto","rodoviária","estação",
    "rua","avenida","alameda","travessa","beco","largo","viaduto","ponte","túnel","passarela"
  ],
  ações: [
    "correr","andar","pular","saltar","dançar","cantar","gritar","sussurrar","falar","calar",
    "ouvir","escutar","ver","olhar","observar","notar","pensar","imaginar","sonhar","lembrar",
    "esquecer","aprender","ensinar","estudar","ler","escrever","desenhar","pintar","colorir","apagar",
    "abrir","fechar","entrar","sair","subir","descer","chegar","partir","voltar","seguir",
    "comer","beber","mastigar","engolir","digerir","cozinhar","assar","fritar","temperar","servir",
    "dormir","acordar","levantar","sentar","deitar","descansar","relaxar","espreguiçar","bocejar","sonhar",
    "trabalhar","jogar","brincar","ganhar","perder","empatar","competir","treinar","praticar","amar",
    "odiar","gostar","detestar","preferir","escolher","decidir","duvidar","confiar","ajudar","atrapalhar",
    "empurrar","puxar","carregar","soltar","segurar","apertar","construir","destruir","consertar","quebrar",
    "limpar","sujar","lavar","secar","passar","dobrar","cortar","colar","medir","pesar"
  ],
  emoções: [
    "alegria","tristeza","raiva","medo","amor","ódio","saudade","esperança","fé","coragem",
    "ansiedade","calma","serenidade","paz","guerra","tensão","estresse","relaxamento","euforia","melancolia",
    "nostalgia","vergonha","orgulho","vaidade","humildade","gratidão","inveja","ciúme","compaixão","empatia",
    "simpatia","antipatia","carinho","afeto","ternura","paixão","desejo","prazer","dor","angústia",
    "aflição","preocupação","alívio","satisfação","frustração","decepção","surpresa","espanto","admiração","desprezo",
    "desdém","rancor","perdão","culpa","inocência","confiança","desconfiança","segurança","insegurança","entusiasmo",
    "desânimo","animação","apatia","curiosidade","tédio","interesse","desinteresse","atenção","distração","solidão",
    "companhia","amizade","inimizade","harmonia","conflito","união","separação","encontro","despedida","luto",
    "esperança","sossego","tranquilidade","nervosismo","pânico","coragem","covardia","ousadia","timidez","extroversão"
  ],
  corpo: [
    "cabeça","cabelo","testa","sobrancelha","olho","cílio","pálpebra","nariz","boca","lábio",
    "língua","dente","gengiva","queixo","bochecha","orelha","pescoço","garganta","nuca","ombro",
    "braço","cotovelo","antebraço","punho","mão","dedo","unha","palma","dorso","peito",
    "barriga","cintura","quadril","perna","coxa","joelho","canela","panturrilha","tornozelo","pé",
    "calcanhar","planta","pele","carne","osso","músculo","nervo","veia","artéria","sangue",
    "coração","pulmão","fígado","rim","estômago","intestino","pâncreas","baço","cérebro","medula",
    "coluna","costela","crânio","mandíbula","clavícula","escápula","úmero","rádio","ulna","fêmur",
    "tíbia","fíbula","patela","pélvis","vértebra","cartilagem","tendão","ligamento","pulso","axila"
  ],
  tempo: [
    "segundo","minuto","hora","dia","semana","mês","ano","década","século","milênio",
    "manhã","tarde","noite","madrugada","alvorada","crepúsculo","amanhecer","anoitecer","meia-noite","meio-dia",
    "segunda","terça","quarta","quinta","sexta","sábado","domingo","feriado","férias","folga",
    "janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro",
    "novembro","dezembro","verão","outono","inverno","primavera","estação","época","período","intervalo",
    "passado","presente","futuro","eternidade","instante","momento","agora","depois","antes","enquanto",
    "cedo","tarde","rápido","devagar","lento","breve","longo","curto","duradouro","passageiro",
    "atraso","adiantamento","pontualidade","rotina","agenda","horário","cronograma","calendário","relógio","ampulheta"
  ],
  transportes: [
    "carro","moto","bicicleta","triciclo","patinete","ônibus","metrô","trem","bonde","táxi",
    "caminhão","carreta","van","kombi","jipe","picape","limusine","ambulância","viatura","guincho",
    "barco","navio","iate","lancha","canoa","caiaque","jangada","balsa","submarino","veleiro",
    "avião","helicóptero","balão","dirigível","foguete","planador","asa-delta","paraquedas","jato","ultraleve",
    "charrete","carroça","trenó","patins","skate","scooter","segway","monotrilho","funicular","teleférico",
    "porto","aeroporto","rodoviária","estação","terminal","garagem","hangar","pista","trilho","estrada"
  ],
  profissões: [
    "médico","enfermeiro","dentista","advogado","juiz","promotor","delegado","policial","bombeiro","soldado",
    "professor","diretor","coordenador","pedagogo","psicólogo","psiquiatra","fisioterapeuta","nutricionista","veterinário","farmacêutico",
    "engenheiro","arquiteto","designer","programador","analista","técnico","mecânico","eletricista","encanador","pedreiro",
    "carpinteiro","pintor","soldador","marceneiro","costureira","cozinheiro","chef","garçom","barman","padeiro",
    "açougueiro","feirante","vendedor","caixa","gerente","empresário","contador","economista","administrador","secretária",
    "jornalista","repórter","fotógrafo","cinegrafista","editor","escritor","poeta","tradutor","intérprete","bibliotecário",
    "artista","músico","cantor","dançarino","ator","atriz","produtor","cenógrafo","figurinista","maquiador",
    "motorista","piloto","comissário","controlador","maquinista","cobrador","entregador","motoboy","carteiro","segurança"
  ]
};

// Lista achatada SEM duplicatas
export const ALL_WORDS = [...new Set(Object.values(WORDS_BY_CATEGORY).flat())];

/**
 * Sorteia N palavras sem repetição entre sessões.
 * Marca as usadas no localStorage. Quando o pool fica pequeno, recicla.
 */
export function drawWords(n) {
  const used = new Set(JSON.parse(localStorage.getItem(KEY_USED) || "[]"));
  let pool = ALL_WORDS.filter(w => !used.has(w));

  if (pool.length < n * 2) {
    localStorage.setItem(KEY_USED, "[]");
    used.clear();
    pool = [...ALL_WORDS];
  }

  const out = [];
  const p = [...pool];
  while (out.length < n && p.length) {
    const idx = Math.floor(Math.random() * p.length);
    out.push(p.splice(idx, 1)[0]);
  }

  const newUsed = [...used, ...out];
  localStorage.setItem(KEY_USED, JSON.stringify(newUsed.slice(-800)));
  return out;
}
