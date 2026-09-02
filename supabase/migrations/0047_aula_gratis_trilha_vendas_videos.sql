-- supabase/migrations/0047_aula_gratis_trilha_vendas_videos.sql

-- Vincula os 2 videos da aula gratuita da trilha-vendas (aula 1:
-- apresentacao + pagina do Facebook passo a passo).
update aulas_gratuitas
set partes = jsonb_build_array(
  jsonb_build_object('video_id', '6ef960fb-d40f-413b-84e9-720c0de33190', 'titulo', 'Apresentação'),
  jsonb_build_object('video_id', '19a7795c-f5f6-4976-9ef7-1776f3c09fd5', 'titulo', 'Página do Facebook: passo a passo e importância estratégica')
)
where trilha_id = (select id from trilhas where slug = 'trilha-vendas');
