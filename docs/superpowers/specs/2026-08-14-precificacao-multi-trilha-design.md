# Precificação multi-trilha — Design

> Estende o design e o plano da Fase 2 (`2026-08-13-pagamento-matricula-design.md` / `2026-08-13-pagamento-matricula.md`), ainda na branch `pagamento-matricula`, não mesclada. As Tasks 1-6 já implementadas continuam sendo a base; este documento cobre o que muda para sair de "um produto, um preço fixo de teste" para o modelo de preços real com três opções de compra.

## Contexto e motivação

A Fase 2 foi implementada assumindo um único produto vendável: o curso completo (as 4 trilhas), por um preço provisório de teste (`PRECO_CURSO_COMPLETO = 1.0`). Gregory definiu a precificação real do curso, que introduz três formas de compra ao invés de uma:

- Trilha avulsa: R$ 99,00 (compra 1 das 4 trilhas)
- Duas trilhas: R$ 186,00 (compra 2 das 4 trilhas, quaisquer duas — sem pares fixos)
- Curso completo: R$ 350,00 (as 4 trilhas)

Não existe preço para 3 trilhas — quem quiser 3 compra o pacote de "Duas trilhas" mais uma "Trilha avulsa" separadamente, ou o curso completo. Compras adicionais depois de já ter alguma trilha não têm desconto — cada compra é independente, sem sistema de crédito pelo que já foi pago. A decisão de só divulgar a tela de compra quando as 4 trilhas estiverem prontas (registrada no design da Fase 2) continua valendo — o que muda aqui é a arquitetura de preços/seleção, não quando ela vai ao ar.

## Modelo de preços e validação

O preço nunca é calculado ou confiado a partir do que o navegador envia — sempre recalculado no servidor a partir da contagem e identidade das trilhas selecionadas, comparadas contra a lista real de trilhas no banco:

| Seleção enviada | Preço | Regra de validação |
|---|---|---|
| exatamente 1 `trilha_id` válido | R$ 99,00 | — |
| exatamente 2 `trilha_id` válidos e distintos | R$ 186,00 | quaisquer duas, sem restrição de par |
| conjunto de `trilha_id` igual ao conjunto completo de trilhas existentes no banco | R$ 350,00 | comparação de conjunto, não só contagem — protege contra uma 5ª trilha futura fazer "escolheu 4" parar de significar "completo" |
| qualquer outra coisa (0, 3, ids inválidos, repetidos, ids que não existem) | rejeitado | HTTP 400 |

## Modelo de dados

`pagamentos` ganha uma coluna nova:

```sql
alter table pagamentos add column trilha_ids uuid[] not null default '{}';
```

Registra exatamente quais trilhas aquele pagamento específico cobriu. Substitui a suposição da Fase 2 de que "todo pagamento aprovado = todas as trilhas".

**Correção que a nova precificação expõe:** o fluxo de estorno/chargeback da Fase 2 cancela *todas* as matrículas do aluno ao estornar qualquer pagamento — correto quando só existia um produto, incorreto agora (uma pessoa pode ter matrículas vindas de mais de uma compra independente). O estorno passa a cancelar apenas as matrículas correspondentes ao `trilha_ids` daquele pagamento específico, lido da nova coluna.

## Tela de compra (`atividades/comprar.html`)

Três cartões fixos lado a lado (empilhados em mobile), com nome/preço vindos da tabela de preços acima. O cartão "Curso completo" fica destacado visualmente com um selo de economia (ex: "Economize R$ 46 em relação à compra avulsa" — 4 × R$99 = R$396 vs R$350).

A lista de trilhas (id + nome) é buscada diretamente do Supabase pelo cliente, via a política de leitura pública já existente na tabela `trilhas` ("qualquer um le trilhas") — mesmo padrão já usado em `painel.js`. Não precisa de uma nova função de backend só para listar trilhas.

Fluxo, sem reload de página (JS alternando visibilidade, mesmo padrão sem framework/build step do resto do site):

1. A pessoa clica em um cartão para escolher o plano ("Trilha avulsa", "Duas trilhas" ou "Curso completo").
2. Se escolheu "Trilha avulsa": aparecem 4 rádios (uma trilha) para marcar qual quer.
3. Se escolheu "Duas trilhas": aparecem 4 checkboxes, trava em exatamente 2 marcadas.
4. Se escolheu "Curso completo": nenhuma seleção adicional — as 4 já implícitas.
5. Formulário de nome/e-mail (igual ao já existente) e botão "Comprar", desabilitado até a seleção estar completa e válida.
6. Envia `{ nome, email, trilhaIds }` para `criar-preferencia-pagamento`.

O título do item que aparece na tela de checkout do Mercado Pago é montado dinamicamente a partir dos nomes reais das trilhas escolhidas (ex.: "Trilha: IA no Negócio" / "Duas trilhas: IA no Negócio + Vendas" / "Curso completo — acesso a todas as trilhas") — nunca um texto genérico fixo.

## Backend: `criar-preferencia-pagamento`

Deixa de ser "sem estado" — passa a consultar o banco (vira cliente Supabase com `SUPABASE_SERVICE_ROLE_KEY`, já disponível automaticamente em toda Edge Function, mesmo padrão já usado em `webhook-mercadopago`):

1. Recebe `{ nome, email, trilhaIds }`.
2. Busca todas as trilhas existentes (`id`, `nome`).
3. Valida `trilhaIds` contra a tabela de preços acima — qualquer desvio retorna `400`.
4. Calcula o preço e monta o título do item a partir dos nomes reais das trilhas selecionadas.
5. Cria a preferência no Mercado Pago incluindo `metadata: { trilha_ids: trilhaIds }` — a seleção viaja "dentro" do pagamento no próprio Mercado Pago, sem precisar de uma tabela de "compra pendente" à parte. O Mercado Pago devolve esse `metadata` de volta na consulta `GET /v1/payments/{id}` que o webhook já faz.

## Backend: `webhook-mercadopago`

1. Depois de confirmar o pagamento via API do Mercado Pago (como já faz hoje — nunca confia no corpo do aviso), lê `pagamento.metadata.trilha_ids`.
2. `matricularEmTodasAsTrilhas(alunoId)` vira `matricularEmTrilhas(alunoId, trilhaIds)` — matricula só nas trilhas daquele `trilha_ids`, não em todas.
3. Grava `trilha_ids` na linha de `pagamentos` (junto com o insert que já existe).
4. Caminho de estorno/chargeback: busca `trilha_ids` do pagamento original (pela nova coluna) e cancela só as matrículas correspondentes a essas trilhas — não todas as do aluno.

## O que não muda

- Modelo "compra primeiro, conta depois" (Fase 2) — sem login antes da compra.
- Verificação de assinatura HMAC do webhook, idempotência via `mercadopago_payment_id` único, re-confirmação do pagamento na API do Mercado Pago antes de qualquer escrita.
- Expiração de matrícula de 12 meses, igual para qualquer plano.
- `comprar.html` continua sem link público, até Gregory decidir divulgar (decisão da Fase 2, reafirmada aqui).
- Sem framework, sem build step no front-end.

## Fora de escopo

- Desconto ou crédito para quem já comprou parte do curso e volta para comprar mais — cada compra é independente, preço cheio.
- Venda de trilha avulsa antes das 4 trilhas existirem — a tela de compra só é divulgada com o curso completo pronto (decisão herdada da Fase 2).
- Preço para exatamente 3 trilhas — não existe essa opção; quem quiser 3 combina "Duas trilhas" + "Trilha avulsa" em compras separadas, ou compra o curso completo.
- Pares fixos de "Duas trilhas" — qualquer combinação de 2 é aceita pelo mesmo preço.
- Impedir comprar de novo uma trilha que a pessoa já tem — a compra continua anônima (sem exigir login antes de pagar), então não há como o sistema saber com certeza o que aquele e-mail já possui no momento da compra. Consequência aceita do modelo "compra primeiro, conta depois" já decidido na Fase 2, não uma omissão.
