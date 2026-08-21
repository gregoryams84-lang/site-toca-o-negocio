-- supabase/migrations/0014_material_pdf_aula01_ia.sql

update aulas
set material_pdf_url = 'https://tocaonegocio.com.br/materiais/ia-no-negocio/aula-01-material-apoio.pdf'
where ordem = 1
  and trilha_id = (select id from trilhas where slug = 'trilha-ia');
