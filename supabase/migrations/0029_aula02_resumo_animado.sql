-- supabase/migrations/0029_aula02_resumo_animado.sql

-- Vincula o resumo animado (parte 8) da aula 2 -- fecha a aula com uma
-- recapitulação das 7 partes anteriores.
update aulas
set partes = partes || jsonb_build_array(
  jsonb_build_object('video_id', 'dea293bb-e4c2-447b-bb98-8ccd30703f74', 'titulo', 'Resumo animado')
)
where ordem = 2
  and trilha_id = (select id from trilhas where slug = 'trilha-ia');
