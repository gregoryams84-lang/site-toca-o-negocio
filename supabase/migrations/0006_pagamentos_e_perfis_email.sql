-- supabase/migrations/0006_pagamentos_e_perfis_email.sql

alter table perfis add column email text;

update perfis
set email = (select u.email from auth.users u where u.id = perfis.id)
where email is null;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.perfis (id, nome, telefone, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'nome', new.email), new.raw_user_meta_data->>'telefone', new.email);
  return new;
end;
$$;

create table pagamentos (
  id uuid primary key default gen_random_uuid(),
  mercadopago_payment_id text unique not null,
  email text not null,
  aluno_id uuid references auth.users(id),
  valor numeric not null,
  status text not null check (status in ('aprovado', 'estornado', 'chargeback')),
  criado_em timestamptz not null default now()
);

alter table pagamentos enable row level security;

create policy "aluno le proprio pagamento" on pagamentos
  for select using (auth.uid() = aluno_id);
