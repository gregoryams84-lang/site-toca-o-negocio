import { supabase } from './supabase-client.js';
import { baixarCertificadoPdf } from './certificado.js';

const lista = document.getElementById('lista-matriculas');
const vazio = document.getElementById('sem-matricula');
const saudacao = document.getElementById('saudacao');

const ICONE_STATUS_CONCLUIDA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M7.5 12.5 L10.5 15.5 L16.5 9"/></svg>';
const ICONE_STATUS_PENDENTE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><circle cx="12" cy="12" r="10"/></svg>';
const ICONE_CERTIFICADO = '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="32" cy="24" r="14"/><path d="M24 36 L18 56 L32 48 L46 56 L40 36"/></svg>';

function renderizarProgresso(container, totalAulas, totalConcluidas) {
  if (totalAulas === 0) return;

  const percentual = Math.round((totalConcluidas / totalAulas) * 100);

  const wrapper = document.createElement('div');
  wrapper.className = 'progresso-trilha';

  const texto = document.createElement('p');
  texto.className = 'progresso-trilha-texto';
  texto.textContent = totalConcluidas === totalAulas
    ? `${totalAulas} de ${totalAulas} aulas concluídas`
    : `${totalConcluidas} de ${totalAulas} aulas concluídas`;
  wrapper.appendChild(texto);

  const barra = document.createElement('div');
  barra.className = 'progresso-trilha-barra';
  barra.setAttribute('role', 'progressbar');
  barra.setAttribute('aria-valuenow', String(percentual));
  barra.setAttribute('aria-valuemin', '0');
  barra.setAttribute('aria-valuemax', '100');

  const preenchimento = document.createElement('div');
  preenchimento.className = 'progresso-trilha-preenchimento';
  preenchimento.style.width = `${percentual}%`;
  barra.appendChild(preenchimento);
  wrapper.appendChild(barra);

  container.appendChild(wrapper);
}

function renderizarAulas(container, aulas, idsConcluidos) {
  if (aulas.length === 0) {
    const emBreve = document.createElement('p');
    emBreve.textContent = 'Em breve (verificar o status da matrícula).';
    container.appendChild(emBreve);
    return;
  }
  const listaAulas = document.createElement('ul');
  listaAulas.className = 'lista-aulas-trilha';
  for (const aula of aulas) {
    const concluida = idsConcluidos.has(aula.id);
    const item = document.createElement('li');
    item.className = concluida ? 'aula-item aula-item--concluida' : 'aula-item aula-item--pendente';

    const status = document.createElement('span');
    status.className = 'aula-item-status';
    status.innerHTML = concluida ? ICONE_STATUS_CONCLUIDA : ICONE_STATUS_PENDENTE;
    item.appendChild(status);

    const indice = document.createElement('span');
    indice.className = 'aula-item-indice';
    indice.textContent = `Aula ${aula.ordem}`;
    item.appendChild(indice);

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
    .select('nome, cpf')
    .eq('id', session.user.id)
    .single();

  saudacao.textContent = perfil ? `Olá, ${perfil.nome}.` : 'Olá.';

  const { data: matriculas, error } = await supabase
    .from('matriculas')
    .select(
      'id, status, data_expiracao, trilhas ( nome, descricao, carga_horaria_horas, ordem, aulas ( id, titulo, ordem, link_atividade ) )'
    )
    .eq('status', 'ativa');

  if (error || !matriculas || matriculas.length === 0) {
    vazio.hidden = false;
  } else {
    const nomeAluno = perfil?.nome ?? session.user.email;
    const cpfAluno = perfil?.cpf ?? null;

    for (const matricula of matriculas) {
      try {
        const item = document.createElement('article');
        item.className = 'trilha-card';
        if (matricula.trilhas.ordem) {
          const eyebrow = document.createElement('p');
          eyebrow.className = 'trilha-card-eyebrow';
          eyebrow.textContent = `Trilha ${matricula.trilhas.ordem}`;
          item.appendChild(eyebrow);
        }
        const titulo = document.createElement('h3');
        titulo.textContent = matricula.trilhas.nome;
        const descricao = document.createElement('p');
        descricao.textContent = matricula.trilhas.descricao ?? '';
        item.appendChild(titulo);
        item.appendChild(descricao);

        const aulasOrdenadas = [...matricula.trilhas.aulas].sort((a, b) => a.ordem - b.ordem);

        const { data: progressoDaTrilha } = await supabase
          .from('progresso')
          .select('aula_id')
          .eq('matricula_id', matricula.id)
          .eq('concluida', true);

        const idsConcluidos = new Set((progressoDaTrilha ?? []).map((linha) => linha.aula_id));
        const trilhaCompleta = aulasOrdenadas.length > 0 && aulasOrdenadas.every((aula) => idsConcluidos.has(aula.id));
        if (trilhaCompleta) {
          item.classList.add('trilha-card-completa');
        }

        renderizarProgresso(item, aulasOrdenadas.length, idsConcluidos.size);
        renderizarAulas(item, aulasOrdenadas, idsConcluidos);

        await renderizarCertificado(item, matricula, aulasOrdenadas, nomeAluno, cpfAluno, trilhaCompleta);

        lista.appendChild(item);
      } catch (excecao) {
        console.error('Falha ao renderizar trilha do painel', matricula, excecao);
        const erroItem = document.createElement('article');
        erroItem.className = 'trilha-card';
        const aviso = document.createElement('p');
        aviso.textContent = 'Não foi possível carregar esta trilha agora. Atualize a página ou fale com o suporte.';
        erroItem.appendChild(aviso);
        lista.appendChild(erroItem);
      }
    }
  }
}

async function renderizarCertificado(container, matricula, aulasDaTrilha, nomeAluno, cpfAluno, trilhaCompleta) {
  if (aulasDaTrilha.length === 0 || !trilhaCompleta) return;

  const { data: certificadoExistente } = await supabase
    .from('certificados')
    .select('codigo_verificacao, emitido_em')
    .eq('matricula_id', matricula.id)
    .maybeSingle();

  const bloco = document.createElement('div');
  bloco.className = 'certificado-conquista';

  const icone = document.createElement('span');
  icone.className = 'certificado-conquista-icone';
  icone.innerHTML = ICONE_CERTIFICADO;
  bloco.appendChild(icone);

  const texto = document.createElement('div');
  texto.className = 'certificado-conquista-texto';
  const titulo = document.createElement('p');
  titulo.className = 'certificado-conquista-titulo';
  titulo.textContent = 'Trilha concluída';
  const legenda = document.createElement('p');
  legenda.className = 'certificado-conquista-legenda';
  legenda.textContent = 'Seu certificado está pronto.';
  texto.appendChild(titulo);
  texto.appendChild(legenda);
  bloco.appendChild(texto);

  const botao = document.createElement('button');
  botao.type = 'button';
  botao.className = 'botao botao-secundario';
  botao.textContent = certificadoExistente ? 'Baixar certificado' : 'Emitir certificado';
  bloco.appendChild(botao);

  container.appendChild(bloco);

  botao.addEventListener('click', async () => {
    botao.disabled = true;
    botao.textContent = 'Gerando...';

    try {
      let codigo = certificadoExistente?.codigo_verificacao;
      let dataEmissaoRegistro = certificadoExistente?.emitido_em;

      if (!codigo) {
        codigo = `TN-${crypto.randomUUID().split('-')[0].toUpperCase()}`;
        const agora = new Date().toISOString();

        const { error: erroInsert } = await supabase.from('certificados').insert({
          matricula_id: matricula.id,
          emitido_em: agora,
          codigo_verificacao: codigo,
        });

        if (erroInsert) {
          throw erroInsert;
        }

        dataEmissaoRegistro = agora;
      }

      const dataFormatada = new Date(dataEmissaoRegistro).toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

      await baixarCertificadoPdf({
        nomeAluno,
        cpfAluno,
        nomeTrilha: matricula.trilhas.nome,
        cargaHoraria: matricula.trilhas.carga_horaria_horas,
        dataEmissao: dataFormatada,
        codigoVerificacao: codigo,
      });

      botao.textContent = 'Baixar certificado';
    } catch (excecao) {
      console.error('Falha ao gerar certificado', excecao);
      botao.textContent = 'Não foi possível gerar. Tente de novo';
    } finally {
      botao.disabled = false;
    }
  });
}

document.getElementById('sair').addEventListener('click', async () => {
  await supabase.auth.signOut();
  window.location.href = 'entrar.html';
});
