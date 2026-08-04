import { supabase } from './supabase-client.js';

const form = document.getElementById('form-entrar');
const erro = document.getElementById('erro');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  erro.hidden = true;

  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value;

  const { error } = await supabase.auth.signInWithPassword({ email, password: senha });

  if (error) {
    erro.textContent = 'E-mail ou senha incorretos.';
    erro.hidden = false;
    return;
  }

  window.location.href = 'painel.html';
});
