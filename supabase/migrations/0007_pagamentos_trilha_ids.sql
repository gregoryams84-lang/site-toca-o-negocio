-- supabase/migrations/0007_pagamentos_trilha_ids.sql

alter table pagamentos add column trilha_ids uuid[] not null default '{}';
