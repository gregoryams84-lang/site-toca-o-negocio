# Medição — Search Console, Analytics e métricas

Passo a passo pra quem não é desenvolvedor. Faça na ordem.

## 1. Verificar propriedade no Google Search Console

O site usa domínio próprio (`tocaonegocio.com.br`), então a verificação mais
estável é por **domínio** (cobre `http://`, `https://`, com e sem `www` de
uma vez só), via registro DNS no registro.br.

1. Acesse [search.google.com/search-console](https://search.google.com/search-console) e entre com a conta Google que vai administrar o site.
2. Clique em "Adicionar propriedade" → escolha o tipo **"Domínio"** (não "Prefixo do URL") → digite `tocaonegocio.com.br` (sem `https://`, sem `www`).
3. O Google mostra um registro **TXT** para colar no DNS. Copie o valor mostrado (começa com `google-site-verification=...`).
4. Entre no [registro.br](https://registro.br), na área "Meus domínios" → `tocaonegocio.com.br` → **DNS** (se o DNS for gerenciado pelo GitHub Pages ou por outro provedor, o registro TXT precisa ser criado lá em vez do registro.br — confira onde o domínio aponta hoje antes de seguir).
5. Crie um registro do tipo **TXT**, no host raiz (`@` ou em branco), colando o valor copiado do Search Console.
6. Volte ao Search Console e clique em "Verificar". Pode levar de alguns minutos a algumas horas pra o DNS propagar — se falhar na primeira tentativa, espere um pouco e tente de novo.

### Enviar o sitemap

1. Já verificado, no menu lateral do Search Console clique em **"Sitemaps"**.
2. No campo "Adicionar novo sitemap", digite `sitemap.xml` (o Search Console já sabe que é `https://tocaonegocio.com.br/sitemap.xml`).
3. Clique em "Enviar". O status muda pra "Êxito" depois que o Google conseguir ler o arquivo — normalmente em minutos, mas a indexação de cada página leva mais tempo (ver seção 5).

## 2. Google Analytics 4 (GA4)

O site já está preparado tecnicamente pro GA4 (arquivo `js/consentimento.js`),
mas falta um dado real: o **ID de medição**.

1. Acesse [analytics.google.com](https://analytics.google.com) e crie uma conta (se ainda não tiver) e, dentro dela, uma **propriedade** para "Toca o Negócio", fuso horário Brasil, moeda Real.
2. Ao criar a propriedade, o Google pede um "fluxo de dados" — escolha **Web**, coloque a URL `https://tocaonegocio.com.br` e o nome "Toca o Negócio".
3. Depois de criar o fluxo, o Google mostra um **ID de medição** no formato `G-XXXXXXXXXX`. Copie esse valor.
4. Abra o arquivo `js/consentimento.js` do site, ache a linha:
   ```
   var ID_MEDICAO = 'G-XXXXXXXXXX'; // TODO: trocar pelo ID real do GA4 antes de publicar
   ```
   e troque `G-XXXXXXXXXX` pelo ID real que você copiou. Salve e publique.

**Sem esse passo, o site funciona normalmente, só não envia dado nenhum pro GA4** — o banner de cookies aparece e funciona, mas "aceitar" não tem efeito até o ID real estar configurado. Não há urgência: dá pra fazer esse passo quando quiser começar a olhar dado de comportamento no site.

## 3. Aviso de cookies

Já implementado: um banner aparece na primeira visita, oferecendo "Aceitar" ou
"Recusar". O GA4 só carrega depois do aceite — antes disso, nenhum cookie de
medição é criado. Essa exigência existe porque o GA4 usa cookies; se um dia
você trocar para uma ferramenta de analytics sem cookies (ex.: Plausible), o
banner deixa de ser obrigatório, mas isso é uma mudança técnica separada, não
incluída nesta implementação.

## 4. Métricas para acompanhar nos primeiros 6 meses

**Acompanhar (no Search Console, aba "Desempenho"):**
- Impressões e cliques por página — mostra se o Google já está mostrando suas páginas nos resultados de busca, mesmo antes de alguém clicar.
- Páginas indexadas vs. enviadas (aba "Páginas") — confirma que as 7 páginas do `sitemap.xml` foram realmente lidas e aceitas pelo Google.
- Posição média das palavras de cauda longa listadas em `seo/palavras-chave.md` — é ali que um site novo tem chance real de aparecer.

**Ignorar por enquanto:**
- Posição das palavras de "cabeça" (`inteligência artificial`, `mei`, etc.) — não são alvo realista nos primeiros meses, ver `seo/palavras-chave.md`.
- Número absoluto de sessões no GA4 — com pouco tráfego, esse número oscila demais pra dizer alguma coisa (5 visitas vs. 15 visitas numa semana não significa "triplicou o interesse").
- Taxa de rejeição — pouco acionável sem volume de visitas suficiente pra ser confiável.

## 5. Prazo honesto

- **1 a 4 semanas** depois de enviar o sitemap: primeiras impressões aparecendo no Search Console (o Google rastreou e indexou as páginas, mas isso não é a mesma coisa que aparecer bem posicionado).
- **2 a 6 meses**: é o horizonte realista pra alguma palavra de cauda longa (as da Camada 1 de `seo/palavras-chave.md`) começar a aparecer em posição relevante, e mesmo assim depende de continuar publicando os artigos de apoio do backlog.
- **Termos de cabeça**: fora do horizonte de 6 meses. Não é uma questão de configuração técnica — é volume de conteúdo e autoridade de domínio acumulados ao longo de tempo bem maior (ver `seo/limitacoes.md`).
