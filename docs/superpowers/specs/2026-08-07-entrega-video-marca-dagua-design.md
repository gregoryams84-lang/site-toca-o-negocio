# Entrega de vídeo com marca d'água dinâmica

Data: 2026-08-07

## Objetivo

A Fase 3 ("Entrega da aula") entregou a atividade interativa e o
rastreamento de conclusão, mas não o vídeo da aula em si — o campo
`aulas.video_url`, criado na Fase 1, segue sem uso. Este trabalho constrói
a entrega do vídeo, com marca d'água dinâmica (nome do aluno embutido no
vídeo) para desencorajar cópia e compartilhamento indevido, e para permitir
identificar a origem de uma cópia vazada, caso apareça.

**Calibração de expectativa:** marca d'água não impede fisicamente alguém
de gravar a tela com o celular. O objetivo é desencorajar e, no caso de um
vazamento, indicar de qual aluno ele veio — não é uma trava impossível de
burlar.

## Contexto

Levantamento feito antes de decidir a abordagem: marca d'água dinâmica de
verdade (nome do aluno embutido no vídeo, resistente a gravação de tela)
exige um serviço especializado de vídeo — não é algo viável de construir
sem servidor próprio de processamento de vídeo, o que contradiria o
princípio de custo mínimo que guiou as escolhas técnicas do projeto até
aqui (Supabase, GitHub Pages).

**Decisão:** usar o **Panda Video** (plataforma brasileira de hospedagem de
vídeo, com recurso pronto de marca d'água dinâmica por aluno). Alternativas
consideradas e descartadas:

- **VdoCipher** — mesmo recurso, cobrança em dólar, sem vantagem específica
  para o público brasileiro do projeto.
- **Construir do zero** (Supabase Storage + processamento próprio) —
  exigiria montar um pipeline de processamento de vídeo (infraestrutura
  real), desproporcional ao problema. Uma versão mais simples (sobrepor o
  nome com CSS por cima do vídeo) foi descartada por ser trivialmente
  contornável por qualquer aluno com conhecimento básico de ferramentas de
  desenvolvedor do navegador.

**Custo:** Panda cobra um plano mensal (a partir de R$ 97,90/mês, plano
Bronze — 200GB de armazenamento, 500GB de banda) mais R$ 2,90 por GB
assistido **com** marca d'água (cobrado à parte, em nenhum plano vem
incluso). Isso é uma mensalidade real, que quebra o princípio de "começar
sem mensalidade" que guiou as escolhas anteriores — decisão consciente do
Gregory, registrada aqui para não ser esquecida.

## Decisão de arquitetura

A chave secreta da API do Panda não pode ser exposta no JavaScript do site
estático (qualquer aluno veria inspecionando o código). Isso exige uma
peça de backend — a primeira do projeto até agora (tudo era estático +
Supabase acessado direto do navegador).

**Componente novo: Supabase Edge Function.** Escolhida em vez de qualquer
outro backend porque já está disponível de graça dentro do mesmo projeto
Supabase já em uso — nenhuma infraestrutura nova para hospedar ou pagar
separadamente.

Fluxo:

1. Aluno abre a nova página `atividades/aula.html?aula_id=<uuid>`.
2. A página chama a Edge Function, autenticada com a sessão atual do aluno
   (mesmo padrão de token já usado no resto do `/atividades/`).
3. A função consulta `aulas`/`matriculas` **usando a própria sessão do
   aluno** (não com privilégio elevado) — a política de RLS já existente em
   `aulas` (exige matrícula ativa e dentro do prazo) nega sozinha se o
   aluno não tiver acesso; a função não reimplementa essa regra, só a
   reaproveita.
4. Se autorizado, a função chama a API do Panda pedindo um link de
   reprodução assinado e de curta duração, com o nome do aluno para a
   marca d'água.
5. A função devolve esse link para a página, que carrega o player.

## Modelo de dados

Campo novo em `aulas` (migração nova, não reaproveita `video_url` — nome
enganoso para o que passaria a guardar, ver decisão abaixo):

```sql
alter table aulas add column panda_video_id text;
```

`panda_video_id` guarda o identificador do vídeo dentro do Panda (gerado
quando o vídeo é enviado à plataforma) — não é um link pronto. Não existe
um único link "de verdade" por aula: cada aluno recebe um link assinado
diferente, gerado na hora pela Edge Function, com o próprio nome embutido
na marca d'água. `panda_video_id` é a "receita" que a função usa para
pedir esse link ao Panda.

`video_url` (campo antigo, da Fase 1) permanece sem uso — não faz parte
deste trabalho.

Nenhuma tabela nova. Nenhuma política de RLS nova — a função reaproveita a
política já existente em `aulas`.

## Componente novo: `atividades/aula.html`

Mostra: título da aula, player de vídeo (carrega o link assinado
devolvido pela Edge Function ao abrir a página), botão "Fazer atividade"
(o mesmo link construído pela Fase 3 para o app de atividades — a lógica
de `montarLinkAtividade` já existente em `painel.js` migra para esta
página).

`painel.js` muda: cada aula da lista passa a linkar para
`aula.html?aula_id=<uuid>` em vez de linkar direto para a atividade. O
resto do painel (lista de trilhas, "Em breve", matrícula) não muda.

Sem login → redireciona para `entrar.html`, mesmo padrão já usado no
painel.

## Estados de erro

| Situação | Comportamento |
|---|---|
| Aula sem `panda_video_id` cadastrado | "Vídeo em breve" no lugar do player; botão "Fazer atividade" continua funcionando normalmente |
| Edge Function falha (Panda fora do ar, erro de rede) | Mensagem amigável ("Não foi possível carregar o vídeo agora, tente novamente"), nunca tela branca |
| Matrícula expira entre abrir o painel e clicar na aula | Edge Function nega (mesma regra de RLS), mensagem clara em vez de player quebrado |
| Acesso a `aula.html` sem login | Redireciona para `entrar.html` |

## Testes

Sem suíte automatizada nesta página — mesmo padrão já estabelecido no
resto do site (estático, sem build step, sem framework de testes).
Verificação manual antes de publicar, como nas fases anteriores.

## Fora de escopo

- Material de apoio em PDF (`material_pdf_url`) — campo parado desde a
  Fase 1, continua parado; é um problema separado deste trabalho.
- Certificado de conclusão — Fase 4.
- Gravação ou edição do vídeo em si — pressupõe que o arquivo final já
  existe, pronto para upload no Panda.
- Prazo exato de expiração do link assinado do Panda — parâmetro da API
  do Panda a confirmar no momento da implementação, não uma decisão de
  arquitetura deste documento.

## Critérios de aceite

- Aluno com matrícula ativa abre `aula.html` e vê o vídeo carregando, com
  seu próprio nome na marca d'água (confirmado inspecionando o vídeo
  reproduzido).
- Botão "Fazer atividade" dentro de `aula.html` funciona exatamente como
  hoje (mesmo link de sessão para o app de atividades).
- Aluno sem matrícula ativa (ou com matrícula expirada) não consegue obter
  um link de reprodução — a Edge Function nega.
- Aula sem `panda_video_id` mostra "Vídeo em breve", não quebra a página.
- Acesso sem login redireciona para `entrar.html`.
- Chave da API do Panda nunca aparece em nenhum arquivo servido ao
  navegador (confirmável inspecionando o código-fonte da página).
