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

let trilhas = [];
let planoSelecionado = null;
let trilhaIdsSelecionadas = [];

const { data: trilhasCarregadas, error: erroTrilhas } = await supabase.from('trilhas').select('id, nome');

if (erroTrilhas) {
  console.error('Falha ao buscar trilhas', erroTrilhas);
} else if (trilhasCarregadas) {
  trilhas = trilhasCarregadas;
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

planosGrade.addEventListener('click', (evento) => {
  const cartao = evento.target.closest('.plano-card');
  if (!cartao) return;

  for (const outro of planosGrade.querySelectorAll('.plano-card')) {
    outro.classList.remove('selecionado');
  }
  cartao.classList.add('selecionado');

  planoSelecionado = cartao.dataset.plano;
  form.hidden = false;
  renderizarSelecaoTrilhas();
  atualizarBotaoComprar();
});

form.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  erro.hidden = true;
  botao.disabled = true;
  botao.textContent = 'Aguarde...';

  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();

  try {
    const { data, error } = await supabase.functions.invoke('criar-preferencia-pagamento', {
      body: { nome, email, trilhaIds: trilhaIdsSelecionadas },
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
