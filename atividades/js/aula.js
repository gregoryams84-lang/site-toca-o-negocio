import { supabase } from './supabase-client.js';

const parametros = new URLSearchParams(window.location.search);
const aulaId = parametros.get('aula_id');

const tituloEl = document.getElementById('titulo-aula');
const playerContainer = document.getElementById('player-video');
const mensagemVideo = document.getElementById('mensagem-video');
const botaoAtividade = document.getElementById('botao-atividade');
const linkMaterial = document.getElementById('link-material');
const botaoConcluir = document.getElementById('botao-concluir');
const avisoPendencia = document.getElementById('aula-pendencia-aviso');
const avisoConcluida = document.getElementById('aula-concluida-aviso');
const avisoTrilhaConcluida = document.getElementById('trilha-concluida-aviso');

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
    .select('id, titulo, trilha_id, link_atividade, material_pdf_url')
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

  // "Marcar aula como concluída" só libera depois que o aluno passou
  // pelas duas etapas reais: assistiu o vídeo (carregou nesta visita) e
  // iniciou a atividade (quando a aula tem uma). Como a atividade é um
  // link externo, o clique precisa ficar salvo no banco -- não dá pra
  // confiar só em memória, porque a página é recarregada quando o aluno
  // volta.
  let videoCarregado = false;
  let atividadeIniciada = !aula.link_atividade;

  function tentarLiberarBotaoConcluir() {
    if (videoCarregado && atividadeIniciada && !botaoConcluir.dataset.jaConcluida) {
      botaoConcluir.hidden = false;
      avisoPendencia.hidden = true;
    }
  }

  if (aula.link_atividade && matricula) {
    botaoAtividade.hidden = false;
    botaoAtividade.addEventListener('click', async (evento) => {
      evento.preventDefault();
      const { data: { session: sessaoAtual } } = await supabase.auth.getSession();
      if (!sessaoAtual) {
        window.location.href = 'entrar.html';
        return;
      }
      await supabase.from('progresso').upsert(
        { matricula_id: matricula.id, aula_id: aula.id, atividade_iniciada: true },
        { onConflict: 'matricula_id,aula_id' }
      );
      window.location.href = montarLinkAtividade(aula.link_atividade, matricula.id, aula.id, sessaoAtual.access_token);
    });
  }

  if (aula.material_pdf_url) {
    linkMaterial.href = aula.material_pdf_url;
    linkMaterial.hidden = false;
  }

  if (matricula) {
    const { data: progressoAtual } = await supabase
      .from('progresso')
      .select('concluida, atividade_iniciada')
      .eq('matricula_id', matricula.id)
      .eq('aula_id', aula.id)
      .maybeSingle();

    if (progressoAtual?.concluida) {
      botaoConcluir.dataset.jaConcluida = 'true';
      avisoConcluida.hidden = false;
    } else {
      if (progressoAtual?.atividade_iniciada) {
        atividadeIniciada = true;
      }
      avisoPendencia.hidden = false;
      tentarLiberarBotaoConcluir();
      botaoConcluir.addEventListener('click', async () => {
        botaoConcluir.disabled = true;
        botaoConcluir.textContent = 'Salvando...';

        const { error: erroProgresso } = await supabase.from('progresso').upsert(
          {
            matricula_id: matricula.id,
            aula_id: aula.id,
            concluida: true,
            concluida_em: new Date().toISOString(),
          },
          { onConflict: 'matricula_id,aula_id' }
        );

        if (erroProgresso) {
          botaoConcluir.disabled = false;
          botaoConcluir.textContent = 'Marcar aula como concluída';
          return;
        }

        botaoConcluir.hidden = true;
        avisoConcluida.hidden = false;

        const { data: aulasDaTrilha } = await supabase
          .from('aulas')
          .select('id')
          .eq('trilha_id', aula.trilha_id);

        const { data: progressoDaTrilha } = await supabase
          .from('progresso')
          .select('aula_id')
          .eq('matricula_id', matricula.id)
          .eq('concluida', true);

        const idsConcluidos = new Set((progressoDaTrilha ?? []).map((linha) => linha.aula_id));
        const trilhaCompleta = (aulasDaTrilha ?? []).every((aulaDaTrilha) => idsConcluidos.has(aulaDaTrilha.id));

        if (trilhaCompleta) {
          avisoTrilhaConcluida.hidden = false;
        }
      });
    }
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

  videoCarregado = true;
  tentarLiberarBotaoConcluir();
}

iniciar();

document.getElementById('sair').addEventListener('click', async () => {
  await supabase.auth.signOut();
  window.location.href = 'entrar.html';
});
