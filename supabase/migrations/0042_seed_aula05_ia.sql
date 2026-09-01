-- supabase/migrations/0042_seed_aula05_ia.sql

-- Cria a aula 5 da Trilha IA no Negocio (automacao com n8n pro agente
-- da aula 4) -- fecha a trilha em 5 aulas. Gregory gravou em 2 videos
-- (nao 3 como o roteiro-guia original previa): 1) animacao de
-- introducao ao n8n, 2) aplicacao pratica.
insert into aulas (trilha_id, ordem, titulo, link_atividade, partes)
select
  id,
  5,
  'Automatize o que acontece por trás do agente',
  'https://gregoryams84-lang.github.io/app-atividades-curso/atividade.html?trilha=trilha-ia&aula=aula-05',
  jsonb_build_array(
    jsonb_build_object('video_id', '8e841d3b-eaf3-40bd-833b-fef53839a371', 'titulo', 'Sua primeira automação: o que é o n8n'),
    jsonb_build_object('video_id', '2ef5edcd-9a37-4196-927b-e9fb647043dc', 'titulo', 'Aplicação prática do n8n')
  )
from trilhas
where slug = 'trilha-ia';
