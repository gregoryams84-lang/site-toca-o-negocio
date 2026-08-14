# O que a implementação técnica não resolve

## O que esta rodada resolveu

- O Google consegue encontrar, ler e entender as páginas do site: `sitemap.xml`, `robots.txt`, título e meta descrição únicos em cada página, hierarquia de headings correta, URLs limpas e canônicas.
- O Google e o WhatsApp/redes sociais entendem quem é a empresa por trás do site e o que cada página oferece: dados estruturados (JSON-LD) de Organization, WebSite e Course, com CNPJ e endereço reais — nada inventado.
- Compartilhar um link do site no WhatsApp ou redes mostra prévia correta (Open Graph/Twitter Card).
- A base de performance está adequada pro cenário principal (celular, conexão lenta): fontes carregam sem travar a renderização, nenhuma imagem de conteúdo pesada, página leve.
- Existe uma base de 4 páginas de conteúdo real, respondendo a palavras de cauda longa específicas, além da home.

**Nenhum desses itens, sozinho ou em conjunto, garante posição no Google.** Eles removem barreiras técnicas — sem eles, o Google pode nem encontrar ou entender as páginas direito. Com eles, o site fica "elegível" a competir por atenção nas buscas. Elegível não é o mesmo que bem posicionado.

## Por que nenhuma configuração técnica garante primeira posição

O Google ordena resultados por uma combinação de relevância pro que a pessoa buscou, autoridade acumulada do domínio e qualidade percebida do conteúdo (tempo na página, se as pessoas voltam pra pesquisa depois de clicar, etc.). Um `sitemap.xml` correto ou um JSON-LD bem-feito não influenciam nenhum desses três fatores diretamente — eles só garantem que o Google *consegue* avaliar o site de forma correta. Quem decide a posição é a comparação com todo o resto da internet que também responde àquela busca.

## O que realmente move o ponteiro pra um site novo

1. **Produção regular de conteúdo.** As 4 páginas-pilar cobrem o essencial de cada trilha, mas os 24+ artigos de apoio que ficaram no backlog (`seo/plano-de-conteudo.md`) é que respondem as perguntas específicas que o público realmente digita no Google. Cada artigo novo é mais uma chance de aparecer numa busca de cauda longa.
2. **Autoridade de domínio.** O Google confia mais em domínios que existem há mais tempo e mantêm conteúdo consistente. Isso não é configurável — só acumula com tempo e qualidade.
3. **Backlinks.** Links reais de outros sites (parceiros, imprensa local, diretórios de negócio, menção em redes que geram link) sinalizam pro Google que o site é referência. Comprar link ou usar rede de troca de link tende a prejudicar mais do que ajudar — o Google penaliza esse padrão.
4. **Atualização periódica das páginas-pilar.** Revisar e melhorar as páginas-pilar existentes com o tempo (novos exemplos, respostas mais completas no FAQ) sinaliza conteúdo vivo, não abandonado.

Nenhum desses quatro itens é entregável desta implementação técnica — são trabalho contínuo, editorial, ao longo dos próximos meses.

## Limites da hospedagem (GitHub Pages)

- **Sem cabeçalhos HTTP customizáveis.** Não dá pra configurar `Cache-Control` por arquivo além do padrão da CDN do GitHub Pages (Fastly), nem adicionar cabeçalhos de segurança customizados (`Content-Security-Policy`, por exemplo). Aceitável pro tamanho atual do site.
- **Sem otimização automática de imagem.** Se o site crescer e passar a usar fotos (hoje não usa nenhuma, por escolha de marca), cada imagem precisa ser redimensionada e comprimida manualmente antes de subir — não existe serviço de transformação de imagem embutido como em outras hospedagens.
- **Sem renderização no servidor.** Tudo que existe é HTML estático — não é uma limitação prática hoje (o site é só HTML/CSS/JS mesmo), mas restringe opções futuras caso o site precise de personalização por usuário fora da área logada (`/atividades/`, que já é um projeto separado, à parte do GitHub Pages).

## Outras limitações menores registradas

- **`og:image` de 180×180.** É a única imagem quadrada de marca disponível hoje (`img/icone-180.png`); o tamanho recomendado pelo Facebook/WhatsApp pra preview de link é 200×200 ou maior. A prévia funciona, mas fica abaixo do ideal até a marca ter uma imagem quadrada maior.
- **ID do GA4 pendente.** O banner de consentimento e o carregamento condicional já estão prontos, mas o `ID_MEDICAO` em `js/consentimento.js` é um placeholder até você criar a propriedade no Google Analytics — passo a passo em `seo/medicao.md`.
- **Página de Formalização revisada por contador em 2026-08-14.** O conteúdo foi aprovado com linguagem deliberadamente genérica (sem prazo, valor ou percentual específico). Qualquer mudança futura de conteúdo sobre obrigações/tributação exige nova revisão antes de publicar — comentário HTML deixado no próprio arquivo como lembrete.
