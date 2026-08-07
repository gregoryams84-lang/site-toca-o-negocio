# Entrega de vídeo com marca d'água — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. **Task 1 is manual and must be completed by the human (Gregory) before any subagent is dispatched — it cannot be automated (creating a paid third-party account, clicking through a dashboard). Do not attempt to dispatch a subagent for Task 1.**

**Goal:** Students can watch each lesson's video from `atividades/aula.html`, with their own name burned into a dynamic watermark (via Panda Video's DRM), and from there continue to the existing interactive activity.

**Architecture:** A new Supabase Edge Function (`gerar-link-video`) is the only piece of backend in the project — it re-uses the existing `aulas` RLS policy (by querying as the calling student, not with elevated privilege) to authorize, then calls the Panda Video API to mint a short-lived, per-student signed player URL with a DRM watermark JWT embedded. A new page (`atividades/aula.html`) calls that function and renders the returned player URL in an iframe, then offers a button to the existing interactive-activity flow (unchanged, just relocated from the panel to this new page).

**Tech Stack:** Supabase Edge Functions (Deno, TypeScript), Panda Video API + DRM Watermark, same static HTML/CSS/JS-no-build-step front-end as the rest of `/atividades/`.

## Global Constraints

- No framework, no build step, in the front-end pages — matches the rest of `/atividades/`.
- No automated test suite in this repo (static site, no build step — established pattern from prior phases). Verification is manual, described in each task.
- The Panda API token and DRM secret key must never appear in any file served to the browser — they live only as Supabase Edge Function secrets (`supabase secrets set`), never in front-end JS, never committed to git.
- `panda_video_id` is a new column — do **not** reuse the existing `aulas.video_url` column (it's semantically misleading for this purpose; a prior brainstorming pass rejected reusing it for exactly this reason). `video_url` stays untouched and unused.
- No new RLS policy — the Edge Function authorizes by querying `aulas` as the calling student (their JWT forwarded to a Supabase client inside the function), relying on the existing policy from migration `0002_correcoes_seguranca.sql` (active, non-expired matrícula required to read `aulas`).
- Marca d'água = `string1`/`string2`/`string3` fields in the DRM JWT payload (Panda's fixed schema, not customizable field names).

---

## Task 1 (MANUAL — Gregory, not a subagent): Configurar a conta Panda Video

**This task cannot be done by an agent.** It requires creating/using a paid third-party account and clicking through its dashboard. Complete it yourself before Task 2 begins; hand the four values you collect to whoever (human or agent) runs Task 3.

- [ ] **Step 1: Criar conta no Panda Video** em https://www.pandavideo.com/br e escolher um plano com o recurso "DRM Watermark" habilitável (qualquer plano pago — Bronze, Silver ou Gold; o watermark em si é cobrado à parte, R$ 2,90/GB, independente do plano).

- [ ] **Step 2: Habilitar a integração de DRM.** No dashboard do Panda, ir em **Segurança** → clicar em **"Integrar DRM"** → escolher a opção de integração via API. Isso revela dois valores — anote-os:
  - **DRM group ID**
  - **Secret key** (chave secreta usada para assinar o token JWT — nunca compartilhe isso, nem cole em nenhum arquivo do repositório)

- [ ] **Step 3: Gerar um token de API do Panda** (separado da chave DRM — usado para chamar a API REST do Panda, ex. consultar propriedades de um vídeo). Normalmente fica em **Configurações da conta** ou **API** no dashboard. Anote esse valor também.

- [ ] **Step 4: Subir um vídeo de teste** (pode ser qualquer vídeo curto, só para testar o fluxo — ex. a Aula 1 real, se já estiver pronta). Depois de convertido, anote o **`video_external_id`** dele (visível na lista de vídeos, ou via a API — é um UUID, ex. `9988aabb-ccdd-eeff-1122-334455667788`). Esse é o valor que vai no campo `panda_video_id` da aula no banco.

- [ ] **Step 5: Reunir os quatro valores** para a Task 3:
  - `PANDA_API_TOKEN` (Step 3)
  - `PANDA_DRM_GROUP_ID` (Step 2)
  - `PANDA_DRM_SECRET` (Step 2)
  - `video_external_id` do vídeo de teste (Step 4) — usado na verificação manual da Task 6, não é um segredo.

---

## Task 2: Migração — coluna `panda_video_id`

**Repositório:** `site-toca-o-negocio`

**Files:**
- Create: `supabase/migrations/0005_aulas_panda_video_id.sql`

**Interfaces:**
- Produces: coluna `aulas.panda_video_id text` (nullable). Tasks 3, 4 e 6 dependem dessa coluna existir.

- [ ] **Step 1: Escrever a migração**

```sql
-- supabase/migrations/0005_aulas_panda_video_id.sql

alter table aulas add column panda_video_id text;
```

- [ ] **Step 2: Aplicar a migração**

```bash
supabase db push
```

(Se `supabase db push` reportar sucesso mas você quiser confirmar, use `supabase db query --linked "select column_name, is_nullable from information_schema.columns where table_name = 'aulas' and column_name = 'panda_video_id';"` — a versão instalada do CLI usa `db query --linked`, não `db execute`.)

- [ ] **Step 3: Verificar a coluna**

```bash
supabase db query --linked "select column_name, is_nullable from information_schema.columns where table_name = 'aulas' and column_name = 'panda_video_id';"
```

Expected: 1 linha, `panda_video_id`, `is_nullable = YES`.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/0005_aulas_panda_video_id.sql
git commit -m "feat: add aulas.panda_video_id for Panda Video DRM integration"
```

---

## Task 3: Edge Function `gerar-link-video`

**Repositório:** `site-toca-o-negocio`

**Files:**
- Create: `supabase/functions/gerar-link-video/index.ts`

**Interfaces:**
- Consumes: coluna `aulas.panda_video_id` (Task 2); os quatro valores da Task 1 (como segredos, não hardcoded).
- Produces: endpoint HTTP (via `supabase.functions.invoke('gerar-link-video', { body: { aula_id } })`) que devolve `{ playerUrl }` em sucesso, `{ semVideo: true }` quando a aula não tem vídeo cadastrado, ou `{ erro: '<motivo>' }` com status HTTP apropriado nos demais casos. Task 4 consome exatamente esse contrato.

- [ ] **Step 1: Criar a função**

```bash
supabase functions new gerar-link-video
```

Isso cria `supabase/functions/gerar-link-video/index.ts` com um esqueleto padrão — substitua todo o conteúdo pelo código abaixo.

- [ ] **Step 2: Escrever `supabase/functions/gerar-link-video/index.ts`**

```typescript
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

  const respostaPanda = await fetch(`https://api-v2.pandavideo.com.br/videos/${aula.panda_video_id}`, {
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
```

- [ ] **Step 3: Configurar os segredos** (valores da Task 1 — nunca commitar estes valores em nenhum arquivo)

```bash
supabase secrets set PANDA_API_TOKEN="<valor da Task 1, Step 3>"
supabase secrets set PANDA_DRM_GROUP_ID="<valor da Task 1, Step 2>"
supabase secrets set PANDA_DRM_SECRET="<valor da Task 1, Step 2>"
```

`SUPABASE_URL` e `SUPABASE_ANON_KEY` já ficam disponíveis automaticamente em toda Edge Function — não precisa configurar.

- [ ] **Step 4: Implantar a função**

```bash
supabase functions deploy gerar-link-video
```

Se o deploy falhar com um erro relacionado ao import do `djwt` (módulo não encontrado/versão inexistente), verifique a versão estável atual em https://deno.land/x/djwt e ajuste a linha `import { create } from 'https://deno.land/x/djwt@vX.X.X/mod.ts'` para a versão encontrada — a API de `create(header, payload, chave)` usada neste código é estável entre versões 2.x e 3.x da biblioteca.

- [ ] **Step 5: Testar manualmente com um vídeo já cadastrado**

Antes deste teste, insira o `video_external_id` de teste (Task 1, Step 4) na aula seedada pela Fase 3:

```bash
supabase db query --linked "update aulas set panda_video_id = '<video_external_id da Task 1>' where titulo = 'Você já usa IA. O problema é como.' returning id, panda_video_id;"
```

Depois, logado como um aluno de teste com matrícula ativa (pode reaproveitar o padrão de aluno de teste das fases anteriores), pegue o `access_token` da sessão no console do navegador (`(await supabase.auth.getSession()).data.session.access_token`) e chame a função direto:

```bash
curl -s -X POST "https://tldmtouhyiglqszwxdmc.supabase.co/functions/v1/gerar-link-video" \
  -H "Authorization: Bearer <access_token do aluno de teste>" \
  -H "Content-Type: application/json" \
  -d '{"aula_id":"<id da aula>"}'
```

Expected: resposta `200` com `{"playerUrl":"https://player.pandavideo.com.br/embed/?v=...&watermark=..."}`. Cole essa URL num navegador — o vídeo deve carregar com a marca d'água mostrando o nome do aluno de teste.

Depois, repita o teste sem `Authorization` (ou com o token de outro aluno sem matrícula nessa trilha) — esperado: `401` ou `403`, nunca a URL do vídeo.

- [ ] **Step 6: Commit**

```bash
git add supabase/functions/gerar-link-video/index.ts
git commit -m "feat: add gerar-link-video Edge Function for watermarked video playback"
```

---

## Task 4: Nova página `atividades/aula.html`

**Repositório:** `site-toca-o-negocio`

**Files:**
- Create: `atividades/aula.html`
- Create: `atividades/js/aula.js`
- Modify: `css/estilo.css`

**Interfaces:**
- Consumes: Edge Function `gerar-link-video` (Task 3) via `supabase.functions.invoke('gerar-link-video', { body: { aula_id } })`, response shape `{ playerUrl } | { semVideo: true } | { erro }`. Consumes `aulas.link_atividade`/`trilha_id` and `matriculas.id/status/data_expiracao` (existing schema).
- Produces: `aula.html?aula_id=<uuid>` as the URL Task 5's `painel.js` links to.

- [ ] **Step 1: Escrever `atividades/aula.html`**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Aula — Toca o Negócio</title>
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
    <button class="botao" id="sair" type="button">Sair</button>
  </header>

  <main>
    <section class="secao container">
      <p><a href="painel.html">&larr; Voltar ao painel</a></p>
      <h1 id="titulo-aula">Carregando...</h1>
      <div id="player-video" class="player-video"></div>
      <p id="mensagem-video" class="texto-video"></p>
      <a class="botao" id="botao-atividade" href="#" hidden>Fazer atividade</a>
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

  <script type="module" src="js/aula.js"></script>
</body>
</html>
```

- [ ] **Step 2: Escrever `atividades/js/aula.js`**

```js
import { supabase } from './supabase-client.js';

const parametros = new URLSearchParams(window.location.search);
const aulaId = parametros.get('aula_id');

const tituloEl = document.getElementById('titulo-aula');
const playerContainer = document.getElementById('player-video');
const mensagemVideo = document.getElementById('mensagem-video');
const botaoAtividade = document.getElementById('botao-atividade');

function montarLinkAtividade(linkBase, matriculaId, aulaIdAlvo, accessToken) {
  const url = new URL(linkBase);
  url.searchParams.set('matricula_id', matriculaId);
  url.searchParams.set('aula_id', aulaIdAlvo);
  url.hash = `tok=${encodeURIComponent(accessToken)}`;
  return url.toString();
}

async function iniciar() {
  if (!aulaId) {
    tituloEl.textContent = 'Aula não encontrada';
    mensagemVideo.textContent = 'Volte para o painel e clique numa aula da lista.';
    return;
  }

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    window.location.href = 'entrar.html';
    return;
  }

  const { data: aula, error: erroAula } = await supabase
    .from('aulas')
    .select('id, titulo, trilha_id, link_atividade')
    .eq('id', aulaId)
    .single();

  if (erroAula || !aula) {
    tituloEl.textContent = 'Aula não encontrada';
    mensagemVideo.textContent = 'Você não tem acesso a esta aula, ou ela não existe.';
    return;
  }

  tituloEl.textContent = aula.titulo;

  const { data: matricula } = await supabase
    .from('matriculas')
    .select('id')
    .eq('trilha_id', aula.trilha_id)
    .eq('status', 'ativa')
    .gt('data_expiracao', new Date().toISOString())
    .single();

  if (aula.link_atividade && matricula) {
    botaoAtividade.hidden = false;
    botaoAtividade.addEventListener('click', async (evento) => {
      evento.preventDefault();
      const { data: { session: sessaoAtual } } = await supabase.auth.getSession();
      if (!sessaoAtual) {
        window.location.href = 'entrar.html';
        return;
      }
      window.location.href = montarLinkAtividade(aula.link_atividade, matricula.id, aula.id, sessaoAtual.access_token);
    });
  }

  const { data: dadosVideo, error: erroVideo } = await supabase.functions.invoke('gerar-link-video', {
    body: { aula_id: aulaId }
  });

  if (erroVideo || !dadosVideo) {
    mensagemVideo.textContent = 'Não foi possível carregar o vídeo agora. Tente novamente em instantes.';
    return;
  }

  if (dadosVideo.semVideo) {
    mensagemVideo.textContent = 'Vídeo em breve.';
    return;
  }

  if (!dadosVideo.playerUrl) {
    mensagemVideo.textContent = 'Não foi possível carregar o vídeo agora. Tente novamente em instantes.';
    return;
  }

  const iframe = document.createElement('iframe');
  iframe.src = dadosVideo.playerUrl;
  iframe.allow = 'accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;';
  iframe.allowFullscreen = true;
  iframe.width = '100%';
  iframe.height = '480';
  iframe.style.border = '0';
  playerContainer.appendChild(iframe);
}

iniciar();

document.getElementById('sair').addEventListener('click', async () => {
  await supabase.auth.signOut();
  window.location.href = 'entrar.html';
});
```

- [ ] **Step 3: Adicionar estilo mínimo pro player e pra mensagem**

Em `css/estilo.css`, logo depois da regra `.lista-aulas-trilha .aula-em-breve { color: var(--neutro); }` (adicionada na Fase 3), acrescentar:

```css
.player-video {
  margin: 24px 0;
  max-width: 100%;
}

.player-video iframe {
  max-width: 100%;
  aspect-ratio: 16 / 9;
  height: auto;
}

.texto-video {
  color: var(--neutro);
}
```

- [ ] **Step 4: Verificar manualmente no navegador**

Sirva o repositório localmente e abra `atividades/aula.html?aula_id=<id da aula de teste>` logado como o aluno de teste da Task 3. Confirme:
- O vídeo carrega e mostra a marca d'água com o nome do aluno.
- O botão "Fazer atividade" aparece e o link tem o formato correto (`?matricula_id=...&aula_id=...#tok=...`).
- Trocando `panda_video_id` da aula pra `null` via SQL, a página mostra "Vídeo em breve." e o botão de atividade continua funcionando.
- Acessando `aula.html` sem estar logado, redireciona pra `entrar.html`.

- [ ] **Step 5: Commit**

```bash
git add atividades/aula.html atividades/js/aula.js css/estilo.css
git commit -m "feat: add lesson page with watermarked video player and activity link"
```

---

## Task 5: Simplificar `painel.js` para linkar pra `aula.html`

**Repositório:** `site-toca-o-negocio`

**Files:**
- Modify: `atividades/js/painel.js`

**Interfaces:**
- Consumes: `aula.html?aula_id=<uuid>` (Task 4).
- Produces: nenhuma interface nova — este é o último consumidor da lógica de montar o link de atividade dentro do painel, que passa a viver só em `aula.js` (Task 4).

Contexto: hoje (pós Fase 3) cada aula da lista do painel já linka direto pra atividade interativa, com a lógica de token-no-clique que construímos na correção final da Fase 3. Agora que existe uma página intermediária (`aula.html`) que já reconstrói esse link por conta própria, o painel não precisa mais montar esse link — só precisa linkar pra `aula.html`.

- [ ] **Step 1: Atualizar `atividades/js/painel.js`**

Substituir o conteúdo de `atividades/js/painel.js` por:

```js
import { supabase } from './supabase-client.js';

const lista = document.getElementById('lista-matriculas');
const vazio = document.getElementById('sem-matricula');
const saudacao = document.getElementById('saudacao');

function renderizarAulas(container, aulas) {
  if (aulas.length === 0) {
    const emBreve = document.createElement('p');
    emBreve.textContent = 'Em breve (verificar o status da matrícula).';
    container.appendChild(emBreve);
    return;
  }
  const listaAulas = document.createElement('ul');
  listaAulas.className = 'lista-aulas-trilha';
  for (const aula of aulas) {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = `aula.html?aula_id=${aula.id}`;
    link.textContent = aula.titulo;
    item.appendChild(link);
    listaAulas.appendChild(item);
  }
  container.appendChild(listaAulas);
}

const { data: { session } } = await supabase.auth.getSession();

if (!session) {
  window.location.href = 'entrar.html';
} else {
  const { data: perfil } = await supabase
    .from('perfis')
    .select('nome')
    .eq('id', session.user.id)
    .single();

  saudacao.textContent = perfil ? `Olá, ${perfil.nome}.` : 'Olá.';

  const { data: matriculas, error } = await supabase
    .from('matriculas')
    .select('id, status, data_expiracao, trilhas ( nome, descricao, aulas ( id, titulo, ordem, link_atividade ) )')
    .eq('status', 'ativa');

  if (error || !matriculas || matriculas.length === 0) {
    vazio.hidden = false;
  } else {
    for (const matricula of matriculas) {
      const item = document.createElement('article');
      item.className = 'trilha-card';
      const titulo = document.createElement('h3');
      titulo.textContent = matricula.trilhas.nome;
      const descricao = document.createElement('p');
      descricao.textContent = matricula.trilhas.descricao ?? '';
      item.appendChild(titulo);
      item.appendChild(descricao);

      const aulasOrdenadas = [...matricula.trilhas.aulas].sort((a, b) => a.ordem - b.ordem);
      renderizarAulas(item, aulasOrdenadas);

      lista.appendChild(item);
    }
  }
}

document.getElementById('sair').addEventListener('click', async () => {
  await supabase.auth.signOut();
  window.location.href = 'entrar.html';
});
```

Nota: toda aula agora linka pra `aula.html?aula_id=<id>`, independente de ter `link_atividade` preenchido ou não — quem decide o que mostrar (vídeo, botão de atividade, "em breve") é a própria `aula.html`, olhando os dados de cada aula individualmente. Isso remove a distinção "aula com link / aula sem link" que existia no painel — ela deixou de fazer sentido aqui, porque agora toda aula tem uma página própria pra abrir.

- [ ] **Step 2: Verificar manualmente**

Abra `painel.html` logado como aluno de teste — confirme que a Aula 1 aparece como link pra `aula.html?aula_id=<id>` (não mais direto pra atividade), e que uma trilha sem nenhuma aula continua mostrando "Em breve (verificar o status da matrícula)."

- [ ] **Step 3: Commit**

```bash
git add atividades/js/painel.js
git commit -m "refactor: link panel lessons to the new lesson page instead of the activity app directly"
```

---

## Task 6: Verificação de ponta a ponta (manual)

**Repositório:** `site-toca-o-negocio`, verificação apenas — sem alterações de código.

- [ ] **Step 1: Fluxo feliz**

Aluno de teste com matrícula ativa: painel → clica na Aula 1 → `aula.html` carrega o vídeo com o próprio nome na marca d'água → clica "Fazer atividade" → chega no app de atividades normalmente (fluxo da Fase 3, inalterado).

- [ ] **Step 2: Vídeo ainda não cadastrado**

Com `panda_video_id = null` numa aula, `aula.html` mostra "Vídeo em breve." e o botão de atividade continua funcionando (se `link_atividade` estiver preenchido).

- [ ] **Step 3: Sem acesso**

Aluno sem matrícula ativa nessa trilha (ou com matrícula expirada) tentando abrir `aula.html?aula_id=<id>` — a chamada à Edge Function retorna `sem_acesso`, nenhum vídeo é exibido.

- [ ] **Step 4: Chave nunca exposta**

Inspecionar o código-fonte de `aula.html` e o painel de rede do navegador (DevTools) — confirmar que `PANDA_API_TOKEN`/`PANDA_DRM_SECRET`/`PANDA_DRM_GROUP_ID` não aparecem em nenhum lugar visível ao navegador (só o `playerUrl` final, já assinado, deve trafegar).

- [ ] **Step 5: Regressão**

Navegar pelo painel, entrar/sair, e confirmar que o resto do fluxo (login, cadastro, lista de trilhas) continua funcionando como antes.

- [ ] **Step 6: Registrar o resultado**

Se todos os passos acima passarem, este incremento está pronto — nenhum commit de código neste passo.
