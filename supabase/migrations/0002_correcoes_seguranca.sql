-- supabase/migrations/0002_correcoes_seguranca.sql

-- Torna explícito o WITH CHECK das políticas de escrita (antes implícito via USING)
alter policy "aluno edita proprio perfil" on perfis
  with check (auth.uid() = id);

alter policy "aluno atualiza proprio progresso" on progresso
  with check (
    exists (
      select 1 from matriculas
      where matriculas.id = progresso.matricula_id
      and matriculas.aluno_id = auth.uid()
    )
  );

-- Aulas só ficam visíveis enquanto a matrícula estiver dentro do prazo de acesso
alter policy "aluno matriculado le aulas da trilha" on aulas
  using (
    exists (
      select 1 from matriculas
      where matriculas.trilha_id = aulas.trilha_id
      and matriculas.aluno_id = auth.uid()
      and matriculas.status = 'ativa'
      and matriculas.data_expiracao > now()
    )
  );

-- Evita falha da trigger de cadastro quando o nome não é enviado (ex: signup fora do formulário padrão)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.perfis (id, nome, telefone)
  values (new.id, coalesce(new.raw_user_meta_data->>'nome', new.email), new.raw_user_meta_data->>'telefone');
  return new;
end;
$$;
