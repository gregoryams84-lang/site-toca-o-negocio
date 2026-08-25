-- supabase/migrations/0025_aula02_partes5a7.sql

-- Vincula as partes finais da aula 2: trabalhar em paralelo com o Claude
-- (chat + Claude Code), instalar a extensão Claude Code no VS Code, e o
-- terminal PowerShell. Com isso a aula 2 fica completa (7 partes).
update aulas
set panda_video_ids = panda_video_ids
  || array['16304fc8-c5a6-4417-accb-accf23f63cbc']  -- parte 5
  || array['673985cd-ee58-410e-bae9-8cfed366f4b4']  -- parte 6
  || array['a3bfae10-234c-47eb-89c4-fe1a5e48587d']  -- parte 7
where ordem = 2
  and trilha_id = (select id from trilhas where slug = 'trilha-ia');
