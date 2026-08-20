import { supabase } from '../../atividades/js/supabase-client.js';

const form = document.getElementById('form-verificar');
const campoCodigo = document.getElementById('codigo');
const botao = document.getElementById('botao-verificar');
const erro = document.getElementById('erro');
const resultado = document.getElementById('resultado');

function mostrarErro(mensagem) {
  resultado.hidden = true;
  erro.textContent = mensagem;
  erro.hidden = false;
}

function mostrarResultado(dados) {
  erro.hidden = true;

  if (!dados) {
    resultado.className = 'cartao-verificacao invalido';
    resultado.innerHTML = '<p class="selo-ok" style="color:var(--terracota)">Código não encontrado</p><p>Não existe certificado com esse código. Confira se digitou corretamente.</p>';
    resultado.hidden = false;
    return;
  }

  const dataFormatada = new Date(dados.emitido_em).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  resultado.className = 'cartao-verificacao valido';
  resultado.innerHTML = `
    <p class="selo-ok">✓ Certificado autêntico</p>
    <dl>
      <dt>Aluno(a)</dt><dd>${dados.nome_aluno}</dd>
      <dt>Trilha</dt><dd>${dados.nome_trilha}</dd>
      <dt>Carga horária</dt><dd>${dados.carga_horaria_horas} horas</dd>
      <dt>Emitido em</dt><dd>${dataFormatada}</dd>
    </dl>
  `;
  resultado.hidden = false;
}

async function verificar(codigoDigitado) {
  const codigo = codigoDigitado.trim().toUpperCase();
  if (!codigo) return;

  botao.disabled = true;
  botao.textContent = 'Verificando...';

  const { data, error: erroConsulta } = await supabase
    .rpc('verificar_certificado', { p_codigo: codigo })
    .maybeSingle();

  botao.disabled = false;
  botao.textContent = 'Verificar';

  if (erroConsulta) {
    mostrarErro('Não foi possível verificar agora. Tente novamente em instantes.');
    return;
  }

  mostrarResultado(data);
}

form.addEventListener('submit', (evento) => {
  evento.preventDefault();
  verificar(campoCodigo.value);
});

const codigoNaUrl = new URLSearchParams(window.location.search).get('codigo');
if (codigoNaUrl) {
  campoCodigo.value = codigoNaUrl;
  verificar(codigoNaUrl);
}
