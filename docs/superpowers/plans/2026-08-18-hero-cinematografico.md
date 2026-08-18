# Home cinematográfica — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A página inicial abre com uma sequência de 4 capítulos (um por trilha) que desliza na horizontal conforme o usuário rola a página, com zoom automático e leve mudança de ângulo em cada foto — sem WebGL, sem build step, sem piorar SEO/velocidade.

**Architecture:** HTML/CSS/JS estático, sem build step. GSAP + ScrollTrigger + Lenis carregados via CDN (jsdelivr). A seção `#topo` de `index.html` vira a sequência cinematográfica; a seção `#trilhas` (grade clicável já existente) não muda. No mobile, a sequência vira uma pilha vertical simples, sem scroll horizontal.

**Tech Stack:** GSAP 3 (core + ScrollTrigger), Lenis — ambos via CDN, sem npm/bundler. CSS 3D transforms nativas.

## Global Constraints

- Sem build step, sem bundler — GSAP/ScrollTrigger/Lenis carregam via `<script>` de CDN, mesmo padrão de carregamento externo já usado no site (ESM CDN do Supabase em `comprar.html`).
- Todo texto real (títulos, frases) é HTML semântico de verdade (`<h1>`/`<h2>`/`<p>`) — nunca desenhado em imagem/canvas. O `<h1>` da página continua com o mesmo texto de sempre ("Cursos práticos pra quem toca o negócio sozinho."), só ganha uma foto de fundo nova.
- Escopo é só `index.html` — nenhuma outra página muda.
- No mobile (`max-width: 767px`), a sequência não usa scroll horizontal nem pin — vira 4 blocos verticais normais, mais leves.
- A primeira imagem carrega com `loading="eager"` (é o conteúdo principal acima da dobra); as outras 3 continuam `loading="lazy"`.
- A cor `--terracota` (já existe em `css/estilo.css`) é usada como destaque nos rótulos de capítulo e na barra de progresso — nunca como cor dominante.

---

## Task 1: CSS da sequência cinematográfica

**Repositório:** `site-toca-o-negocio`

**Files:**
- Modify: `css/estilo.css`

**Interfaces:**
- Produces: classes `.hero-cinematico`, `.hero-cinematico-trilhos`, `.hero-capitulo`, `.hero-capitulo-imagem`, `.hero-capitulo-conteudo`, `.hero-capitulo-rotulo`, `.hero-cinematico-progresso`, `.hero-cinematico-progresso-barra`, modificador `.capitulo-ativo`. Tasks 2 e 3 consomem essas classes.

- [ ] **Step 1: Adicionar as classes ao final de `css/estilo.css`**

```css
/* ---- Home cinematográfica ---- */
.hero-cinematico {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.hero-cinematico-trilhos {
  display: flex;
  height: 100%;
  width: 400%;
}

.hero-capitulo {
  position: relative;
  width: 25%;
  height: 100%;
  flex-shrink: 0;
  overflow: hidden;
  perspective: 1000px;
}

.hero-capitulo-imagem {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1) rotateY(0deg);
  transition: transform 8s ease-out;
  transform-origin: center center;
}

.hero-capitulo.capitulo-ativo .hero-capitulo-imagem {
  transform: scale(1.12) rotateY(-2deg);
}

.hero-capitulo::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(22, 25, 28, 0.78) 0%, rgba(22, 25, 28, 0.35) 55%, rgba(22, 25, 28, 0.08) 100%);
  z-index: 1;
}

.hero-capitulo-conteudo {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 20px;
  max-width: 600px;
}

.container .hero-capitulo-conteudo,
.hero-capitulo-conteudo {
  margin-left: max(20px, calc((100vw - var(--largura-maxima)) / 2 + 20px));
}

.hero-capitulo-conteudo h1,
.hero-capitulo-conteudo h2 {
  color: #FFFFFF;
}

.hero-capitulo-conteudo p,
.hero-capitulo-conteudo .subtitulo {
  color: #FFFFFF;
}

.hero-capitulo-rotulo {
  display: inline-block;
  background: var(--terracota);
  color: #FFFFFF;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  padding: 5px 12px;
  border-radius: 4px;
  margin: 0 0 16px 0;
  align-self: flex-start;
}

.hero-cinematico-progresso {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  z-index: 3;
}

.hero-cinematico-progresso-barra {
  height: 100%;
  width: 0%;
  background: var(--terracota);
}

@media (max-width: 767px) {
  .hero-cinematico {
    height: auto;
  }

  .hero-cinematico-trilhos {
    width: 100%;
    flex-direction: column;
  }

  .hero-capitulo {
    width: 100%;
    height: 100vh;
  }

  .hero-cinematico-progresso {
    display: none;
  }
}
```

Nota: o seletor `.hero-capitulo-conteudo { margin-left: max(20px, calc((100vw - var(--largura-maxima)) / 2 + 20px)); }` alinha o texto do capítulo com a mesma margem esquerda do `.container` já usado no resto do site (`--largura-maxima: 1080px`), sem precisar envolver o conteúdo num `.container` de verdade (que centralizaria e limitaria a largura, o que não queremos aqui já que a imagem precisa ocupar 100% da largura do capítulo).

- [ ] **Step 2: Commit**

```bash
git add css/estilo.css
git commit -m "feat: add CSS for the cinematic homepage hero sequence"
```

---

## Task 2: HTML — substituir `#topo` pela sequência de 4 capítulos

**Repositório:** `site-toca-o-negocio`

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: classes da Task 1; imagens já existentes em `img/trilhas/*.jpg`.
- Produces: markup dos 4 capítulos com `id`s que a Task 3 (JS) vai consumir (`hero-cinematico`, `hero-cinematico-trilhos`, `progresso-barra`, classe `hero-capitulo`).

- [ ] **Step 1: Substituir a seção `<section class="secao container" id="topo">...</section>` (o antigo hero) por**

```html
  <section class="hero-cinematico" id="topo">
    <div class="hero-cinematico-trilhos" id="hero-trilhos">
      <article class="hero-capitulo capitulo-ativo">
        <img src="img/trilhas/venda-pelo-whatsapp.jpg" alt="Mesa de trabalho com celular mostrando conversa no WhatsApp, caixa de pedidos e caderno de catálogo de produtos" class="hero-capitulo-imagem" loading="eager" width="1024" height="559">
        <div class="hero-capitulo-conteudo">
          <p class="hero-capitulo-rotulo">Trilha 1 de 4</p>
          <h1>Cursos práticos pra quem toca o negócio sozinho.</h1>
          <p class="subtitulo">Venda, IA, formalização e financeiro — direto ao ponto, pra quem não tem uma equipe pra cada área.</p>
        </div>
      </article>
      <article class="hero-capitulo">
        <img src="img/trilhas/ia-no-negocio.jpg" alt="Mesa de trabalho com caderno de tarefas, caneta, engrenagem dourada, calculadora e café" class="hero-capitulo-imagem" loading="lazy" width="1024" height="559">
        <div class="hero-capitulo-conteudo">
          <p class="hero-capitulo-rotulo">Trilha 2 de 4</p>
          <h2>Use inteligência artificial no dia a dia</h2>
          <p>Escreva anúncio, responda dúvida repetida e organize sua agenda com ferramentas de IA gratuitas.</p>
        </div>
      </article>
      <article class="hero-capitulo">
        <img src="img/trilhas/formalizacao-da-empresa.jpg" alt="Mesa com calendário marcado, pasta de documentos com selo dourado &quot;resolvido&quot; e caneta" class="hero-capitulo-imagem" loading="lazy" width="1024" height="559">
        <div class="hero-capitulo-conteudo">
          <p class="hero-capitulo-rotulo">Trilha 3 de 4</p>
          <h2>Coloque a empresa em dia</h2>
          <p>Entenda o que precisa emitir, pagar e declarar para funcionar dentro da lei, sem depender de um contador para cada dúvida.</p>
        </div>
      </article>
      <article class="hero-capitulo">
        <img src="img/trilhas/gestao-financeira.jpg" alt="Potes de vidro organizados com dinheiro, rotulados Transporte, Alimentação e Poupança, ao lado de um caderno com gráfico de crescimento" class="hero-capitulo-imagem" loading="lazy" width="1024" height="559">
        <div class="hero-capitulo-conteudo">
          <p class="hero-capitulo-rotulo">Trilha 4 de 4</p>
          <h2>Controle o dinheiro do negócio</h2>
          <p>Separe o que é seu do que é da empresa, saiba quanto sobra no fim do mês e decida com número, não com achismo.</p>
          <a class="botao" href="#trilhas">Conheça o curso</a>
        </div>
      </article>
    </div>
    <div class="hero-cinematico-progresso"><div class="hero-cinematico-progresso-barra" id="progresso-barra"></div></div>
  </section>
```

O primeiro capítulo já nasce com a classe `capitulo-ativo` (pra não depender do JS carregar antes de mostrar o zoom inicial correto) e mantém o `<h1>` com o texto exato que já existia — só ganhou uma foto de fundo. Os capítulos 2-4 usam `<h2>`, sem pular nível de título.

- [ ] **Step 2: Verificar manualmente (sem JS ainda — só o HTML/CSS)**

Sirva o repositório localmente (`python -m http.server 8080` a partir da raiz), abra `index.html`. Confirme: os 4 capítulos aparecem um do lado do outro ocupando 400% de largura (vai parecer "quebrado"/cortado nessa etapa — é esperado, o comportamento de scroll horizontal só existe depois da Task 3); o primeiro capítulo mostra o `<h1>` original com a foto de fundo; em mobile (~360px), os 4 capítulos empilham na vertical (isso já funciona só com CSS, por causa do media query da Task 1).

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: replace home hero with 4-chapter cinematic markup"
```

---

## Task 3: JS — scroll horizontal, zoom, progresso (GSAP + ScrollTrigger + Lenis via CDN)

**Repositório:** `site-toca-o-negocio`

**Files:**
- Modify: `index.html` (adicionar as tags `<script>` de CDN e o novo script)
- Create: `js/hero-cinematografico.js`

**Interfaces:**
- Consumes: elementos/classes das Tasks 1 e 2 (`#hero-trilhos`, `.hero-capitulo`, `#progresso-barra`, `.hero-cinematico`).
- Produces: comportamento de scroll horizontal em desktop (`min-width: 768px`), pilha vertical simples em mobile, atualização da barra de progresso e da classe `.capitulo-ativo` conforme o scroll.

- [ ] **Step 1: Adicionar as tags de script no final do `<body>` de `index.html`, antes do `</body>`**

```html
  <script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js" defer></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js" defer></script>
  <script src="https://cdn.jsdelivr.net/npm/lenis@1/dist/lenis.min.js" defer></script>
  <script src="js/hero-cinematografico.js" defer></script>
```

Adicionar essas 4 linhas logo antes de `<script src="js/consentimento.js"></script>` (ou logo depois — ordem entre elas não importa, mas todas precisam vir depois das tags de CDN acima, já que dependem de `gsap`/`ScrollTrigger`/`Lenis` já estarem definidos globalmente).

- [ ] **Step 2: Escrever `js/hero-cinematografico.js`**

```javascript
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  ScrollTrigger.matchMedia({
    '(min-width: 768px)': function () {
      const secao = document.querySelector('.hero-cinematico');
      const trilhos = document.getElementById('hero-trilhos');
      const capitulos = gsap.utils.toArray('.hero-capitulo');
      const barraProgresso = document.getElementById('progresso-barra');

      if (!secao || !trilhos || capitulos.length === 0) return;

      const distanciaHorizontal = () => trilhos.scrollWidth - secao.offsetWidth;

      const tween = gsap.to(trilhos, {
        x: () => -distanciaHorizontal(),
        ease: 'none',
        scrollTrigger: {
          trigger: secao,
          pin: true,
          scrub: 1,
          end: () => '+=' + distanciaHorizontal() * 1.2,
          onUpdate: (self) => {
            if (barraProgresso) {
              barraProgresso.style.width = (self.progress * 100) + '%';
            }
            const indiceAtivo = Math.min(
              capitulos.length - 1,
              Math.floor(self.progress * capitulos.length)
            );
            capitulos.forEach((capitulo, indice) => {
              capitulo.classList.toggle('capitulo-ativo', indice === indiceAtivo);
            });
          },
        },
      });

      return () => {
        tween.scrollTrigger.kill();
        tween.kill();
      };
    },

    '(max-width: 767px)': function () {
      const capitulos = gsap.utils.toArray('.hero-capitulo');
      capitulos.forEach((capitulo) => capitulo.classList.add('capitulo-ativo'));
    },
  });
}
```

O `if (typeof gsap !== 'undefined' ...)` no topo é uma proteção: se o CDN falhar (rede instável, bloqueio de terceiros), a página continua funcionando normalmente — só sem a animação. O primeiro capítulo já nasceu com `capitulo-ativo` no HTML (Task 2), então mesmo se este script nunca rodar, o layout inicial continua correto.

- [ ] **Step 3: Verificar manualmente**

Sirva o repositório localmente, abra `index.html` num navegador desktop largo (>= 768px). Confirme: ao rolar a página, a seção do topo fica "presa" na tela e os 4 capítulos deslizam na horizontal; a barra de progresso (linha fina no rodapé da seção) cresce da esquerda pra direita conforme o scroll; cada capítulo, ao ficar ativo, aplica um zoom lento na foto; ao terminar o 4º capítulo, o scroll volta ao normal (vertical) e segue pro resto da página. Redimensione pra ~360px (mobile): confirme que os 4 capítulos aparecem empilhados na vertical, sem scroll horizontal, sem barra de progresso. Abra o console do navegador e confirme que não há nenhum erro (inclusive verificando se as 3 URLs de CDN carregaram com sucesso — status 200, não 404; se alguma delas retornar 404, ajuste a versão/caminho no `<script src>` correspondente até resolver).

- [ ] **Step 4: Commit**

```bash
git add index.html js/hero-cinematografico.js
git commit -m "feat: add GSAP/ScrollTrigger/Lenis-powered horizontal scroll for the hero sequence"
```

---

## Task 4: Verificação final (SEO, performance, regressão)

**Repositório:** `site-toca-o-negocio`, verificação apenas — sem alterações de código, a menos que algo precise de ajuste.

- [ ] **Step 1: Verificar que o conteúdo real continua indexável**

Com o repositório servido localmente, veja o código-fonte da página (`Ctrl+U` ou `view-source:http://localhost:8080/index.html`) — confirme que o texto do `<h1>` e dos 4 `<h2>`/`<p>` dos capítulos aparece como texto de verdade no HTML (não como atributo de imagem nem gerado só via JS depois do carregamento) — isso já é garantido pela Task 2 (o HTML nasce completo, o JS só anima), mas vale confirmar visualmente no código-fonte.

- [ ] **Step 2: Rodar Lighthouse**

No Chrome DevTools, aba Lighthouse (ou `mcp__chrome-devtools__performance_start_trace`/`lighthouse_audit` se disponível), rode uma auditoria de Performance e SEO em `index.html`. Compare informalmente com a expectativa de um site estático leve — não deve haver quedas drásticas de LCP (a primeira imagem tem `loading="eager"`) nem CLS alto. Registre a pontuação obtida no relatório desta task.

- [ ] **Step 3: Regressão**

Navegue pelo resto da home (Para quem é, As trilhas, Investimento, Assista de graça, Como funciona, Contato) e confirme que nada quebrou — os links das trilhas, o formulário de preços, os botões do cabeçalho continuam funcionando. Confirme que `#trilhas` (destino do botão "Conheça o curso" dentro do capítulo 4) ainda rola corretamente até a seção de cards.

- [ ] **Step 4: Registrar o resultado**

Se todos os passos passarem, este incremento está pronto — nenhum commit de código neste passo, a menos que a Lighthouse ou a regressão tenham revelado algo que precise de ajuste (nesse caso, aplicar o ajuste mínimo necessário e commitar separadamente, documentando o que mudou e por quê).
