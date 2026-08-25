-- supabase/migrations/0022_aulas_link_externo.sql

-- Campo genérico pra um link de referência citado na aula (ex: página
-- de download de uma ferramenta) -- reaproveitável por qualquer aula,
-- não só a 2.
alter table aulas add column link_externo_url text;
alter table aulas add column link_externo_texto text;

update aulas
set link_externo_url = 'https://claude.com/download',
    link_externo_texto = 'Baixar o Claude'
where ordem = 2
  and trilha_id = (select id from trilhas where slug = 'trilha-ia');
