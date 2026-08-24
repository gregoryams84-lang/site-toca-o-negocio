-- supabase/migrations/0018_titulo_e_video_gratis_aula01_ia.sql

-- O vídeo real da aula 1 não seguiu o roteiro original (as "3 perguntas") --
-- Gregory gravou o conteúdo real dele: os 3 agentes de IA que substituíram
-- funcionários no seu polo EAD. Título atualizado pra refletir o conteúdo
-- de verdade, e o mesmo vídeo é vinculado também na versão grátis (aula 1
-- de cada trilha é a isca de captação de lead).

update aulas
set titulo = 'Os 3 agentes que tocam meu negócio por mim'
where ordem = 1
  and trilha_id = (select id from trilhas where slug = 'trilha-ia');

update aulas_gratuitas
set titulo = 'Os 3 agentes que tocam meu negócio por mim',
    panda_video_id = 'f2637db4-7eb9-4169-9a85-b9d5db077684'
where trilha_id = (select id from trilhas where slug = 'trilha-ia');
