-- supabase/migrations/0009_leads_e_aulas_gratuitas.sql

create table leads (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  celular text not null,
  email text not null,
  cidade text not null,
  estado text not null,
  trilha_id uuid references trilhas(id) not null,
  criado_em timestamptz not null default now()
);

alter table leads enable row level security;

create policy "qualquer um pode criar lead" on leads
  for insert with check (true);

create table aulas_gratuitas (
  id uuid primary key default gen_random_uuid(),
  trilha_id uuid references trilhas(id) not null unique,
  titulo text not null,
  descricao text,
  panda_video_id text
);

alter table aulas_gratuitas enable row level security;

create policy "qualquer um le aulas gratuitas" on aulas_gratuitas
  for select using (true);

insert into aulas_gratuitas (trilha_id, titulo, descricao)
select id,
  'Você já usa IA. O problema é como.',
  'Reconheça, pelas três perguntas, se uma tarefa do seu negócio vale a pena automatizar.'
from trilhas where slug = 'trilha-ia';

insert into aulas_gratuitas (trilha_id, titulo, descricao)
select id,
  'Perfil que vende sem gastar',
  'Estruture Instagram e Facebook com ajuda de IA, sem gastar nada.'
from trilhas where slug = 'trilha-vendas';

insert into aulas_gratuitas (trilha_id, titulo, descricao)
select id,
  'Onde você está agora',
  'Diagnóstico rápido: MEI, ME ou nada ainda — descubra seu ponto de partida.'
from trilhas where slug = 'trilha-formalizacao';

insert into aulas_gratuitas (trilha_id, titulo, descricao)
select id,
  'Pra onde seu dinheiro vai',
  'Separe o dinheiro pessoal do negócio antes que a mistura vire prejuízo.'
from trilhas where slug = 'trilha-dinheiro';
