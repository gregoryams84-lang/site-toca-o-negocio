-- supabase/migrations/0016_handle_new_user_cpf.sql

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.perfis (id, nome, telefone, email, cpf)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome', new.email),
    new.raw_user_meta_data->>'telefone',
    new.email,
    new.raw_user_meta_data->>'cpf'
  );
  return new;
end;
$$;
