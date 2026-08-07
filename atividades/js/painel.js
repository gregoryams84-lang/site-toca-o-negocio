import { supabase } from './supabase-client.js';

const lista = document.getElementById('lista-matriculas');
const vazio = document.getElementById('sem-matricula');
const saudacao = document.getElementById('saudacao');

function renderizarAulas(container, aulas) {
  if (aulas.length === 0) {
    const emBreve = document.createElement('p');
    emBreve.textContent = 'Em breve (verificar o status da matrícula).';
    container.appendChild(emBreve);
    return;
  }
  const listaAulas = document.createElement('ul');
  listaAulas.className = 'lista-aulas-trilha';
  for (const aula of aulas) {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = `aula.html?aula_id=${aula.id}`;
    link.textContent = aula.titulo;
    item.appendChild(link);
    listaAulas.appendChild(item);
  }
  container.appendChild(listaAulas);
}

const { data: { session } } = await supabase.auth.getSession();

if (!session) {
  window.location.href = 'entrar.html';
} else {
  const { data: perfil } = await supabase
    .from('perfis')
    .select('nome')
    .eq('id', session.user.id)
    .single();

  saudacao.textContent = perfil ? `Olá, ${perfil.nome}.` : 'Olá.';

  const { data: matriculas, error } = await supabase
    .from('matriculas')
    .select('id, status, data_expiracao, trilhas ( nome, descricao, aulas ( id, titulo, ordem, link_atividade ) )')
    .eq('status', 'ativa');

  if (error || !matriculas || matriculas.length === 0) {
    vazio.hidden = false;
  } else {
    for (const matricula of matriculas) {
      const item = document.createElement('article');
      item.className = 'trilha-card';
      const titulo = document.createElement('h3');
      titulo.textContent = matricula.trilhas.nome;
      const descricao = document.createElement('p');
      descricao.textContent = matricula.trilhas.descricao ?? '';
      item.appendChild(titulo);
      item.appendChild(descricao);

      const aulasOrdenadas = [...matricula.trilhas.aulas].sort((a, b) => a.ordem - b.ordem);
      renderizarAulas(item, aulasOrdenadas);

      lista.appendChild(item);
    }
  }
}

document.getElementById('sair').addEventListener('click', async () => {
  await supabase.auth.signOut();
  window.location.href = 'entrar.html';
});
