-- supabase/migrations/0023_aulas_links_externos_multiplos.sql

-- Uma aula em várias partes pode citar mais de um link externo (uma
-- parte manda pro download de uma ferramenta, outra pro cadastro de
-- outra) -- link_externo_url/texto (par único) não aguenta isso.
-- Substituído por links_externos (array de {url, texto}, na ordem em
-- que aparecem na aula).
alter table aulas add column links_externos jsonb not null default '[]'::jsonb;

update aulas
set links_externos = jsonb_build_array(jsonb_build_object('url', link_externo_url, 'texto', link_externo_texto))
where link_externo_url is not null;

alter table aulas drop column link_externo_url;
alter table aulas drop column link_externo_texto;

-- Vincula a parte 3 (instalação do GitHub) e o link de cadastro citado nela.
update aulas
set panda_video_ids = array_append(panda_video_ids, '8b0efe4a-39b5-4804-be9b-c2a38747e2f4'),
    links_externos = links_externos || jsonb_build_array(jsonb_build_object('url', 'https://github.com', 'texto', 'Criar conta no GitHub'))
where ordem = 2
  and trilha_id = (select id from trilhas where slug = 'trilha-ia');
