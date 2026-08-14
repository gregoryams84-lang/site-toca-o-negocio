# Design: currículo das trilhas 1 e 2 (Toca o Negócio)

Continuação de `2026-08-13-conteudo-pedagogico-CONTEXTO.md`. Esse documento
registra as decisões de arquitetura do currículo tomadas na conversa de
conteúdo pedagógico, antes de escrever roteiro/atividade/PDF aula a aula.

## Correção de contexto importante

A Aula 1 existente (`app-atividades-curso/dados/trilha-ia/aula-01.json`) foi
criada **só como teste técnico**, para validar a plataforma de vídeo e o
fluxo de pagamento/matrícula — não é conteúdo pedagógico final. O CONTEXTO
original descrevia essa aula como "já pronta"; isso está desatualizado. A
trilha 1 é redesenhada do zero, inclusive a Aula 1. O JSON existente serve
só de referência de *formato técnico* dos tipos de bloco de atividade
(cenário, lista aberta, cálculo, escolha simples), não de conteúdo ou tom.

## Princípio pedagógico central

Progressão gradual com vitória visível cedo: o aluno começa em algo simples,
aplica na prática, vê efeito real no próprio negócio, e só então ganha ânimo
pra avançar. Nunca abrir uma trilha ou aula com algo difícil — isso perde o
aluno. O efeito prático gera o ânimo, não o discurso motivacional.

Isso vale tanto entre trilhas (trilha 1 é a base conceitual antes de tudo)
quanto dentro de uma trilha (trilha 2 tem sua própria progressão interna).

## Diferencial de qualidade (vs. curso raso de mercado)

Curso genérico de IA pra pequeno negócio costuma pecar de duas formas: aula
de "prompt mágico" sem contexto de negócio, ou promessa de resultado sem
ensinar o raciocínio. Todo conteúdo novo aplica pelo menos um destes três
ingredientes:

- **Raciocínio explícito, não receita** — ensinar o critério de decisão
  (ex.: as 3 perguntas da aula 1 de trilha 1), não só "faça assim".
- **Artefato reutilizável** — o aluno sai com algo que reaproveita depois
  (ex.: estrutura de prompt), não um exemplo de uso único.
- **Erro real revisado** — mostrar uma saída de IA ruim/genérica de verdade
  e ensinar a consertar antes de usar com cliente.

Isso é além do padrão de originalidade que já vale pro resto do material da
empresa (sem clichê, sem abertura genérica) — ver CONTEXTO original.

## Arquitetura das 4 trilhas

- **Trilha 1 — IA no Negócio**: nível iniciante da vida toda do negócio.
  Raciocínio e ferramentas de IA que sustentam as trilhas seguintes. Foco
  geral, não amarrado a canal de venda específico.
- **Trilha 2 — Vender pela internet e pelo WhatsApp**: onde entra site,
  redes sociais, automação de conteúdo e agente de atendimento — com
  progressão própria básico → intermediário → profissional dentro da
  trilha (ver grade abaixo).
- **Trilhas 3 e 4 — Formalizar a empresa / Gerir o dinheiro**: permanecem
  tradicionais (contabilidade, gestão formal, finanças), **sem IA**.
  Estrutura de aulas dessas duas trilhas fica para uma conversa/spec
  separada — domínio de conteúdo diferente o suficiente pra não empacotar
  junto com trilhas 1 e 2.

## Grade — Trilha 1: IA no Negócio (6 aulas)

1. **Você já usa IA. O problema é como.** — critério das 3 perguntas
   (repete / custa tempo / resposta segue padrão) pra saber o que vale
   automatizar.
2. **As ferramentas que cabem no bolso** — teste guiado (não lista): abrir,
   mandar a primeira mensagem, comparar resposta entre ferramentas
   gratuitas/baratas disponíveis.
3. **Fazendo a IA trabalhar por você** — estrutura de pedido reutilizável
   (contexto + tarefa + formato + exemplo), com iteração.
4. **Atendimento sem parecer robô** — parte de uma resposta de IA genérica
   real; o aluno edita até soar como ele falaria com o cliente.
5. **Organização da rotina** — IA para agenda, lembrete de cobrança,
   rascunho de post — tarefas de fundo, não de vitrine.
6. **O que não é pra delegar + projeto final** — limites (dado de cliente,
   julgamento, LGPD básica); artefato final: mini-plano de uso de IA no
   próprio negócio, fechando a trilha.

## Grade — Trilha 2: Vender pela internet e pelo WhatsApp (6 aulas)

**Básico — presença** (vitória: perfil pronto)
1. **Perfil que vende sem gastar** — Instagram/Facebook estruturados com
   ajuda de IA (bio, destaque, primeira grade de posts).
2. **WhatsApp Business configurado direito** — catálogo, mensagem
   automática simples, organização de conversa.

**Intermediário — conteúdo** (vitória: posts saindo com voz própria)
3. **Conteúdo com IA que não parece IA** — texto, imagem e legenda mantendo
   a voz do próprio negócio.
4. **Rotina de postagem sem travar** — banco de ideias e calendário
   simples, o que postar toda semana.

**Profissional — automação** (vitória: atendimento/postagem rodando sozinho)
5. **Automatizando a postagem com n8n** — ligar as pontas: gerar conteúdo
   → agendar → publicar sozinho.
6. **Um agente que atende por você** — configurar resposta automática no
   WhatsApp/Messenger/Direct, com regra clara de quando passa pra humano.

## Formato de cada aula (herdado do CONTEXTO original)

Vídeo curto + atividade interativa que parte de situação concreta do
negócio do aluno antes de qualquer explicação, terminando em artefato real
(lista, número, decisão escrita — nunca nota ou pontuação). Tipos de bloco
disponíveis: cenário com múltipla escolha e dica em duas etapas, lista
aberta, cálculo com campos numéricos, escolha simples de opinião.

**Bloco de fechamento (padrão validado na trilha 1 e 2):** a atividade pode
terminar tanto no bloco de artefato quanto num `escolha_simples` de
síntese/compromisso logo depois dele (ex.: "essa tarefa vale ser atacada
primeiro?", "você consegue manter esse ritmo?") — as duas formas satisfazem
"termina em artefato real", desde que o `escolha_simples` reflita
diretamente o que acabou de ser construído, nunca um pivô de assunto não
relacionado. O padrão mais comum nas trilhas já feitas é fechar no
`escolha_simples` de síntese.

## Fora de escopo deste documento

- Roteiro aula a aula (vídeo, atividade, PDF) — vira plano de implementação
  separado, trilha por trilha, começando pela trilha 1.
- Grade das trilhas 3 e 4 — conversa própria, domínio tradicional.
- Detalhe técnico de como o agente de WhatsApp/Messenger/Direct da aula 6
  da trilha 2 é implementado por trás (fica pra quando essa aula for
  roteirizada).
