-- supabase/migrations/0004_seed_trilha_ia_aula_01.sql

insert into trilhas (nome, descricao, slug)
values (
  'IA no Negócio',
  'Reconheça onde a IA já pode ajudar seu negócio e aprenda a aplicar isso na prática, aula a aula.',
  'trilha-ia'
);

insert into aulas (trilha_id, titulo, ordem, link_atividade)
select
  id,
  'Você já usa IA. O problema é como.',
  1,
  'https://gregoryams84-lang.github.io/app-atividades-curso/atividade.html?trilha=trilha-ia&aula=aula-01'
from trilhas
where slug = 'trilha-ia';
