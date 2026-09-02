-- supabase/migrations/0046_aulas_gratuitas_partes.sql

-- aulas_gratuitas so suportava 1 video (panda_video_id). A trilha-vendas
-- vai ter a aula gratis em 2 videos -- adiciona partes (mesmo formato
-- jsonb usado em aulas.partes) pra suportar multiplos videos, mantendo
-- panda_video_id como fallback pras trilhas com 1 video so.
alter table aulas_gratuitas
  add column partes jsonb;

-- Atualiza o titulo/descricao da aula gratis da trilha-vendas pro
-- conteudo real (estava com o plano antigo "Perfil que vende sem
-- gastar" -- a aula 1 real e sobre aprovacao da Meta).
update aulas_gratuitas
set titulo = 'Deixe seu Instagram e Facebook prontos pra aprovação da Meta',
    descricao = 'Página do Facebook completa, Instagram profissional, os dois vinculados — os requisitos que a Meta cobra antes de aprovar WhatsApp Business.'
where trilha_id = (select id from trilhas where slug = 'trilha-vendas');
