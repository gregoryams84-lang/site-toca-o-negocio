# Fundação de SEO — Toca o Negócio — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tornar o site (hoje só a home) encontrável no Google por pequenos empreendedores brasileiros: mapa de palavras-chave, 4 páginas-pilar de trilha com conteúdo real, SEO técnico sitewide (títulos/meta, hierarquia de headings, dados estruturados, sitemap/robots, canonical, Open Graph, fontes, imagens), GA4 com consentimento LGPD, e documentação honesta de medição e de limites.

**Architecture:** Site estático (HTML/CSS puro, sem build, GitHub Pages). Cada página-pilar é uma pasta `/trilhas/<slug>/` com seu próprio `index.html` (URL limpa sem extensão via index de diretório do GitHub Pages). Componentes de UI repetidos (breadcrumb, FAQ, banner de cookies) viram classes CSS reutilizáveis em `css/estilo.css`, seguindo o padrão já usado no site (HTML duplicado por página, sem includes/templates, porque o site roda em `file://` e no GitHub Pages sem servidor).

**Tech Stack:** HTML5, CSS puro, JavaScript vanilla só para o banner de consentimento e o carregamento condicional do GA4 (gtag.js). Sem framework, sem dependências novas de build.

**Spec:** `seo/palavras-chave.md` e `seo/plano-de-conteudo.md` (criados na Tarefa 1 deste plano, a partir do mapa de palavras-chave e da arquitetura de conteúdo aprovados em conversa em 2026-08-14). Contexto adicional de marca/restrições: `docs/superpowers/specs/2026-08-01-site-institucional-toca-o-negocio-design.md`.

## Global Constraints

- Cursos livres: proibido usar "faculdade", "graduação", "pós-graduação", "diploma" ou "instituto de ensino superior" em qualquer título, meta descrição, H1, corpo de texto ou dado estruturado.
- Proibido prometer resultado financeiro ("fature X", "ganhe Y", "lucro garantido") em qualquer texto.
- Proibida prova social inventada: nenhum número de aluno, depoimento, nota, selo ou `aggregateRating`/`review` em JSON-LD que não exista de fato.
- Conteúdo sobre tributação/obrigações/legislação (trilha Formalização) leva comentário HTML explícito avisando que precisa de revisão de contador antes de publicar, e usa linguagem genérica — sem prazo, valor ou percentual específico que possa estar desatualizado ou errado.
- Site 100% estático: nenhuma solução pode depender de backend, servidor, banco de dados ou build step. `/atividades/` (app do aluno, com Supabase) é um projeto separado e não deve ser tocado nem referenciado como se fosse página de conteúdo público indexável.
- Dados reais da empresa (não inventar nem alterar): razão social **AUREA EDUCACIONAL LTDA**, CNPJ **67.140.776/0001-88**, endereço **Rua Pedro Vieira da Silva, 64 — Jardim Santa Genebra, Campinas/SP — CEP 13.080-570**, e-mail **suporte@tocaonegocio.com.br**, domínio **https://tocaonegocio.com.br**.
- Paleta/tipografia fixas (`css/estilo.css` já define): `--verde` #14513C, `--tinta` #16191C, `--papel` #F5F6F3, `--neutro` #5B6560, fonte de título `Fraunces`, fonte de corpo `Inter`. Novas páginas devem reusar essas variáveis, não criar cores novas.
- Sem emoji em nenhum texto do site (regra já estabelecida no projeto).
- GA4 só pode carregar depois que a pessoa aceitar o banner de cookies (consent-gated), conforme LGPD.

---

## Task 1: Deliverables de pesquisa — `seo/palavras-chave.md` e `seo/plano-de-conteudo.md`

**Files:**
- Create: `seo/palavras-chave.md`
- Create: `seo/plano-de-conteudo.md`

**Interfaces:**
- Produces: a lista definitiva de slugs de URL (`/trilhas/venda-pelo-whatsapp/`, `/trilhas/gestao-financeira/`, `/trilhas/ia-no-negocio/`, `/trilhas/formalizacao-da-empresa/`) e os pares título/meta/H1 exatos que as Tarefas 5-8 devem usar literalmente (não reabrir esse texto nas tarefas seguintes, só copiar).

- [ ] **Step 1: Escrever `seo/palavras-chave.md`**

Conteúdo (as quatro tabelas de cauda longa por trilha, a tabela de intermediárias, a lista de cabeça, a nota de inviabilidade de cabeça, e a nota de revisão contábil) — usar literalmente o conteúdo da Parte 1 apresentada e aprovada em conversa em 2026-08-14 (32 palavras de cauda longa distribuídas em 4 trilhas, 9 intermediárias, 6 de cabeça, cada uma com intenção/funil/página-alvo).

- [ ] **Step 2: Escrever `seo/plano-de-conteudo.md`**

Conteúdo: estrutura de URL completa, tabela de prioridade (home → pilar Venda → pilar Financeiro → pilar IA → pilar Formalização → backlog de apoio), regra de links internos, e as 4 fichas de página-pilar (título ≤60c, meta ≤155c, H1, esboço de subtítulos) — usar literalmente o conteúdo da Parte 2 aprovada em conversa em 2026-08-14.

- [ ] **Step 3: Conferir que nenhum termo proibido aparece nos dois arquivos**

Run: `grep -inE "faculdade|graduação|pós-graduação|diploma|instituto de ensino superior" seo/palavras-chave.md seo/plano-de-conteudo.md`
Expected: nenhuma linha encontrada (comando retorna vazio / exit 1).

- [ ] **Step 4: Commit**

```bash
git add seo/palavras-chave.md seo/plano-de-conteudo.md
git commit -m "docs: mapa de palavras-chave e arquitetura de conteudo de SEO"
```

---

## Task 2: JSON-LD Organization + WebSite na home, e correção de heading em `index.html`

**Files:**
- Modify: `index.html`

**Interfaces:**
- Produces: bloco JSON-LD `Organization` com `@id: "https://tocaonegocio.com.br/#organizacao"` (as próximas tarefas de página-pilar reusam esse mesmo `@id` dentro de `Course.provider`) e bloco `WebSite`.

- [ ] **Step 1: Adicionar `<link rel="canonical">` e confirmar `lang`**

No `<head>` de `index.html`, logo depois da tag `<title>`:

```html
<link rel="canonical" href="https://tocaonegocio.com.br/">
```

`<html lang="pt-BR">` já está correto (linha 2) — não precisa mudar.

- [ ] **Step 2: Adicionar Open Graph e Twitter Card**

No `<head>`, depois do canonical:

```html
<meta property="og:type" content="website">
<meta property="og:site_name" content="Toca o Negócio">
<meta property="og:title" content="Toca o Negócio — Cursos práticos para quem toca o negócio sozinho">
<meta property="og:description" content="Cursos livres online e práticos para pequenos empreendedores: vender pela internet, usar inteligência artificial, formalizar a empresa e controlar o financeiro.">
<meta property="og:url" content="https://tocaonegocio.com.br/">
<meta property="og:image" content="https://tocaonegocio.com.br/img/icone-180.png">
<meta property="og:locale" content="pt_BR">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="Toca o Negócio — Cursos práticos para quem toca o negócio sozinho">
<meta name="twitter:description" content="Cursos livres online e práticos para pequenos empreendedores: vender pela internet, usar inteligência artificial, formalizar a empresa e controlar o financeiro.">
<meta name="twitter:image" content="https://tocaonegocio.com.br/img/icone-180.png">
```

(`icone-180.png` é 180×180 — abaixo do mínimo recomendado de 200×200 para OG, mas é a única imagem de marca quadrada que existe; documentar essa limitação em `seo/limitacoes.md` na Tarefa 12, não bloquear esta tarefa por causa disso.)

- [ ] **Step 3: Adicionar JSON-LD Organization + WebSite**

Antes de `</head>`:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://tocaonegocio.com.br/#organizacao",
      "name": "Toca o Negócio",
      "legalName": "AUREA EDUCACIONAL LTDA",
      "taxID": "67.140.776/0001-88",
      "url": "https://tocaonegocio.com.br/",
      "logo": "https://tocaonegocio.com.br/img/logo-completo-verde.svg",
      "email": "suporte@tocaonegocio.com.br",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Rua Pedro Vieira da Silva, 64",
        "addressLocality": "Campinas",
        "addressRegion": "SP",
        "postalCode": "13080-570",
        "addressCountry": "BR"
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://tocaonegocio.com.br/#site",
      "url": "https://tocaonegocio.com.br/",
      "name": "Toca o Negócio",
      "publisher": { "@id": "https://tocaonegocio.com.br/#organizacao" },
      "inLanguage": "pt-BR"
    }
  ]
}
</script>
```

Não incluir `aggregateRating`, `review`, `sameAs` de redes sociais que não existam, nem `telephone` (o telefone no rodapé é placeholder, conforme já documentado no spec institucional — não usar em dado estruturado).

- [ ] **Step 4: Corrigir hierarquia de headings da seção "Como funciona"**

Verificar `index.html:66-84`: os quatro `.passo-card` usam `<h3>` dentro de uma seção cujo título é `<h2>Como funciona</h2>` — hierarquia já está correta (h1 único no topo, h2 por seção, h3 dentro dos cards). Nenhuma mudança de heading necessária; só confirmar visualmente que não há H2 duplicado nem H1 fora do topo.

- [ ] **Step 5: Validar que o JSON-LD é JSON válido**

Run:
```bash
node -e "const fs=require('fs');const html=fs.readFileSync('index.html','utf8');const m=html.match(/<script type=\"application\/ld\+json\">([\s\S]*?)<\/script>/);JSON.parse(m[1]);console.log('JSON-LD valido')"
```
Expected: `JSON-LD valido`

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "feat: SEO tecnico na home (canonical, OG, JSON-LD Organization/WebSite)"
```

---

## Task 3: Canonical + Open Graph em `termos.html` e `privacidade.html`

**Files:**
- Modify: `termos.html`
- Modify: `privacidade.html`

- [ ] **Step 1: `termos.html` — adicionar canonical e OG/Twitter no `<head>`**

```html
<link rel="canonical" href="https://tocaonegocio.com.br/termos.html">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Toca o Negócio">
<meta property="og:title" content="Termos de Uso — Toca o Negócio">
<meta property="og:description" content="Termos de Uso do Toca o Negócio — cursos livres online para pequenos empreendedores.">
<meta property="og:url" content="https://tocaonegocio.com.br/termos.html">
<meta property="og:locale" content="pt_BR">
<meta name="twitter:card" content="summary">
```

- [ ] **Step 2: `privacidade.html` — adicionar canonical e OG/Twitter no `<head>`**

```html
<link rel="canonical" href="https://tocaonegocio.com.br/privacidade.html">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Toca o Negócio">
<meta property="og:title" content="Política de Privacidade — Toca o Negócio">
<meta property="og:description" content="Política de Privacidade do Toca o Negócio, conforme a LGPD.">
<meta property="og:url" content="https://tocaonegocio.com.br/privacidade.html">
<meta property="og:locale" content="pt_BR">
<meta name="twitter:card" content="summary">
```

- [ ] **Step 3: Commit**

```bash
git add termos.html privacidade.html
git commit -m "feat: canonical e Open Graph em termos e privacidade"
```

---

## Task 4: Componentes CSS reutilizáveis para páginas de trilha

**Files:**
- Modify: `css/estilo.css`

**Interfaces:**
- Produces: classes `.trilha-hero`, `.trilha-breadcrumb`, `.trilha-faq`, `.trilha-faq details`, `.aviso-revisao` — as Tarefas 5-8 (páginas-pilar) dependem dessas classes existindo antes de escrever o HTML.

- [ ] **Step 1: Adicionar as classes ao final de `css/estilo.css`**

```css
/* ---- Páginas de trilha (pilar) ---- */
.trilha-breadcrumb {
  font-size: 14px;
  color: var(--neutro);
  margin-bottom: 16px;
}

.trilha-breadcrumb a {
  color: var(--verde);
  text-decoration: underline;
}

.trilha-hero {
  padding-block: 48px;
}

.trilha-faq {
  border: 1px solid var(--borda);
  border-radius: 8px;
  padding: 4px 20px;
  margin-bottom: 12px;
  background: var(--papel);
}

.trilha-faq summary {
  font-family: var(--fonte-display);
  color: var(--verde);
  font-weight: 700;
  padding-block: 16px;
  cursor: pointer;
}

.trilha-faq[open] summary {
  padding-bottom: 8px;
}

.aviso-revisao {
  border-left: 3px solid var(--ambar);
  padding-left: 12px;
  color: var(--neutro);
  font-size: 15px;
}
```

- [ ] **Step 2: Commit**

```bash
git add css/estilo.css
git commit -m "feat: componentes CSS para paginas de trilha (breadcrumb, FAQ, aviso)"
```

---

## Task 5: Página-pilar `/trilhas/venda-pelo-whatsapp/`

**Files:**
- Create: `trilhas/venda-pelo-whatsapp/index.html`

**Interfaces:**
- Consumes: classes de `css/estilo.css` (Task 4), `@id` da Organization de `index.html` (Task 2), título/meta/H1/esboço definidos em `seo/plano-de-conteudo.md` (Task 1).

- [ ] **Step 1: Escrever a página completa**

Estrutura obrigatória do `<head>`: `charset`, `viewport`, `<title>Vender pela internet e pelo WhatsApp | Toca o Negócio</title>` (exato, ≤60 caracteres), `<meta name="description">` com o texto aprovado em `seo/plano-de-conteudo.md`, favicon/apple-touch-icon (mesmos caminhos relativos ajustados para `../../img/...`), preconnect + fonte (mesmo bloco de `index.html`), `<link rel="stylesheet" href="../../css/estilo.css">`, `<link rel="canonical" href="https://tocaonegocio.com.br/trilhas/venda-pelo-whatsapp/">`, OG/Twitter (mesmo padrão da Task 3, com `og:type` `article` e imagem `og:image` apontando pro `icone-180.png` como nas outras páginas), e JSON-LD `Course`:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Vender pela internet e pelo WhatsApp",
  "description": "Curso livre e prático pra vender pela internet e pelo WhatsApp sem perder venda: catálogo simples, resposta rápida e cobrança sem constranger o cliente.",
  "provider": {
    "@id": "https://tocaonegocio.com.br/#organizacao",
    "@type": "Organization",
    "name": "Toca o Negócio",
    "url": "https://tocaonegocio.com.br/"
  },
  "inLanguage": "pt-BR",
  "url": "https://tocaonegocio.com.br/trilhas/venda-pelo-whatsapp/"
}
</script>
```

(Sem `hasCourseInstance`, `offers` nem `aggregateRating` — nenhum desses dados existe/está confirmado ainda.)

Corpo (`<body>`): mesmo `<header class="cabecalho container">` de `index.html`, com `href="../../index.html"` no link da marca. Dentro de `<main>`:

1. `<p class="container trilha-breadcrumb"><a href="../../index.html">Toca o Negócio</a> · Vender pela internet e pelo WhatsApp</p>`
2. `<section class="secao trilha-hero container">` com `<h1>Venda pela internet e pelo WhatsApp sem perder cliente no caminho</h1>` e um parágrafo de abertura (2-3 frases) situando o problema: por que responder devagar ou sem organização custa venda pra quem toca o negócio sozinho.
3. Seção "Por que vender pelo WhatsApp é diferente de vender numa loja" (`<h2>`) — 1-2 parágrafos: sem vitrine física, o cliente decide pela conversa; ritmo de resposta importa tanto quanto o produto.
4. Seção "Monte um catálogo que não dá trabalho" (`<h2>`) — 1-2 parágrafos: catálogo simples (lista de fotos + preço, ou WhatsApp Business), sem precisar de site ou loja virtual.
5. Seção "Responda rápido sem parecer robótico" (`<h2>`) — 1-2 parágrafos: respostas prontas guardadas, mas adaptadas — equilíbrio entre agilidade e tom humano (aplicar aqui a barra de originalidade do copy: nada de "vi que você...").
6. Seção "Cobre sem constranger o cliente" (`<h2>`) — 1-2 parágrafos: link de pagamento, forma direta de pedir o pagamento sem parecer deselegante.
7. Seção FAQ (`<h2>Perguntas de quem vende pelo WhatsApp</h2>`) com 3 `<details class="trilha-faq">` usando as 3 primeiras perguntas de cauda longa do backlog desta trilha (`seo/plano-de-conteudo.md`) como `<summary>`, cada uma com uma resposta curta (2-4 frases) — sem prometer resultado financeiro, sem link para artigo de apoio ainda (eles não existem nesta rodada; a nota abaixo do FAQ diz "mais perguntas em breve").
8. CTA final (`<h2>O que tem na trilha completa</h2>`) — 1 parágrafo + `<a class="botao" href="../../index.html#contato">Falar com a gente</a>`.

Rodapé: copiar literalmente o `<footer class="rodape">` de `index.html`, ajustando os `href` de `termos.html`/`privacidade.html` para `../../termos.html`/`../../privacidade.html`.

- [ ] **Step 2: Conferir termos proibidos e promessa de resultado**

Run: `grep -inE "faculdade|graduação|pós-graduação|diploma|instituto de ensino superior|fature|ganhe R\$|lucro garantido" trilhas/venda-pelo-whatsapp/index.html`
Expected: nenhuma linha encontrada.

- [ ] **Step 3: Validar JSON-LD**

Run: `node -e "const fs=require('fs');const html=fs.readFileSync('trilhas/venda-pelo-whatsapp/index.html','utf8');const m=html.match(/<script type=\"application\/ld\+json\">([\s\S]*?)<\/script>/);JSON.parse(m[1]);console.log('JSON-LD valido')"`
Expected: `JSON-LD valido`

- [ ] **Step 4: Abrir no navegador e checar viewport 360px sem rolagem horizontal**

Abrir `trilhas/venda-pelo-whatsapp/index.html` direto no navegador (duplo clique), redimensionar pra 360px de largura, confirmar que não aparece barra de rolagem horizontal e que o breadcrumb/CTA funcionam.

- [ ] **Step 5: Commit**

```bash
git add trilhas/venda-pelo-whatsapp/index.html
git commit -m "feat: pagina-pilar Venda pela internet e pelo WhatsApp"
```

---

## Task 6: Página-pilar `/trilhas/gestao-financeira/`

**Files:**
- Create: `trilhas/gestao-financeira/index.html`

Mesma estrutura de `<head>`/rodapé da Task 5, trocando os caminhos para `trilhas/gestao-financeira/` e usando:

- `<title>Gestão financeira pra quem toca o negócio | Toca o Negócio</title>`
- meta description: "Curso livre pra organizar o financeiro do seu negócio: separar dinheiro pessoal da empresa, saber quanto sobra no mês e decidir com número, não com achismo."
- `<h1>Controle o dinheiro do negócio sem depender de achismo</h1>`
- JSON-LD `Course` com `name: "Gestão financeira pra quem toca o negócio sozinho"` e a mesma `description` da meta, `url` apontando pra `https://tocaonegocio.com.br/trilhas/gestao-financeira/`.

Seções do corpo:
1. Abertura: por que misturar dinheiro pessoal e da empresa deixa a pessoa no escuro sobre a saúde real do negócio.
2. "Como saber quanto sobra de verdade no fim do mês" — separar entrada/saída pessoal de negócio antes de qualquer coisa.
3. "Fluxo de caixa simples, sem planilha complicada" — registro básico de entradas e saídas, sem precisar de sistema caro.
4. "Precificar sem prejuízo" — cobrir custo + tempo antes de definir preço, não copiar preço do concorrente sem saber o próprio custo.
5. FAQ com as 3 primeiras perguntas de cauda longa do backlog de Financeiro.
6. CTA final igual ao padrão da Task 5.

- [ ] **Step 1: Escrever a página completa** (conteúdo acima)
- [ ] **Step 2: Conferir termos proibidos** — mesmo grep da Task 5, Step 2, no novo arquivo
- [ ] **Step 3: Validar JSON-LD** — mesmo comando node da Task 5, Step 3, no novo arquivo
- [ ] **Step 4: Checar viewport 360px sem rolagem horizontal**
- [ ] **Step 5: Commit**

```bash
git add trilhas/gestao-financeira/index.html
git commit -m "feat: pagina-pilar Gestao financeira"
```

---

## Task 7: Página-pilar `/trilhas/ia-no-negocio/`

**Files:**
- Create: `trilhas/ia-no-negocio/index.html`

Mesma estrutura, usando:

- `<title>Inteligência artificial no negócio | Toca o Negócio</title>`
- meta description: "Curso livre e prático de inteligência artificial aplicada ao pequeno negócio: escrever anúncio, responder dúvida repetida e organizar a agenda com ferramentas gratuitas."
- `<h1>Use inteligência artificial no dia a dia do seu negócio</h1>`
- JSON-LD `Course` com `name: "Inteligência artificial no negócio"`, mesma `description`, `url` para `https://tocaonegocio.com.br/trilhas/ia-no-negocio/`.

Seções do corpo:
1. Abertura: pra que serve IA num negócio pequeno, sem exagero de "vai resolver tudo".
2. "Escreva anúncio e legenda mais rápido" — usar IA como ponto de partida, não como texto final sem revisão.
3. "Responda dúvida repetida sem digitar tudo de novo" — organizar respostas para perguntas que se repetem.
4. "Organize sua agenda e tarefas" — uso prático do dia a dia.
5. "O que a IA não substitui" — importante pra credibilidade: IA não substitui a relação com o cliente nem decisão de negócio, é ferramenta.
6. FAQ com as 3 primeiras perguntas de cauda longa do backlog de IA.
7. CTA final igual ao padrão da Task 5.

- [ ] **Step 1: Escrever a página completa** (conteúdo acima)
- [ ] **Step 2: Conferir termos proibidos**
- [ ] **Step 3: Validar JSON-LD**
- [ ] **Step 4: Checar viewport 360px sem rolagem horizontal**
- [ ] **Step 5: Commit**

```bash
git add trilhas/ia-no-negocio/index.html
git commit -m "feat: pagina-pilar IA no negocio"
```

---

## Task 8: Página-pilar `/trilhas/formalizacao-da-empresa/` (requer revisão de contador)

**Files:**
- Create: `trilhas/formalizacao-da-empresa/index.html`

Mesma estrutura, usando:

- `<title>Formalização e obrigações da empresa | Toca o Negócio</title>`
- meta description: "Curso livre pra colocar a empresa em dia: o que emitir, pagar e declarar pra funcionar dentro da lei, sem depender de um contador pra cada dúvida."
- `<h1>Coloque a empresa em dia sem virar refém de cada dúvida</h1>`
- JSON-LD `Course` com `name: "Formalização e obrigações da empresa"`, mesma `description`, `url` para `https://tocaonegocio.com.br/trilhas/formalizacao-da-empresa/`.

Logo após a tag `<title>`, no `<head>`:

```html
<!-- REVISAO CONTABIL PENDENTE — todo o conteudo desta pagina fala de obrigacoes/tributacao (MEI, nota fiscal, Simples Nacional).
     Deliberadamente sem prazos, valores ou percentuais especificos ate um contador revisar.
     Nao publicar mudancas de conteudo nesta pagina sem essa revisao. -->
```

Seções do corpo (linguagem deliberadamente genérica, sem data/valor/percentual que exija atualização):
1. Abertura: `<p class="aviso-revisao">O conteúdo desta página é revisado por um contador antes de qualquer atualização, porque fala de obrigações legais.</p>` — visível pro leitor, não só comentário HTML — seguida do parágrafo de abertura normal.
2. "O que muda quando a empresa está formalizada" — visão geral, sem citar valor de imposto específico.
3. "As obrigações que voltam todo mês" — descrição em termos gerais (guias e declarações periódicas existem; que tipo depende do enquadramento), sem citar data limite específica.
4. "Quando vale falar com um contador" — momentos em que compensa buscar ajuda profissional em vez de resolver sozinho.
5. FAQ com as 3 primeiras perguntas de cauda longa do backlog de Formalização — respostas também genéricas, direcionando pra "confirme com um contador" quando a resposta certa depender de data/valor.
6. CTA final igual ao padrão da Task 5.

- [ ] **Step 1: Escrever a página completa** (conteúdo acima)
- [ ] **Step 2: Conferir termos proibidos E ausência de valor/percentual/data específica de tributo**

Run: `grep -inE "faculdade|graduação|pós-graduação|diploma|instituto de ensino superior|R\$\s*[0-9]|[0-9]+%|dia [0-9]+ de" trilhas/formalizacao-da-empresa/index.html`
Expected: nenhuma linha encontrada (qualquer valor/percentual/data que aparecer aqui precisa ser removido antes de prosseguir).

- [ ] **Step 3: Validar JSON-LD**
- [ ] **Step 4: Checar viewport 360px sem rolagem horizontal**
- [ ] **Step 5: Commit**

```bash
git add trilhas/formalizacao-da-empresa/index.html
git commit -m "feat: pagina-pilar Formalizacao da empresa (aguardando revisao contabil)"
```

---

## Task 9: Ligar a home às páginas-pilar

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: as 4 URLs criadas nas Tasks 5-8.

- [ ] **Step 1: Adicionar link em cada `.trilha-card`**

Em `index.html:43-58`, envolver o `<h3>` de cada card num link para a página-pilar correspondente, mantendo o texto igual:

```html
<article class="trilha-card">
  <h3><a href="trilhas/venda-pelo-whatsapp/">Venda pela internet e pelo WhatsApp</a></h3>
  <p>Monte um catálogo simples, responda mensagem sem perder venda e feche pedido direto na conversa.</p>
</article>
```

Repetir para os outros três cards, apontando para `trilhas/ia-no-negocio/`, `trilhas/formalizacao-da-empresa/` e `trilhas/gestao-financeira/` respectivamente. Adicionar em `css/estilo.css` (dentro do bloco `.trilha-card h3` já existente) `.trilha-card h3 a { color: inherit; text-decoration: none; }` pra manter a aparência atual do card.

- [ ] **Step 2: Verificar visualmente que os 4 links abrem as páginas certas**

Abrir `index.html` no navegador, clicar em cada um dos 4 cards, confirmar que cada um vai pra sua página-pilar.

- [ ] **Step 3: Commit**

```bash
git add index.html css/estilo.css
git commit -m "feat: liga os cards de trilha da home as paginas-pilar"
```

---

## Task 10: `sitemap.xml` e `robots.txt`

**Files:**
- Create: `sitemap.xml`
- Create: `robots.txt`

- [ ] **Step 1: Escrever `sitemap.xml`**

Listar só as 7 URLs que existem de fato depois das tarefas anteriores (nunca páginas planejadas que ainda não existem):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://tocaonegocio.com.br/</loc><changefreq>monthly</changefreq><priority>1.0</priority></url>
  <url><loc>https://tocaonegocio.com.br/trilhas/venda-pelo-whatsapp/</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://tocaonegocio.com.br/trilhas/gestao-financeira/</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://tocaonegocio.com.br/trilhas/ia-no-negocio/</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://tocaonegocio.com.br/trilhas/formalizacao-da-empresa/</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://tocaonegocio.com.br/termos.html</loc><changefreq>yearly</changefreq><priority>0.3</priority></url>
  <url><loc>https://tocaonegocio.com.br/privacidade.html</loc><changefreq>yearly</changefreq><priority>0.3</priority></url>
</urlset>
```

- [ ] **Step 2: Escrever `robots.txt`**

```
User-agent: *
Allow: /
Disallow: /atividades/

Sitemap: https://tocaonegocio.com.br/sitemap.xml
```

(`/atividades/` fica de fora do índice porque é área logada do aluno — cadastro/login/painel — sem valor de busca pública e sem conteúdo pra indexar.)

- [ ] **Step 3: Validar que o XML é bem formado**

Run: `node -e "const fs=require('fs');const{DOMParser}=require('@xmldom/xmldom')||{};" 2>/dev/null; python -c "import xml.dom.minidom as m; m.parse('sitemap.xml'); print('sitemap valido')"`
Expected: `sitemap valido` (se `python` não estiver disponível, abrir `sitemap.xml` no navegador e confirmar que ele renderiza como árvore XML sem erro de parsing).

- [ ] **Step 4: Commit**

```bash
git add sitemap.xml robots.txt
git commit -m "feat: sitemap.xml e robots.txt"
```

---

## Task 11: Imagens (alt/dimensões/lazy) e estratégia de fontes

**Files:**
- Modify: `index.html`, `termos.html`, `privacidade.html`, `trilhas/*/index.html` (as 4 já criadas)

- [ ] **Step 1: Conferir que toda `<img>` do site tem `alt`, `width` e `height`**

Run: `grep -rn "<img" index.html termos.html privacidade.html trilhas/*/index.html`

Cada linha deve ter os três atributos (`alt`, `width`, `height`). O logo já tem (`img/logo-completo-verde.svg` com `alt="Toca o Negócio" width="150" height="62"`) em todas as páginas — como as páginas-pilar não usam nenhuma imagem além do logo do cabeçalho (decisão de marca: sem foto de banco, elemento visual via tipografia), não há imagem adicional pra corrigir. Se o grep mostrar alguma imagem sem os três atributos, corrigir adicionando os valores reais (não estimados) de largura/altura do arquivo.

- [ ] **Step 2: `loading="lazy"` nas imagens abaixo da dobra**

O único `<img>` do site é o logo no cabeçalho, que aparece acima da dobra em todas as páginas — não deve levar `loading="lazy"` (imagem crítica não deve ser adiada). Nenhuma mudança necessária aqui; deixar registrado em `seo/limitacoes.md` (Task 12) que a regra "lazy loading onde couber" não se aplica porque o site não tem imagem de conteúdo abaixo da dobra hoje, e vai passar a valer quando os artigos de apoio (com possíveis imagens) forem criados.

- [ ] **Step 3: Confirmar estratégia de carregamento de fontes**

Verificar que todas as 7 páginas (`index.html`, `termos.html`, `privacidade.html`, 4 páginas-pilar) usam o mesmo bloco:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,700&family=Inter:wght@400;600&display=swap" rel="stylesheet">
```

`display=swap` já garante que o texto aparece com a fonte do sistema imediatamente e troca pra Fraunces/Inter quando carregar (não bloqueia renderização) — nenhuma mudança de código necessária, só confirmar que as páginas-pilar novas (Task 5-8) copiaram esse bloco exatamente.

Run: `grep -L "display=swap" index.html termos.html privacidade.html trilhas/*/index.html`
Expected: nenhum arquivo listado (todos têm o `display=swap`).

- [ ] **Step 4: Commit (só se o Step 1 encontrou algo pra corrigir)**

```bash
git add -A
git commit -m "fix: atributos de imagem (alt/dimensoes) onde faltavam"
```

Se nada foi corrigido, pular o commit desta tarefa.

---

## Task 12: GA4 com banner de consentimento LGPD

**Files:**
- Create: `js/consentimento.js`
- Modify: `css/estilo.css`
- Modify: `index.html`, `termos.html`, `privacidade.html`, `trilhas/*/index.html` (as 4 já criadas)

**Interfaces:**
- Produces: `window.aceitarCookies()` e `window.recusarCookies()` (chamadas pelos botões do banner), função que só injeta o script `gtag.js` depois do aceite, gravando a escolha em `localStorage` sob a chave `tdn_consentimento_analytics`.

- [ ] **Step 1: Escrever `js/consentimento.js`**

```javascript
(function () {
  var CHAVE = 'tdn_consentimento_analytics';
  var ID_MEDICAO = 'G-XXXXXXXXXX'; // TODO: trocar pelo ID real do GA4 antes de publicar

  function carregarGA4() {
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID_MEDICAO;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', ID_MEDICAO, { anonymize_ip: true });
  }

  function esconderBanner() {
    var banner = document.getElementById('banner-cookies');
    if (banner) banner.hidden = true;
  }

  window.aceitarCookies = function () {
    localStorage.setItem(CHAVE, 'aceito');
    esconderBanner();
    carregarGA4();
  };

  window.recusarCookies = function () {
    localStorage.setItem(CHAVE, 'recusado');
    esconderBanner();
  };

  document.addEventListener('DOMContentLoaded', function () {
    var escolha = localStorage.getItem(CHAVE);
    if (escolha === 'aceito') {
      carregarGA4();
      return;
    }
    if (escolha === 'recusado') {
      return;
    }
    var banner = document.getElementById('banner-cookies');
    if (banner) banner.hidden = false;
  });
})();
```

- [ ] **Step 2: Adicionar CSS do banner em `css/estilo.css`**

```css
/* ---- Banner de cookies ---- */
.banner-cookies {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  background: var(--tinta);
  color: var(--papel);
  padding: 16px 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
}

.banner-cookies p {
  margin: 0;
  max-width: 60ch;
  font-size: 14px;
  color: var(--papel);
}

.banner-cookies .botoes {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.banner-cookies button {
  font-family: var(--fonte-base);
  font-weight: 600;
  font-size: 14px;
  padding: 10px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}

.banner-cookies .botao-aceitar {
  background: var(--papel);
  color: var(--tinta);
}

.banner-cookies .botao-recusar {
  background: transparent;
  color: var(--papel);
  border: 1px solid var(--papel);
}
```

- [ ] **Step 3: Adicionar o HTML do banner + o script em todas as 7 páginas**

Antes de `</body>`, em `index.html`, `termos.html`, `privacidade.html` e nas 4 páginas de `trilhas/*/index.html` (ajustando `src="js/consentimento.js"` para `src="../../js/consentimento.js"` nas páginas de trilha):

```html
<div id="banner-cookies" class="banner-cookies" hidden>
  <p>Usamos cookies só para entender como as pessoas usam o site. Você pode aceitar ou recusar — isso não muda o que você vê aqui. Veja a <a href="privacidade.html" style="color:inherit">Política de Privacidade</a>.</p>
  <div class="botoes">
    <button type="button" class="botao-recusar" onclick="recusarCookies()">Recusar</button>
    <button type="button" class="botao-aceitar" onclick="aceitarCookies()">Aceitar</button>
  </div>
</div>
<script src="js/consentimento.js"></script>
```

- [ ] **Step 4: Verificar manualmente no navegador**

Abrir `index.html`: o banner deve aparecer no rodapé da tela. Clicar em "Aceitar", recarregar a página — o banner não deve reaparecer (checar em `localStorage.getItem('tdn_consentimento_analytics')` no console, deve retornar `"aceito"`). Repetir testando "Recusar" (limpar o `localStorage` antes: `localStorage.clear()`).

- [ ] **Step 5: Commit**

```bash
git add js/consentimento.js css/estilo.css index.html termos.html privacidade.html trilhas
git commit -m "feat: GA4 com banner de consentimento LGPD (consent-gated)"
```

---

## Task 13: `seo/medicao.md`

**Files:**
- Create: `seo/medicao.md`

- [ ] **Step 1: Escrever o passo a passo, sem jargão técnico, cobrindo:**

1. Como verificar propriedade no Google Search Console (opção de verificação por domínio via TXT no DNS do registro.br, já que o site usa domínio próprio — passo a passo com nomes de tela reais do Search Console em português) e como enviar `sitemap.xml`.
2. Como recuperar o `ID_MEDICAO` (G-XXXXXXXXXX) do GA4 no Google Analytics e onde colar no `js/consentimento.js` (Task 12, Step 1) antes de publicar — hoje o arquivo tem um placeholder marcado com `// TODO`.
3. Aviso de cookies: já implementado (Task 12) — explicar em uma frase que o banner é obrigatório por causa do GA4 usar cookies, e que a pessoa pode trocar de analytics cookieless depois sem essa exigência.
4. Métricas para acompanhar nos primeiros 6 meses: impressões e cliques por página no Search Console, páginas indexadas vs. enviadas, posição média das palavras de cauda longa da Tarefa 1. Métricas para ignorar nesse período: posição de palavras de cabeça, número absoluto de sessões (baixo demais pra ser significativo com pouco tráfego), taxa de rejeição (pouco acionável sem volume).
5. Prazo honesto: Search Console normalmente mostra as primeiras impressões em 1-4 semanas após o envio do sitemap; ranking relevante de cauda longa costuma aparecer entre 2 e 6 meses de conteúdo consistente, não antes; termos de cabeça não são realistas no horizonte de 6 meses (ligação com `seo/palavras-chave.md`).

- [ ] **Step 2: Commit**

```bash
git add seo/medicao.md
git commit -m "docs: passo a passo de Search Console, analytics e metricas"
```

---

## Task 14: `seo/limitacoes.md`

**Files:**
- Create: `seo/limitacoes.md`

- [ ] **Step 1: Escrever a seção franca cobrindo:**

1. O que a implementação técnica desta rodada resolve (rastreabilidade, indexação, dados estruturados corretos, performance de base) vs. o que não resolve (posição no Google).
2. Por que nenhuma configuração técnica garante primeira posição: o Google ordena por relevância + autoridade acumulada + qualidade percebida, nenhuma das quais um `sitemap.xml` ou um JSON-LD determina sozinho.
3. O que move o ponteiro de verdade pra um site novo: produção regular de conteúdo (os 24+ artigos de apoio que ficaram no backlog da Tarefa 1), autoridade de domínio (tempo + qualidade acumulados, não hackeável), backlinks (menções/links de outros sites reais — parcerias, imprensa, diretórios de negócio, não compra de link), atualização periódica das páginas-pilar.
4. Registrar a limitação de hospedagem do GitHub Pages relevante aqui: sem cabeçalhos HTTP customizáveis (não dá pra configurar `Cache-Control` por arquivo além do padrão da Fastly/CDN do GitHub Pages), sem otimização/redimensionamento automático de imagem, sem renderização server-side — tudo isso é aceitável para o tamanho atual do site, mas limita opções futuras de performance se o site crescer muito.
5. Repetir, curto, a limitação do `og:image` de 180×180 já anotada na Task 2 (abaixo do tamanho ideal de 200×200 recomendado pelo Facebook/WhatsApp) até a marca ter uma imagem quadrada maior.

- [ ] **Step 2: Commit**

```bash
git add seo/limitacoes.md
git commit -m "docs: limitacoes da implementacao tecnica de SEO"
```

---

## Task 15: Atualizar `README.md` e verificação final de aceite

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Adicionar seção ao README explicando as novas pastas/arquivos**

Seguir o tom já usado no README (linguagem simples, sem jargão): explicar que `trilhas/` tem uma pasta por trilha com sua própria página, que editar o texto funciona igual às páginas antigas (procurar a frase entre as tags e trocar), que `seo/` guarda os documentos de planejamento (não são páginas do site, só referência), e repetir o aviso já existente sobre editar o rodapé nos 7 arquivos agora, não só 3 — ou melhor, anotar explicitamente quantos arquivos têm rodapé duplicado depois desta implementação (7: `index.html`, `termos.html`, `privacidade.html` e as 4 de `trilhas/*/index.html`).

- [ ] **Step 2: Rodar a verificação final de aceite em todo o site**

Run:
```bash
grep -rinE "faculdade|graduação|pós-graduação|diploma|instituto de ensino superior" index.html termos.html privacidade.html trilhas/*/index.html
grep -rinE "fature|ganhe R\$|lucro garantido" index.html termos.html privacidade.html trilhas/*/index.html
grep -rln "aggregateRating\|\"review\"" index.html trilhas/*/index.html
```
Expected: os três comandos não retornam nenhuma linha.

- [ ] **Step 3: Confirmar as 7 URLs do `sitemap.xml` batem com os 7 arquivos reais criados**

Run: `for f in index.html termos.html privacidade.html trilhas/venda-pelo-whatsapp/index.html trilhas/gestao-financeira/index.html trilhas/ia-no-negocio/index.html trilhas/formalizacao-da-empresa/index.html; do test -f "$f" && echo "OK $f" || echo "FALTA $f"; done`
Expected: `OK` nas 7 linhas.

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "docs: atualiza README com as novas paginas de trilha e pasta seo/"
```

---
