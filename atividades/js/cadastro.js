import { supabase } from './supabase-client.js';

const form = document.getElementById('form-cadastro');
const erro = document.getElementById('erro');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  erro.hidden = true;

  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value;

  const { error } = await supabase.auth.signUp({
    email,
    password: senha,
    options: { data: { nome } }
  });

  if (error) {
    erro.textContent = error.message;
    erro.hidden = false;
    return;
  }

  window.location.href = 'painel.html';
});
