# Bing Webmaster Tools e IndexNow

Data: 2026-08-22. Extensão do que já foi feito pro Google
(`seo/medicao.md`) pro Bing — a segunda maior busca do Brasil, hoje entre
6% e 8,5% do mercado, com crescimento puxado pela integração do Copilot
no Windows/Edge/Microsoft 365. É um público menor, mas geralmente
corporativo e com poder de compra acima da média.

## Por que vale a pena, com franqueza

Ranking no Bing não é uma meta realista maior que no Google — pelo
contrário, é um mercado bem menor. O motivo real de fazer isso agora é
outro: o Bing é a base de busca do **Copilot** (assistente de IA da
Microsoft), e desde 2026 o próprio Bing Webmaster Tools separa um
relatório de **citações em resposta de IA**, diferente do relatório de
busca tradicional. Ou seja: aparecer bem indexado no Bing tem chance de
te colocar dentro de uma resposta do Copilot, não só num link de busca —
e isso é baixo esforço, porque a maior parte do trabalho técnico
(sitemap, dados estruturados, título/meta) já está feita pro Google e o
Bing lê os mesmos padrões.

## Passo 1 — Verificar o site (sem duplicar trabalho)

Como o site já está verificado no Google Search Console, o Bing tem uma
importação direta que evita todo processo de verificação de novo:

1. Acesse [bing.com/webmasters](https://www.bing.com/webmasters).
2. Clique em **"Importar"** (a opção de importar do Google Search
   Console).
3. Faça login com a **mesma conta Google** usada no Search Console.
4. O Bing mostra a lista de sites dessa conta — escolha
   `tocaonegocio.com.br` e clique em **"Importar"**.
5. Pronto — o site fica verificado no Bing sem precisar de tag HTML nem
   registro DNS novo.

## Passo 2 — Conferir o sitemap

A importação já costuma trazer o `sitemap.xml` junto. Confirme em
**Sitemaps** no menu lateral que `https://tocaonegocio.com.br/sitemap.xml`
aparece lá — se não aparecer, adicione manualmente, igual foi feito no
Search Console.

## Passo 3 — IndexNow (indexação quase instantânea)

O Bing (e também Yandex) suportam um protocolo chamado **IndexNow**: em
vez de esperar o rastreador visitar o site sozinho, você avisa
diretamente que uma página mudou ou foi criada, e a indexação acontece
em minutos, não semanas. O Google ainda não participa desse protocolo,
então isso vale só pro Bing (e é de graça, sem conta nem ferramenta
nova).

### O que já está pronto

Já criei a chave exigida pelo protocolo e publiquei no site, na raiz,
como o protocolo exige:

```
https://tocaonegocio.com.br/f93fba542967bed3768a7ebf54efe855b09f032847c11bd69c509e6c0eacb458.txt
```

### Como avisar o Bing agora, pras páginas que já existem

Cole cada um destes links na barra do navegador uma vez (ou peça pra eu
rodar) — isso já avisa o Bing sobre as 7 páginas atuais:

```
https://www.bing.com/indexnow?url=https://tocaonegocio.com.br/&key=f93fba542967bed3768a7ebf54efe855b09f032847c11bd69c509e6c0eacb458
https://www.bing.com/indexnow?url=https://tocaonegocio.com.br/trilhas/venda-pelo-whatsapp/&key=f93fba542967bed3768a7ebf54efe855b09f032847c11bd69c509e6c0eacb458
https://www.bing.com/indexnow?url=https://tocaonegocio.com.br/trilhas/gestao-financeira/&key=f93fba542967bed3768a7ebf54efe855b09f032847c11bd69c509e6c0eacb458
https://www.bing.com/indexnow?url=https://tocaonegocio.com.br/trilhas/ia-no-negocio/&key=f93fba542967bed3768a7ebf54efe855b09f032847c11bd69c509e6c0eacb458
https://www.bing.com/indexnow?url=https://tocaonegocio.com.br/trilhas/formalizacao-da-empresa/&key=f93fba542967bed3768a7ebf54efe855b09f032847c11bd69c509e6c0eacb458
https://www.bing.com/indexnow?url=https://tocaonegocio.com.br/termos.html&key=f93fba542967bed3768a7ebf54efe855b09f032847c11bd69c509e6c0eacb458
https://www.bing.com/indexnow?url=https://tocaonegocio.com.br/privacidade.html&key=f93fba542967bed3768a7ebf54efe855b09f032847c11bd69c509e6c0eacb458
```

### Da próxima vez que publicar uma página nova

É só trocar a URL no mesmo padrão acima e visitar o link uma vez (ou
pedir pra eu fazer, quando publicarmos junto). Não precisa fazer isso
pra mudança pequena de texto — só quando uma página nova entra no ar.

## Métricas para acompanhar (além das do Google)

- **Cliques e impressões no Bing** — aba "Desempenho de pesquisa" no
  Bing Webmaster Tools, mesmo conceito do Search Console.
- **Relatório de desempenho de IA** (novidade 2026) — mostra quando o
  conteúdo do site aparece citado numa resposta do Copilot. Métrica nova
  e ainda não comparável em volume nenhuma referência histórica —
  acompanhar como sinal de presença, não como meta numérica ainda.

## O que não muda

Todas as restrições de conteúdo do projeto (sem "faculdade"/"graduação"/
"diploma", sem promessa de resultado financeiro, sem prova social
inventada) valem exatamente igual pro que o Copilot pode citar — uma
resposta de IA mal formulada com base no seu conteúdo é tão prejudicial
quanto um texto errado na própria página.
