import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { create } from 'https://deno.land/x/djwt@v2.9.1/mod.ts'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!
const PANDA_API_TOKEN = Deno.env.get('PANDA_API_TOKEN')!
const PANDA_DRM_GROUP_ID = Deno.env.get('PANDA_DRM_GROUP_ID')!
const PANDA_DRM_SECRET = Deno.env.get('PANDA_DRM_SECRET')!

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

async function importarChaveHmac(segredo: string) {
  const encoder = new TextEncoder()
  return await crypto.subtle.importKey(
    'raw',
    encoder.encode(segredo),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CABECALHOS_CORS })
  }

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return respostaJson({ erro: 'sem_sessao' }, 401)
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  })

  let aulaId: string | undefined
  try {
    const corpo = await req.json()
    aulaId = corpo.aula_id
  } catch {
    return respostaJson({ erro: 'corpo_invalido' }, 400)
  }

  if (!aulaId) {
    return respostaJson({ erro: 'aula_id_ausente' }, 400)
  }

  const { data: aula, error: erroAula } = await supabase
    .from('aulas')
    .select('id, titulo, panda_video_id')
    .eq('id', aulaId)
    .single()

  if (erroAula || !aula) {
    return respostaJson({ erro: 'sem_acesso' }, 403)
  }

  if (!aula.panda_video_id) {
    return respostaJson({ semVideo: true }, 200)
  }

  const { data: dadosUsuario } = await supabase.auth.getUser()
  const usuario = dadosUsuario?.user
  if (!usuario) {
    return respostaJson({ erro: 'sem_sessao' }, 401)
  }

  const { data: perfil } = await supabase
    .from('perfis')
    .select('nome')
    .eq('id', usuario.id)
    .single()
  const nomeAluno = perfil?.nome ?? usuario.email ?? 'Aluno'

  // aulas.panda_video_id armazena o video_external_id do Panda (não o id interno).
  // A API do Panda exige a flag `?external_id` na URL para aceitar essa busca por
  // external id (confirmado ao vivo: sem essa flag, o endpoint responde 404
  // mesmo com um video_external_id válido — ver docs.pandavideo.com/reference/get-video-properties).
  const respostaPanda = await fetch(`https://api-v2.pandavideo.com.br/videos/${aula.panda_video_id}?external_id`, {
    headers: { Authorization: PANDA_API_TOKEN },
  })

  if (!respostaPanda.ok) {
    return respostaJson({ erro: 'falha_panda' }, 502)
  }

  const dadosPanda = await respostaPanda.json()
  if (!dadosPanda.video_player) {
    return respostaJson({ erro: 'falha_panda' }, 502)
  }

  const chave = await importarChaveHmac(PANDA_DRM_SECRET)
  const agora = Math.floor(Date.now() / 1000)
  const token = await create(
    { alg: 'HS256', typ: 'JWT' },
    {
      drm_group_id: PANDA_DRM_GROUP_ID,
      string1: `Aula: ${aula.titulo}`,
      string2: `Nome: ${nomeAluno}`,
      string3: '',
      exp: agora + 3600,
    },
    chave
  )

  const playerUrl = `${dadosPanda.video_player}&watermark=${token}`

  return respostaJson({ playerUrl }, 200)
})
