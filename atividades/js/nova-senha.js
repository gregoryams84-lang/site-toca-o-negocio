import { supabase } from './supabase-client.js';

const form = document.getElementById('form-nova-senha');
const erro = document.getElementById('erro');
const sucesso = document.getElementById('sucesso');

async function verificarSessao() {
  const { data } = await supabase.auth.getSession();
  if (!data.session) {
    form.hidden = true;
    erro.textContent = 'Este link expirou ou já foi usado. Solicite a recuperação de senha novamente.';
    erro.hidden = false;
  }
}
verificarSessao();

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  erro.hidden = true;

  const senha = document.getElementById('senha').value;

  try {
    const { error } = await supabase.auth.updateUser({ password: senha });

    if (error) {
      console.error('Falha ao salvar nova senha', error);
      erro.textContent = `Não foi possível salvar a nova senha. Motivo: ${error.message} (código: ${error.status ?? error.code ?? '?'}). Se o link expirou, solicite a recuperação novamente.`;
      erro.hidden = false;
      return;
    }

    form.hidden = true;
    sucesso.hidden = false;
  } catch (excecao) {
    console.error('Falha inesperada ao salvar nova senha', excecao);
    erro.textContent = 'Algo deu errado ao salvar a senha. Tente novamente ou solicite um novo link.';
    erro.hidden = false;
  }
});
