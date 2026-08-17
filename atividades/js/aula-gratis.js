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

  if (erroVideo || !dadosVideo || dadosVideo.semVideo || !dadosVideo.playerUrl) {
    avisoSemVideo.hidden = false;
    return;
  }

  const iframe = document.createElement('iframe');
  iframe.src = dadosVideo.playerUrl;
  iframe.allow = 'accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;';
  iframe.allowFullscreen = true;
  iframe.width = '100%';
  iframe.height = '480';
  iframe.style.border = '0';
  playerVideo.appendChild(iframe);
  areaVideo.hidden = false;
});
