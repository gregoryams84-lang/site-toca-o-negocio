# Trilha 4 — Gerir o dinheiro: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produzir as 6 aulas completas da trilha "Gerir o dinheiro" — roteiro de vídeo, atividade interativa (JSON) e material de apoio em PDF — última trilha do curso, tradicional, sem IA.

**Architecture:** Cada aula é um task autocontido que produz três arquivos de conteúdo (roteiro, atividade, PDF) no repositório `app-atividades-curso`, sob o id de trilha `trilha-dinheiro`. Sem bloco `calculo` nem `depende_de` (mesma simplificação estrutural da trilha 3). Um task final registra a trilha no índice do app.

**Tech Stack:** Markdown (roteiro e PDF), JSON conforme o schema de `dados/modelo-aula.json`, Node.js para validação de JSON.

**Spec:** `docs/superpowers/specs/2026-08-14-curriculo-trilha-4-design.md`

## Global Constraints

- Nunca sugerir reconhecimento, autorização ou chancela do MEC; sempre "certificado de conclusão de curso livre".
- Nenhuma promessa de resultado financeiro ("fature", "ganhe dinheiro", "lucro garantido", "método validado", "resultados comprovados") — constraint especialmente relevante nesta trilha (é a trilha sobre dinheiro): ensinar o método, nunca prometer quanto o aluno vai lucrar.
- Nenhuma prova social inventada.
- Evitar as palavras "solução", "jornada", "transformação", "empoderar", "descomplicar".
- Vídeo curto, direto, mobile, aluno cansado. Nenhum "vi que você...".
- Atividade sempre abre com `cenario` (situação concreta) antes de qualquer explicação/autoavaliação.
- Atividade pode terminar no bloco de artefato ou num `escolha_simples` de síntese logo depois, desde que reflita o que acabou de ser construído (nunca pivô de assunto) — e nunca um genérico "você se sente mais seguro?" desconectado do que foi montado (lição da trilha 3).
- Tipos de bloco disponíveis: `cenario`, `lista_aberta`, `calculo`, `escolha_simples` — schema exato em `dados/modelo-aula.json`.
- Todo `dica_erro` deve apontar pro timestamp real onde a justificativa está no roteiro — não copiar timestamp de outro bloco sem checar (lição da trilha 3: 4 de 6 vieram errados na primeira passada).

---

## File Structure

Repositório: `C:\Users\robot\Documents\app-atividades-curso`

- `dados/trilha-dinheiro/aula-01.json` até `aula-06.json`.
- `conteudo/trilha-dinheiro/aula-0N-roteiro.md` e `aula-0N-pdf.md`.
- `dados/indice.json` — recebe uma nova entrada de trilha, em task dedicado (Task 7).

---

### Task 1: Aula 1 — Pra onde seu dinheiro vai

**Files:**
- Create: `dados/trilha-dinheiro/aula-01.json`
- Create: `conteudo/trilha-dinheiro/aula-01-roteiro.md`
- Create: `conteudo/trilha-dinheiro/aula-01-pdf.md`

**Interfaces:**
- Produces: nenhuma dependência estrutural.

- [ ] **Step 1: Escrever o roteiro**

Salvar em `conteudo/trilha-dinheiro/aula-01-roteiro.md`:

```markdown
# Aula 1 — Pra onde seu dinheiro vai

**Habilidade:** reconhecer por que misturar dinheiro pessoal e do negócio mascara prejuízo, e separar as contas.

[0:00] Você tira dinheiro do caixa pra pagar o mercado, depois põe de
volta quando vende bem. No fim do mês, parece que o negócio foi bem —
mas você não sabe se foi o negócio ou se foi você cobrindo o buraco.

[0:25] Essa aula não é sobre organização por organização — é sobre um
risco real: misturar as contas esconde prejuízo até ele estourar. Você
só descobre que o negócio não fecha a conta quando já não tem mais
dinheiro pessoal pra cobrir.

[1:00] O critério simples: toda entrada de venda vai pra uma conta (ou
espaço) só do negócio. Toda saída pessoal sai de outro lugar. Não
precisa ser banco separado logo de cara — pode ser um envelope, uma
conta digital gratuita, o que for, desde que separado.

[1:40] Demonstração: pega as últimas movimentações — papel, app do
banco, caderno — e marca cada uma como "pessoal" ou "negócio". Só esse
exercício já revela a mistura.

[2:15] Agora é sua vez: separa, nem que seja simbolicamente, as duas
coisas essa semana.
```

- [ ] **Step 2: Revisar o roteiro contra os Global Constraints**

Checklist: nenhuma palavra proibida; nenhuma promessa de resultado financeiro; nenhum "vi que você...".

- [ ] **Step 3: Escrever a atividade JSON**

Salvar em `dados/trilha-dinheiro/aula-01.json`:

```json
{
  "schema_version": 1,
  "trilha": "trilha-dinheiro",
  "aula": "aula-01",
  "titulo": "Pra onde seu dinheiro vai",
  "habilidade": "Reconhecer por que misturar dinheiro pessoal e do negócio mascara prejuízo, e separar as contas.",
  "blocos": [
    {
      "id": "b1",
      "tipo": "cenario",
      "enunciado": "Uma dona de salão usa a mesma carteira pro dinheiro do salão e pra casa. Num mês bom, ela paga o aluguel de casa com o caixa do salão. No mês seguinte, o salão vende pouco, mas ela não percebe porque \"sempre tem dinheiro\". O que está acontecendo?",
      "opcoes": [
        "Nada, ela está gerindo bem porque nunca falta dinheiro",
        "Ela não consegue saber se o salão dá lucro de verdade — o dinheiro pessoal está mascarando o resultado real",
        "O problema só existe se ela abrir uma empresa formal"
      ],
      "correta": 1,
      "dica_erro": "Reveja o trecho dos 0:25 do vídeo.",
      "explicacao_erro": "Sem separação, não dá pra saber se o negócio sozinho fecha a conta — o dinheiro pessoal esconde o resultado real.",
      "feedback_acerto": "Isso. Misturar não é só bagunça, é não saber se o negócio se sustenta sozinho."
    },
    {
      "id": "b2",
      "tipo": "escolha_simples",
      "enunciado": "Hoje, seu dinheiro pessoal e do negócio estão:",
      "opcoes": [
        "Bem separados",
        "Meio misturados, mas eu sei distinguir",
        "Totalmente misturados, é tudo a mesma coisa"
      ]
    },
    {
      "id": "b3",
      "tipo": "lista_aberta",
      "enunciado": "Olhe suas últimas movimentações (papel, app, caderno) e liste 3 que você não teria certeza se são pessoais ou do negócio.",
      "quantidade_campos": 3,
      "minimo_preenchido": 1,
      "placeholders": ["compra no mercado paga com o caixa do negócio"]
    },
    {
      "id": "b4",
      "tipo": "escolha_simples",
      "enunciado": "Você vai separar (mesmo que simbolicamente, tipo um envelope ou conta digital) essa semana?",
      "opcoes": [
        "Sim, faço agora",
        "Vou fazer depois",
        "Já tenho separado"
      ]
    }
  ]
}
```

- [ ] **Step 4: Validar o JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('dados/trilha-dinheiro/aula-01.json','utf8')); console.log('OK')"
```
Esperado: `OK`.

- [ ] **Step 5: Escrever o PDF de apoio**

Salvar em `conteudo/trilha-dinheiro/aula-01-pdf.md`:

```markdown
# Material de apoio — Aula 1: Por que separar

Misturar dinheiro pessoal e do negócio esconde prejuízo até ele
estourar — você só percebe quando o pessoal já não cobre mais o buraco.

## Movimentações que me deixam em dúvida (pessoal ou negócio?)

1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

## Meu jeito de separar essa semana

( ) Envelope físico  ( ) Conta digital gratuita  ( ) Outro: _______________
```

- [ ] **Step 6: Revisar PDF contra os Global Constraints**

Mesmo checklist.

- [ ] **Step 7: Commit**

```bash
git add dados/trilha-dinheiro/aula-01.json conteudo/trilha-dinheiro/aula-01-roteiro.md conteudo/trilha-dinheiro/aula-01-pdf.md
git commit -m "content: aula 1 da trilha Gerir o dinheiro (roteiro, atividade, pdf)"
```

---

### Task 2: Aula 2 — Fluxo de caixa simples

**Files:**
- Create: `dados/trilha-dinheiro/aula-02.json`
- Create: `conteudo/trilha-dinheiro/aula-02-roteiro.md`
- Create: `conteudo/trilha-dinheiro/aula-02-pdf.md`

**Interfaces:**
- Produces: nenhuma dependência estrutural.

- [ ] **Step 1: Escrever o roteiro**

Salvar em `conteudo/trilha-dinheiro/aula-02-roteiro.md`:

```markdown
# Aula 2 — Fluxo de caixa simples

**Habilidade:** registrar entrada e saída de forma simples pra saber, a qualquer momento, quanto o negócio realmente tem livre.

[0:00] Você olha a conta do negócio e tem dinheiro — mas não sabe se
aquilo já tem compromisso (fornecedor, conta) ou se é livre pra gastar.
Isso é não ter fluxo de caixa.

[0:25] Fluxo de caixa em uma frase: um registro simples de tudo que
entra e tudo que sai, com data. Não precisa de sistema caro — papel,
planilha simples ou app gratuito servem.

[1:00] Duas colunas resolvem noventa por cento: entrada — o que vendeu,
quando — e saída — o que pagou, quando, pra quê. A diferença entre as
duas é o que sobra de verdade.

[1:40] Demonstração: registrando as últimas cinco movimentações do
negócio nas duas colunas.

[2:15] Agora é sua vez: começa o registro dessa semana.
```

- [ ] **Step 2: Revisar o roteiro contra os Global Constraints**

Mesmo checklist.

- [ ] **Step 3: Escrever a atividade JSON**

Salvar em `dados/trilha-dinheiro/aula-02.json`:

```json
{
  "schema_version": 1,
  "trilha": "trilha-dinheiro",
  "aula": "aula-02",
  "titulo": "Fluxo de caixa simples",
  "habilidade": "Registrar entrada e saída de forma simples pra saber, a qualquer momento, quanto o negócio tem livre.",
  "blocos": [
    {
      "id": "b1",
      "tipo": "cenario",
      "enunciado": "Um dono de negócio vê R$ 3.000 na conta e decide comprar um equipamento novo. Duas semanas depois, não tem dinheiro pra pagar o fornecedor, porque metade daquele valor já tinha destino certo. O que faltou?",
      "opcoes": [
        "Ele devia ter ganho mais no mês",
        "Faltou registrar entrada e saída pra saber quanto do dinheiro já tinha compromisso",
        "Faltou pedir empréstimo antes de comprar"
      ],
      "correta": 1,
      "dica_erro": "Reveja o trecho dos 0:00 do vídeo.",
      "explicacao_erro": "Sem registro de entrada e saída, não dá pra saber quanto do saldo já tem destino — o valor na conta engana.",
      "feedback_acerto": "Isso. Ter dinheiro na conta não é o mesmo que ter dinheiro livre."
    },
    {
      "id": "b2",
      "tipo": "lista_aberta",
      "enunciado": "Liste as últimas 3 entradas (vendas) do seu negócio, com valor aproximado.",
      "quantidade_campos": 3,
      "minimo_preenchido": 1,
      "placeholders": ["venda de encomenda, R$ 150"]
    },
    {
      "id": "b3",
      "tipo": "lista_aberta",
      "enunciado": "Liste as últimas 3 saídas (despesas) do seu negócio, com valor aproximado.",
      "quantidade_campos": 3,
      "minimo_preenchido": 1,
      "placeholders": ["compra de material, R$ 60"]
    },
    {
      "id": "b4",
      "tipo": "escolha_simples",
      "enunciado": "Você vai manter esse registro (papel, planilha, app) toda semana?",
      "opcoes": [
        "Sim, começo essa semana",
        "Vou tentar",
        "Já tenho um jeito de registrar"
      ]
    }
  ]
}
```

- [ ] **Step 4: Validar o JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('dados/trilha-dinheiro/aula-02.json','utf8')); console.log('OK')"
```
Esperado: `OK`.

- [ ] **Step 5: Escrever o PDF de apoio**

Salvar em `conteudo/trilha-dinheiro/aula-02-pdf.md`:

```markdown
# Material de apoio — Aula 2: Meu fluxo de caixa

| Data | Entrada | Saída | Descrição |
|---|---|---|---|
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |

Preencha toda semana. A diferença entre entrada e saída é o que sobra
de verdade.
```

- [ ] **Step 6: Revisar PDF contra os Global Constraints**

Mesmo checklist.

- [ ] **Step 7: Commit**

```bash
git add dados/trilha-dinheiro/aula-02.json conteudo/trilha-dinheiro/aula-02-roteiro.md conteudo/trilha-dinheiro/aula-02-pdf.md
git commit -m "content: aula 2 da trilha Gerir o dinheiro (roteiro, atividade, pdf)"
```

---

### Task 3: Aula 3 — Precificação

**Files:**
- Create: `dados/trilha-dinheiro/aula-03.json`
- Create: `conteudo/trilha-dinheiro/aula-03-roteiro.md`
- Create: `conteudo/trilha-dinheiro/aula-03-pdf.md`

**Interfaces:**
- Produces: nenhuma dependência estrutural.

- [ ] **Step 1: Escrever o roteiro**

Salvar em `conteudo/trilha-dinheiro/aula-03-roteiro.md`:

```markdown
# Aula 3 — Precificação

**Habilidade:** precificar considerando custo + margem e também o valor percebido pelo cliente, não só a fórmula genérica.

[0:00] Você já viu curso ensinando "some seus custos, coloca uma margem,
pronto". Isso não está errado — mas sozinho, deixa dinheiro na mesa ou
te tira do jogo. Essa aula vai além.

[0:25] A base ainda importa: custo fixo — o que você paga vendendo ou
não — mais custo variável — o que muda por unidade — mais a margem que
você quer ganhar. Isso garante que você não trabalha no prejuízo.

[1:00] Mas o preço não é só matemática de custo — é também o que aquilo
vale pra quem compra. Duas pessoas fazendo o mesmo bolo podem cobrar
preços bem diferentes, e as duas venderem, porque o cliente não está
pagando só pela farinha e pelo ovo — está pagando pela experiência, pela
confiança, pela conveniência.

[1:45] Demonstração: pensando no seu produto ou serviço, pergunta "o que
meu cliente está pagando além do material — tempo economizado,
confiança, resultado, status?" e vê se o preço reflete isso.

[2:25] Um aviso: isso não é inflar preço sem critério — é entender que
preço baixo demais também passa uma mensagem sobre o que você oferece.

[2:55] Agora é sua vez: calcula seu preço pela base de custo, depois
revisa olhando pro valor percebido.
```

- [ ] **Step 2: Revisar o roteiro contra os Global Constraints**

Mesmo checklist. Diferencial aplicado: raciocínio explícito além da fórmula genérica (o pedido específico desta trilha).

- [ ] **Step 3: Escrever a atividade JSON**

Salvar em `dados/trilha-dinheiro/aula-03.json`:

```json
{
  "schema_version": 1,
  "trilha": "trilha-dinheiro",
  "aula": "aula-03",
  "titulo": "Precificação",
  "habilidade": "Precificar considerando custo + margem e também o valor percebido pelo cliente.",
  "blocos": [
    {
      "id": "b1",
      "tipo": "cenario",
      "enunciado": "Duas confeiteiras fazem o mesmo bolo, com o mesmo custo de ingrediente. Uma cobra R$ 80, a outra R$ 150, e as duas vendem regularmente pra públicos diferentes. Isso é possível porque:",
      "opcoes": [
        "Uma das duas está cobrando errado",
        "O preço não depende só do custo — depende também do que o cliente enxerga de valor (embalagem, atendimento, marca)",
        "R$ 150 é sempre exagero pra bolo"
      ],
      "correta": 1,
      "dica_erro": "Reveja o trecho de 1:00 do vídeo.",
      "explicacao_erro": "O custo garante que você não perde dinheiro — mas o valor percebido é o que explica preços diferentes pro mesmo produto.",
      "feedback_acerto": "Isso. O cliente paga pelo que enxerga de valor, não só pelo ingrediente."
    },
    {
      "id": "b2",
      "tipo": "lista_aberta",
      "enunciado": "Escreva seu custo fixo (o que você paga vendendo ou não, dividido pelo que produz no mês) e seu custo variável (o que muda por unidade vendida).",
      "quantidade_campos": 2,
      "minimo_preenchido": 1,
      "placeholders": ["custo fixo por unidade: R$ 10", "custo variável por unidade: R$ 15"]
    },
    {
      "id": "b3",
      "tipo": "lista_aberta",
      "enunciado": "Além do material, o que seu cliente está pagando de verdade (tempo economizado, confiança, resultado, experiência)? Liste pelo menos 2 coisas.",
      "quantidade_campos": 2,
      "minimo_preenchido": 1,
      "placeholders": ["não precisa se preocupar em fazer sozinho", "confiança de que vai ficar pronto no prazo"]
    },
    {
      "id": "b4",
      "tipo": "escolha_simples",
      "enunciado": "Olhando pro que você escreveu, seu preço atual reflete esse valor, ou está abaixo do que você realmente entrega?",
      "opcoes": [
        "Reflete bem",
        "Acho que está abaixo",
        "Nunca tinha pensado nisso"
      ]
    }
  ]
}
```

- [ ] **Step 4: Validar o JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('dados/trilha-dinheiro/aula-03.json','utf8')); console.log('OK')"
```
Esperado: `OK`.

- [ ] **Step 5: Escrever o PDF de apoio**

Salvar em `conteudo/trilha-dinheiro/aula-03-pdf.md`:

```markdown
# Material de apoio — Aula 3: Preço além da fórmula

**Custo fixo por unidade:** _______________________
**Custo variável por unidade:** _______________________
**Margem que eu quero:** _______________________

## O que meu cliente paga além do material

1. _______________________________________________
2. _______________________________________________

Revise seu preço com os dois olhares: cobre o custo, e reflete o valor
que você entrega.
```

- [ ] **Step 6: Revisar PDF contra os Global Constraints**

Mesmo checklist.

- [ ] **Step 7: Commit**

```bash
git add dados/trilha-dinheiro/aula-03.json conteudo/trilha-dinheiro/aula-03-roteiro.md conteudo/trilha-dinheiro/aula-03-pdf.md
git commit -m "content: aula 3 da trilha Gerir o dinheiro (roteiro, atividade, pdf)"
```

---

### Task 4: Aula 4 — Pró-labore

**Files:**
- Create: `dados/trilha-dinheiro/aula-04.json`
- Create: `conteudo/trilha-dinheiro/aula-04-roteiro.md`
- Create: `conteudo/trilha-dinheiro/aula-04-pdf.md`

**Interfaces:**
- Consumes: fluxo de caixa da Aula 2 (referenciado em texto no roteiro, sem dependência estrutural de bloco).

- [ ] **Step 1: Escrever o roteiro**

Salvar em `conteudo/trilha-dinheiro/aula-04-roteiro.md`:

```markdown
# Aula 4 — Pró-labore

**Habilidade:** definir quanto tirar do negócio pra você sem sufocar o caixa.

[0:00] Você tira dinheiro do negócio quando precisa, sem valor fixo —
mês bom, tira mais; mês ruim, tira igual, e o negócio fica sem fôlego.

[0:25] Pró-labore em uma frase: um valor fixo, ou uma regra fixa, que
você tira pra viver, definido a partir do que o negócio pode sustentar —
não do que você precisa naquele mês.

[1:00] Como calcular sem complicar: depois de separar custo fixo,
variável e o que precisa reinvestir, o que sobra é o teto do que dá pra
tirar — não o total do caixa daquele dia.

[1:40] Demonstração: olhando o fluxo de caixa da Aula 2, calcular
quanto sobrou nos últimos meses e ver se o valor que você tira bate com
isso.

[2:15] Agora é sua vez: define um valor, ou uma regra, de pró-labore
pra esse mês.
```

- [ ] **Step 2: Revisar o roteiro contra os Global Constraints**

Mesmo checklist.

- [ ] **Step 3: Escrever a atividade JSON**

Salvar em `dados/trilha-dinheiro/aula-04.json`:

```json
{
  "schema_version": 1,
  "trilha": "trilha-dinheiro",
  "aula": "aula-04",
  "titulo": "Pró-labore",
  "habilidade": "Definir quanto tirar do negócio pra você sem sufocar o caixa.",
  "blocos": [
    {
      "id": "b1",
      "tipo": "cenario",
      "enunciado": "Um dono de negócio tira R$ 2.000 num mês de venda boa e R$ 500 no mês seguinte, porque \"tira o que sobra no dia\". O negócio nunca consegue guardar reserva. O que está faltando?",
      "opcoes": [
        "Ele devia vender mais todo mês",
        "Um valor fixo de pró-labore, calculado pelo que o negócio sustenta, não pelo que sobra no dia",
        "Nada, isso é normal em negócio pequeno"
      ],
      "correta": 1,
      "dica_erro": "Reveja o trecho dos 0:25 do vídeo.",
      "explicacao_erro": "Tirar o que sobra no dia varia demais e nunca deixa o negócio guardar reserva — o pró-labore precisa ser um valor fixo, calculado pelo que o negócio sustenta.",
      "feedback_acerto": "Isso. Valor fixo, calculado pelo que sobra em média — não pelo que sobra no dia."
    },
    {
      "id": "b2",
      "tipo": "lista_aberta",
      "enunciado": "Olhando seu fluxo de caixa (Aula 2), escreva quanto sobrou, em média, nos últimos meses.",
      "quantidade_campos": 1,
      "minimo_preenchido": 1,
      "placeholders": ["sobrou em média R$ 800 por mês"]
    },
    {
      "id": "b3",
      "tipo": "lista_aberta",
      "enunciado": "Com base nisso, escreva um valor (ou regra) de pró-labore que o negócio consegue sustentar todo mês.",
      "quantidade_campos": 1,
      "minimo_preenchido": 1,
      "placeholders": ["vou tirar R$ 600 fixos todo mês"]
    },
    {
      "id": "b4",
      "tipo": "escolha_simples",
      "enunciado": "Esse valor é diferente do que você tira hoje?",
      "opcoes": [
        "Sim, é menor do que eu tiro hoje",
        "Sim, é maior — posso tirar mais",
        "É igual ao que já tiro"
      ]
    }
  ]
}
```

- [ ] **Step 4: Validar o JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('dados/trilha-dinheiro/aula-04.json','utf8')); console.log('OK')"
```
Esperado: `OK`.

- [ ] **Step 5: Escrever o PDF de apoio**

Salvar em `conteudo/trilha-dinheiro/aula-04-pdf.md`:

```markdown
# Material de apoio — Aula 4: Meu pró-labore

**Média de sobra nos últimos meses (Aula 2):** _______________________

**Meu valor (ou regra) de pró-labore:** _______________________

Esse valor é fixo — não muda porque o mês foi bom ou ruim.
```

- [ ] **Step 6: Revisar PDF contra os Global Constraints**

Mesmo checklist.

- [ ] **Step 7: Commit**

```bash
git add dados/trilha-dinheiro/aula-04.json conteudo/trilha-dinheiro/aula-04-roteiro.md conteudo/trilha-dinheiro/aula-04-pdf.md
git commit -m "content: aula 4 da trilha Gerir o dinheiro (roteiro, atividade, pdf)"
```

---

### Task 5: Aula 5 — Gastos fixos e variáveis

**Files:**
- Create: `dados/trilha-dinheiro/aula-05.json`
- Create: `conteudo/trilha-dinheiro/aula-05-roteiro.md`
- Create: `conteudo/trilha-dinheiro/aula-05-pdf.md`

**Interfaces:**
- Produces: nenhuma dependência estrutural.

- [ ] **Step 1: Escrever o roteiro**

Salvar em `conteudo/trilha-dinheiro/aula-05-roteiro.md`:

```markdown
# Aula 5 — Gastos fixos e variáveis

**Habilidade:** distinguir gasto fixo de variável e identificar o que dá pra cortar sem comprometer o negócio.

[0:00] Você sabe que gasta muito, mas não sabe exatamente onde — e corta
o que é fácil de cortar, não o que realmente pesa.

[0:25] Gasto fixo: acontece todo mês, quase no mesmo valor, você vende
ou não — aluguel, assinatura, internet. Gasto variável: muda conforme
você produz ou vende — material, comissão, frete.

[1:00] Por que separar importa: cortar gasto variável é rápido (compra
menos material se vender menos). Cortar gasto fixo geralmente exige
decisão maior (trocar de plano, negociar aluguel) — mas é ele que pesa
igual, vendendo ou não.

[1:40] Demonstração: listando os gastos do mês e marcando cada um como
fixo ou variável, depois olhando qual fixo pesa mais do que devia.

[2:15] Agora é sua vez: lista seus gastos e separa os dois tipos.
```

- [ ] **Step 2: Revisar o roteiro contra os Global Constraints**

Mesmo checklist.

- [ ] **Step 3: Escrever a atividade JSON**

Salvar em `dados/trilha-dinheiro/aula-05.json`:

```json
{
  "schema_version": 1,
  "trilha": "trilha-dinheiro",
  "aula": "aula-05",
  "titulo": "Gastos fixos e variáveis",
  "habilidade": "Distinguir gasto fixo de variável e identificar o que dá pra cortar sem comprometer o negócio.",
  "blocos": [
    {
      "id": "b1",
      "tipo": "cenario",
      "enunciado": "Um negócio corta o gasto com material (variável) achando que está economizando, mas continua pagando uma assinatura de sistema (fixo) que quase não usa. No fim do mês, o corte fez pouca diferença. Por quê?",
      "opcoes": [
        "Material nunca deveria ser cortado",
        "O gasto fixo que pesava (a assinatura) continuou do mesmo jeito, e é ele que consome o caixa todo mês, vendendo ou não",
        "Cortar gasto sempre resolve, só demora pra fazer efeito"
      ],
      "correta": 1,
      "dica_erro": "Reveja o trecho de 1:00 do vídeo.",
      "explicacao_erro": "Gasto fixo pesa igual, vendendo ou não — cortar só o variável deixa o maior peso intocado.",
      "feedback_acerto": "Isso. O fixo que não se ajusta ao movimento é o que mais merece revisão."
    },
    {
      "id": "b2",
      "tipo": "lista_aberta",
      "enunciado": "Liste de 4 a 6 gastos do seu negócio esse mês.",
      "quantidade_campos": 6,
      "minimo_preenchido": 1,
      "placeholders": ["aluguel do espaço", "material de trabalho", "assinatura de sistema"]
    },
    {
      "id": "b3",
      "tipo": "lista_aberta",
      "enunciado": "Agora escreva, pra cada gasto que você listou, se ele é fixo (acontece todo mês, quase o mesmo valor) ou variável (muda conforme você vende/produz).",
      "quantidade_campos": 1,
      "minimo_preenchido": 1,
      "placeholders": ["aluguel: fixo. material: variável."]
    },
    {
      "id": "b4",
      "tipo": "escolha_simples",
      "enunciado": "Olhando sua lista, tem algum gasto fixo que pesa mais do que deveria?",
      "opcoes": [
        "Sim, já sei qual",
        "Acho que sim, preciso olhar melhor",
        "Não, meus fixos estão enxutos"
      ]
    }
  ]
}
```

- [ ] **Step 4: Validar o JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('dados/trilha-dinheiro/aula-05.json','utf8')); console.log('OK')"
```
Esperado: `OK`.

- [ ] **Step 5: Escrever o PDF de apoio**

Salvar em `conteudo/trilha-dinheiro/aula-05-pdf.md`:

```markdown
# Material de apoio — Aula 5: Meus gastos fixos e variáveis

| Gasto | Fixo ou variável | Valor aproximado |
|---|---|---|
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |

## Gasto fixo que pesa mais do que deveria

_______________________________________________
```

- [ ] **Step 6: Revisar PDF contra os Global Constraints**

Mesmo checklist.

- [ ] **Step 7: Commit**

```bash
git add dados/trilha-dinheiro/aula-05.json conteudo/trilha-dinheiro/aula-05-roteiro.md conteudo/trilha-dinheiro/aula-05-pdf.md
git commit -m "content: aula 5 da trilha Gerir o dinheiro (roteiro, atividade, pdf)"
```

---

### Task 6: Aula 6 — Seu painel financeiro (projeto final)

**Files:**
- Create: `dados/trilha-dinheiro/aula-06.json`
- Create: `conteudo/trilha-dinheiro/aula-06-roteiro.md`
- Create: `conteudo/trilha-dinheiro/aula-06-pdf.md`

**Interfaces:**
- Consumes: conteúdo das Aulas 1-5 em texto (o roteiro referencia o percurso da trilha), sem dependência estrutural de bloco.
- Produces: artefato final da trilha (painel financeiro consolidado).

- [ ] **Step 1: Escrever o roteiro**

Salvar em `conteudo/trilha-dinheiro/aula-06-roteiro.md`:

```markdown
# Aula 6 — Seu painel financeiro

**Habilidade:** consolidar separação de contas, fluxo de caixa, precificação, pró-labore e gastos num painel mensal próprio.

[0:00] Você passou por separar as contas, fluxo de caixa, precificação,
pró-labore e gastos fixos e variáveis. Essa aula fecha tudo isso num
painel mensal só.

[0:25] Não tem conteúdo novo aqui — é organizar o que já viu: quanto
entra, quanto sai, quanto você tira, e se o preço ainda faz sentido.

[1:00] Demonstração: preenchendo o painel com os números reais que você
já levantou nas aulas anteriores.

[1:40] Esse painel não é pra guardar — é pra revisar todo mês, no mesmo
dia que você já separou pra outras obrigações do negócio.
```

- [ ] **Step 2: Revisar o roteiro contra os Global Constraints**

Mesmo checklist.

- [ ] **Step 3: Escrever a atividade JSON**

Salvar em `dados/trilha-dinheiro/aula-06.json`:

```json
{
  "schema_version": 1,
  "trilha": "trilha-dinheiro",
  "aula": "aula-06",
  "titulo": "Seu painel financeiro",
  "habilidade": "Consolidar separação de contas, fluxo de caixa, precificação, pró-labore e gastos num painel mensal próprio.",
  "blocos": [
    {
      "id": "b1",
      "tipo": "cenario",
      "enunciado": "Dois donos de negócio: um revisa os números todo mês num painel simples, o outro só \"sente\" se o mês foi bom ou ruim. Qual dos dois costuma perceber primeiro quando algo está errado?",
      "opcoes": [
        "Os dois percebem igual",
        "O que revisa o painel, porque números aparecem antes do problema virar uma crise",
        "O que sente, porque conhece o negócio de verdade"
      ],
      "correta": 1,
      "dica_erro": "Reveja o trecho dos 0:00 do vídeo.",
      "explicacao_erro": "Números escritos mostram tendência antes de virar crise — \"sentir\" só percebe quando já está ruim.",
      "feedback_acerto": "Isso. Painel revisado mostra o problema chegando, não só quando ele já chegou."
    },
    {
      "id": "b2",
      "tipo": "lista_aberta",
      "enunciado": "Escreva o total de entrada e saída médio dos últimos meses (Aula 2).",
      "quantidade_campos": 2,
      "minimo_preenchido": 1,
      "placeholders": ["entrada média: R$ 2.500", "saída média: R$ 1.700"]
    },
    {
      "id": "b3",
      "tipo": "lista_aberta",
      "enunciado": "Escreva seu valor de pró-labore definido (Aula 4).",
      "quantidade_campos": 1,
      "minimo_preenchido": 1,
      "placeholders": ["R$ 600 fixos por mês"]
    },
    {
      "id": "b4",
      "tipo": "lista_aberta",
      "enunciado": "Escreva um gasto fixo que você vai revisar esse mês (Aula 5).",
      "quantidade_campos": 1,
      "minimo_preenchido": 1,
      "placeholders": ["assinatura de sistema que quase não uso"]
    },
    {
      "id": "b5",
      "tipo": "escolha_simples",
      "enunciado": "Olhando o painel que você acabou de montar, o que mais precisa de atenção agora?",
      "opcoes": [
        "Separar as contas de vez",
        "Manter o fluxo de caixa em dia",
        "Revisar o preço",
        "Ajustar o pró-labore ou os gastos fixos"
      ]
    }
  ]
}
```

- [ ] **Step 4: Validar o JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('dados/trilha-dinheiro/aula-06.json','utf8')); console.log('OK')"
```
Esperado: `OK`.

- [ ] **Step 5: Escrever o PDF de apoio**

Salvar em `conteudo/trilha-dinheiro/aula-06-pdf.md`:

```markdown
# Material de apoio — Aula 6: Meu painel financeiro

**Entrada média (Aula 2):** _______________________
**Saída média (Aula 2):** _______________________
**Pró-labore definido (Aula 4):** _______________________
**Gasto fixo a revisar (Aula 5):** _______________________
**Preço revisado pelo valor percebido (Aula 3)?** ( ) sim ( ) preciso revisar

Revise esse painel todo mês, no mesmo dia que você já separa pra outras
obrigações do negócio.
```

- [ ] **Step 6: Revisar PDF contra os Global Constraints**

Mesmo checklist.

- [ ] **Step 7: Commit**

```bash
git add dados/trilha-dinheiro/aula-06.json conteudo/trilha-dinheiro/aula-06-roteiro.md conteudo/trilha-dinheiro/aula-06-pdf.md
git commit -m "content: aula 6 da trilha Gerir o dinheiro (roteiro, atividade, pdf) - fecha a trilha"
```

---

### Task 7: Registrar a trilha no índice do app

**Files:**
- Modify: `dados/indice.json`

**Interfaces:**
- Consumes: os `titulo` reais de `dados/trilha-dinheiro/aula-01.json` até `aula-06.json` (Tasks 1-6 já commitadas).

- [ ] **Step 1: Ler o índice atual**

```bash
cat dados/indice.json
```

Confirmar as três trilhas já existentes (`trilha-ia`, `trilha-vendas`, `trilha-formalizacao`).

- [ ] **Step 2: Adicionar a nova trilha**

Adicionar um novo objeto ao array `trilhas`, ao lado dos existentes (não remover nem alterar nenhum):

```json
{
  "id": "trilha-dinheiro",
  "titulo": "Gerir o dinheiro",
  "aulas": [
    { "id": "aula-01", "titulo": "Pra onde seu dinheiro vai", "ordem": 1, "arquivo": "dados/trilha-dinheiro/aula-01.json" },
    { "id": "aula-02", "titulo": "Fluxo de caixa simples", "ordem": 2, "arquivo": "dados/trilha-dinheiro/aula-02.json" },
    { "id": "aula-03", "titulo": "Precificação", "ordem": 3, "arquivo": "dados/trilha-dinheiro/aula-03.json" },
    { "id": "aula-04", "titulo": "Pró-labore", "ordem": 4, "arquivo": "dados/trilha-dinheiro/aula-04.json" },
    { "id": "aula-05", "titulo": "Gastos fixos e variáveis", "ordem": 5, "arquivo": "dados/trilha-dinheiro/aula-05.json" },
    { "id": "aula-06", "titulo": "Seu painel financeiro", "ordem": 6, "arquivo": "dados/trilha-dinheiro/aula-06.json" }
  ]
}
```

Antes de colar, confirmar cada `titulo` contra o campo `titulo` real dentro do respectivo `dados/trilha-dinheiro/aula-0N.json` (Tasks 1-6) — copiar exatamente, não parafrasear.

- [ ] **Step 3: Validar o JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('dados/indice.json','utf8')); console.log('OK')"
```
Esperado: `OK`. Conferir que `trilha-ia`, `trilha-vendas` e `trilha-formalizacao` continuam intactas, e que `trilha-dinheiro` tem `ordem` 1-6 sem repetição.

- [ ] **Step 4: Commit**

```bash
git add dados/indice.json
git commit -m "content: registra trilha Gerir o dinheiro no indice do app"
```

---

## Fora de escopo deste plano

- Passo a passo prático de gravação de todas as 4 trilhas.
- Upload dos vídeos no Panda Video, vínculo do `panda_video_id`, diagramação/exportação dos PDFs finais — trabalho de produção separado.
- Com essa trilha, as 4 trilhas do curso estão com conteúdo escrito completo — a decisão já tomada era só vender o curso quando as quatro estiverem prontas (CONTEXTO original); falta a parte de produção (vídeo/PDF final) pras quatro.
