-- supabase/migrations/0026_material_pdf_aula02_ia.sql

update aulas
set material_pdf_url = 'https://tocaonegocio.com.br/materiais/ia-no-negocio/aula-02-material-apoio.pdf'
where ordem = 2
  and trilha_id = (select id from trilhas where slug = 'trilha-ia');
