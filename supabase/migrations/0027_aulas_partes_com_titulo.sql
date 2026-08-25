-- supabase/migrations/0027_aulas_partes_com_titulo.sql

-- panda_video_ids (array de external_id puro) não carrega um título por
-- parte -- a página da aula só conseguia rotular "Parte N", sem contexto
-- do que cada vídeo mostra. Substituído por partes (array ordenado de
-- {video_id, titulo}).
alter table aulas add column partes jsonb not null default '[]'::jsonb;

update aulas
set partes = jsonb_build_array(
  jsonb_build_object('video_id', '38897c74-8023-493c-b884-693b189a024c', 'titulo', 'Verificando o Windows 11 Pro'),
  jsonb_build_object('video_id', '9503eb2d-b343-4c8c-86e7-2778d6bc932e', 'titulo', 'Instalando o Claude, plano Pro'),
  jsonb_build_object('video_id', '8b0efe4a-39b5-4804-be9b-c2a38747e2f4', 'titulo', 'Criando conta no GitHub'),
  jsonb_build_object('video_id', 'c3a8c63b-be1c-4424-a332-fd58f161aacd', 'titulo', 'Instalando o VS Code'),
  jsonb_build_object('video_id', '16304fc8-c5a6-4417-accb-accf23f63cbc', 'titulo', 'Chat e Code em paralelo'),
  jsonb_build_object('video_id', '673985cd-ee58-410e-bae9-8cfed366f4b4', 'titulo', 'Instalando o Claude Code no VS Code'),
  jsonb_build_object('video_id', 'a3bfae10-234c-47eb-89c4-fe1a5e48587d', 'titulo', 'Conhecendo o terminal PowerShell')
)
where ordem = 2
  and trilha_id = (select id from trilhas where slug = 'trilha-ia');

alter table aulas drop column panda_video_ids;
