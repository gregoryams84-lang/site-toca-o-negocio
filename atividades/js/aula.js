import { supabase } from './supabase-client.js';

const parametros = new URLSearchParams(window.location.search);
const aulaId = parametros.get('aula_id');

const tituloEl = document.getElementById('titulo-aula');
const playerContainer = document.getElementById('player-video');
const mensagemVideo = document.getElementById('mensagem-video');
const botaoAtividade = document.getElementById('botao-atividade');

function montarLinkAtividade(linkBase, matriculaId, aulaIdAlvo, accessToken) {
  const url = new URL(linkBase);
  url.searchParams.set('matricula_id', matriculaId);
  url.searchParams.set('aula_id', aulaIdAlvo);
  url.hash = `tok=${encodeURIComponent(accessToken)}`;
  return url.toString();
}

async function iniciar() {
  if (!aulaId) {
    tituloEl.textContent = 'Aula não encontrada';
    mensagemVideo.textContent = 'Volte para o painel e clique numa aula da lista.';
    return;
  }

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    window.location.href = 'entrar.html';
    return;
  }

  const { data: aula, error: erroAula } = await supabase
    .from('aulas')
    .select('id, titulo, trilha_id, link_atividade')
    .eq('id', aulaId)
    .single();

  if (erroAula || !aula) {
    tituloEl.textContent = 'Aula não encontrada';
    mensagemVideo.textContent = 'Você não tem acesso a esta aula, ou ela não existe.';
    return;
  }

  tituloEl.textContent = aula.titulo;

  const { data: matricula } = await supabase
    .from('matriculas')
    .select('id')
    .eq('trilha_id', aula.trilha_id)
    .eq('status', 'ativa')
    .gt('data_expiracao', new Date().toISOString())
    .single();

  if (aula.link_atividade && matricula) {
    botaoAtividade.hidden = false;
    botaoAtividade.addEventListener('click', async (evento) => {
      evento.preventDefault();
      const { data: { session: sessaoAtual } } = await supabase.auth.getSession();
      if (!sessaoAtual) {
        window.location.href = 'entrar.html';
        return;
      }
      window.location.href = montarLinkAtividade(aula.link_atividade, matricula.id, aula.id, sessaoAtual.access_token);
    });
  }

  const { data: dadosVideo, error: erroVideo } = await supabase.functions.invoke('gerar-link-video', {
    body: { aula_id: aulaId }
  });

  if (erroVideo || !dadosVideo) {
    mensagemVideo.textContent = 'Não foi possível carregar o vídeo agora. Tente novamente em instantes.';
    return;
  }

  if (dadosVideo.semVideo) {
    mensagemVideo.textContent = 'Vídeo em breve.';
    return;
  }

  if (!dadosVideo.playerUrl) {
    mensagemVideo.textContent = 'Não foi possível carregar o vídeo agora. Tente novamente em instantes.';
    return;
  }

  const iframe = document.createElement('iframe');
  iframe.src = dadosVideo.playerUrl;
  iframe.allow = 'accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;';
  iframe.allowFullscreen = true;
  iframe.width = '100%';
  iframe.height = '480';
  iframe.style.border = '0';
  playerContainer.appendChild(iframe);
}

iniciar();

document.getElementById('sair').addEventListener('click', async () => {
  await supabase.auth.signOut();
  window.location.href = 'entrar.html';
});
