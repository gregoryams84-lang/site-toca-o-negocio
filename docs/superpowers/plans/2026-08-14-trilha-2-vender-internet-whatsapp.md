# Trilha 2 — Vender pela internet e pelo WhatsApp: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produzir as 6 aulas completas da trilha "Vender pela internet e pelo WhatsApp" — roteiro de vídeo, atividade interativa (JSON) e material de apoio em PDF — com progressão básico → intermediário → profissional, e registrar a trilha no índice do app.

**Architecture:** Cada aula é um task autocontido que produz três arquivos de conteúdo (roteiro, atividade, PDF) no repositório `app-atividades-curso`, sob o id de trilha `trilha-vendas`. As aulas se encadeiam por nível: básico (presença) → intermediário (conteúdo) → profissional (automação), reaproveitando conceitos já ensinados na trilha 1 (as três perguntas, o molde de pedido de 4 partes, a regra de revisão manual/limite claro). Um task final registra a trilha inteira em `dados/indice.json` — isso foi o achado Crítico da revisão final da trilha 1 (aulas prontas mas invisíveis no app porque nenhum task tocava o índice), então aqui vira task explícito, não opcional.

**Tech Stack:** Markdown (roteiro e PDF), JSON conforme o schema de `dados/modelo-aula.json`, Node.js (`node --test`, `node -e`) para validação de JSON.

**Spec:** `docs/superpowers/specs/2026-08-13-curriculo-trilhas-1-2-design.md`

## Global Constraints

- Nunca sugerir reconhecimento, autorização ou chancela do MEC; nunca usar "faculdade", "graduação", "pós-graduação", "diploma", "instituição de ensino superior" — sempre "certificado de conclusão de curso livre".
- Nenhuma promessa de resultado financeiro ("fature", "ganhe dinheiro", "lucro garantido", "método validado", "resultados comprovados").
- Nenhuma prova social inventada (número de alunos, depoimento, selo, nota).
- Evitar as palavras "solução", "jornada", "transformação", "empoderar", "descomplicar".
- Vídeo curto, linguagem direta, pensado pra celular à noite, aluno cansado. Nenhum "vi que você...".
- Atividade sempre parte de uma situação concreta do negócio do aluno antes de qualquer explicação, e termina em artefato real (lista, número, decisão escrita) — nunca nota ou pontuação. Um bloco que pede diretamente a situação do PRÓPRIO negócio do aluno (não uma pergunta de autoavaliação genérica) conta como abertura concreta — foi o critério usado (e corrigido via reordenação de blocos) na trilha 1.
- Tipos de bloco disponíveis: `cenario`, `lista_aberta`, `calculo`, `escolha_simples` — schema exato em `dados/modelo-aula.json`.
- Todo conteúdo aplica pelo menos um destes três diferenciais: raciocínio explícito (não receita), artefato reutilizável, ou erro real revisado.
- Progressão gradual com vitória visível cedo — nunca abrir aula ou nível com algo difícil. Nesta trilha a progressão é o próprio nível: básico (presença) → intermediário (conteúdo) → profissional (automação).
- Trilhas 3 e 4 (formalizar empresa / gerir dinheiro) ficam fora de escopo — sem IA, domínio tradicional, spec própria futura.

---

## File Structure

Repositório: `C:\Users\robot\Documents\app-atividades-curso`

- `dados/trilha-vendas/aula-01.json` até `aula-06.json` — atividade interativa de cada aula (schema `modelo-aula.json`).
- `conteudo/trilha-vendas/aula-0N-roteiro.md` — roteiro do vídeo de cada aula.
- `conteudo/trilha-vendas/aula-0N-pdf.md` — conteúdo do material de apoio em PDF de cada aula.
- `dados/indice.json` — recebe uma nova entrada de trilha (`trilha-vendas`) com as 6 aulas listadas, em um task dedicado (Task 7) depois que as 6 aulas existirem.

---

### Task 1: Aula 1 — Perfil que vende sem gastar (Básico)

**Files:**
- Create: `dados/trilha-vendas/aula-01.json`
- Create: `conteudo/trilha-vendas/aula-01-roteiro.md`
- Create: `conteudo/trilha-vendas/aula-01-pdf.md`

**Interfaces:**
- Produces: nenhuma dependência estrutural pra aulas seguintes (bloco `b2`/`b3` ficam no domínio desta aula).

- [ ] **Step 1: Escrever o roteiro**

Salvar em `conteudo/trilha-vendas/aula-01-roteiro.md`:

```markdown
# Aula 1 — Perfil que vende sem gastar

**Habilidade:** estruturar um perfil de Instagram/Facebook com ajuda de IA (bio, destaques, primeira grade de posts) que comunica o negócio com clareza, sem gastar nada.

[0:00] Você abre seu Instagram agora e a bio diz só o nome do seu negócio.
Um cliente novo chega lá e não sabe o que você vende, onde fica, nem como
comprar. Isso custa venda todo dia.

[0:25] Essa aula ensina a montar, ou consertar, três coisas do seu perfil
com ajuda de IA: a bio, os destaques e a primeira grade de posts — sem
gastar nada.

[0:50] A bio em três partes: o que você vende, pra quem, e como o cliente
compra — link, WhatsApp ou endereço. Pede pra uma ferramenta de IA
escrever três opções de bio com essas informações, e escolhe a que soa
mais como você.

[1:40] Destaques não são decoração — são as perguntas que todo cliente
novo faz. "Como comprar?", "Onde fica?", "Dúvidas frequentes". Cada
destaque responde uma delas.

[2:10] A primeira grade: três posts que respondem essas mesmas dúvidas,
não só "produto bonito".

[2:40] Agora é sua vez: usa a IA pra escrever sua bio nova, com as três
partes.
```

- [ ] **Step 2: Revisar o roteiro contra os Global Constraints**

Checklist manual: nenhuma palavra proibida; nenhuma promessa financeira; nenhuma prova social inventada; nenhum "vi que você..."; aplica um diferencial (aqui: raciocínio explícito — a bio em 3 partes como critério, não receita de texto pronto).

- [ ] **Step 3: Escrever a atividade JSON**

Salvar em `dados/trilha-vendas/aula-01.json`:

```json
{
  "schema_version": 1,
  "trilha": "trilha-vendas",
  "aula": "aula-01",
  "titulo": "Perfil que vende sem gastar",
  "habilidade": "Estruturar um perfil de Instagram/Facebook com ajuda de IA (bio, destaques, primeira grade de posts).",
  "blocos": [
    {
      "id": "b1",
      "tipo": "cenario",
      "enunciado": "Um cliente novo chega no perfil de uma loja de roupas e a bio diz só \"Moda feminina\". Ele quer saber se vendem no tamanho dele e como comprar. O que essa bio está faltando?",
      "opcoes": [
        "Nada, bio deve ser só o nicho do negócio",
        "Informação prática: como comprar, tamanhos, forma de entrega",
        "Mais emoji e cor no texto"
      ],
      "correta": 1,
      "dica_erro": "Reveja o trecho dos 0:50 do vídeo.",
      "explicacao_erro": "Bio sem informação prática (como comprar, o que oferece) não converte visita em venda.",
      "feedback_acerto": "Isso. Sem essa informação, o cliente novo desiste antes de perguntar."
    },
    {
      "id": "b2",
      "tipo": "lista_aberta",
      "enunciado": "Escreva o que seu negócio vende, pra quem, e como o cliente compra (link, WhatsApp, endereço) — cada informação em uma linha.",
      "quantidade_campos": 3,
      "minimo_preenchido": 1,
      "placeholders": [
        "vendo bolos de aniversário sob encomenda",
        "pra famílias no meu bairro",
        "compra pelo WhatsApp, link na bio"
      ]
    },
    {
      "id": "b3",
      "tipo": "lista_aberta",
      "enunciado": "Peça pra uma ferramenta de IA escrever 3 opções de bio usando essas informações. Cole aqui a que você mais gostou.",
      "quantidade_campos": 1,
      "minimo_preenchido": 1,
      "placeholders": ["a bio escolhida, já do seu jeito"]
    },
    {
      "id": "b4",
      "tipo": "escolha_simples",
      "enunciado": "Seu perfil já tem destaques (stories fixados) que respondem \"como comprar\" e \"onde fica\"?",
      "opcoes": [
        "Sim, já tenho",
        "Não, vou criar",
        "Não sabia que servia pra isso"
      ]
    }
  ]
}
```

- [ ] **Step 4: Validar o JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('dados/trilha-vendas/aula-01.json','utf8')); console.log('OK')"
```
Esperado: `OK`. Conferir ids únicos e `b1.correta` dentro do range de `opcoes`.

- [ ] **Step 5: Escrever o PDF de apoio**

Salvar em `conteudo/trilha-vendas/aula-01-pdf.md`:

```markdown
# Material de apoio — Aula 1: Sua bio em 3 partes

**O que eu vendo:** _______________________________________________

**Pra quem:** _______________________________________________

**Como compra (link, WhatsApp, endereço):** _______________________

## Checklist de destaques

- [ ] Como comprar
- [ ] Onde fica / área de entrega
- [ ] Dúvidas frequentes

Peça pra uma ferramenta de IA juntar as três partes de cima numa bio
curta — e ajuste até soar como você.
```

- [ ] **Step 6: Revisar PDF contra os Global Constraints**

Mesmo checklist do Step 2.

- [ ] **Step 7: Commit**

```bash
git add dados/trilha-vendas/aula-01.json conteudo/trilha-vendas/aula-01-roteiro.md conteudo/trilha-vendas/aula-01-pdf.md
git commit -m "content: aula 1 da trilha Vender pela internet e WhatsApp (roteiro, atividade, pdf)"
```

---

### Task 2: Aula 2 — WhatsApp Business configurado direito (Básico)

**Files:**
- Create: `dados/trilha-vendas/aula-02.json`
- Create: `conteudo/trilha-vendas/aula-02-roteiro.md`
- Create: `conteudo/trilha-vendas/aula-02-pdf.md`

**Interfaces:**
- Produces: nenhuma dependência estrutural pra aulas seguintes.

- [ ] **Step 1: Escrever o roteiro**

Salvar em `conteudo/trilha-vendas/aula-02-roteiro.md`:

```markdown
# Aula 2 — WhatsApp Business configurado direito

**Habilidade:** configurar catálogo, mensagem automática de ausência e organização de conversa no WhatsApp Business.

[0:00] Um cliente manda "oi, vocês têm entrega?" às 23h. Se seu WhatsApp
não responde nada até de manhã, ele já foi comprar em outro lugar.

[0:25] Três configurações gratuitas do WhatsApp Business resolvem isso:
catálogo — produtos com foto e preço, sem digitar tudo de novo toda vez.
Mensagem automática de ausência — responde na hora, mesmo você dormindo.
Etiquetas — organizam quem já comprou e quem ainda está esperando
resposta.

[1:10] Demonstração: escrever uma mensagem automática de ausência que não
pareça robô — com o mesmo cuidado de revisar antes de ativar que você já
viu na trilha "IA no Negócio".

[2:00] Catálogo não substitui atendimento — é o primeiro passo antes da
conversa, não o fim dela.

[2:30] Agora é sua vez: ativa uma dessas três configurações essa semana.
```

- [ ] **Step 2: Revisar o roteiro contra os Global Constraints**

Mesmo checklist.

- [ ] **Step 3: Escrever a atividade JSON**

Salvar em `dados/trilha-vendas/aula-02.json`:

```json
{
  "schema_version": 1,
  "trilha": "trilha-vendas",
  "aula": "aula-02",
  "titulo": "WhatsApp Business configurado direito",
  "habilidade": "Configurar catálogo, mensagem automática de ausência e organização de conversa no WhatsApp Business.",
  "blocos": [
    {
      "id": "b1",
      "tipo": "cenario",
      "enunciado": "Um cliente manda \"vocês entregam no meu bairro?\" às 23h pro WhatsApp de uma loja sem mensagem automática configurada. A loja só vê e responde às 9h do dia seguinte. O que isso custa?",
      "opcoes": [
        "Nada, o cliente vai esperar a resposta",
        "Provavelmente a venda — o cliente já comprou em outro lugar que respondeu na hora",
        "Só custa se o cliente reclamar depois"
      ],
      "correta": 1,
      "dica_erro": "Reveja o trecho dos 0:00 do vídeo.",
      "explicacao_erro": "Sem resposta na hora, o cliente segue pra próxima opção — a venda se perde antes de qualquer conversa.",
      "feedback_acerto": "Isso. Resposta rápida, mesmo automática, mantém o cliente esperando você."
    },
    {
      "id": "b2",
      "tipo": "lista_aberta",
      "enunciado": "Escreva o rascunho da sua mensagem automática de ausência — o que o cliente recebe quando manda mensagem fora do seu horário.",
      "quantidade_campos": 1,
      "minimo_preenchido": 1,
      "placeholders": ["oi! recebi sua mensagem, respondo assim que abrir, geralmente até as 9h"]
    },
    {
      "id": "b3",
      "tipo": "escolha_simples",
      "enunciado": "Seu WhatsApp Business já tem catálogo de produtos configurado?",
      "opcoes": [
        "Sim",
        "Não, vou configurar",
        "Não sabia que dava pra fazer isso"
      ]
    },
    {
      "id": "b4",
      "tipo": "escolha_simples",
      "enunciado": "Das três configurações (catálogo, mensagem automática, etiquetas), qual você ativa primeiro essa semana?",
      "opcoes": [
        "Catálogo",
        "Mensagem automática",
        "Etiquetas"
      ]
    }
  ]
}
```

- [ ] **Step 4: Validar o JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('dados/trilha-vendas/aula-02.json','utf8')); console.log('OK')"
```
Esperado: `OK`.

- [ ] **Step 5: Escrever o PDF de apoio**

Salvar em `conteudo/trilha-vendas/aula-02-pdf.md`:

```markdown
# Material de apoio — Aula 2: As três configurações do WhatsApp Business

| Configuração | Pra que serve | Já ativei? |
|---|---|---|
| Catálogo | Produtos com foto e preço prontos | [ ] |
| Mensagem automática de ausência | Responde na hora, mesmo você offline | [ ] |
| Etiquetas | Organiza quem já comprou / quem espera resposta | [ ] |

## Rascunho da minha mensagem automática

_______________________________________________
```

- [ ] **Step 6: Revisar PDF contra os Global Constraints**

Mesmo checklist.

- [ ] **Step 7: Commit**

```bash
git add dados/trilha-vendas/aula-02.json conteudo/trilha-vendas/aula-02-roteiro.md conteudo/trilha-vendas/aula-02-pdf.md
git commit -m "content: aula 2 da trilha Vender pela internet e WhatsApp (roteiro, atividade, pdf)"
```

---

### Task 3: Aula 3 — Conteúdo com IA que não parece IA (Intermediário)

**Files:**
- Create: `dados/trilha-vendas/aula-03.json`
- Create: `conteudo/trilha-vendas/aula-03-roteiro.md`
- Create: `conteudo/trilha-vendas/aula-03-pdf.md`

**Interfaces:**
- Consumes: o molde de pedido de 4 partes (contexto + tarefa + formato + exemplo) ensinado na trilha 1, aula 3 — referenciado em texto no roteiro, sem dependência estrutural de bloco (trilhas diferentes, sem `depende_de` entre elas).

- [ ] **Step 1: Escrever o roteiro**

Salvar em `conteudo/trilha-vendas/aula-03-roteiro.md`:

```markdown
# Aula 3 — Conteúdo com IA que não parece IA

**Habilidade:** gerar texto, imagem e legenda com IA mantendo a voz do próprio negócio.

[0:00] Você já viu um post que claramente foi feito por IA — legenda
genérica, emoji em excesso, texto que não soa como ninguém de verdade.
Isso afasta cliente, não atrai.

[0:25] O problema não é usar IA, é usar sem ajustar. Essa aula usa o
mesmo molde de pedido — contexto, tarefa, formato, exemplo — que você já
viu na trilha "IA no Negócio", agora aplicado a post.

[1:00] Demonstração: gerar a legenda de um post de hoje com o molde,
depois editar até soar como o dono do negócio fala de verdade.

[1:50] Pra imagem: uma ferramenta de imagem com IA cria a arte do post
rápido, sem precisar saber design.

[2:20] Checklist rápido antes de publicar: tem palavra que eu nunca uso?
Esse post parece de qualquer loja, ou do MEU negócio?

[2:45] Agora é sua vez: gera e ajusta um post real pra publicar essa
semana.
```

- [ ] **Step 2: Revisar o roteiro contra os Global Constraints**

Mesmo checklist. Diferencial aplicado: artefato reutilizável (o molde de pedido, já ensinado, agora reaplicado a um novo domínio).

- [ ] **Step 3: Escrever a atividade JSON**

Salvar em `dados/trilha-vendas/aula-03.json`:

```json
{
  "schema_version": 1,
  "trilha": "trilha-vendas",
  "aula": "aula-03",
  "titulo": "Conteúdo com IA que não parece IA",
  "habilidade": "Gerar texto, imagem e legenda com IA mantendo a voz do próprio negócio.",
  "blocos": [
    {
      "id": "b1",
      "tipo": "cenario",
      "enunciado": "Duas legendas pro mesmo post de uma padaria: A) \"Surpreenda-se com nossos deliciosos produtos artesanais feitos com amor e dedicação!\" B) \"Pão de queijo saindo do forno agora, R$ 12 a dúzia, é só chegar.\" Qual soa mais como um negócio de verdade?",
      "opcoes": [
        "A, porque é mais elogiosa",
        "B, porque é específica e soa como alguém falando de verdade",
        "As duas são iguais"
      ],
      "correta": 1,
      "dica_erro": "Reveja o trecho dos 0:00 do vídeo.",
      "explicacao_erro": "A legenda A é genérica — poderia ser de qualquer padaria. A B tem informação real (produto, preço, hora).",
      "feedback_acerto": "Isso. Informação real bate texto bonito genérico."
    },
    {
      "id": "b2",
      "tipo": "lista_aberta",
      "enunciado": "Monte seu pedido (contexto + tarefa + formato + exemplo) pra gerar a legenda de um post real do seu negócio.",
      "quantidade_campos": 1,
      "minimo_preenchido": 1,
      "placeholders": ["contexto: ... tarefa: escreve legenda sobre ... formato: 2 linhas, direto ... exemplo: ..."]
    },
    {
      "id": "b3",
      "tipo": "lista_aberta",
      "enunciado": "Cole aqui a legenda que a IA gerou, já ajustada do seu jeito.",
      "quantidade_campos": 1,
      "minimo_preenchido": 1,
      "placeholders": ["a legenda final, pronta pra postar"]
    },
    {
      "id": "b4",
      "tipo": "escolha_simples",
      "enunciado": "Essa legenda já está pronta pra publicar essa semana?",
      "opcoes": [
        "Sim",
        "Quase, falta um ajuste",
        "Ainda não"
      ]
    }
  ]
}
```

- [ ] **Step 4: Validar o JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('dados/trilha-vendas/aula-03.json','utf8')); console.log('OK')"
```
Esperado: `OK`. Atenção: o `enunciado` do `b1` usa aspas duplas internas — confirmar que estão escapadas corretamente (`\"`) no JSON.

- [ ] **Step 5: Escrever o PDF de apoio**

Salvar em `conteudo/trilha-vendas/aula-03-pdf.md`:

```markdown
# Material de apoio — Aula 3: Isso parece meu negócio?

Antes de publicar um texto gerado por IA, confira:

1. Tem palavra que eu nunca uso? Corta.
2. Tem informação real (produto, preço, hora, lugar)? Ou é só elogio genérico?
3. Um cliente que me conhece reconheceria minha voz nesse texto?

## Molde de pedido (revisão da trilha "IA no Negócio")

Contexto: _____________ Tarefa: _____________ Formato: _____________ Exemplo: _____________
```

- [ ] **Step 6: Revisar PDF contra os Global Constraints**

Mesmo checklist.

- [ ] **Step 7: Commit**

```bash
git add dados/trilha-vendas/aula-03.json conteudo/trilha-vendas/aula-03-roteiro.md conteudo/trilha-vendas/aula-03-pdf.md
git commit -m "content: aula 3 da trilha Vender pela internet e WhatsApp (roteiro, atividade, pdf)"
```

---

### Task 4: Aula 4 — Rotina de postagem sem travar (Intermediário)

**Files:**
- Create: `dados/trilha-vendas/aula-04.json`
- Create: `conteudo/trilha-vendas/aula-04-roteiro.md`
- Create: `conteudo/trilha-vendas/aula-04-pdf.md`

**Interfaces:**
- Produces: bloco `b2` (lista_aberta, banco de ideias) — usado pelo `depende_de` do bloco `b3` desta mesma aula. (Corrigido pós-implementação: o bloco do banco de ideias passou de `b1` pra `b2` num fix de ordenação; ver ledger da execução.)

- [ ] **Step 1: Escrever o roteiro**

Salvar em `conteudo/trilha-vendas/aula-04-roteiro.md`:

```markdown
# Aula 4 — Rotina de postagem sem travar

**Habilidade:** montar um banco de ideias e um calendário simples de postagem semanal.

[0:00] A postagem trava não por falta de ideia — trava porque você só
pensa nela na hora de postar, cansado, sem tempo.

[0:25] A solução tem duas partes: um banco de ideias — temas que sempre
funcionam pro seu negócio, tipo bastidor, produto, dúvida de cliente,
promoção — e um calendário simples — que dia posta o quê.

[1:10] Demonstração: pedir pra IA sugerir 5 ideias de post baseadas no
tipo do seu negócio, e guardar numa lista pra não depender de inspiração
todo dia.

[2:00] Calendário não precisa ser todo dia. Dois ou três posts fixos por
semana já muda o jogo.

[2:30] Agora é sua vez: monta seu banco de ideias e escolhe os dias da
semana.
```

- [ ] **Step 2: Revisar o roteiro contra os Global Constraints**

Mesmo checklist.

- [ ] **Step 3: Escrever a atividade JSON**

Salvar em `dados/trilha-vendas/aula-04.json`:

```json
{
  "schema_version": 1,
  "trilha": "trilha-vendas",
  "aula": "aula-04",
  "titulo": "Rotina de postagem sem travar",
  "habilidade": "Montar um banco de ideias e um calendário simples de postagem semanal.",
  "blocos": [
    {
      "id": "b1",
      "tipo": "lista_aberta",
      "enunciado": "Liste 5 temas de post que sempre funcionam pro seu negócio (pode pedir ajuda de IA se travar).",
      "quantidade_campos": 5,
      "minimo_preenchido": 1,
      "placeholders": [
        "bastidor de como o produto é feito",
        "dúvida frequente de cliente respondida",
        "promoção da semana"
      ]
    },
    {
      "id": "b2",
      "tipo": "cenario",
      "enunciado": "Um dono posta só quando lembra, sem padrão nenhum — às vezes 3 posts numa semana, depois 2 semanas sem nada. O engajamento vive caindo. O que resolve isso?",
      "opcoes": [
        "Postar todo santo dia, sem falta",
        "Um calendário fixo, mesmo que só 2 ou 3 dias por semana",
        "Parar de postar até ter mais tempo"
      ],
      "correta": 1,
      "dica_erro": "Reveja o trecho dos 2:00 do vídeo.",
      "explicacao_erro": "Consistência importa mais que quantidade — poucos dias fixos batem postagem irregular.",
      "feedback_acerto": "Isso. Regularidade, não volume, é o que sustenta o engajamento."
    },
    {
      "id": "b3",
      "tipo": "calculo",
      "enunciado": "Escolha 2 ou 3 dias da semana pra postar e o tema de cada um.",
      "campos": [
        { "id": "tema", "tipo": "selecao", "rotulo": "Qual tema da sua lista?", "depende_de": { "trilha": "trilha-vendas", "aula": "aula-04", "bloco": "b1" } },
        { "id": "dias_semana", "tipo": "numero", "rotulo": "Em quantos dias da semana você posta esse tema", "unidade": "dias", "minimo": 0, "maximo": 7 }
      ],
      "calculos": {
        "posts_mes": "dias_semana * 4.345"
      },
      "resultado_texto": "Nesse ritmo, esse tema vira cerca de {posts_mes} posts por mês."
    },
    {
      "id": "b4",
      "tipo": "escolha_simples",
      "enunciado": "Você consegue manter esses dias fixos nas próximas 2 semanas?",
      "opcoes": [
        "Sim",
        "Vou tentar",
        "Não, preciso simplificar mais"
      ]
    }
  ]
}
```

- [ ] **Step 4: Validar o JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('dados/trilha-vendas/aula-04.json','utf8')); console.log('OK')"
```
Esperado: `OK`. Conferir que `b3.campos[0].depende_de` aponta pra `trilha-vendas`/`aula-04`/`b1` (a própria aula, não a trilha 1).

- [ ] **Step 5: Escrever o PDF de apoio**

Salvar em `conteudo/trilha-vendas/aula-04-pdf.md`:

```markdown
# Material de apoio — Aula 4: Banco de ideias e calendário

## Meus 5 temas fixos

1. _______________________________________________
2. _______________________________________________
3. _______________________________________________
4. _______________________________________________
5. _______________________________________________

## Calendário semanal

| Dia | Tema |
|---|---|
|  |  |
|  |  |
|  |  |
```

- [ ] **Step 6: Revisar PDF contra os Global Constraints**

Mesmo checklist.

- [ ] **Step 7: Commit**

```bash
git add dados/trilha-vendas/aula-04.json conteudo/trilha-vendas/aula-04-roteiro.md conteudo/trilha-vendas/aula-04-pdf.md
git commit -m "content: aula 4 da trilha Vender pela internet e WhatsApp (roteiro, atividade, pdf)"
```

---

### Task 5: Aula 5 — Automatizando a postagem com n8n (Profissional)

**Files:**
- Create: `dados/trilha-vendas/aula-05.json`
- Create: `conteudo/trilha-vendas/aula-05-roteiro.md`
- Create: `conteudo/trilha-vendas/aula-05-pdf.md`

**Interfaces:**
- Consumes: o "banco de ideias" da Aula 4 (referenciado em texto no roteiro, sem dependência estrutural de bloco).

- [ ] **Step 1: Escrever o roteiro**

Salvar em `conteudo/trilha-vendas/aula-05-roteiro.md`:

```markdown
# Aula 5 — Automatizando a postagem com n8n

**Habilidade:** entender e montar um fluxo básico de automação (gerar conteúdo → agendar → publicar) usando um fluxo pronto de n8n.

[0:00] Até aqui você aprendeu a criar conteúdo e manter uma rotina de
postagem manual. Essa aula ensina a tirar sua mão do meio — um fluxo que
gera, agenda e publica sozinho.

[0:25] O que é n8n em uma frase: uma ferramenta que liga uma ação na
outra automaticamente, sem precisar programar — só conectar caixinhas.

[0:55] O fluxo básico dessa aula tem três partes: gatilho — quando o
fluxo roda, por exemplo toda segunda de manhã. Geração — a IA cria o
texto a partir do seu banco de ideias da Aula 4. Publicação — posta
automaticamente na rede escolhida.

[1:40] Demonstração: usando um fluxo pronto que você importa, ajustando
só o seu banco de ideias e o horário — não precisa montar do zero.

[2:20] Um aviso: automação publica sozinha, mas não decide sozinha o que
é apropriado. Revise o conteúdo gerado nas primeiras semanas, até
confiar no padrão.

[2:50] Agora é sua vez: importa o fluxo modelo e testa com um post.
```

- [ ] **Step 2: Revisar o roteiro contra os Global Constraints**

Mesmo checklist. Diferencial aplicado: raciocínio explícito (as três perguntas da trilha 1 reaplicadas pra decidir se publicar é tarefa automatizável).

- [ ] **Step 3: Escrever a atividade JSON**

Salvar em `dados/trilha-vendas/aula-05.json`:

```json
{
  "schema_version": 1,
  "trilha": "trilha-vendas",
  "aula": "aula-05",
  "titulo": "Automatizando a postagem com n8n",
  "habilidade": "Entender e montar um fluxo básico de automação (gerar conteúdo, agendar, publicar) usando um fluxo pronto de n8n.",
  "blocos": [
    {
      "id": "b1",
      "tipo": "cenario",
      "enunciado": "Um dono já tem os posts prontos (texto e imagem definidos), mas gasta 2 horas por semana só publicando manualmente, um por um, nos horários certos. Pelas três perguntas da trilha \"IA no Negócio\" (repete, custa tempo, segue padrão), essa tarefa de publicar é:",
      "opcoes": [
        "Não é candidata, publicar exige cuidado humano toda vez",
        "Candidata forte — repete toda semana, custa tempo real, e o processo é sempre o mesmo",
        "Só é candidata se o negócio for grande"
      ],
      "correta": 1,
      "dica_erro": "Reveja o trecho dos 0:55 do vídeo.",
      "explicacao_erro": "Publicar um post já pronto, no horário certo, é um processo que se repete do mesmo jeito toda vez — diferente de decidir o que postar.",
      "feedback_acerto": "Isso. A tarefa de publicar (não de criar) passa nas três perguntas."
    },
    {
      "id": "b2",
      "tipo": "lista_aberta",
      "enunciado": "Descreva em até 3 passos o fluxo que você quer automatizar (ex: 1. gerar legenda 2. gerar imagem 3. publicar às segundas de manhã).",
      "quantidade_campos": 3,
      "minimo_preenchido": 1,
      "placeholders": ["gerar legenda a partir do banco de ideias"]
    },
    {
      "id": "b3",
      "tipo": "escolha_simples",
      "enunciado": "Você já tem uma conta no n8n (ou ferramenta parecida de automação)?",
      "opcoes": [
        "Sim",
        "Não, vou criar",
        "Nunca tinha ouvido falar até essa aula"
      ]
    },
    {
      "id": "b4",
      "tipo": "escolha_simples",
      "enunciado": "Nas primeiras semanas de automação, você vai revisar o conteúdo antes dele publicar sozinho?",
      "opcoes": [
        "Sim, sempre",
        "Só às vezes",
        "Não, vou confiar direto"
      ]
    }
  ]
}
```

- [ ] **Step 4: Validar o JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('dados/trilha-vendas/aula-05.json','utf8')); console.log('OK')"
```
Esperado: `OK`.

- [ ] **Step 5: Escrever o PDF de apoio**

Salvar em `conteudo/trilha-vendas/aula-05-pdf.md`:

```markdown
# Material de apoio — Aula 5: Seu fluxo em 3 partes

**Gatilho** (quando roda): _______________________________________________

**Geração** (o que a IA cria, a partir de qual banco de ideias): ___________

**Publicação** (onde posta, em qual horário): _______________________

Nas primeiras semanas, revise o conteúdo gerado antes dele publicar
sozinho — até você confiar no padrão.
```

- [ ] **Step 6: Revisar PDF contra os Global Constraints**

Mesmo checklist.

- [ ] **Step 7: Commit**

```bash
git add dados/trilha-vendas/aula-05.json conteudo/trilha-vendas/aula-05-roteiro.md conteudo/trilha-vendas/aula-05-pdf.md
git commit -m "content: aula 5 da trilha Vender pela internet e WhatsApp (roteiro, atividade, pdf)"
```

---

### Task 6: Aula 6 — Um agente que atende por você (Profissional)

**Files:**
- Create: `dados/trilha-vendas/aula-06.json`
- Create: `conteudo/trilha-vendas/aula-06-roteiro.md`
- Create: `conteudo/trilha-vendas/aula-06-pdf.md`

**Interfaces:**
- Consumes: a lista de perguntas frequentes (referenciada em texto, pode reaproveitar a lista da trilha 1 aula 1 se o aluno já fez — sem dependência estrutural entre trilhas).
- Produces: artefato final da trilha (as regras do agente) — encerramento, não consumido por bloco algum.

- [ ] **Step 1: Escrever o roteiro**

Salvar em `conteudo/trilha-vendas/aula-06-roteiro.md`:

```markdown
# Aula 6 — Um agente que atende por você

**Habilidade:** configurar uma resposta automática de IA pra atender WhatsApp, Messenger ou Direct, com regra clara de quando passa pra um humano.

[0:00] Você já tem a mensagem automática de ausência da Aula 2. Essa aula
vai além: um agente que conversa de verdade — responde dúvida comum,
manda catálogo, agenda — sem você digitar nada.

[0:25] A diferença entre mensagem automática e agente: a mensagem
automática dá sempre a mesma resposta. O agente entende o que o cliente
perguntou e responde dentro de um limite que você define.

[1:00] O limite é a parte mais importante: você decide o que o agente
pode responder sozinho — preço, horário, catálogo — e o que sempre passa
pra você — reclamação, negociação, pedido fora do padrão. A mesma regra
que você já viu na trilha "IA no Negócio".

[1:50] Demonstração: configurar um agente simples com 3 ou 4 respostas
prontas pras perguntas mais comuns do seu negócio, e uma regra de
transferência pro humano.

[2:30] Um aviso: um agente mal configurado que promete algo errado custa
mais caro que não ter agente nenhum. Teste com poucas conversas antes de
ativar pra valer.

[2:55] Isso fecha a trilha inteira: lista as perguntas mais comuns do seu
negócio — elas viram a base do seu agente.
```

- [ ] **Step 2: Revisar o roteiro contra os Global Constraints**

Mesmo checklist. Diferencial aplicado: erro real revisado (a promessa errada do agente no cenário da atividade).

- [ ] **Step 3: Escrever a atividade JSON**

Salvar em `dados/trilha-vendas/aula-06.json`:

```json
{
  "schema_version": 1,
  "trilha": "trilha-vendas",
  "aula": "aula-06",
  "titulo": "Um agente que atende por você",
  "habilidade": "Configurar uma resposta automática de IA pra atender WhatsApp, Messenger ou Direct, com regra clara de quando passa pra um humano.",
  "blocos": [
    {
      "id": "b1",
      "tipo": "cenario",
      "enunciado": "Um agente de IA configurado sem limite responde a um cliente: \"Sim, garantimos entrega em 1 hora\" — mas essa informação nunca foi confirmada pelo dono. O cliente cobra depois e a entrega demora 3 horas. O que deu errado?",
      "opcoes": [
        "Nada, agente sempre erra às vezes",
        "O agente foi configurado sem limite claro do que pode prometer sozinho",
        "O cliente que entendeu errado"
      ],
      "correta": 1,
      "dica_erro": "Reveja o trecho de 1:00 do vídeo.",
      "explicacao_erro": "Sem um limite definido do que o agente pode afirmar, ele pode prometer algo que ninguém confirmou.",
      "feedback_acerto": "Isso. O problema não é ter agente — é não ter definido o limite dele."
    },
    {
      "id": "b2",
      "tipo": "lista_aberta",
      "enunciado": "Liste 4 ou 5 perguntas que mais se repetem no seu atendimento (reaproveite a lista da trilha \"IA no Negócio\", Aula 1, se você já fez ela).",
      "quantidade_campos": 5,
      "minimo_preenchido": 1,
      "placeholders": ["vocês entregam no meu bairro?", "qual o horário de funcionamento?"]
    },
    {
      "id": "b3",
      "tipo": "lista_aberta",
      "enunciado": "Escreva pelo menos 1 situação que seu agente NUNCA deve responder sozinho — sempre passa pra você.",
      "quantidade_campos": 1,
      "minimo_preenchido": 1,
      "placeholders": ["reclamação sobre pedido errado", "negociação de preço"]
    },
    {
      "id": "b4",
      "tipo": "escolha_simples",
      "enunciado": "Depois de configurar, você testa o agente com poucas conversas antes de deixar ele atender todo mundo?",
      "opcoes": [
        "Sim, sempre testo antes",
        "Vou testar depois dessa aula",
        "Não tinha pensado nisso"
      ]
    },
    {
      "id": "b5",
      "tipo": "escolha_simples",
      "enunciado": "Fechando a trilha \"Vender pela internet e pelo WhatsApp\" — você se sente pronto pra aplicar as 6 aulas no seu negócio?",
      "opcoes": [
        "Sim, já sei por onde começar",
        "Preciso rever alguma aula",
        "Ainda não"
      ]
    }
  ]
}
```

- [ ] **Step 4: Validar o JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('dados/trilha-vendas/aula-06.json','utf8')); console.log('OK')"
```
Esperado: `OK`. Conferir aspas internas escapadas em `b1.enunciado`.

- [ ] **Step 5: Escrever o PDF de apoio**

Salvar em `conteudo/trilha-vendas/aula-06-pdf.md`:

```markdown
# Material de apoio — Aula 6: Seu agente em 3 regras

## O que o agente responde sozinho

_______________________________________________

## O que sempre passa pra mim

_______________________________________________

## Perguntas frequentes do meu negócio (base do agente)

1. _______________________________________________
2. _______________________________________________
3. _______________________________________________
4. _______________________________________________
5. _______________________________________________
```

- [ ] **Step 6: Revisar PDF contra os Global Constraints**

Mesmo checklist.

- [ ] **Step 7: Commit**

```bash
git add dados/trilha-vendas/aula-06.json conteudo/trilha-vendas/aula-06-roteiro.md conteudo/trilha-vendas/aula-06-pdf.md
git commit -m "content: aula 6 da trilha Vender pela internet e WhatsApp (roteiro, atividade, pdf) - fecha a trilha"
```

---

### Task 7: Registrar a trilha no índice do app

**Files:**
- Modify: `dados/indice.json`

**Interfaces:**
- Consumes: os `titulo` reais de `dados/trilha-vendas/aula-01.json` até `aula-06.json` (Tasks 1-6 já commitadas).

- [ ] **Step 1: Ler o índice atual**

```bash
cat dados/indice.json
```

Confirmar que hoje só existe a entrada `trilha-ia` (a trilha "IA no Negócio" completa, das 6 aulas já mergeadas).

- [ ] **Step 2: Adicionar a nova trilha**

Editar `dados/indice.json` adicionando um novo objeto ao array `trilhas`, ao lado do objeto `trilha-ia` existente (não substituir o que já existe):

```json
{
  "id": "trilha-vendas",
  "titulo": "Vender pela internet e pelo WhatsApp",
  "aulas": [
    { "id": "aula-01", "titulo": "Perfil que vende sem gastar", "ordem": 1, "arquivo": "dados/trilha-vendas/aula-01.json" },
    { "id": "aula-02", "titulo": "WhatsApp Business configurado direito", "ordem": 2, "arquivo": "dados/trilha-vendas/aula-02.json" },
    { "id": "aula-03", "titulo": "Conteúdo com IA que não parece IA", "ordem": 3, "arquivo": "dados/trilha-vendas/aula-03.json" },
    { "id": "aula-04", "titulo": "Rotina de postagem sem travar", "ordem": 4, "arquivo": "dados/trilha-vendas/aula-04.json" },
    { "id": "aula-05", "titulo": "Automatizando a postagem com n8n", "ordem": 5, "arquivo": "dados/trilha-vendas/aula-05.json" },
    { "id": "aula-06", "titulo": "Um agente que atende por você", "ordem": 6, "arquivo": "dados/trilha-vendas/aula-06.json" }
  ]
}
```

Antes de colar, confirmar cada `titulo` acima contra o campo `titulo` real dentro do respectivo `dados/trilha-vendas/aula-0N.json` (Tasks 1-6) — copiar exatamente, não parafrasear. Se algum `titulo` no arquivo real for diferente do listado aqui, usar o do arquivo.

- [ ] **Step 3: Validar o JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('dados/indice.json','utf8')); console.log('OK')"
```
Esperado: `OK`. Conferir que a trilha `trilha-ia` original continua intacta no array, e que as 6 novas entradas de `trilha-vendas` têm `ordem` 1-6 sem repetição e `arquivo` apontando pro caminho certo.

- [ ] **Step 4: Commit**

```bash
git add dados/indice.json
git commit -m "content: registra trilha Vender pela internet e WhatsApp no indice do app"
```

---

## Fora de escopo deste plano

- Trilhas 3 e 4 (formalizar empresa / gerir dinheiro) — domínio tradicional, sem IA, spec própria futura, ainda não brainstormada.
- Passo a passo prático de gravação — plano curto próprio depois que os 6 roteiros estiverem validados.
- Upload dos vídeos no Panda Video, vínculo do `panda_video_id`, e diagramação/exportação dos PDFs finais — trabalho da conversa técnica / de produção, não desta.
- O fluxo real de n8n da Aula 5 e a configuração real do agente da Aula 6 — a aula ensina o conceito e usa um fluxo/agente modelo; a configuração de produção desses dois pra Gregory usar no próprio negócio é trabalho separado, técnico.
