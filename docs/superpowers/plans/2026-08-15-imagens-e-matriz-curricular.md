# Imagens e matriz curricular das trilhas — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cada trilha (na home e na página própria) mostra uma imagem temática e a lista real das 6 aulas que a compõem, tirada do currículo já escrito.

**Architecture:** Mudança puramente de conteúdo/apresentação — HTML e CSS, sem JavaScript novo, sem backend. As imagens já existem em `img/trilhas/*.jpg` (commitadas). O texto da matriz curricular é copiado literalmente de `docs/curriculo-completo.md` para dentro de cada página.

**Tech Stack:** HTML/CSS estático, sem build step — mesmo padrão do resto do site.

## Global Constraints

- Sem framework, sem build step — mesmo padrão do resto do site.
- Nenhum texto novo de currículo é inventado — todo o conteúdo das aulas vem literalmente de `docs/curriculo-completo.md`.
- As imagens já existem em `img/trilhas/{venda-pelo-whatsapp,ia-no-negocio,formalizacao-da-empresa,gestao-financeira}.jpg`, todas 1024×559px — não precisam ser criadas ou processadas nesta implementação.
- Sem testes automatizados (site estático, mesmo padrão já estabelecido) — verificação manual visual.

---

## Task 1: CSS — estilos para imagem de card, prévia curricular, imagem de herói e matriz curricular

**Repositório:** `site-toca-o-negocio`

**Files:**
- Modify: `css/estilo.css`

**Interfaces:**
- Produces: classes `.trilha-card-imagem`, `.trilha-card-previa`, `.trilha-hero-imagem`, `.matriz-curricular` (e filhos). Tasks 2 e 3 consomem essas classes.

- [ ] **Step 1: Adicionar as classes ao final de `css/estilo.css`**

```css
/* ---- Imagens e matriz curricular das trilhas ---- */
.trilha-card-imagem {
  display: block;
  width: calc(100% + 48px);
  height: auto;
  margin: -24px -24px 16px -24px;
  border-radius: 8px 8px 0 0;
}

.trilha-card-previa {
  color: var(--neutro);
  font-size: 13px;
  margin: 12px 0 0 0;
}

.trilha-hero-imagem {
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 24px;
}

.matriz-curricular {
  list-style: none;
  padding: 0;
  margin: 24px 0;
  counter-reset: aula;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.matriz-curricular li {
  counter-increment: aula;
  padding: 16px 20px 16px 56px;
  border: 1px solid var(--borda);
  border-radius: 8px;
  position: relative;
}

.matriz-curricular li::before {
  content: counter(aula);
  position: absolute;
  left: 16px;
  top: 16px;
  color: var(--verde);
  font-family: var(--fonte-display);
  font-weight: 700;
  font-size: 18px;
}

.matriz-curricular h3 {
  margin: 0 0 4px 0;
  font-size: 17px;
}

.matriz-curricular p {
  margin: 0;
  color: var(--neutro);
  font-size: 15px;
}
```

`.trilha-card-imagem` usa margem negativa igual ao padding do `.trilha-card` (24px) pra a imagem "vazar" até a borda do card, com raio só nos cantos de cima — efeito comum de card com imagem de capa.

- [ ] **Step 2: Commit**

```bash
git add css/estilo.css
git commit -m "feat: add CSS for trilha card images and curriculum matrix"
```

---

## Task 2: Home (`index.html`) — imagem e prévia curricular nos 4 cards

**Repositório:** `site-toca-o-negocio`

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: classes da Task 1; imagens já existentes em `img/trilhas/*.jpg`.

- [ ] **Step 1: Substituir os 4 `<article class="trilha-card">` dentro de `.trilhas-grade` (por volta da linha 87-104)**

```html
      <div class="trilhas-grade">
        <article class="trilha-card">
          <img src="img/trilhas/venda-pelo-whatsapp.jpg" alt="Mesa de trabalho com celular mostrando conversa no WhatsApp, caixa de pedidos e caderno de catálogo de produtos" class="trilha-card-imagem" width="1024" height="559" loading="lazy">
          <h3><a href="trilhas/venda-pelo-whatsapp/">Venda pela internet e pelo WhatsApp</a></h3>
          <p>Monte um catálogo simples, responda mensagem sem perder venda e feche pedido direto na conversa.</p>
          <p class="trilha-card-previa">Perfil que vende sem gastar · WhatsApp Business configurado direito · e mais 4 aulas</p>
        </article>
        <article class="trilha-card">
          <img src="img/trilhas/ia-no-negocio.jpg" alt="Mesa de trabalho com caderno de tarefas, caneta, engrenagem dourada, calculadora e café" class="trilha-card-imagem" width="1024" height="559" loading="lazy">
          <h3><a href="trilhas/ia-no-negocio/">Use inteligência artificial no dia a dia</a></h3>
          <p>Escreva anúncio, responda dúvida repetida e organize sua agenda com ferramentas de IA gratuitas.</p>
          <p class="trilha-card-previa">Você já usa IA. O problema é como. · As ferramentas que cabem no bolso · e mais 4 aulas</p>
        </article>
        <article class="trilha-card">
          <img src="img/trilhas/formalizacao-da-empresa.jpg" alt="Mesa com calendário marcado, pasta de documentos com selo dourado &quot;resolvido&quot; e caneta" class="trilha-card-imagem" width="1024" height="559" loading="lazy">
          <h3><a href="trilhas/formalizacao-da-empresa/">Coloque a empresa em dia</a></h3>
          <p>Entenda o que precisa emitir, pagar e declarar para funcionar dentro da lei, sem depender de um contador para cada dúvida.</p>
          <p class="trilha-card-previa">Onde você está agora · Abrindo o CNPJ certo pro seu momento · e mais 4 aulas</p>
        </article>
        <article class="trilha-card">
          <img src="img/trilhas/gestao-financeira.jpg" alt="Potes de vidro organizados com dinheiro, rotulados Transporte, Alimentação e Poupança, ao lado de um caderno com gráfico de crescimento" class="trilha-card-imagem" width="1024" height="559" loading="lazy">
          <h3><a href="trilhas/gestao-financeira/">Controle o dinheiro do negócio</a></h3>
          <p>Separe o que é seu do que é da empresa, saiba quanto sobra no fim do mês e decida com número, não com achismo.</p>
          <p class="trilha-card-previa">Pra onde seu dinheiro vai · Fluxo de caixa simples · e mais 4 aulas</p>
        </article>
      </div>
```

- [ ] **Step 2: Verificar manualmente**

Sirva o repositório localmente (`python -m http.server 8080` a partir da raiz), abra `index.html`, confirme: as 4 imagens aparecem no topo dos cards, com cantos arredondados só em cima; a prévia curricular aparece abaixo da descrição; nenhum layout quebra em mobile (~360px) nem desktop.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add trilha images and curriculum preview to home cards"
```

---

## Task 3: Páginas de trilha — imagem de herói e matriz curricular completa

**Repositório:** `site-toca-o-negocio`

**Files:**
- Modify: `trilhas/venda-pelo-whatsapp/index.html`
- Modify: `trilhas/ia-no-negocio/index.html`
- Modify: `trilhas/formalizacao-da-empresa/index.html`
- Modify: `trilhas/gestao-financeira/index.html`

**Interfaces:**
- Consumes: classes da Task 1; imagens já existentes em `img/trilhas/*.jpg`; texto de `docs/curriculo-completo.md`.

Em cada uma das 4 páginas, duas mudanças (mesmo padrão nas 4, conteúdo diferente):

**Mudança A — imagem de herói.** Logo depois de `<section class="secao trilha-hero container">` e antes do `<h1>`, adicionar a tag `<img>` com `class="trilha-hero-imagem"` (caminho relativo `../../img/trilhas/<slug>.jpg`, já que as páginas de trilha ficam duas pastas abaixo da raiz).

**Mudança B — matriz curricular.** Na seção final ("O que tem na trilha completa"), depois do parágrafo já existente e antes do botão "Falar com a gente", adicionar um `<ol class="matriz-curricular">` com as 6 aulas (título em `<h3>`, resumo em `<p>`).

- [ ] **Step 1: `trilhas/venda-pelo-whatsapp/index.html`**

Depois de `<section class="secao trilha-hero container">` (linha 51 aproximadamente), antes do `<h1>`:

```html
      <img src="../../img/trilhas/venda-pelo-whatsapp.jpg" alt="Mesa de trabalho com celular mostrando conversa no WhatsApp, caixa de pedidos e caderno de catálogo de produtos" class="trilha-hero-imagem" width="1024" height="559" loading="lazy">
```

Na seção final ("O que tem na trilha completa"), entre o `<p>` existente e o `<a class="botao"...>`:

```html
        <ol class="matriz-curricular">
          <li>
            <h3>Perfil que vende sem gastar (básico)</h3>
            <p>Estruturar Instagram/Facebook com ajuda de IA.</p>
          </li>
          <li>
            <h3>WhatsApp Business configurado direito (básico)</h3>
            <p>Catálogo, mensagem automática, organização de conversa.</p>
          </li>
          <li>
            <h3>Conteúdo com IA que não parece IA (intermediário)</h3>
            <p>Texto, imagem e legenda mantendo a voz do negócio.</p>
          </li>
          <li>
            <h3>Rotina de postagem sem travar (intermediário)</h3>
            <p>Banco de ideias e calendário semanal.</p>
          </li>
          <li>
            <h3>Automatizando a postagem com n8n (profissional)</h3>
            <p>Fluxo básico de automação (gerar, agendar, publicar).</p>
          </li>
          <li>
            <h3>Um agente que atende por você (profissional)</h3>
            <p>Resposta automática de IA no WhatsApp/Messenger/Direct, com regra de quando passa pra humano.</p>
          </li>
        </ol>
```

- [ ] **Step 2: `trilhas/ia-no-negocio/index.html`**

Imagem de herói (mesmo padrão do Step 1, ajustando `src`/`alt`):

```html
      <img src="../../img/trilhas/ia-no-negocio.jpg" alt="Mesa de trabalho com caderno de tarefas, caneta, engrenagem dourada, calculadora e café" class="trilha-hero-imagem" width="1024" height="559" loading="lazy">
```

Matriz curricular:

```html
        <ol class="matriz-curricular">
          <li>
            <h3>Você já usa IA. O problema é como.</h3>
            <p>Reconhecer, pelas três perguntas, se uma tarefa do negócio vale a pena automatizar.</p>
          </li>
          <li>
            <h3>As ferramentas que cabem no bolso</h3>
            <p>Identificar qual tipo de ferramenta de IA serve pra qual tipo de tarefa, testando na prática.</p>
          </li>
          <li>
            <h3>Fazendo a IA trabalhar por você</h3>
            <p>Montar um pedido reutilizável (contexto, tarefa, formato, exemplo) e melhorá-lo por iteração.</p>
          </li>
          <li>
            <h3>Atendimento sem parecer robô</h3>
            <p>Revisar uma resposta de IA genérica até soar como o próprio dono, e saber quando a revisão manual é obrigatória.</p>
          </li>
          <li>
            <h3>Organização da rotina</h3>
            <p>Usar IA em tarefas de fundo (agenda, cobrança, rascunho) sem aparecer pro cliente.</p>
          </li>
          <li>
            <h3>O que não é pra delegar</h3>
            <p>Limites do uso de IA; fecha com um mini-plano de uso de IA pro próprio negócio.</p>
          </li>
        </ol>
```

- [ ] **Step 3: `trilhas/formalizacao-da-empresa/index.html`**

Imagem de herói:

```html
      <img src="../../img/trilhas/formalizacao-da-empresa.jpg" alt="Mesa com calendário marcado, pasta de documentos com selo dourado &quot;resolvido&quot; e caneta" class="trilha-hero-imagem" width="1024" height="559" loading="lazy">
```

Matriz curricular:

```html
        <ol class="matriz-curricular">
          <li>
            <h3>Onde você está agora</h3>
            <p>Diagnóstico: MEI, ME ou nada ainda.</p>
          </li>
          <li>
            <h3>Abrindo o CNPJ certo pro seu momento</h3>
            <p>MEI vs ME, e o CNAE certo pra atividade real.</p>
          </li>
          <li>
            <h3>As obrigações que se repetem</h3>
            <p>DAS mensal, declaração anual (DASN-SIMEI).</p>
          </li>
          <li>
            <h3>Organizando os documentos</h3>
            <p>O que guardar (nota, comprovante) e por quanto tempo.</p>
          </li>
          <li>
            <h3>Quando a empresa cresce</h3>
            <p>Sinais de sair do MEI, o que muda.</p>
          </li>
          <li>
            <h3>Seu checklist de em dia</h3>
            <p>Projeto final: calendário próprio de obrigações.</p>
          </li>
        </ol>
```

- [ ] **Step 4: `trilhas/gestao-financeira/index.html`**

Imagem de herói:

```html
      <img src="../../img/trilhas/gestao-financeira.jpg" alt="Potes de vidro organizados com dinheiro, rotulados Transporte, Alimentação e Poupança, ao lado de um caderno com gráfico de crescimento" class="trilha-hero-imagem" width="1024" height="559" loading="lazy">
```

Matriz curricular:

```html
        <ol class="matriz-curricular">
          <li>
            <h3>Pra onde seu dinheiro vai</h3>
            <p>Separar dinheiro pessoal do negócio; misturar mascara prejuízo até afundar a empresa.</p>
          </li>
          <li>
            <h3>Fluxo de caixa simples</h3>
            <p>Entrada e saída, incluindo o que já tem compromisso.</p>
          </li>
          <li>
            <h3>Precificação</h3>
            <p>Custo + margem, e também valor percebido (não é só a fórmula genérica de todo curso).</p>
          </li>
          <li>
            <h3>Pró-labore</h3>
            <p>Valor fixo que o negócio sustenta, com folga pros meses fracos.</p>
          </li>
          <li>
            <h3>Gastos fixos e variáveis</h3>
            <p>O que pesa igual vendendo ou não, o que dá pra cortar.</p>
          </li>
          <li>
            <h3>Seu painel financeiro</h3>
            <p>Projeto final: painel mensal consolidado.</p>
          </li>
        </ol>
```

- [ ] **Step 5: Verificar manualmente**

Sirva o repositório localmente, abra as 4 páginas de trilha. Confirme em cada uma: a imagem de herói aparece antes do `<h1>`, com cantos arredondados; a seção "O que tem na trilha completa" mostra as 6 aulas numeradas (1-6, gerado por CSS, não hardcoded); nenhum layout quebra em mobile nem desktop; os links de volta pra home e o rodapé continuam funcionando.

- [ ] **Step 6: Commit**

```bash
git add trilhas/venda-pelo-whatsapp/index.html trilhas/ia-no-negocio/index.html trilhas/formalizacao-da-empresa/index.html trilhas/gestao-financeira/index.html
git commit -m "feat: add hero image and full curriculum matrix to trilha pages"
```
