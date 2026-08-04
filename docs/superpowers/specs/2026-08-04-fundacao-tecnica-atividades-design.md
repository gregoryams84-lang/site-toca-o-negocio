# Fundação técnica — app de alunos (`/atividades/`)

Data: 2026-08-04

## Objetivo

Primeira de quatro fases de um app próprio de curso (matrícula, aulas,
atividades e certificado, tudo construído do zero, sem depender de
plataforma de venda de curso pronta). Esta fase constrói só a fundação:
onde os dados moram, como o aluno faz login, e a estrutura de controle
de acesso que as próximas três fases (pagamento, entrega de aula,
certificado) vão usar.

Decomposição completa do projeto (acordada antes deste spec):

1. **Fundação técnica** ← este spec
2. Pagamento e matrícula (fora de escopo aqui — webhook do processador
   de pagamento cria a linha em `matriculas`)
3. Entrega da aula (vídeo, atividade, material em PDF)
4. Certificado de conclusão de curso livre

Cada fase é um spec → plano → implementação separado.

## Contexto

O site institucional (`tocaonegocio.com.br`) já existe, é estático, e
está hospedado no GitHub Pages. O caminho `/atividades/` foi
deliberadamente reservado desde o primeiro spec do site
(`2026-08-01-site-institucional-toca-o-negocio-design.md`) para esta
aplicação. `termos.html` §3 já define o prazo de acesso do aluno em 12
meses a partir da matrícula — esse número é o que popula
`matriculas.data_expiracao` nesta fundação.

## Restrição de hospedagem

GitHub Pages só serve arquivos estáticos — sem servidor, sem banco de
dados próprio. Um app com login e controle de acesso por aluno precisa
de um serviço externo cuidando de autenticação, banco de dados e
regras de acesso.

## Decisão de arquitetura

**Backend:** Supabase (Postgres + Auth + Row Level Security), plano
gratuito.
- Banco relacional encaixa naturalmente no formato aluno → matrícula →
  progresso.
- Login (e-mail/senha, recuperação de senha) já vem pronto — não
  construímos autenticação do zero.
- Regra de acesso ("só quem pagou vê a aula") fica configurada no
  banco via Row Level Security, não espalhada pelo código do
  front-end — não dá pra burlar só inspecionando o JavaScript da
  página.
- Plano gratuito do Supabase comporta dezenas/centenas de alunos sem
  custo, consistente com a decisão do cliente de começar sem
  mensalidade.

**Front-end:** HTML/CSS/JS estático, sem framework, sem build step —
mesmo estilo do site institucional. O JavaScript de cada página usa o
cliente JS do Supabase (carregado via CDN) para checar login e ler
dados. Publicado no mesmo repositório e mesmo GitHub Pages do site
institucional, dentro da pasta `/atividades/`.

**Alternativas consideradas e descartadas:** Firebase (mesmo formato,
mas Firestore — banco não-relacional — encaixa pior no modelo
aluno/curso/progresso); backend próprio em Node.js (exigiria construir
autenticação segura do zero e um servidor pago rodando 24/7,
incompatível com a restrição de custo zero no lançamento).

## Modelo de dados

Tabelas no Postgres do Supabase (schema `public`). `auth.users` é
gerenciada pelo próprio Supabase (e-mail, senha) — as tabelas abaixo
referenciam `auth.users.id`.

```sql
create table perfis (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null,
  telefone text,
  criado_em timestamptz not null default now()
);

create table trilhas (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  descricao text,
  slug text unique not null
);

create table aulas (
  id uuid primary key default gen_random_uuid(),
  trilha_id uuid not null references trilhas(id) on delete cascade,
  titulo text not null,
  ordem int not null,
  video_url text,
  material_pdf_url text,
  descricao_atividade text
);

create table matriculas (
  id uuid primary key default gen_random_uuid(),
  aluno_id uuid not null references auth.users(id) on delete cascade,
  trilha_id uuid not null references trilhas(id) on delete cascade,
  data_matricula timestamptz not null default now(),
  data_expiracao timestamptz not null,
  status text not null default 'ativa' check (status in ('ativa', 'expirada', 'cancelada')),
  unique (aluno_id, trilha_id)
);

create table progresso (
  id uuid primary key default gen_random_uuid(),
  matricula_id uuid not null references matriculas(id) on delete cascade,
  aula_id uuid not null references aulas(id) on delete cascade,
  concluida boolean not null default false,
  concluida_em timestamptz,
  unique (matricula_id, aula_id)
);

create table certificados (
  id uuid primary key default gen_random_uuid(),
  matricula_id uuid not null references matriculas(id) on delete cascade,
  emitido_em timestamptz,
  codigo_verificacao text unique
);
```

`data_expiracao` é preenchida no momento da criação da matrícula como
`data_matricula + interval '12 months'` — a lógica que cria a linha
(manual nesta fase, via webhook de pagamento na Fase 2) é responsável
por calcular isso; não é uma coluna gerada automaticamente pelo banco,
para deixar espaço a prazos diferentes no futuro sem migração.

## Controle de acesso (Row Level Security)

RLS ligado em todas as tabelas acima. Políticas desta fase:

- `perfis`: aluno só lê/edita a própria linha (`auth.uid() = id`).
- `matriculas`: aluno só lê as próprias linhas (`auth.uid() = aluno_id`).
  Nenhuma política de escrita para o aluno nesta fase — só o painel
  administrativo do Supabase (acesso do Gregory) cria matrícula, até a
  Fase 2 automatizar isso.
- `progresso`: aluno só lê/escreve linhas cuja `matricula_id` pertence
  a ele (via subconsulta em `matriculas`).
- `trilhas` e `aulas`: leitura pública de metadados básicos (nome,
  descrição, título, ordem) — mas o campo `video_url` e
  `material_pdf_url` só devem ser lidos se existir matrícula ativa
  correspondente. Nesta fase as tabelas ficam vazias, então a política
  de acesso ao conteúdo em si (vídeo/PDF) é desenhada em detalhe na
  Fase 3 — aqui só garantimos que a tabela e a política existem e
  não vazam nada.
- `certificados`: aluno só lê as próprias linhas.

## Páginas (`/atividades/`)

Estático, sem build, consistente com o site institucional:

- `entrar.html` — login (e-mail + senha).
- `cadastro.html` — criar conta (nome, e-mail, senha) → cria linha em
  `auth.users` (Supabase) e em `perfis`.
- `esqueci-senha.html` — recuperação de senha via e-mail (fluxo pronto
  do Supabase).
- `painel.html` — painel do aluno: lista as trilhas em que há
  matrícula ativa (ou mensagem "nenhuma matrícula ativa" se não
  houver nenhuma). Redireciona para `entrar.html` se não estiver
  logado.

Reaproveita `css/estilo.css` do site institucional (mesma paleta,
tipografia e componentes) para manter a mesma identidade visual.

## Fora de escopo nesta fase

- Criação automática de matrícula (pagamento) — Fase 2.
- Conteúdo real de aula (vídeo, PDF, atividade) — Fase 3. As tabelas
  `aulas`/`progresso` existem mas ficam vazias.
- Emissão de certificado — Fase 4. A tabela `certificados` existe mas
  fica vazia.
- Qualquer painel administrativo dedicado (matrícula manual de teste é
  feita direto na interface do Supabase, não numa tela própria do
  site).

## Critérios de aceite

- Uma conta nova pode ser criada em `cadastro.html` e faz login em
  `entrar.html`.
- `painel.html` mostra corretamente "nenhuma matrícula ativa" para um
  aluno sem matrícula, e mostra a trilha correta para um aluno
  matriculado manualmente via Supabase para teste.
- Um aluno não consegue, por nenhum meio (nem inspecionando rede/JS),
  ler a matrícula, o progresso ou o perfil de outro aluno — verificado
  tentando acessar dados de um segundo aluno de teste autenticado como
  o primeiro.
- `/atividades/` não quebra nem interfere no site institucional
  existente (`index.html`, `termos.html`, `privacidade.html`
  continuam funcionando exatamente como antes).
- Página inicial do site institucional continua abaixo de 300 KB (esta
  fase não deve alterar nada fora de `/atividades/`).
