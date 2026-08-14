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
