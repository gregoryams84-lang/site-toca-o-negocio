# Site Toca o Negócio

Site institucional da AUREA EDUCACIONAL LTDA (marca Toca o Negócio).
HTML e CSS puros — não tem build, não tem servidor, não precisa instalar nada.

## Como editar os textos

- Os textos da página principal estão em `index.html`.
- Os textos de Termos de Uso estão em `termos.html`.
- Os textos de Política de Privacidade estão em `privacidade.html`.
- Os textos de cada trilha estão em `trilhas/<nome-da-trilha>/index.html`
  (veja a seção "Páginas de trilha" abaixo).
- As cores, fontes e espaçamentos estão em `css/estilo.css`.

Para editar um texto, abra o arquivo `.html` correspondente em qualquer
editor (inclusive o Bloco de Notas), procure a frase que quer mudar, e
troque. Cada bloco de texto fica entre uma tag de abertura (tipo `<p>`) e
uma de fechamento (`</p>`) — troque só o texto entre elas, sem apagar as
tags.

## Páginas de trilha (`trilhas/`)

Cada trilha tem sua própria página, numa pasta com o nome da trilha:

- `trilhas/venda-pelo-whatsapp/index.html`
- `trilhas/gestao-financeira/index.html`
- `trilhas/ia-no-negocio/index.html`
- `trilhas/formalizacao-da-empresa/index.html`

Editar o texto funciona igual às páginas antigas — abra o `index.html` da
pasta e troque o texto entre as tags. A página de Formalização tem um
comentário no topo do arquivo avisando que qualquer mudança de conteúdo
precisa ser revisada por um contador antes de publicar (fala de MEI, nota
fiscal e Simples Nacional) — não tire esse aviso.

Se um dia você criar uma nova página de trilha, adicione o link dela em
`sitemap.xml` também, senão o Google não fica sabendo que ela existe.

## Atenção ao rodapé

O rodapé (razão social, CNPJ, endereço, e-mail) aparece **em todas as
páginas do site** (`index.html`, `termos.html`, `privacidade.html` e as 4
páginas de `trilhas/`, hoje 7 arquivos no total), porque o site não usa
nenhuma ferramenta para compartilhar esse trecho automaticamente. Se for
atualizar endereço ou e-mail, é preciso editar **os 7 arquivos**, senão
eles ficam diferentes entre si. (O telefone continua aparecendo só na
seção de Contato da página principal, não no rodapé.)

O banner de cookies (pergunta se pode usar o Google Analytics) também
aparece nas 7 páginas, do mesmo jeito — o texto dele fica repetido antes
de `</body>` em cada arquivo.

## Sobre a logo e o favicon

A logo (`img/logo-completo-verde.svg`) e os ícones (`img/favicon-32.png`,
`img/icone-180.png`) são os arquivos definitivos da marca. Se um dia a
marca for atualizada, é só substituir esses três arquivos por versões
novas com os mesmos nomes — não precisa editar nenhum HTML.

## Como ver o resultado antes de publicar

Basta dar duplo clique no arquivo `index.html` — ele abre no seu
navegador normalmente, sem precisar de internet (exceto para carregar a
fonte).

## Como publicar uma alteração

1. Salve os arquivos editados.
2. Envie as alterações para o GitHub (`git add`, `git commit`, `git push`)
   — ou peça para o Claude Code fazer isso por você.
3. O GitHub Pages atualiza o site sozinho, em geral em poucos minutos.

Para o passo a passo completo de publicação (incluindo domínio e HTTPS),
veja `docs/publicar-github-pages.md`.

## Planejamento de SEO (`seo/`)

Essa pasta guarda documentos de planejamento — não são páginas do site,
ninguém de fora vê elas:

- `seo/palavras-chave.md` — mapa de palavras-chave que o site tenta responder.
- `seo/plano-de-conteudo.md` — quais páginas existem/faltam e a prioridade delas.
- `seo/medicao.md` — passo a passo pra configurar Search Console e Analytics.
- `seo/limitacoes.md` — o que a parte técnica resolve e o que depende de
  produção de conteúdo contínua (leitura recomendada antes de esperar
  resultado de busca).

## Área do aluno (`/atividades/`)

Essa pasta é o começo do app onde o aluno faz login e acompanha o curso.
Hoje ela só tem cadastro, login, recuperação de senha e um painel que
mostra as trilhas em que o aluno está matriculado — ainda não tem aula,
vídeo nem certificado (isso vem nas próximas etapas).

Os dados ficam no Supabase (não neste repositório). Para matricular um
aluno manualmente (antes de o pagamento automático existir):

1. Entre no painel do Supabase (supabase.com/dashboard), no projeto
   listado em `supabase/project-info.md`.
2. Vá em Table Editor → `matriculas` → Insert row.
3. Preencha `aluno_id` (pegue o ID do aluno em Authentication → Users),
   `trilha_id` (crie a trilha antes em Table Editor → `trilhas`, se
   ainda não existir), `data_expiracao` (data de hoje + 12 meses) e
   `status: ativa`.

Quando um aluno faz o cadastro, o Supabase exige que ele clique em um
link de confirmação enviado para o seu e-mail antes de conseguir fazer
login. A página de cadastro já trata disso (mostra a mensagem "confira
seu e-mail" em vez de falhar silenciosamente), então nenhuma ação é
necessária — isso é só para quem gerenciar o site saber que é um
comportamento esperado e não um bug caso uma conta recém-criada não
consiga fazer login imediatamente.

Nunca coloque a chave "service_role" do Supabase em nenhum arquivo
deste repositório — só a chave "anon" (pública) é usada no site.
