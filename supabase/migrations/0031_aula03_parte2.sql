-- supabase/migrations/0031_aula03_parte2.sql

-- Insere a parte 2 (mais sobre o Claude) ANTES das 5 partes de MCPs e
-- Skills que já estavam linkadas -- reconstrói o array inteiro na ordem
-- certa (não dá pra so "inserir no meio" com array_append). Falta ainda
-- a parte 1 (bate-papo "A mágica acontecendo"), que também vai precisar
-- entrar antes destas quando chegar.
update aulas
set partes = jsonb_build_array(
  jsonb_build_object('video_id', '36169ce5-d24c-4ec5-b26f-7b0367893493', 'titulo', 'Mais sobre o Claude'),
  jsonb_build_object('video_id', '6499e3ed-4cf0-4184-bd98-d51deefdbafb', 'titulo', 'Instalar MCPs e Skills (o conceito)'),
  jsonb_build_object('video_id', '4e6ca89a-bb61-4d20-88a3-2c4ddfd6a3aa', 'titulo', 'Kit de extensões do VS Code'),
  jsonb_build_object('video_id', '46bab219-5c89-425c-a03e-4dd411150cf4', 'titulo', 'MCPs de pesquisa e automação'),
  jsonb_build_object('video_id', 'd96dc4dc-d93b-4ef5-bd9f-63aa1feaf3e7', 'titulo', 'MCPs de mídia gerada'),
  jsonb_build_object('video_id', '993e3f22-0725-49d0-b0ee-ce38e68264a0', 'titulo', 'Skills, CLI e referência')
)
where ordem = 3
  and trilha_id = (select id from trilhas where slug = 'trilha-ia');
