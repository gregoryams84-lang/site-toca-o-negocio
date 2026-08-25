# Manhã de Fé — Documento Oficial do Projeto

> **Este é o documento de referência do projeto.** Toda decisão registrada aqui foi
> tomada e aprovada pelo dono do projeto (Gregory) em conversa de planejamento.
> Qualquer mudança futura deve atualizar este arquivo.
>
> Status: **desenho completo aprovado** ("aprovo") — próximo passo é o plano de
> implementação passo a passo e o início da Fase 0.

---

## 1. O que é o app

**Manhã de Fé** é um aplicativo devocional católico diário para brasileiros com
mais de 40 anos — com foco especial em idosos — de todas as classes econômicas.

O fluxo central: todo dia chega uma **notificação com a mensagem do dia**. A
pessoa toca na notificação, abre o **Cartão do Dia** e o texto é **narrado
automaticamente** em voz de estúdio. Abaixo, uma **imagem cristã** (arte sacra) e
um botão de **play com 30 segundos de música católica**.

O nome é o convite ao hábito: *"Você já viu sua Manhã de Fé hoje?"*

### Regras duras do projeto (não se negociam)

1. **Leve.** Roda em qualquer celular antigo/fraco, de qualquer marca (Android
   7.0+, inclusive Android Go, 1 GB de RAM). Tamanho e velocidade são requisito,
   não detalhe.
2. **Offline primeiro.** O app não depende de internet para funcionar.
3. **Desenhado para idoso.** Botões grandes, zero gestos escondidos, nada de
   cara de app genérico.
4. **Qualidade encantadora.** Direção de arte própria, imagens feitas para o
   app, tipografia bonita, animações suaves — e ainda assim leve (WebP, AAC,
   sem biblioteca pesada). Beleza e leveza não brigam se fizermos certo.

---

## 2. Modelo de negócio

- **Assinatura: R$ 9,90/ano, tudo liberado.** Um preço só. Sem versão grátis
  limitada (confundiria o idoso), sem escolha de planos, sem letra miúda.
- **Paywall logo na primeira abertura.** O app é gratuito para baixar; a
  assinatura é liberada dentro dele. *(Ressalva registrada na conversa: app 100%
  pago desde o primeiro segundo costuma ter pouquíssima instalação e o público
  idoso desiste na tela de pagamento — decisão do dono, seguimos com ela e
  compensamos no design da tela de assinatura.)*
- **Tela de assinatura desenhada para idoso:**

  > **R$ 9,90 pelo ano inteiro**
  > Menos de 3 centavos por dia.
  > `[ ASSINAR ]`
  > `[ Já paguei — recuperar minha assinatura ]`

  O botão "Já paguei" é grande e visível: idoso troca de celular e, sem isso,
  acha que foi roubado e dá 1 estrela.
- **Lançamento: Android e iPhone juntos.** Dono usa Windows → o app iOS será
  gerado por compilação em nuvem (sem Mac). Custos de loja: Google US$ 25 (uma
  vez), Apple US$ 99/ano.
- **Motor de crescimento: o botão ENVIAR.** Gera uma imagem bonita (versículo
  sobre a arte sacra, "Manhã de Fé" discreto no rodapé) e abre o WhatsApp com
  ela pronta. Cada senhora que manda no grupo da família/pastoral é um anúncio
  grátis para ~30 pessoas do perfil exato. Essa imagem é tratada como a capa do
  app — caprichada ao máximo.

---

## 3. Conteúdo

### As 365 mensagens

- **Conteúdo 100% próprio**: gerado por IA + revisão do dono. Risco jurídico
  zero, o app é 100% nosso.
- O livro "365 dias com o Senhor" serve **apenas como referência de formato**
  (tamanho, tom, ritmo diário) — **nunca** texto copiado (livro comercial
  protegido; copiar para um app pago é violação com risco real de retirada da
  loja + indenização).
- **Formato de cada dia:** versículo (2–4 linhas) + reflexão (4 frases, falando
  "você", linguagem de conversa, sem teologia difícil) + uma oração curta.
  ≈ 45 segundos de narração — "o tempo certo de um café".
- **Produção:** gerado em lotes de 30 dias, revisados pelo dono. Recomendação
  forte: pedir a um padre ou diácono conhecido uma lida final — "textos
  revisados por Pe. Fulano" na loja vale muito para esse público.

### Texto bíblico — decisão jurídica

- Ave Maria, Jerusalém, CNBB, Pastoral, NVI e todas as Almeidas modernas são
  **protegidas**. A única tradução moderna com licença livre para uso comercial
  é a **Bíblia Livre (CC BY 4.0)**.
- Ela permite adaptação → podemos ajustar a redação para soar católica ("cheia
  de graça"), **creditando corretamente**.
- Detalhe: tem 66 livros, sem os deuterocanônicos — para devocional diário
  quase não pesa.
- **Em 1º/1/2028 a tradução católica do Pe. Matos Soares cai em domínio
  público** → migramos.

### Música — decisão jurídica

- **A "regra dos 30 segundos" não existe.** No Brasil, tocar 30s de música
  protegida em app é reprodução parcial + execução pública (Lei 9.610/98,
  arts. 29 e 68) e o ECAD cobra mesmo de serviço religioso sem lucro. A
  política da Google Play cita literalmente "apps com botões que tocam trechos
  de conteúdo protegido" como violação — exatamente o nosso formato.
- **Nada de Padre Marcelo, Canção Nova ou Shalom — nem 5 segundos.**
- **Cantar na missa ≠ colocar no app.** Cantar na celebração é execução ao
  vivo numa liturgia (propósito da obra, nunca alvo de cobrança na prática);
  colocar a gravação num app pago é reprodução + distribuição + execução
  pública, com autorização obrigatória. O Brasil inteiro cantar um canto toda
  semana não o torna livre — torna-o *famoso*, o que aumenta a chance de a
  editora perceber e denunciar.
- **Cada música tem dois direitos separados, e os dois precisam estar livres:**
  1. **A obra** (melodia e letra) — 70 anos após a morte do autor;
  2. **A gravação** (aquela execução específica do coro/cantor) — 70 anos a
     contar da gravação (art. 96). Ex.: a Ave Maria de Schubert é livre (ele
     morreu em 1828), mas o CD de um coral de 2018 achado no YouTube é
     protegido até 2089 — baixar de lá e pôr no app é infração, mesmo a
     música sendo de domínio público.
- **O que não podemos usar:** Pescador de Homens, A Barca; cantos do
  Pe. Zezinho, Ir. Miria Kolling, Pe. Fábio; hinários da CNBB e cantos da
  Campanha da Fraternidade; Padre Marcelo Rossi, Canção Nova, Shalom; versões
  **em português** de hinos antigos.
- **O que podemos usar (a melodia é livre):** Ave Maria, Ave Verum Corpus,
  Panis Angelicus, Salve Regina, Ave Maris Stella, Veni Creator, Tantum Ergo,
  Pange Lingua, Adeste Fideles, Noite Feliz, canto gregoriano em geral.
  E a coisa boa: **esse é exatamente o repertório que o público ama** — a
  senhora de 75 anos cresceu ouvindo Ave Maria em casamento, Tantum Ergo na
  bênção do Santíssimo e gregoriano na missa da juventude dela. Um app com
  essa trilha soa mais reverente e mais caro do que um com música católica
  pop de rádio — conversa direto com o "encantador".
- **Como resolver as gravações (do melhor para o mais rápido):**
  1. **Gravar as nossas próprias versões** — contratar um organista ou
     tecladista de paróquia por um dia (R$ 300–800 no Brasil) para tocar ~20
     melodias tradicionais, com **cessão de direitos por escrito**. A gravação
     fica nossa, para sempre, sem discussão possível. Padrão-ouro;
  2. Gravações CC0/CC-BY já existentes (Wikimedia Commons, Musopen);
  3. Geração por IA (Suno Pro) para os buracos.
- **Acervo próprio (custo até R$ 60, uma vez, sem contar a opção do
  organista):**
  - Pixabay Music (uso comercial, sem crédito);
  - Gravações CC0/CC-BY do Wikimedia/Musopen — Ave Maria (Schubert e Gounod),
    Ave Verum (Mozart), Panis Angelicus, Tantum Ergo, gregoriano de verdade;
  - Um mês de Suno Pro (~US$ 10) para os buracos — direitos das músicas
    baixadas são perpétuos.
- **40 faixas de 30 segundos, todas embutidas no app, tocando offline.**
  Repertório que emociona esse público e que é 100% nosso.

### Imagens

- Base: **arte sacra clássica em domínio público** — Fra Angelico, Murillo,
  Sassoferrato, Zurbarán — do acervo do Wikimedia. Gratuita, deslumbrante, e é
  exatamente a arte que essa geração reconhece dos quadros da igreja.
- Complemento: imagens geradas para o app (amanhecer, mãos em oração, caminho,
  campo) para variar.
- **Tudo em WebP, ~100 KB cada.**

### Narração

- O texto do dia é o mesmo para todos → **1 MP3 por dia**, gerado com voz
  neural de estúdio (**Google Chirp 3 HD pt-BR**), servido pelo **Cloudflare
  R2** (não cobra saída de dados).
- Conta fechada: **US$ 0/mês com 10 mil usuários; ~US$ 0–1/mês com 100 mil.**
- O app baixa **7 dias adiantados (~1,2 MB)** enquanto está no Wi-Fi de casa e
  toca sempre do arquivo local — funciona com internet ruim de igreja.
- **Sem internet nenhuma: cai para a voz do próprio celular (TTS local).**

### O problema do segundo ano (registrado no plano desde já)

Se no 2º ano o assinante receber exatamente as mesmas 365 mensagens, a
renovação automática vira cancelamento em massa — e reclamação. A solução não é
código, é conteúdo:

- Ao longo do 1º ano: somar **novenas** e **especiais de Natal, Quaresma e
  Maio (mês de Maria)**;
- No ano 2: entra um **segundo ciclo de reflexões**.

---

## 4. Arquitetura

### A regra que manda em tudo: offline primeiro

O público tem celular fraco, plano de dados caro e Wi-Fi ruim. Se o app
precisar de rede para abrir o cartão do dia, ele falha justamente na senhora
que mais precisa dele.

Na prática:

- As **365 mensagens do ano ficam dentro do app** (arquivo de texto ~250 KB —
  menos que uma foto);
- A **música fica dentro do app** (40 faixas);
- As **imagens ficam dentro do app**;
- Só a **narração de estúdio é baixada** — com 7 dias de antecedência, no
  Wi-Fi. Ao abrir o cartão às 6h, tudo já está no aparelho: abre instantâneo,
  até em modo avião.

### Tecnologia: Flutter

Comparados Flutter, React Native, Capacitor, Kotlin Multiplatform e nativo
puro. **Flutter ganha pelos requisitos duros:**

- Roda em **Android 7.0+** — pega os celulares antigos de verdade, e funciona
  em Android Go;
- É **compilado**, não interpretado: em celular de 1 GB de RAM abre rápido e
  não trava (React Native carrega um motor de JavaScript junto, pesando
  exatamente onde não podemos pesar);
- Um código só para Android + iOS (iOS compilado em nuvem, sem Mac).

### Infra

- **Cloudflare R2** para os MP3 diários de narração (saída de dados grátis).
- Custo de operação projetado: ~zero até dezenas de milhares de usuários.

### Alerta operacional (vira tela de onboarding)

**Xiaomi e Samsung matam apps em segundo plano** (nota máxima de
agressividade). Sem uma tela ensinando a liberar o app, a notificação diária
simplesmente não chega em boa parte dos aparelhos brasileiros. Isso é uma tela
do onboarding, não um detalhe: **"seu celular pode bloquear nossos avisos"**,
com instruções diferentes e ilustradas para Xiaomi, Samsung e Motorola.

---

## 5. Produto e design

### As 8 regras de design que não se negociam

O app não é "um app normal adaptado para idosos" — ele **nasce** assim:

1. **Nada é só ícone.** Todo botão tem desenho **e** palavra. Um coração
   sozinho não significa nada para quem tem 72 anos.
2. **Botões de 64 px de altura** (o dobro do padrão da indústria), com 24 px de
   espaço entre eles — mão trêmula não acerta o botão errado.
3. **Zero gesto escondido.** Sem arrastar, sem segurar apertado, sem toque
   duplo. Se existe, é um botão visível.
4. **Fonte de corpo em 22, título em 32**, e um botão **A+** sempre visível com
   três tamanhos. O app respeita o tamanho que a pessoa já aumentou no Android.
5. **Contraste altíssimo** (nível AAA, quase 3× o mínimo legal). Nunca cinza
   claro sobre branco.
6. **Máximo 3 ações por tela.** Sem menu sanduíche, sem abas escondidas.
7. **Nada tem pressa.** Nenhuma mensagem some sozinha, nada expira, nada pisca.
8. **Nunca culpar.** Se a pessoa ficou 5 dias sem abrir: "que bom te ver de
   novo" — nunca "você perdeu 5 dias". Culpa afasta esse público na hora.

### Paleta (nada de branco puro, nada de neon)

| Cor | Hex | Uso |
|---|---|---|
| Creme quente | `#FBF6EC` | Fundo de tela |
| Preto quente | `#221D18` | Texto |
| Azul mariano | `#1E3A5F` | Barras, títulos |
| Dourado do amanhecer | `#C8952E` | A estrela, destaques |
| Vermelho litúrgico | `#9B2C2C` | Só o coração (favoritos) |

### Tipografia

- O **versículo em serifa** — dá reverência e é mais confortável para ler texto
  corrido;
- Interface em fonte sem serifa legível, corpo 22 / título 32 (regra 4).

### O Cartão do Dia — a alma do app

Sem tela inicial, sem menu: o app **abre direto no cartão**.

```
┌──────────────────────────────────┐
│ Segunda-feira, 25 de agosto      │ ← data por extenso
│ Tempo Comum                      │ ← tempo litúrgico, discreto
├──────────────────────────────────┤
│         [ arte sacra ]           │ ← imagem do dia
├──────────────────────────────────┤
│ "Vinde a mim, todos vós          │ ← versículo em SERIFA
│  que estais cansados..."         │
│         Mateus 11,28             │ ← referência
│ ▓▓▓▓▓▓▓░░░░░░░        0:18       │ ← linha de progresso
│ ┌──────────────────────────┐     │
│ │      ⏸  PAUSAR           │     │ ← botão enorme
│ └──────────────────────────┘     │
├──────────────────────────────────┤
│ Reflexão em 4 frases,            │ ← corpo 22
│ falando com "você"...            │
│ ┌──────────────────────────┐     │
│ │   🎵 OUVIR MÚSICA 30s    │     │
│ └──────────────────────────┘     │
│    Ave Maria · Schubert          │ ← crédito da faixa
├──────────────────────────────────┤
│ ♡ GUARDAR │ ENVIAR │ A+          │ ← três botões, com palavra
└──────────────────────────────────┘
```

- A narração **começa sozinha** ao abrir. Dois cuidados embutidos: botão de
  pausa enorme e óbvio (para quem abriu às 6h ao lado do marido dormindo) e um
  ajuste **"narrar sozinho: sim/não"** para quem preferir apertar.
- **ENVIAR** = motor de crescimento (ver seção 2).

### As outras telas

- **Santo do dia** — arte, nome, três linhas de história e uma frase dele, com
  botão de ouvir.
- **Terço** — os mistérios certos do dia já escolhidos (segunda gozosos, terça
  dolorosos...), áudio guiado, e as contas do terço desenhadas grandes na
  tela, acendendo uma a uma. Sem contar nada com o dedo.
- **Guardados** (favoritos) — lista com miniatura e fonte grande. *(Habilita
  também a tela "dias anteriores", proposta aceita no desenho: depois que
  existe a tela de favoritos, ela sai quase de graça e evita a frustração de
  quem perdeu um dia.)*
- **Ajustes** — seis itens gigantes, só: horário do aviso · tamanho da letra ·
  narrar sozinho · minha assinatura · ajuda · créditos.
- **Primeira vez (4 telas de onboarding)** —
  1. Boas-vindas e nome (opcional, usado depois: *"Bom dia, Antônio"*);
  2. Que horas você quer receber o aviso;
  3. Permissão de notificação, **explicada antes** de o Android perguntar;
  4. A mais importante: **"seu celular pode bloquear nossos avisos"** com
     instruções ilustradas por marca (Xiaomi, Samsung, Motorola).
- **Assinatura** — ver seção 2.

---

## 6. Empresa e questões fiscais (pendências fora do código)

- O CNPJ do dono é da área de **educação**. Pontos levantados (a confirmar com
  contador — **não decidir só com base nesta conversa**):
  - Se for **MEI**: desenvolvimento/licenciamento de software provavelmente
    **não serve** (saiu da lista de ocupações permitidas ao MEI). Caminho
    seria desenquadrar para **ME no Simples Nacional** — nada dramático, mas é
    um passo com prazo.
  - As lojas não olham CNAE (só querem saber se a empresa existe e o nome
    legal), mas **Receita e prefeitura olham** na hora da nota fiscal →
    provavelmente incluir **CNAE secundário**: `6203-1/00` (licenciamento de
    programas de computador não customizáveis) ou `6319-4/00` (provedor de
    conteúdo na internet). Inclusão costuma ser rápida e barata.
  - **Possível presente:** a Apple isenta a anuidade de US$ 99 para
    instituições de ensino credenciadas e entidades sem fins lucrativos
    (economia de ~R$ 540/ano) — verificar elegibilidade do Brasil/do CNPJ.
  - Apple e Google vendem a assinatura ao consumidor **em nome delas** e
    repassam do exterior → na prática costuma ser tratado como **exportação de
    serviços**, com efeitos bons no ISS — conversa para o contador.
- ❓ **Pergunta que ficou sem resposta na conversa:** qual o tipo do CNPJ
  (MEI, ME/EPP no Simples, outro)? — isso adianta ou trava o cronograma de
  lançamento.

---

## 7. Cronograma realista (aprovado)

| Fase | Conteúdo |
|---|---|
| **0. Preparação** *(começa hoje, em paralelo — não espera o código)* | Documentos/contas: CNPJ e CNAE com contador, conta Google Play (US$ 25), conta Apple (US$ 99 ou isenção), D-U-N-S, acervo de música e imagens |
| **1. Núcleo** | Cartão do dia completo (narração, música, imagem) + notificação diária |
| **2. Crescimento** | WhatsApp/ENVIAR, Guardados, dias anteriores, assinatura |
| **3. Devoção** | Terço guiado, Santo do dia |
| **4. Conteúdo** *(contínuo)* | 365 mensagens em lotes de 30 + narrações + revisão |
| **5. Lançamento** | Testes em aparelhos fracos, lojas, fichas, revisões |

**Total: 8 a 10 semanas** para estar nas duas lojas com o ano completo.

*(Nota: a coluna "conteúdo" das fases 1–5 foi parcialmente reconstruída — os
prints da conversa original cortavam essa coluna. O total e a Fase 0 são
literais da conversa aprovada.)*

---

## 8. Estado do projeto e próximos passos

- [x] Brainstorming e pesquisas (direito autoral Bíblia, ECAD/música, TTS,
      stack) — feitos na conversa original
- [x] Todas as decisões de produto, negócio, conteúdo, arquitetura e design —
      **aprovadas** ("aprovo")
- [x] Documento oficial do projeto — **este arquivo** (a sessão original caiu
      no limite enquanto o escrevia; reescrito integralmente a partir do
      registro da conversa)
- [ ] Plano de implementação passo a passo
- [ ] Fase 0 (preparação) — pode começar imediatamente
- [ ] Projeto Flutter (código)

### Pendências que dependem do dono

1. Tipo do CNPJ (MEI / ME / outro) — falar com o contador (seção 6).
2. Escolher padre/diácono para revisão final dos textos (recomendado).
