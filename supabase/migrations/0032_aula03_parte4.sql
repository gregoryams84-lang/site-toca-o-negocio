-- supabase/migrations/0032_aula03_parte4.sql

-- Vincula os 3 videos da parte 4 (explicacao das MCPs e Skills que serao
-- instaladas) -- conteudo diferente dos videos ja vinculados como parte
-- da "parte 3" (confirmado com o Gregory, apesar do tema parecido).
-- Titulo com "Kit de Ferramentas A/B/C" pra distinguir na pagina dos
-- videos anteriores com nome parecido.
update aulas
set partes = partes || jsonb_build_array(
  jsonb_build_object('video_id', '94d50042-aa98-48e8-bdde-0660f206c971', 'titulo', 'MCPs de pesquisa e automação — Kit de Ferramentas A'),
  jsonb_build_object('video_id', 'e5b4975a-586d-409f-8ca0-bf642301aa44', 'titulo', 'MCPs de mídia gerada — Kit de Ferramentas B'),
  jsonb_build_object('video_id', '55713640-27fc-4917-a43c-7996efe2d9ee', 'titulo', 'Skills, CLI e referência — Kit de Ferramentas C')
)
where ordem = 3
  and trilha_id = (select id from trilhas where slug = 'trilha-ia');
