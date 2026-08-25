-- supabase/migrations/0020_seed_aula02_ia.sql

-- Aula 2 de "IA no Negócio" está sendo gravada em várias partes (Gregory
-- sobe uma de cada vez). Título provisório -- será ajustado quando o
-- escopo completo da aula ficar claro (mesmo padrão da aula 1, que
-- também divergiu do roteiro original).
insert into aulas (trilha_id, titulo, ordem, link_atividade, panda_video_ids)
select
  id,
  'Preparando seu computador pra usar IA de verdade',
  2,
  'https://gregoryams84-lang.github.io/app-atividades-curso/atividade.html?trilha=trilha-ia&aula=aula-02',
  array['38897c74-8023-493c-b884-693b189a024c']
from trilhas
where slug = 'trilha-ia';
