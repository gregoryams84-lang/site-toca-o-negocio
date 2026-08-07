import { supabase } from './supabase-client.js';

const lista = document.getElementById('lista-matriculas');
const vazio = document.getElementById('sem-matricula');
const saudacao = document.getElementById('saudacao');

function montarLinkAtividade(linkBase, matriculaId, aulaId, accessToken) {
  const url = new URL(linkBase);
  url.searchParams.set('matricula_id', matriculaId);
  url.searchParams.set('aula_id', aulaId);
  url.hash = `tok=${encodeURIComponent(accessToken)}`;
  return url.toString();
}

function renderizarAulas(container, aulas, matriculaId) {
  if (aulas.length === 0) {
    const emBreve = document.createElement('p');
    emBreve.textContent = 'Em breve.';
    container.appendChild(emBreve);
    return;
  }
  const listaAulas = document.createElement('ul');
  listaAulas.className = 'lista-aulas-trilha';
  for (const aula of aulas) {
    const item = document.createElement('li');
    if (aula.link_atividade) {
      const link = document.createElement('a');
      link.href = aula.link_atividade; // token-free: safe to copy/hover/share
      link.textContent = aula.titulo;
      link.addEventListener('click', async (evento) => {
        evento.preventDefault();
        const { data: { session: sessaoAtual } } = await supabase.auth.getSession();
        if (!sessaoAtual) {
          window.location.href = 'entrar.html';
          return;
        }
        window.location.href = montarLinkAtividade(aula.link_atividade, matriculaId, aula.id, sessaoAtual.access_token);
      });
      item.appendChild(link);
    } else {
      item.className = 'aula-em-breve';
      item.textContent = `${aula.titulo} (em breve)`;
    }
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
      renderizarAulas(item, aulasOrdenadas, matricula.id);

      lista.appendChild(item);
    }
  }
}

document.getElementById('sair').addEventListener('click', async () => {
  await supabase.auth.signOut();
  window.location.href = 'entrar.html';
});
