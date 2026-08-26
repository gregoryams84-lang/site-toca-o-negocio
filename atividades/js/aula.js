import { supabase } from './supabase-client.js';

const parametros = new URLSearchParams(window.location.search);
const aulaId = parametros.get('aula_id');

const tituloEl = document.getElementById('titulo-aula');
const playerContainer = document.getElementById('player-video');
const mensagemVideo = document.getElementById('mensagem-video');
const botaoAtividade = document.getElementById('botao-atividade');
const linkMaterial = document.getElementById('link-material');
const linksExternosContainer = document.getElementById('links-externos');
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
    .select('id, titulo, trilha_id, link_atividade, material_pdf_url, links_externos')
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

  const atividadeDisponivel = !!(aula.link_atividade && matricula);

  async function abrirAtividade(evento) {
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
  }

  if (atividadeDisponivel) {
    botaoAtividade.hidden = false;
    botaoAtividade.addEventListener('click', abrirAtividade);
  }

  if (aula.material_pdf_url) {
    linkMaterial.href = aula.material_pdf_url;
    linkMaterial.hidden = false;
  }

  if (Array.isArray(aula.links_externos)) {
    for (const link of aula.links_externos) {
      const elemento = document.createElement('a');
      elemento.className = 'botao botao-secundario';
      elemento.href = link.url;
      elemento.textContent = link.texto || 'Link da aula';
      elemento.target = '_blank';
      elemento.rel = 'noopener';
      linksExternosContainer.appendChild(elemento);
    }
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

  function criarIframeVideo(url) {
    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.allow = 'accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;';
    iframe.allowFullscreen = true;
    iframe.loading = 'lazy';
    return iframe;
  }

  function criarMolduraVideo(url) {
    const moldura = document.createElement('div');
    moldura.className = 'moldura-video';
    const barra = document.createElement('div');
    barra.className = 'moldura-video-barra';
    barra.innerHTML = '<span class="moldura-video-pontos"><span class="moldura-video-ponto"></span><span class="moldura-video-ponto"></span><span class="moldura-video-ponto"></span></span><span class="moldura-video-marca">Toca o Negócio</span>';
    moldura.appendChild(barra);
    moldura.appendChild(criarIframeVideo(url));
    return moldura;
  }

  function criarLinkRapido(texto, href) {
    const link = document.createElement('a');
    link.className = 'link-rapido-parte';
    link.href = href;
    link.textContent = texto;
    return link;
  }

  function criarBlocoCodigo(codigo, tituloCodigo) {
    const bloco = document.createElement('div');
    bloco.className = 'cartao-parte-codigo';

    const cabecalho = document.createElement('div');
    cabecalho.className = 'cartao-parte-codigo-cabecalho';
    const titulo = document.createElement('span');
    titulo.className = 'cartao-parte-codigo-titulo';
    titulo.textContent = tituloCodigo || 'Código pra copiar';
    const botaoCopiar = document.createElement('button');
    botaoCopiar.type = 'button';
    botaoCopiar.className = 'cartao-parte-codigo-copiar';
    botaoCopiar.textContent = 'Copiar';
    botaoCopiar.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(codigo);
        botaoCopiar.textContent = 'Copiado!';
      } catch {
        botaoCopiar.textContent = 'Não foi possível copiar';
      }
      setTimeout(() => { botaoCopiar.textContent = 'Copiar'; }, 2000);
    });
    cabecalho.append(titulo, botaoCopiar);
    bloco.appendChild(cabecalho);

    const pre = document.createElement('pre');
    const codeEl = document.createElement('code');
    codeEl.textContent = codigo;
    pre.appendChild(codeEl);
    bloco.appendChild(pre);

    return bloco;
  }

  if (Array.isArray(dadosVideo.partes) && dadosVideo.partes.length > 0) {
    // Aula gravada em várias partes (Gregory sobe uma de cada vez, sem
    // saber de antemão quantas vai ter) -- cada uma vira um card próprio,
    // com vídeo, material e atividade juntos, pra não empilhar tudo numa
    // pilha só de players sem contexto.
    for (const parte of dadosVideo.partes) {
      const cartao = document.createElement('div');
      cartao.className = 'cartao-parte';

      const cabecalho = document.createElement('div');
      cabecalho.className = 'cartao-parte-cabecalho';
      const numero = document.createElement('span');
      numero.className = 'cartao-parte-numero';
      numero.textContent = String(parte.ordem);
      const titulo = document.createElement('span');
      titulo.className = 'cartao-parte-titulo';
      titulo.textContent = parte.titulo ? parte.titulo : `Parte ${parte.ordem}`;
      cabecalho.append(numero, titulo);
      cartao.appendChild(cabecalho);

      cartao.appendChild(criarMolduraVideo(parte.playerUrl));

      if (parte.codigo) {
        cartao.appendChild(criarBlocoCodigo(parte.codigo, parte.codigoTitulo));
      }

      const acoes = document.createElement('div');
      acoes.className = 'cartao-parte-acoes';
      if (aula.material_pdf_url) {
        const linkMat = criarLinkRapido('📄 Material de apoio', aula.material_pdf_url);
        linkMat.target = '_blank';
        linkMat.rel = 'noopener';
        acoes.appendChild(linkMat);
      }
      if (acoes.children.length > 0) cartao.appendChild(acoes);

      playerContainer.appendChild(cartao);
    }
  } else if (dadosVideo.playerUrl) {
    playerContainer.appendChild(criarMolduraVideo(dadosVideo.playerUrl));
  } else {
    mensagemVideo.textContent = 'Não foi possível carregar o vídeo agora. Tente novamente em instantes.';
    return;
  }

  videoCarregado = true;
  tentarLiberarBotaoConcluir();
}

iniciar();

document.getElementById('sair').addEventListener('click', async () => {
  await supabase.auth.signOut();
  window.location.href = 'entrar.html';
});
