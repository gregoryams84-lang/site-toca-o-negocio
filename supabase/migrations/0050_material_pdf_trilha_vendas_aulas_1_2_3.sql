-- supabase/migrations/0050_material_pdf_trilha_vendas_aulas_1_2_3.sql

-- Liga o material de apoio em PDF das aulas 1, 2 e 3 da trilha-vendas,
-- agora que o conteudo real foi transcrito e os PDFs gerados a partir
-- do HTML do app-atividades-curso.
update aulas
set material_pdf_url = 'https://tocaonegocio.com.br/materiais/venda-pelo-whatsapp/aula-01-material-apoio.pdf'
where ordem = 1
  and trilha_id = (select id from trilhas where slug = 'trilha-vendas');

update aulas
set material_pdf_url = 'https://tocaonegocio.com.br/materiais/venda-pelo-whatsapp/aula-02-material-apoio.pdf'
where ordem = 2
  and trilha_id = (select id from trilhas where slug = 'trilha-vendas');

update aulas
set material_pdf_url = 'https://tocaonegocio.com.br/materiais/venda-pelo-whatsapp/aula-03-material-apoio.pdf'
where ordem = 3
  and trilha_id = (select id from trilhas where slug = 'trilha-vendas');
