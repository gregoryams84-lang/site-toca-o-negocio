const PANDA_API_TOKEN = Deno.env.get('PANDA_API_TOKEN')!
const ADMIN_LISTAGEM_SENHA = Deno.env.get('ADMIN_LISTAGEM_SENHA')!

const CABECALHOS_CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-senha-admin',
}

function respostaJson(corpo: unknown, status: number) {
  return new Response(JSON.stringify(corpo), {
    status,
    headers: { ...CABECALHOS_CORS, 'Content-Type': 'application/json' },
  })
}

// Uso interno/administrativo: lista os vídeos cadastrados no Panda Video
// (título, external_id, status) pra facilitar o vínculo de panda_video_id
// em aulas/aulas_gratuitas -- o external_id não aparece no painel visual
// do Panda, só via API (ver docs.pandavideo.com/reference/list-videos).
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CABECALHOS_CORS })
  }

  const senha = req.headers.get('x-senha-admin')
  if (!senha || senha !== ADMIN_LISTAGEM_SENHA) {
    return respostaJson({ erro: 'nao_autorizado' }, 401)
  }

  const url = new URL(req.url)
  const pagina = url.searchParams.get('page') ?? '1'

  let dadosPanda: { videos?: Array<Record<string, unknown>> }
  try {
    const respostaPanda = await fetch(`https://api-v2.pandavideo.com.br/videos?page=${pagina}&limit=100`, {
      headers: { Authorization: PANDA_API_TOKEN },
    })

    if (!respostaPanda.ok) {
      return respostaJson({ erro: 'falha_panda' }, 502)
    }

    dadosPanda = await respostaPanda.json()
  } catch {
    return respostaJson({ erro: 'falha_panda' }, 502)
  }

  const videos = (dadosPanda.videos ?? []).map((v) => ({
    titulo: v.title,
    external_id: v.video_external_id,
    status: v.status,
    duracao_segundos: v.length,
    criado_em: v.created_at,
  }))

  return respostaJson({ videos }, 200)
})
