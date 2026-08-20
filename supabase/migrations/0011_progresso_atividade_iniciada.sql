-- supabase/migrations/0011_progresso_atividade_iniciada.sql

-- Rastreia se o aluno já clicou em "Fazer atividade" (ele navega pra um
-- link externo, então esse estado precisa sobreviver à volta pra
-- aula.html -- não dá pra guardar só em memória/JS). Usado junto com o
-- vídeo ter carregado na visita atual pra liberar "Marcar aula como
-- concluída": só libera depois que o aluno passou pelas duas etapas
-- reais (aula + atividade), não só clicando direto no botão de concluir.
alter table progresso add column atividade_iniciada boolean not null default false;
