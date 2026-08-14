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
