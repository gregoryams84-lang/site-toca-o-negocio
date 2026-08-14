# Trilha 3 — Formalizar e manter a empresa em dia: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produzir as 6 aulas completas da trilha "Formalizar e manter a empresa em dia" — roteiro de vídeo, atividade interativa (JSON) e material de apoio em PDF — trilha tradicional, sem IA, pra público misto (informal / MEI desorganizado).

**Architecture:** Cada aula é um task autocontido que produz três arquivos de conteúdo (roteiro, atividade, PDF) no repositório `app-atividades-curso`, sob o id de trilha `trilha-formalizacao`. Nenhuma aula usa bloco `calculo` nem `depende_de` — todas as atividades são autocontidas (lição aprendida das trilhas 1/2: menos acoplamento estrutural, menos risco). Um task final registra a trilha no índice do app.

**Tech Stack:** Markdown (roteiro e PDF), JSON conforme o schema de `dados/modelo-aula.json`, Node.js para validação de JSON.

**Spec:** `docs/superpowers/specs/2026-08-14-curriculo-trilha-3-design.md`

## Global Constraints

- Nunca sugerir reconhecimento, autorização ou chancela do MEC; sempre "certificado de conclusão de curso livre".
- Nenhuma promessa de resultado financeiro ("fature", "ganhe dinheiro", "lucro garantido", "método validado", "resultados comprovados").
- Nenhuma prova social inventada.
- Evitar as palavras "solução", "jornada", "transformação", "empoderar", "descomplicar".
- Vídeo curto, direto, mobile, aluno cansado. Nenhum "vi que você...".
- Atividade sempre abre com `cenario` (situação concreta) antes de qualquer explicação/autoavaliação — lição da trilha 2: bloco de brainstorm/autoavaliação genérico como abertura é defeito, não é "situação concreta".
- Atividade pode terminar no bloco de artefato ou num `escolha_simples` de síntese logo depois, desde que reflita o que acabou de ser construído (nunca pivô de assunto).
- **Nenhum valor monetário, percentual ou limite fixo que muda ano a ano** (limite de faturamento do MEI, valor do DAS, etc.) — sempre "confira o valor atual no Portal do Empreendedor / no app MEI / na Receita Federal". Isso é específico desta trilha (conteúdo fiscal/legal fica desatualizado se cravar número).
- Tipos de bloco disponíveis: `cenario`, `lista_aberta`, `calculo`, `escolha_simples` — schema exato em `dados/modelo-aula.json`.

---

## File Structure

Repositório: `C:\Users\robot\Documents\app-atividades-curso`

- `dados/trilha-formalizacao/aula-01.json` até `aula-06.json`.
- `conteudo/trilha-formalizacao/aula-0N-roteiro.md` e `aula-0N-pdf.md`.
- `dados/indice.json` — recebe uma nova entrada de trilha, em task dedicado (Task 7).

---

### Task 1: Aula 1 — Onde você está agora

**Files:**
- Create: `dados/trilha-formalizacao/aula-01.json`
- Create: `conteudo/trilha-formalizacao/aula-01-roteiro.md`
- Create: `conteudo/trilha-formalizacao/aula-01-pdf.md`

**Interfaces:**
- Produces: nenhuma dependência estrutural.

- [ ] **Step 1: Escrever o roteiro**

Salvar em `conteudo/trilha-formalizacao/aula-01-roteiro.md`:

```markdown
# Aula 1 — Onde você está agora

**Habilidade:** diagnosticar, por três perguntas, em que estágio de formalização o próprio negócio está, pra saber o que fazer no resto da trilha.

[0:00] Você vende há meses, tem cliente fixo, mas quando alguém pergunta
"você tem CNPJ?" você trava. Ou já tem CNPJ mas não sabe se está em dia.
Essa aula não resolve isso — ela te diz exatamente em que pé você está,
pra saber o que fazer nas próximas cinco aulas.

[0:25] Três perguntas de diagnóstico: Você tem CNPJ aberto? Se sim, é
MEI ou outro tipo? Você sabe se está com alguma obrigação atrasada — DAS,
declaração?

[1:00] Três situações possíveis e o que cada uma significa: sem CNPJ —
as próximas duas aulas são pra você começar. MEI aberto e em dia — o
foco pra você é manter. MEI aberto mas atrasado — resolver o atraso vem
antes de qualquer coisa nova.

[1:45] Por que isso importa antes de qualquer coisa: abrir errado, ou
deixar atrasado sem perceber, custa mais caro depois — multa, perda de
benefício, confusão.

[2:15] Agora é sua vez: responde as três perguntas na atividade, e a
trilha se ajusta ao seu ponto de partida.
```

- [ ] **Step 2: Revisar o roteiro contra os Global Constraints**

Checklist: nenhuma palavra proibida; nenhum valor fiscal fixo; nenhuma promessa financeira; nenhum "vi que você...".

- [ ] **Step 3: Escrever a atividade JSON**

Salvar em `dados/trilha-formalizacao/aula-01.json`:

```json
{
  "schema_version": 1,
  "trilha": "trilha-formalizacao",
  "aula": "aula-01",
  "titulo": "Onde você está agora",
  "habilidade": "Diagnosticar, por três perguntas, em que estágio de formalização o negócio está.",
  "blocos": [
    {
      "id": "b1",
      "tipo": "cenario",
      "enunciado": "Uma cabeleireira vende serviço há 8 meses, tem clientes fixos, mas nunca abriu CNPJ porque \"não sabia por onde começar\". Ela está:",
      "opcoes": [
        "Regular, atendimento não precisa de CNPJ",
        "Informal — vale a pena avaliar abrir o CNPJ certo pro que ela faz",
        "Só precisa abrir CNPJ se contratar funcionário"
      ],
      "correta": 1,
      "dica_erro": "Reveja o trecho dos 0:25 do vídeo.",
      "explicacao_erro": "Prestar serviço de forma recorrente sem CNPJ é informalidade — vale avaliar abrir o CNPJ certo pra atividade.",
      "feedback_acerto": "Isso. Cliente fixo e recorrência são sinal de que vale formalizar."
    },
    {
      "id": "b2",
      "tipo": "escolha_simples",
      "enunciado": "Você tem CNPJ aberto hoje?",
      "opcoes": [
        "Sim, sei que tipo",
        "Sim, mas não sei que tipo/regime",
        "Não tenho ainda"
      ]
    },
    {
      "id": "b3",
      "tipo": "escolha_simples",
      "enunciado": "Se tem CNPJ, você sabe se está com alguma obrigação atrasada (guia não paga, declaração não feita)?",
      "opcoes": [
        "Sei que está tudo em dia",
        "Acho que tem algo atrasado",
        "Não sei",
        "Não tenho CNPJ ainda"
      ]
    },
    {
      "id": "b4",
      "tipo": "lista_aberta",
      "enunciado": "Com base nas respostas acima, escreva em uma frase qual é o seu próximo passo nessa trilha (abrir CNPJ, resolver atraso, ou organizar o que já tem).",
      "quantidade_campos": 1,
      "minimo_preenchido": 1,
      "placeholders": ["preciso abrir o CNPJ certo pro meu negócio"]
    }
  ]
}
```

- [ ] **Step 4: Validar o JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('dados/trilha-formalizacao/aula-01.json','utf8')); console.log('OK')"
```
Esperado: `OK`.

- [ ] **Step 5: Escrever o PDF de apoio**

Salvar em `conteudo/trilha-formalizacao/aula-01-pdf.md`:

```markdown
# Material de apoio — Aula 1: As três perguntas de diagnóstico

1. Você tem CNPJ aberto? _______________________
2. Se sim, qual tipo (MEI, ME, não sei)? _______________________
3. Tem alguma obrigação atrasada? _______________________

## Meu próximo passo nessa trilha

_______________________________________________
```

- [ ] **Step 6: Revisar PDF contra os Global Constraints**

Mesmo checklist.

- [ ] **Step 7: Commit**

```bash
git add dados/trilha-formalizacao/aula-01.json conteudo/trilha-formalizacao/aula-01-roteiro.md conteudo/trilha-formalizacao/aula-01-pdf.md
git commit -m "content: aula 1 da trilha Formalizar e manter a empresa em dia (roteiro, atividade, pdf)"
```

---

### Task 2: Aula 2 — Abrindo o CNPJ certo pro seu momento (MEI vs ME + CNAE)

**Files:**
- Create: `dados/trilha-formalizacao/aula-02.json`
- Create: `conteudo/trilha-formalizacao/aula-02-roteiro.md`
- Create: `conteudo/trilha-formalizacao/aula-02-pdf.md`

**Interfaces:**
- Produces: nenhuma dependência estrutural.

- [ ] **Step 1: Escrever o roteiro**

Salvar em `conteudo/trilha-formalizacao/aula-02-roteiro.md`:

```markdown
# Aula 2 — Abrindo o CNPJ certo pro seu momento

**Habilidade:** escolher entre MEI e ME conforme o próprio negócio, e escolher o CNAE certo (não genérico) pra essa atividade.

[0:00] Abrir CNPJ errado é comum — e sai caro de corrigir depois. Essa
aula não é sobre preencher formulário, é sobre entender duas escolhas
que definem tudo: o tipo de empresa e o CNAE.

[0:25] MEI vs ME em uma frase cada: MEI é pra quem trabalha sozinho (ou
com no máximo um funcionário), dentro do limite anual de faturamento —
o limite muda, confira sempre no Portal do Empreendedor. ME é pra quem
já fatura mais ou tem sócio.

[1:00] O que é CNAE: é o código que diz, pro governo, o que seu negócio
faz. Cada CNAE tem regras próprias — alguns não podem ser MEI, mesmo
dentro do limite de faturamento.

[1:40] Erro comum: escolher um CNAE genérico "pra garantir" e descobrir
depois que ele não cobre o que você realmente faz, ou que ele bloqueia
o MEI. Você pode ter mais de um CNAE — um principal, outros secundários.

[2:20] Demonstração: no Portal do Empreendedor, buscar pela atividade
real do negócio, não pelo nome bonito, antes de fechar a abertura.

[2:50] Agora é sua vez: descobre o CNAE certo pra sua atividade antes de
abrir — ou confere se o que você já tem está certo.
```

- [ ] **Step 2: Revisar o roteiro contra os Global Constraints**

Mesmo checklist. Atenção especial: nenhum valor de limite do MEI cravado.

- [ ] **Step 3: Escrever a atividade JSON**

Salvar em `dados/trilha-formalizacao/aula-02.json`:

```json
{
  "schema_version": 1,
  "trilha": "trilha-formalizacao",
  "aula": "aula-02",
  "titulo": "Abrindo o CNPJ certo pro seu momento",
  "habilidade": "Escolher entre MEI e ME conforme o negócio, e escolher o CNAE certo pra atividade real.",
  "blocos": [
    {
      "id": "b1",
      "tipo": "cenario",
      "enunciado": "Um dono de doceria caseira abre o CNPJ como MEI e escolhe o CNAE genérico de \"comércio varejista\", achando que serve pra qualquer coisa. Meses depois descobre que esse CNAE não cobre fabricação de alimentos. O que ele deveria ter feito?",
      "opcoes": [
        "Nada, CNAE genérico sempre serve",
        "Pesquisado o CNAE específico da atividade de fabricação de alimentos antes de abrir",
        "Trocado pra ME direto, sem mexer no CNAE"
      ],
      "correta": 1,
      "dica_erro": "Reveja o trecho dos 1:00 do vídeo.",
      "explicacao_erro": "CNAE genérico pode não cobrir a atividade real — o certo é pesquisar o CNAE específico antes de abrir.",
      "feedback_acerto": "Isso. O CNAE precisa bater com o que o negócio realmente faz."
    },
    {
      "id": "b2",
      "tipo": "escolha_simples",
      "enunciado": "Pensando no seu negócio (ou o que você pretende abrir), ele se encaixa melhor em:",
      "opcoes": [
        "MEI — trabalho sozinho ou com no máximo 1 funcionário",
        "ME — já fatura mais ou tenho sócio",
        "Não sei ainda, preciso pesquisar"
      ]
    },
    {
      "id": "b3",
      "tipo": "lista_aberta",
      "enunciado": "Escreva, com suas palavras, o que seu negócio faz de verdade no dia a dia (isso ajuda a achar o CNAE certo depois).",
      "quantidade_campos": 1,
      "minimo_preenchido": 1,
      "placeholders": ["faço doces sob encomenda e vendo pronto também"]
    },
    {
      "id": "b4",
      "tipo": "escolha_simples",
      "enunciado": "Você já conferiu (ou vai conferir) se o CNAE do seu CNPJ bate com o que você escreveu acima?",
      "opcoes": [
        "Já conferi, está certo",
        "Vou conferir depois dessa aula",
        "Ainda não tenho CNPJ, vou escolher com cuidado"
      ]
    }
  ]
}
```

- [ ] **Step 4: Validar o JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('dados/trilha-formalizacao/aula-02.json','utf8')); console.log('OK')"
```
Esperado: `OK`.

- [ ] **Step 5: Escrever o PDF de apoio**

Salvar em `conteudo/trilha-formalizacao/aula-02-pdf.md`:

```markdown
# Material de apoio — Aula 2: MEI ou ME, e o CNAE certo

| | MEI | ME |
|---|---|---|
| Sozinho ou até 1 funcionário | Sim | Pode ter mais |
| Dentro do limite anual (confira o valor atual) | Sim | Acima do limite do MEI |

## O que meu negócio faz de verdade

_______________________________________________

Confira o CNAE certo pra essa atividade no Portal do Empreendedor antes
de abrir (ou confirme se o seu já bate).
```

- [ ] **Step 6: Revisar PDF contra os Global Constraints**

Mesmo checklist.

- [ ] **Step 7: Commit**

```bash
git add dados/trilha-formalizacao/aula-02.json conteudo/trilha-formalizacao/aula-02-roteiro.md conteudo/trilha-formalizacao/aula-02-pdf.md
git commit -m "content: aula 2 da trilha Formalizar e manter a empresa em dia (roteiro, atividade, pdf)"
```

---

### Task 3: Aula 3 — As obrigações que se repetem

**Files:**
- Create: `dados/trilha-formalizacao/aula-03.json`
- Create: `conteudo/trilha-formalizacao/aula-03-roteiro.md`
- Create: `conteudo/trilha-formalizacao/aula-03-pdf.md`

**Interfaces:**
- Produces: nenhuma dependência estrutural.

- [ ] **Step 1: Escrever o roteiro**

Salvar em `conteudo/trilha-formalizacao/aula-03-roteiro.md`:

```markdown
# Aula 3 — As obrigações que se repetem

**Habilidade:** reconhecer as obrigações recorrentes do MEI (DAS mensal, declaração anual) e montar o próprio lembrete.

[0:00] Quem atrasa o DAS não é só quem esquece — é quem nunca teve o
calendário na cabeça. Essa aula resolve isso.

[0:25] Duas obrigações que se repetem sempre: o DAS — o boleto mensal,
com vencimento todo mês (confira a data e o valor exatos no app MEI ou
no Portal do Empreendedor, porque isso muda). E a declaração anual, o
DASN-SIMEI — uma vez por ano, resume o que você faturou.

[1:10] O que acontece se atrasa: juro, multa, e em casos mais sérios
pode perder o enquadramento como MEI — vale muito mais resolver rápido
do que deixar acumular.

[1:50] Demonstração: gerando o boleto do mês (app MEI ou Portal do
Empreendedor) e marcando a data no calendário do celular com lembrete
recorrente.

[2:25] Agora é sua vez: monta o lembrete recorrente das duas obrigações
no seu celular.
```

- [ ] **Step 2: Revisar o roteiro contra os Global Constraints**

Mesmo checklist. Atenção: nenhum valor de DAS cravado.

- [ ] **Step 3: Escrever a atividade JSON**

Salvar em `dados/trilha-formalizacao/aula-03.json`:

```json
{
  "schema_version": 1,
  "trilha": "trilha-formalizacao",
  "aula": "aula-03",
  "titulo": "As obrigações que se repetem",
  "habilidade": "Reconhecer as obrigações recorrentes do MEI (DAS mensal, declaração anual) e montar o próprio lembrete.",
  "blocos": [
    {
      "id": "b1",
      "tipo": "cenario",
      "enunciado": "Um dono de negócio deixa de pagar o DAS por 3 meses porque \"ninguém avisou\". Sobre o DAS, isso significa que:",
      "opcoes": [
        "O boleto chega automaticamente pelo correio todo mês, só esperar",
        "É preciso gerar/consultar o boleto ativamente (app MEI ou Portal do Empreendedor) todo mês, ninguém avisa sozinho",
        "Só precisa pagar se faturar acima de um certo valor no mês"
      ],
      "correta": 1,
      "dica_erro": "Reveja o trecho dos 0:25 do vídeo.",
      "explicacao_erro": "O DAS não chega sozinho — é preciso consultar/gerar ativamente todo mês.",
      "feedback_acerto": "Isso. Ninguém avisa — o hábito de conferir é seu."
    },
    {
      "id": "b2",
      "tipo": "lista_aberta",
      "enunciado": "Escreva o dia do mês que você vai reservar pra conferir/pagar o DAS (pode ser o mesmo dia de outra conta fixa, pra não esquecer).",
      "quantidade_campos": 1,
      "minimo_preenchido": 1,
      "placeholders": ["todo dia 10, junto com o aluguel"]
    },
    {
      "id": "b3",
      "tipo": "escolha_simples",
      "enunciado": "Você sabe, hoje, se está com alguma declaração ou guia atrasada?",
      "opcoes": [
        "Não, está tudo em dia",
        "Acho que sim, preciso confirmar",
        "Não sei verificar"
      ]
    },
    {
      "id": "b4",
      "tipo": "escolha_simples",
      "enunciado": "Você vai configurar um lembrete no celular pra essas duas obrigações essa semana?",
      "opcoes": [
        "Sim, faço agora",
        "Vou fazer depois",
        "Já tenho lembrete configurado"
      ]
    }
  ]
}
```

- [ ] **Step 4: Validar o JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('dados/trilha-formalizacao/aula-03.json','utf8')); console.log('OK')"
```
Esperado: `OK`.

- [ ] **Step 5: Escrever o PDF de apoio**

Salvar em `conteudo/trilha-formalizacao/aula-03-pdf.md`:

```markdown
# Material de apoio — Aula 3: Minhas obrigações recorrentes

**DAS** — dia do mês pra conferir/pagar: _______________________
Onde conferir: app MEI ou Portal do Empreendedor.

**Declaração anual (DASN-SIMEI)** — mês pra fazer: _______________________

Configure um lembrete recorrente no celular pras duas datas acima.
```

- [ ] **Step 6: Revisar PDF contra os Global Constraints**

Mesmo checklist.

- [ ] **Step 7: Commit**

```bash
git add dados/trilha-formalizacao/aula-03.json conteudo/trilha-formalizacao/aula-03-roteiro.md conteudo/trilha-formalizacao/aula-03-pdf.md
git commit -m "content: aula 3 da trilha Formalizar e manter a empresa em dia (roteiro, atividade, pdf)"
```

---

### Task 4: Aula 4 — Organizando os documentos

**Files:**
- Create: `dados/trilha-formalizacao/aula-04.json`
- Create: `conteudo/trilha-formalizacao/aula-04-roteiro.md`
- Create: `conteudo/trilha-formalizacao/aula-04-pdf.md`

**Interfaces:**
- Produces: nenhuma dependência estrutural.

- [ ] **Step 1: Escrever o roteiro**

Salvar em `conteudo/trilha-formalizacao/aula-04-roteiro.md`:

```markdown
# Aula 4 — Organizando os documentos

**Habilidade:** saber quais documentos guardar (nota fiscal, comprovante) e montar um sistema simples de organização.

[0:00] Um cliente pede nota fiscal e você trava, ou o contador pede um
comprovante de dois anos atrás e você não acha. Essa aula é pra nunca
mais passar por isso.

[0:25] Três tipos de documento que todo negócio formal lida com: nota
fiscal emitida — o que você vendeu. Comprovante de despesa — o que você
gastou pro negócio. E comprovante das obrigações pagas — DAS pago,
declaração enviada.

[1:00] Por quanto tempo guardar: como regra prática, guarde por pelo
menos 5 anos — o prazo pode variar conforme o caso, confirme com um
contador se tiver dúvida específica.

[1:35] Demonstração: um sistema simples — uma pasta (física ou digital)
por ano, com subpastas por tipo. Não precisa ser bonito, precisa estar
sempre no mesmo lugar.

[2:10] Agora é sua vez: cria a pasta desse ano e guarda o último
comprovante que você tem à mão.
```

- [ ] **Step 2: Revisar o roteiro contra os Global Constraints**

Mesmo checklist.

- [ ] **Step 3: Escrever a atividade JSON**

Salvar em `dados/trilha-formalizacao/aula-04.json`:

```json
{
  "schema_version": 1,
  "trilha": "trilha-formalizacao",
  "aula": "aula-04",
  "titulo": "Organizando os documentos",
  "habilidade": "Saber quais documentos guardar e montar um sistema simples de organização.",
  "blocos": [
    {
      "id": "b1",
      "tipo": "cenario",
      "enunciado": "Uma cliente pede nota fiscal de um serviço que pagou há 3 meses, e o prestador não emitiu na hora e não guardou o comprovante do pagamento. O que ele perde com isso?",
      "opcoes": [
        "Nada, nota fiscal é só formalidade",
        "Perde a chance de comprovar a venda pra declaração e fica sem prova em caso de problema com a cliente",
        "Só perde se a cliente reclamar"
      ],
      "correta": 1,
      "dica_erro": "Reveja o trecho dos 0:00 do vídeo.",
      "explicacao_erro": "Sem nota e sem comprovante, falta prova da venda pra declaração e pra qualquer imprevisto com o cliente.",
      "feedback_acerto": "Isso. Documento é prova, não formalidade vazia."
    },
    {
      "id": "b2",
      "tipo": "escolha_simples",
      "enunciado": "Hoje, seus comprovantes (nota, pagamento de DAS, despesas) estão:",
      "opcoes": [
        "Organizados num lugar só",
        "Espalhados, mas eu acho quando preciso",
        "Eu realmente não sei onde estão a maioria"
      ]
    },
    {
      "id": "b3",
      "tipo": "lista_aberta",
      "enunciado": "Liste os 3 tipos de documento que você mais precisa guardar no seu negócio.",
      "quantidade_campos": 3,
      "minimo_preenchido": 1,
      "placeholders": ["nota fiscal de venda", "comprovante de pagamento do DAS", "recibo de compra de material"]
    },
    {
      "id": "b4",
      "tipo": "escolha_simples",
      "enunciado": "Você vai criar a pasta (física ou digital) desse ano essa semana?",
      "opcoes": [
        "Sim, crio agora",
        "Vou criar depois",
        "Já tenho, só vou organizar melhor"
      ]
    }
  ]
}
```

- [ ] **Step 4: Validar o JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('dados/trilha-formalizacao/aula-04.json','utf8')); console.log('OK')"
```
Esperado: `OK`.

- [ ] **Step 5: Escrever o PDF de apoio**

Salvar em `conteudo/trilha-formalizacao/aula-04-pdf.md`:

```markdown
# Material de apoio — Aula 4: Meu sistema de pasta

**Estrutura sugerida:** uma pasta por ano, com subpastas:
- Notas fiscais emitidas
- Comprovantes de despesa
- Comprovantes de obrigações pagas (DAS, declaração)

## Meus 3 tipos de documento mais importantes

1. _______________________________________________
2. _______________________________________________
3. _______________________________________________
```

- [ ] **Step 6: Revisar PDF contra os Global Constraints**

Mesmo checklist.

- [ ] **Step 7: Commit**

```bash
git add dados/trilha-formalizacao/aula-04.json conteudo/trilha-formalizacao/aula-04-roteiro.md conteudo/trilha-formalizacao/aula-04-pdf.md
git commit -m "content: aula 4 da trilha Formalizar e manter a empresa em dia (roteiro, atividade, pdf)"
```

---

### Task 5: Aula 5 — Quando a empresa cresce

**Files:**
- Create: `dados/trilha-formalizacao/aula-05.json`
- Create: `conteudo/trilha-formalizacao/aula-05-roteiro.md`
- Create: `conteudo/trilha-formalizacao/aula-05-pdf.md`

**Interfaces:**
- Produces: nenhuma dependência estrutural.

- [ ] **Step 1: Escrever o roteiro**

Salvar em `conteudo/trilha-formalizacao/aula-05-roteiro.md`:

```markdown
# Aula 5 — Quando a empresa cresce

**Habilidade:** reconhecer os sinais de que é hora de sair do MEI e entender, em linhas gerais, o que muda.

[0:00] Ficar MEI pra sempre nem sempre é a melhor escolha — e não
perceber a hora de sair custa caro em imposto e risco.

[0:25] Três sinais de que vale reavaliar: faturamento perto (ou
passando) do limite anual do MEI — confira o valor atual, ele muda. Você
precisa contratar mais de um funcionário. Ou sua atividade real mudou
pra algo que o CNAE de MEI não cobre mais.

[1:10] O que muda ao sair do MEI: passa a precisar de contador —
obrigatório —, a forma de calcular imposto muda, e as obrigações ficam
mais frequentes. Não é motivo pra medo, é motivo pra se planejar com
antecedência.

[1:50] Demonstração: como acompanhar o próprio faturamento acumulado do
ano (no app MEI ou numa planilha simples) pra não ser pego de surpresa
perto do limite.

[2:25] Agora é sua vez: confere onde você está em relação a esses três
sinais.
```

- [ ] **Step 2: Revisar o roteiro contra os Global Constraints**

Mesmo checklist. Atenção: nenhum valor de limite cravado.

- [ ] **Step 3: Escrever a atividade JSON**

Salvar em `dados/trilha-formalizacao/aula-05.json`:

```json
{
  "schema_version": 1,
  "trilha": "trilha-formalizacao",
  "aula": "aula-05",
  "titulo": "Quando a empresa cresce",
  "habilidade": "Reconhecer os sinais de que é hora de sair do MEI e entender o que muda.",
  "blocos": [
    {
      "id": "b1",
      "tipo": "cenario",
      "enunciado": "Um dono de negócio MEI percebe, em outubro, que já faturou quase o limite do ano — mas só vai conferir de novo em dezembro. Se ele passar do limite sem perceber, o que pode acontecer?",
      "opcoes": [
        "Nada, é só um número de referência",
        "Pode ser desenquadrado do MEI e ter que se regularizar como ME, às vezes com efeito retroativo",
        "O governo avisa automaticamente e resolve sozinho"
      ],
      "correta": 1,
      "dica_erro": "Reveja o trecho de 0:25 do vídeo.",
      "explicacao_erro": "Passar do limite sem perceber pode gerar desenquadramento do MEI, com regularização exigida depois.",
      "feedback_acerto": "Isso. Vale acompanhar antes de ser surpreendido perto do fim do ano."
    },
    {
      "id": "b2",
      "tipo": "lista_aberta",
      "enunciado": "Escreva como você vai acompanhar seu faturamento acumulado esse ano (app, planilha, outro jeito).",
      "quantidade_campos": 1,
      "minimo_preenchido": 1,
      "placeholders": ["vou anotar toda venda numa planilha simples"]
    },
    {
      "id": "b3",
      "tipo": "escolha_simples",
      "enunciado": "Hoje, qual desses sinais está mais perto de acontecer com você?",
      "opcoes": [
        "Faturamento chegando perto do limite",
        "Preciso contratar mais gente",
        "Minha atividade mudou",
        "Nenhum, ainda estou longe disso"
      ]
    },
    {
      "id": "b4",
      "tipo": "escolha_simples",
      "enunciado": "Se algum desses sinais aparecer, você já sabe que vai precisar de um contador pra te ajudar na troca?",
      "opcoes": [
        "Sim, já sei disso",
        "Não sabia, bom saber agora",
        "Já tenho contador"
      ]
    }
  ]
}
```

- [ ] **Step 4: Validar o JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('dados/trilha-formalizacao/aula-05.json','utf8')); console.log('OK')"
```
Esperado: `OK`.

- [ ] **Step 5: Escrever o PDF de apoio**

Salvar em `conteudo/trilha-formalizacao/aula-05-pdf.md`:

```markdown
# Material de apoio — Aula 5: Os três sinais de crescimento

- [ ] Faturamento chegando perto do limite anual do MEI (confira o valor atual)
- [ ] Preciso de mais de 1 funcionário
- [ ] Minha atividade real mudou

## Como vou acompanhar meu faturamento esse ano

_______________________________________________
```

- [ ] **Step 6: Revisar PDF contra os Global Constraints**

Mesmo checklist.

- [ ] **Step 7: Commit**

```bash
git add dados/trilha-formalizacao/aula-05.json conteudo/trilha-formalizacao/aula-05-roteiro.md conteudo/trilha-formalizacao/aula-05-pdf.md
git commit -m "content: aula 5 da trilha Formalizar e manter a empresa em dia (roteiro, atividade, pdf)"
```

---

### Task 6: Aula 6 — Seu checklist de "em dia" (projeto final)

**Files:**
- Create: `dados/trilha-formalizacao/aula-06.json`
- Create: `conteudo/trilha-formalizacao/aula-06-roteiro.md`
- Create: `conteudo/trilha-formalizacao/aula-06-pdf.md`

**Interfaces:**
- Consumes: conteúdo das Aulas 1-5 em texto (o roteiro referencia o percurso da trilha), sem dependência estrutural de bloco.
- Produces: artefato final da trilha (checklist consolidado).

- [ ] **Step 1: Escrever o roteiro**

Salvar em `conteudo/trilha-formalizacao/aula-06-roteiro.md`:

```markdown
# Aula 6 — Seu checklist de "em dia"

**Habilidade:** consolidar diagnóstico, obrigações recorrentes, documentos e sinais de crescimento num checklist próprio.

[0:00] Você passou por diagnóstico, abertura de CNPJ e CNAE, obrigações
recorrentes, documentos e sinais de crescimento. Essa aula fecha tudo
isso num checklist só, que você usa de verdade.

[0:25] Não tem conteúdo novo aqui — é você organizando o que já viu:
quando pagar o DAS, quando declarar, onde estão os documentos, e quando
revisar se ainda faz sentido continuar MEI.

[1:00] Demonstração: preenchendo o checklist com as próprias datas e
lugares — não genérico, com o que é seu.

[1:40] Isso fecha a trilha inteira: o checklist não é pra guardar — é
pra colar em algum lugar visível (celular, parede) e seguir todo mês.
```

- [ ] **Step 2: Revisar o roteiro contra os Global Constraints**

Mesmo checklist.

- [ ] **Step 3: Escrever a atividade JSON**

Salvar em `dados/trilha-formalizacao/aula-06.json`:

```json
{
  "schema_version": 1,
  "trilha": "trilha-formalizacao",
  "aula": "aula-06",
  "titulo": "Seu checklist de em dia",
  "habilidade": "Consolidar diagnóstico, obrigações recorrentes, documentos e sinais de crescimento num checklist próprio.",
  "blocos": [
    {
      "id": "b1",
      "tipo": "cenario",
      "enunciado": "Dois donos de negócio MEI: um guarda as informações de obrigação e documento espalhadas na cabeça, o outro tem um checklist escrito com datas. Qual dos dois costuma errar menos prazo?",
      "opcoes": [
        "Os dois erram igual, checklist não muda nada",
        "O que tem checklist escrito, porque não depende só da memória",
        "O que guarda na cabeça, porque presta mais atenção"
      ],
      "correta": 1,
      "dica_erro": "Reveja o trecho dos 0:00 do vídeo.",
      "explicacao_erro": "Checklist escrito tira a dependência da memória — é a mesma lógica de qualquer lembrete recorrente.",
      "feedback_acerto": "Isso. Escrito não esquece."
    },
    {
      "id": "b2",
      "tipo": "lista_aberta",
      "enunciado": "Escreva a data (dia do mês) que você vai pagar o DAS.",
      "quantidade_campos": 1,
      "minimo_preenchido": 1,
      "placeholders": ["todo dia 10"]
    },
    {
      "id": "b3",
      "tipo": "lista_aberta",
      "enunciado": "Escreva o mês que você vai fazer a declaração anual (DASN-SIMEI).",
      "quantidade_campos": 1,
      "minimo_preenchido": 1,
      "placeholders": ["maio"]
    },
    {
      "id": "b4",
      "tipo": "lista_aberta",
      "enunciado": "Escreva onde ficam guardados seus documentos (pasta física, pasta digital, outro lugar).",
      "quantidade_campos": 1,
      "minimo_preenchido": 1,
      "placeholders": ["pasta no Google Drive, uma por ano"]
    },
    {
      "id": "b5",
      "tipo": "escolha_simples",
      "enunciado": "Depois dessa trilha, você se sente mais seguro sobre a formalização do seu negócio?",
      "opcoes": [
        "Sim, já sei o que fazer",
        "Preciso rever alguma aula",
        "Ainda tenho dúvida específica, vou procurar um contador"
      ]
    }
  ]
}
```

- [ ] **Step 4: Validar o JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('dados/trilha-formalizacao/aula-06.json','utf8')); console.log('OK')"
```
Esperado: `OK`.

- [ ] **Step 5: Escrever o PDF de apoio**

Salvar em `conteudo/trilha-formalizacao/aula-06-pdf.md`:

```markdown
# Material de apoio — Aula 6: Meu checklist de em dia

**DAS** — dia do mês: _______________________

**Declaração anual (DASN-SIMEI)** — mês: _______________________

**Documentos guardados em:** _______________________

**Vou revisar os sinais de crescimento (Aula 5) a cada:** _______________________

Cole esse checklist em algum lugar visível e siga todo mês.
```

- [ ] **Step 6: Revisar PDF contra os Global Constraints**

Mesmo checklist.

- [ ] **Step 7: Commit**

```bash
git add dados/trilha-formalizacao/aula-06.json conteudo/trilha-formalizacao/aula-06-roteiro.md conteudo/trilha-formalizacao/aula-06-pdf.md
git commit -m "content: aula 6 da trilha Formalizar e manter a empresa em dia (roteiro, atividade, pdf) - fecha a trilha"
```

---

### Task 7: Registrar a trilha no índice do app

**Files:**
- Modify: `dados/indice.json`

**Interfaces:**
- Consumes: os `titulo` reais de `dados/trilha-formalizacao/aula-01.json` até `aula-06.json` (Tasks 1-6 já commitadas).

- [ ] **Step 1: Ler o índice atual**

```bash
cat dados/indice.json
```

Confirmar as duas trilhas já existentes (`trilha-ia`, `trilha-vendas`).

- [ ] **Step 2: Adicionar a nova trilha**

Adicionar um novo objeto ao array `trilhas`, ao lado dos existentes (não remover nem alterar nenhum):

```json
{
  "id": "trilha-formalizacao",
  "titulo": "Formalizar e manter a empresa em dia",
  "aulas": [
    { "id": "aula-01", "titulo": "Onde você está agora", "ordem": 1, "arquivo": "dados/trilha-formalizacao/aula-01.json" },
    { "id": "aula-02", "titulo": "Abrindo o CNPJ certo pro seu momento", "ordem": 2, "arquivo": "dados/trilha-formalizacao/aula-02.json" },
    { "id": "aula-03", "titulo": "As obrigações que se repetem", "ordem": 3, "arquivo": "dados/trilha-formalizacao/aula-03.json" },
    { "id": "aula-04", "titulo": "Organizando os documentos", "ordem": 4, "arquivo": "dados/trilha-formalizacao/aula-04.json" },
    { "id": "aula-05", "titulo": "Quando a empresa cresce", "ordem": 5, "arquivo": "dados/trilha-formalizacao/aula-05.json" },
    { "id": "aula-06", "titulo": "Seu checklist de em dia", "ordem": 6, "arquivo": "dados/trilha-formalizacao/aula-06.json" }
  ]
}
```

Antes de colar, confirmar cada `titulo` contra o campo `titulo` real dentro do respectivo `dados/trilha-formalizacao/aula-0N.json` (Tasks 1-6) — copiar exatamente, não parafrasear.

- [ ] **Step 3: Validar o JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('dados/indice.json','utf8')); console.log('OK')"
```
Esperado: `OK`. Conferir que `trilha-ia` e `trilha-vendas` continuam intactas, e que `trilha-formalizacao` tem `ordem` 1-6 sem repetição.

- [ ] **Step 4: Commit**

```bash
git add dados/indice.json
git commit -m "content: registra trilha Formalizar e manter a empresa em dia no indice do app"
```

---

## Fora de escopo deste plano

- Trilha 4 (Gerir o dinheiro) — spec e plano próprios, ainda não brainstormados.
- Passo a passo prático de gravação.
- Upload dos vídeos no Panda Video, vínculo do `panda_video_id`, diagramação/exportação dos PDFs finais.
- Revisão factual por um contador/profissional antes de publicar — o conteúdo evita valores fixos, mas o mecanismo geral (MEI, DAS, DASN-SIMEI, CNAE) merece uma checagem humana antes de ir ao ar, já que é conteúdo legal/fiscal.
