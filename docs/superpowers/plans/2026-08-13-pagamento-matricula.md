# Pagamento e matrícula — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. **Task 1 is manual and must be completed by the human (Gregory) before any subagent is dispatched — it cannot be automated (creating a payment-processor account, generating credentials). Do not attempt to dispatch a subagent for Task 1.**

**Goal:** A visitor can buy the course at `atividades/comprar.html`, pay via Mercado Pago (Pix, boleto, or card), and automatically get an account plus active matrículas — with zero manual intervention from Gregory.

**Architecture:** Two new Supabase Edge Functions, same pattern already proven in the video-watermark phase — no server of our own, secrets held as Supabase Edge Function secrets. `criar-preferencia-pagamento` starts a Mercado Pago Checkout Pro session; `webhook-mercadopago` receives Mercado Pago's server-to-server payment notification, verifies its HMAC signature, re-confirms the payment against Mercado Pago's own API (never trusts the notification body alone), and only then creates the account and matrículas.

**Tech Stack:** Supabase Edge Functions (Deno, TypeScript, `Deno.test` for the signature-verification module), Mercado Pago Checkout Pro + Payments API, same static HTML/CSS/JS-no-build-step front-end as the rest of `/atividades/`.

## Global Constraints

- No framework, no build step, in the front-end pages — matches the rest of `/atividades/`.
- No automated test suite for the front-end pages (static site, no build step — established pattern). The webhook's signature-verification logic gets `Deno.test` coverage (new pattern for this repo, justified by its security sensitivity) — everything else in this plan follows the existing "verify manually" pattern.
- Mercado Pago's Access Token and webhook secret must never appear in any file served to the browser — only as Supabase Edge Function secrets (`supabase secrets set`), never committed to git.
- Payment confirmation happens **only** via the webhook, server to server. No page fed by the browser's redirect back from Mercado Pago (`sucesso.html`, `pendente.html`, `falha.html`) may create or modify a `matriculas` row.
- Every write to `matriculas`/`pagamentos` from the webhook must be idempotent — Mercado Pago can resend the same notification more than once.
- `comprar.html` is not linked from any public page in this phase — Gregório decides when to publish the link, after finalizing pricing and confirming all four trilhas are ready.
- The course price is a single named constant in `criar-preferencia-pagamento`'s source — a provisional test value (R$ 1,00) for now, to be updated by Gregory before the course actually goes on sale.

---

## Task 1 (MANUAL — Gregory, not a subagent): Configurar a conta Mercado Pago

**This task cannot be done by an agent.** It requires creating/using an account tied to your CNPJ and generating credentials through a web dashboard. Complete it before Task 3 begins; hand the two values you collect to whoever (human or agent) runs Task 3 and Task 5.

- [ ] **Step 1: Criar/confirmar a conta no Mercado Pago** em https://www.mercadopago.com.br, associada ao CNPJ da AUREA EDUCACIONAL LTDA.

- [ ] **Step 2: Criar uma aplicação de teste.** No painel de desenvolvedores (https://www.mercadopago.com.br/developers/panel), crie uma aplicação (qualquer nome, ex. "Toca o Negócio — Curso"). Dentro dela, vá em **Credenciais de teste** e copie o **Access Token de teste** (começa com `TEST-`). Esse token é o que a implementação vai usar — ninguém paga de verdade com ele, o Mercado Pago simula a aprovação/recusa com cartões de teste específicos.

- [ ] **Step 3: Configurar o webhook.** Ainda dentro da aplicação, procure **Webhooks** (ou "Notificações"). Adicione uma URL de notificação:
  ```
  https://tldmtouhyiglqszwxdmc.supabase.co/functions/v1/webhook-mercadopago
  ```
  Selecione o evento **"Pagamentos"**. Essa URL ainda não existe (a função só vai ser publicada na Task 5) — tudo bem cadastrar antes, o Mercado Pago só vai começar a chamar de verdade depois que a função estiver no ar. Depois de salvar, copie a **Chave secreta** (webhook secret) que aparece.

- [ ] **Step 4: Reunir os dois valores** para as próximas tasks:
  - `MERCADOPAGO_ACCESS_TOKEN` (Step 2, o de teste)
  - `MERCADOPAGO_WEBHOOK_SECRET` (Step 3)

---

## Task 2: Migração — tabela `pagamentos` e `perfis.email`

**Repositório:** `site-toca-o-negocio`

**Files:**
- Create: `supabase/migrations/0006_pagamentos_e_perfis_email.sql`

**Interfaces:**
- Produces: coluna `perfis.email text` (populada automaticamente por todo novo cadastro, com backfill para contas já existentes); tabela `pagamentos` com `mercadopago_payment_id` único (chave de idempotência). Tasks 5 e 7 dependem dessa migração.

- [ ] **Step 1: Escrever a migração**

```sql
-- supabase/migrations/0006_pagamentos_e_perfis_email.sql

alter table perfis add column email text;

update perfis
set email = (select u.email from auth.users u where u.id = perfis.id)
where email is null;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.perfis (id, nome, telefone, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'nome', new.email), new.raw_user_meta_data->>'telefone', new.email);
  return new;
end;
$$;

create table pagamentos (
  id uuid primary key default gen_random_uuid(),
  mercadopago_payment_id text unique not null,
  email text not null,
  aluno_id uuid references auth.users(id),
  valor numeric not null,
  status text not null check (status in ('aprovado', 'estornado', 'chargeback')),
  criado_em timestamptz not null default now()
);

alter table pagamentos enable row level security;

create policy "aluno le proprio pagamento" on pagamentos
  for select using (auth.uid() = aluno_id);
```

`perfis.email` existe fora do padrão `auth.users` (que não é acessível via API REST normal) especificamente para permitir localizar "essa pessoa já tem conta?" a partir do e-mail do pagamento, usando o mesmo tipo de consulta já usado em todo o resto do projeto — sem depender de endpoints administrativos do Supabase que têm comportamento inconsistente para busca por e-mail.

- [ ] **Step 2: Aplicar a migração**

```bash
supabase db push
```

- [ ] **Step 3: Verificar**

```bash
supabase db query --linked "select column_name from information_schema.columns where table_name = 'perfis' and column_name = 'email';"
```

Expected: 1 linha, `email`.

```bash
supabase db query --linked "select nome, email from perfis limit 5;"
```

Expected: toda linha existente já tem `email` preenchido (backfill funcionou).

```bash
supabase db query --linked "select tablename, rowsecurity from pg_tables where tablename = 'pagamentos';"
```

Expected: 1 linha, `rowsecurity = t`.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/0006_pagamentos_e_perfis_email.sql
git commit -m "feat: add pagamentos table and perfis.email for payment-driven enrollment"
```

---

## Task 3: Edge Function `criar-preferencia-pagamento`

**Repositório:** `site-toca-o-negocio`

**Files:**
- Create: `supabase/functions/criar-preferencia-pagamento/index.ts`

**Interfaces:**
- Consumes: `MERCADOPAGO_ACCESS_TOKEN` (Task 1, como segredo).
- Produces: endpoint `criar-preferencia-pagamento` que recebe `{ nome, email }` e devolve `{ initPoint }` (URL de checkout do Mercado Pago) em sucesso, ou `{ erro }` com status apropriado. Task 6 consome esse contrato.

- [ ] **Step 1: Criar a função**

```bash
supabase functions new criar-preferencia-pagamento
```

- [ ] **Step 2: Escrever `supabase/functions/criar-preferencia-pagamento/index.ts`**

```typescript
const MERCADOPAGO_ACCESS_TOKEN = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN')!

// Preço provisório para desenvolvimento/teste. Gregory atualiza este valor
// antes de divulgar publicamente o link de comprar.html.
const PRECO_CURSO_COMPLETO = 1.0

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

  let corpo: { nome?: string; email?: string }
  try {
    corpo = await req.json()
  } catch {
    return respostaJson({ erro: 'corpo_invalido' }, 400)
  }

  const nome = corpo.nome?.trim()
  const email = corpo.email?.trim().toLowerCase()

  if (!nome || !email) {
    return respostaJson({ erro: 'dados_incompletos' }, 400)
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
          title: 'Curso Toca o Negócio — acesso completo',
          quantity: 1,
          unit_price: PRECO_CURSO_COMPLETO,
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

- [ ] **Step 3: Configurar o segredo**

```bash
supabase secrets set MERCADOPAGO_ACCESS_TOKEN="<valor de teste da Task 1>"
```

- [ ] **Step 4: Ajustar `supabase/config.toml`**

Esta função **não** exige sessão de aluno — é chamada por um visitante sem login, na tela de compra. Adicione (ou confirme, se `supabase functions new` já criou algo similar):

```toml
[functions.criar-preferencia-pagamento]
enabled = true
verify_jwt = false
entrypoint = "./functions/criar-preferencia-pagamento/index.ts"
```

`verify_jwt = false` aqui é intencional e correto — ao contrário da função de vídeo da fase anterior (onde `false` foi um erro, já que ali sempre existe uma sessão de aluno), aqui não existe sessão nenhuma: é a tela pública de compra, antes de qualquer login.

- [ ] **Step 5: Implantar e testar**

```bash
supabase functions deploy criar-preferencia-pagamento
```

```bash
curl -s -X POST "https://tldmtouhyiglqszwxdmc.supabase.co/functions/v1/criar-preferencia-pagamento" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste da Silva","email":"teste@exemplo.com"}'
```

Expected: `200`, corpo `{"initPoint":"https://www.mercadopago.com.br/checkout/v1/redirect?..."}` (ou domínio equivalente do Mercado Pago). Abra essa URL num navegador — deve mostrar uma tela de pagamento de teste do Mercado Pago com o item "Curso Toca o Negócio — acesso completo", R$ 1,00.

- [ ] **Step 6: Commit**

```bash
git add supabase/functions/criar-preferencia-pagamento/index.ts supabase/config.toml
git commit -m "feat: add criar-preferencia-pagamento Edge Function for Mercado Pago checkout"
```

---

## Task 4: Módulo de verificação de assinatura do webhook (TDD)

**Repositório:** `site-toca-o-negocio`

**Files:**
- Create: `supabase/functions/webhook-mercadopago/assinatura.ts`
- Test: `supabase/functions/webhook-mercadopago/assinatura.test.ts`

**Interfaces:**
- Produces: `construirManifesto(dataId: string, requestId: string, ts: string): string`; `extrairTsEV1(headerXSignature: string): { ts: string; v1: string } | null`; `calcularHmac(manifesto: string, segredo: string): Promise<string>` (retorna hex minúsculo); `compararComSeguranca(a: string, b: string): boolean` (comparação em tempo constante). Task 5 consome as quatro.

Separado da função principal (`index.ts`, Task 5) de propósito: `Deno.serve(...)` inicia um servidor assim que o arquivo é importado, o que atrapalharia os testes se a lógica pura estivesse no mesmo arquivo — este módulo nunca importa nem chama `Deno.serve`.

- [ ] **Step 1: Escrever os testes (falhando)**

Criar `supabase/functions/webhook-mercadopago/assinatura.test.ts`:

```typescript
import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts'
import { construirManifesto, extrairTsEV1, calcularHmac, compararComSeguranca } from './assinatura.ts'

Deno.test('construirManifesto monta a string no formato exigido pelo Mercado Pago', () => {
  const manifesto = construirManifesto('123456789', 'req-abc-123', '1700000000')
  assertEquals(manifesto, 'id:123456789;request-id:req-abc-123;ts:1700000000;')
})

Deno.test('extrairTsEV1 separa ts e v1 do cabecalho x-signature', () => {
  const resultado = extrairTsEV1('ts=1700000000,v1=abcdef1234567890')
  assertEquals(resultado, { ts: '1700000000', v1: 'abcdef1234567890' })
})

Deno.test('extrairTsEV1 lida com espaco depois da virgula', () => {
  const resultado = extrairTsEV1('ts=1700000000, v1=abcdef1234567890')
  assertEquals(resultado, { ts: '1700000000', v1: 'abcdef1234567890' })
})

Deno.test('extrairTsEV1 retorna null quando falta o v1', () => {
  const resultado = extrairTsEV1('ts=1700000000')
  assertEquals(resultado, null)
})

Deno.test('extrairTsEV1 retorna null quando falta o ts', () => {
  const resultado = extrairTsEV1('v1=abcdef1234567890')
  assertEquals(resultado, null)
})

Deno.test('extrairTsEV1 retorna null para cabecalho vazio', () => {
  const resultado = extrairTsEV1('')
  assertEquals(resultado, null)
})

Deno.test('calcularHmac produz hex minusculo e e deterministico', async () => {
  const hash1 = await calcularHmac('id:1;request-id:r;ts:1;', 'segredo-de-teste')
  const hash2 = await calcularHmac('id:1;request-id:r;ts:1;', 'segredo-de-teste')
  assertEquals(hash1, hash2)
  assertEquals(/^[0-9a-f]+$/.test(hash1), true)
})

Deno.test('calcularHmac produz hashes diferentes para segredos diferentes', async () => {
  const hash1 = await calcularHmac('id:1;request-id:r;ts:1;', 'segredo-a')
  const hash2 = await calcularHmac('id:1;request-id:r;ts:1;', 'segredo-b')
  assertEquals(hash1 === hash2, false)
})

Deno.test('compararComSeguranca retorna true para strings identicas', () => {
  assertEquals(compararComSeguranca('abc123', 'abc123'), true)
})

Deno.test('compararComSeguranca retorna false para strings diferentes de mesmo tamanho', () => {
  assertEquals(compararComSeguranca('abc123', 'abc124'), false)
})

Deno.test('compararComSeguranca retorna false para strings de tamanhos diferentes', () => {
  assertEquals(compararComSeguranca('abc', 'abcdef'), false)
})
```

- [ ] **Step 2: Rodar os testes e confirmar que falham**

Run: `deno test supabase/functions/webhook-mercadopago/assinatura.test.ts`
Expected: FAIL — `Module not found` ou similar (`./assinatura.ts` ainda não existe).

- [ ] **Step 3: Implementar `supabase/functions/webhook-mercadopago/assinatura.ts`**

```typescript
export function construirManifesto(dataId: string, requestId: string, ts: string): string {
  return `id:${dataId};request-id:${requestId};ts:${ts};`
}

export function extrairTsEV1(headerXSignature: string): { ts: string; v1: string } | null {
  if (!headerXSignature) return null
  const partes: Record<string, string> = {}
  for (const par of headerXSignature.split(',')) {
    const [chave, valor] = par.split('=')
    if (chave && valor !== undefined) {
      partes[chave.trim()] = valor.trim()
    }
  }
  if (!partes.ts || !partes.v1) return null
  return { ts: partes.ts, v1: partes.v1 }
}

export async function calcularHmac(manifesto: string, segredo: string): Promise<string> {
  const encoder = new TextEncoder()
  const chave = await crypto.subtle.importKey(
    'raw',
    encoder.encode(segredo),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const assinatura = await crypto.subtle.sign('HMAC', chave, encoder.encode(manifesto))
  return Array.from(new Uint8Array(assinatura))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

export function compararComSeguranca(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diferenca = 0
  for (let i = 0; i < a.length; i++) {
    diferenca |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return diferenca === 0
}
```

- [ ] **Step 4: Rodar os testes e confirmar que passam**

Run: `deno test supabase/functions/webhook-mercadopago/assinatura.test.ts`
Expected: PASS — todos os 10 testes.

- [ ] **Step 5: Commit**

```bash
git add supabase/functions/webhook-mercadopago/assinatura.ts supabase/functions/webhook-mercadopago/assinatura.test.ts
git commit -m "feat: add Mercado Pago webhook signature verification module (TDD)"
```

---

## Task 5: Edge Function `webhook-mercadopago`

**Repositório:** `site-toca-o-negocio`

**Files:**
- Create: `supabase/functions/webhook-mercadopago/index.ts`

**Interfaces:**
- Consumes: `construirManifesto`, `extrairTsEV1`, `calcularHmac`, `compararComSeguranca` (Task 4); `MERCADOPAGO_ACCESS_TOKEN` (Task 1, já configurado na Task 3); `MERCADOPAGO_WEBHOOK_SECRET` (Task 1, novo segredo); `pagamentos`/`perfis.email` (Task 2). `SUPABASE_SERVICE_ROLE_KEY` já está disponível automaticamente em toda Edge Function (confirmado em uso na Fase 3) — não precisa ser configurado.

- [ ] **Step 1: Criar a função**

```bash
supabase functions new webhook-mercadopago
```

Isso cria um `index.ts` de exemplo — substitua todo o conteúdo pelo código abaixo. Os arquivos `assinatura.ts`/`assinatura.test.ts` da Task 4 já estão nessa mesma pasta (`supabase/functions/webhook-mercadopago/`) — não são afetados por este comando.

- [ ] **Step 2: Escrever `supabase/functions/webhook-mercadopago/index.ts`**

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
  const { data: perfilExistente } = await supabaseAdmin
    .from('perfis')
    .select('id')
    .eq('email', email)
    .maybeSingle()

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

  const { data: perfilNovo } = await supabaseAdmin
    .from('perfis')
    .select('id')
    .eq('email', email)
    .maybeSingle()

  return perfilNovo
}

async function matricularEmTodasAsTrilhas(alunoId: string): Promise<void> {
  const { data: trilhas } = await supabaseAdmin.from('trilhas').select('id')
  if (!trilhas || trilhas.length === 0) return

  const expiracao = mesesDepois(new Date(), 12).toISOString()

  for (const trilha of trilhas) {
    await supabaseAdmin.from('matriculas').upsert(
      {
        aluno_id: alunoId,
        trilha_id: trilha.id,
        status: 'ativa',
        data_expiracao: expiracao,
      },
      { onConflict: 'aluno_id,trilha_id' }
    )
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

    const { data: pagamentoExistente } = await supabaseAdmin
      .from('pagamentos')
      .select('id')
      .eq('mercadopago_payment_id', dataId)
      .maybeSingle()

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

    await matricularEmTodasAsTrilhas(perfil.id)

    await supabaseAdmin.from('pagamentos').insert({
      mercadopago_payment_id: dataId,
      email,
      aluno_id: perfil.id,
      valor,
      status: 'aprovado',
    })

    return new Response('ok', { status: 200 })
  }

  if (status === 'refunded' || status === 'charged_back') {
    const { data: pagamentoOriginal } = await supabaseAdmin
      .from('pagamentos')
      .select('aluno_id')
      .eq('mercadopago_payment_id', dataId)
      .maybeSingle()

    if (pagamentoOriginal?.aluno_id) {
      await supabaseAdmin
        .from('matriculas')
        .update({ status: 'cancelada' })
        .eq('aluno_id', pagamentoOriginal.aluno_id)

      await supabaseAdmin
        .from('pagamentos')
        .update({ status: status === 'refunded' ? 'estornado' : 'chargeback' })
        .eq('mercadopago_payment_id', dataId)
    }

    return new Response('ok', { status: 200 })
  }

  return new Response('status ignorado', { status: 200 })
})
```

- [ ] **Step 3: Configurar o segredo novo**

```bash
supabase secrets set MERCADOPAGO_WEBHOOK_SECRET="<valor da Task 1, Step 3>"
```

(`MERCADOPAGO_ACCESS_TOKEN` já foi configurado na Task 3 — não precisa repetir.)

- [ ] **Step 4: Ajustar `supabase/config.toml`**

Assim como `criar-preferencia-pagamento`, esta função não é chamada com uma sessão de aluno — quem chama é o Mercado Pago, servidor a servidor. A autenticação aqui é a verificação de assinatura HMAC feita pelo próprio código, não o JWT do Supabase:

```toml
[functions.webhook-mercadopago]
enabled = true
verify_jwt = false
entrypoint = "./functions/webhook-mercadopago/index.ts"
```

- [ ] **Step 5: Implantar**

```bash
supabase functions deploy webhook-mercadopago
```

- [ ] **Step 6: Testar com um pagamento de teste real**

Repita a Task 3, Step 5 (chamar `criar-preferencia-pagamento`, abrir o `initPoint` retornado) e complete o pagamento na tela do Mercado Pago usando um **cartão de teste** (o Mercado Pago documenta números de cartão de teste que simulam aprovação instantânea — consulte "Cartões de teste" na documentação deles a partir do painel de desenvolvedores, já que os números exatos podem mudar).

Depois de "pagar", verifique:

```bash
supabase db query --linked "select mercadopago_payment_id, email, status from pagamentos order by criado_em desc limit 1;"
```

Expected: 1 linha nova, `status = 'aprovado'`.

```bash
supabase db query --linked "select u.email, m.status, m.data_expiracao from matriculas m join auth.users u on u.id = m.aluno_id order by m.data_matricula desc limit 5;"
```

Expected: uma linha de matrícula por trilha existente, `status = 'ativa'`, para o e-mail usado no pagamento de teste.

Confirme também que um e-mail de "definir senha" chegou na caixa de entrada usada no teste (o convite do Supabase Auth, via o SMTP já configurado na Fase 3).

Repita o teste enviando o mesmo `data.id` de novo manualmente (se o painel do Mercado Pago tiver uma opção de "reenviar notificação de teste", use-a; senão, chame a Edge Function direto com o mesmo corpo e cabeçalhos de assinatura válidos) — confirme que a segunda vez não cria uma segunda linha em `pagamentos` nem uma matrícula duplicada.

- [ ] **Step 7: Commit**

```bash
git add supabase/functions/webhook-mercadopago/index.ts supabase/config.toml
git commit -m "feat: add webhook-mercadopago Edge Function for automatic account and matricula creation"
```

---

## Task 6: Páginas de compra (`comprar.html`, `sucesso.html`, `pendente.html`, `falha.html`)

**Repositório:** `site-toca-o-negocio`

**Files:**
- Create: `atividades/comprar.html`
- Create: `atividades/js/comprar.js`
- Create: `atividades/sucesso.html`
- Create: `atividades/pendente.html`
- Create: `atividades/falha.html`

**Interfaces:**
- Consumes: Edge Function `criar-preferencia-pagamento` (Task 3), contrato `{ nome, email } → { initPoint } | { erro }`.

- [ ] **Step 1: Escrever `atividades/comprar.html`**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Matricule-se — Toca o Negócio</title>
  <link rel="icon" href="../img/favicon-32.png" sizes="32x32">
  <link rel="apple-touch-icon" href="../img/icone-180.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,700&family=Inter:wght@400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/estilo.css">
</head>
<body>
  <header class="cabecalho container">
    <a class="marca" href="../index.html" aria-label="Toca o Negócio">
      <img src="../img/logo-completo-verde.svg" alt="Toca o Negócio" width="150" height="62">
    </a>
  </header>

  <main>
    <section class="secao container">
      <h1>Matricule-se no curso</h1>
      <p>Acesso completo ao curso Toca o Negócio, por 12 meses.</p>
      <form class="formulario" id="form-comprar">
        <p class="erro-formulario" id="erro" role="alert" hidden></p>
        <div class="campo">
          <label for="nome">Nome completo</label>
          <input type="text" id="nome" name="nome" required autocomplete="name">
        </div>
        <div class="campo">
          <label for="email">E-mail</label>
          <input type="email" id="email" name="email" required autocomplete="email">
        </div>
        <button class="botao" type="submit" id="botao-comprar">Comprar</button>
      </form>
    </section>
  </main>

  <footer class="rodape">
    <div class="rodape-conteudo">
      <p class="rodape-razao-social">AUREA EDUCACIONAL LTDA</p>
      <p>CNPJ 67.140.776/0001-88</p>
      <p>Rua Pedro Vieira da Silva, 64 — Jardim Santa Genebra, Campinas/SP — CEP 13.080-570</p>
      <p>E-mail: <a href="mailto:suporte@tocaonegocio.com.br">suporte@tocaonegocio.com.br</a></p>
      <p class="rodape-links">
        <a href="../termos.html">Termos de uso</a> · <a href="../privacidade.html">Política de privacidade</a>
      </p>
      <p class="rodape-legal">
        Cursos livres de capacitação profissional, nos termos do Decreto nº 5.154/2004.
      </p>
      <p class="rodape-copyright">© 2026 Toca o Negócio — AUREA EDUCACIONAL LTDA</p>
    </div>
  </footer>

  <script type="module" src="js/comprar.js"></script>
</body>
</html>
```

- [ ] **Step 2: Escrever `atividades/js/comprar.js`**

```js
import { supabase } from './supabase-client.js';

const form = document.getElementById('form-comprar');
const erro = document.getElementById('erro');
const botao = document.getElementById('botao-comprar');

form.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  erro.hidden = true;
  botao.disabled = true;
  botao.textContent = 'Aguarde...';

  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();

  try {
    const { data, error } = await supabase.functions.invoke('criar-preferencia-pagamento', {
      body: { nome, email },
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

- [ ] **Step 3: Escrever as três páginas de retorno**

`atividades/sucesso.html` (mesmo cabeçalho/rodapé do padrão acima, corpo do `<main>` substituído por):

```html
  <main>
    <section class="secao container">
      <h1>Pagamento recebido!</h1>
      <p>Confira seu e-mail para definir sua senha e acessar o curso.</p>
      <p>Se não encontrar o e-mail em alguns minutos, olhe também a caixa de spam.</p>
    </section>
  </main>
```

`atividades/pendente.html`:

```html
  <main>
    <section class="secao container">
      <h1>Pagamento em processamento</h1>
      <p>Assim que o pagamento for compensado (pode levar até alguns dias úteis no caso de boleto), você recebe um e-mail com as instruções de acesso.</p>
    </section>
  </main>
```

`atividades/falha.html`:

```html
  <main>
    <section class="secao container">
      <h1>Não foi possível concluir o pagamento</h1>
      <p>O pagamento foi recusado ou cancelado. Nenhum valor foi cobrado.</p>
      <p><a class="botao" href="comprar.html">Tentar novamente</a></p>
    </section>
  </main>
```

Nenhuma dessas três páginas contém JavaScript além do padrão de cabeçalho/rodapé — não fazem nenhuma chamada ao Supabase, não liberam acesso. Sem `<script type="module">` nelas.

- [ ] **Step 4: Verificar manualmente**

Sirva o repositório localmente, abra `atividades/comprar.html`, preencha o formulário, confirme que é redirecionado para uma URL do Mercado Pago. Abra `sucesso.html`, `pendente.html`, `falha.html` diretamente e confirme que renderizam corretamente com o cabeçalho/rodapé padrão do site.

- [ ] **Step 5: Commit**

```bash
git add atividades/comprar.html atividades/js/comprar.js atividades/sucesso.html atividades/pendente.html atividades/falha.html
git commit -m "feat: add purchase flow pages (comprar, sucesso, pendente, falha)"
```

---

## Task 7: Verificação de ponta a ponta (manual)

**Repositório:** `site-toca-o-negocio`, verificação apenas — sem alterações de código.

- [ ] **Step 1: Fluxo feliz completo**

Abra `atividades/comprar.html` com um e-mail de teste que **não** tem conta ainda. Complete o pagamento com um cartão de teste do Mercado Pago (aprovação). Confirme: chega em `sucesso.html`; um e-mail de definição de senha chega na caixa de entrada; ao definir a senha e logar em `entrar.html`, o painel mostra matrícula ativa na trilha "IA no Negócio" (ou em todas as trilhas existentes no momento do teste).

- [ ] **Step 2: Não duplica**

Force o mesmo aviso de pagamento a ser processado de novo (reenvio pelo painel do Mercado Pago, ou chamando a função manualmente com o mesmo `data.id` e uma assinatura válida). Confirme que `pagamentos` continua com 1 linha só para esse `mercadopago_payment_id`, e que não foi criada uma segunda matrícula nem enviado um segundo e-mail.

- [ ] **Step 3: Assinatura inválida é rejeitada**

Chame `webhook-mercadopago` diretamente com um cabeçalho `x-signature` incorreto (qualquer valor inventado). Confirme resposta `401` e que nenhuma linha nova aparece em `pagamentos` ou `matriculas`.

- [ ] **Step 4: Compra com e-mail que já tem conta**

Repita o fluxo de compra usando o e-mail de um aluno que já existe (de uma fase anterior, por exemplo). Confirme que nenhuma conta nova é criada (mesmo `auth.users.id` de antes), e que a matrícula é adicionada a essa conta existente.

- [ ] **Step 5: Segredos nunca expostos**

Inspecione o código-fonte de `comprar.html` e o painel de rede do navegador durante o fluxo de compra — confirme que `MERCADOPAGO_ACCESS_TOKEN` e `MERCADOPAGO_WEBHOOK_SECRET` não aparecem em nenhum lugar visível ao navegador.

- [ ] **Step 6: `comprar.html` não está linkada publicamente**

Confirme que nenhuma página pública do site (`index.html`, `painel.html`, etc.) tem link para `comprar.html` nesta fase.

- [ ] **Step 7: Regressão**

Navegue pelo painel, pela aula com vídeo, pela atividade interativa — confirme que nada quebrou nas fases anteriores.

- [ ] **Step 8: Registrar o resultado**

Se todos os passos acima passarem, este incremento está pronto — nenhum commit de código neste passo.
