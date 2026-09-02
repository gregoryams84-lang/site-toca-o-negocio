import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const PANDA_API_TOKEN = Deno.env.get('PANDA_API_TOKEN')!

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

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

  let slugTrilha: string | undefined
  try {
    const corpo = await req.json()
    slugTrilha = corpo.slugTrilha
  } catch {
    return respostaJson({ erro: 'corpo_invalido' }, 400)
  }

  if (!slugTrilha) {
    return respostaJson({ erro: 'slug_ausente' }, 400)
  }

  const { data: trilha, error: erroTrilha } = await supabaseAdmin
    .from('trilhas')
    .select('id')
    .eq('slug', slugTrilha)
    .maybeSingle()

  if (erroTrilha) {
    console.error('Falha ao buscar trilha', { slugTrilha, erro: erroTrilha })
  }

  if (!trilha) {
    return respostaJson({ erro: 'trilha_nao_encontrada' }, 404)
  }

  const { data: aulaGratis, error: erroAula } = await supabaseAdmin
    .from('aulas_gratuitas')
    .select('panda_video_id, partes')
    .eq('trilha_id', trilha.id)
    .maybeSingle()

  if (erroAula) {
    console.error('Falha ao buscar aula gratuita', { slugTrilha, erro: erroAula })
  }

  const partesGratis: Array<{ video_id: string; titulo?: string }> = aulaGratis?.partes && aulaGratis.partes.length > 0
    ? aulaGratis.partes
    : aulaGratis?.panda_video_id
      ? [{ video_id: aulaGratis.panda_video_id }]
      : []

  if (partesGratis.length === 0) {
    return respostaJson({ semVideo: true }, 200)
  }

  // panda_video_id / partes[].video_id armazenam o video_external_id do
  // Panda (mesma convenção de aulas.panda_video_id) — a API do Panda
  // exige a flag `?external_id` na URL pra aceitar essa busca
  // (confirmado no código de gerar-link-video: sem essa flag, 404 mesmo
  // com id válido).
  async function buscarPlayerUrl(externalId: string): Promise<string | null> {
    try {
      const respostaPanda = await fetch(
        `https://api-v2.pandavideo.com.br/videos/${externalId}?external_id`,
        { headers: { Authorization: PANDA_API_TOKEN } }
      )
      if (!respostaPanda.ok) return null
      const dadosPanda: { video_player?: string } = await respostaPanda.json()
      return dadosPanda.video_player ?? null
    } catch {
      return null
    }
  }

  if (partesGratis.length === 1) {
    const playerUrl = await buscarPlayerUrl(partesGratis[0].video_id)
    if (!playerUrl) return respostaJson({ erro: 'falha_panda' }, 502)
    return respostaJson({ playerUrl }, 200)
  }

  const partes = await Promise.all(
    partesGratis.map(async (parte, indice) => ({
      ordem: indice + 1,
      titulo: parte.titulo ?? '',
      playerUrl: await buscarPlayerUrl(parte.video_id),
    }))
  )

  if (partes.some((parte) => !parte.playerUrl)) {
    return respostaJson({ erro: 'falha_panda' }, 502)
  }

  return respostaJson({ partes }, 200)
})
