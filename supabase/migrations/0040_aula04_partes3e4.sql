-- supabase/migrations/0040_aula04_partes3e4.sql

-- Completa a aula 4 (agente no WhatsApp via Chatvolt) com as partes 3 e
-- 4. Gregory uniu os vídeos 4 e 5 do roteiro original (base de
-- conhecimento + teste) num só, entao a aula fecha com 4 partes, nao 5:
-- 1) apresentacao, 2) o que e o Chatvolt, 3) criar agente e
-- configuracoes, 4) configurar + testar o agente (video unificado).
update aulas
set partes = partes || jsonb_build_array(
  jsonb_build_object('video_id', '712d9aaf-7601-4bd2-a6ce-f02d83282d3e', 'titulo', 'Criar agente e configurações no Chatvolt'),
  jsonb_build_object('video_id', 'baf4c1e2-0eda-4da0-8b02-bf510d4d9a79', 'titulo', 'Configurando o agente e teste final')
)
where ordem = 4
  and trilha_id = (select id from trilhas where slug = 'trilha-ia');
