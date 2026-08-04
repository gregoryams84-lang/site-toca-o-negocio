# Fundação técnica /atividades/ Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. **Task 1 is the exception — it requires live, interactive browser authentication with the human partner (like the GitHub CLI login earlier in this project) and must be run by the controller session directly, not dispatched to a subagent.**

**Goal:** Stand up the Supabase-backed data model, Row Level Security policies, and the four static pages (signup, login, password reset, dashboard) that let a student create an account, log in, and see their enrolled trilhas — with zero real payment or lesson content yet.

**Architecture:** Static HTML/CSS/JS under `/atividades/` (no build step, no framework — same as the rest of the site), talking directly to a Supabase project via the `@supabase/supabase-js` client loaded from a CDN as an ES module. All access control enforced by Postgres Row Level Security in Supabase, not by client-side logic.

**Tech Stack:** Supabase (Postgres + Auth), `@supabase/supabase-js` v2 via `https://esm.sh/@supabase/supabase-js@2`, Supabase CLI for schema migrations, plain HTML/CSS/JS (ES modules, no bundler).

## Global Constraints

- No build step, no framework, no bundler — same as the institutional site. JS is plain ES modules loaded via `<script type="module">`.
- Reuse `css/estilo.css` (paths become `../css/estilo.css` from inside `/atividades/`) — same palette/typography, no new colors invented. Any new UI element (form fields, error text) must use only the existing `--verde/--tinta/--papel/--neutro/--borda` variables.
- The Supabase **anon key is public by design** — Supabase's security model relies entirely on Row Level Security, not on hiding this key. It is meant to be embedded directly in client-side JS. This is correct and expected — do not attempt to hide it or fetch it from a server (there is no server).
- The Supabase **service_role key** (admin key that bypasses RLS) must **never** appear in any file under `atividades/`, in any committed file, or in any browser-loaded script. If a task needs it (none in this plan do), it is read from an environment variable in a local-only script, never hardcoded, never committed.
- Every table gets Row Level Security enabled with an explicit policy — no table is left with RLS off "for now."
- `/atividades/` must not break or modify `index.html`, `termos.html`, `privacidade.html`, or anything outside the new `atividades/` and `supabase/` directories.
- Data model, RLS policies, and page list must match `docs/superpowers/specs/2026-08-04-fundacao-tecnica-atividades-design.md` exactly.
- Since there is no test runner for this stack, "tests" are: SQL/CLI verification queries (schema, RLS behavior) and browser-driven checks (via chrome-devtools or manual walkthrough) of the actual signup → login → dashboard flow.

---

## File Structure

```
site-toca-o-negocio/
├── supabase/
│   ├── config.toml                  (from `supabase init`)
│   ├── project-info.md              (project URL + anon key — NOT secret, safe to commit)
│   └── migrations/
│       └── 0001_fundacao.sql        (schema + RLS policies)
├── atividades/
│   ├── cadastro.html
│   ├── entrar.html
│   ├── esqueci-senha.html
│   ├── painel.html
│   └── js/
│       ├── supabase-client.js
│       ├── cadastro.js
│       ├── entrar.js
│       ├── esqueci-senha.js
│       └── painel.js
├── scripts/
│   └── verificar-rls.mjs            (dev-only RLS verification script, Task 8)
└── css/estilo.css                    (modified: add .formulario/.campo/.erro-formulario)
```

---

### Task 1: Provision the Supabase project (controller-run, interactive)

**Files:**
- Create: `supabase/config.toml` (via `supabase init`)
- Create: `supabase/project-info.md`

**Interfaces:**
- Produces: `SUPABASE_URL` and `SUPABASE_ANON_KEY` (written into `supabase/project-info.md`), consumed by Task 3.

This task cannot be delegated to a subagent — it requires a live browser login the human partner must complete, the same pattern used earlier in this project for `gh auth login`.

- [ ] **Step 1: Install the Supabase CLI**

```bash
npm install -g supabase
supabase --version
```

- [ ] **Step 2: Log in (opens a browser device-code flow)**

```bash
supabase login
```

This prints a URL and a code, exactly like the GitHub CLI login earlier — relay both to the human partner and wait for them to authorize in their browser.

- [ ] **Step 3: Find or create an organization**

```bash
supabase orgs list
```

If an organization already exists, use its ID in Step 4. If none exists, Supabase currently requires creating the first organization through the dashboard (`https://supabase.com/dashboard/new`) rather than the CLI — if `orgs list` comes back empty, tell the human partner to create one (any name, e.g. "Toca o Negócio") at that URL, then re-run `supabase orgs list` to get its ID.

- [ ] **Step 4: Create the project**

```bash
supabase projects create toca-o-negocio-atividades \
  --org-id <ORG_ID_FROM_STEP_3> \
  --db-password <GENERATE_A_STRONG_PASSWORD_HERE> \
  --region sa-east-1
```

`sa-east-1` (São Paulo) keeps latency low for Brazilian students. Generate the db password with `openssl rand -base64 24` (or equivalent) — **do not reuse a password from anywhere else, and do not commit it.** Give it to the human partner directly in chat (not in a file) so they have it recorded somewhere safe; it is only needed for direct Postgres/psql access, which this plan doesn't otherwise use.

- [ ] **Step 5: Capture the project URL and anon key**

```bash
supabase projects api-keys --project-ref <PROJECT_REF_FROM_STEP_4>
```

- [ ] **Step 6: Link the local repo to the project and initialize migrations folder**

```bash
cd site-toca-o-negocio
supabase init
supabase link --project-ref <PROJECT_REF_FROM_STEP_4>
```

- [ ] **Step 7: Write `supabase/project-info.md`**

```markdown
# Projeto Supabase — Toca o Negócio / atividades

- Project ref: `<PROJECT_REF>`
- URL: `<SUPABASE_URL, formato https://<ref>.supabase.co>`
- Anon key (pública, segura para uso no front-end): `<ANON_KEY>`

A senha do banco de dados NÃO está neste arquivo — foi entregue diretamente
na conversa quando o projeto foi criado. O anon key acima é público por
design (é assim que o Supabase funciona: a segurança vem das políticas de
Row Level Security no banco, não de esconder esta chave).
```

- [ ] **Step 8: Commit**

```bash
git add supabase/config.toml supabase/project-info.md .gitignore
git commit -m "chore: provision Supabase project for atividades foundation"
```

(If `supabase init` created a `.gitignore` inside `supabase/`, check it excludes any local-only Supabase CLI cache — do not commit `supabase/.temp/` if present.)

---

### Task 2: Database schema and Row Level Security migration

**Files:**
- Create: `supabase/migrations/0001_fundacao.sql`

**Interfaces:**
- Consumes: Supabase CLI linked to the project from Task 1.
- Produces: tables `perfis`, `trilhas`, `aulas`, `matriculas`, `progresso`, `certificados`, all with RLS enabled — consumed by Tasks 3–8 via the Supabase JS client's `.from('<table>')` calls.

- [ ] **Step 1: Write the migration**

```sql
-- supabase/migrations/0001_fundacao.sql

create table perfis (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null,
  telefone text,
  criado_em timestamptz not null default now()
);

alter table perfis enable row level security;

create policy "aluno le proprio perfil" on perfis
  for select using (auth.uid() = id);

create policy "aluno edita proprio perfil" on perfis
  for update using (auth.uid() = id);

create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.perfis (id, nome, telefone)
  values (new.id, new.raw_user_meta_data->>'nome', new.raw_user_meta_data->>'telefone');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create table trilhas (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  descricao text,
  slug text unique not null
);

alter table trilhas enable row level security;

create policy "qualquer um le trilhas" on trilhas
  for select using (true);

create table matriculas (
  id uuid primary key default gen_random_uuid(),
  aluno_id uuid not null references auth.users(id) on delete cascade,
  trilha_id uuid not null references trilhas(id) on delete cascade,
  data_matricula timestamptz not null default now(),
  data_expiracao timestamptz not null,
  status text not null default 'ativa' check (status in ('ativa', 'expirada', 'cancelada')),
  unique (aluno_id, trilha_id)
);

alter table matriculas enable row level security;

create policy "aluno le propria matricula" on matriculas
  for select using (auth.uid() = aluno_id);

create table aulas (
  id uuid primary key default gen_random_uuid(),
  trilha_id uuid not null references trilhas(id) on delete cascade,
  titulo text not null,
  ordem int not null,
  video_url text,
  material_pdf_url text,
  descricao_atividade text
);

alter table aulas enable row level security;

create policy "aluno matriculado le aulas da trilha" on aulas
  for select using (
    exists (
      select 1 from matriculas
      where matriculas.trilha_id = aulas.trilha_id
      and matriculas.aluno_id = auth.uid()
      and matriculas.status = 'ativa'
    )
  );

create table progresso (
  id uuid primary key default gen_random_uuid(),
  matricula_id uuid not null references matriculas(id) on delete cascade,
  aula_id uuid not null references aulas(id) on delete cascade,
  concluida boolean not null default false,
  concluida_em timestamptz,
  unique (matricula_id, aula_id)
);

alter table progresso enable row level security;

create policy "aluno le proprio progresso" on progresso
  for select using (
    exists (
      select 1 from matriculas
      where matriculas.id = progresso.matricula_id
      and matriculas.aluno_id = auth.uid()
    )
  );

create policy "aluno atualiza proprio progresso" on progresso
  for all using (
    exists (
      select 1 from matriculas
      where matriculas.id = progresso.matricula_id
      and matriculas.aluno_id = auth.uid()
    )
  );

create table certificados (
  id uuid primary key default gen_random_uuid(),
  matricula_id uuid not null references matriculas(id) on delete cascade,
  emitido_em timestamptz,
  codigo_verificacao text unique
);

alter table certificados enable row level security;

create policy "aluno le proprio certificado" on certificados
  for select using (
    exists (
      select 1 from matriculas
      where matriculas.id = certificados.matricula_id
      and matriculas.aluno_id = auth.uid()
    )
  );
```

Tables are created in this order — `perfis` → `trilhas` → `matriculas` → `aulas` → `progresso` → `certificados` — so that every foreign key and every RLS policy's subquery (e.g. `aulas`'s policy references `matriculas`, `progresso`'s policy references `matriculas`) always points at a table that already exists earlier in the same file.

- [ ] **Step 2: Push the migration**

```bash
supabase db push
```

- [ ] **Step 3: Verify tables and RLS are live**

```bash
supabase db execute "select tablename, rowsecurity from pg_tables where schemaname = 'public' order by tablename;"
```

Expected: 6 rows (`aulas`, `certificados`, `matriculas`, `perfis`, `progresso`, `trilhas`), every one with `rowsecurity = t`.

```bash
supabase db execute "select tablename, policyname from pg_policies where schemaname = 'public' order by tablename;"
```

Expected: at least one policy per table (perfis: 2, trilhas: 1, aulas: 1, matriculas: 1, progresso: 2, certificados: 1 — 8 rows total).

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/0001_fundacao.sql
git commit -m "feat: add database schema and RLS policies for atividades foundation"
```

---

### Task 3: Shared Supabase client and form styles

**Files:**
- Create: `atividades/js/supabase-client.js`
- Modify: `css/estilo.css` (append form styles)

**Interfaces:**
- Consumes: `SUPABASE_URL` and `SUPABASE_ANON_KEY` from `supabase/project-info.md` (Task 1).
- Produces: `export const supabase` (a configured Supabase JS client instance) from `atividades/js/supabase-client.js`, imported by every other page's script in Tasks 4–7. Produces CSS classes `.formulario`, `.campo`, `.erro-formulario`, consumed by Tasks 4–7.

- [ ] **Step 1: Write `atividades/js/supabase-client.js`**

Read the real `SUPABASE_URL` and `SUPABASE_ANON_KEY` values from `supabase/project-info.md` (written in Task 1) and substitute them literally below — these are not secrets, do not leave them as placeholders in the shipped file:

```js
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'PASTE_THE_REAL_URL_FROM_supabase/project-info.md';
const SUPABASE_ANON_KEY = 'PASTE_THE_REAL_ANON_KEY_FROM_supabase/project-info.md';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

- [ ] **Step 2: Append form styles to `css/estilo.css`**

```css
/* ---- Formulários (app de alunos) ---- */
.formulario {
  max-width: 420px;
}

.campo {
  margin-bottom: 20px;
}

.campo label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
}

.campo input {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--borda);
  border-radius: 6px;
  font-family: var(--fonte-base);
  font-size: 17px;
  background: #FFFFFF;
  color: var(--tinta);
}

.campo input:focus {
  outline: 2px solid var(--verde);
  outline-offset: 2px;
}

.erro-formulario {
  color: var(--tinta);
  font-weight: 600;
  border-left: 3px solid var(--tinta);
  padding-left: 12px;
  margin-bottom: 16px;
}
```

- [ ] **Step 3: Verify no forbidden literal colors were introduced**

Run: `grep -n "#[0-9A-Fa-f]\{3,6\}" css/estilo.css`
Expected: only the pre-existing `#FFFFFF` (card/input background, not a brand color) and the `color-mix(...)` lines already in the file. No new hex literals besides `#FFFFFF`.

- [ ] **Step 4: Commit**

```bash
git add atividades/js/supabase-client.js css/estilo.css
git commit -m "feat: add shared Supabase client and form styles"
```

---

### Task 4: `atividades/cadastro.html` — signup page

**Files:**
- Create: `atividades/cadastro.html`
- Create: `atividades/js/cadastro.js`

**Interfaces:**
- Consumes: `supabase` from `atividades/js/supabase-client.js` (Task 3); `.formulario`, `.campo`, `.erro-formulario` CSS classes (Task 3).

- [ ] **Step 1: Write `atividades/cadastro.html`**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Criar conta — Toca o Negócio</title>
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
      <h1>Criar conta</h1>
      <form class="formulario" id="form-cadastro">
        <p class="erro-formulario" id="erro" hidden></p>
        <div class="campo">
          <label for="nome">Nome completo</label>
          <input type="text" id="nome" name="nome" required autocomplete="name">
        </div>
        <div class="campo">
          <label for="email">E-mail</label>
          <input type="email" id="email" name="email" required autocomplete="email">
        </div>
        <div class="campo">
          <label for="senha">Senha</label>
          <input type="password" id="senha" name="senha" required minlength="8" autocomplete="new-password">
        </div>
        <button class="botao" type="submit">Criar conta</button>
      </form>
      <p>Já tem conta? <a href="entrar.html">Entrar</a></p>
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

  <script type="module" src="js/cadastro.js"></script>
</body>
</html>
```

- [ ] **Step 2: Write `atividades/js/cadastro.js`**

```js
import { supabase } from './supabase-client.js';

const form = document.getElementById('form-cadastro');
const erro = document.getElementById('erro');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  erro.hidden = true;

  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value;

  const { error } = await supabase.auth.signUp({
    email,
    password: senha,
    options: { data: { nome } }
  });

  if (error) {
    erro.textContent = error.message;
    erro.hidden = false;
    return;
  }

  window.location.href = 'painel.html';
});
```

- [ ] **Step 3: Verify the footer matches the institutional site's footer exactly**

Run: `diff <(sed -n '/<footer class="rodape">/,/<\/footer>/p' ../index.html) <(sed -n '/<footer class="rodape">/,/<\/footer>/p' cadastro.html)` (run from inside `atividades/`, adjusting the first path to `../index.html`)
Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add atividades/cadastro.html atividades/js/cadastro.js
git commit -m "feat: add student signup page"
```

---

### Task 5: `atividades/entrar.html` — login page

**Files:**
- Create: `atividades/entrar.html`
- Create: `atividades/js/entrar.js`

**Interfaces:**
- Consumes: `supabase` from `atividades/js/supabase-client.js` (Task 3).

- [ ] **Step 1: Write `atividades/entrar.html`**

Same `<head>`, header, and footer as `atividades/cadastro.html` (Task 4) — copy them verbatim, changing only `<title>` to `Entrar — Toca o Negócio` and the `<main>` content to:

```html
  <main>
    <section class="secao container">
      <h1>Entrar</h1>
      <form class="formulario" id="form-entrar">
        <p class="erro-formulario" id="erro" hidden></p>
        <div class="campo">
          <label for="email">E-mail</label>
          <input type="email" id="email" name="email" required autocomplete="email">
        </div>
        <div class="campo">
          <label for="senha">Senha</label>
          <input type="password" id="senha" name="senha" required autocomplete="current-password">
        </div>
        <button class="botao" type="submit">Entrar</button>
      </form>
      <p><a href="esqueci-senha.html">Esqueci minha senha</a> · <a href="cadastro.html">Criar conta</a></p>
    </section>
  </main>
```

And `<script type="module" src="js/entrar.js"></script>` before `</body>`.

- [ ] **Step 2: Write `atividades/js/entrar.js`**

```js
import { supabase } from './supabase-client.js';

const form = document.getElementById('form-entrar');
const erro = document.getElementById('erro');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  erro.hidden = true;

  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value;

  const { error } = await supabase.auth.signInWithPassword({ email, password: senha });

  if (error) {
    erro.textContent = 'E-mail ou senha incorretos.';
    erro.hidden = false;
    return;
  }

  window.location.href = 'painel.html';
});
```

- [ ] **Step 3: Verify the footer matches**

Run the same `diff` check as Task 4 Step 3, against `entrar.html`.
Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add atividades/entrar.html atividades/js/entrar.js
git commit -m "feat: add student login page"
```

---

### Task 6: `atividades/esqueci-senha.html` — password reset

**Files:**
- Create: `atividades/esqueci-senha.html`
- Create: `atividades/js/esqueci-senha.js`

**Interfaces:**
- Consumes: `supabase` from `atividades/js/supabase-client.js` (Task 3).

- [ ] **Step 1: Write `atividades/esqueci-senha.html`**

Same `<head>`, header, and footer as Task 4 — copy verbatim, `<title>Recuperar senha — Toca o Negócio</title>`, `<main>` content:

```html
  <main>
    <section class="secao container">
      <h1>Recuperar senha</h1>
      <form class="formulario" id="form-recuperar">
        <p id="mensagem" hidden></p>
        <div class="campo">
          <label for="email">E-mail</label>
          <input type="email" id="email" name="email" required autocomplete="email">
        </div>
        <button class="botao" type="submit">Enviar link de recuperação</button>
      </form>
      <p><a href="entrar.html">Voltar para o login</a></p>
    </section>
  </main>
```

And `<script type="module" src="js/esqueci-senha.js"></script>` before `</body>`.

- [ ] **Step 2: Write `atividades/js/esqueci-senha.js`**

```js
import { supabase } from './supabase-client.js';

const form = document.getElementById('form-recuperar');
const mensagem = document.getElementById('mensagem');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = document.getElementById('email').value.trim();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + window.location.pathname.replace('esqueci-senha.html', 'entrar.html')
  });

  mensagem.hidden = false;
  mensagem.textContent = error
    ? 'Não foi possível enviar o e-mail agora. Tente novamente em instantes.'
    : 'Se esse e-mail estiver cadastrado, você vai receber um link para redefinir a senha.';
});
```

- [ ] **Step 3: Verify the footer matches**

Same `diff` check as Task 4 Step 3, against `esqueci-senha.html`. Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add atividades/esqueci-senha.html atividades/js/esqueci-senha.js
git commit -m "feat: add password reset page"
```

---

### Task 7: `atividades/painel.html` — student dashboard

**Files:**
- Create: `atividades/painel.html`
- Create: `atividades/js/painel.js`

**Interfaces:**
- Consumes: `supabase` from `atividades/js/supabase-client.js` (Task 3); `matriculas`/`trilhas`/`perfis` tables (Task 2).

- [ ] **Step 1: Write `atividades/painel.html`**

Same `<head>` and footer as Task 4 — copy verbatim, `<title>Painel do aluno — Toca o Negócio</title>`. Header includes a logout button:

```html
  <header class="cabecalho container">
    <a class="marca" href="../index.html" aria-label="Toca o Negócio">
      <img src="../img/logo-completo-verde.svg" alt="Toca o Negócio" width="150" height="62">
    </a>
    <button class="botao" id="sair" type="button">Sair</button>
  </header>

  <main>
    <section class="secao container">
      <h1 id="saudacao">Olá.</h1>
      <p id="sem-matricula" hidden>Nenhuma matrícula ativa no momento.</p>
      <div class="trilhas-grade" id="lista-matriculas"></div>
    </section>
  </main>
```

And `<script type="module" src="js/painel.js"></script>` before `</body>`.

- [ ] **Step 2: Write `atividades/js/painel.js`**

```js
import { supabase } from './supabase-client.js';

const lista = document.getElementById('lista-matriculas');
const vazio = document.getElementById('sem-matricula');
const saudacao = document.getElementById('saudacao');

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
    .select('id, status, data_expiracao, trilhas ( nome, descricao )')
    .eq('status', 'ativa');

  if (error || !matriculas || matriculas.length === 0) {
    vazio.hidden = false;
  } else {
    for (const matricula of matriculas) {
      const item = document.createElement('article');
      item.className = 'trilha-card';
      item.innerHTML = `<h3>${matricula.trilhas.nome}</h3><p>${matricula.trilhas.descricao ?? ''}</p>`;
      lista.appendChild(item);
    }
  }
}

document.getElementById('sair').addEventListener('click', async () => {
  await supabase.auth.signOut();
  window.location.href = 'entrar.html';
});
```

- [ ] **Step 3: Verify the footer matches**

Same `diff` check as Task 4 Step 3, against `painel.html`. Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add atividades/painel.html atividades/js/painel.js
git commit -m "feat: add student dashboard"
```

---

### Task 8: End-to-end and Row Level Security verification

**Files:**
- Create: `scripts/verificar-rls.mjs`

**Interfaces:**
- Consumes: `supabase/project-info.md` (Task 1), `trilhas`/`matriculas` tables (Task 2), the four pages (Tasks 4–7).

- [ ] **Step 1: Browser walkthrough of signup → dashboard**

Using chrome-devtools (navigate_page, fill, click, take_screenshot) or a manual walkthrough:
1. Open `atividades/cadastro.html`, fill in a test name/email/password (use a real-format but disposable email, e.g. `teste+fundacao@tocaonegocio.com.br`), submit.
2. Confirm it redirects to `painel.html` and shows "Nenhuma matrícula ativa no momento."
3. Click "Sair", confirm redirect to `entrar.html`.
4. Log back in with the same email/password on `entrar.html`, confirm it redirects to `painel.html` again.

- [ ] **Step 2: Manually enroll the test account in a trilha, via the Supabase dashboard**

In the Supabase dashboard's Table Editor (not a script — this is the manual process the spec calls for): insert one row into `trilhas` (e.g. `nome: "Venda pela internet e pelo WhatsApp"`, `slug: "venda"`), then one row into `matriculas` linking the test account's `auth.users.id` (visible in the Authentication tab) to that trilha's id, with `data_expiracao` = today + 12 months, `status: "ativa"`.

- [ ] **Step 3: Confirm the dashboard now shows the trilha**

Reload `painel.html` while logged in as the test account. Expected: the trilha card now appears instead of "Nenhuma matrícula ativa."

- [ ] **Step 4: Write `scripts/verificar-rls.mjs`**

```js
// Dev-only script: confirms a logged-in student cannot read another
// student's matriculas via the public anon key. Run with:
//   node scripts/verificar-rls.mjs
// Requires two disposable test accounts to exist (created via cadastro.html).
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'PASTE_THE_REAL_URL_FROM_supabase/project-info.md';
const SUPABASE_ANON_KEY = 'PASTE_THE_REAL_ANON_KEY_FROM_supabase/project-info.md';

const ALUNO_A = { email: 'teste+fundacao@tocaonegocio.com.br', senha: 'SENHA_DO_TESTE_A' };
const ALUNO_B = { email: 'teste+fundacao-b@tocaonegocio.com.br', senha: 'SENHA_DO_TESTE_B' };

async function loginComo(credenciais) {
  const cliente = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { error } = await cliente.auth.signInWithPassword({
    email: credenciais.email,
    password: credenciais.senha
  });
  if (error) throw new Error(`Login falhou para ${credenciais.email}: ${error.message}`);
  return cliente;
}

const clienteA = await loginComo(ALUNO_A);
const { data: matriculasDeA } = await clienteA.from('matriculas').select('*');
console.log(`Aluno A vê ${matriculasDeA.length} matrícula(s) — deve ser exatamente a(s) dele mesmo.`);

const clienteB = await loginComo(ALUNO_B);
const { data: matriculasQueDeveriaSerZero } = await clienteB
  .from('matriculas')
  .select('*')
  .eq('aluno_id', (await clienteA.auth.getUser()).data.user.id);

if (matriculasQueDeveriaSerZero.length === 0) {
  console.log('OK: Aluno B não consegue ler a matrícula do Aluno A. RLS está funcionando.');
} else {
  console.error('FALHA DE SEGURANÇA: Aluno B conseguiu ler dados do Aluno A.');
  process.exit(1);
}
```

- [ ] **Step 5: Create a second disposable test account and run the script**

Sign up `teste+fundacao-b@tocaonegocio.com.br` via `atividades/cadastro.html` (this account intentionally gets no matrícula). Fill in both accounts' real passwords in `scripts/verificar-rls.mjs`, then:

```bash
npm install @supabase/supabase-js
node scripts/verificar-rls.mjs
```

Expected output: `OK: Aluno B não consegue ler a matrícula do Aluno A. RLS está funcionando.`

- [ ] **Step 6: Clean up test data**

Delete both test accounts (Authentication tab) and the test `matriculas`/`trilhas` rows created in Step 2, via the Supabase dashboard, so the database starts empty for Fase 2.

- [ ] **Step 7: Commit**

```bash
git add scripts/verificar-rls.mjs
git commit -m "test: add RLS cross-student isolation verification script"
```

(The script is committed with placeholder passwords, not the real disposable-test ones used during manual verification — replace the `SENHA_DO_TESTE_*` placeholders back to non-functional placeholders before this commit if real passwords were typed in during Step 5.)

---

### Task 9: Documentation

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Add a section to `README.md`**

```markdown
## Área do aluno (`/atividades/`)

Essa pasta é o começo do app onde o aluno faz login e acompanha o curso.
Hoje ela só tem cadastro, login, recuperação de senha e um painel que
mostra as trilhas em que o aluno está matriculado — ainda não tem aula,
vídeo nem certificado (isso vem nas próximas etapas).

Os dados ficam no Supabase (não neste repositório). Para matricular um
aluno manualmente (antes de o pagamento automático existir):

1. Entre no painel do Supabase (supabase.com/dashboard), no projeto
   listado em `supabase/project-info.md`.
2. Vá em Table Editor → `matriculas` → Insert row.
3. Preencha `aluno_id` (pegue o ID do aluno em Authentication → Users),
   `trilha_id` (crie a trilha antes em Table Editor → `trilhas`, se
   ainda não existir), `data_expiracao` (data de hoje + 12 meses) e
   `status: ativa`.

Nunca coloque a chave "service_role" do Supabase em nenhum arquivo
deste repositório — só a chave "anon" (pública) é usada no site.
```

- [ ] **Step 2: Verify**

Run: `grep -c "atividades" README.md`
Expected: 1 or more.

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: document the /atividades/ student area and manual enrollment"
```

---

## Self-Review Notes

- **Spec coverage:** every table, RLS policy, page, and acceptance criterion in `2026-08-04-fundacao-tecnica-atividades-design.md` maps to a task above. The "fora de escopo" items (payment automation, real lesson content, certificate issuance) are correctly absent from this plan.
- **Placeholder scan:** the only literal placeholders are `SUPABASE_URL`/`SUPABASE_ANON_KEY` and the two test passwords in Task 8's script — all are real external values that don't exist until earlier tasks produce them, not deferred design decisions, and each is clearly marked with where the real value comes from.
- **Type/name consistency:** table and column names (`perfis.nome`, `matriculas.status`, `matriculas.trilha_id`, `trilhas.nome`/`descricao`) are used identically in the SQL (Task 2) and in every JS query (Tasks 4–8). The `aulas` RLS policy was reordered to create `matriculas` before `aulas` so the policy's subquery resolves.
