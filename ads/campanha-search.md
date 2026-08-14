# Campanha Google Ads — Search

Data: 2026-08-14. Estrutura pra rodar em paralelo ao SEO orgânico
(`seo/palavras-chave.md`), mirando quem já busca com intenção comercial ou
transacional — a cauda longa informacional fica pro orgânico, não pro Ads.

## Configuração da campanha

- **Tipo:** Pesquisa (Search) — não usar Performance Max nem Display nesta
  primeira campanha. PMax mistura canais e dificulta saber o que está
  funcionando; Display serve pra reconhecimento de marca, não pra quem já
  está buscando solução.
- **Rede de Pesquisa:** manter ligado. **Parceiros de pesquisa:** desligar
  no início (tráfego de qualidade mais baixa e mais difícil de avaliar).
- **Localização:** Brasil inteiro (o produto é curso online, não tem
  restrição geográfica de entrega).
- **Idioma:** Português.
- **Dispositivo:** sem exclusão, mas considerar ajuste de lance pra cima em
  celular assim que houver dado — o público-alvo busca majoritariamente
  pelo celular (confirmado no mapa de palavras-chave).
- **Orçamento:** dividir igual entre os 4 grupos de anúncio nas primeiras
  2-3 semanas, sem favorecer nenhuma trilha de antemão — os dados de custo
  por clique/lead de cada uma é que decidem o realocamento depois.
- **Estratégia de lance:** começar em **"Maximizar cliques"** com um teto de
  CPC manual. Só migrar pra **"Maximizar conversões"** depois de acumular
  15-30 conversões registradas — é o volume mínimo que o Google recomenda
  pro algoritmo de lance automático sair do período de aprendizado com
  confiabilidade. Migrar antes disso costuma gastar mais por lead sem
  necessidade.

## Rastreamento de conversão (obrigatório antes de gastar orçamento sério)

O site hoje não tem formulário — a conversão é clicar em **"Falar com a
gente"** (leva pra seção de Contato / WhatsApp / e-mail). Sem marcar isso
como conversão, a campanha não tem como aprender o que funciona.

1. No GA4 (mesma propriedade configurada em `seo/medicao.md`), crie um
   evento pro clique no botão "Falar com a gente" — em Admin → Eventos →
   "Criar evento", ou usando o rastreamento de clique em link já embutido
   no GA4 (ele já registra cliques em links `mailto:` e âncoras por padrão
   em "Eventos aprimorados", só confirmar se está ligado).
2. Marque esse evento como **conversão** (Admin → Conversões → alternar
   "Marcar como conversão" no evento certo).
3. No Google Ads, em Ferramentas → Conversões → Importar → Google
   Analytics (GA4), importe essa conversão. Isso exige a conta do Ads
   vinculada à propriedade do GA4 (Admin → Vinculações de produtos, dentro
   do GA4).

## Palavras-chave negativas (nível de campanha)

Filtram busca de quem não é o público-alvo — evita gasto com clique que
não vira lead:

`emprego` · `vaga` · `concurso` · `apostila` · `pdf grátis` · `curso
gratuito` · `faculdade` · `graduação` · `pós-graduação` · `mestrado` ·
`eja` · `supletivo` · `download`

(Correspondência ampla modificada ou de frase, pra pegar variações como
"vaga de emprego" ou "curso gratuito online" também.)

## Grupo de anúncios 1 — Venda pela internet e pelo WhatsApp

**URL final:** `https://tocaonegocio.com.br/trilhas/venda-pelo-whatsapp/`

**Palavras-chave** (frase, exceto onde indicado exato):
- "venda pelo whatsapp para pequenos negócios"
- "curso de whatsapp para vendas"
- "curso de vendas pelo whatsapp"
- "como vender mais pelo whatsapp"
- [curso online de vendas para pequenos negócios] (exato)

**Títulos (headlines, até 30 caracteres):**
1. Venda Mais pelo WhatsApp
2. Curso Livre de Vendas Online
3. Pare de Perder Cliente no Zap
4. Catálogo, Cobrança e Resposta
5. Pra Quem Vende Sozinho
6. Aulas Práticas e Curtas
7. Aprenda a Vender no WhatsApp
8. Curso Toca o Negócio

**Descrições (até 90 caracteres):**
1. Monte catálogo, responda rápido e cobre sem constranger. Curso livre e prático.
2. Pra quem toca o negócio sozinho. Aulas curtas, direto ao ponto, sem enrolação.
3. Aprenda a vender pela internet e pelo WhatsApp sem perder cliente no caminho.
4. Curso livre de capacitação. Sem termo técnico, sem curso de 30 horas.

## Grupo de anúncios 2 — IA no negócio

**URL final:** `https://tocaonegocio.com.br/trilhas/ia-no-negocio/`

**Palavras-chave:**
- "ferramentas de inteligência artificial para pequenos negócios"
- "curso de inteligência artificial para empreendedores"
- "curso de ia para negócios"
- "como usar inteligência artificial no meu negócio"
- [ia para pequenas empresas curso] (exato)

**Títulos:**
1. IA Aplicada ao Seu Negócio
2. Curso Livre de IA na Prática
3. Use IA no Dia a Dia
4. Ferramentas Gratuitas de IA
5. Pra Quem Toca o Negócio Só
6. Anúncio, Resposta e Agenda
7. Aprenda IA Sem Complicação
8. Curso Toca o Negócio

**Descrições:**
1. Escreva anúncio, responda dúvida repetida e organize a agenda com IA gratuita.
2. Curso livre e prático. Sem termo técnico, direto pro que muda essa semana.
3. Inteligência artificial aplicada ao pequeno negócio, sem exagero e sem custo.
4. Aulas curtas em vídeo com atividade prática no seu próprio negócio.

## Grupo de anúncios 3 — Gestão financeira

**URL final:** `https://tocaonegocio.com.br/trilhas/gestao-financeira/`

**Palavras-chave:**
- "planilha financeira para pequeno negócio"
- "curso de gestão financeira para autônomos"
- "controle financeiro para mei"
- "como organizar o financeiro do meu negócio"
- [curso de finanças para pequenas empresas] (exato)

**Títulos:**
1. Controle o Financeiro Já
2. Curso de Gestão Financeira
3. Saiba Quanto Sobra no Mês
4. Separe o Seu do da Empresa
5. Fluxo de Caixa Simples
6. Decida com Número, Não Achismo
7. Pra Quem Cuida do Financeiro
8. Curso Toca o Negócio

**Descrições:**
1. Separe o dinheiro pessoal do da empresa e saiba quanto sobra de verdade no mês.
2. Fluxo de caixa simples, sem planilha complicada. Curso livre e prático.
3. Pra quem toca o negócio sozinho e decide sem ter um financeiro por perto.
4. Aulas curtas, atividade prática e material de apoio em PDF.

## Grupo de anúncios 4 — Formalização e obrigações da empresa

**URL final:** `https://tocaonegocio.com.br/trilhas/formalizacao-da-empresa/`

**Palavras-chave:**
- "como formalizar uma empresa pequena"
- "mei passo a passo"
- "preciso de contador sendo mei"
- "curso sobre obrigações do mei"
- [como colocar a empresa em dia] (exato)

**Títulos:**
1. Coloque a Empresa em Dia
2. Curso de Formalização MEI
3. Entenda Suas Obrigações
4. Sem Depender Só do Contador
5. Nota Fiscal, Guia e Mais
6. Quando Chamar um Contador
7. Curso Livre e Direto
8. Curso Toca o Negócio

**Descrições:**
1. Entenda o que emitir, pagar e declarar sem depender de contador a cada dúvida.
2. Curso livre sobre formalização e obrigações da empresa, em linguagem direta.
3. Saiba quando resolver sozinho e quando vale chamar um contador de verdade.
4. Aulas curtas, direto ao ponto, pra quem toca o negócio sozinho.

## Extensões (recomendado ligar em todos os grupos)

- **Sitelinks:** link pras outras 3 páginas-pilar + home.
- **Frases de destaque (callouts):** "Cursos Livres" · "Aulas em Vídeo" ·
  "Material em PDF" · "Atividade Prática" — só recursos reais, nada
  inventado.
- **Extensão de chamada:** telefone do rodapé — hoje é placeholder (ver
  `docs/superpowers/specs/2026-08-01-site-institucional-toca-o-negocio-design.md`),
  trocar antes de ativar essa extensão se o número mudar.

## O que fica de fora desta rodada

- **Remarketing/Display:** exige volume de visitantes que o site ainda não
  tem — sem base de público suficiente pra ser eficiente agora.
- **Campanha de marca ("Toca o Negócio"):** só faz sentido depois que
  houver busca de marca de verdade (alguém digitando "toca o negócio" no
  Google) — hoje ninguém busca isso ainda.
- **Anúncio dinâmico de pesquisa (DSA):** deixa o Google escolher a página
  e o título automaticamente a partir do conteúdo do site — evitar por
  enquanto pra manter controle total sobre o texto (restrição de
  "faculdade/graduação/promessa de resultado" não pode ficar por conta de
  geração automática).

## Antes de ativar

1. Ter conta do Google Ads criada e com forma de pagamento cadastrada
   (isso só você faz, é dado financeiro).
2. Vincular a conta do Ads à propriedade do GA4 e importar a conversão
   (seção acima).
3. Revisar o texto dos anúncios uma vez com atenção às mesmas regras do
   site (`seo/limitacoes.md` e as restrições do projeto): nenhuma promessa
   de resultado financeiro, nenhuma palavra proibida.
