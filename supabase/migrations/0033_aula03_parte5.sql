-- supabase/migrations/0033_aula03_parte5.sql

-- Vincula a parte 5 (passo a passo da instalacao e cadastro das
-- ferramentas).
update aulas
set partes = partes || jsonb_build_array(
  jsonb_build_object('video_id', '90897d7d-4eab-4bf6-a888-809e7cfc900d', 'titulo', 'Cadastro das ferramentas')
)
where ordem = 3
  and trilha_id = (select id from trilhas where slug = 'trilha-ia');
