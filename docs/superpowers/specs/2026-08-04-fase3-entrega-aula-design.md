# Fase 3 — Entrega da aula

Data: 2026-08-04

## Objetivo

Terceira das quatro fases do app próprio de curso (ver decomposição completa em
`2026-08-04-fundacao-tecnica-atividades-design.md`). O painel do aluno passa a
listar as aulas de cada trilha matriculada e a linkar para a atividade
interativa correspondente. A conclusão de uma aula, hoje só rastreada em
`localStorage` no app de atividades, passa a também ser gravada na tabela
`progresso` do Supabase — usando-a desde já, não adiando para uma fase futura.

Este trabalho abrange **dois repositórios**:

- `site-toca-o-negocio` (este repositório) — site institucional + portal do
  aluno (`/atividades/`), publicado em `tocaonegocio.com.br`.
- `app-atividades-curso` (repositório separado) — motor de atividades
  interativas, publicado em `https://gregoryams84-lang.github.io/app-atividades-curso/`.

Contexto completo da decisão (histórico, estado de cada projeto antes desta
fase) em `2026-08-04-fase3-entrega-aula-CONTEXTO.md`.

## O problema central

Os dois projetos vivem em origens diferentes (`tocaonegocio.com.br` vs
`github.io`). O Supabase Auth guarda a sessão do aluno em `localStorage`, que
é isolado por origem — o app de atividades não enxerga naturalmente a sessão
de login feita no portal.

Decisão de produto que resolve parte do problema antes de chegar na técnica:
**o app de atividades não precisa mais funcionar sem login/matrícula.** Isso
era uma restrição de design de antes de existir produto pago; hoje todo
acesso a aula passa pelo portal logado. Isso elimina a necessidade de
preservar um modo standalone como caminho de produto, mas **não elimina** a
separação em dois repositórios, que segue sendo a arquitetura desejada (dev,
testes e docs do app de atividades continuam isolados do site institucional).

## Decisão de arquitetura

**Token de sessão pela URL (fragment), consumido como uma chamada de API
pontual e autenticada — sem sessão persistente na segunda origem.**

Quando o painel monta o link de uma aula, ele acrescenta o `matricula_id` e o
`aula_id` (uuids que o painel já tem em mãos, da própria consulta ao
Supabase) como query params, e o `access_token` da sessão atual do aluno como
fragmento da URL:

```
<link_atividade>?...&matricula_id=<uuid>&aula_id=<uuid>#tok=<access_token>
```

O app de atividades lê esses três valores no carregamento de `atividade.html`,
guarda-os **só em memória** (nunca em `localStorage`/`sessionStorage`) e limpa
o fragmento da URL imediatamente via `history.replaceState`. Quando o motor já
existente marca a aula como concluída localmente, o app faz uma chamada
`fetch` direta ao REST do Supabase, autenticada com esse token, fazendo
upsert em `progresso`. Não importa o SDK `supabase-js` nem mantém sessão — é
uma chamada de rede pontual, no mesmo espírito "sem backend" que já rege o
app de atividades.

A política de RLS já existente em `progresso` (aluno só escreve linhas cuja
`matricula_id` pertence a ele) é o que efetivamente autoriza ou nega a
escrita — o token não é uma "chave mestra", só prova quem é o aluno.

### Por que o fragmento, e não query string, para o token

O fragmento (`#tok=...`) nunca é enviado ao servidor: não aparece em logs de
acesso do GitHub Pages, não vai no cabeçalho `Referer` de nenhum request
subsequente feito pela página. `matricula_id`/`aula_id` podem ir como query
normal porque, sozinhos, não autorizam nada — sem um token válido do próprio
dono da matrícula, a RLS nega a escrita.

### Alternativas consideradas e descartadas

1. **Mesma origem** — mover o app de atividades para dentro de
   `tocaonegocio.com.br/atividades/aula/`, o que faria a sessão do Supabase
   (localStorage) ficar naturalmente visível sem nenhum código de handoff.
   Descartada porque GitHub Pages só serve um repositório por domínio
   customizado — exigiria um workflow de sincronização entre os dois
   repositórios (PAT, deploy key, atraso entre merge e publicação, dois repos
   contribuindo para o mesmo site publicado). Resolve um problema mais amplo
   (acesso replicado, leitura de progresso no painel de graça) do que o que
   esta fase pede (uma escrita pontual). Fica registrada como opção para uma
   fase futura, se um dia a leitura de progresso no painel do site se tornar
   necessária.
2. **Subdomínio compartilhado com sessão via cookie** —
   `aulas.tocaonegocio.com.br`, trocando o storage do client Supabase por
   cookies com `Domain=.tocaonegocio.com.br` (o padrão usado por
   `@supabase/ssr` para SSO entre subdomínios, com chunking porque o JWT não
   cabe num cookie só). Descartada pelo mesmo motivo: infraestrutura nova
   (DNS, storage adapter customizado, allowlist de redirect do Supabase Auth)
   desproporcional ao escopo desta fase.

## Modelo de dados

Migração nova em `supabase/migrations/`:

```sql
alter table aulas add column link_atividade text;
```

`link_atividade` fica `null` até a aula ter atividade pronta — o painel trata
esse caso mostrando o título sem link clicável (ver seção Painel).

### Reforço de RLS (correção de lacuna existente, não nova regra)

A política de escrita de `progresso` hoje checa só se a matrícula pertence ao
aluno, sem checar se ela está `ativa` e dentro do prazo — a política de
`aulas` já faz essa checagem (migração `0002_correcoes_seguranca.sql`),
`progresso` ficou de fora. Corrigido nesta fase porque esta é a primeira vez
que `progresso` recebe escrita real de fora do painel administrativo, e o
projeto agora envolve dinheiro (matrícula) e dados de aluno de verdade:

```sql
alter policy "aluno atualiza proprio progresso" on progresso
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

### Conteúdo (seed)

Migração de dados inserindo a trilha "IA no Negócio" (`slug: trilha-ia`) e a
Aula 1 (conteúdo já existe e está publicado no app de atividades), com:

```
link_atividade = https://gregoryams84-lang.github.io/app-atividades-curso/atividade.html?trilha=trilha-ia&aula=aula-01
```

Versionado como migração (não inserção manual pelo dashboard do Supabase),
porque é conteúdo estrutural do curso — diferente de matrícula, que é por
aluno e continua sendo criada manualmente pelo dashboard nesta fase (Fase 2
automatiza isso).

## Painel (`atividades/js/painel.js`, `atividades/painel.html`)

- A consulta de matrículas passa a embutir as aulas de cada trilha:
  `trilhas ( id, nome, descricao, aulas ( id, titulo, ordem, link_atividade ) )`,
  ordenadas por `ordem`.
- Trilha matriculada sem nenhuma aula cadastrada ainda → mostra "Em breve" no
  lugar da lista de aulas (não uma lista vazia sem explicação).
- Aula sem `link_atividade` (conteúdo ainda não publicado) → aparece o
  título, sem link clicável.
- Aula com `link_atividade` → o painel monta a URL final (query params +
  fragmento com token) no momento de renderizar a lista. O token é sempre o
  da sessão atual (`supabase.auth.getSession()` já é chamado nesta página) —
  nunca reaproveitado de uma renderização anterior, o que mantém o token
  sempre "fresco" sem precisar de nenhuma lógica extra de expiração.

## App de atividades — novo módulo `js/progresso-remoto.js`

Único módulo responsável por todo contato com o Supabase a partir do app de
atividades — mesmo princípio de responsabilidade única já usado em
`armazenamento.js` (único módulo que toca `localStorage`) e `dependencias.js`.

```js
async function lerParametrosDeSessao()   // lê matricula_id/aula_id/tok da URL no carregamento, limpa o fragmento
async function notificarConclusao()      // upsert em progresso via fetch autenticado
```

- `lerParametrosDeSessao()` roda uma vez, no carregamento de `atividade.html`.
  Se os parâmetros não estiverem presentes (ex.: link antigo, acesso direto
  sem vir do painel), o app segue funcionando 100% local — esse não é mais um
  modo de produto suportado, mas não pode quebrar nada se acontecer.
- `notificarConclusao()` faz `POST` para
  `.../rest/v1/progresso?on_conflict=matricula_id,aula_id` com
  `Authorization: Bearer <token>` e `apikey: <chave anônima>`, corpo
  `{ matricula_id, aula_id, concluida: true, concluida_em: <agora> }`. A
  constraint única `(matricula_id, aula_id)` já existente faz o upsert não
  duplicar se o aluno completar a aula mais de uma vez.
- Ponto de disparo: no mesmo lugar em que o motor hoje decide que uma aula
  está concluída localmente (atualização do índice em `armazenamento.js`), e
  também ao carregar uma aula que **já estava** concluída localmente e chegou
  com parâmetros de sessão válidos — isso torna o espelho remoto
  auto-curativo (se uma tentativa anterior falhou por falta de rede, a
  próxima vez que o aluno reabrir a aula pelo painel tenta de novo) sem
  precisar de fila ou retry com estado próprio.
- Chamada é melhor-esforço: qualquer falha (token expirado, sem rede, RLS
  negando) gera só um aviso no console — nenhuma tela, banner ou bloqueio
  para o aluno. Mesmo padrão já usado para falha de `localStorage`
  indisponível. O progresso local continua sendo a fonte de verdade da
  experiência do aluno; o Supabase é um espelho para fins de acompanhamento
  administrativo (matrícula, conclusão).

## Estados de erro

| Situação | Comportamento |
|---|---|
| Consulta de aulas falha no painel | Trilha aparece sem lista de aulas + aviso curto, resto do painel continua funcionando |
| Aula sem `link_atividade` | Título aparece, sem link |
| Trilha sem nenhuma aula cadastrada | "Em breve" |
| App de atividades carregado sem parâmetros de sessão | Funciona 100% local, sem sincronizar |
| Token expirado ou inválido | Aula funciona normal; `notificarConclusao()` falha silenciosamente (aviso em console) |
| `matricula_id`/`aula_id` adulterados na URL para outro aluno | RLS nega a escrita (token não corresponde ao dono da matrícula) |
| Matrícula expirada/cancelada | RLS nega a escrita em `progresso` (reforço desta fase) |

## Testes e critérios de aceite

- Aluno com matrícula ativa em "IA no Negócio" vê a Aula 1 listada no
  painel, com link funcional, sem precisar logar de novo no app de
  atividades.
- Completar a aula grava a linha correta em `progresso`
  (`concluida = true`, `concluida_em` preenchido, `matricula_id`/`aula_id`
  corretos) — verificável no dashboard do Supabase.
- Completar a mesma aula de novo não cria uma segunda linha.
- Adulterar `matricula_id` ou `aula_id` na URL para apontar para outro
  aluno não consegue gravar progresso (RLS nega).
- Aluno com matrícula expirada não consegue gravar progresso, mesmo com
  token válido.
- Acessar `atividade.html` sem os parâmetros de sessão (ex.: link antigo)
  continua funcionando localmente, sem erro no console além do aviso
  esperado de "sem sincronizar".
- Trilha matriculada sem aula cadastrada mostra "Em breve".
- Site institucional (`index.html`, `termos.html`, `privacidade.html`) e o
  resto do fluxo do portal (login, cadastro, recuperação de senha) sem
  regressão.
- Suite de testes existente do app de atividades (`node --test js/*.test.js`)
  continua passando; `progresso-remoto.js` ganha testes próprios para
  `lerParametrosDeSessao` (parsing/limpeza da URL) — `notificarConclusao`
  depende de rede/Supabase real, então cobertura automatizada fica limitada
  à construção do payload/URL, com verificação de ponta a ponta manual
  documentada em `TESTES-MANUAIS.md`.

## Fora de escopo nesta fase

- Leitura de `progresso` de volta no painel do site (ex.: "✓ concluída" ao
  lado da aula) — fica registrada como extensão natural de uma fase futura,
  não incluída aqui.
- Qualquer modo de acesso ao app de atividades sem matrícula/login.
- Migrar o app de atividades para o mesmo domínio do site (opção descartada
  nesta fase, ver seção de alternativas).
- Emissão de certificado — Fase 4.
- Painel administrativo dedicado — matrícula e conteúdo continuam sendo
  geridos via migrações versionadas e/ou dashboard do Supabase.
