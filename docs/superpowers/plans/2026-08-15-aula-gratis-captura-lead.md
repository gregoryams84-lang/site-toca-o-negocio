# Aula grátis por trilha + captura de lead — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cada trilha tem sua primeira aula disponível de graça — a pessoa preenche um formulário (nome, celular, e-mail, cidade, estado) e o vídeo libera na hora, sem criar conta. Bem visível na home e em cada página de trilha.

**Architecture:** Duas tabelas novas (`leads`, `aulas_gratuitas`), uma Edge Function nova (`gerar-link-video-gratis`, pública, sem marca d'água — variante simplificada da `gerar-link-video` já existente), uma página nova (`atividades/aula-gratis.html`), e blocos de destaque adicionados na home e nas 4 páginas de trilha.

**Tech Stack:** Supabase (migração SQL + Edge Function Deno), HTML/CSS/JS estático sem build step — mesmo padrão do resto do site.

## Global Constraints

- Sem framework, sem build step no front-end.
- Sem login/conta pra assistir a aula grátis — fricção mínima.
- O vídeo da aula grátis nunca usa o pipeline de marca d'água (isso é exclusivo do conteúdo pago) — é um link de player puro, sem token.
- `leads` só pode ser lida por você (Supabase Studio / service role) — nenhuma policy de select pública.
- `aulas_gratuitas.panda_video_id` começa `null` pras 4 trilhas — populado depois que os vídeos forem gravados, sem precisar de deploy de código (é dado, não código).

---

## Task 1: Migração — tabelas `leads` e `aulas_gratuitas`

**Repositório:** `site-toca-o-negocio`

**Files:**
- Create: `supabase/migrations/0009_leads_e_aulas_gratuitas.sql`

**Interfaces:**
- Produces: tabela `leads` (nome, celular, email, cidade, estado, trilha_id, criado_em); tabela `aulas_gratuitas` (trilha_id único, titulo, descricao, panda_video_id nullable), já populada com 1 linha por trilha (panda_video_id null). Tasks 2, 4, 5 e 6 dependem dessas tabelas.

- [ ] **Step 1: Escrever a migração**

```sql
-- supabase/migrations/0009_leads_e_aulas_gratuitas.sql

create table leads (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  celular text not null,
  email text not null,
  cidade text not null,
  estado text not null,
  trilha_id uuid references trilhas(id) not null,
  criado_em timestamptz not null default now()
);

alter table leads enable row level security;

create policy "qualquer um pode criar lead" on leads
  for insert with check (true);

create table aulas_gratuitas (
  id uuid primary key default gen_random_uuid(),
  trilha_id uuid references trilhas(id) not null unique,
  titulo text not null,
  descricao text,
  panda_video_id text
);

alter table aulas_gratuitas enable row level security;

create policy "qualquer um le aulas gratuitas" on aulas_gratuitas
  for select using (true);

insert into aulas_gratuitas (trilha_id, titulo, descricao)
select id,
  'Você já usa IA. O problema é como.',
  'Reconheça, pelas três perguntas, se uma tarefa do seu negócio vale a pena automatizar.'
from trilhas where slug = 'trilha-ia';

insert into aulas_gratuitas (trilha_id, titulo, descricao)
select id,
  'Perfil que vende sem gastar',
  'Estruture Instagram e Facebook com ajuda de IA, sem gastar nada.'
from trilhas where slug = 'trilha-vendas';

insert into aulas_gratuitas (trilha_id, titulo, descricao)
select id,
  'Onde você está agora',
  'Diagnóstico rápido: MEI, ME ou nada ainda — descubra seu ponto de partida.'
from trilhas where slug = 'trilha-formalizacao';

insert into aulas_gratuitas (trilha_id, titulo, descricao)
select id,
  'Pra onde seu dinheiro vai',
  'Separe o dinheiro pessoal do negócio antes que a mistura vire prejuízo.'
from trilhas where slug = 'trilha-dinheiro';
```

- [ ] **Step 2: Aplicar a migração**

```bash
npx supabase db push
```

(`supabase` não está no PATH neste ambiente — usar sempre `npx supabase`.)

- [ ] **Step 3: Verificar**

```bash
npx supabase db query --linked "select t.slug, ag.titulo, ag.panda_video_id from aulas_gratuitas ag join trilhas t on t.id = ag.trilha_id order by t.slug;"
```

Expected: 4 linhas, uma por trilha (`trilha-dinheiro`, `trilha-formalizacao`, `trilha-ia`, `trilha-vendas`), todas com `panda_video_id` nulo.

```bash
npx supabase db query --linked "select tablename, rowsecurity from pg_tables where tablename in ('leads', 'aulas_gratuitas');"
```

Expected: 2 linhas, ambas `rowsecurity = t`.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/0009_leads_e_aulas_gratuitas.sql
git commit -m "feat: add leads and aulas_gratuitas tables, seed free lesson per trilha"
```

---

## Task 2: Edge Function `gerar-link-video-gratis`

**Repositório:** `site-toca-o-negocio`

**Files:**
- Create: `supabase/functions/gerar-link-video-gratis/index.ts`
- Modify: `supabase/config.toml`

**Interfaces:**
- Consumes: `PANDA_API_TOKEN` (já configurado como secret, reaproveitado de `gerar-link-video`); tabelas `trilhas`/`aulas_gratuitas` (Task 1).
- Produces: endpoint público que recebe `{ slugTrilha }` e devolve `{ playerUrl }` (link puro do player, sem marca d'água), `{ semVideo: true }` se `panda_video_id` ainda for nulo, ou `{ erro }` com status apropriado. Task 4 consome esse contrato.

- [ ] **Step 1: Criar a função**

```bash
npx supabase functions new gerar-link-video-gratis
```

- [ ] **Step 2: Escrever `supabase/functions/gerar-link-video-gratis/index.ts`**

```typescript
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
    .select('panda_video_id')
    .eq('trilha_id', trilha.id)
    .maybeSingle()

  if (erroAula) {
    console.error('Falha ao buscar aula gratuita', { slugTrilha, erro: erroAula })
  }

  if (!aulaGratis || !aulaGratis.panda_video_id) {
    return respostaJson({ semVideo: true }, 200)
  }

  // aulas_gratuitas.panda_video_id armazena o video_external_id do Panda
  // (mesma convenção de aulas.panda_video_id) — a API do Panda exige a
  // flag `?external_id` na URL pra aceitar essa busca (confirmado no
  // código de gerar-link-video: sem essa flag, 404 mesmo com id válido).
  let dadosPanda: { video_player?: string }
  try {
    const respostaPanda = await fetch(
      `https://api-v2.pandavideo.com.br/videos/${aulaGratis.panda_video_id}?external_id`,
      { headers: { Authorization: PANDA_API_TOKEN } }
    )

    if (!respostaPanda.ok) {
      return respostaJson({ erro: 'falha_panda' }, 502)
    }

    dadosPanda = await respostaPanda.json()
  } catch {
    return respostaJson({ erro: 'falha_panda' }, 502)
  }

  if (!dadosPanda.video_player) {
    return respostaJson({ erro: 'falha_panda' }, 502)
  }

  return respostaJson({ playerUrl: dadosPanda.video_player }, 200)
})
```

Diferença chave em relação a `gerar-link-video` (paga): sem checagem de `Authorization`/sessão, sem geração de token JWT de marca d'água — o `playerUrl` devolvido é o link puro do Panda, porque essa aula é pública por design.

- [ ] **Step 3: Ajustar `supabase/config.toml`**

```toml
[functions.gerar-link-video-gratis]
enabled = true
verify_jwt = false
entrypoint = "./functions/gerar-link-video-gratis/index.ts"
```

- [ ] **Step 4: Implantar**

```bash
npx supabase functions deploy gerar-link-video-gratis
```

- [ ] **Step 5: Testar**

```bash
curl -s -X POST "https://tldmtouhyiglqszwxdmc.supabase.co/functions/v1/gerar-link-video-gratis" \
  -H "Content-Type: application/json" \
  -d '{"slugTrilha":"trilha-ia"}'
```

Expected: `200`, `{"semVideo":true}` (já que `panda_video_id` ainda é nulo pra todas as trilhas — isso é o comportamento correto até os vídeos serem gravados).

```bash
curl -s -w "\nHTTP_STATUS:%{http_code}\n" -X POST "https://tldmtouhyiglqszwxdmc.supabase.co/functions/v1/gerar-link-video-gratis" \
  -H "Content-Type: application/json" \
  -d '{"slugTrilha":"trilha-que-nao-existe"}'
```

Expected: `404`, `{"erro":"trilha_nao_encontrada"}`.

- [ ] **Step 6: Commit**

```bash
git add supabase/functions/gerar-link-video-gratis/index.ts supabase/config.toml
git commit -m "feat: add gerar-link-video-gratis Edge Function (unwatermarked, public)"
```

---

## Task 3: CSS — estilos da aula grátis

**Repositório:** `site-toca-o-negocio`

**Files:**
- Modify: `css/estilo.css`

**Interfaces:**
- Produces: classes `.aula-gratis-destaque`, `.aulas-gratis-grade`. Tasks 4, 5 e 6 consomem essas classes; `.formulario`/`.campo`/`.player-video`/`.aviso-revisao`/`.trilha-card` (já existentes) são reaproveitadas sem modificação.

- [ ] **Step 1: Adicionar as classes ao final de `css/estilo.css`**

```css
/* ---- Aula grátis ---- */
.aulas-gratis-grade {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

@media (min-width: 640px) {
  .aulas-gratis-grade { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 960px) {
  .aulas-gratis-grade { grid-template-columns: repeat(4, 1fr); }
}

.aula-gratis-destaque {
  background: color-mix(in srgb, var(--ambar) 8%, var(--papel));
  border: 1px solid var(--borda);
  border-radius: 8px;
  padding: 20px 24px;
  margin: 24px 0;
}

.aula-gratis-destaque p {
  margin: 0 0 12px 0;
}

.aula-gratis-destaque p:last-child {
  margin-bottom: 0;
}
```

`.aulas-gratis-grade` usa os mesmos breakpoints de `.trilhas-grade`/`.passos-grade` já existentes, mas em 4 colunas no desktop (uma aula por trilha) em vez de 2. Os cards em si reaproveitam `.trilha-card` (imagem + título + descrição), sem precisar de uma classe nova pra isso.

- [ ] **Step 2: Commit**

```bash
git add css/estilo.css
git commit -m "feat: add CSS for the free-lesson section and callout block"
```

---

## Task 4: Página `atividades/aula-gratis.html` + `atividades/js/aula-gratis.js`

**Repositório:** `site-toca-o-negocio`

**Files:**
- Create: `atividades/aula-gratis.html`
- Create: `atividades/js/aula-gratis.js`

**Interfaces:**
- Consumes: classes da Task 3; tabelas `aulas_gratuitas`/`trilhas` (Task 1, lidas direto pelo cliente via RLS pública, mesmo padrão de `painel.js`); Edge Function `gerar-link-video-gratis` (Task 2), contrato `{ slugTrilha } → { playerUrl } | { semVideo: true } | { erro }`.
- Produces: página acessível via `atividades/aula-gratis.html?trilha=<slug>` (ex.: `?trilha=trilha-ia`). Tasks 5 e 6 linkam pra essa página.

- [ ] **Step 1: Escrever `atividades/aula-gratis.html`**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Aula grátis — Toca o Negócio</title>
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
      <p id="carregando">Carregando...</p>
      <p id="erro-trilha" hidden>Aula não encontrada.</p>

      <div id="conteudo-aula" hidden>
        <h1 id="titulo-aula"></h1>
        <p class="subtitulo" id="descricao-aula"></p>

        <form class="formulario" id="form-lead">
          <p class="erro-formulario" id="erro" role="alert" hidden></p>
          <div class="campo">
            <label for="nome">Nome completo</label>
            <input type="text" id="nome" name="nome" required autocomplete="name">
          </div>
          <div class="campo">
            <label for="celular">Celular (com DDD)</label>
            <input type="tel" id="celular" name="celular" required autocomplete="tel">
          </div>
          <div class="campo">
            <label for="email">E-mail</label>
            <input type="email" id="email" name="email" required autocomplete="email">
          </div>
          <div class="campo">
            <label for="cidade">Cidade</label>
            <input type="text" id="cidade" name="cidade" required autocomplete="address-level2">
          </div>
          <div class="campo">
            <label for="estado">Estado</label>
            <input type="text" id="estado" name="estado" required autocomplete="address-level1" maxlength="2" placeholder="Ex: SP">
          </div>
          <button class="botao" type="submit" id="botao-liberar">Quero assistir agora</button>
        </form>

        <div id="area-video" hidden>
          <p class="sucesso-formulario">Aula liberada! Assista abaixo.</p>
          <div class="player-video" id="player-video"></div>
        </div>

        <p class="aviso-revisao" id="aviso-sem-video" hidden>Essa aula está sendo gravada — em breve você recebe o acesso. Já anotamos seu interesse, obrigado!</p>
      </div>
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

  <div id="banner-cookies" class="banner-cookies" hidden>
    <p>Usamos cookies só para entender como as pessoas usam o site. Você pode aceitar ou recusar — isso não muda o que você vê aqui. Veja a <a href="../privacidade.html" style="color:inherit">Política de Privacidade</a>.</p>
    <div class="botoes">
      <button type="button" class="botao-recusar" onclick="recusarCookies()">Recusar</button>
      <button type="button" class="botao-aceitar" onclick="aceitarCookies()">Aceitar</button>
    </div>
  </div>
  <script src="../js/consentimento.js"></script>
  <script type="module" src="js/aula-gratis.js"></script>
</body>
</html>
```

- [ ] **Step 2: Escrever `atividades/js/aula-gratis.js`**

```javascript
import { supabase } from './supabase-client.js';

const parametros = new URLSearchParams(window.location.search);
const slugTrilha = parametros.get('trilha');

const carregando = document.getElementById('carregando');
const conteudoAula = document.getElementById('conteudo-aula');
const erroTrilha = document.getElementById('erro-trilha');
const tituloAula = document.getElementById('titulo-aula');
const descricaoAula = document.getElementById('descricao-aula');
const form = document.getElementById('form-lead');
const erro = document.getElementById('erro');
const botao = document.getElementById('botao-liberar');
const areaVideo = document.getElementById('area-video');
const playerVideo = document.getElementById('player-video');
const avisoSemVideo = document.getElementById('aviso-sem-video');

let trilhaId = null;

async function iniciar() {
  if (!slugTrilha) {
    carregando.hidden = true;
    erroTrilha.hidden = false;
    return;
  }

  const { data, error: erroBusca } = await supabase
    .from('aulas_gratuitas')
    .select('titulo, descricao, trilha_id, trilhas!inner(slug)')
    .eq('trilhas.slug', slugTrilha)
    .maybeSingle();

  carregando.hidden = true;

  if (erroBusca || !data) {
    erroTrilha.hidden = false;
    return;
  }

  trilhaId = data.trilha_id;
  tituloAula.textContent = data.titulo;
  descricaoAula.textContent = data.descricao ?? '';
  conteudoAula.hidden = false;
}

iniciar();

form.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  erro.hidden = true;
  botao.disabled = true;
  botao.textContent = 'Aguarde...';

  const nome = document.getElementById('nome').value.trim();
  const celular = document.getElementById('celular').value.trim();
  const email = document.getElementById('email').value.trim();
  const cidade = document.getElementById('cidade').value.trim();
  const estado = document.getElementById('estado').value.trim();

  const { error: erroInsert } = await supabase.from('leads').insert({
    nome,
    celular,
    email,
    cidade,
    estado,
    trilha_id: trilhaId,
  });

  if (erroInsert) {
    erro.textContent = 'Não foi possível registrar seu interesse agora. Tente novamente em instantes.';
    erro.hidden = false;
    botao.disabled = false;
    botao.textContent = 'Quero assistir agora';
    return;
  }

  form.hidden = true;

  const { data: dadosVideo, error: erroVideo } = await supabase.functions.invoke('gerar-link-video-gratis', {
    body: { slugTrilha },
  });

  if (erroVideo || !dadosVideo || dadosVideo.semVideo || !dadosVideo.playerUrl) {
    avisoSemVideo.hidden = false;
    return;
  }

  const iframe = document.createElement('iframe');
  iframe.src = dadosVideo.playerUrl;
  iframe.allow = 'accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;';
  iframe.allowFullscreen = true;
  iframe.width = '100%';
  iframe.height = '480';
  iframe.style.border = '0';
  playerVideo.appendChild(iframe);
  areaVideo.hidden = false;
});
```

- [ ] **Step 3: Verificar manualmente**

Sirva o repositório localmente (`python -m http.server 8080` a partir da raiz), abra `http://localhost:8080/atividades/aula-gratis.html?trilha=trilha-ia`. Confirme: título e descrição da aula aparecem, formulário funciona (todos os campos obrigatórios), ao enviar o formulário registra o lead (verificar depois via `npx supabase db query --linked "select nome, email, trilha_id from leads order by criado_em desc limit 1;"`) e mostra o aviso "Essa aula está sendo gravada" (já que `panda_video_id` ainda é nulo pra todas as trilhas neste momento). Teste também `?trilha=nao-existe` — deve mostrar "Aula não encontrada". Teste `atividades/aula-gratis.html` sem parâmetro nenhum — mesmo resultado.

- [ ] **Step 4: Commit**

```bash
git add atividades/aula-gratis.html atividades/js/aula-gratis.js
git commit -m "feat: add free-lesson page with lead capture form"
```

---

## Task 5: Home (`index.html`) — seção "Assista de graça"

**Repositório:** `site-toca-o-negocio`

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: classes da Task 3; página da Task 4.

- [ ] **Step 1: Adicionar a seção nova, logo depois de `</section>` que fecha `#trilhas` e antes de `<section class="secao secao-alt" id="como-funciona">`**

```html
  <section class="secao secao-alt" id="aula-gratis">
    <div class="container">
      <h2>Assista de graça</h2>
      <p>A primeira aula de cada trilha, sem custo — só preencher um formulário rápido.</p>
      <div class="aulas-gratis-grade">
        <article class="trilha-card">
          <img src="img/trilhas/venda-pelo-whatsapp.jpg" alt="Mesa de trabalho com celular mostrando conversa no WhatsApp, caixa de pedidos e caderno de catálogo de produtos" class="trilha-card-imagem" width="1024" height="559" loading="lazy">
          <h3><a href="atividades/aula-gratis.html?trilha=trilha-vendas">Perfil que vende sem gastar</a></h3>
          <p>Aula grátis da trilha "Venda pela internet e pelo WhatsApp".</p>
        </article>
        <article class="trilha-card">
          <img src="img/trilhas/ia-no-negocio.jpg" alt="Mesa de trabalho com caderno de tarefas, caneta, engrenagem dourada, calculadora e café" class="trilha-card-imagem" width="1024" height="559" loading="lazy">
          <h3><a href="atividades/aula-gratis.html?trilha=trilha-ia">Você já usa IA. O problema é como.</a></h3>
          <p>Aula grátis da trilha "Use inteligência artificial no dia a dia".</p>
        </article>
        <article class="trilha-card">
          <img src="img/trilhas/formalizacao-da-empresa.jpg" alt="Mesa com calendário marcado, pasta de documentos com selo dourado &quot;resolvido&quot; e caneta" class="trilha-card-imagem" width="1024" height="559" loading="lazy">
          <h3><a href="atividades/aula-gratis.html?trilha=trilha-formalizacao">Onde você está agora</a></h3>
          <p>Aula grátis da trilha "Coloque a empresa em dia".</p>
        </article>
        <article class="trilha-card">
          <img src="img/trilhas/gestao-financeira.jpg" alt="Potes de vidro organizados com dinheiro, rotulados Transporte, Alimentação e Poupança, ao lado de um caderno com gráfico de crescimento" class="trilha-card-imagem" width="1024" height="559" loading="lazy">
          <h3><a href="atividades/aula-gratis.html?trilha=trilha-dinheiro">Pra onde seu dinheiro vai</a></h3>
          <p>Aula grátis da trilha "Controle o dinheiro do negócio".</p>
        </article>
      </div>
    </div>
  </section>
```

Reaproveita as mesmas 4 imagens já existentes em `img/trilhas/` (mesmo padrão visual dos cards de `#trilhas`), sem precisar de imagem nova.

- [ ] **Step 2: Verificar manualmente**

Sirva o repositório localmente, abra `index.html`, confirme que a seção "Assista de graça" aparece logo depois de "As trilhas", com os 4 cards, e que cada link leva pra `aula-gratis.html?trilha=<slug correto>`. Confirme mobile (~360px) e desktop.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add 'Assista de graça' section to the home page"
```

---

## Task 6: Páginas de trilha — bloco de destaque da aula grátis

**Repositório:** `site-toca-o-negocio`

**Files:**
- Modify: `trilhas/venda-pelo-whatsapp/index.html`
- Modify: `trilhas/ia-no-negocio/index.html`
- Modify: `trilhas/formalizacao-da-empresa/index.html`
- Modify: `trilhas/gestao-financeira/index.html`

**Interfaces:**
- Consumes: classes da Task 3 (`.aula-gratis-destaque`); página da Task 4.

Em cada uma das 4 páginas, logo depois da tag `<img class="trilha-hero-imagem">` (já existente, da Task de imagens) e antes do `<h1>`, adicionar o bloco de destaque (conteúdo específico por trilha):

- [ ] **Step 1: `trilhas/venda-pelo-whatsapp/index.html`**

```html
      <div class="aula-gratis-destaque">
        <p><strong>Quer testar antes de decidir?</strong> Assista de graça a aula "Perfil que vende sem gastar".</p>
        <a class="botao" href="../../atividades/aula-gratis.html?trilha=trilha-vendas">Assistir agora, de graça</a>
      </div>
```

- [ ] **Step 2: `trilhas/ia-no-negocio/index.html`**

```html
      <div class="aula-gratis-destaque">
        <p><strong>Quer testar antes de decidir?</strong> Assista de graça a aula "Você já usa IA. O problema é como.".</p>
        <a class="botao" href="../../atividades/aula-gratis.html?trilha=trilha-ia">Assistir agora, de graça</a>
      </div>
```

- [ ] **Step 3: `trilhas/formalizacao-da-empresa/index.html`**

```html
      <div class="aula-gratis-destaque">
        <p><strong>Quer testar antes de decidir?</strong> Assista de graça a aula "Onde você está agora".</p>
        <a class="botao" href="../../atividades/aula-gratis.html?trilha=trilha-formalizacao">Assistir agora, de graça</a>
      </div>
```

- [ ] **Step 4: `trilhas/gestao-financeira/index.html`**

```html
      <div class="aula-gratis-destaque">
        <p><strong>Quer testar antes de decidir?</strong> Assista de graça a aula "Pra onde seu dinheiro vai".</p>
        <a class="botao" href="../../atividades/aula-gratis.html?trilha=trilha-dinheiro">Assistir agora, de graça</a>
      </div>
```

- [ ] **Step 5: Verificar manualmente**

Sirva o repositório localmente, abra as 4 páginas de trilha. Confirme em cada uma: o bloco de destaque aparece entre a imagem de herói e o `<h1>`, com fundo levemente dourado (`--ambar`); o botão "Assistir agora, de graça" leva pra `aula-gratis.html?trilha=<slug correto>` daquela trilha específica; nada quebra em mobile nem desktop.

- [ ] **Step 6: Commit**

```bash
git add trilhas/venda-pelo-whatsapp/index.html trilhas/ia-no-negocio/index.html trilhas/formalizacao-da-empresa/index.html trilhas/gestao-financeira/index.html
git commit -m "feat: add free-lesson callout block to each trilha page"
```
