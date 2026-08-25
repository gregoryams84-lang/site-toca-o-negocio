import { supabase } from './supabase-client.js';

const PLANOS = {
  avulsa: { quantidade: 1, rotulo: 'Escolha 1 trilha:' },
  duas: { quantidade: 2, rotulo: 'Escolha 2 trilhas:' },
  completo: { quantidade: null, rotulo: null },
};

const planosGrade = document.getElementById('planos-grade');
const selecaoTrilhas = document.getElementById('selecao-trilhas');
const instrucaoTrilhas = document.getElementById('instrucao-trilhas');
const listaTrilhas = document.getElementById('lista-trilhas');
const form = document.getElementById('form-comprar');
const erro = document.getElementById('erro');
const botao = document.getElementById('botao-comprar');
const campoCpf = document.getElementById('cpf');

function formatarCpf(valor) {
  const digitos = valor.replace(/\D/g, '').slice(0, 11);
  return digitos
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function cpfValido(valor) {
  const cpf = valor.replace(/\D/g, '');
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += Number(cpf[i]) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== Number(cpf[9])) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += Number(cpf[i]) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  return resto === Number(cpf[10]);
}

campoCpf.addEventListener('input', () => {
  campoCpf.value = formatarCpf(campoCpf.value);
});

let trilhas = [];
let planoSelecionado = null;
let trilhaIdsSelecionadas = [];

const { data: trilhasCarregadas, error: erroTrilhas } = await supabase.from('trilhas').select('id, nome').order('ordem');

if (erroTrilhas) {
  console.error('Falha ao buscar trilhas', erroTrilhas);
} else if (trilhasCarregadas) {
  trilhas = trilhasCarregadas;
}

const PRECO_TRILHA_AVULSA_REFERENCIA = 99;

const totalTrilhas = trilhas.length;

if (totalTrilhas < 2) {
  document.getElementById('cartao-duas').disabled = true;
  document.getElementById('aviso-duas').hidden = false;
}

if (totalTrilhas < 3) {
  document.getElementById('cartao-completo').disabled = true;
  document.getElementById('aviso-completo').hidden = false;
  document.getElementById('selo-completo').hidden = true;
} else {
  document.getElementById('descricao-completo').textContent = `Acesso às ${totalTrilhas} trilhas`;
  const economia = totalTrilhas * PRECO_TRILHA_AVULSA_REFERENCIA - 350;
  const selo = document.getElementById('selo-completo');
  if (economia > 0) {
    selo.textContent = `Economize R$ ${economia}`;
  } else {
    selo.hidden = true;
  }
}

function atualizarBotaoComprar() {
  if (!planoSelecionado) {
    botao.disabled = true;
    return;
  }
  if (planoSelecionado === 'completo') {
    botao.disabled = trilhas.length === 0;
    return;
  }
  const quantidade = PLANOS[planoSelecionado].quantidade;
  botao.disabled = trilhaIdsSelecionadas.length !== quantidade;
}

function renderizarSelecaoTrilhas() {
  listaTrilhas.innerHTML = '';

  if (planoSelecionado === 'completo') {
    selecaoTrilhas.hidden = true;
    trilhaIdsSelecionadas = trilhas.map((t) => t.id);
    return;
  }

  const quantidade = PLANOS[planoSelecionado].quantidade;
  instrucaoTrilhas.textContent = PLANOS[planoSelecionado].rotulo;
  selecaoTrilhas.hidden = false;
  trilhaIdsSelecionadas = [];

  for (const trilha of trilhas) {
    const item = document.createElement('li');
    const label = document.createElement('label');
    const input = document.createElement('input');
    input.type = quantidade === 1 ? 'radio' : 'checkbox';
    input.name = 'trilha';
    input.value = trilha.id;
    input.addEventListener('change', () => {
      if (quantidade === 1) {
        trilhaIdsSelecionadas = input.checked ? [trilha.id] : [];
      } else {
        const marcadas = Array.from(listaTrilhas.querySelectorAll('input:checked'));
        if (marcadas.length > quantidade) {
          input.checked = false;
        } else {
          trilhaIdsSelecionadas = marcadas.map((el) => el.value);
        }
      }
      atualizarBotaoComprar();
    });
    label.appendChild(input);
    label.appendChild(document.createTextNode(trilha.nome));
    item.appendChild(label);
    listaTrilhas.appendChild(item);
  }
}

function selecionarPlano(cartao) {
  if (!cartao || cartao.disabled) return;

  for (const outro of planosGrade.querySelectorAll('.plano-card')) {
    outro.classList.remove('selecionado');
  }
  cartao.classList.add('selecionado');

  planoSelecionado = cartao.dataset.plano;
  form.hidden = false;
  renderizarSelecaoTrilhas();
  atualizarBotaoComprar();
}

planosGrade.addEventListener('click', (evento) => {
  const cartao = evento.target.closest('.plano-card');
  if (!cartao) return;
  selecionarPlano(cartao);
});

// Permite chegar direto num plano específico via link (?plano=avulsa|duas|completo),
// usado pelos cards de preço da home.
const planoNaUrl = new URLSearchParams(window.location.search).get('plano');
if (planoNaUrl) {
  const cartaoAlvo = planosGrade.querySelector(`.plano-card[data-plano="${planoNaUrl}"]`);
  if (cartaoAlvo) {
    selecionarPlano(cartaoAlvo);
    cartaoAlvo.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

form.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  erro.hidden = true;

  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const cpf = campoCpf.value.trim();

  if (!cpfValido(cpf)) {
    erro.textContent = 'CPF inválido. Confira os números digitados.';
    erro.hidden = false;
    campoCpf.focus();
    return;
  }

  botao.disabled = true;
  botao.textContent = 'Aguarde...';

  try {
    const { data, error } = await supabase.functions.invoke('criar-preferencia-pagamento', {
      body: { nome, email, cpf, trilhaIds: trilhaIdsSelecionadas },
    });

    if (error || !data || !data.initPoint) {
      throw new Error('falha ao criar pagamento');
    }

    window.location.href = data.initPoint;
  } catch {
    erro.textContent = 'Não foi possível iniciar o pagamento agora. Tente novamente em instantes.';
    erro.hidden = false;
    botao.disabled = false;
    botao.textContent = 'Comprar';
  }
});
