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
