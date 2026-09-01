-- supabase/migrations/0041_material_pdf_aula04_ia.sql

-- Liga o material de apoio em PDF da aula 4 (trilha IA no Negocio),
-- agora que o conteudo real foi transcrito e o PDF gerado a partir do
-- HTML do app-atividades-curso.
update aulas
set material_pdf_url = 'https://tocaonegocio.com.br/materiais/ia-no-negocio/aula-04-material-apoio.pdf'
where ordem = 4
  and trilha_id = (select id from trilhas where slug = 'trilha-ia');
