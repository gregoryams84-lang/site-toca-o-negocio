# Pagamento e matrícula (Fase 2)

Data: 2026-08-13

## Objetivo

Segunda das quatro fases do curso (ver decomposição em
`2026-08-04-fundacao-tecnica-atividades-design.md`). Até aqui, toda
matrícula é criada manualmente no dashboard do Supabase. Esta fase
automatiza isso: um cliente compra o curso, paga, e ganha acesso sem
nenhuma intervenção manual do Gregory.

**Decisão de escopo confirmada com o Gregory:** o curso só vai à venda
quando as quatro trilhas estiverem prontas — hoje só "IA no Negócio"
existe. O checkout vende o curso completo (as quatro trilhas), não trilhas
avulsas. Como a venda só começa depois de tudo pronto, uma compra sempre
cria matrícula para todas as trilhas existentes no momento do pagamento,
sem precisar de nenhum mecanismo de "preencher lacuna" para trilhas
lançadas depois — ver "Fora de escopo".

## Decisão de arquitetura

**Processador de pagamento: Mercado Pago.** Escolhido sobre Stripe por ser
mais familiar e confiável para o público-alvo (pequeno empreendedor
brasileiro), suportar Pix e boleto nativamente (essenciais nesse público),
oferecer parcelamento no cartão, e cobrar só por transação — sem
mensalidade, mesmo princípio que guiou as escolhas de Supabase e GitHub
Pages.

**Checkout Pro** (página de pagamento hospedada pelo próprio Mercado
Pago), não Checkout Bricks (formulário embutido no nosso site).
Descartado o embutido porque exigiria lidar com tokenização de cartão e
mais responsabilidade de segurança de dados de pagamento, sem necessidade
real — o Checkout Pro já resolve Pix/boleto/cartão prontos, hospedados
fora do nosso domínio.

**Confirmação de pagamento só por webhook, nunca pelo retorno do
navegador.** O Mercado Pago redireciona o cliente de volta ao nosso site
depois do pagamento (`back_urls`), mas esse retorno é só informativo — a
URL de retorno pode ser manipulada por qualquer um, então nenhuma tela
alimentada pelo navegador libera acesso. Quem libera é uma Edge Function
que recebe o aviso do Mercado Pago servidor a servidor, confirma a
assinatura do aviso, e ainda assim busca os dados reais do pagamento na
API do Mercado Pago antes de agir — nunca confia no conteúdo do aviso
sozinho.

Duas Edge Functions novas, mesmo padrão já usado em
`gerar-link-video` (Fase 3): sem servidor próprio, segredos guardados como
segredos do Supabase.

## Modelo de dados

Tabela nova (migração):

```sql
create table pagamentos (
  id uuid primary key default gen_random_uuid(),
  mercadopago_payment_id text unique not null,
  email text not null,
  aluno_id uuid references auth.users(id),
  valor numeric not null,
  status text not null check (status in ('aprovado', 'estornado', 'chargeback')),
  criado_em timestamptz not null default now()
);
```

`mercadopago_payment_id` é único de propósito: é a chave de idempotência.
O Mercado Pago pode reenviar o mesmo aviso de pagamento mais de uma vez;
antes de agir, a função de webhook confere se já existe uma linha com
esse id — se existir, o aviso é ignorado, evitando matrícula duplicada e
e-mail duplicado.

Nenhuma mudança em `trilhas`, `aulas`, `matriculas` — a compra só passa a
*criar* linhas em `matriculas`, seguindo as regras já em vigor desde a
Fase 1 (`status = 'ativa'`, `data_expiracao = data_matricula + 12 meses`).
Um pagamento estornado ou com chargeback faz a função marcar a(s)
matrícula(s) correspondente(s) como `status = 'cancelada'` — valor que já
é aceito pela constraint da tabela desde a Fase 1, mas nunca usado de
verdade até agora.

## Componentes novos

### Edge Function `criar-preferencia-pagamento`

Chamada por `comprar.html` quando o cliente clica em "Comprar". Recebe
nome e e-mail, cria uma preferência de pagamento na API do Mercado Pago
(descrição do curso, preço, e-mail do comprador, e um código de
referência nosso para rastrear essa tentativa) e devolve o link de
checkout do Mercado Pago para a página redirecionar o cliente.

### Edge Function `webhook-mercadopago`

Recebe o aviso do Mercado Pago quando o status de um pagamento muda.

1. Confirma a assinatura do aviso (cabeçalho enviado pelo Mercado Pago) —
   rejeita silenciosamente (sem ação) se não confere.
2. Busca os dados reais do pagamento na API do Mercado Pago usando o id
   do aviso — nunca age só com base no conteúdo do aviso em si.
3. Se `mercadopago_payment_id` já existe em `pagamentos`, para aqui — já
   processado.
4. Se aprovado: procura conta existente pelo e-mail; cria uma nova se não
   existir; cria uma matrícula para cada trilha existente hoje no banco
   (`status = 'ativa'`, `data_expiracao = now() + 12 meses`); grava a
   linha em `pagamentos`; dispara e-mail de "defina sua senha" via
   convite do Supabase Auth (reaproveita o SMTP já configurado na Fase 3).
5. Se estornado ou chargeback: marca a(s) matrícula(s) ligada(s) a esse
   pagamento como `cancelada`.

### Páginas novas

- `comprar.html` — pública, sem exigir login. Formulário (nome, e-mail) +
  botão que chama `criar-preferencia-pagamento` e redireciona. Texto de
  venda mínimo nesta fase (preço, o que está incluso) — copy definitiva
  fica para revisão do Gregory antes de a página ser linkada de qualquer
  lugar público do site.
- `sucesso.html` — "Pagamento recebido! Confira seu e-mail para definir
  sua senha e acessar o curso."
- `pendente.html` — para boleto (não confirma na hora): "Assim que o
  pagamento for compensado, você recebe o e-mail de acesso."
- `falha.html` — pagamento recusado/cancelado, com opção de tentar de
  novo.

Nenhuma dessas três últimas libera acesso por si só — são só as URLs de
retorno padrão exigidas pelo Mercado Pago (sucesso/pendente/falha); quem
decide é sempre o webhook.

## Estados de erro

| Situação | Comportamento |
|---|---|
| Assinatura do webhook não confere | Rejeita, nenhuma ação, registra aviso para investigar |
| Mesmo pagamento notificado mais de uma vez | Segunda notificação ignorada (idempotência via `pagamentos`) |
| E-mail do pagamento já tem conta | Reaproveita a conta, só cria a(s) matrícula(s) nova(s) |
| Falha ao criar conta/matrícula após pagamento confirmado | Fica registrado para reprocessar manualmente — dinheiro já recebido, não pode falhar silenciosamente sem deixar rastro |
| Pagamento estornado/chargeback | Matrícula(s) correspondentes viram `cancelada` |
| Cliente fecha o navegador antes de voltar ao site | Sem impacto — acesso já liberado pelo webhook, independente do navegador |

## Testes

Sem suíte automatizada nas páginas estáticas (padrão já estabelecido). A
lógica da função de webhook (verificação de assinatura, idempotência,
find-or-create de conta) é candidata a testes próprios, no mesmo espírito
de `progresso-remoto.test.js` da Fase 3 — a confirmar no plano de
implementação. Verificação de ponta a ponta final é manual, com uma
compra de teste real (valor simbólico ou ambiente de teste do Mercado
Pago, a definir na implementação).

## Fora de escopo

- Texto de venda definitivo (preço, copy de marketing) — versão mínima
  aqui, revisão fica para depois.
- Cupom de desconto, parcelamento configurável além do padrão do Mercado
  Pago, upsell.
- Reenvio manual de e-mail de acesso via painel administrativo — caso raro
  tratado manualmente por enquanto (sem painel administrativo dedicado
  nesta fase).
- **Vender o curso antes de todas as quatro trilhas existirem.** Se essa
  decisão mudar no futuro, é preciso revisitar o passo 4 do webhook (hoje
  matricula em "todas as trilhas existentes no momento do pagamento") e
  desenhar um mecanismo de matricular automaticamente clientes antigos
  quando uma trilha nova for publicada depois da venda ter começado.
- Certificado de conclusão — Fase 4.
- Material em PDF (`material_pdf_url`) — segue fora de escopo desde a
  Fase 3.

## Critérios de aceite

- Cliente sem conta consegue comprar em `comprar.html`, pagar via Pix (ou
  cartão) no Mercado Pago, e recebe e-mail para definir senha.
- Depois de definir a senha, o cliente loga e vê, no painel, matrícula
  ativa em todas as trilhas existentes no momento da compra.
- Reenviar manualmente o mesmo webhook (simulando reenvio do Mercado
  Pago) não cria matrícula nem envia e-mail duplicado.
- Um pagamento com `x-signature` inválida não gera nenhuma matrícula.
- Marcar um pagamento de teste como estornado faz a matrícula
  correspondente virar `cancelada`, e o aluno perde acesso (RLS já testada
  desde a Fase 3 nega leitura de `aulas` para matrícula não-ativa).
- `comprar.html` não aparece linkada em nenhuma página pública do site
  nesta fase (o Gregory decide quando divulgar).
