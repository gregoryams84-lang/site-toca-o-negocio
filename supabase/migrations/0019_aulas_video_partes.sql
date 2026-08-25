-- supabase/migrations/0019_aulas_video_partes.sql

-- Algumas aulas vêm sendo gravadas em várias partes (Gregory sobe uma de
-- cada vez, sem saber de antemão quantas vai ter). panda_video_id
-- (singular) continua servindo aulas de vídeo único; panda_video_ids
-- (array, ordem = ordem de exibição) é usado quando a aula tem múltiplas
-- partes. gerar-link-video prioriza panda_video_ids quando presente.
alter table aulas add column panda_video_ids text[];
