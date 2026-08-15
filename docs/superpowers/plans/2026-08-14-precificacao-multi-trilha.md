# Precificação multi-trilha — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A tela de compra deixa a pessoa escolher entre trilha avulsa (R$99), duas trilhas (R$186) ou curso completo (R$350); o backend calcula e valida esse preço sozinho; e o webhook matricula só nas trilhas realmente compradas.

**Architecture:** Estende as Edge Functions e a tela de compra já existentes da Fase 2 (`docs/superpowers/plans/2026-08-13-pagamento-matricula.md`, Tasks 1-6, já mescladas nesta branch). `criar-preferencia-pagamento` passa a consultar a tabela `trilhas` para validar a seleção e calcular o preço certo, e embute a seleção como `metadata` na preferência do Mercado Pago. `webhook-mercadopago` lê essa `metadata` de volta (depois de reconfirmar o pagamento na API do Mercado Pago, nunca confiando no aviso em si) e matricula só nas trilhas escolhidas. `pagamentos` ganha uma coluna `trilha_ids` para registrar o que cada pagamento cobriu, usada também para escopar corretamente o cancelamento de matrícula em caso de estorno.

**Tech Stack:** Mesmo da Fase 2 — Supabase Edge Functions (Deno, TypeScript), Mercado Pago Checkout Pro + Payments API, HTML/CSS/JS sem build step.

## Global Constraints

- Preço nunca é calculado nem confiado a partir do que o navegador envia — sempre recalculado no servidor (`criar-preferencia-pagamento`) a partir da identidade real das trilhas selecionadas, comparada contra a tabela `trilhas` do banco.
- Não existe preço para 3 trilhas — só 1 (R$99), 2 quaisquer (R$186) ou o conjunto completo de trilhas existentes (R$350). Qualquer outra seleção é rejeitada com `400`.
- Sem desconto para quem compra trilhas adicionais depois de já ter alguma — cada compra é independente, preço cheio.
- `pagamentos.trilha_ids` grava exatamente quais trilhas aquele pagamento cobriu; o webhook usa essa coluna tanto para matricular quanto para escopar o cancelamento em estornos — nunca cancela mais do que as trilhas daquele pagamento específico.
- `comprar.html` continua sem link público nesta fase (decisão herdada da Fase 2) — Gregory decide quando divulgar.
- Sem framework, sem build step no front-end — mesmo padrão do resto do site.
- Mercado Pago Access Token e webhook secret continuam nunca aparecendo em nenhum arquivo servido ao navegador.

---

## Task 1: Migração — coluna `pagamentos.trilha_ids`

**Repositório:** `site-toca-o-negocio`

**Files:**
- Create: `supabase/migrations/0007_pagamentos_trilha_ids.sql`

**Interfaces:**
- Produces: coluna `pagamentos.trilha_ids uuid[]`. Tasks 2 e 3 dependem dela.

- [ ] **Step 1: Escrever a migração**

```sql
-- supabase/migrations/0007_pagamentos_trilha_ids.sql

alter table pagamentos add column trilha_ids uuid[] not null default '{}';
```

- [ ] **Step 2: Aplicar a migração**

```bash
supabase db push
```

- [ ] **Step 3: Verificar**

```bash
supabase db query --linked "select column_name, data_type from information_schema.columns where table_name = 'pagamentos' and column_name = 'trilha_ids';"
```

Expected: 1 linha, `trilha_ids` / `ARRAY`.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/0007_pagamentos_trilha_ids.sql
git commit -m "feat: add pagamentos.trilha_ids to track which trilhas each payment covers"
```

---

## Task 2: Módulo de cálculo de preço (TDD) + `criar-preferencia-pagamento`

**Repositório:** `site-toca-o-negocio`

**Files:**
- Create: `supabase/functions/criar-preferencia-pagamento/precos.ts`
- Test: `supabase/functions/criar-preferencia-pagamento/precos.test.ts`
- Modify: `supabase/functions/criar-preferencia-pagamento/index.ts` (reescrita completa do arquivo)

**Interfaces:**
- Produces: `calcularPreco(trilhaIdsSelecionados: string[], todasTrilhas: { id: string; nome: string }[]): { preco: number; titulo: string } | null` — `null` significa seleção inválida (deve virar `400`). `index.ts` (mesma task) consome essa função.
- Consumes (index.ts): tabela `trilhas` (`id`, `nome`), lida via `SUPABASE_SERVICE_ROLE_KEY` (já disponível automaticamente em toda Edge Function).
- Produces (index.ts): o endpoint passa a receber `{ nome, email, trilhaIds }` (`trilhaIds` é um array de ids de trilha, novo campo obrigatório) e devolve `{ initPoint }` em sucesso ou `{ erro }` com status apropriado — mesmo formato de resposta da Fase 2, request mudou. A preferência criada no Mercado Pago agora inclui `metadata: { trilha_ids }`. Task 3 (webhook) e Task 4 (tela de compra) dependem desse contrato.

A lógica de preço fica em um módulo separado, testável sem subir servidor — mesmo motivo que levou a Fase 2 a separar `assinatura.ts` de `index.ts` no webhook: `Deno.serve(...)` inicia um servidor assim que o arquivo é importado, o que atrapalharia os testes se a lógica pura estivesse no mesmo arquivo. Aqui a justificativa é ainda mais direta: um erro na ordem dos `if`s muda quanto alguém paga.

- [ ] **Step 1: Escrever os testes (falhando)**

Criar `supabase/functions/criar-preferencia-pagamento/precos.test.ts`:

```typescript
import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts'
import { calcularPreco, PRECO_TRILHA_AVULSA, PRECO_DUAS_TRILHAS, PRECO_CURSO_COMPLETO } from './precos.ts'

const TRILHA_A = { id: 'a', nome: 'IA no Negócio' }
const TRILHA_B = { id: 'b', nome: 'Vendas' }
const TRILHA_C = { id: 'c', nome: 'Financeiro' }
const TRILHA_D = { id: 'd', nome: 'Marketing' }
const QUATRO_TRILHAS = [TRILHA_A, TRILHA_B, TRILHA_C, TRILHA_D]

Deno.test('1 trilha selecionada retorna preco de trilha avulsa', () => {
  const resultado = calcularPreco(['a'], QUATRO_TRILHAS)
  assertEquals(resultado, { preco: PRECO_TRILHA_AVULSA, titulo: 'Trilha: IA no Negócio' })
})

Deno.test('2 trilhas selecionadas retornam preco de duas trilhas', () => {
  const resultado = calcularPreco(['a', 'b'], QUATRO_TRILHAS)
  assertEquals(resultado, { preco: PRECO_DUAS_TRILHAS, titulo: 'Duas trilhas: IA no Negócio + Vendas' })
})

Deno.test('todas as trilhas selecionadas retornam preco de curso completo', () => {
  const resultado = calcularPreco(['a', 'b', 'c', 'd'], QUATRO_TRILHAS)
  assertEquals(resultado, { preco: PRECO_CURSO_COMPLETO, titulo: 'Curso completo — acesso a todas as trilhas' })
})

Deno.test('3 trilhas selecionadas (de um total de 4) retorna null', () => {
  const resultado = calcularPreco(['a', 'b', 'c'], QUATRO_TRILHAS)
  assertEquals(resultado, null)
})

Deno.test('array vazio retorna null', () => {
  const resultado = calcularPreco([], QUATRO_TRILHAS)
  assertEquals(resultado, null)
})

Deno.test('id duplicado retorna null', () => {
  const resultado = calcularPreco(['a', 'a'], QUATRO_TRILHAS)
  assertEquals(resultado, null)
})

Deno.test('id que nao existe em todasTrilhas retorna null', () => {
  const resultado = calcularPreco(['a', 'nao-existe'], QUATRO_TRILHAS)
  assertEquals(resultado, null)
})

Deno.test('1 trilha selecionada quando so existe 1 trilha no total ainda e avulsa, nao completo', () => {
  const resultado = calcularPreco(['a'], [TRILHA_A])
  assertEquals(resultado, { preco: PRECO_TRILHA_AVULSA, titulo: 'Trilha: IA no Negócio' })
})

Deno.test('2 trilhas selecionadas quando so existem 2 no total e duas trilhas, nao completo', () => {
  const resultado = calcularPreco(['a', 'b'], [TRILHA_A, TRILHA_B])
  assertEquals(resultado, { preco: PRECO_DUAS_TRILHAS, titulo: 'Duas trilhas: IA no Negócio + Vendas' })
})
```

- [ ] **Step 2: Rodar os testes e confirmar que falham**

Run: `deno test supabase/functions/criar-preferencia-pagamento/precos.test.ts`
Expected: FAIL — `./precos.ts` ainda não existe.

- [ ] **Step 3: Implementar `supabase/functions/criar-preferencia-pagamento/precos.ts`**

```typescript
export const PRECO_TRILHA_AVULSA = 99.0
export const PRECO_DUAS_TRILHAS = 186.0
export const PRECO_CURSO_COMPLETO = 350.0

export interface Trilha {
  id: string
  nome: string
}

export interface ResultadoPreco {
  preco: number
  titulo: string
}

export function calcularPreco(trilhaIdsSelecionados: string[], todasTrilhas: Trilha[]): ResultadoPreco | null {
  if (trilhaIdsSelecionados.length === 0) return null

  if (new Set(trilhaIdsSelecionados).size !== trilhaIdsSelecionados.length) return null

  const selecionadas = todasTrilhas.filter((t) => trilhaIdsSelecionados.includes(t.id))
  if (selecionadas.length !== trilhaIdsSelecionados.length) return null

  // A ordem importa: "exatamente 1 selecionada" e "exatamente 2" são
  // sempre avulsa/duas, mesmo se o total de trilhas existentes também for
  // 1 ou 2 no momento (ex.: banco de desenvolvimento com poucas trilhas
  // cadastradas) — "curso completo" só vira um branch distinto quando o
  // total de trilhas é 3 ou mais.
  if (selecionadas.length === 1) {
    return { preco: PRECO_TRILHA_AVULSA, titulo: `Trilha: ${selecionadas[0].nome}` }
  }
  if (selecionadas.length === 2) {
    return { preco: PRECO_DUAS_TRILHAS, titulo: `Duas trilhas: ${selecionadas.map((t) => t.nome).join(' + ')}` }
  }
  if (selecionadas.length === todasTrilhas.length) {
    return { preco: PRECO_CURSO_COMPLETO, titulo: 'Curso completo — acesso a todas as trilhas' }
  }
  return null
}
```

- [ ] **Step 4: Rodar os testes e confirmar que passam**

Run: `deno test supabase/functions/criar-preferencia-pagamento/precos.test.ts`
Expected: PASS — todos os 9 testes.

- [ ] **Step 5: Commit**

```bash
git add supabase/functions/criar-preferencia-pagamento/precos.ts supabase/functions/criar-preferencia-pagamento/precos.test.ts
git commit -m "feat: add multi-trilha price calculation module (TDD)"
```

- [ ] **Step 6: Substituir `supabase/functions/criar-preferencia-pagamento/index.ts` por inteiro**

```typescript
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { calcularPreco } from './precos.ts'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const MERCADOPAGO_ACCESS_TOKEN = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN')!

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

const SITE_URL = 'https://tocaonegocio.com.br'

const CABECALHOS_CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function respostaJson(corpo: unknown, status: number) {
  return new Response(JSON.stringify(corpo), {
    status,
    headers: { ...CABECALHOS_CORS, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CABECALHOS_CORS })
  }

  let corpo: { nome?: string; email?: string; trilhaIds?: unknown }
  try {
    corpo = await req.json()
  } catch {
    return respostaJson({ erro: 'corpo_invalido' }, 400)
  }

  const nome = corpo.nome?.trim()
  const email = corpo.email?.trim().toLowerCase()
  const trilhaIds = corpo.trilhaIds

  if (!nome || !email) {
    return respostaJson({ erro: 'dados_incompletos' }, 400)
  }

  if (!Array.isArray(trilhaIds) || !trilhaIds.every((id) => typeof id === 'string')) {
    return respostaJson({ erro: 'selecao_invalida' }, 400)
  }

  const { data: todasTrilhas, error: erroTrilhas } = await supabaseAdmin.from('trilhas').select('id, nome')

  if (erroTrilhas) {
    console.error('Falha ao buscar trilhas', { erro: erroTrilhas })
    return respostaJson({ erro: 'falha_interna' }, 500)
  }

  if (!todasTrilhas || todasTrilhas.length === 0) {
    return respostaJson({ erro: 'selecao_invalida' }, 400)
  }

  const resultado = calcularPreco(trilhaIds, todasTrilhas)

  if (!resultado) {
    return respostaJson({ erro: 'selecao_invalida' }, 400)
  }

  const referenciaExterna = crypto.randomUUID()

  const respostaMp = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      items: [
        {
          id: 'curso-toca-o-negocio',
          title: resultado.titulo,
          quantity: 1,
          unit_price: resultado.preco,
          currency_id: 'BRL',
        },
      ],
      payer: { name: nome, email },
      back_urls: {
        success: `${SITE_URL}/atividades/sucesso.html`,
        pending: `${SITE_URL}/atividades/pendente.html`,
        failure: `${SITE_URL}/atividades/falha.html`,
      },
      auto_return: 'approved',
      external_reference: referenciaExterna,
      metadata: { trilha_ids: trilhaIds },
    }),
  })

  if (!respostaMp.ok) {
    return respostaJson({ erro: 'falha_mercadopago' }, 502)
  }

  const preferencia = await respostaMp.json()

  if (!preferencia.init_point) {
    return respostaJson({ erro: 'falha_mercadopago' }, 502)
  }

  return respostaJson({ initPoint: preferencia.init_point }, 200)
})
```

Note que a validação de duplicados/ids-inexistentes/contagem agora mora inteiramente dentro de `calcularPreco` (Step 3) — `index.ts` só faz validação de forma (é array de strings?) antes de delegar.

- [ ] **Step 7: Implantar**

```bash
supabase functions deploy criar-preferencia-pagamento
```

- [ ] **Step 8: Buscar os ids reais das trilhas para testar**

```bash
supabase db query --linked "select id, nome from trilhas order by nome;"
```

Use os ids retornados nos testes abaixo. Se o banco tiver só 1 trilha cadastrada no momento deste teste, os casos de "2 trilhas" só podem ser testados pelo caminho de rejeição (Step 9, casos negativos) — registre isso no relatório em vez de simular.

- [ ] **Step 9: Testar**

Positivo — 1 trilha (substitua `<id-trilha-1>` por um id real):
```bash
curl -s -X POST "https://tldmtouhyiglqszwxdmc.supabase.co/functions/v1/criar-preferencia-pagamento" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste Avulsa","email":"teste.avulsa@exemplo.com","trilhaIds":["<id-trilha-1>"]}'
```
Expected: `200`, `{"initPoint":"https://..."}`.

Positivo — 2 trilhas (só se o banco tiver >= 2 trilhas; substitua pelos dois ids reais):
```bash
curl -s -X POST "https://tldmtouhyiglqszwxdmc.supabase.co/functions/v1/criar-preferencia-pagamento" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste Duas","email":"teste.duas@exemplo.com","trilhaIds":["<id-trilha-1>","<id-trilha-2>"]}'
```
Expected: `200`, `{"initPoint":"https://..."}`.

Positivo — curso completo (substitua pela lista de TODOS os ids reais atuais):
```bash
curl -s -X POST "https://tldmtouhyiglqszwxdmc.supabase.co/functions/v1/criar-preferencia-pagamento" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste Completo","email":"teste.completo@exemplo.com","trilhaIds":["<id-trilha-1>","<id-trilha-2>","..."]}'
```
Expected: `200`, `{"initPoint":"https://..."}`.

Negativos (todos devem retornar `400 {"erro":"selecao_invalida"}`, nunca `200`):
| `trilhaIds` enviado | Motivo |
|---|---|
| `[]` (array vazio) | nenhuma trilha selecionada |
| `["id-que-nao-existe"]` | id inválido |
| `["<id-trilha-1>","<id-trilha-1>"]` (mesmo id repetido) | duplicado |
| 3 ids reais distintos (só possível de testar se o banco já tiver >= 3 trilhas cadastradas; senão, pule este caso e registre a razão no relatório) | contagem sem preço definido |
| campo `trilhaIds` ausente do corpo | `undefined` não é array |

- [ ] **Step 10: Commit**

```bash
git add supabase/functions/criar-preferencia-pagamento/index.ts
git commit -m "feat: wire multi-trilha pricing into criar-preferencia-pagamento"
```

---

## Task 3: `webhook-mercadopago` — matricular só nas trilhas compradas

**Repositório:** `site-toca-o-negocio`

**Files:**
- Modify: `supabase/functions/webhook-mercadopago/index.ts` (reescrita completa do arquivo; `assinatura.ts`/`assinatura.test.ts` não mudam)

**Interfaces:**
- Consumes: `pagamento.metadata.trilha_ids` (Task 2, devolvido pela API do Mercado Pago ao consultar o pagamento); coluna `pagamentos.trilha_ids` (Task 1).
- Produces: matrícula escopada às trilhas compradas; estorno/chargeback escopado às trilhas daquele pagamento específico, não mais a todas as matrículas do aluno.

- [ ] **Step 1: Substituir `supabase/functions/webhook-mercadopago/index.ts` por inteiro**

```typescript
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { construirManifesto, extrairTsEV1, calcularHmac, compararComSeguranca } from './assinatura.ts'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const MERCADOPAGO_ACCESS_TOKEN = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN')!
const MERCADOPAGO_WEBHOOK_SECRET = Deno.env.get('MERCADOPAGO_WEBHOOK_SECRET')!

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

function mesesDepois(data: Date, meses: number): Date {
  const resultado = new Date(data)
  resultado.setMonth(resultado.getMonth() + meses)
  return resultado
}

async function localizarOuCriarPerfil(email: string, nome: string): Promise<{ id: string } | null> {
  const { data: perfilExistente, error: erroBuscaPerfil } = await supabaseAdmin
    .from('perfis')
    .select('id')
    .eq('email', email)
    .maybeSingle()

  if (erroBuscaPerfil) {
    console.error('Falha ao buscar perfil existente', { email, erro: erroBuscaPerfil })
  }

  if (perfilExistente) return perfilExistente

  const respostaConvite = await fetch(`${SUPABASE_URL}/auth/v1/invite`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, data: { nome } }),
  })

  if (!respostaConvite.ok) {
    console.error('Falha ao convidar novo aluno', await respostaConvite.text())
    return null
  }

  const { data: perfilNovo, error: erroBuscaPerfilNovo } = await supabaseAdmin
    .from('perfis')
    .select('id')
    .eq('email', email)
    .maybeSingle()

  if (erroBuscaPerfilNovo) {
    console.error('Falha ao buscar perfil recem-convidado', { email, erro: erroBuscaPerfilNovo })
  }

  return perfilNovo
}

async function matricularEmTrilhas(alunoId: string, trilhaIds: string[]): Promise<void> {
  const expiracao = mesesDepois(new Date(), 12).toISOString()

  for (const trilhaId of trilhaIds) {
    const { error: erroMatricula } = await supabaseAdmin.from('matriculas').upsert(
      {
        aluno_id: alunoId,
        trilha_id: trilhaId,
        status: 'ativa',
        data_expiracao: expiracao,
      },
      { onConflict: 'aluno_id,trilha_id' }
    )

    if (erroMatricula) {
      console.error('Falha ao matricular aluno em trilha', { alunoId, trilhaId, erro: erroMatricula })
    }
  }
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('method not allowed', { status: 405 })
  }

  const headerXSignature = req.headers.get('x-signature') ?? ''
  const headerXRequestId = req.headers.get('x-request-id') ?? ''
  const assinatura = extrairTsEV1(headerXSignature)

  if (!assinatura || !headerXRequestId) {
    return new Response('assinatura ausente ou incompleta', { status: 401 })
  }

  const corpoTexto = await req.text()
  let corpo: { data?: { id?: string } }
  try {
    corpo = JSON.parse(corpoTexto)
  } catch {
    return new Response('corpo invalido', { status: 400 })
  }

  const dataId = corpo.data?.id
  if (!dataId) {
    return new Response('sem data.id', { status: 400 })
  }

  const manifesto = construirManifesto(dataId, headerXRequestId, assinatura.ts)
  const hmacCalculado = await calcularHmac(manifesto, MERCADOPAGO_WEBHOOK_SECRET)

  if (!compararComSeguranca(hmacCalculado, assinatura.v1)) {
    return new Response('assinatura invalida', { status: 401 })
  }

  // A partir daqui, o aviso está autenticado. Ainda assim, busca os dados
  // reais do pagamento na API do Mercado Pago — nunca age só com base no
  // conteúdo do aviso em si.
  const respostaPagamento = await fetch(`https://api.mercadopago.com/v1/payments/${dataId}`, {
    headers: { Authorization: `Bearer ${MERCADOPAGO_ACCESS_TOKEN}` },
  })

  if (!respostaPagamento.ok) {
    return new Response('falha ao consultar pagamento', { status: 502 })
  }

  const pagamento = await respostaPagamento.json()
  const status = pagamento.status as string
  const email = (pagamento.payer?.email as string | undefined)?.toLowerCase()
  const valor = pagamento.transaction_amount as number

  if (status === 'approved') {
    if (!email) {
      return new Response('pagamento aprovado sem e-mail', { status: 400 })
    }

    const trilhaIds = pagamento.metadata?.trilha_ids as string[] | undefined

    if (!Array.isArray(trilhaIds) || trilhaIds.length === 0) {
      console.error('Pagamento aprovado sem trilha_ids nos metadados', { dataId })
      return new Response('pagamento sem selecao de trilhas', { status: 200 })
    }

    const { data: pagamentoExistente, error: erroBuscaPagamento } = await supabaseAdmin
      .from('pagamentos')
      .select('id')
      .eq('mercadopago_payment_id', dataId)
      .maybeSingle()

    if (erroBuscaPagamento) {
      console.error('Falha ao verificar idempotencia do pagamento', { dataId, erro: erroBuscaPagamento })
    }

    if (pagamentoExistente) {
      return new Response('ja processado', { status: 200 })
    }

    const nome =
      pagamento.payer?.first_name && pagamento.payer?.last_name
        ? `${pagamento.payer.first_name} ${pagamento.payer.last_name}`
        : email

    const perfil = await localizarOuCriarPerfil(email, nome)
    if (!perfil) {
      return new Response('falha ao localizar ou criar conta', { status: 502 })
    }

    await matricularEmTrilhas(perfil.id, trilhaIds)

    const { error: erroInsertPagamento } = await supabaseAdmin.from('pagamentos').insert({
      mercadopago_payment_id: dataId,
      email,
      aluno_id: perfil.id,
      valor,
      status: 'aprovado',
      trilha_ids: trilhaIds,
    })

    if (erroInsertPagamento) {
      console.error('Falha ao registrar pagamento aprovado', {
        dataId,
        alunoId: perfil.id,
        erro: erroInsertPagamento,
      })
    }

    return new Response('ok', { status: 200 })
  }

  if (status === 'refunded' || status === 'charged_back') {
    const { data: pagamentoOriginal, error: erroBuscaPagamentoOriginal } = await supabaseAdmin
      .from('pagamentos')
      .select('aluno_id, trilha_ids')
      .eq('mercadopago_payment_id', dataId)
      .maybeSingle()

    if (erroBuscaPagamentoOriginal) {
      console.error('Falha ao buscar pagamento original para estorno/chargeback', {
        dataId,
        erro: erroBuscaPagamentoOriginal,
      })
    }

    if (pagamentoOriginal?.aluno_id) {
      const trilhaIdsEstornados = pagamentoOriginal.trilha_ids ?? []

      const { error: erroCancelarMatriculas } = await supabaseAdmin
        .from('matriculas')
        .update({ status: 'cancelada' })
        .eq('aluno_id', pagamentoOriginal.aluno_id)
        .in('trilha_id', trilhaIdsEstornados)

      if (erroCancelarMatriculas) {
        console.error('Falha ao cancelar matriculas do aluno', {
          dataId,
          alunoId: pagamentoOriginal.aluno_id,
          erro: erroCancelarMatriculas,
        })
      }

      const { error: erroAtualizarPagamento } = await supabaseAdmin
        .from('pagamentos')
        .update({ status: status === 'refunded' ? 'estornado' : 'chargeback' })
        .eq('mercadopago_payment_id', dataId)

      if (erroAtualizarPagamento) {
        console.error('Falha ao atualizar status do pagamento estornado/chargeback', {
          dataId,
          alunoId: pagamentoOriginal.aluno_id,
          erro: erroAtualizarPagamento,
        })
      }
    }

    return new Response('ok', { status: 200 })
  }

  return new Response('status ignorado', { status: 200 })
})
```

- [ ] **Step 2: Implantar**

```bash
supabase functions deploy webhook-mercadopago
```

- [ ] **Step 3: Testar o caminho de assinatura inválida (não deve mudar de comportamento)**

```bash
curl -s -X POST "https://tldmtouhyiglqszwxdmc.supabase.co/functions/v1/webhook-mercadopago" \
  -H "Content-Type: application/json" \
  -H "x-signature: ts=1700000000,v1=0000000000000000000000000000000000000000000000000000000000000000" \
  -H "x-request-id: teste-regressao" \
  -d '{"data":{"id":"123"}}'
```
Expected: `401`.

Teste completo (assinatura válida, pagamento real de ponta a ponta) fica para a Task 4, depois que a tela de compra conseguir gerar seleções de trilha reais.

- [ ] **Step 4: Commit**

```bash
git add supabase/functions/webhook-mercadopago/index.ts
git commit -m "feat: enroll only in purchased trilhas, scope refund cancellation to the specific payment"
```

---

## Task 4: Tela de compra — seleção de plano e trilhas

**Repositório:** `site-toca-o-negocio`

**Files:**
- Modify: `atividades/comprar.html`
- Modify: `atividades/js/comprar.js`
- Modify: `css/estilo.css`

**Interfaces:**
- Consumes: `criar-preferencia-pagamento` (Task 2), contrato `{ nome, email, trilhaIds } → { initPoint } | { erro }`; tabela `trilhas` (`id`, `nome`), lida diretamente pelo cliente via a política pública já existente ("qualquer um le trilhas"), mesmo padrão já usado em `painel.js`.

- [ ] **Step 1: Substituir o `<main>` de `atividades/comprar.html`**

Troque o conteúdo de `<main>...</main>` (mantendo cabeçalho, `<head>` e rodapé exatamente como estão) por:

```html
  <main>
    <section class="secao container">
      <h1>Matricule-se no curso</h1>
      <p>Escolha como você quer começar.</p>

      <div class="planos-grade" id="planos-grade">
        <button type="button" class="plano-card" data-plano="avulsa">
          <h3>Trilha avulsa</h3>
          <p class="plano-preco">R$ 99,00</p>
          <p class="plano-descricao">Escolha 1 trilha</p>
        </button>
        <button type="button" class="plano-card" data-plano="duas">
          <h3>Duas trilhas</h3>
          <p class="plano-preco">R$ 186,00</p>
          <p class="plano-descricao">Escolha 2 trilhas</p>
        </button>
        <button type="button" class="plano-card plano-destaque" data-plano="completo">
          <p class="plano-selo">Economize R$ 46</p>
          <h3>Curso completo</h3>
          <p class="plano-preco">R$ 350,00</p>
          <p class="plano-descricao">Acesso às 4 trilhas</p>
        </button>
      </div>

      <div id="selecao-trilhas" hidden>
        <p id="instrucao-trilhas"></p>
        <ul class="lista-trilhas-selecao" id="lista-trilhas"></ul>
      </div>

      <form class="formulario" id="form-comprar" hidden>
        <p class="erro-formulario" id="erro" role="alert" hidden></p>
        <div class="campo">
          <label for="nome">Nome completo</label>
          <input type="text" id="nome" name="nome" required autocomplete="name">
        </div>
        <div class="campo">
          <label for="email">E-mail</label>
          <input type="email" id="email" name="email" required autocomplete="email">
        </div>
        <button class="botao" type="submit" id="botao-comprar" disabled>Comprar</button>
      </form>
    </section>
  </main>
```

- [ ] **Step 2: Substituir `atividades/js/comprar.js` por inteiro**

```javascript
import { supabase } from './supabase-client.js';

const PLANOS = {
  avulsa: { quantidade: 1, rotulo: 'Escolha 1 trilha:' },
  duas: { quantidade: 2, rotulo: 'Escolha 2 trilhas:' },
  completo: { quantidade: null, rotulo: null },
};

const planosGrade = document.getElementById('planos-grade');
const selecaoTrilhas = document.getElementById('selecao-trilhas');
const instrucaoTrilhas = document.getElementById('instrucao-trilhas');
const listaTrilhas = document.getElementById('lista-trilhas');
const form = document.getElementById('form-comprar');
const erro = document.getElementById('erro');
const botao = document.getElementById('botao-comprar');

let trilhas = [];
let planoSelecionado = null;
let trilhaIdsSelecionadas = [];

const { data: trilhasCarregadas, error: erroTrilhas } = await supabase.from('trilhas').select('id, nome');

if (erroTrilhas) {
  console.error('Falha ao buscar trilhas', erroTrilhas);
} else if (trilhasCarregadas) {
  trilhas = trilhasCarregadas;
}

function atualizarBotaoComprar() {
  if (!planoSelecionado) {
    botao.disabled = true;
    return;
  }
  if (planoSelecionado === 'completo') {
    botao.disabled = trilhas.length === 0;
    return;
  }
  const quantidade = PLANOS[planoSelecionado].quantidade;
  botao.disabled = trilhaIdsSelecionadas.length !== quantidade;
}

function renderizarSelecaoTrilhas() {
  listaTrilhas.innerHTML = '';

  if (planoSelecionado === 'completo') {
    selecaoTrilhas.hidden = true;
    trilhaIdsSelecionadas = trilhas.map((t) => t.id);
    return;
  }

  const quantidade = PLANOS[planoSelecionado].quantidade;
  instrucaoTrilhas.textContent = PLANOS[planoSelecionado].rotulo;
  selecaoTrilhas.hidden = false;
  trilhaIdsSelecionadas = [];

  for (const trilha of trilhas) {
    const item = document.createElement('li');
    const label = document.createElement('label');
    const input = document.createElement('input');
    input.type = quantidade === 1 ? 'radio' : 'checkbox';
    input.name = 'trilha';
    input.value = trilha.id;
    input.addEventListener('change', () => {
      if (quantidade === 1) {
        trilhaIdsSelecionadas = input.checked ? [trilha.id] : [];
      } else {
        const marcadas = Array.from(listaTrilhas.querySelectorAll('input:checked'));
        if (marcadas.length > quantidade) {
          input.checked = false;
        } else {
          trilhaIdsSelecionadas = marcadas.map((el) => el.value);
        }
      }
      atualizarBotaoComprar();
    });
    label.appendChild(input);
    label.appendChild(document.createTextNode(trilha.nome));
    item.appendChild(label);
    listaTrilhas.appendChild(item);
  }
}

planosGrade.addEventListener('click', (evento) => {
  const cartao = evento.target.closest('.plano-card');
  if (!cartao) return;

  for (const outro of planosGrade.querySelectorAll('.plano-card')) {
    outro.classList.remove('selecionado');
  }
  cartao.classList.add('selecionado');

  planoSelecionado = cartao.dataset.plano;
  form.hidden = false;
  renderizarSelecaoTrilhas();
  atualizarBotaoComprar();
});

form.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  erro.hidden = true;
  botao.disabled = true;
  botao.textContent = 'Aguarde...';

  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();

  try {
    const { data, error } = await supabase.functions.invoke('criar-preferencia-pagamento', {
      body: { nome, email, trilhaIds: trilhaIdsSelecionadas },
    });

    if (error || !data || !data.initPoint) {
      throw new Error('falha ao criar pagamento');
    }

    window.location.href = data.initPoint;
  } catch {
    erro.textContent = 'Não foi possível iniciar o pagamento agora. Tente novamente em instantes.';
    erro.hidden = false;
    botao.disabled = false;
    botao.textContent = 'Comprar';
  }
});
```

- [ ] **Step 3: Adicionar as classes novas em `css/estilo.css`**

Adicione ao final do arquivo:

```css
/* ---- Planos de compra ---- */
.planos-grade {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin: 24px 0;
}

@media (min-width: 640px) {
  .planos-grade { grid-template-columns: repeat(3, 1fr); }
}

.plano-card {
  display: block;
  width: 100%;
  text-align: left;
  background: #FFFFFF;
  border: 2px solid var(--borda);
  border-radius: 8px;
  padding: 20px;
  font-family: var(--fonte-base);
  cursor: pointer;
}

.plano-card h3 {
  margin: 0 0 8px 0;
  color: var(--verde);
  font-family: var(--fonte-display);
  font-size: 20px;
}

.plano-preco {
  font-size: 24px;
  font-weight: 700;
  color: var(--tinta);
  margin: 0 0 4px 0;
}

.plano-descricao {
  color: var(--neutro);
  margin: 0;
  font-size: 14px;
}

.plano-card.selecionado {
  border-color: var(--verde);
}

.plano-destaque {
  border-color: var(--verde);
}

.plano-selo {
  display: inline-block;
  background: var(--verde);
  color: var(--papel);
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 4px;
  margin: 0 0 8px 0;
}

.lista-trilhas-selecao {
  list-style: none;
  padding: 0;
  margin: 16px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.lista-trilhas-selecao label {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border: 1px solid var(--borda);
  border-radius: 6px;
  cursor: pointer;
}

.botao:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

- [ ] **Step 4: Verificar manualmente**

Sirva o repositório localmente (`python -m http.server 8080` a partir da raiz do worktree), abra `atividades/comprar.html`:
- Confirme que os 3 cartões aparecem, com o "Curso completo" destacado.
- Clique em "Trilha avulsa" — confirme que aparecem rádios com o nome de cada trilha, e que o botão "Comprar" só habilita depois de marcar uma.
- Clique em "Duas trilhas" — confirme que aparecem checkboxes, que marcar uma terceira não é permitido (a marcação anterior mais recente é desfeita), e que o botão só habilita com exatamente 2 marcadas.
- Clique em "Curso completo" — confirme que a lista de seleção de trilhas fica escondida e o botão já habilita direto.
- Preencha nome/e-mail e confirme que o clique em "Comprar" redireciona para uma URL do Mercado Pago (com o plano escolhido).
- Redimensione para mobile (360px) e confirme que os 3 cartões empilham verticalmente e continuam legíveis.

- [ ] **Step 5: Commit**

```bash
git add atividades/comprar.html atividades/js/comprar.js css/estilo.css
git commit -m "feat: let buyers choose trilha avulsa, duas trilhas or curso completo on comprar.html"
```

---

## Task 5: Verificação de ponta a ponta (manual)

**Repositório:** `site-toca-o-negocio`, verificação apenas — sem alterações de código.

Antes de começar, confira quantas trilhas existem hoje (`supabase db query --linked "select id, nome from trilhas;"`). Os passos abaixo assumem pelo menos 2 trilhas cadastradas para testar "Duas trilhas" e um "Curso completo" com mais de 1 trilha; se o banco só tiver 1 trilha no momento deste teste, pule os passos que dependem de 2+ trilhas e registre isso no resultado — não é um bloqueio, é reflexo do estado atual do conteúdo (trilhas 2-4 ainda não foram criadas).

- [ ] **Step 1: Fluxo feliz — trilha avulsa**

Compre 1 trilha com um e-mail novo, cartão de teste aprovado. Confirme: `sucesso.html`, e-mail de definir senha chega, e depois de logar o painel mostra matrícula ativa **só** naquela trilha (nenhuma outra).

- [ ] **Step 2: Fluxo feliz — duas trilhas** (se houver >= 2 trilhas cadastradas)

Compre 2 trilhas com outro e-mail novo. Confirme matrícula ativa nas 2 trilhas escolhidas, e em nenhuma outra.

- [ ] **Step 3: Fluxo feliz — curso completo**

Compre o curso completo com outro e-mail novo. Confirme matrícula ativa em todas as trilhas existentes no momento do teste.

- [ ] **Step 4: Preço e seleção não são manipuláveis**

Chame `criar-preferencia-pagamento` diretamente com uma seleção inválida (3 trilhas, ids inexistentes, array vazio) — confirme `400` em todos os casos, nunca `200`.

- [ ] **Step 5: Não duplica**

Force o mesmo aviso de pagamento a ser processado de novo (reenvio pelo painel do Mercado Pago, ou chamando a função manualmente com o mesmo `data.id` e assinatura válida). Confirme que `pagamentos` continua com 1 linha só, sem matrícula ou e-mail duplicado.

- [ ] **Step 6: Assinatura inválida é rejeitada**

Chame `webhook-mercadopago` diretamente com um `x-signature` incorreto. Confirme `401` e nenhuma linha nova em `pagamentos`/`matriculas`.

- [ ] **Step 7: Estorno cancela só as trilhas daquele pagamento**

Se houver uma forma de simular estorno no ambiente de teste do Mercado Pago: compre uma trilha avulsa, depois compre outra trilha avulsa diferente com o mesmo e-mail (2 pagamentos, 2 trilhas). Estorne só o primeiro pagamento. Confirme que só a matrícula da trilha do primeiro pagamento vira `cancelada` — a matrícula da segunda trilha continua `ativa`. Se o ambiente de teste do Mercado Pago não permitir simular estorno facilmente, valide por leitura de código (a query usa `.in('trilha_id', trilhaIdsEstornados)`, escopada à coluna nova) e registre que não foi testado ao vivo.

- [ ] **Step 8: Compra com e-mail que já tem conta**

Repita uma compra usando o e-mail de um aluno já existente. Confirme que nenhuma conta nova é criada (mesmo `auth.users.id`), e que a nova trilha é adicionada às matrículas já existentes dessa conta.

- [ ] **Step 9: Segredos nunca expostos**

Confirme (código-fonte de `comprar.html`/`comprar.js` e painel de rede do navegador) que `MERCADOPAGO_ACCESS_TOKEN` e `MERCADOPAGO_WEBHOOK_SECRET` não aparecem em nenhum lugar visível ao navegador.

- [ ] **Step 10: Regressão**

Navegue pelo painel, pela aula com vídeo, pela atividade interativa — confirme que nada quebrou.

- [ ] **Step 11: Registrar o resultado**

Se todos os passos aplicáveis passarem, este incremento está pronto — nenhum commit de código neste passo.
