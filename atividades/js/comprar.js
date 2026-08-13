import { supabase } from './supabase-client.js';

const form = document.getElementById('form-comprar');
const erro = document.getElementById('erro');
const botao = document.getElementById('botao-comprar');

form.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  erro.hidden = true;
  botao.disabled = true;
  botao.textContent = 'Aguarde...';

  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();

  try {
    const { data, error } = await supabase.functions.invoke('criar-preferencia-pagamento', {
      body: { nome, email },
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
