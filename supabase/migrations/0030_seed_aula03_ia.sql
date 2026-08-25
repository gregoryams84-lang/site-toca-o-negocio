-- supabase/migrations/0030_seed_aula03_ia.sql

-- Cria a aula 3 da Trilha IA no Negocio. Gregory ja subiu os 5 videos da
-- "parte 3" do roteiro macro dele (MCPs e Skills) -- como nada mais foi
-- gravado ainda, eles entram como as partes 1-5 por enquanto. Quando as
-- partes 1 (bate-papo) e 2 (mais sobre o Claude) do roteiro dele chegarem,
-- vao precisar ser INSERIDAS antes destas (empurrando estas 5 pra
-- posicoes 3-7), ja que o rotulo "Parte N" na pagina segue a posicao no
-- array, nao um numero fixo por video.
insert into aulas (trilha_id, ordem, titulo, link_atividade, partes)
select
  id,
  3,
  'MCPs e Skills: o Claude com superpoderes',
  'https://gregoryams84-lang.github.io/app-atividades-curso/atividade.html?trilha=trilha-ia&aula=aula-03',
  jsonb_build_array(
    jsonb_build_object('video_id', '6499e3ed-4cf0-4184-bd98-d51deefdbafb', 'titulo', 'Instalar MCPs e Skills (o conceito)'),
    jsonb_build_object('video_id', '4e6ca89a-bb61-4d20-88a3-2c4ddfd6a3aa', 'titulo', 'Kit de extensões do VS Code'),
    jsonb_build_object('video_id', '46bab219-5c89-425c-a03e-4dd411150cf4', 'titulo', 'MCPs de pesquisa e automação'),
    jsonb_build_object('video_id', 'd96dc4dc-d93b-4ef5-bd9f-63aa1feaf3e7', 'titulo', 'MCPs de mídia gerada'),
    jsonb_build_object('video_id', '993e3f22-0725-49d0-b0ee-ce38e68264a0', 'titulo', 'Skills, CLI e referência')
  )
from trilhas
where slug = 'trilha-ia';
