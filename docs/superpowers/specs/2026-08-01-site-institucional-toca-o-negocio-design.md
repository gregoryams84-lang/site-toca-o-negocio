# Site institucional — Toca o Negócio (Áurea Educacional)

Data: 2026-08-01

## Objetivo

Site institucional estático, hospedado no GitHub Pages com domínio próprio
(`tocaonegocio.com.br`), para a marca "Toca o Negócio" da empresa AUREA
EDUCACIONAL LTDA. Duplo propósito:

1. Apresentar a escola de cursos livres online para pequenos empreendedores.
2. Servir de comprovação para a verificação de empresa no Meta Business
   (Facebook) — exige site com domínio próprio e razão social/CNPJ visíveis
   na página principal.

Este é um projeto separado do app de atividades do curso (que será publicado
depois em `/atividades/`, caminho que este projeto não deve usar).

## Dados da empresa (confirmados via cartão CNPJ)

- Razão social: **AUREA EDUCACIONAL LTDA**
- Nome fantasia: AUREA EDUCACIONAL
- Marca comercial usada no site: **Toca o Negócio**
- CNPJ: **67.140.776/0001-88**
- Endereço: Rua Pedro Vieira da Silva, 64, Apto 73 — Jardim Santa Genebra,
  Campinas/SP — CEP 13.080-570
- Telefone: (19) 9666-1703 / (19) 9286-2037 (placeholder atual — será trocado
  depois; manter fácil de editar em um só lugar por página)
- E-mail de contato do site: contato@tocaonegocio.com.br
- Domínio: tocaonegocio.com.br

Nota: os CNAEs secundários do CNPJ incluem "Educação superior -
graduação/pós-graduação" e educação técnica/tecnológica — isso é registro
administrativo amplo e **não** autoriza o site a mencionar graduação, pós-
graduação ou reconhecimento do MEC. A regra de conteúdo abaixo vale
independente do CNAE registrado.

## O que a empresa faz

Escola de cursos livres online para pequenos empreendedores brasileiros —
pessoas que tocam o próprio negócio sozinhas ou com um funcionário. Cursos
práticos organizados em quatro trilhas:

1. Vender pela internet e pelo WhatsApp
2. Uso de inteligência artificial no negócio
3. Formalização e obrigações da empresa
4. Gestão financeira

Aulas em vídeo, com atividades e material de apoio. Ao final, certificado de
conclusão de curso livre.

## Restrição de conteúdo (regra dura, não estilística)

- Cursos livres, **não regulados pelo MEC**.
- Proibido em qualquer parte do site: sugerir reconhecimento/autorização/
  chancela do MEC; usar as palavras "faculdade", "graduação", "pós-
  graduação", "diploma", "instituto de ensino superior".
- Termo correto do certificado: "certificado de conclusão de curso livre".
- Proibido prometer resultado financeiro ("fature X", "ganhe dinheiro",
  "lucro garantido") em qualquer texto.
- Motivo: afirmação de reconhecimento pelo MEC em curso livre pode
  configurar propaganda enganosa.

## Stack

- HTML e CSS puros, sem framework, sem build step.
- JavaScript só se for indispensável (não é esperado ser necessário para
  nada do escopo atual).
- Funciona abrindo o arquivo direto (`file://`) e servido pelo GitHub Pages
  — por isso o rodapé é duplicado como HTML estático em cada página, em vez
  de injetado via `fetch()` (que quebraria em `file://` por CORS).
- Mobile-first, testado em viewport de 360px, sem rolagem horizontal.
- Sem dependências externas, exceto fontes do Google Fonts.
- Peso da página inicial abaixo de 300 KB.
- Contraste alto, conforme WCAG AA.

## Estrutura de arquivos

```
site-toca-o-negocio/
├── index.html
├── termos.html
├── privacidade.html
├── css/
│   └── estilo.css
├── img/                    (formas/ícones simples, sem fotos de banco)
├── CNAME                   → "tocaonegocio.com.br"
├── .nojekyll
├── README.md                → como editar textos e publicar
└── docs/
    └── publicar-github-pages.md   → passo a passo DNS/HTTPS + checklist Meta
```

`/atividades/` fica deliberadamente livre (uso futuro, fora deste projeto).

## Conteúdo — página principal (`index.html`)

Cinco seções, nesta ordem:

1. **Topo** — nome da marca, frase do que é e para quem, botão de contato.
   Sem carrossel, sem vídeo de fundo.
2. **Para quem é** — quem toca o próprio negócio sozinho ou com um
   funcionário, sem condição de contratar um especialista por área.
3. **As trilhas** — quatro blocos curtos (um por trilha), em verbos de
   ação, não em substantivos abstratos.
4. **Como funciona** — aulas curtas em vídeo, atividade prática, material
   de apoio em PDF, certificado de conclusão de curso livre.
5. **Contato** — e-mail, telefone, cidade (Campinas/SP). Sem formulário
   nesta versão.

No `<head>`, comentário marcando onde colar a meta tag de verificação de
domínio da Meta:

```html
<!-- META DOMAIN VERIFICATION — colar aqui a tag fornecida pelo Gerenciador de Negócios -->
```

## Rodapé (em todas as páginas, texto selecionável, nunca imagem)

```html
<footer class="rodape">
  <div class="rodape-conteudo">
    <p class="rodape-razao-social">AUREA EDUCACIONAL LTDA</p>
    <p>CNPJ 67.140.776/0001-88</p>
    <p>Rua Pedro Vieira da Silva, 64, Apto 73 — Jardim Santa Genebra, Campinas/SP — CEP 13.080-570</p>
    <p>Telefone: (19) 9666-1703 / (19) 9286-2037 · E-mail: <a href="mailto:contato@tocaonegocio.com.br">contato@tocaonegocio.com.br</a></p>
    <p class="rodape-links">
      <a href="/termos.html">Termos de uso</a> · <a href="/privacidade.html">Política de privacidade</a>
    </p>
    <p class="rodape-legal">
      Cursos livres de capacitação profissional, nos termos do Decreto nº 5.154/2004.
      Não constituem curso de graduação ou pós-graduação.
    </p>
    <p class="rodape-copyright">© 2026 Toca o Negócio — AUREA EDUCACIONAL LTDA</p>
  </div>
</footer>
```

Requisitos: fonte legível (não reduzida), sem acordeão/colapso, alto
contraste. É o que a Meta lê para confirmar a relação site↔empresa.

## Termos de uso (`termos.html`)

Conteúdo real e específico (não texto genérico), cobrindo:

- Objeto: acesso a curso online.
- Forma de acesso.
- Prazo de acesso: **12 meses a partir da data de matrícula** (valor
  padrão assumido — marcar para revisão/ajuste).
- Política de reembolso: direito de arrependimento de 7 dias (CDC, compra
  online).
- Proibição de compartilhamento de login e redistribuição do conteúdo.
- Emissão de certificado de curso livre (não de graduação/pós).
- Comentário HTML ao final avisando que o texto deve ser revisado por
  advogado antes da publicação.
- Mesmo rodapé institucional.

## Política de privacidade (`privacidade.html`)

- Dados coletados: nome, e-mail, telefone, dados de pagamento (processados
  pela plataforma de pagamento, não armazenados pelo site).
- Finalidade de cada coleta.
- Base legal conforme LGPD.
- Compartilhamento com plataforma de pagamento e hospedagem.
- Tempo de retenção.
- Direitos do titular e canal para exercê-los.
- Comentário HTML ao final avisando revisão por advogado.
- Mesmo rodapé institucional.

## Design

- Sem emoji.
- Corpo do texto mínimo 16px.
- Paleta sóbria, uma única cor de destaque.
- Sem imagens de banco genéricas; elementos visuais via formas/tipografia.
- Alto contraste (WCAG AA).

## Entregáveis adicionais

1. `README.md` — como editar textos e publicar alterações, em linguagem
   simples.
2. `docs/publicar-github-pages.md` — passo a passo: publicar no GitHub
   Pages, apontar domínio do registro.br (registros DNS a criar), ativar
   HTTPS.
3. Checklist final (dentro do mesmo doc ou README) do que precisa estar
   correto antes de abrir a verificação na Meta.

## Critérios de aceite

- Razão social e CNPJ visíveis como texto na página principal, sem
  rolagem excessiva.
- Funciona em viewport de 360px sem rolagem horizontal.
- Nenhuma menção a MEC, graduação, pós-graduação ou reconhecimento
  oficial em nenhuma página.
- Nenhuma promessa de resultado financeiro.
- Rodapé institucional idêntico nas três páginas.
- Página inicial abaixo de 300 KB.

## Configuração de projeto

- Pasta: `C:\Users\robot\site-toca-o-negocio`
- Git local inicializado; sem remoto GitHub ainda — conexão documentada no
  README/`docs/publicar-github-pages.md` para quando o repo for criado.
- Telefone atual é placeholder por decisão do usuário (será trocado depois
  do lançamento) — manter em local único e fácil de editar por página.
