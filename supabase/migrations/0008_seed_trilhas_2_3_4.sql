-- supabase/migrations/0008_seed_trilhas_2_3_4.sql
-- Registra as 3 trilhas que já têm currículo/páginas no site mas ainda
-- não existiam na tabela trilhas — necessário para o cálculo de preço
-- multi-trilha reconhecer "duas trilhas"/"curso completo" e para o
-- webhook conseguir matricular nelas. Slugs conforme docs/curriculo-completo.md.

insert into trilhas (nome, descricao, slug)
values
  (
    'Vender pela internet e pelo WhatsApp',
    'Monte um catálogo simples, responda mensagem sem perder venda e feche pedido direto na conversa, aula a aula.',
    'trilha-vendas'
  ),
  (
    'Formalizar e manter a empresa em dia',
    'Entenda o que precisa emitir, pagar e declarar pra funcionar dentro da lei, sem depender de um contador pra cada dúvida, aula a aula.',
    'trilha-formalizacao'
  ),
  (
    'Gerir o dinheiro',
    'Separe o que é seu do que é da empresa, saiba quanto sobra no fim do mês e decida com número, não com achismo, aula a aula.',
    'trilha-dinheiro'
  );
