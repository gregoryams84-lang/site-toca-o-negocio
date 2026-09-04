-- supabase/migrations/0049_trilha_vendas_titulos_reais.sql

-- Corrige os titulos das aulas 1, 2 e 3 da trilha-vendas pro conteudo
-- real transcrito -- a numeracao/tema gravado divergiu bastante do
-- roteiro-guia original (aula 2 virou "Portfolio de Negocios", aula 3
-- virou "criar agente + conectar WhatsApp", nao "automacao de conteudo").
update aulas
set titulo = 'A página do Facebook do seu negócio, pronta pra Meta'
where ordem = 1
  and trilha_id = (select id from trilhas where slug = 'trilha-vendas');

update aulas
set titulo = 'Portfólio de Negócios no Facebook'
where ordem = 2
  and trilha_id = (select id from trilhas where slug = 'trilha-vendas');

update aulas
set titulo = 'Crie seu agente e conecte ao WhatsApp'
where ordem = 3
  and trilha_id = (select id from trilhas where slug = 'trilha-vendas');
