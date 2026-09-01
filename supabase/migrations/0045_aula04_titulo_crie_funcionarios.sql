-- supabase/migrations/0045_aula04_titulo_crie_funcionarios.sql

-- Gregory pediu pra trocar o titulo da aula 4 pra "Crie Funcionarios".
update aulas
set titulo = 'Crie Funcionários'
where ordem = 4
  and trilha_id = (select id from trilhas where slug = 'trilha-ia');
