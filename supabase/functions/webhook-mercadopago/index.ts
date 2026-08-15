import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { construirManifesto, extrairTsEV1, calcularHmac, compararComSeguranca } from './assinatura.ts'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const MERCADOPAGO_ACCESS_TOKEN = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN')!
const MERCADOPAGO_WEBHOOK_SECRET = Deno.env.get('MERCADOPAGO_WEBHOOK_SECRET')!
const URL_REDIRECIONAMENTO_CONVITE = 'https://tocaonegocio.com.br/atividades/nova-senha.html'

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

  const respostaConvite = await fetch(
    `${SUPABASE_URL}/auth/v1/invite?redirect_to=${encodeURIComponent(URL_REDIRECIONAMENTO_CONVITE)}`,
    {
      method: 'POST',
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, data: { nome } }),
    }
  )

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

async function matricularEmTrilhas(alunoId: string, trilhaIds: string[]): Promise<boolean> {
  const expiracao = mesesDepois(new Date(), 12).toISOString()
  let todasOk = true

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
      todasOk = false
    }
  }

  return todasOk
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

    const matriculaOk = await matricularEmTrilhas(perfil.id, trilhaIds)
    if (!matriculaOk) {
      return new Response('falha ao matricular aluno', { status: 500 })
    }

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
      return new Response('falha ao registrar pagamento', { status: 500 })
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

      const { data: outrosPagamentos, error: erroBuscaOutrosPagamentos } = await supabaseAdmin
        .from('pagamentos')
        .select('trilha_ids')
        .eq('aluno_id', pagamentoOriginal.aluno_id)
        .eq('status', 'aprovado')
        .neq('mercadopago_payment_id', dataId)

      if (erroBuscaOutrosPagamentos) {
        console.error('Falha ao buscar outros pagamentos do aluno para checar sobreposicao', {
          dataId,
          alunoId: pagamentoOriginal.aluno_id,
          erro: erroBuscaOutrosPagamentos,
        })
      }

      const trilhaIdsAindaCobertas = new Set(
        (outrosPagamentos ?? []).flatMap((p) => p.trilha_ids ?? [])
      )
      const trilhaIdsACancelar = trilhaIdsEstornados.filter((id) => !trilhaIdsAindaCobertas.has(id))

      if (trilhaIdsACancelar.length > 0) {
        const { error: erroCancelarMatriculas } = await supabaseAdmin
          .from('matriculas')
          .update({ status: 'cancelada' })
          .eq('aluno_id', pagamentoOriginal.aluno_id)
          .in('trilha_id', trilhaIdsACancelar)

        if (erroCancelarMatriculas) {
          console.error('Falha ao cancelar matriculas do aluno', {
            dataId,
            alunoId: pagamentoOriginal.aluno_id,
            erro: erroCancelarMatriculas,
          })
        }
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
