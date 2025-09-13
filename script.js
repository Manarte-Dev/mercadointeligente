document.addEventListener("DOMContentLoaded", () => {

  // ===== ELEMENTOS =====
  const form = document.getElementById("form-item");
  const nomeInput = document.getElementById("nome");
  const categoriaSelect = document.getElementById("categoria");
  const categoriaSugerida = document.getElementById("categoria-sugerida");
  const catSugeridaText = document.getElementById("cat-sugerida-text");
  const btnSim = document.getElementById("btn-sim");
  const btnNao = document.getElementById("btn-nao");
  const lista = document.getElementById("lista-compras");
  const btnLimpar = document.getElementById("btn-limpar");

  const btnVisitante = document.getElementById('btn-visitante');
  const btnLogin = document.getElementById('btn-login');
  const btnLoginVisitante = document.getElementById('btn-login-visitante');
  const btnVoltar = document.getElementById('btn-voltar');
  const formItem = document.getElementById('form-item');
  const formLogin = document.getElementById('form-login');
  const modoAcesso = document.getElementById('modo-acesso');

  // ===== CATALOGO =====
  const catalogo = {
    "Frutas": ["banana","maçã","laranjas","uva","pera","abacaxi","melancia","mamão","morango","limão","tangerina","manga","kiwi","goiaba"],
    "Verduras e Legumes": ["alface","tomate","cenoura","batata","batata-doce","cebola","alho","couve","espinafre","pepino","abobrinha","pimentão","beterraba","chuchu","inhame"],
    "Carnes e Açougue": ["carne","frango","peixe","porco","bife","costela","salsicha","linguiça","presunto","bacon","hamburguer","peito de frango","tilápia","picanha"],
    "Padaria e Confeitaria": ["pão","bolo","croissant","biscoito","torrada","rosquinha","pão de queijo"],
    "Laticínios": ["leite","queijo","manteiga","requeijão","iogurte","ovos","creme de leite","leite condensado","chantilly"],
    "Bebidas": ["cerveja","suco","refrigerante","água","vinho","café","chá","energético","whisky","vodka"],
    "Mercearia": ["arroz","feijão","macarrão","açúcar","farinha","óleo","sal","molho de tomate","azeite","fermento","pipoca","achocolatado","grão-de-bico","lentilha"],
    "Congelados": ["pizza congelada","lasanha","hamburguer congelado","sorvete","batata frita","nuggets","polpa de fruta"],
    "Limpeza": ["detergente","sabão","amaciante","água sanitária","desinfetante","esponja","multiuso","álcool","veja"],
    "Higiene Pessoal": ["shampoo","condicionador","sabonete","creme dental","escova de dente","papel higiênico","desodorante","fio dental","absorvente","cotonete","lâmina de barbear"],
    "Utensílios Domésticos": ["prato","copo","talher","panela","frigideira","vassoura","rodo","balde","pano de prato","esponja de aço","saco de lixo"],
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

  // ===== FUNÇÕES AUXILIARES =====
  function criarItemElemento(nome, categoria) {
    const p = document.createElement("p");
    p.textContent = `${nome} - ${categoria}`;
    const btn = document.createElement("button");
    btn.textContent = "❌";
    btn.style.marginLeft = "10px";
    btn.style.cursor = "pointer";
    btn.style.background = "transparent";
    btn.style.border = "none";
    btn.onclick = () => { lista.removeChild(p); salvarItensVisitante(); atualizarBotaoLimpar(); };
    p.appendChild(btn);
    return p;
  }

  function atualizarBotaoLimpar() {
    btnLimpar.style.display = lista.children.length > 0 ? "inline-block" : "none";
  }

  // ===== SUGESTÃO DE CATEGORIA =====
  function sugerirCategoria(nome) {
    nome = nome.toLowerCase().trim();
    for (let cat in catalogo) {
      if (catalogo[cat].some(item => nome.includes(item))) return cat;
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

  // ===== ADICIONAR ITEM =====
  async function adicionarItem() {
    const nome = nomeInput.value.trim();
    let categoria = categoriaSelect.value || catSugeridaText.textContent || "Sem categoria";

    if (!nome) { alert("Digite o nome do item!"); return; }

    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await fetch('http://localhost:3000/api/itens', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': token },
          body: JSON.stringify({ nome, categoria })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        lista.appendChild(criarItemElemento(data.item.nome, data.item.categoria));
      } catch(err) { alert(err.message); }
    } else {
      lista.appendChild(criarItemElemento(nome, categoria));
      salvarItensVisitante();
    }

    form.reset();
    categoriaSelect.style.display = "none";
    categoriaSugerida.style.display = "none";
    catSugeridaText.textContent = "";
    atualizarBotaoLimpar();
  }

  form.addEventListener("submit", e => { e.preventDefault(); adicionarItem(); });
  nomeInput.addEventListener("keydown", e => { if(e.key==="Enter"){ e.preventDefault(); adicionarItem(); } });

  // ===== VISITANTE =====
  function salvarItensVisitante() {
    const visitItems = [];
    lista.querySelectorAll("p").forEach(p => {
      const texto = p.textContent.replace(" ❌", "");
      const [nome, categoria] = texto.split(" - ");
      visitItems.push({ nome, categoria });
    });
    localStorage.setItem('visitante-itens', JSON.stringify(visitItems));
  }

  async function carregarItens() {
    lista.innerHTML = '';
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const res = await fetch('http://localhost:3000/api/itens', { headers: { 'Authorization': token } });
        const itens = await res.json();
        itens.forEach(i => lista.appendChild(criarItemElemento(i.nome, i.categoria)));
      } catch(err) { console.log('Erro ao carregar itens', err); }
    } else {
      const visitItems = JSON.parse(localStorage.getItem('visitante-itens') || "[]");
      visitItems.forEach(i => lista.appendChild(criarItemElemento(i.nome, i.categoria)));
    }

    atualizarBotaoLimpar();
  }

  btnLimpar.addEventListener("click", () => {
    lista.innerHTML = '';
    localStorage.removeItem('visitante-itens');
    atualizarBotaoLimpar();
  });

  // ===== CONTROLE DE TELAS =====
  btnVisitante.addEventListener('click', () => { modoAcesso.style.display='none'; formItem.style.display='flex'; carregarItens(); });
  btnLogin.addEventListener('click', () => { modoAcesso.style.display='none'; formLogin.style.display='flex'; formItem.style.display='none'; mostrarBotaoGoogle(); });
  btnLoginVisitante.addEventListener('click', () => { formItem.style.display='none'; formLogin.style.display='flex'; mostrarBotaoGoogle(); });
  btnVoltar.addEventListener('click', () => { formLogin.style.display='none'; modoAcesso.style.display='block'; });

  // ===== LOGIN TRADICIONAL =====
  formLogin.addEventListener('submit', async e => {
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
    } catch(err) { alert(err.message); }
  });

  // ===== LOGIN GOOGLE =====
  function mostrarBotaoGoogle() {
    if (!document.getElementById('btn-google')) return;
    document.getElementById('btn-google').onclick = async () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      try {
        const result = await firebase.auth().signInWithPopup(provider);
        const token = await result.user.getIdToken();
        localStorage.setItem('token', token);
        alert('Login com Google realizado com sucesso!');
        formLogin.style.display='none';
        formItem.style.display='flex';
        carregarItens();
      } catch(err) { alert(err.message); }
    };
  }

  // ===== AUTO-CARREGAR ITENS =====
  if (localStorage.getItem('token') || JSON.parse(localStorage.getItem('visitante-itens') || "[]").length) {
    modoAcesso.style.display = 'none';
    formItem.style.display = 'flex';
    carregarItens();
  }

});
