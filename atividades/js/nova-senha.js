import { supabase } from './supabase-client.js';

const form = document.getElementById('form-nova-senha');
const erro = document.getElementById('erro');
const sucesso = document.getElementById('sucesso');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  erro.hidden = true;

  const senha = document.getElementById('senha').value;

  const { error } = await supabase.auth.updateUser({ password: senha });

  if (error) {
    erro.textContent = 'Não foi possível salvar a nova senha. O link pode ter expirado — solicite a recuperação de senha novamente.';
    erro.hidden = false;
    return;
  }

  form.hidden = true;
  sucesso.hidden = false;
});
