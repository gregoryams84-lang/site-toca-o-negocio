-- supabase/migrations/0012_verificar_certificado.sql

-- Função pública de verificação de certificado. O certificado impresso
-- mostra só um código (ex: TN-A1B2C3D4) e "tocaonegocio.com.br/verificar";
-- quem for checar não está logado, então não dá pra usar as políticas de
-- RLS normais (que exigem auth.uid() = dono da matrícula). Em vez de abrir
-- uma política de leitura pública nas tabelas certificados/matriculas/perfis
-- (o que exporia todos os registros), a função roda com privilégio de dono
-- (security definer) e só devolve dados quando o código exato bate.
create or replace function verificar_certificado(p_codigo text)
returns table (
  nome_aluno text,
  nome_trilha text,
  carga_horaria_horas int,
  emitido_em timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select p.nome, t.nome, t.carga_horaria_horas, c.emitido_em
  from certificados c
  join matriculas m on m.id = c.matricula_id
  join perfis p on p.id = m.aluno_id
  join trilhas t on t.id = m.trilha_id
  where c.codigo_verificacao = p_codigo
  limit 1;
$$;

revoke all on function verificar_certificado(text) from public;
grant execute on function verificar_certificado(text) to anon, authenticated;
