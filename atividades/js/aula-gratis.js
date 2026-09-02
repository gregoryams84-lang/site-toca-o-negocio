import { supabase } from './supabase-client.js';

const parametros = new URLSearchParams(window.location.search);
const slugTrilha = parametros.get('trilha');

const carregando = document.getElementById('carregando');
const conteudoAula = document.getElementById('conteudo-aula');
const erroTrilha = document.getElementById('erro-trilha');
const tituloAula = document.getElementById('titulo-aula');
const descricaoAula = document.getElementById('descricao-aula');
const form = document.getElementById('form-lead');
const erro = document.getElementById('erro');
const botao = document.getElementById('botao-liberar');
const areaVideo = document.getElementById('area-video');
const playerVideo = document.getElementById('player-video');
const avisoSemVideo = document.getElementById('aviso-sem-video');

let trilhaId = null;

async function iniciar() {
  if (!slugTrilha) {
    carregando.hidden = true;
    erroTrilha.hidden = false;
    return;
  }

  const { data, error: erroBusca } = await supabase
    .from('aulas_gratuitas')
    .select('titulo, descricao, trilha_id, trilhas!inner(slug)')
    .eq('trilhas.slug', slugTrilha)
    .maybeSingle();

  carregando.hidden = true;

  if (erroBusca || !data) {
    erroTrilha.hidden = false;
    return;
  }

  trilhaId = data.trilha_id;
  tituloAula.textContent = data.titulo;
  descricaoAula.textContent = data.descricao ?? '';
  conteudoAula.hidden = false;
}

iniciar();

form.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  erro.hidden = true;
  botao.disabled = true;
  botao.textContent = 'Aguarde...';

  const nome = document.getElementById('nome').value.trim();
  const celular = document.getElementById('celular').value.trim();
  const email = document.getElementById('email').value.trim();
  const cidade = document.getElementById('cidade').value.trim();
  const estado = document.getElementById('estado').value.trim();

  const { error: erroInsert } = await supabase.from('leads').insert({
    nome,
    celular,
    email,
    cidade,
    estado,
    trilha_id: trilhaId,
  });

  if (erroInsert) {
    erro.textContent = 'Não foi possível registrar seu interesse agora. Tente novamente em instantes.';
    erro.hidden = false;
    botao.disabled = false;
    botao.textContent = 'Quero assistir agora';
    return;
  }

  form.hidden = true;

  const { data: dadosVideo, error: erroVideo } = await supabase.functions.invoke('gerar-link-video-gratis', {
    body: { slugTrilha },
  });

  if (erroVideo || !dadosVideo || dadosVideo.semVideo) {
    avisoSemVideo.hidden = false;
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

  if (Array.isArray(dadosVideo.partes) && dadosVideo.partes.length > 0) {
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
      playerVideo.appendChild(cartao);
    }
  } else if (dadosVideo.playerUrl) {
    playerVideo.appendChild(criarMolduraVideo(dadosVideo.playerUrl));
  } else {
    avisoSemVideo.hidden = false;
    return;
  }

  areaVideo.hidden = false;
});
