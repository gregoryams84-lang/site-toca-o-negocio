-- supabase/migrations/0001_fundacao.sql

create table perfis (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null,
  telefone text,
  criado_em timestamptz not null default now()
);

alter table perfis enable row level security;

create policy "aluno le proprio perfil" on perfis
  for select using (auth.uid() = id);

create policy "aluno edita proprio perfil" on perfis
  for update using (auth.uid() = id);

create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.perfis (id, nome, telefone)
  values (new.id, new.raw_user_meta_data->>'nome', new.raw_user_meta_data->>'telefone');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create table trilhas (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  descricao text,
  slug text unique not null
);

alter table trilhas enable row level security;

create policy "qualquer um le trilhas" on trilhas
  for select using (true);

create table matriculas (
  id uuid primary key default gen_random_uuid(),
  aluno_id uuid not null references auth.users(id) on delete cascade,
  trilha_id uuid not null references trilhas(id) on delete cascade,
  data_matricula timestamptz not null default now(),
  data_expiracao timestamptz not null,
  status text not null default 'ativa' check (status in ('ativa', 'expirada', 'cancelada')),
  unique (aluno_id, trilha_id)
);

alter table matriculas enable row level security;

create policy "aluno le propria matricula" on matriculas
  for select using (auth.uid() = aluno_id);

create table aulas (
  id uuid primary key default gen_random_uuid(),
  trilha_id uuid not null references trilhas(id) on delete cascade,
  titulo text not null,
  ordem int not null,
  video_url text,
  material_pdf_url text,
  descricao_atividade text
);

alter table aulas enable row level security;

create policy "aluno matriculado le aulas da trilha" on aulas
  for select using (
    exists (
      select 1 from matriculas
      where matriculas.trilha_id = aulas.trilha_id
      and matriculas.aluno_id = auth.uid()
      and matriculas.status = 'ativa'
    )
  );

create table progresso (
  id uuid primary key default gen_random_uuid(),
  matricula_id uuid not null references matriculas(id) on delete cascade,
  aula_id uuid not null references aulas(id) on delete cascade,
  concluida boolean not null default false,
  concluida_em timestamptz,
  unique (matricula_id, aula_id)
);

alter table progresso enable row level security;

create policy "aluno le proprio progresso" on progresso
  for select using (
    exists (
      select 1 from matriculas
      where matriculas.id = progresso.matricula_id
      and matriculas.aluno_id = auth.uid()
    )
  );

create policy "aluno atualiza proprio progresso" on progresso
  for all using (
    exists (
      select 1 from matriculas
      where matriculas.id = progresso.matricula_id
      and matriculas.aluno_id = auth.uid()
    )
  );

create table certificados (
  id uuid primary key default gen_random_uuid(),
  matricula_id uuid not null references matriculas(id) on delete cascade,
  emitido_em timestamptz,
  codigo_verificacao text unique
);

alter table certificados enable row level security;

create policy "aluno le proprio certificado" on certificados
  for select using (
    exists (
      select 1 from matriculas
      where matriculas.id = certificados.matricula_id
      and matriculas.aluno_id = auth.uid()
    )
  );
