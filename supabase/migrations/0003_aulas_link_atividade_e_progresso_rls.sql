-- supabase/migrations/0003_aulas_link_atividade_e_progresso_rls.sql

alter table aulas add column link_atividade text;

-- A política de escrita de progresso checava só se a matrícula pertence ao
-- aluno, sem checar se ela está ativa e dentro do prazo (a política de
-- `aulas` já fazia essa checagem desde 0002; `progresso` ficou de fora).
-- Corrigido aqui porque esta é a primeira vez que `progresso` recebe escrita
-- real de fora do painel administrativo.
alter policy "aluno atualiza proprio progresso" on progresso
  using (
    exists (
      select 1 from matriculas
      where matriculas.id = progresso.matricula_id
      and matriculas.aluno_id = auth.uid()
      and matriculas.status = 'ativa'
      and matriculas.data_expiracao > now()
    )
  )
  with check (
    exists (
      select 1 from matriculas
      where matriculas.id = progresso.matricula_id
      and matriculas.aluno_id = auth.uid()
      and matriculas.status = 'ativa'
      and matriculas.data_expiracao > now()
    )
  );
