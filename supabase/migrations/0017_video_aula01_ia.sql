-- supabase/migrations/0017_video_aula01_ia.sql

update aulas
set panda_video_id = 'f2637db4-7eb9-4169-9a85-b9d5db077684'
where ordem = 1
  and trilha_id = (select id from trilhas where slug = 'trilha-ia');
