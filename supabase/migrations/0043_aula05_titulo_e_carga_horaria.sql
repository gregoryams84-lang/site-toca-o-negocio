-- supabase/migrations/0043_aula05_titulo_e_carga_horaria.sql

-- Corrige o titulo da aula 5: o conteudo real gravado (automacao n8n
-- pra criar conteudo do Instagram) divergiu do titulo original
-- ("automatize o que acontece por tras do agente", pensado pra
-- automacao pos-conversa do Chatvolt). Tambem aumenta a carga horaria
-- do certificado da trilha-ia pra 80h, a pedido do Gregory -- a trilha
-- ficou longa (30 videos ao todo, contando as 5 aulas).
update aulas
set titulo = 'Automatize a criação do seu conteúdo'
where ordem = 5
  and trilha_id = (select id from trilhas where slug = 'trilha-ia');

update trilhas
set carga_horaria_horas = 80
where slug = 'trilha-ia';
