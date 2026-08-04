# Contexto para a próxima conversa — Fase 3: Entrega da aula

Este documento existe porque a Fase 3 começou a ser discutida numa conversa que já
estava enorme (dois projetos inteiros construídos do zero na mesma sessão) e foi
deliberadamente encerrada ali, sem design finalizado, para a Fase 3 começar numa
conversa nova e limpa. Este arquivo é a ponte entre as duas — leia ele inteiro
antes de propor qualquer coisa.

## Objetivo desta próxima conversa

Desenhar e implementar a **Fase 3: Entrega da aula**, do plano de 4 fases já
descrito em `docs/superpowers/specs/2026-08-04-fundacao-tecnica-atividades-design.md`
(leia esse arquivo primeiro — ele é a spec da Fase 1, já implementada, e contém a
decisão de arquitetura geral, o modelo de dados completo incluindo a tabela
`progresso`, e o texto exato da Fase 3 no início do arquivo).

Decisão já tomada com o Gregory (não precisa perguntar de novo): **a Fase 3 vai
usar a tabela `progresso` desde já** — não é para simplificar para "só link sem
rastrear conclusão". Isso significa que o app de atividades vai precisar saber
qual aluno está logado e avisar o Supabase quando uma aula é concluída.

## Onde as coisas estão hoje

### Projeto 1 — site institucional + portal do aluno (este repositório)

- Repositório: https://github.com/gregoryams84-lang/site-toca-o-negocio
- Domínio: `tocaonegocio.com.br` (GitHub Pages + CNAME)
- `index.html`, `termos.html`, `privacidade.html` — site institucional, pronto, não mexer.
- `/atividades/` — portal do aluno (Fase 1, já pronta e publicada):
  - `entrar.html`, `cadastro.html`, `esqueci-senha.html`, `nova-senha.html` — fluxo de login via Supabase Auth.
  - `painel.html` + `atividades/js/painel.js` — lista as trilhas em que o aluno tem matrícula ativa (só nome/descrição, ainda **não lista aulas nem linka pra atividade** — isso é o que a Fase 3 constrói).
- Banco: Supabase (Postgres + Auth + RLS). Ref e chave pública em `supabase/project-info.md`. Migrações em `supabase/migrations/` — a tabela `aulas` existe mas está vazia e **não tem nenhum campo apontando para a atividade interativa** (nem para o app do Projeto 2 abaixo). A tabela `progresso` existe (schema em `0001_fundacao.sql`), vazia, sem nenhuma política de RLS de escrita ainda testada em uso real.

### Projeto 2 — app de atividades interativas (repositório separado)

- Repositório: https://github.com/gregoryams84-lang/app-atividades-curso
- Publicado (GitHub Pages, domínio próprio `github.io`, **sem domínio customizado**): https://gregoryams84-lang.github.io/app-atividades-curso/
- URL de uma atividade: `atividade.html?trilha=trilha-ia&aula=aula-01`
- **Não tem login nenhum.** Todo o progresso do aluno fica em `localStorage` do navegador dele, isolado por trilha/aula. Isso foi uma decisão deliberada de design (spec original pedia "sem backend e sem banco de dados") — a Fase 3 vai *mudar* essa premissa para essa aula específica passar a também avisar o Supabase, mas o app precisa continuar funcionando standalone (sem quebrar o uso sem login, se isso ainda fizer sentido — a decidir).
- Arquitetura: HTML/CSS/JS puro, sem build, ES modules. Motor de renderização genérico por tipo de bloco (`cenario`, `lista_aberta`, `calculo`, `escolha_simples`), navegação por hash (`#bloco-N`), um módulo único (`js/armazenamento.js`) responsável por *todo* acesso a `localStorage`.
- Documentação completa da arquitetura atual: `docs/superpowers/specs/2026-08-03-app-atividades-v2-design.md` e `docs/superpowers/plans/2026-08-03-app-atividades-v2.md` (dentro do repositório do Projeto 2) — **leia antes de propor qualquer mudança nele**, para não violar decisões já tomadas e revisadas (por exemplo: "nenhuma função conhece conteúdo de uma aula específica" é uma regra dura do projeto).
- Passou por revisão final completa antes de publicar — encontrou e corrigiu bugs reais (perda de dados na conclusão da última aula, tela em branco em estados de erro, etc). 48 testes automatizados (`node --test js/*.test.js`) cobrindo os módulos puros.

## O problema central que esta conversa precisa resolver primeiro

Os dois projetos estão em **domínios diferentes** (`tocaonegocio.com.br` vs
`github.io`). O Supabase Auth guarda a sessão do aluno em `localStorage`, que é
isolado por origem — o app de atividades, hospedado em outro domínio, não
enxerga naturalmente a sessão de login feita em `tocaonegocio.com.br`.

Isso precisa de uma decisão de arquitetura antes de qualquer código. Algumas
direções possíveis (não exaustivo, é o ponto de partida da conversa, não uma
resposta pronta):

1. **Publicar o app de atividades dentro do mesmo domínio/origem** do portal
   (por exemplo, movê-lo para dentro deste repositório, em algo como
   `/atividades/aula/`, ou usar um subdomínio que compartilhe cookies) —
   assim a sessão do Supabase é naturalmente visível para o app de atividades.
2. **Passar um token pela URL** quando o painel linka para a atividade, e o
   app de atividades importa o cliente Supabase JS para autenticar de forma
   independente nessa outra origem, usando esse token.
3. Alguma outra abordagem que a conversa nova avalie.

Cada uma tem trade-offs reais (complexidade de deploy, segurança do token na
URL/histórico do navegador, se o app de atividades continua podendo ser usado
sem login para outros contextos futuros, etc.) — vale o processo normal de
brainstorming (2-3 abordagens, prós/contras, recomendação) antes de decidir.

## Decisões já tomadas na conversa anterior (não precisa perguntar de novo)

- O painel vai listar as aulas de cada trilha matriculada (título + link),
  ordenadas por `ordem` — hoje ele só lista a trilha, não as aulas dela.
- A tabela `aulas` vai ganhar um campo novo de texto (nome sugerido:
  `link_atividade`) guardando a URL completa da atividade correspondente.
- Ainda não existe nenhuma trilha nem aula cadastrada no banco — a trilha "IA
  no Negócio" e a Aula 1 (conteúdo já existe e está publicado no Projeto 2)
  precisam ser inseridas como parte deste trabalho.
- Trilha matriculada sem nenhuma aula cadastrada ainda deve mostrar algo como
  "Em breve", não uma lista vazia sem explicação.
- **Novidade desta decisão final:** a tabela `progresso` vai ser usada já
  nesta fase (não adiada) — o app de atividades precisa gravar conclusão de
  aula lá, o que implica resolver o problema de sessão cross-domain acima.

## Processo a seguir

Mesmo processo usado nas duas conversas anteriores: `superpowers:brainstorming`
primeiro (explorar o contexto acima, propor 2-3 abordagens para o problema de
sessão cross-domain, apresentar o design em seções, escrever a spec, autorrevisão,
aprovação do Gregory) → `superpowers:writing-plans` → `superpowers:subagent-driven-development`
(um subagente por tarefa, revisão de cada tarefa, revisão final de ponta a ponta).

Isso funcionou bem nas duas rodadas anteriores, incluindo pegar bugs reais antes
de publicar — vale manter o mesmo rigor aqui, já que agora envolve dinheiro
(matrícula) e dados de aluno de verdade, não só um app local.
