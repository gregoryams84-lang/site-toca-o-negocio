# Imagens e matriz curricular das trilhas — Design

## Contexto

A seção "As trilhas" da home (`index.html`) e as páginas próprias de cada trilha (`trilhas/*/index.html`, já publicadas com conteúdo persuasivo em prosa) hoje não têm nenhuma imagem, e não mostram de forma estruturada o que cada trilha ensina. O currículo completo (6 aulas por trilha, com título e resumo) já existe pronto em `docs/curriculo-completo.md` — este trabalho é sobre trazer isso para o site, não sobre criar conteúdo novo.

## O que muda

**Cards da home (`index.html`):** cada um dos 4 cards em `.trilhas-grade` ganha uma imagem no topo e uma prévia curta da matriz curricular (os 2 primeiros títulos de aula + indicação de quantas aulas restam), além do título/descrição que já existem. O card continua compacto — não vira uma lista longa.

**Páginas de trilha (`trilhas/*/index.html`):** cada página ganha a imagem em destaque perto do topo (seção `trilha-hero`) e uma seção nova, "O que você vai aprender", com a lista completa das 6 aulas (título + resumo), vinda diretamente de `docs/curriculo-completo.md`. Essa seção é somada às seções de prosa que já existem — não substitui o conteúdo persuasivo já escrito, complementa com a referência concreta do que está incluído.

## Fonte de dados da matriz curricular

O conteúdo das aulas é copiado literalmente de `docs/curriculo-completo.md` para dentro do HTML de cada página (sem indireção via JSON/JS — o site não tem build step, e essa é a mesma convenção já usada em todo o resto do projeto). Mapeamento de trilha (slug de URL → seção do currículo):

| Slug (pasta/URL) | Card na home (posição) | Seção em `curriculo-completo.md` |
|---|---|---|
| `venda-pelo-whatsapp` | 1º | Trilha 2 — Vender pela internet e pelo WhatsApp |
| `ia-no-negocio` | 2º | Trilha 1 — IA no Negócio |
| `formalizacao-da-empresa` | 3º | Trilha 3 — Formalizar e manter a empresa em dia |
| `gestao-financeira` | 4º | Trilha 4 — Gerir o dinheiro |

(A numeração "Trilha N" do currículo não bate com a ordem de exibição no site — isso já era assim antes deste trabalho e não muda aqui.)

## Imagens

**Direção visual** (usada nos 4 prompts, pra manter consistência entre as trilhas): ilustração/composição com paleta da marca (verde `#14513C`, dourado/âmbar `#8A5A12`, fundo creme `#F5F6F3`, tinta escura `#16191C`), tom caloroso e sóbrio, sem clichê de banco de imagens, sensação de pequeno negócio brasileiro real, sem texto/letra desenhada na imagem, formato paisagem.

Como não há ferramenta de geração de imagem disponível nesta sessão, os prompts foram escritos e entregues ao Gregory, que gerou as imagens externamente (ChatGPT/Gemini/Canva) e as devolveu para integração.

**Status das 4 imagens** (na hora deste spec):

| Trilha | Arquivo no repo | Status |
|---|---|---|
| Venda pelo WhatsApp | `img/trilhas/venda-pelo-whatsapp.jpg` | ✅ pronta, integrada |
| Gestão financeira | `img/trilhas/gestao-financeira.jpg` | ✅ pronta, integrada |
| Formalização da empresa | `img/trilhas/formalizacao-da-empresa.jpg` | ✅ pronta, integrada (imagem original veio com barras pretas de letterbox; recortada pra 1024×559, mesma proporção das outras) |
| IA no negócio | `img/trilhas/ia-no-negocio.jpg` | ⏳ **pendente** — a primeira geração trouxe uma caligrafia que degringola em texto sem sentido dentro da imagem (defeito clássico de gerador de imagem tentando escrever). Gregory vai regerar sem esse elemento. |

Todas as imagens finais: 1024×559px (proporção ~16:9), formato JPEG.

## Fora de escopo

- Criar conteúdo novo de currículo — só reaproveitar o que já existe em `docs/curriculo-completo.md`.
- Alterar a numeração "Trilha N" do currículo pra bater com a ordem de exibição do site.
- Gerar as imagens dentro desta sessão — feito externamente pelo Gregory a partir dos prompts.
