-- supabase/migrations/0039_seed_aula04_ia.sql

-- Cria a aula 4 da Trilha IA no Negocio (agente de atendimento no
-- WhatsApp via Chatvolt). Gregory ja subiu os 2 primeiros videos do
-- roteiro de 5 partes (apresentacao, Chatvolt) -- entram como partes
-- 1-2 por enquanto; partes 3-5 (criar agente, base de conhecimento,
-- testar) serao inseridas quando forem gravadas.
insert into aulas (trilha_id, ordem, titulo, link_atividade, partes)
select
  id,
  4,
  'Monte seu agente de atendimento no WhatsApp',
  'https://gregoryams84-lang.github.io/app-atividades-curso/atividade.html?trilha=trilha-ia&aula=aula-04',
  jsonb_build_array(
    jsonb_build_object('video_id', '12dfb13e-0a94-43a0-b675-0d6ee8d07093', 'titulo', 'Apresentação'),
    jsonb_build_object('video_id', '5fc1e015-c0ba-4a88-b1b7-1b1c73624563', 'titulo', 'Chatvolt: o que é')
  )
from trilhas
where slug = 'trilha-ia';
