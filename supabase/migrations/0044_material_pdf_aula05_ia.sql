-- supabase/migrations/0044_material_pdf_aula05_ia.sql

-- Liga o material de apoio em PDF da aula 5 (trilha IA no Negocio),
-- ultima aula da trilha, agora que o conteudo real foi transcrito e o
-- PDF gerado a partir do HTML do app-atividades-curso.
update aulas
set material_pdf_url = 'https://tocaonegocio.com.br/materiais/ia-no-negocio/aula-05-material-apoio.pdf'
where ordem = 5
  and trilha_id = (select id from trilhas where slug = 'trilha-ia');
