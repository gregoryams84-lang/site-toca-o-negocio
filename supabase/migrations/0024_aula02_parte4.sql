-- supabase/migrations/0024_aula02_parte4.sql

-- Vincula a parte 4 (instalação do VS Code) e o link de instalação citado nela.
update aulas
set panda_video_ids = array_append(panda_video_ids, 'c3a8c63b-be1c-4424-a332-fd58f161aacd'),
    links_externos = links_externos || jsonb_build_array(jsonb_build_object('url', 'https://code.visualstudio.com', 'texto', 'Instalar o VS Code'))
where ordem = 2
  and trilha_id = (select id from trilhas where slug = 'trilha-ia');
