import { supabase } from './supabase-client.js';

const form = document.getElementById('form-recuperar');
const mensagem = document.getElementById('mensagem');
const botao = document.getElementById('botao-recuperar');
const textoOriginalBotao = botao.textContent;
const ESPERA_SEGUNDOS = 60;

function iniciarEspera() {
  let restante = ESPERA_SEGUNDOS;
  botao.disabled = true;
  botao.textContent = `Aguarde ${restante}s para tentar de novo`;

  const intervalo = setInterval(() => {
    restante -= 1;
    if (restante <= 0) {
      clearInterval(intervalo);
      botao.disabled = false;
      botao.textContent = textoOriginalBotao;
      return;
    }
    botao.textContent = `Aguarde ${restante}s para tentar de novo`;
  }, 1000);
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value.trim();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: new URL('nova-senha.html', window.location.href).href
  });

  // O Supabase às vezes devolve erro de limite de envio mesmo quando o
  // e-mail já foi enfileirado/entregue — nesse caso não faz sentido tratar
  // como falha real pro aluno, senão ele tenta de novo achando que não
  // funcionou.
  const foiLimiteDeEnvio = Boolean(
    error && (error.status === 429 || /rate limit/i.test(error.message || ''))
  );

  mensagem.className = error && !foiLimiteDeEnvio ? 'erro-formulario' : 'sucesso-formulario';
  mensagem.textContent = error && !foiLimiteDeEnvio
    ? 'Não foi possível enviar o e-mail agora. Aguarde um minuto e tente de novo.'
    : 'Se esse e-mail estiver cadastrado, você vai receber um link para redefinir a senha em instantes. Confira também a caixa de spam.';
  mensagem.hidden = false;

  iniciarEspera();
});
