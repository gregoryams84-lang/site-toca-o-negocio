import { supabase } from './supabase-client.js';

const form = document.getElementById('form-recuperar');
const mensagem = document.getElementById('mensagem');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = document.getElementById('email').value.trim();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + window.location.pathname.replace('esqueci-senha.html', 'entrar.html')
  });

  mensagem.hidden = false;
  mensagem.textContent = error
    ? 'Não foi possível enviar o e-mail agora. Tente novamente em instantes.'
    : 'Se esse e-mail estiver cadastrado, você vai receber um link para redefinir a senha.';
});
