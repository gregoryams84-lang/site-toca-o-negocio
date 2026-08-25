-- supabase/migrations/0021_aula02_parte2.sql

update aulas
set panda_video_ids = array_append(panda_video_ids, '9503eb2d-b343-4c8c-86e7-2778d6bc932e')
where ordem = 2
  and trilha_id = (select id from trilhas where slug = 'trilha-ia');
