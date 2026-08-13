# Trilha 1 — IA no Negócio: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produzir as 6 aulas completas da trilha "IA no Negócio" — roteiro de vídeo, atividade interativa (JSON) e material de apoio em PDF — substituindo a Aula 1 de teste técnico por conteúdo pedagógico real.

**Architecture:** Cada aula é um task autocontido que produz três arquivos de conteúdo (roteiro, atividade, PDF) no repositório `app-atividades-curso`. As aulas se encadeiam: a Aula 1 gera a lista de tarefas do aluno que a Aula 2 reusa, e assim por diante até o mini-plano final da Aula 6.

**Tech Stack:** Markdown (roteiro e PDF), JSON conforme o schema de `dados/modelo-aula.json`, Node.js (`node --test`, `node -e`) para validação de JSON.

**Spec:** `docs/superpowers/specs/2026-08-13-curriculo-trilhas-1-2-design.md`

## Global Constraints

- Nunca sugerir reconhecimento, autorização ou chancela do MEC; nunca usar "faculdade", "graduação", "pós-graduação", "diploma", "instituição de ensino superior" — sempre "certificado de conclusão de curso livre".
- Nenhuma promessa de resultado financeiro ("fature", "ganhe dinheiro", "lucro garantido", "método validado", "resultados comprovados").
- Nenhuma prova social inventada (número de alunos, depoimento, selo, nota).
- Evitar as palavras "solução", "jornada", "transformação", "empoderar", "descomplicar".
- Vídeo curto, linguagem direta, pensado pra celular à noite, aluno cansado. Nenhum "vi que você...".
- Atividade sempre parte de uma situação concreta do negócio do aluno antes de qualquer explicação, e termina em artefato real (lista, número, decisão escrita) — nunca nota ou pontuação.
- Tipos de bloco disponíveis: `cenario`, `lista_aberta`, `calculo`, `escolha_simples` — schema exato em `dados/modelo-aula.json`.
- Todo conteúdo aplica pelo menos um destes três diferenciais: raciocínio explícito (não receita), artefato reutilizável, ou erro real revisado.
- Progressão gradual com vitória visível cedo — nunca abrir aula ou trilha com algo difícil.

---

## File Structure

Repositório: `C:\Users\robot\Documents\app-atividades-curso`

- `dados/trilha-ia/aula-01.json` até `aula-06.json` — atividade interativa de cada aula (schema `modelo-aula.json`). `aula-01.json` já existe como teste técnico e será **sobrescrito**.
- `conteudo/trilha-ia/aula-0N-roteiro.md` — roteiro do vídeo de cada aula (novo diretório).
- `conteudo/trilha-ia/aula-0N-pdf.md` — conteúdo do material de apoio em PDF de cada aula (novo diretório).

---

### Task 1: Aula 1 — Você já usa IA. O problema é como.

**Files:**
- Create/Overwrite: `dados/trilha-ia/aula-01.json`
- Create: `conteudo/trilha-ia/aula-01-roteiro.md`
- Create: `conteudo/trilha-ia/aula-01-pdf.md`

**Interfaces:**
- Produces: bloco `b3` (lista_aberta) com a lista de 5 tarefas do aluno — a Aula 2 depende deste bloco (`depende_de: {trilha: "trilha-ia", aula: "aula-01", bloco: "b3"}`).

- [ ] **Step 1: Escrever o roteiro**

Salvar em `conteudo/trilha-ia/aula-01-roteiro.md`:

```markdown
# Aula 1 — Você já usa IA. O problema é como.

**Habilidade:** reconhecer, pelas três perguntas, se uma tarefa do negócio vale a pena automatizar.

[0:00] Ontem à noite, depois de fechar, você respondeu a mesma pergunta pela
quinta vez no WhatsApp: "vocês entregam no meu bairro?". Cinco vezes, a
mesma resposta, o mesmo tempo gasto. Essa cena se repete em quase todo
negócio pequeno — e é aí que a inteligência artificial entra, não como
papo de futuro, mas como ferramenta pra hoje à noite.

[0:25] Essa aula não vai te ensinar vinte ferramentas de IA. Vai te ensinar
uma pergunta — na verdade, três — pra você decidir sozinho, daqui pra
frente, o que vale automatizar e o que não vale. Esse critério vale mais
que qualquer lista de ferramenta, porque ferramenta muda, o critério não.

[0:55] Pergunta 1: essa tarefa se repete? Uma vez não conta, cinco vezes
por semana conta.
Pergunta 2: ela custa tempo de verdade? Não é sobre ser chata, é sobre
quanto minuto ela come do seu dia.
Pergunta 3: a resposta certa segue um padrão? Se a resposta muda dependendo
de quem pergunta, de humor, de contexto — não é candidata.

[1:40] Um contraexemplo, pra isso não virar receita cega: reclamação de
cliente sobre entrega atrasada não passa nas três perguntas. Até se repete,
mas a resposta certa depende do histórico daquele cliente, do que
aconteceu, do seu julgamento. Automatizar aqui custa cliente, não tempo.

[2:15] Agora é sua vez: pega o celular, pensa nos últimos 7 dias, e lista
pelo menos 5 tarefas que se repetem no seu negócio. Não precisa ser
bonito, precisa ser verdade. A atividade a seguir usa exatamente essa
lista.
```

- [ ] **Step 2: Revisar o roteiro contra os Global Constraints**

Checklist manual (marcar cada item):
- [ ] Nenhuma palavra da lista proibida (solução, jornada, transformação, empoderar, descomplicar)
- [ ] Nenhuma promessa de resultado financeiro
- [ ] Nenhuma prova social inventada
- [ ] Nenhum "vi que você..." ou abertura genérica
- [ ] Aplica pelo menos um diferencial (aqui: raciocínio explícito — as três perguntas)

- [ ] **Step 3: Escrever a atividade JSON**

Salvar em `dados/trilha-ia/aula-01.json` (sobrescrevendo o arquivo de teste):

```json
{
  "schema_version": 1,
  "trilha": "trilha-ia",
  "aula": "aula-01",
  "titulo": "Você já usa IA. O problema é como.",
  "habilidade": "Reconhecer, pelas três perguntas, se uma tarefa do seu negócio vale a pena automatizar.",
  "blocos": [
    {
      "id": "b1",
      "tipo": "cenario",
      "enunciado": "Um dono de pizzaria gasta cerca de 15 minutos por dia respondendo a mesma pergunta, \"vocês entregam no meu bairro?\". Pelas três perguntas da aula, essa tarefa é:",
      "opcoes": [
        "Não é candidata, é tempo demais para automatizar",
        "Candidata forte, porque repete, custa tempo e a resposta segue um padrão",
        "Não é candidata, porque atendimento nunca deve ser automatizado",
        "Falta informação para decidir"
      ],
      "correta": 1,
      "dica_erro": "Reveja o trecho dos 0:55 do vídeo.",
      "explicacao_erro": "As três perguntas são: repete, custa tempo, a resposta segue padrão.",
      "feedback_acerto": "Exato. Repete, soma tempo, e a resposta depende só do endereço — é padrão."
    },
    {
      "id": "b2",
      "tipo": "cenario",
      "enunciado": "A mesma pizzaria recebe uma reclamação de um cliente que pediu para um aniversário e a pizza chegou fria. Pelas três perguntas, essa tarefa é:",
      "opcoes": [
        "Candidata forte, porque reclamação sempre tem resposta pronta",
        "Não é candidata, porque depende de julgamento e do histórico daquele cliente",
        "Candidata, desde que a resposta seja revisada depois",
        "Falta informação para decidir"
      ],
      "correta": 1,
      "dica_erro": "Reveja o trecho dos 1:40 do vídeo.",
      "explicacao_erro": "Uma reclamação de aniversário não se repete do mesmo jeito e exige julgamento — não é padrão.",
      "feedback_acerto": "Isso. É rara e depende do seu julgamento. Automatizar aqui custa cliente."
    },
    {
      "id": "b3",
      "tipo": "lista_aberta",
      "enunciado": "Liste 5 tarefas que você repete no seu negócio toda semana. Escreva do jeito que você falaria, não precisa ser formal.",
      "quantidade_campos": 5,
      "minimo_preenchido": 1,
      "placeholders": [
        "responder quanto custa no WhatsApp",
        "montar o post da promoção",
        "lembrar de cobrar quem ficou devendo"
      ]
    },
    {
      "id": "b4",
      "tipo": "calculo",
      "enunciado": "Agora escolha UMA dessas cinco tarefas e responda.",
      "campos": [
        { "id": "tarefa", "tipo": "selecao", "rotulo": "Qual das cinco?", "depende_de": { "trilha": "trilha-ia", "aula": "aula-01", "bloco": "b3" } },
        { "id": "vezes_semana", "tipo": "numero", "rotulo": "Quantas vezes por semana você faz", "unidade": "vezes", "minimo": 0, "maximo": 999 },
        { "id": "minutos_vez", "tipo": "numero", "rotulo": "Quanto tempo leva cada vez, em minutos", "unidade": "minutos", "minimo": 0, "maximo": 999 },
        { "id": "resposta_padrao", "tipo": "selecao", "rotulo": "A resposta certa é quase sempre a mesma?", "opcoes": ["Sim", "Não", "Às vezes"] }
      ],
      "calculos": {
        "total": "vezes_semana * minutos_vez",
        "horas": "total * 4.345 / 60"
      },
      "resultado_texto": "Você gasta cerca de {total} minutos por semana, o que dá {horas} horas por mês."
    },
    {
      "id": "b5",
      "tipo": "escolha_simples",
      "enunciado": "Olhando o número que apareceu acima, essa tarefa vale ser atacada primeiro?",
      "opcoes": [
        "Sim, é a que mais me consome",
        "Não, tem outra da lista que é pior",
        "Ainda não sei"
      ]
    }
  ]
}
```

- [ ] **Step 4: Validar o JSON**

Rodar (dentro de `app-atividades-curso`):
```bash
node -e "JSON.parse(require('fs').readFileSync('dados/trilha-ia/aula-01.json','utf8')); console.log('OK')"
```
Esperado: `OK` impresso, sem erro de parse.

Conferir manualmente contra `dados/modelo-aula.json`: todo bloco `cenario` tem `correta` dentro do range de `opcoes`; ids `b1`..`b5` únicos; `depende_de` do `b4` aponta pro `b3` da própria aula.

- [ ] **Step 5: Escrever o PDF de apoio**

Salvar em `conteudo/trilha-ia/aula-01-pdf.md`:

```markdown
# Material de apoio — Aula 1: As três perguntas

Antes de automatizar qualquer tarefa do seu negócio, pergunte:

1. **Ela se repete?** (uma vez não conta — pense em "toda semana")
2. **Ela custa tempo de verdade?** (quantos minutos, não "é chata")
3. **A resposta segue um padrão?** (não muda com humor, cliente ou contexto)

Se as três respostas forem sim, vale automatizar. Se alguma for não —
principalmente a 3 — deixe na sua mão.

## Suas 5 tarefas que se repetem

1. _______________________________________________
2. _______________________________________________
3. _______________________________________________
4. _______________________________________________
5. _______________________________________________

Guarde essa lista — a próxima aula usa ela.
```

- [ ] **Step 6: Revisar PDF contra os Global Constraints**

Mesmo checklist do Step 2.

- [ ] **Step 7: Commit**

```bash
git add dados/trilha-ia/aula-01.json conteudo/trilha-ia/aula-01-roteiro.md conteudo/trilha-ia/aula-01-pdf.md
git commit -m "content: aula 1 da trilha IA no Negocio (roteiro, atividade, pdf)"
```

---

### Task 2: Aula 2 — As ferramentas que cabem no bolso

**Files:**
- Create: `dados/trilha-ia/aula-02.json`
- Create: `conteudo/trilha-ia/aula-02-roteiro.md`
- Create: `conteudo/trilha-ia/aula-02-pdf.md`

**Interfaces:**
- Consumes: bloco `b3` da Aula 1 (lista de 5 tarefas) — referenciado no `enunciado` do roteiro e da atividade.
- Produces: nenhuma dependência nova pra aulas seguintes (a Aula 3 referencia a resposta livre do aluno em texto, não um bloco estruturado).

- [ ] **Step 1: Escrever o roteiro**

Salvar em `conteudo/trilha-ia/aula-02-roteiro.md`:

```markdown
# Aula 2 — As ferramentas que cabem no bolso

**Habilidade:** identificar qual tipo de ferramenta de IA serve pra qual tipo de tarefa, testando na prática com uma tarefa real do próprio negócio.

[0:00] Você provavelmente já tem duas ou três ferramentas de IA instaladas
no celular e nunca abriu de verdade. Essa aula não é sobre decorar nome de
ferramenta — é sobre testar, agora, com a tarefa que você escolheu na aula
passada.

[0:20] Três categorias, não nomes pra decorar:
Ferramenta de conversa (tipo ChatGPT ou Gemini) — serve pra escrever
texto, responder pergunta, organizar ideia.
Ferramenta de imagem (tipo Canva com IA) — serve pra criar arte, post,
banner.
Ferramenta que já está no que você usa (WhatsApp, Google) — já tem IA
embutida, você só não testou ainda.

[1:00] Demonstração: abre agora uma ferramenta de conversa gratuita. Copia
a tarefa que você escolheu na aula passada. Cola. Pede ajuda com ela. Não
precisa ser perfeito — o objetivo é ver a resposta, não decorar comando.

[1:45] Duas coisas pra prestar atenção na resposta: ela usa palavra que
você não usaria? Corta. Ela é genérica, serve pra qualquer negócio? Ainda
não serve — falta seu contexto, e é disso que a próxima aula trata.

[2:15] Guarda a resposta que você recebeu, mesmo se não gostou dela — a
atividade e a próxima aula usam ela.
```

- [ ] **Step 2: Revisar o roteiro contra os Global Constraints**

Mesmo checklist do Task 1 / Step 2.

- [ ] **Step 3: Escrever a atividade JSON**

Salvar em `dados/trilha-ia/aula-02.json`:

```json
{
  "schema_version": 1,
  "trilha": "trilha-ia",
  "aula": "aula-02",
  "titulo": "As ferramentas que cabem no bolso",
  "habilidade": "Identificar qual tipo de ferramenta de IA serve pra qual tipo de tarefa, testando na prática.",
  "blocos": [
    {
      "id": "b1",
      "tipo": "escolha_simples",
      "enunciado": "Qual dessas ferramentas você já abriu no celular alguma vez?",
      "opcoes": [
        "Nenhuma ainda",
        "Já abri, mas nunca usei pra o negócio",
        "Já usei pra alguma coisa do negócio"
      ]
    },
    {
      "id": "b2",
      "tipo": "cenario",
      "enunciado": "Um dono de salão de beleza quer escrever a legenda de um post sobre uma promoção de corte e escova. Qual tipo de ferramenta serve melhor pra essa tarefa?",
      "opcoes": [
        "Ferramenta de conversa (tipo ChatGPT ou Gemini)",
        "Ferramenta de imagem (tipo Canva com IA)",
        "Nenhuma, isso precisa ser feito manualmente"
      ],
      "correta": 0,
      "dica_erro": "Reveja o trecho das três categorias no vídeo.",
      "explicacao_erro": "Legenda é texto — ferramenta de conversa é a que ajuda a escrever e ajustar o tom.",
      "feedback_acerto": "Isso. Texto é trabalho de ferramenta de conversa."
    },
    {
      "id": "b3",
      "tipo": "lista_aberta",
      "enunciado": "Teste agora uma ferramenta de conversa gratuita com a tarefa que você escolheu na Aula 1. Cole aqui a resposta que ela te deu (ou resuma em poucas palavras).",
      "quantidade_campos": 1,
      "minimo_preenchido": 1,
      "placeholders": ["a resposta que a ferramenta te deu"]
    },
    {
      "id": "b4",
      "tipo": "escolha_simples",
      "enunciado": "Essa resposta já serve do jeito que veio, ou precisa de ajuste pra soar como você fala com seu cliente?",
      "opcoes": [
        "Já serve do jeito que veio",
        "Precisa de ajuste",
        "Não consegui testar ainda"
      ]
    }
  ]
}
```

- [ ] **Step 4: Validar o JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('dados/trilha-ia/aula-02.json','utf8')); console.log('OK')"
```
Esperado: `OK`. Conferir ids únicos e `b2.correta` dentro do range de `opcoes`.

- [ ] **Step 5: Escrever o PDF de apoio**

Salvar em `conteudo/trilha-ia/aula-02-pdf.md`:

```markdown
# Material de apoio — Aula 2: As três categorias de ferramenta

| Categoria | Pra que serve | Testei? |
|---|---|---|
| Conversa (ChatGPT, Gemini) | Escrever texto, responder pergunta, organizar ideia | [ ] |
| Imagem (Canva com IA) | Criar arte, post, banner | [ ] |
| Embutida (WhatsApp, Google) | Já está no que você usa, só falta ativar | [ ] |

## Resposta que recebi no teste de hoje

_______________________________________________
_______________________________________________

Guarde essa resposta — a próxima aula ensina a melhorá-la.
```

- [ ] **Step 6: Revisar PDF contra os Global Constraints**

Mesmo checklist.

- [ ] **Step 7: Commit**

```bash
git add dados/trilha-ia/aula-02.json conteudo/trilha-ia/aula-02-roteiro.md conteudo/trilha-ia/aula-02-pdf.md
git commit -m "content: aula 2 da trilha IA no Negocio (roteiro, atividade, pdf)"
```

---

### Task 3: Aula 3 — Fazendo a IA trabalhar por você

**Files:**
- Create: `dados/trilha-ia/aula-03.json`
- Create: `conteudo/trilha-ia/aula-03-roteiro.md`
- Create: `conteudo/trilha-ia/aula-03-pdf.md`

**Interfaces:**
- Consumes: resposta genérica da Aula 2 (referenciada em texto no roteiro, não como bloco estruturado).
- Produces: bloco `b3` (o pedido completo montado pelo aluno) — referenciado em texto pela Aula 4, não como dependência estrutural.

- [ ] **Step 1: Escrever o roteiro**

Salvar em `conteudo/trilha-ia/aula-03-roteiro.md`:

```markdown
# Aula 3 — Fazendo a IA trabalhar por você

**Habilidade:** montar um pedido (prompt) reutilizável com contexto, tarefa, formato e exemplo, e melhorá-lo por iteração.

[0:00] Na aula passada você testou uma ferramenta e talvez a resposta
tenha saído genérica. Não foi a ferramenta que falhou — foi o pedido.
Essa aula ensina a montar um pedido que funciona de verdade.

[0:20] A estrutura tem quatro partes: Contexto — quem é seu negócio, pra
quem você vende. Tarefa — o que você quer que ela faça, de forma
específica. Formato — como você quer a resposta: tamanho, tom, lista ou
texto corrido. Exemplo — uma frase sua, pra ela copiar o jeito que você
fala.

[1:10] Demonstração, ao vivo, pro salão de beleza da aula passada: "Eu
tenho um salão de beleza em bairro de classe média, minhas clientes têm
entre 25 e 50 anos. Escreve uma legenda de Instagram sobre a promoção de
corte e escova por R$ 60 essa semana. Máximo 3 linhas, tom animado mas sem
parecer forçado. Aqui vai um exemplo de como eu escrevo: 'Chegou a hora de
renovar o visual, amores!'"

[2:00] Se a resposta não veio boa, você não desiste — ajusta uma parte só.
Ficou formal demais? Mexe no formato. Ficou genérico? Mexe no exemplo.

[2:30] Agora é sua vez: monta esse pedido completo pra uma tarefa real do
seu negócio. Esse molde você reusa daqui pra frente, pra qualquer pedido.
```

- [ ] **Step 2: Revisar o roteiro contra os Global Constraints**

Mesmo checklist. Diferencial aplicado aqui: artefato reutilizável (o molde de 4 partes).

- [ ] **Step 3: Escrever a atividade JSON**

Salvar em `dados/trilha-ia/aula-03.json`:

```json
{
  "schema_version": 1,
  "trilha": "trilha-ia",
  "aula": "aula-03",
  "titulo": "Fazendo a IA trabalhar por você",
  "habilidade": "Montar um pedido reutilizável com contexto, tarefa, formato e exemplo, e melhorá-lo por iteração.",
  "blocos": [
    {
      "id": "b1",
      "tipo": "lista_aberta",
      "enunciado": "Escreva seu contexto de negócio em uma frase: quem você é, pra quem vende.",
      "quantidade_campos": 1,
      "minimo_preenchido": 1,
      "placeholders": ["salão de beleza em bairro de classe média, clientes de 25 a 50 anos"]
    },
    {
      "id": "b2",
      "tipo": "cenario",
      "enunciado": "Dois pedidos pra mesma tarefa. Pedido A: \"Escreve um post pra mim\". Pedido B: contexto + tarefa específica + formato + exemplo do seu tom. Qual tem mais chance de vir com uma resposta útil de primeira?",
      "opcoes": [
        "Pedido A, é mais direto",
        "Pedido B, porque dá contexto pra IA acertar o tom e o tamanho",
        "Os dois vêm iguais"
      ],
      "correta": 1,
      "dica_erro": "Reveja as quatro partes do molde no vídeo.",
      "explicacao_erro": "Sem contexto, tarefa, formato e exemplo, a IA responde genérico — parecido com o que aconteceu na Aula 2.",
      "feedback_acerto": "Isso. Quanto mais completo o pedido, menos ajuste depois."
    },
    {
      "id": "b3",
      "tipo": "lista_aberta",
      "enunciado": "Monte seu pedido completo (contexto + tarefa + formato + exemplo) pra uma tarefa real do seu negócio. Escreva o pedido inteiro aqui.",
      "quantidade_campos": 1,
      "minimo_preenchido": 1,
      "placeholders": ["contexto: ... tarefa: ... formato: ... exemplo: ..."]
    },
    {
      "id": "b4",
      "tipo": "escolha_simples",
      "enunciado": "Depois de testar esse pedido numa ferramenta, a resposta veio melhor que a da Aula 2?",
      "opcoes": [
        "Sim, bem melhor",
        "Um pouco melhor",
        "Ainda não testei"
      ]
    }
  ]
}
```

- [ ] **Step 4: Validar o JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('dados/trilha-ia/aula-03.json','utf8')); console.log('OK')"
```
Esperado: `OK`. Conferir `b2.correta` dentro do range de `opcoes`.

- [ ] **Step 5: Escrever o PDF de apoio**

Salvar em `conteudo/trilha-ia/aula-03-pdf.md`:

```markdown
# Material de apoio — Aula 3: Molde de pedido reutilizável

Preencha as quatro partes toda vez que for pedir algo pra uma IA:

**Contexto:** quem é seu negócio, pra quem você vende.
_______________________________________________

**Tarefa:** o que você quer que ela faça, específico.
_______________________________________________

**Formato:** tamanho, tom, lista ou texto corrido.
_______________________________________________

**Exemplo:** uma frase sua, pra ela copiar seu jeito de falar.
_______________________________________________

Cole essas quatro partes juntas no início de qualquer pedido — é o molde
que você reusa daqui pra frente.
```

- [ ] **Step 6: Revisar PDF contra os Global Constraints**

Mesmo checklist.

- [ ] **Step 7: Commit**

```bash
git add dados/trilha-ia/aula-03.json conteudo/trilha-ia/aula-03-roteiro.md conteudo/trilha-ia/aula-03-pdf.md
git commit -m "content: aula 3 da trilha IA no Negocio (roteiro, atividade, pdf)"
```

---

### Task 4: Aula 4 — Atendimento sem parecer robô

**Files:**
- Create: `dados/trilha-ia/aula-04.json`
- Create: `conteudo/trilha-ia/aula-04-roteiro.md`
- Create: `conteudo/trilha-ia/aula-04-pdf.md`

**Interfaces:**
- Consumes: nenhuma dependência estrutural direta (usa uma resposta genérica de exemplo embutida na própria aula, não um bloco de aula anterior).
- Produces: nenhuma dependência nova.

- [ ] **Step 1: Escrever o roteiro**

Salvar em `conteudo/trilha-ia/aula-04-roteiro.md`:

```markdown
# Aula 4 — Atendimento sem parecer robô

**Habilidade:** revisar e editar uma resposta de IA genérica até soar como o próprio dono falando com o cliente, e reconhecer quando a revisão manual é obrigatória.

[0:00] Olha essa resposta que uma IA deu pra uma mensagem de cliente:
"Olá! Agradecemos seu contato. Nossa equipe está à disposição para
auxiliá-lo(a) em qualquer necessidade que você tenha!" Ninguém fala assim
com cliente de verdade. Isso aqui espanta mais do que ajuda.

[0:30] Isso acontece porque a IA tenta ser educada de um jeito genérico —
ela não conhece seu jeito de falar. Consertar isso antes de mandar é
trabalho seu, sempre.

[1:00] Três perguntas rápidas pra revisar: tem palavra que eu nunca uso?
Corta. Tá formal demais pro meu cliente? Ajusta o tom. Faltou alguma
informação real, tipo preço ou prazo? Completa.

[1:45] Reescrevendo ao vivo aquela resposta de abertura: "Oi! Recebi sua
mensagem, já te respondo com o que você precisa." Mais curto, mais parecido
com gente de verdade.

[2:20] Um aviso importante: situação delicada — reclamação, cobrança,
crise com cliente — nunca é resposta automática sozinha. É revisão manual
sempre, sem exceção. Isso volta com mais força na última aula da trilha.

[2:45] Agora é sua vez: pega uma resposta genérica de IA (pode ser a da
Aula 2) e reescreve até soar como você.
```

- [ ] **Step 2: Revisar o roteiro contra os Global Constraints**

Mesmo checklist. Diferencial aplicado: erro real revisado (a resposta genérica de abertura).

- [ ] **Step 3: Escrever a atividade JSON**

Salvar em `dados/trilha-ia/aula-04.json`:

```json
{
  "schema_version": 1,
  "trilha": "trilha-ia",
  "aula": "aula-04",
  "titulo": "Atendimento sem parecer robô",
  "habilidade": "Revisar uma resposta de IA genérica até soar como o próprio dono, e reconhecer quando a revisão manual é obrigatória.",
  "blocos": [
    {
      "id": "b1",
      "tipo": "cenario",
      "enunciado": "Uma IA respondeu a um cliente: \"Agradecemos seu contato. Nossa equipe está à disposição para auxiliá-lo(a) em qualquer necessidade que você tenha!\". O principal problema dessa resposta é:",
      "opcoes": [
        "Está errada, o cliente não vai entender",
        "É longa e genérica demais, não soa como uma pessoa falando",
        "Não tem problema nenhum, pode mandar assim"
      ],
      "correta": 1,
      "dica_erro": "Reveja o trecho dos 0:00 do vídeo.",
      "explicacao_erro": "A resposta é educada mas genérica — não parece ninguém falando de verdade com o cliente.",
      "feedback_acerto": "Isso. Genérica demais — falta o seu jeito de falar."
    },
    {
      "id": "b2",
      "tipo": "lista_aberta",
      "enunciado": "Copie aqui uma resposta genérica que uma IA te deu (pode ser da Aula 2 ou testando agora) já reescrita do seu jeito.",
      "quantidade_campos": 1,
      "minimo_preenchido": 1,
      "placeholders": ["a versão reescrita, do jeito que você falaria"]
    },
    {
      "id": "b3",
      "tipo": "cenario",
      "enunciado": "Você recebe uma reclamação de cliente sobre atraso na entrega. O que fazer?",
      "opcoes": [
        "Deixar a IA responder sozinha, é mais rápido",
        "Pode usar a IA pra rascunhar, mas sempre revisar e ajustar antes de mandar",
        "Nunca usar IA nem pra rascunhar, escrever tudo do zero"
      ],
      "correta": 1,
      "dica_erro": "Reveja o trecho dos 2:20 do vídeo.",
      "explicacao_erro": "Situação delicada permite rascunho de IA, mas a revisão manual antes de mandar é sempre obrigatória.",
      "feedback_acerto": "Isso. Pode ajudar a rascunhar, mas quem decide e revisa é você."
    },
    {
      "id": "b4",
      "tipo": "escolha_simples",
      "enunciado": "No seu negócio, em qual tipo de mensagem você mais precisa desse cuidado de revisar antes de mandar?",
      "opcoes": [
        "Resposta de preço ou prazo",
        "Reclamação",
        "Cobrança",
        "Pergunta geral sobre o produto"
      ]
    }
  ]
}
```

- [ ] **Step 4: Validar o JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('dados/trilha-ia/aula-04.json','utf8')); console.log('OK')"
```
Esperado: `OK`. Conferir `b1.correta` e `b3.correta` dentro do range de `opcoes`.

- [ ] **Step 5: Escrever o PDF de apoio**

Salvar em `conteudo/trilha-ia/aula-04-pdf.md`:

```markdown
# Material de apoio — Aula 4: Checklist de revisão antes de mandar

Antes de mandar qualquer resposta gerada por IA pro cliente, confira:

1. **Tem palavra que eu nunca uso?** Corta.
2. **Tá formal demais pro meu cliente?** Ajusta o tom.
3. **Faltou alguma informação real (preço, prazo, endereço)?** Completa.

## Situações que exigem revisão manual sempre

- Reclamação de cliente
- Cobrança
- Qualquer crise ou situação delicada

Nessas, a IA pode ajudar a rascunhar — mas quem decide e revisa antes de
mandar é sempre você.
```

- [ ] **Step 6: Revisar PDF contra os Global Constraints**

Mesmo checklist.

- [ ] **Step 7: Commit**

```bash
git add dados/trilha-ia/aula-04.json conteudo/trilha-ia/aula-04-roteiro.md conteudo/trilha-ia/aula-04-pdf.md
git commit -m "content: aula 4 da trilha IA no Negocio (roteiro, atividade, pdf)"
```

---

### Task 5: Aula 5 — Organização da rotina

**Files:**
- Create: `dados/trilha-ia/aula-05.json`
- Create: `conteudo/trilha-ia/aula-05-roteiro.md`
- Create: `conteudo/trilha-ia/aula-05-pdf.md`

**Interfaces:**
- Produces: bloco `b1` (lista_aberta) com as tarefas de fundo — usado pelo `depende_de` do bloco `b3` desta mesma aula.

- [ ] **Step 1: Escrever o roteiro**

Salvar em `conteudo/trilha-ia/aula-05-roteiro.md`:

```markdown
# Aula 5 — Organização da rotina

**Habilidade:** usar IA em tarefas de fundo (agenda, lembrete de cobrança, rascunho de post) que sustentam o negócio sem aparecer pro cliente.

[0:00] As aulas até aqui foram sobre o que aparece pro cliente. Essa é
sobre o que ninguém vê — e é o que mais consome sua semana: agenda,
cobrança, rascunho.

[0:25] Três usos de fundo: lembrete de cobrança — a IA ajuda a escrever a
mensagem de cobrar sem parecer grosseiro. Organização de agenda — resumir
uma lista bagunçada de compromissos em uma agenda por dia. Rascunho de
post — deixar pronto um esqueleto de post pra você só ajustar, não
escrever do zero toda semana.

[1:20] Demonstração: pega uma lista bagunçada de "coisas pra fazer"
anotada no celular e pede pra IA organizar por prioridade e dia da semana.

[2:00] O risco aqui é menor, porque essas tarefas não vão direto pro
cliente — é um bom lugar pra treinar sem medo de errar.

[2:30] Agora é sua vez: liste suas tarefas de fundo e veja quanto tempo
elas realmente consomem.
```

- [ ] **Step 2: Revisar o roteiro contra os Global Constraints**

Mesmo checklist.

- [ ] **Step 3: Escrever a atividade JSON**

Salvar em `dados/trilha-ia/aula-05.json`:

```json
{
  "schema_version": 1,
  "trilha": "trilha-ia",
  "aula": "aula-05",
  "titulo": "Organização da rotina",
  "habilidade": "Usar IA em tarefas de fundo (agenda, cobrança, rascunho) que sustentam o negócio sem aparecer pro cliente.",
  "blocos": [
    {
      "id": "b1",
      "tipo": "lista_aberta",
      "enunciado": "Liste de 3 a 5 tarefas de fundo que você faz toda semana e nunca tem tempo (cobrança, agenda, organização).",
      "quantidade_campos": 5,
      "minimo_preenchido": 1,
      "placeholders": [
        "organizar a agenda da semana",
        "mandar mensagem de cobrança",
        "rascunhar o post de segunda"
      ]
    },
    {
      "id": "b2",
      "tipo": "cenario",
      "enunciado": "Você tem 8 compromissos anotados sem ordem nenhuma no papel. Pedir pra uma IA organizar por dia da semana é:",
      "opcoes": [
        "Arriscado, porque agenda é coisa séria demais pra IA",
        "Uma boa tarefa de fundo pra treinar, o risco de errar é baixo",
        "Inútil, é mais rápido fazer na mão"
      ],
      "correta": 1,
      "dica_erro": "Reveja o trecho dos 2:00 do vídeo.",
      "explicacao_erro": "Tarefa de fundo não aparece pro cliente — é um bom lugar pra treinar com IA sem medo.",
      "feedback_acerto": "Isso. Baixo risco, alto ganho de tempo."
    },
    {
      "id": "b3",
      "tipo": "calculo",
      "enunciado": "Agora escolha UMA dessas tarefas de fundo e responda.",
      "campos": [
        { "id": "tarefa", "tipo": "selecao", "rotulo": "Qual das que você listou?", "depende_de": { "trilha": "trilha-ia", "aula": "aula-05", "bloco": "b1" } },
        { "id": "vezes_semana", "tipo": "numero", "rotulo": "Quantas vezes por semana você faz", "unidade": "vezes", "minimo": 0, "maximo": 999 },
        { "id": "minutos_vez", "tipo": "numero", "rotulo": "Quanto tempo leva cada vez, em minutos", "unidade": "minutos", "minimo": 0, "maximo": 999 }
      ],
      "calculos": {
        "total": "vezes_semana * minutos_vez",
        "horas": "total * 4.345 / 60"
      },
      "resultado_texto": "Essa tarefa de fundo consome cerca de {total} minutos por semana, ou {horas} horas por mês."
    },
    {
      "id": "b4",
      "tipo": "escolha_simples",
      "enunciado": "Depois de ver o tempo que isso consome, você organiza essa tarefa com ajuda de IA essa semana?",
      "opcoes": [
        "Sim, começo hoje",
        "Sim, mas só na próxima semana",
        "Ainda não tenho certeza"
      ]
    }
  ]
}
```

- [ ] **Step 4: Validar o JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('dados/trilha-ia/aula-05.json','utf8')); console.log('OK')"
```
Esperado: `OK`. Conferir que `b3.campos[0].depende_de` aponta pro `b1` desta mesma aula (não da Aula 1).

- [ ] **Step 5: Escrever o PDF de apoio**

Salvar em `conteudo/trilha-ia/aula-05-pdf.md`:

```markdown
# Material de apoio — Aula 5: Mapa de tarefas de fundo

| Tarefa de fundo | Vezes por semana | Minutos cada vez | Já uso IA? |
|---|---|---|---|
|  |  |  | [ ] |
|  |  |  | [ ] |
|  |  |  | [ ] |

Tarefa de fundo é a que ninguém vê, mas que mais come sua semana. Comece
pela que tiver o maior número na conta.
```

- [ ] **Step 6: Revisar PDF contra os Global Constraints**

Mesmo checklist.

- [ ] **Step 7: Commit**

```bash
git add dados/trilha-ia/aula-05.json conteudo/trilha-ia/aula-05-roteiro.md conteudo/trilha-ia/aula-05-pdf.md
git commit -m "content: aula 5 da trilha IA no Negocio (roteiro, atividade, pdf)"
```

---

### Task 6: Aula 6 — O que não é pra delegar + projeto final

**Files:**
- Create: `dados/trilha-ia/aula-06.json`
- Create: `conteudo/trilha-ia/aula-06-roteiro.md`
- Create: `conteudo/trilha-ia/aula-06-pdf.md`

**Interfaces:**
- Consumes: conteúdo das Aulas 1-5 em texto (o roteiro referencia o percurso da trilha inteira), sem dependência estrutural de bloco.
- Produces: artefato final da trilha (mini-plano) — não consumido por bloco algum, é o encerramento.

- [ ] **Step 1: Escrever o roteiro**

Salvar em `conteudo/trilha-ia/aula-06-roteiro.md`:

```markdown
# Aula 6 — O que não é pra delegar + projeto final

**Habilidade:** reconhecer os limites do uso de IA (dado de cliente, julgamento, LGPD básica) e fechar a trilha com um mini-plano de uso de IA pro próprio negócio.

[0:00] Nas cinco aulas você aprendeu o que vale automatizar. Essa fecha
com o oposto: o que nunca deve ser delegado pra IA, e por quê.

[0:25] Três limites concretos: dado sensível de cliente — endereço, CPF,
valor de dívida — não deve ser colado em ferramenta de IA gratuita sem
saber o que ela faz com esse dado. Decisão de julgamento — demitir,
perdoar dívida, responder uma crise — é sua, não da IA. Situação delicada
de cliente, como vimos na Aula 4, sempre passa por revisão sua.

[1:15] Dado de cliente, numa frase: é do cliente, não seu pra jogar em
qualquer lugar — trate como trataria o dinheiro dele.

[1:45] Agora você já testou ferramenta, montou pedido, revisou resposta,
organizou rotina. Essa atividade final não é pergunta de múltipla
escolha — é você escrevendo, num lugar só, seu próprio plano: quais 2 ou 3
tarefas do seu negócio você vai automatizar primeiro, com qual ferramenta,
e onde você não vai deixar a IA decidir sozinha.

[2:20] Esse plano não é pra guardar na gaveta — é pra colar perto do
computador e seguir essa semana.
```

- [ ] **Step 2: Revisar o roteiro contra os Global Constraints**

Mesmo checklist.

- [ ] **Step 3: Escrever a atividade JSON**

Salvar em `dados/trilha-ia/aula-06.json`:

```json
{
  "schema_version": 1,
  "trilha": "trilha-ia",
  "aula": "aula-06",
  "titulo": "O que não é pra delegar",
  "habilidade": "Reconhecer os limites do uso de IA e fechar a trilha com um mini-plano de uso de IA pro próprio negócio.",
  "blocos": [
    {
      "id": "b1",
      "tipo": "cenario",
      "enunciado": "Você quer usar uma ferramenta de IA gratuita pra gerar mensagens de cobrança em massa, e pra isso pensa em colar a lista completa de clientes inadimplentes (nome, telefone, valor da dívida) na ferramenta. Isso é seguro?",
      "opcoes": [
        "Sim, é só texto, não tem problema",
        "Não, dado de cliente não deve ser colado em ferramenta gratuita sem saber o que ela faz com ele",
        "Só é seguro se a ferramenta for paga"
      ],
      "correta": 1,
      "dica_erro": "Reveja o trecho dos 0:25 do vídeo.",
      "explicacao_erro": "Dado sensível de cliente (nome, telefone, valor de dívida) é do cliente, não seu pra expor em qualquer ferramenta.",
      "feedback_acerto": "Isso. Dado de cliente pede cuidado, mesmo em ferramenta que parece inofensiva."
    },
    {
      "id": "b2",
      "tipo": "lista_aberta",
      "enunciado": "Liste 2 ou 3 tarefas do seu negócio que você vai automatizar primeiro (pode puxar do que você já viu nas aulas anteriores).",
      "quantidade_campos": 3,
      "minimo_preenchido": 1,
      "placeholders": ["responder dúvida de preço no WhatsApp", "rascunhar post da semana"]
    },
    {
      "id": "b3",
      "tipo": "lista_aberta",
      "enunciado": "Pra cada uma dessas tarefas, qual ferramenta você vai usar?",
      "quantidade_campos": 3,
      "minimo_preenchido": 1,
      "placeholders": ["ferramenta de conversa gratuita"]
    },
    {
      "id": "b4",
      "tipo": "lista_aberta",
      "enunciado": "Escreva pelo menos uma situação do seu negócio onde você NÃO vai deixar a IA decidir sozinha.",
      "quantidade_campos": 1,
      "minimo_preenchido": 1,
      "placeholders": ["reclamação de cliente antigo, decisão de perdoar dívida"]
    },
    {
      "id": "b5",
      "tipo": "escolha_simples",
      "enunciado": "Depois das seis aulas, você se sente mais confiante pra usar IA no seu negócio essa semana?",
      "opcoes": [
        "Sim, já sei por onde começar",
        "Mais ou menos, quero rever alguma aula",
        "Ainda não, preciso de mais um exemplo"
      ]
    }
  ]
}
```

- [ ] **Step 4: Validar o JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('dados/trilha-ia/aula-06.json','utf8')); console.log('OK')"
```
Esperado: `OK`. Conferir `b1.correta` dentro do range de `opcoes`.

- [ ] **Step 5: Escrever o PDF de apoio**

Salvar em `conteudo/trilha-ia/aula-06-pdf.md`:

```markdown
# Material de apoio — Aula 6: Meu plano de IA

## Tarefas que vou automatizar primeiro

| Tarefa | Ferramenta |
|---|---|
|  |  |
|  |  |
|  |  |

## Onde eu NÃO deixo a IA decidir sozinha

_______________________________________________
_______________________________________________

Cole esse plano perto do computador e siga ele essa semana — é o
fechamento prático da trilha, não só uma lembrança.
```

- [ ] **Step 6: Revisar PDF contra os Global Constraints**

Mesmo checklist.

- [ ] **Step 7: Commit**

```bash
git add dados/trilha-ia/aula-06.json conteudo/trilha-ia/aula-06-roteiro.md conteudo/trilha-ia/aula-06-pdf.md
git commit -m "content: aula 6 da trilha IA no Negocio (roteiro, atividade, pdf) - fecha a trilha"
```

---

## Fora de escopo deste plano

- Trilha 2 (Vender pela internet e WhatsApp) — plano separado, depois deste.
- Passo a passo prático de gravação (equipamento, luz, corte) — pode ser um plano curto próprio depois que os 6 roteiros estiverem validados.
- Upload dos vídeos no Panda Video e atualização do banco com o link — trabalho da conversa técnica, não desta.
