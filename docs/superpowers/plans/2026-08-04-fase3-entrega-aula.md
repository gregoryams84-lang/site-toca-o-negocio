# Fase 3 — Entrega da aula — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** O painel do aluno lista as aulas de cada trilha matriculada e linka para a atividade correspondente; ao concluir uma aula, o app de atividades grava a conclusão na tabela `progresso` do Supabase.

**Architecture:** Token de sessão passado pelo fragmento da URL do painel para o app de atividades (origem separada). O app de atividades consome esse token como uma chamada `fetch` autenticada e pontual ao REST do Supabase (upsert em `progresso`) — sem manter sessão persistente na segunda origem, sem importar o SDK `supabase-js` lá. RLS já existente autoriza a escrita.

**Tech Stack:** Postgres/Supabase (SQL migrations, RLS), HTML/CSS/JS estático sem build (dois repositórios), `node --test` para os módulos puros do app de atividades.

## Global Constraints

- Dois repositórios envolvidos: `site-toca-o-negocio` (working directory atual) e `app-atividades-curso` (em `C:\Users\robot\Documents\app-atividades-curso`) — cada task indica em qual repositório trabalhar.
- Sem framework, sem build step, em nenhum dos dois repositórios.
- Token de sessão (`access_token`) só pode trafegar no **fragmento** da URL (`#tok=...`), nunca em query string — fragmento não é enviado a servidor nem aparece em `Referer`.
- `matricula_id`/`aula_id` podem ir como query string normal — sozinhos não autorizam nada, a RLS exige que o `access_token` corresponda ao dono da matrícula.
- Nenhuma chamada ao Supabase feita pelo app de atividades pode bloquear ou quebrar a experiência do aluno — falha é só um aviso em `console.warn`, nunca uma tela ou banner.
- `node --test js/*.test.js` (dentro de `app-atividades-curso`) precisa continuar passando a cada task que o toca.
- Chave anônima do Supabase (`sb_publishable_...`) é pública por design — pode aparecer hardcoded no código-fonte de ambos os repositórios (já é assim em `atividades/js/supabase-client.js`).

---

## Task 1: Migração — coluna `link_atividade` e reforço de RLS em `progresso`

**Repositório:** `site-toca-o-negocio`

**Files:**
- Create: `supabase/migrations/0003_aulas_link_atividade_e_progresso_rls.sql`

**Interfaces:**
- Produces: coluna `aulas.link_atividade text` (nullable) e política `"aluno atualiza proprio progresso"` em `progresso` agora também exige `matriculas.status = 'ativa' and matriculas.data_expiracao > now()`. Tasks 2, 3 e 4 dependem dessa coluna existir; a política mais restrita é o que a Task 6 verifica.

- [ ] **Step 1: Escrever a migração**

```sql
-- supabase/migrations/0003_aulas_link_atividade_e_progresso_rls.sql

alter table aulas add column link_atividade text;

-- A política de escrita de progresso checava só se a matrícula pertence ao
-- aluno, sem checar se ela está ativa e dentro do prazo (a política de
-- `aulas` já fazia essa checagem desde 0002; `progresso` ficou de fora).
-- Corrigido aqui porque esta é a primeira vez que `progresso` recebe escrita
-- real de fora do painel administrativo.
alter policy "aluno atualiza proprio progresso" on progresso
  using (
    exists (
      select 1 from matriculas
      where matriculas.id = progresso.matricula_id
      and matriculas.aluno_id = auth.uid()
      and matriculas.status = 'ativa'
      and matriculas.data_expiracao > now()
    )
  )
  with check (
    exists (
      select 1 from matriculas
      where matriculas.id = progresso.matricula_id
      and matriculas.aluno_id = auth.uid()
      and matriculas.status = 'ativa'
      and matriculas.data_expiracao > now()
    )
  );
```

- [ ] **Step 2: Aplicar a migração**

```bash
supabase db push
```

- [ ] **Step 3: Verificar a coluna e a política**

```bash
supabase db execute "select column_name, is_nullable from information_schema.columns where table_name = 'aulas' and column_name = 'link_atividade';"
```

Expected: 1 linha, `link_atividade`, `is_nullable = YES`.

```bash
supabase db execute "select polname, pg_get_expr(polqual, polrelid) as using_expr from pg_policy where polname = 'aluno atualiza proprio progresso';"
```

Expected: `using_expr` contém `status = 'ativa'::text` e `data_expiracao > now()`.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/0003_aulas_link_atividade_e_progresso_rls.sql
git commit -m "feat: add aulas.link_atividade and require active enrollment to write progresso"
```

---

## Task 2: Migração de seed — trilha "IA no Negócio" e Aula 1

**Repositório:** `site-toca-o-negocio`

**Files:**
- Create: `supabase/migrations/0004_seed_trilha_ia_aula_01.sql`

**Interfaces:**
- Consumes: coluna `aulas.link_atividade` (Task 1).
- Produces: uma linha em `trilhas` (`slug = 'trilha-ia'`) e uma linha em `aulas` (`ordem = 1`, `link_atividade` apontando para a atividade publicada). Task 3 (painel) e Task 6 (verificação) dependem desses dados existirem.

- [ ] **Step 1: Escrever a migração**

```sql
-- supabase/migrations/0004_seed_trilha_ia_aula_01.sql

insert into trilhas (nome, descricao, slug)
values (
  'IA no Negócio',
  'Reconheça onde a IA já pode ajudar seu negócio e aprenda a aplicar isso na prática, aula a aula.',
  'trilha-ia'
);

insert into aulas (trilha_id, titulo, ordem, link_atividade)
select
  id,
  'Você já usa IA. O problema é como.',
  1,
  'https://gregoryams84-lang.github.io/app-atividades-curso/atividade.html?trilha=trilha-ia&aula=aula-01'
from trilhas
where slug = 'trilha-ia';
```

- [ ] **Step 2: Aplicar a migração**

```bash
supabase db push
```

- [ ] **Step 3: Verificar os dados**

```bash
supabase db execute "select t.slug, a.titulo, a.ordem, a.link_atividade from aulas a join trilhas t on t.id = a.trilha_id where t.slug = 'trilha-ia';"
```

Expected: 1 linha — `trilha-ia`, `Você já usa IA. O problema é como.`, `1`, a URL completa do `link_atividade`.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/0004_seed_trilha_ia_aula_01.sql
git commit -m "feat: seed trilha IA no Negocio and its first aula"
```

---

## Task 3: Painel lista as aulas de cada trilha e monta o link de sessão

**Repositório:** `site-toca-o-negocio`

**Files:**
- Modify: `atividades/js/painel.js`
- Modify: `css/estilo.css`

**Interfaces:**
- Consumes: `aulas.link_atividade`, `aulas.ordem`, `aulas.titulo`, `aulas.id` (Tasks 1–2); `session.access_token` de `supabase.auth.getSession()` (já usado na página).
- Produces: URLs no formato `<link_atividade>?matricula_id=<uuid>&aula_id=<uuid>#tok=<access_token>` — Task 5 (app de atividades) depende desse formato exato de parâmetros.

- [ ] **Step 1: Atualizar `painel.js`**

Substituir o conteúdo de `atividades/js/painel.js` por:

```js
import { supabase } from './supabase-client.js';

const lista = document.getElementById('lista-matriculas');
const vazio = document.getElementById('sem-matricula');
const saudacao = document.getElementById('saudacao');

function montarLinkAtividade(linkBase, matriculaId, aulaId, accessToken) {
  const url = new URL(linkBase);
  url.searchParams.set('matricula_id', matriculaId);
  url.searchParams.set('aula_id', aulaId);
  url.hash = `tok=${encodeURIComponent(accessToken)}`;
  return url.toString();
}

function renderizarAulas(container, aulas, matriculaId, accessToken) {
  if (aulas.length === 0) {
    const emBreve = document.createElement('p');
    emBreve.textContent = 'Em breve.';
    container.appendChild(emBreve);
    return;
  }
  const listaAulas = document.createElement('ul');
  listaAulas.className = 'lista-aulas-trilha';
  for (const aula of aulas) {
    const item = document.createElement('li');
    if (aula.link_atividade) {
      const link = document.createElement('a');
      link.href = montarLinkAtividade(aula.link_atividade, matriculaId, aula.id, accessToken);
      link.textContent = aula.titulo;
      item.appendChild(link);
    } else {
      item.className = 'aula-em-breve';
      item.textContent = `${aula.titulo} (em breve)`;
    }
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
      renderizarAulas(item, aulasOrdenadas, matricula.id, session.access_token);

      lista.appendChild(item);
    }
  }
}

document.getElementById('sair').addEventListener('click', async () => {
  await supabase.auth.signOut();
  window.location.href = 'entrar.html';
});
```

- [ ] **Step 2: Adicionar estilo mínimo para a lista de aulas**

Em `css/estilo.css`, logo depois da regra `.trilha-card h3, .passo-card h3 { color: var(--verde); }` (linhas 126-128), acrescentar:

```css
.lista-aulas-trilha {
  list-style: none;
  padding: 0;
  margin: 12px 0 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.lista-aulas-trilha a {
  color: var(--verde);
  text-decoration: underline;
}

.lista-aulas-trilha .aula-em-breve {
  color: var(--neutro);
}
```

- [ ] **Step 3: Verificar manualmente no navegador**

Sirva o repositório localmente (ex.: `python3 -m http.server 8000` na raiz) e abra `http://localhost:8000/atividades/painel.html` logado como um aluno de teste matriculado em "IA no Negócio" (matrícula criada manualmente via dashboard do Supabase, como nas fases anteriores).

Expected:
- O card da trilha "IA no Negócio" mostra a Aula 1 como um link.
- Inspecionar o `href` do link (botão direito → copiar link, ou DevTools) confirma o formato `atividade.html?trilha=trilha-ia&aula=aula-01&matricula_id=...&aula_id=...#tok=...`.
- Um aluno matriculado numa trilha sem nenhuma aula cadastrada (crie uma segunda trilha de teste sem aulas, matricule o mesmo aluno) mostra "Em breve." no lugar da lista.

- [ ] **Step 4: Commit**

```bash
git add atividades/js/painel.js css/estilo.css
git commit -m "feat: list trilha lessons in the student dashboard and link to the activity app"
```

---

## Task 4: Módulo `progresso-remoto.js` no app de atividades (TDD)

**Repositório:** `app-atividades-curso` (em `C:\Users\robot\Documents\app-atividades-curso`)

**Files:**
- Create: `js/progresso-remoto.js`
- Test: `js/progresso-remoto.test.js`

**Interfaces:**
- Produces: `extrairParametrosDeSessao(search, hash)` → `{ matriculaId, aulaId, token } | null`; `lerELimparParametrosDeSessao()` → mesmo formato, lendo de `window.location` e limpando o fragmento; `notificarConclusao(sessao, fetchImpl = fetch)` → `Promise<boolean>`. Task 5 consome as três.

- [ ] **Step 1: Escrever os testes (falhando)**

Criar `js/progresso-remoto.test.js`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extrairParametrosDeSessao, notificarConclusao } from './progresso-remoto.js';

test('extrai matricula, aula e token quando os tres parametros estao presentes', () => {
  const sessao = extrairParametrosDeSessao('?matricula_id=m1&aula_id=a1', '#tok=abc123');
  assert.deepEqual(sessao, { matriculaId: 'm1', aulaId: 'a1', token: 'abc123' });
});

test('decodifica o token quando ele vem url-encoded', () => {
  const sessao = extrairParametrosDeSessao('?matricula_id=m1&aula_id=a1', `#tok=${encodeURIComponent('a.b/c')}`);
  assert.equal(sessao.token, 'a.b/c');
});

test('retorna null quando falta o token no hash', () => {
  const sessao = extrairParametrosDeSessao('?matricula_id=m1&aula_id=a1', '');
  assert.equal(sessao, null);
});

test('retorna null quando falta matricula_id', () => {
  const sessao = extrairParametrosDeSessao('?aula_id=a1', '#tok=abc123');
  assert.equal(sessao, null);
});

test('retorna null quando falta aula_id', () => {
  const sessao = extrairParametrosDeSessao('?matricula_id=m1', '#tok=abc123');
  assert.equal(sessao, null);
});

test('notificarConclusao nao chama fetch quando sessao e null', async () => {
  let chamou = false;
  const resultado = await notificarConclusao(null, async () => { chamou = true; });
  assert.equal(resultado, false);
  assert.equal(chamou, false);
});

test('notificarConclusao envia bearer token e ids corretos, retorna true em sucesso', async () => {
  let urlChamada;
  let opcoesChamadas;
  const fetchFalso = async (url, opcoes) => {
    urlChamada = url;
    opcoesChamadas = opcoes;
    return { ok: true };
  };
  const resultado = await notificarConclusao({ matriculaId: 'm1', aulaId: 'a1', token: 'tok123' }, fetchFalso);
  assert.equal(resultado, true);
  assert.match(urlChamada, /\/rest\/v1\/progresso\?on_conflict=matricula_id,aula_id$/);
  assert.equal(opcoesChamadas.headers.Authorization, 'Bearer tok123');
  const corpo = JSON.parse(opcoesChamadas.body);
  assert.equal(corpo.matricula_id, 'm1');
  assert.equal(corpo.aula_id, 'a1');
  assert.equal(corpo.concluida, true);
});

test('notificarConclusao retorna false quando a resposta nao e ok, sem lancar erro', async () => {
  const fetchFalso = async () => ({ ok: false, status: 401 });
  const resultado = await notificarConclusao({ matriculaId: 'm1', aulaId: 'a1', token: 'tok123' }, fetchFalso);
  assert.equal(resultado, false);
});

test('notificarConclusao retorna false quando o fetch rejeita, sem lancar erro', async () => {
  const fetchFalso = async () => { throw new Error('sem rede'); };
  const resultado = await notificarConclusao({ matriculaId: 'm1', aulaId: 'a1', token: 'tok123' }, fetchFalso);
  assert.equal(resultado, false);
});
```

- [ ] **Step 2: Rodar os testes e confirmar que falham**

Run: `npm test` (equivalente a `node --test js/*.test.js`)
Expected: FAIL — `Cannot find module './progresso-remoto.js'` (ou equivalente).

- [ ] **Step 3: Implementar `js/progresso-remoto.js`**

```js
const SUPABASE_URL = 'https://tldmtouhyiglqszwxdmc.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_dhQZyHqufAU9vfR2KLEkHQ_hdx5c5ki';

export function extrairParametrosDeSessao(search, hash) {
  const parametros = new URLSearchParams(search);
  const matriculaId = parametros.get('matricula_id');
  const aulaId = parametros.get('aula_id');
  const combinacao = /^#tok=(.+)$/.exec(hash || '');
  const token = combinacao ? decodeURIComponent(combinacao[1]) : null;
  if (!token || !matriculaId || !aulaId) return null;
  return { matriculaId, aulaId, token };
}

export function lerELimparParametrosDeSessao() {
  const sessao = extrairParametrosDeSessao(window.location.search, window.location.hash);
  if (sessao) {
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }
  return sessao;
}

export async function notificarConclusao(sessao, fetchImpl = fetch) {
  if (!sessao) return false;
  try {
    const resposta = await fetchImpl(`${SUPABASE_URL}/rest/v1/progresso?on_conflict=matricula_id,aula_id`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${sessao.token}`,
        Prefer: 'resolution=merge-duplicates,return=minimal'
      },
      body: JSON.stringify({
        matricula_id: sessao.matriculaId,
        aula_id: sessao.aulaId,
        concluida: true,
        concluida_em: new Date().toISOString()
      })
    });
    if (!resposta.ok) {
      console.warn(`Não foi possível sincronizar a conclusão da aula com o Supabase (status ${resposta.status}).`);
      return false;
    }
    return true;
  } catch (erro) {
    console.warn('Não foi possível sincronizar a conclusão da aula com o Supabase.', erro);
    return false;
  }
}
```

- [ ] **Step 4: Rodar os testes e confirmar que passam**

Run: `npm test`
Expected: PASS — todos os testes de `progresso-remoto.test.js`, mais os já existentes (`armazenamento`, `blocos`, `dependencias`, `formula`) continuam passando.

- [ ] **Step 5: Commit**

```bash
git add js/progresso-remoto.js js/progresso-remoto.test.js
git commit -m "Adiciona modulo de sincronizacao de conclusao de aula com o Supabase"
```

---

## Task 5: Conectar `progresso-remoto.js` ao motor da atividade

**Repositório:** `app-atividades-curso`

**Files:**
- Modify: `js/app.js`
- Modify: `TESTES-MANUAIS.md`

**Interfaces:**
- Consumes: `lerELimparParametrosDeSessao`, `notificarConclusao` de `js/progresso-remoto.js` (Task 4); `calcularProgresso` de `js/blocos.js` (já importado em `app.js`).

- [ ] **Step 1: Importar o novo módulo e ler a sessão uma vez, no topo do arquivo**

Em `js/app.js`, linha 14 (`import { criarResolvedorDependencias } from './dependencias.js';`), acrescentar logo depois:

```js
import { lerELimparParametrosDeSessao, notificarConclusao } from './progresso-remoto.js';
```

Em seguida, na linha 16 (`const armazenamento = criarArmazenamento(window.localStorage);`), acrescentar logo depois:

```js
const sessaoRemota = lerELimparParametrosDeSessao();
```

- [ ] **Step 2: Notificar conclusão ao avançar do último bloco**

Em `js/app.js`, dentro de `async function avancar(indiceAtual)` (linhas 512-520), o corpo atual é:

```js
  async function avancar(indiceAtual) {
    const proximo = indiceAtual + 1;
    if (proximo >= dadosAula.blocos.length) {
      await armazenamento.descarregarPendencias();
      window.location.href = 'index.html';
      return;
    }
    window.location.hash = `#bloco-${proximo + 1}`;
  }
```

Substituir por:

```js
  async function avancar(indiceAtual) {
    const proximo = indiceAtual + 1;
    if (proximo >= dadosAula.blocos.length) {
      await armazenamento.descarregarPendencias();
      notificarConclusao(sessaoRemota);
      window.location.href = 'index.html';
      return;
    }
    window.location.hash = `#bloco-${proximo + 1}`;
  }
```

Nota: `notificarConclusao` não é aguardado (`await`) de propósito — a chamada de rede não pode atrasar o redirecionamento nem bloquear o aluno.

- [ ] **Step 3: Notificar conclusão ao reabrir uma aula já concluída (auto-cura)**

Em `js/app.js`, dentro de `async function iniciarAtividade()`, logo depois do bloco (linhas 432-434):

```js
  if (armazenamento.estaIndisponivel()) {
    mostrarAvisoArmazenamentoIndisponivel();
  }
```

Acrescentar:

```js

  const respostasAtuais = await armazenamento.obterRespostasDaAula(trilha, aula);
  if (calcularProgresso(dadosAula.blocos, respostasAtuais) >= dadosAula.blocos.length) {
    notificarConclusao(sessaoRemota);
  }
```

Isso cobre o caso em que o aluno reabre pelo painel uma aula que já concluiu antes: se uma tentativa de sincronização anterior falhou (sem rede, token expirado), esta reabertura tenta de novo — sem precisar de fila ou estado de retry, já que o upsert em `progresso` é idempotente.

- [ ] **Step 4: Documentar o novo caso em `TESTES-MANUAIS.md`**

Acrescentar, antes da seção `## Já cobertos por observação direta durante o desenvolvimento`:

```markdown
## Sincronização de conclusão com o Supabase

Requer um link de sessão válido, gerado pelo painel do aluno em `tocaonegocio.com.br/atividades/painel.html` (matrícula de teste ativa, aula com `link_atividade` cadastrado).

1. Abra o DevTools (aba Network) antes de clicar no link do painel. Complete a aula até o fim. Esperado: uma requisição `POST` para `.../rest/v1/progresso?on_conflict=matricula_id,aula_id` com status `2xx`, e uma nova linha em `progresso` no dashboard do Supabase (`concluida = true`, `matricula_id`/`aula_id` corretos).
2. Complete a mesma aula de novo (ela já estava concluída). Esperado: uma nova requisição é enviada, mas o número de linhas em `progresso` para essa combinação de matrícula/aula continua sendo 1 (upsert, não duplica).
3. Acesse `atividade.html?trilha=trilha-ia&aula=aula-01` diretamente, sem vir do painel (sem `matricula_id`/`aula_id`/`#tok=`). Esperado: a atividade funciona normalmente do início ao fim; no console, nenhum erro — no máximo o aviso "Não foi possível sincronizar..." se você completar a aula sem esses parâmetros.
4. No painel, copie o link de uma aula, mas edite manualmente `matricula_id` na URL para um uuid aleatório antes de abrir. Complete a aula. Esperado: o console mostra o aviso de falha de sincronização (a RLS nega a escrita), e nenhuma linha nova aparece em `progresso` para esse uuid inventado.
```

- [ ] **Step 5: Rodar a suíte de testes completa**

Run: `npm test`
Expected: PASS — nenhuma mudança em `app.js` quebra os testes existentes (que cobrem só os módulos puros, não `app.js` em si).

- [ ] **Step 6: Commit**

```bash
git add js/app.js TESTES-MANUAIS.md
git commit -m "Sincroniza conclusao de aula com o Supabase ao avancar do ultimo bloco e ao reabrir aula ja concluida"
```

---

## Task 6: Verificação de ponta a ponta (manual)

**Repositório:** ambos, verificação apenas — sem alterações de código.

Checklist mapeado direto nos critérios de aceite da spec
(`docs/superpowers/specs/2026-08-04-fase3-entrega-aula-design.md`). Use dois
alunos de teste distintos (criados via `cadastro.html`) com matrícula ativa
em "IA no Negócio" criada manualmente pelo dashboard do Supabase, como nas
fases anteriores.

- [ ] **Step 1: Fluxo feliz**

Logar como Aluno A, abrir o painel, clicar no link da Aula 1, completar a
aula inteira. Confirmar no dashboard do Supabase (tabela `progresso`) que
existe uma linha com `matricula_id` do Aluno A, `aula_id` da Aula 1,
`concluida = true`, `concluida_em` preenchido.

- [ ] **Step 2: Não duplica**

Reabrir a mesma aula pelo painel (novo link, novo token) e completá-la de
novo. Confirmar que a tabela `progresso` continua com exatamente 1 linha
para essa combinação de `matricula_id`/`aula_id`.

- [ ] **Step 3: Isolamento entre alunos**

Logar como Aluno B (matriculado só depois de criar sua própria matrícula de
teste), pegar a URL da Aula 1 gerada para o Aluno A (ex.: compartilhada
manualmente para o teste) e tentar abri-la logado como Aluno B. Completar a
aula. Confirmar que a linha gravada em `progresso` usa o `matricula_id` do
Aluno B — nunca grava usando um `matricula_id` que não pertence a quem está
autenticado (a RLS já impede escrever com o `matricula_id` de outra pessoa;
este passo confirma que não há nenhum caminho, no código deste app, que
tente usar o token do Aluno B para gravar no `matricula_id` do Aluno A).

- [ ] **Step 4: Matrícula expirada**

No dashboard do Supabase, edite manualmente `data_expiracao` da matrícula do
Aluno A para uma data passada. Tente completar a aula de novo. Confirmar no
console do navegador o aviso de falha de sincronização, e que nenhuma
alteração é gravada em `progresso`. Reverta `data_expiracao` ao final do
teste.

- [ ] **Step 5: Trilha sem aula cadastrada**

Criar uma segunda trilha de teste no dashboard do Supabase sem nenhuma linha
em `aulas`, matricular o Aluno A nela. Confirmar que o painel mostra "Em
breve." para essa trilha, não uma lista vazia. Remover a trilha de teste ao
final.

- [ ] **Step 6: Regressão no site institucional e no restante do portal**

Navegar por `index.html`, `termos.html`, `privacidade.html`,
`entrar.html`, `cadastro.html`, `esqueci-senha.html` — confirmar que nada
quebrou. Fazer logout e login de novo pelo painel, confirmar que continua
funcionando.

- [ ] **Step 7: Registrar o resultado**

Se todos os passos acima passarem, a Fase 3 está pronta para ser considerada
concluída — nenhum commit de código neste passo, é só o checklist de
aceite.
