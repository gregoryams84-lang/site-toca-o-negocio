# Home cinematográfica — Design

## Contexto

Gregory viu o site https://unitedcarriers.com/ (Webflow + Three.js/WebGL globo 3D + GSAP + Lenis + Barba.js, produção de estúdio) e quer trazer parte dessa sensação — animação, mudança de ângulo, zoom automático, scroll horizontal→vertical — pra página inicial do Toca o Negócio, com identidade própria (não uma cópia literal) e sem custo financeiro adicional.

Decisões já tomadas na conversa:
- Escopo: **só a página inicial** (`index.html`). As páginas de trilha, compra e painel do aluno continuam como estão.
- Não replicar o globo 3D/WebGL — usar as 4 fotos de mesa de trabalho já existentes (`img/trilhas/*.jpg`), que já têm identidade com o curso, como base da sequência cinematográfica.
- SEO é regra obrigatória, não detalhe — nenhum texto real pode existir só dentro de canvas/imagem; tudo que o Google precisa ler continua sendo HTML semântico de verdade.
- Nova cor de destaque: `--terracota: #6B2A20` (já adicionada em `css/estilo.css`), inspirada em duas imagens de referência que Gregory trouxe (paleta verde + creme + terracota/vermelho — combina com a paleta já existente do site).
- **Sem build step** — GSAP, ScrollTrigger e Lenis carregados via CDN (`https://cdn.jsdelivr.net/npm/...`), do mesmo jeito que o site já carrega o Supabase via ESM CDN em `comprar.html`. O modelo de publicação (arquivos estáticos, GitHub Pages, sem compilação) não muda.

## O que muda

**Seção do topo (`#topo`) vira uma sequência cinematográfica de 4 capítulos**, um por trilha, usando as fotos já existentes (`img/trilhas/venda-pelo-whatsapp.jpg`, `ia-no-negocio.jpg`, `formalizacao-da-empresa.jpg`, `gestao-financeira.jpg`). Cada capítulo mostra a foto em tela cheia, um rótulo pequeno ("Trilha 1 de 4" em terracota), um título curto e uma frase de efeito — reaproveitando os títulos/descrições já escritos nos cards de "As trilhas".

**A seção "As trilhas" (grade com os 4 cards clicáveis, com `<h3><a>`, texto e prévia curricular) continua exatamente como está, logo depois.** A sequência cinematográfica é a abertura emocional; a grade é a parte funcional — link direto, texto indexável, sem depender de JavaScript pra existir. Um não substitui o outro; ambos mostram as mesmas 4 trilhas de formas diferentes e complementares.

O restante da página (Para quem é, Investimento, Assista de graça, Como funciona, Contato) não muda de conteúdo, mas ganha uma leve animação de entrada (fade + leve deslocamento) ao rolar até cada seção, usando GSAP ScrollTrigger — sutil, não é scroll-jacking, só uma transição suave.

## Mecânica do scroll horizontal → vertical

Enquanto o usuário rola a página dentro da sequência dos 4 capítulos, a seção fica "presa" na tela (`ScrollTrigger.pin`) e o conteúdo se desloca **horizontalmente** — como um filme passando pelas 4 trilhas — na proporção do scroll vertical do mouse/dedo (padrão já documentado do GSAP ScrollTrigger, usado em muitos sites de portfólio/agência). Ao terminar o 4º capítulo, a seção libera o scroll e a página volta ao comportamento vertical normal, seguindo pro resto do conteúdo.

## Zoom automático e mudança de ângulo

Dentro de cada capítulo, enquanto ele está em foco:
- **Zoom automático**: a foto tem uma animação lenta e contínua de zoom (efeito "Ken Burns", como em documentário), via `transform: scale()` animado com CSS/GSAP.
- **Mudança de ângulo**: ao trocar de capítulo, a foto atual gira/inclina levemente (`perspective` + `rotateY`/`rotateX` em CSS, valores pequenos — efeito de profundidade, não uma rotação 3D completa) antes de sair de cena, dando sensação de câmera se movendo. Isso é feito inteiramente com CSS 3D transforms — não há WebGL, não há Three.js, não há modelo 3D real.

## Cor nova

`--terracota` aparece na sequência cinematográfica: nos rótulos de capítulo ("Trilha 1 de 4"), numa barra de progresso fina indicando em qual capítulo o usuário está, e em pequenos detalhes de destaque — nunca como cor dominante, sempre como acento sobre o verde/creme que já são a identidade principal da marca.

## Stack técnica

- **GSAP** (core + plugin **ScrollTrigger**) — via CDN jsdelivr, gratuito (a Webflow adquiriu o GSAP e liberou todos os plugins de graça em 2025, incluindo os que antes eram pagos).
- **Lenis** — scroll suave com inércia, via CDN jsdelivr, gratuito, open-source.
- CSS 3D transforms nativas do navegador (`perspective`, `transform: rotateX/rotateY/scale`) — sem biblioteca nenhuma.
- Sem Three.js, sem WebGL, sem canvas de sequência de quadros.
- Sem build step, sem bundler — os scripts são carregados via `<script>` no `<head>`/fim do `<body>`, igual ao resto do site.

## Cuidados de SEO/performance (regra obrigatória, não opcional)

- Todo texto real (títulos das trilhas, frases de efeito) é HTML semântico de verdade (`<h1>`/`<h2>`/`<p>`), nunca desenhado dentro de imagem ou canvas — permanece 100% indexável pelo Google.
- As mesmas 4 imagens já existentes são reaproveitadas (não duplicamos peso de imagem) — `loading="eager"` só na primeira (acima da dobra, crítica pro LCP), as outras 3 continuam `loading="lazy"`.
- Os scripts do GSAP/Lenis carregam de forma a não bloquear a primeira renderização do conteúdo (`defer` ou carregamento no fim do `<body>`).
- Teste de velocidade (Lighthouse) antes e depois da mudança, pra confirmar que não piora o que já foi construído.
- Em telas pequenas (celular), a sequência cinematográfica é simplificada — mantém zoom/fade, mas sem o scroll horizontal (que é mais difícil de controlar bem no toque) — vira uma sequência vertical simples, mais leve.

## Fora de escopo

- Páginas de trilha, compra, painel do aluno, ou qualquer página além de `index.html`.
- Cena 3D real (Three.js/WebGL) — decisão explícita de não replicar o globo do site de referência.
- Transições de página estilo SPA (Barba.js) — cada página continua carregando normalmente.
- Build step/bundler — mantém o modelo atual de arquivos estáticos publicados direto.
