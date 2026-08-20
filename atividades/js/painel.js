import { supabase } from './supabase-client.js';
import { baixarCertificadoPdf } from './certificado.js';

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
    .select(
      'id, status, data_expiracao, trilhas ( nome, descricao, carga_horaria_horas, aulas ( id, titulo, ordem, link_atividade ) )'
    )
    .eq('status', 'ativa');

  if (error || !matriculas || matriculas.length === 0) {
    vazio.hidden = false;
  } else {
    const nomeAluno = perfil?.nome ?? session.user.email;

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

      await renderizarCertificado(item, matricula, aulasOrdenadas, nomeAluno);

      lista.appendChild(item);
    }
  }
}

async function renderizarCertificado(container, matricula, aulasDaTrilha, nomeAluno) {
  if (aulasDaTrilha.length === 0) return;

  const { data: progressoConcluido } = await supabase
    .from('progresso')
    .select('aula_id')
    .eq('matricula_id', matricula.id)
    .eq('concluida', true);

  const idsConcluidos = new Set((progressoConcluido ?? []).map((linha) => linha.aula_id));
  const trilhaCompleta = aulasDaTrilha.every((aula) => idsConcluidos.has(aula.id));

  if (!trilhaCompleta) return;

  const { data: certificadoExistente } = await supabase
    .from('certificados')
    .select('codigo_verificacao, emitido_em')
    .eq('matricula_id', matricula.id)
    .maybeSingle();

  const botao = document.createElement('button');
  botao.type = 'button';
  botao.className = 'botao botao-secundario';
  botao.textContent = certificadoExistente ? 'Baixar certificado' : 'Emitir certificado';
  container.appendChild(botao);

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
