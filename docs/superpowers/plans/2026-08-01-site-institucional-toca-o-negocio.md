# Site institucional Toca o Negócio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the static institutional site for "Toca o Negócio" (AUREA EDUCACIONAL LTDA) — HTML/CSS only, no build step, mobile-first — that presents the course tracks and carries the company's razão social/CNPJ/address in a real, always-visible footer for Meta Business verification.

**Architecture:** Three static HTML pages (`index.html`, `termos.html`, `privacidade.html`) sharing one stylesheet (`css/estilo.css`) and one hand-duplicated footer block (duplicated, not templated, because there is no build step and the site must also work opened directly via `file://`, where `fetch()`-based includes break under CORS).

**Tech Stack:** Plain HTML5 + CSS3. No JavaScript. Google Fonts (Inter, weights 400/600 only) loaded via `<link>`. No frameworks, no package manager, no build step.

## Global Constraints

- No mention anywhere on the site of: MEC recognition/authorization, "faculdade", "graduação", "pós-graduação", "diploma", "instituto de ensino superior" / "instituição de ensino superior".
- Certificate must always be called "certificado de conclusão de curso livre".
- No financial-outcome promises ("fature", "ganhe dinheiro", "lucro garantido", "método validado", "resultados comprovados") anywhere.
- No invented social proof: no student counts, testimonials, ratings, or seals/badges. Leave that space empty rather than inventing content.
- Avoid these words in all copy: "solução", "jornada", "transformação", "empoderar", "descomplicar". Portuguese (Brazil), direct and concrete language, short sentences, no corporate jargon, no emoji.
- Single page, no navigation menu — one contact link/button at the top is the only navigation element (a multi-item menu implies pages that don't exist, which hurts the Meta verification review).
- No stock photography of any kind (no smiling people, headsets, handshakes, generic startup illustration). Visual interest comes from typography, whitespace and simple shapes only.
- Single accent color, dark and sober — dark green or petrol blue. Never orange or saturated yellow (that is the default "infoproduto" palette this brand must avoid). Used only on the contact button.
- Single typeface, two weights only (regular 400 + semibold 600). Inter. No serif typeface.
- Body text minimum 17px; line-height around 1.6; paragraph text width capped at roughly 65 characters (`max-width: 65ch` on running text).
- No box-shadow, no gradient, no animation, no carousel, no background video. Separation comes from thin borders and whitespace only.
- Mobile-first; must render with no horizontal scroll at 360px viewport width.
- No external dependencies except Google Fonts.
- Index page total weight (HTML+CSS+fonts+images) must stay under 300 KB.
- WCAG AA contrast throughout, including for sunlight-on-phone legibility. Footer text minimum 14px, normal contrast (never light gray), never shrunk relative to the rest of the site, never behind an accordion/collapse.
- Footer content is identical, verbatim, on all three pages:
  - Razão social: `AUREA EDUCACIONAL LTDA`
  - CNPJ: `67.140.776/0001-88`
  - Endereço: `Rua Pedro Vieira da Silva, 64, Apto 73 — Jardim Santa Genebra, Campinas/SP — CEP 13.080-570`
  - Telefone: `(19) 9666-1703 / (19) 9286-2037` (placeholder value, intentional — user will swap later)
  - E-mail: `contato@tocaonegocio.com.br`
  - Legal line: `Cursos livres de capacitação profissional, nos termos do Decreto nº 5.154/2004. Não constituem curso de graduação ou pós-graduação.`
- `/atividades/` path must not be created or referenced — reserved for a future separate project.
- Since this stack has no test runner, "tests" in this plan are `grep`-based content checks (forbidden terms absent, required terms present) and file-size/structure checks, run after writing content, not before.

---

## File Structure

```
site-toca-o-negocio/
├── index.html
├── termos.html
├── privacidade.html
├── css/
│   └── estilo.css
├── img/                (empty — no images used in v1, decorative shapes done in pure CSS)
├── CNAME
├── .nojekyll
├── README.md
└── docs/
    └── publicar-github-pages.md
```

---

### Task 1: Project scaffolding and shared design tokens

**Files:**
- Create: `CNAME`
- Create: `.nojekyll`
- Create: `css/estilo.css`

**Interfaces:**
- Produces (CSS custom properties, consumed by every later HTML task):
  `--cor-fundo`, `--cor-fundo-alt`, `--cor-texto`,
  `--cor-destaque`, `--cor-destaque-texto`, `--cor-borda`, `--fonte-base`,
  `--largura-maxima`, `--espaco-secao`
- Produces (CSS classes, consumed by every later HTML task):
  `.container`, `.botao`, `.secao`, `.secao-alt`, `.cabecalho`,
  `.cabecalho-marca`, `.trilhas-grade`, `.trilha-card`, `.passos-grade`,
  `.passo-card`, `.rodape`, `.rodape-conteudo`, `.rodape-razao-social`,
  `.rodape-links`, `.rodape-legal`, `.rodape-copyright`

- [ ] **Step 1: Create `CNAME`**

```
tocaonegocio.com.br
```

- [ ] **Step 2: Create `.nojekyll`**

Empty file (zero bytes). This stops GitHub Pages from running Jekyll processing on the repo.

- [ ] **Step 3: Write `css/estilo.css`**

```css
/* ---- Reset e base ---- */
*, *::before, *::after { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
img { max-width: 100%; display: block; }
a { color: inherit; }

/* ---- Tokens ---- */
:root {
  --cor-fundo: #FAF8F3;
  --cor-fundo-alt: #F0EBDE;
  --cor-texto: #1C1C1A;
  --cor-destaque: #123C40;
  --cor-destaque-texto: #FFFFFF;
  --cor-borda: #E4DFD3;
  --fonte-base: 'Inter', system-ui, -apple-system, Arial, sans-serif;
  --largura-maxima: 1080px;
  --espaco-secao: clamp(48px, 8vw, 96px);
}

body {
  font-family: var(--fonte-base);
  font-size: 17px;
  line-height: 1.6;
  color: var(--cor-texto);
  background: var(--cor-fundo);
}

.container {
  max-width: var(--largura-maxima);
  margin: 0 auto;
  padding: 0 20px;
}

h1, h2, h3 {
  font-weight: 600;
  line-height: 1.15;
  margin: 0 0 16px 0;
}

h1 { font-size: clamp(2rem, 5vw, 2.75rem); }
h2 { font-size: clamp(1.4rem, 3.5vw, 2rem); }
h3 { font-size: 1.15rem; }

p {
  margin: 0 0 16px 0;
  max-width: 65ch;
}

.secao {
  padding-block: var(--espaco-secao);
}

.secao-alt {
  background: var(--cor-fundo-alt);
}

.botao {
  display: inline-block;
  background: var(--cor-destaque);
  color: var(--cor-destaque-texto);
  padding: 14px 28px;
  border-radius: 6px;
  font-weight: 600;
  text-decoration: none;
  font-size: 1rem;
}

/* ---- Cabeçalho ---- */
.cabecalho {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  padding-block: 24px;
  border-bottom: 1px solid var(--cor-borda);
}

.cabecalho-marca {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

/* ---- Grades ---- */
.trilhas-grade, .passos-grade {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

@media (min-width: 640px) {
  .trilhas-grade, .passos-grade { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 960px) {
  .passos-grade { grid-template-columns: repeat(4, 1fr); }
}

.trilha-card, .passo-card {
  background: #FFFFFF;
  border: 1px solid var(--cor-borda);
  border-radius: 8px;
  padding: 24px;
}

.trilha-card h3, .passo-card h3 {
  color: var(--cor-texto);
}

/* ---- Rodapé ---- */
.rodape {
  background: var(--cor-fundo-alt);
  border-top: 1px solid var(--cor-borda);
}

.rodape-conteudo {
  max-width: var(--largura-maxima);
  margin: 0 auto;
  padding: 40px 20px;
  font-size: 0.95rem;
  color: var(--cor-texto);
}

.rodape-razao-social {
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 8px;
}

.rodape-links a {
  color: var(--cor-texto);
  text-decoration: underline;
}

.rodape-legal {
  color: var(--cor-texto);
}

.rodape-copyright {
  color: var(--cor-texto);
  margin-bottom: 0;
}

/* ---- Páginas de texto (termos/privacidade) ---- */
.pagina-texto h2 {
  margin-top: 40px;
}

.pagina-texto ul {
  padding-left: 20px;
}
```

- [ ] **Step 4: Verify no placeholder text leaked into the file**

Run: `grep -in "lorem\|placeholder\|TODO" css/estilo.css`
Expected: no output (empty result).

- [ ] **Step 5: Commit**

```bash
git add CNAME .nojekyll css/estilo.css
git commit -m "chore: scaffold project and shared design tokens"
```

---

### Task 2: `index.html` — head, header, hero ("Topo")

**Files:**
- Create: `index.html` (head + `<header>` + hero section only; later tasks append more sections before `</body>`)

**Interfaces:**
- Consumes: CSS classes from Task 1 (`.container`, `.cabecalho`, `.cabecalho-marca`, `.botao`, `.secao`)
- Produces: the file `index.html` that Tasks 3 and 4 will insert sections into (each subsequent task inserts its markup immediately before the closing `</body>` tag, after the previously inserted section)

- [ ] **Step 1: Write `index.html`**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Toca o Negócio — Cursos práticos para quem toca o negócio sozinho</title>
  <meta name="description" content="Cursos livres online e práticos para pequenos empreendedores: vender pela internet, usar inteligência artificial, formalizar a empresa e controlar o financeiro.">
  <!-- META DOMAIN VERIFICATION — colar aqui a tag fornecida pelo Gerenciador de Negócios -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/estilo.css">
</head>
<body>
  <header class="cabecalho container">
    <p class="cabecalho-marca">Toca o Negócio</p>
    <a class="botao" href="#contato">Falar com a gente</a>
  </header>

  <section class="secao container" id="topo">
    <h1>Cursos práticos para quem toca o negócio sozinho</h1>
    <p>Aulas curtas e diretas para quem cuida da venda, do financeiro e do dia a dia da empresa sem ter um time inteiro para dividir a tarefa.</p>
    <a class="botao" href="#contato">Falar com a gente</a>
  </section>
</body>
</html>
```

- [ ] **Step 2: Verify forbidden terms are absent**

Run: `grep -in "mec\|faculdade\|gradua\|diploma\|instituto de ensino superior\|fature\|ganhe dinheiro\|lucro garantido" index.html`
Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add index.html head, header and hero section"
```

---

### Task 3: `index.html` — "Para quem é" and "As trilhas"

**Files:**
- Modify: `index.html` (insert two new `<section>` blocks immediately before `</body>`, after the hero section from Task 2)

**Interfaces:**
- Consumes: `.secao`, `.secao-alt`, `.container`, `.trilhas-grade`, `.trilha-card` from Task 1

- [ ] **Step 1: Insert the two sections before `</body>`**

```html
  <section class="secao secao-alt" id="para-quem-e">
    <div class="container">
      <h2>Para quem é</h2>
      <p>Você toca o negócio sozinho, ou tem no máximo uma pessoa te ajudando. Não existe um financeiro, um social media e um contador de plantão — é você resolvendo tudo, ao mesmo tempo em que atende o cliente na porta ou no WhatsApp.</p>
      <p>Os cursos aqui foram pensados para esse tamanho de operação: sem curso de trinta horas, sem termo técnico que exige dicionário, direto para o que muda o funcionamento do seu negócio essa semana.</p>
    </div>
  </section>

  <section class="secao" id="trilhas">
    <div class="container">
      <h2>As trilhas</h2>
      <div class="trilhas-grade">
        <article class="trilha-card">
          <h3>Venda pela internet e pelo WhatsApp</h3>
          <p>Monte um catálogo simples, responda mensagem sem perder venda e feche pedido direto na conversa.</p>
        </article>
        <article class="trilha-card">
          <h3>Use inteligência artificial no dia a dia</h3>
          <p>Escreva anúncio, responda dúvida repetida e organize sua agenda com ferramentas de IA gratuitas.</p>
        </article>
        <article class="trilha-card">
          <h3>Coloque a empresa em dia</h3>
          <p>Entenda o que precisa emitir, pagar e declarar para funcionar dentro da lei, sem depender de um contador para cada dúvida.</p>
        </article>
        <article class="trilha-card">
          <h3>Controle o dinheiro do negócio</h3>
          <p>Separe o que é seu do que é da empresa, saiba quanto sobra no fim do mês e decida com número, não com achismo.</p>
        </article>
      </div>
    </div>
  </section>
```

- [ ] **Step 2: Verify forbidden terms are absent and trilha titles are present**

Run: `grep -in "mec\|faculdade\|gradua\|diploma\|fature\|ganhe dinheiro\|lucro garantido" index.html`
Expected: no output.

Run: `grep -c "trilha-card" index.html`
Expected: `4`

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add para-quem-e and trilhas sections to index.html"
```

---

### Task 4: `index.html` — "Como funciona", "Contato" and footer

**Files:**
- Modify: `index.html` (insert final sections and the shared footer immediately before `</body>`, after the trilhas section from Task 3)

**Interfaces:**
- Consumes: `.passos-grade`, `.passo-card`, `.rodape*` classes from Task 1
- Produces: the canonical footer HTML block that Tasks 5 and 6 must copy **verbatim** into `termos.html` and `privacidade.html`

- [ ] **Step 1: Insert "Como funciona", "Contato" and the footer before `</body>`**

```html
  <section class="secao secao-alt" id="como-funciona">
    <div class="container">
      <h2>Como funciona</h2>
      <div class="passos-grade">
        <div class="passo-card">
          <h3>Aula curta em vídeo</h3>
          <p>Direto ao ponto, sem enrolação.</p>
        </div>
        <div class="passo-card">
          <h3>Atividade prática</h3>
          <p>Aplicada no seu próprio negócio.</p>
        </div>
        <div class="passo-card">
          <h3>Material de apoio em PDF</h3>
          <p>Para consultar quando precisar.</p>
        </div>
        <div class="passo-card">
          <h3>Certificado de conclusão de curso livre</h3>
          <p>Ao final de cada trilha.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="secao" id="contato">
    <div class="container">
      <h2>Contato</h2>
      <p>E-mail: <a href="mailto:contato@tocaonegocio.com.br">contato@tocaonegocio.com.br</a></p>
      <p>Telefone: (19) 9666-1703 / (19) 9286-2037</p>
      <p>Campinas/SP</p>
    </div>
  </section>

  <footer class="rodape">
    <div class="rodape-conteudo">
      <p class="rodape-razao-social">AUREA EDUCACIONAL LTDA</p>
      <p>CNPJ 67.140.776/0001-88</p>
      <p>Rua Pedro Vieira da Silva, 64, Apto 73 — Jardim Santa Genebra, Campinas/SP — CEP 13.080-570</p>
      <p>Telefone: (19) 9666-1703 / (19) 9286-2037 · E-mail: <a href="mailto:contato@tocaonegocio.com.br">contato@tocaonegocio.com.br</a></p>
      <p class="rodape-links">
        <a href="/termos.html">Termos de uso</a> · <a href="/privacidade.html">Política de privacidade</a>
      </p>
      <p class="rodape-legal">
        Cursos livres de capacitação profissional, nos termos do Decreto nº 5.154/2004.
        Não constituem curso de graduação ou pós-graduação.
      </p>
      <p class="rodape-copyright">© 2026 Toca o Negócio — AUREA EDUCACIONAL LTDA</p>
    </div>
  </footer>
```

- [ ] **Step 2: Verify razão social and CNPJ are present as plain text**

Run: `grep -c "AUREA EDUCACIONAL LTDA" index.html`
Expected: `2` or more (hero copyright + rodape-razao-social + rodape-copyright)

Run: `grep -c "67.140.776/0001-88" index.html`
Expected: `1`

- [ ] **Step 3: Verify forbidden terms are absent across the whole file**

Run: `grep -in "mec\|faculdade\|gradua\b\|graduação\|diploma\|instituto de ensino superior\|fature\|ganhe dinheiro\|lucro garantido" index.html`
Expected: no output (the phrase "não constituem curso de graduação" is the one intentional, required mention — check manually that this grep's `gradua` hit, if any, is only that single approved sentence).

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: complete index.html with como-funciona, contato and footer"
```

---

### Task 5: `termos.html`

**Files:**
- Create: `termos.html`

**Interfaces:**
- Consumes: the exact footer block produced in Task 4 (copy verbatim), plus `.pagina-texto`, `.secao`, `.container` from Task 1

- [ ] **Step 1: Write `termos.html`**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Termos de Uso — Toca o Negócio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/estilo.css">
</head>
<body>
  <header class="cabecalho container">
    <a class="cabecalho-marca" href="/index.html" style="text-decoration:none;">Toca o Negócio</a>
  </header>

  <section class="secao container pagina-texto">
    <h1>Termos de Uso</h1>
    <p>Última atualização: 01/08/2026.</p>

    <h2>1. Objeto</h2>
    <p>Estes Termos regulam o acesso aos cursos livres online oferecidos pela AUREA EDUCACIONAL LTDA sob a marca Toca o Negócio, adquiridos através do site tocaonegocio.com.br.</p>

    <h2>2. Forma de acesso</h2>
    <p>Após a confirmação do pagamento, o aluno recebe login e senha (ou convite de acesso) para a plataforma onde as aulas, atividades e materiais de apoio ficam disponíveis. O acesso é individual e intransferível.</p>

    <h2>3. Prazo de acesso</h2>
    <p>O acesso ao curso adquirido é válido por 12 (doze) meses a partir da data de confirmação da matrícula, salvo indicação diferente informada no momento da compra.</p>

    <h2>4. Pagamento e reembolso</h2>
    <p>Nas compras feitas pela internet, o consumidor tem direito de arrependimento no prazo de 7 (sete) dias corridos a contar da contratação ou do recebimento do produto, conforme o art. 49 do Código de Defesa do Consumidor (Lei nº 8.078/1990), com reembolso integral do valor pago mediante solicitação enviada ao e-mail de contato.</p>
    <p>Após o prazo de arrependimento, não há reembolso, exceto em casos previstos em lei ou por decisão da AUREA EDUCACIONAL LTDA.</p>

    <h2>5. Uso do conteúdo</h2>
    <p>É proibido compartilhar login e senha com terceiros, bem como copiar, redistribuir, revender ou publicar, total ou parcialmente, as aulas, materiais de apoio e demais conteúdos do curso. O descumprimento pode acarretar suspensão do acesso, sem prejuízo de outras medidas cabíveis.</p>

    <h2>6. Certificado</h2>
    <p>Ao concluir uma trilha, o aluno recebe certificado de conclusão de curso livre, emitido pela AUREA EDUCACIONAL LTDA. Trata-se de curso livre, não regulado pelo MEC, sem equivalência a curso de graduação ou pós-graduação.</p>

    <h2>7. Alterações destes Termos</h2>
    <p>Estes Termos podem ser atualizados a qualquer momento, sendo a versão vigente sempre a publicada nesta página, com a data de última atualização indicada no topo.</p>

    <h2>8. Contato</h2>
    <p>Dúvidas sobre estes Termos podem ser enviadas para contato@tocaonegocio.com.br.</p>
  </section>

  <footer class="rodape">
    <div class="rodape-conteudo">
      <p class="rodape-razao-social">AUREA EDUCACIONAL LTDA</p>
      <p>CNPJ 67.140.776/0001-88</p>
      <p>Rua Pedro Vieira da Silva, 64, Apto 73 — Jardim Santa Genebra, Campinas/SP — CEP 13.080-570</p>
      <p>Telefone: (19) 9666-1703 / (19) 9286-2037 · E-mail: <a href="mailto:contato@tocaonegocio.com.br">contato@tocaonegocio.com.br</a></p>
      <p class="rodape-links">
        <a href="/termos.html">Termos de uso</a> · <a href="/privacidade.html">Política de privacidade</a>
      </p>
      <p class="rodape-legal">
        Cursos livres de capacitação profissional, nos termos do Decreto nº 5.154/2004.
        Não constituem curso de graduação ou pós-graduação.
      </p>
      <p class="rodape-copyright">© 2026 Toca o Negócio — AUREA EDUCACIONAL LTDA</p>
    </div>
  </footer>

  <!-- AVISO: este texto foi redigido para cobrir os pontos essenciais de um termo de uso de curso online, mas deve ser revisado por advogado antes da publicação. -->
</body>
</html>
```

- [ ] **Step 2: Verify footer matches `index.html` exactly and forbidden terms are absent**

Run: `diff <(sed -n '/<footer class="rodape">/,/<\/footer>/p' index.html) <(sed -n '/<footer class="rodape">/,/<\/footer>/p' termos.html)`
Expected: no output (files identical in that range).

Run: `grep -in "faculdade\|instituto de ensino superior\|fature\|ganhe dinheiro\|lucro garantido" termos.html`
Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add termos.html
git commit -m "feat: add termos.html with real course-purchase terms"
```

---

### Task 6: `privacidade.html`

**Files:**
- Create: `privacidade.html`

**Interfaces:**
- Consumes: the exact footer block produced in Task 4 (copy verbatim), plus `.pagina-texto`, `.secao`, `.container` from Task 1

- [ ] **Step 1: Write `privacidade.html`**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Política de Privacidade — Toca o Negócio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/estilo.css">
</head>
<body>
  <header class="cabecalho container">
    <a class="cabecalho-marca" href="/index.html" style="text-decoration:none;">Toca o Negócio</a>
  </header>

  <section class="secao container pagina-texto">
    <h1>Política de Privacidade</h1>
    <p>Última atualização: 01/08/2026.</p>

    <h2>1. Quais dados coletamos</h2>
    <ul>
      <li>Nome completo</li>
      <li>E-mail</li>
      <li>Telefone</li>
      <li>Dados de pagamento (processados diretamente pela plataforma de pagamento utilizada na compra, não armazenados pela AUREA EDUCACIONAL LTDA)</li>
    </ul>

    <h2>2. Para que usamos esses dados</h2>
    <p>Nome, e-mail e telefone são usados para liberar o acesso ao curso, enviar comunicações sobre a compra e o andamento das aulas, e prestar suporte quando solicitado. Dados de pagamento são usados exclusivamente pela plataforma de pagamento para processar a cobrança.</p>

    <h2>3. Base legal (LGPD)</h2>
    <p>O tratamento desses dados se baseia na execução de contrato (art. 7º, V, da Lei nº 13.709/2018 — LGPD), já que são necessários para viabilizar o acesso ao curso adquirido, e no legítimo interesse para comunicações relacionadas à compra.</p>

    <h2>4. Compartilhamento com terceiros</h2>
    <p>Os dados podem ser compartilhados com: (i) a plataforma de pagamento, para processar a cobrança; (ii) a plataforma de hospedagem do curso e do site, para viabilizar o acesso às aulas e ao conteúdo. Não vendemos nem compartilhamos dados com terceiros para fins de marketing sem consentimento.</p>

    <h2>5. Tempo de retenção</h2>
    <p>Os dados são mantidos enquanto durar o acesso ao curso e pelo prazo adicional necessário para cumprir obrigações legais e fiscais, sendo eliminados ou anonimizados após esse período.</p>

    <h2>6. Seus direitos</h2>
    <p>Nos termos do art. 18 da LGPD, o titular pode solicitar confirmação de tratamento, acesso, correção, anonimização, portabilidade ou eliminação de seus dados, além de revogar consentimentos dados. Solicitações podem ser feitas pelo e-mail contato@tocaonegocio.com.br.</p>

    <h2>7. Alterações desta política</h2>
    <p>Esta política pode ser atualizada a qualquer momento, sendo a versão vigente sempre a publicada nesta página, com a data de última atualização indicada no topo.</p>
  </section>

  <footer class="rodape">
    <div class="rodape-conteudo">
      <p class="rodape-razao-social">AUREA EDUCACIONAL LTDA</p>
      <p>CNPJ 67.140.776/0001-88</p>
      <p>Rua Pedro Vieira da Silva, 64, Apto 73 — Jardim Santa Genebra, Campinas/SP — CEP 13.080-570</p>
      <p>Telefone: (19) 9666-1703 / (19) 9286-2037 · E-mail: <a href="mailto:contato@tocaonegocio.com.br">contato@tocaonegocio.com.br</a></p>
      <p class="rodape-links">
        <a href="/termos.html">Termos de uso</a> · <a href="/privacidade.html">Política de privacidade</a>
      </p>
      <p class="rodape-legal">
        Cursos livres de capacitação profissional, nos termos do Decreto nº 5.154/2004.
        Não constituem curso de graduação ou pós-graduação.
      </p>
      <p class="rodape-copyright">© 2026 Toca o Negócio — AUREA EDUCACIONAL LTDA</p>
    </div>
  </footer>

  <!-- AVISO: este texto foi redigido para cobrir os pontos essenciais de uma política de privacidade de curso online (LGPD), mas deve ser revisado por advogado antes da publicação. -->
</body>
</html>
```

- [ ] **Step 2: Verify footer matches `index.html` exactly and forbidden terms are absent**

Run: `diff <(sed -n '/<footer class="rodape">/,/<\/footer>/p' index.html) <(sed -n '/<footer class="rodape">/,/<\/footer>/p' privacidade.html)`
Expected: no output.

Run: `grep -in "faculdade\|instituto de ensino superior\|fature\|ganhe dinheiro\|lucro garantido" privacidade.html`
Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add privacidade.html
git commit -m "feat: add privacidade.html with LGPD-covering privacy policy"
```

---

### Task 7: Cross-page verification (mobile layout, page weight, consistency)

**Files:**
- No new files. This task only verifies Tasks 1–6.

**Interfaces:**
- Consumes: all files produced by Tasks 1–6.

- [ ] **Step 1: Check index.html total weight is under budget**

Run (from project root):
```bash
du -cb index.html css/estilo.css | tail -1
```
Expected: total under `300000` bytes (300 KB). Fonts are loaded from Google's CDN and not counted in local weight, but note actual network weight should also be checked in-browser (see Step 3).

- [ ] **Step 2: Confirm no forbidden terms in any shipped HTML file**

Run:
```bash
grep -in "mec\b\|faculdade\|diploma\|instituto de ensino superior\|instituição de ensino superior\|fature\|ganhe dinheiro\|lucro garantido\|método validado\|resultados comprovados" index.html termos.html privacidade.html
```
Expected: no output.

Run:
```bash
grep -in "graduação\|pós-graduação" index.html termos.html privacidade.html
```
Expected: only the approved sentence "Não constituem curso de graduação ou pós-graduação" appears (once per file, inside the shared footer, plus once more inside the certificate clause of `termos.html`) — no other mentions.

Run:
```bash
grep -in "solução\|jornada\|transformação\|empoderar\|descomplicar" index.html termos.html privacidade.html
```
Expected: no output.

- [ ] **Step 3: Confirm no invented social proof and no menu/nav**

Run:
```bash
grep -in "aluno[s]? já\|avalia\|depoimento\|nota [0-9]\|estrelas\|selo\b" index.html
```
Expected: no output.

Open `index.html` and confirm the `<header>` contains only the brand name and a single contact link/button — no list of navigation links to other sections or pages.

- [ ] **Step 4: Confirm the accent color is used only on the contact button**

Run:
```bash
grep -n "cor-destaque" css/estilo.css
```
Expected: `--cor-destaque` is defined once in `:root`, referenced by `--cor-destaque-texto`'s pairing in `.botao` (background) — and nowhere else (no heading, link or card rule should reference `var(--cor-destaque)`).

- [ ] **Step 5: Visual/layout check at 360px viewport**

Open `index.html`, `termos.html` and `privacidade.html` directly in a browser (double-click the file, or use the chrome-devtools skill to open + `resize_page` to 360×640) and confirm:
- No horizontal scrollbar appears on any of the three pages.
- The footer text is fully readable, not clipped, not behind any collapsed element, not light gray.
- The four trilha cards and four "como funciona" cards stack in a single column.
- The contact button is the only element using the accent color; everything else is text-colored or bordered.

- [ ] **Step 6: Confirm footer is byte-identical across all three pages**

Run:
```bash
diff <(sed -n '/<footer class="rodape">/,/<\/footer>/p' index.html) <(sed -n '/<footer class="rodape">/,/<\/footer>/p' termos.html)
diff <(sed -n '/<footer class="rodape">/,/<\/footer>/p' index.html) <(sed -n '/<footer class="rodape">/,/<\/footer>/p' privacidade.html)
```
Expected: no output from either command.

- [ ] **Step 7: Commit (only if any fix was needed in this task)**

```bash
git add -A
git commit -m "fix: adjustments from cross-page verification pass"
```
(Skip this step if no changes were needed.)

---

### Task 8: `README.md`

**Files:**
- Create: `README.md`

- [ ] **Step 1: Write `README.md`**

```markdown
# Site Toca o Negócio

Site institucional da AUREA EDUCACIONAL LTDA (marca Toca o Negócio).
HTML e CSS puros — não tem build, não tem servidor, não precisa instalar nada.

## Como editar os textos

- Os textos da página principal estão em `index.html`.
- Os textos de Termos de Uso estão em `termos.html`.
- Os textos de Política de Privacidade estão em `privacidade.html`.
- As cores, fontes e espaçamentos estão em `css/estilo.css`.

Para editar um texto, abra o arquivo `.html` correspondente em qualquer
editor (inclusive o Bloco de Notas), procure a frase que quer mudar, e
troque. Cada bloco de texto fica entre uma tag de abertura (tipo `<p>`) e
uma de fechamento (`</p>`) — troque só o texto entre elas, sem apagar as
tags.

## Atenção ao rodapé

O rodapé (razão social, CNPJ, endereço, telefone, e-mail) aparece **três
vezes**, uma em cada página (`index.html`, `termos.html`,
`privacidade.html`), porque o site não usa nenhuma ferramenta para
compartilhar esse trecho automaticamente. Se for atualizar telefone,
endereço ou e-mail, é preciso editar **as três páginas**, senão elas ficam
diferentes entre si.

## Como ver o resultado antes de publicar

Basta dar duplo clique no arquivo `index.html` — ele abre no seu
navegador normalmente, sem precisar de internet (exceto para carregar a
fonte).

## Como publicar uma alteração

1. Salve os arquivos editados.
2. Envie as alterações para o GitHub (`git add`, `git commit`, `git push`)
   — ou peça para o Claude Code fazer isso por você.
3. O GitHub Pages atualiza o site sozinho, em geral em poucos minutos.

Para o passo a passo completo de publicação (incluindo domínio e HTTPS),
veja `docs/publicar-github-pages.md`.
```

- [ ] **Step 2: Verify README exists and is non-empty**

Run: `wc -l README.md`
Expected: output shows more than 0 lines.

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: add README with editing and publishing instructions"
```

---

### Task 9: `docs/publicar-github-pages.md`

**Files:**
- Create: `docs/publicar-github-pages.md`

- [ ] **Step 1: Write `docs/publicar-github-pages.md`**

```markdown
# Publicar no GitHub Pages com domínio próprio

## 1. Criar o repositório no GitHub

1. Crie um repositório novo no GitHub (pode ser público ou privado).
2. Envie esta pasta para o repositório:
   ```bash
   git remote add origin <URL-do-repositorio>
   git branch -M main
   git push -u origin main
   ```

## 2. Ativar o GitHub Pages

1. No repositório, vá em **Settings → Pages**.
2. Em "Build and deployment", escolha **Deploy from a branch**.
3. Escolha a branch `main` e a pasta `/ (root)`.
4. Salve. O GitHub vai gerar uma URL temporária tipo
   `https://<usuario>.github.io/<repositorio>/` — é normal ela não
   funcionar com o domínio próprio ainda nesta etapa.

## 3. Apontar o domínio do registro.br

O arquivo `CNAME` já está na pasta com o conteúdo `tocaonegocio.com.br` —
isso avisa o GitHub Pages qual domínio deve responder por este site.
Falta configurar o DNS no lado do registro.br:

1. Entre no painel do registro.br, na área de **DNS** do domínio
   `tocaonegocio.com.br`.
2. Crie os seguintes registros:

   | Tipo  | Nome (host) | Valor / Destino                  |
   |-------|-------------|-----------------------------------|
   | A     | @           | 185.199.108.153                   |
   | A     | @           | 185.199.109.153                   |
   | A     | @           | 185.199.110.153                   |
   | A     | @           | 185.199.111.153                   |
   | CNAME | www         | `<usuario>.github.io.`            |

   (Esses quatro IPs são os endereços oficiais do GitHub Pages — cadastre
   os quatro como registros `A` separados no host raiz `@`.)

3. Salve e aguarde a propagação — pode levar de alguns minutos a algumas
   horas.

## 4. Confirmar o domínio no GitHub e ativar HTTPS

1. Volte em **Settings → Pages** no repositório.
2. No campo "Custom domain", digite `tocaonegocio.com.br` e salve. O
   GitHub vai verificar o DNS automaticamente (pode levar alguns minutos).
3. Assim que o GitHub confirmar o domínio, marque a opção **Enforce
   HTTPS**. Isso ativa um certificado HTTPS gratuito para o domínio —
   pode demorar até algumas horas para o certificado ficar disponível
   logo após a confirmação do domínio.
4. Depois de ativo, acesse `https://tocaonegocio.com.br` para confirmar
   que o site abre com o cadeado de segurança normalmente.

## Checklist antes de abrir a verificação de empresa na Meta

- [ ] Site abre em `https://tocaonegocio.com.br` com HTTPS ativo (cadeado
      no navegador, sem aviso de site não seguro).
- [ ] Razão social **AUREA EDUCACIONAL LTDA** e CNPJ **67.140.776/0001-88**
      aparecem como texto normal (selecionável) na página principal, sem
      precisar rolar muito para achar.
- [ ] Endereço no rodapé bate exatamente com o endereço registrado no
      CNPJ (mesma rua, número, complemento, bairro, cidade e CEP).
- [ ] Nenhuma página menciona MEC, faculdade, graduação, pós-graduação,
      diploma ou reconhecimento oficial.
- [ ] Nenhuma página promete resultado financeiro.
- [ ] A meta tag de verificação de domínio da Meta (obtida no
      Gerenciador de Negócios, em Configurações da Empresa → Domínios)
      foi colada no `<head>` de `index.html`, no lugar do comentário
      `<!-- META DOMAIN VERIFICATION ... -->`, e o site foi republicado
      depois disso.
- [ ] `termos.html` e `privacidade.html` foram revisados por um
      advogado, conforme os avisos deixados no HTML dessas páginas.
```

- [ ] **Step 2: Verify the DNS table and checklist are present**

Run: `grep -c "185.199.10" docs/publicar-github-pages.md`
Expected: `4`

- [ ] **Step 3: Commit**

```bash
git add docs/publicar-github-pages.md
git commit -m "docs: add GitHub Pages + DNS + HTTPS + Meta verification checklist"
```

---

## Self-Review Notes

- **Spec coverage:** all five index sections (Topo, Para quem é, As
  trilhas, Como funciona, Contato), both legal pages, the shared footer,
  CNAME/.nojekyll, README, and the GitHub Pages/DNS/Meta checklist each
  map to exactly one task above.
- **Placeholder scan:** no TBD/TODO/lorem left; the one intentional
  placeholder (phone number) is explicitly called out as such per the
  user's own instruction, not left ambiguous.
- **Type/name consistency:** CSS class names introduced in Task 1
  (`.trilha-card`, `.passo-card`, `.rodape*`, `.pagina-texto`, etc.) are
  the exact names used in Tasks 2–6; footer HTML block is reproduced
  identically in Tasks 4, 5 and 6 and cross-checked by `diff` in Task 7.
