const form = document.getElementById("form-item");
const nomeInput = document.getElementById("nome");
const categoriaSelect = document.getElementById("categoria");
const categoriaSugerida = document.getElementById("categoria-sugerida");
const catSugeridaText = document.getElementById("cat-sugerida-text");
const btnSim = document.getElementById("btn-sim");
const btnNao = document.getElementById("btn-nao");
const lista = document.getElementById("lista-compras");

const btnVisitante = document.getElementById('btn-visitante');
const btnLogin = document.getElementById('btn-login');
const btnLoginVisitante = document.getElementById('btn-login-visitante');
const btnVoltar = document.getElementById('btn-voltar');
const formItem = document.getElementById('form-item');
const formLogin = document.getElementById('form-login');
const modoAcesso = document.getElementById('modo-acesso');

// ---------------- Catalogo para sugestão ----------------
const catalogo = {
  "Frutas": ["banana","maçã","maçãs","laranja","laranjas","uva","uvas","pera","peras","abacaxi","melancia","mamão","morango","limão","tangerina","manga","kiwi","goiaba"],
  "Verduras e Legumes": ["alface","tomate","tomates","cenoura","cenouras","batata","batatas","batata-doce","cebola","cebolas","alho","alhos","couve","espinafre","pepino","abobrinha","pimentão","beterraba","chuchu","inhame"],
  "Carnes e Açougue": ["carne","carnes","frango","frangos","peixe","peixes","porco","bife","bifes","costela","salsicha","linguiça","presunto","bacon","hamburguer","peito de frango","tilápia","picanha"],
  "Padaria e Confeitaria": ["pão","pães","pão francês","pão integral","bolo","bolos","croissant","biscoito","torrada","rosquinha","pão de queijo"],
  "Laticínios": ["leite","queijo","queijos","manteiga","requeijão","iogurte","ovos","ovo","creme de leite","leite condensado","chantilly"],
  "Bebidas": ["cerveja","cervejas","suco","sucos","refrigerante","água","vinho","café","chá","energético","whisky","vodka"],
  "Mercearia": ["arroz","feijão","macarrão","açúcar","farinha","óleo","sal","molho de tomate","azeite","fermento","pipoca","achocolatado","grão-de-bico","lentilha"],
  "Congelados": ["pizza congelada","lasanha","hamburguer congelado","sorvete","batata frita","nuggets","polpa de fruta"],
  "Limpeza": ["detergente","sabão","sabão em pó","amaciante","água sanitária","desinfetante","esponja","multiuso","álcool","veja"],
  "Higiene Pessoal": ["shampoo","condicionador","sabonete","creme dental","escova de dente","papel higiênico","desodorante","fio dental","absorvente","cotonete","lâmina de barbear"],
  "Utensílios Domésticos": ["prato","pratos","copo","copos","talher","talheres","panela","panelas","frigideira","garfo","faca","colher","vassoura","rodo","balde","pano de prato","esponja de aço","saco de lixo"],
  "Temperos e Condimentos": ["sal","pimenta","orégano","alecrim","salsinha","cebolinha","manjericão","tempero pronto","açafrão","curry"],
  "Enlatados e Conservas": ["milho enlatado","ervilha","sardinha","atum","seleta de legumes","palmito","azeitona","pepino em conserva"],
  "Cereais e Matinais": ["aveia","granola","sucrilhos","cereal","farelo de aveia","barra de cereal"],
  "Biscoitos e Snacks": ["biscoito","bolacha","batata chips","amendoim","pipoca doce","salgadinho","torresmo"],
  "Doces e Sobremesas": ["chocolate","bala","pirulito","pudim","gelatina","brigadeiro","doce de leite","paçoca"],
  "Pet Shop": ["ração","areia para gato","petisco","coleira","shampoo pet","brinquedo pet"],
  "Bebê": ["fralda","lenço umedecido","mamadeira","chupeta","papinha","fórmula","pomada"],
  "Beleza e Cosméticos": ["batom","perfume","creme","hidratante","protetor solar","maquiagem","loção"],
  "Bazar": ["vela","pilha","lâmpada","isqueiro","fósforo","cabide","extensão elétrica","carvão"]
};

// ---------------- Sugestão de categoria ----------------
function sugerirCategoria(nome) {
  nome = nome.toLowerCase().trim();
  for (let categoria in catalogo) {
    if (catalogo[categoria].some(item => nome.includes(item))) return categoria;
  }
  return null;
}

nomeInput.addEventListener("input", () => {
  const sugestao = sugerirCategoria(nomeInput.value);
  if (sugestao) {
    categoriaSugerida.style.display = "block";
    catSugeridaText.textContent = sugestao;
    categoriaSelect.style.display = "none";
  } else {
    categoriaSugerida.style.display = "none";
    categoriaSelect.style.display = "block";
    catSugeridaText.textContent = "";
  }
});

btnSim.addEventListener("click", () => {
  categoriaSelect.value = catSugeridaText.textContent;
  categoriaSugerida.style.display = "none";
  categoriaSelect.style.display = "none";
});

btnNao.addEventListener("click", () => {
  categoriaSugerida.style.display = "none";
  categoriaSelect.style.display = "block";
});

// ---------------- Controle de telas ----------------
btnVisitante.addEventListener('click', () => {
  modoAcesso.style.display = 'none';
  formItem.style.display = 'flex';
  carregarItens(); // lista itens do visitante
});

btnLogin.addEventListener('click', () => {
  modoAcesso.style.display = 'none';
  formLogin.style.display = 'flex';
  formItem.style.display = 'none';
});

btnLoginVisitante.addEventListener('click', () => {
  formItem.style.display = 'none';
  formLogin.style.display = 'flex';
});

btnVoltar.addEventListener('click', () => {
  formLogin.style.display = 'none';
  modoAcesso.style.display = 'block';
});

// ---------------- Login/Registro via backend ----------------
formLogin.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  try {
    const res = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    localStorage.setItem('token', data.token);
    alert('Login/Registro realizado com sucesso!');

    formLogin.style.display = 'none';
    formItem.style.display = 'flex';

    carregarItens();
  } catch(err) {
    alert(err.message);
  }
});

// ---------------- Adicionar item ----------------
async function adicionarItem() {
  const nome = nomeInput.value.trim();
  const categoria = categoriaSelect.value || catSugeridaText.textContent;
  const token = localStorage.getItem('token');

  if (!nome) { alert("Digite o nome do item!"); return; }

  if (token) {
    // -------- Usuário logado: backend ----------
    try {
      const res = await fetch('http://localhost:3000/api/itens', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({ nome, categoria })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const item = document.createElement("p");
      item.textContent = `${data.item.nome} - ${data.item.categoria}`;
      lista.appendChild(item);

    } catch(err) {
      alert(err.message);
    }
  } else {
    // -------- Modo visitante: salvar localmente ----------
    const item = document.createElement("p");
    item.textContent = `${nome} - ${categoria}`;
    lista.appendChild(item);

    const visitItems = JSON.parse(localStorage.getItem('visitante-itens') || "[]");
    visitItems.push({ nome, categoria });
    localStorage.setItem('visitante-itens', JSON.stringify(visitItems));
  }

  // Reset do form
  form.reset();
  categoriaSelect.style.display = "none";
  categoriaSelect.value = "";
  categoriaSugerida.style.display = "none";
  catSugeridaText.textContent = "";
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  adicionarItem();
});

nomeInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    adicionarItem();
  }
});

// ---------------- Carregar itens ----------------
async function carregarItens() {
  lista.innerHTML = '';
  const token = localStorage.getItem('token');

  if (token) {
    // Logado: fetch backend
    try {
      const res = await fetch('http://localhost:3000/api/itens', {
        headers: { 'Authorization': token }
      });
      const itens = await res.json();
      itens.forEach(i => {
        const p = document.createElement("p");
        p.textContent = `${i.nome} - ${i.categoria}`;
        lista.appendChild(p);
      });
    } catch(err) {
      console.log('Erro ao carregar itens', err);
    }
  } else {
    // Visitante: carregar do localStorage
    const visitItems = JSON.parse(localStorage.getItem('visitante-itens') || "[]");
    visitItems.forEach(i => {
      const p = document.createElement("p");
      p.textContent = `${i.nome} - ${i.categoria}`;
      lista.appendChild(p);
    });
  }
}

// ---------------- Auto carregar itens se já logado ou visitante ----------
if (localStorage.getItem('token') || JSON.parse(localStorage.getItem('visitante-itens') || "[]").length) {
  modoAcesso.style.display = 'none';
  formItem.style.display = 'flex';
  carregarItens();
}
