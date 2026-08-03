# Site Toca o Negócio

Site institucional da AUREA EDUCACIONAL LTDA (marca Toca o Negócio).
HTML e CSS puros — não tem build, não tem servidor, não precisa instalar nada.

## Como editar os textos

- Os textos da página principal estão em `index.html`.
- Os textos de Termos de Uso estão em `termos.html`.
- Os textos de Política de Privacidade estão em `privacidade.html`.
- As cores, fontes e espaçamentos estão em `css/estilo.css`.

Para editar um texto, abra o arquivo `.html` correspondente em qualquer
editor (inclusive o Bloco de Notas), procure a frase que quer mudar, e
troque. Cada bloco de texto fica entre uma tag de abertura (tipo `<p>`) e
uma de fechamento (`</p>`) — troque só o texto entre elas, sem apagar as
tags.

## Atenção ao rodapé

O rodapé (razão social, CNPJ, endereço, telefone, e-mail) aparece **três
vezes**, uma em cada página (`index.html`, `termos.html`,
`privacidade.html`), porque o site não usa nenhuma ferramenta para
compartilhar esse trecho automaticamente. Se for atualizar telefone,
endereço ou e-mail, é preciso editar **as três páginas**, senão elas ficam
diferentes entre si.

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
