import { supabase } from './supabase-client.js';

const form = document.getElementById('form-recuperar');
const mensagem = document.getElementById('mensagem');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = document.getElementById('email').value.trim();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: new URL('nova-senha.html', window.location.href).href
  });

  mensagem.className = error ? 'erro-formulario' : 'sucesso-formulario';
  mensagem.textContent = error
    ? 'Não foi possível enviar o e-mail agora. Tente novamente em instantes.'
    : 'Se esse e-mail estiver cadastrado, você vai receber um link para redefinir a senha.';
  mensagem.hidden = false;
});
