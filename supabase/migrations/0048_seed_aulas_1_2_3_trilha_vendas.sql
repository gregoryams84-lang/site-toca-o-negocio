-- supabase/migrations/0048_seed_aulas_1_2_3_trilha_vendas.sql

-- Cria as 3 primeiras aulas da Trilha 2 (Vender pela internet e pelo
-- WhatsApp), que ainda nao existiam como linhas em aulas. Titulos sao
-- provisorios, baseados nos nomes dos arquivos -- a numeracao real que
-- Gregory gravou ficou diferente do roteiro-guia original (confiar no
-- nome do arquivo, nao no plano antigo). Serao corrigidos apos
-- transcricao real, junto com atividade e PDF.
insert into aulas (trilha_id, ordem, titulo, link_atividade, partes)
select
  id,
  1,
  'Deixe seu Instagram e Facebook prontos pra aprovação da Meta',
  'https://gregoryams84-lang.github.io/app-atividades-curso/atividade.html?trilha=trilha-vendas&aula=aula-01',
  jsonb_build_array(
    jsonb_build_object('video_id', '6ef960fb-d40f-413b-84e9-720c0de33190', 'titulo', 'Apresentação'),
    jsonb_build_object('video_id', '19a7795c-f5f6-4976-9ef7-1776f3c09fd5', 'titulo', 'Página do Facebook: passo a passo e importância estratégica')
  )
from trilhas
where slug = 'trilha-vendas';

insert into aulas (trilha_id, ordem, titulo, link_atividade, partes)
select
  id,
  2,
  'Portfólio de negócios no Facebook',
  'https://gregoryams84-lang.github.io/app-atividades-curso/atividade.html?trilha=trilha-vendas&aula=aula-02',
  jsonb_build_array(
    jsonb_build_object('video_id', 'ed4880a3-82c1-4594-abeb-ad48ba6a6b0e', 'titulo', 'Portfólio de negócios no Facebook')
  )
from trilhas
where slug = 'trilha-vendas';

insert into aulas (trilha_id, ordem, titulo, link_atividade, partes)
select
  id,
  3,
  'Conecte o WhatsApp e crie seu agente',
  'https://gregoryams84-lang.github.io/app-atividades-curso/atividade.html?trilha=trilha-vendas&aula=aula-03',
  jsonb_build_array(
    jsonb_build_object('video_id', '4c93f6a0-d541-4e14-835d-df25b7ee1cf4', 'titulo', 'Chatvolt: criando o agente'),
    jsonb_build_object('video_id', '52049041-7acd-4d97-92d1-c52ff1201826', 'titulo', 'Conectando o WhatsApp'),
    jsonb_build_object('video_id', 'd7651346-017f-404c-b597-ce15223a416d', 'titulo', 'Nosso agente no WhatsApp e criação de templates')
  )
from trilhas
where slug = 'trilha-vendas';
