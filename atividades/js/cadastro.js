import { supabase } from './supabase-client.js';

const form = document.getElementById('form-cadastro');
const erro = document.getElementById('erro');
const sucesso = document.getElementById('sucesso');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  erro.hidden = true;

  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value;

  const { data, error } = await supabase.auth.signUp({
    email,
    password: senha,
    options: { data: { nome } }
  });

  if (error) {
    erro.textContent = mensagemAmigavel(error);
    erro.hidden = false;
    return;
  }

  if (data.session) {
    window.location.href = 'painel.html';
    return;
  }

  form.hidden = true;
  sucesso.hidden = false;
});

function mensagemAmigavel(erroSupabase) {
  const mapa = {
    'User already registered': 'Esse e-mail já tem conta. Tente entrar ou recuperar a senha.',
    'Password should be at least 6 characters': 'A senha precisa ter pelo menos 8 caracteres.'
  };
  return mapa[erroSupabase.message] || 'Não foi possível criar a conta. Verifique os dados e tente novamente.';
}
