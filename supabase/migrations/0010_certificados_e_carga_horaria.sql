-- supabase/migrations/0010_certificados_e_carga_horaria.sql

-- Carga horária exibida no certificado. Valor provisório de 8h por trilha
-- (6 aulas curtas, diretas ao ponto) -- CONFIRMAR o valor real com o
-- Gregory antes de emitir certificados de verdade pra alunos.
alter table trilhas add column carga_horaria_horas int not null default 8;

-- O aluno precisa poder criar seu próprio registro de certificado (só existia
-- política de leitura). Só permite se a trilha estiver realmente concluída
-- (todas as aulas da trilha marcadas como concluídas no progresso do aluno).
create policy "aluno emite proprio certificado" on certificados
  for insert
  with check (
    exists (
      select 1 from matriculas
      where matriculas.id = certificados.matricula_id
      and matriculas.aluno_id = auth.uid()
      and matriculas.status = 'ativa'
    )
    and not exists (
      select 1 from aulas
      where aulas.trilha_id = (select trilha_id from matriculas where matriculas.id = certificados.matricula_id)
      and not exists (
        select 1 from progresso
        where progresso.matricula_id = certificados.matricula_id
        and progresso.aula_id = aulas.id
        and progresso.concluida = true
      )
    )
  );
