-- supabase/migrations/0028_trilhas_ordem.sql

-- A ordem de exibição das trilhas era implícita (dependia da ordem de
-- inserção, sem garantia do Postgres) -- causou o site mostrar "Vendas"
-- como Trilha 1 e "IA no Negócio" como Trilha 2, invertido do que sempre
-- foi o real (a trilha-ia foi seeded na migração 0004, antes das outras
-- 3 na migração 0008). Adiciona uma coluna explícita.
alter table trilhas add column ordem integer;

update trilhas set ordem = 1 where slug = 'trilha-ia';
update trilhas set ordem = 2 where slug = 'trilha-vendas';
update trilhas set ordem = 3 where slug = 'trilha-formalizacao';
update trilhas set ordem = 4 where slug = 'trilha-dinheiro';

alter table trilhas alter column ordem set not null;
