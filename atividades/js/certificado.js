const LARGURA = 1500;
const ALTURA = 1060;

const COR = {
  verde: '#14513C',
  ambar: '#9C7A2E',
  ambarEscuro: '#4A3410',
  ambarLabel: '#6B4E14',
  terracota: '#6B2A20',
  tinta: '#16191C',
  neutro: '#5B6560',
  fundo: '#FBF8F1',
};

const FONTES = [
  ['Fraunces-Regular.ttf', 'Fraunces', 'normal'],
  ['Fraunces-Bold.ttf', 'Fraunces', 'bold'],
  ['Fraunces-Italic.ttf', 'Fraunces', 'italic'],
  ['Inter-Regular.ttf', 'Inter', 'normal'],
  ['Inter-SemiBold.ttf', 'Inter', 'bold'],
];

async function carregarScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

async function garantirBibliotecas() {
  if (typeof window.jspdf === 'undefined') {
    await carregarScript('https://cdn.jsdelivr.net/npm/jspdf@2/dist/jspdf.umd.min.js');
  }
}

async function paraBase64(url) {
  const resposta = await fetch(url);
  if (!resposta.ok) throw new Error(`Falha ao buscar ${url}: ${resposta.status}`);
  const buffer = await resposta.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binario = '';
  const tamanhoBloco = 8192;
  for (let i = 0; i < bytes.length; i += tamanhoBloco) {
    binario += String.fromCharCode.apply(null, bytes.subarray(i, i + tamanhoBloco));
  }
  return btoa(binario);
}

async function registrarFontes(doc) {
  for (const [arquivo, familia, estilo] of FONTES) {
    const url = new URL(`../fonts/${arquivo}`, import.meta.url).href;
    const base64 = await paraBase64(url);
    doc.addFileToVFS(arquivo, base64);
    doc.addFont(arquivo, familia, estilo);
  }
}

async function carregarImagemBase64(caminhoRelativo) {
  const url = new URL(caminhoRelativo, import.meta.url).href;
  try {
    const base64 = await paraBase64(url);
    const dataUrl = `data:image/png;base64,${base64}`;
    const dimensoes = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
      img.onerror = reject;
      img.src = dataUrl;
    });
    return { dataUrl, ...dimensoes };
  } catch {
    return null;
  }
}

// Replica object-fit:contain: encaixa a imagem dentro da caixa sem distorcer,
// devolvendo a posição/tamanho já centralizados.
function encaixarImagem(imagem, caixaX, caixaY, caixaLargura, caixaAltura) {
  const escala = Math.min(caixaLargura / imagem.w, caixaAltura / imagem.h);
  const largura = imagem.w * escala;
  const altura = imagem.h * escala;
  return {
    x: caixaX + (caixaLargura - largura) / 2,
    y: caixaY + (caixaAltura - altura) / 2,
    largura,
    altura,
  };
}

function definirTexto(doc, { fonte = 'Inter', estilo = 'normal', tamanho, cor, tracking = 0 }) {
  doc.setFont(fonte, estilo);
  doc.setFontSize(tamanho);
  doc.setTextColor(cor);
  doc.setCharSpace(tracking);
}

function textoCentralizado(doc, texto, x, y, opcoes) {
  definirTexto(doc, opcoes);
  doc.text(texto, x, y, { align: 'center' });
}

function textoBicolor(doc, parte1, parte2, xCentro, y, { fonte, estilo, tamanho, tracking = 0, cor1, cor2 }) {
  doc.setFont(fonte, estilo);
  doc.setFontSize(tamanho);
  doc.setCharSpace(tracking);
  const largura1 = doc.getTextWidth(parte1);
  const largura2 = doc.getTextWidth(parte2);
  const xInicio = xCentro - (largura1 + largura2) / 2;
  doc.setTextColor(cor1);
  doc.text(parte1, xInicio, y);
  doc.setTextColor(cor2);
  doc.text(parte2, xInicio + largura1, y);
}

// Quebra um parágrafo com trechos em negrito/normal em linhas, medindo cada
// palavra com a fonte certa antes de decidir onde quebrar.
function quebrarParagrafo(doc, runs, larguraMaxima, tamanho) {
  const itens = [];
  for (const run of runs) {
    const palavras = run.texto.split(' ');
    palavras.forEach((palavra, indice) => {
      if (palavra !== '') itens.push({ palavra, forte: run.forte });
      if (indice < palavras.length - 1) itens.push({ espaco: true });
    });
  }

  function largura(item) {
    doc.setFont('Fraunces', item.forte ? 'bold' : 'normal');
    doc.setFontSize(tamanho);
    return doc.getTextWidth(item.espaco ? ' ' : item.palavra);
  }

  const linhas = [[]];
  let larguraAtual = 0;
  for (const item of itens) {
    const w = largura(item);
    if (!item.espaco && larguraAtual + w > larguraMaxima && linhas[linhas.length - 1].length > 0) {
      linhas.push([]);
      larguraAtual = 0;
    }
    linhas[linhas.length - 1].push(item);
    larguraAtual += w;
  }

  return { linhas, largura };
}

function desenharParagrafo(doc, paragrafo, { xCentro, yTopo, lineHeight, tamanho, corNormal, corForte }) {
  let y = yTopo;
  for (const linha of paragrafo.linhas) {
    const larguraLinha = linha.reduce((soma, item) => soma + paragrafo.largura(item), 0);
    let x = xCentro - larguraLinha / 2;
    for (const item of linha) {
      const w = paragrafo.largura(item);
      if (!item.espaco) {
        doc.setFont('Fraunces', item.forte ? 'bold' : 'normal');
        doc.setFontSize(tamanho);
        doc.setTextColor(item.forte ? corForte : corNormal);
        doc.text(item.palavra, x, y);
      }
      x += w;
    }
    y += lineHeight;
  }
}

function desenharFlourish(doc, xCentro, y, meiaLargura) {
  doc.setDrawColor(COR.ambar);
  doc.setLineWidth(1);
  doc.line(xCentro - meiaLargura, y, xCentro - 10, y);
  doc.line(xCentro + 10, y, xCentro + meiaLargura, y);
  doc.setFillColor(COR.ambar);
  doc.lines([[6, -6], [6, 6], [-6, 6]], xCentro - 6, y, [1, 1], 'F', true);
}

function desenharDivisor(doc, xCentro, y, meiaLargura) {
  doc.setDrawColor(COR.ambar);
  doc.setLineWidth(1);
  doc.line(xCentro - meiaLargura, y, xCentro - 8, y);
  doc.line(xCentro + 8, y, xCentro + meiaLargura, y);
  doc.circle(xCentro, y, 4, 'S');
}

// Ornamento de canto: um "L" verde rente ao canto + um traço diagonal
// dourado mais afastado + um ponto dourado no vértice. sinalX/sinalY
// espelham o desenho pra apontar pro canto certo (1 ou -1).
function desenharOrnamentoCanto(doc, cantoX, cantoY, sinalX, sinalY) {
  const v = (dx, dy) => [cantoX + sinalX * dx, cantoY + sinalY * dy];
  doc.setDrawColor(COR.verde);
  doc.setLineWidth(1.5);
  doc.line(...v(38, 38), ...v(38, 64));
  doc.line(...v(38, 38), ...v(64, 38));
  doc.setDrawColor(COR.ambar);
  doc.setLineWidth(1);
  doc.line(...v(38, 88), ...v(88, 38));
  doc.setFillColor(COR.ambar);
  doc.circle(...v(38, 38), 3.5, 'F');
}

async function desenharCertificado(doc, { nomeAluno, nomeTrilha, cargaHoraria, dataEmissao, codigoVerificacao }) {
  doc.setFillColor(COR.fundo);
  doc.rect(0, 0, LARGURA, ALTURA, 'F');

  doc.saveGraphicsState();
  doc.setGState(new doc.GState({ opacity: 0.035 }));
  doc.setDrawColor(COR.verde);
  doc.setLineWidth(1);
  doc.circle(750, 530, 288, 'S');
  doc.setLineWidth(0.5);
  doc.circle(750, 530, 250, 'S');
  textoCentralizado(doc, 'TN', 750, 550, { fonte: 'Fraunces', estilo: 'bold', tamanho: 150, cor: COR.verde });
  doc.restoreGraphicsState();

  doc.setDrawColor(COR.verde);
  doc.setLineWidth(3);
  doc.rect(26, 26, LARGURA - 52, ALTURA - 52, 'S');
  doc.setDrawColor(COR.ambar);
  doc.setLineWidth(1);
  doc.rect(34, 34, LARGURA - 68, ALTURA - 68, 'S');

  desenharOrnamentoCanto(doc, 34, 34, 1, 1);
  desenharOrnamentoCanto(doc, LARGURA - 34, 34, -1, 1);
  desenharOrnamentoCanto(doc, 34, ALTURA - 34, 1, -1);
  desenharOrnamentoCanto(doc, LARGURA - 34, ALTURA - 34, -1, -1);

  const [crista, selo, assinatura] = await Promise.all([
    carregarImagemBase64('../../img/simbolo-aurea.png'),
    carregarImagemBase64('../../img/selo-autenticidade.png'),
    carregarImagemBase64('../../img/assinatura.png'),
  ]);

  const centroX = LARGURA / 2;
  const larguraConteudo = LARGURA - 300;
  const larguraCorpo = 820;

  doc.setFont('Fraunces', 'italic');
  doc.setFontSize(54);
  const linhasNome = doc.splitTextToSize(nomeAluno, larguraConteudo);
  const alturaNome = linhasNome.length * 59;

  const runsCorpo = [
    { texto: 'concluiu com aproveitamento a trilha ', forte: false },
    { texto: `"${nomeTrilha}"`, forte: true },
    {
      texto: `, com carga horária de ${cargaHoraria} horas, ministrada pela AUREA EDUCACIONAL LTDA, em conformidade com o Decreto nº 5.154/2004.`,
      forte: false,
    },
  ];
  const paragrafo = quebrarParagrafo(doc, runsCorpo, larguraCorpo, 19);
  const alturaCorpo = paragrafo.linhas.length * 33.25;

  const alturaTotal = 124 + 58 + 56 + 78 + 54 + 40 + (alturaNome + 20) + 38 + alturaCorpo;
  let y = (760 - alturaTotal) / 2;

  if (crista) {
    const pos = encaixarImagem(crista, centroX - 48, y, 96, 108);
    doc.addImage(crista.dataUrl, 'PNG', pos.x, pos.y, pos.largura, pos.altura, undefined, 'MEDIUM');
  }
  y += 124;

  textoBicolor(doc, 'TOCA ', 'O NEGÓCIO', centroX, y + 28, {
    fonte: 'Fraunces', estilo: 'bold', tamanho: 34, tracking: 1.2, cor1: COR.verde, cor2: COR.terracota,
  });
  y += 58;

  textoCentralizado(doc, 'AUREA EDUCACIONAL LTDA', centroX, y + 12, { fonte: 'Inter', estilo: 'normal', tamanho: 12, cor: COR.ambarLabel, tracking: 2 });
  y += 56;

  textoCentralizado(doc, 'Certificado de Conclusão', centroX, y + 36, { fonte: 'Fraunces', estilo: 'bold', tamanho: 46, cor: COR.tinta, tracking: 0.2 });
  y += 78;

  desenharFlourish(doc, centroX, y + 10, 110);
  y += 54;

  textoCentralizado(doc, 'CERTIFICAMOS QUE', centroX, y + 12, { fonte: 'Inter', estilo: 'normal', tamanho: 13, cor: COR.neutro, tracking: 1.5 });
  y += 40;

  definirTexto(doc, { fonte: 'Fraunces', estilo: 'italic', tamanho: 54, cor: '#0D3A2A' });
  doc.setCharSpace(0);
  linhasNome.forEach((linha, indice) => {
    doc.text(linha, centroX, y + 44 + indice * 59, { align: 'center' });
  });
  y += alturaNome + 20;

  desenharDivisor(doc, centroX, y + 3, 45);
  y += 38;

  desenharParagrafo(doc, paragrafo, {
    xCentro: centroX,
    yTopo: y + 15,
    lineHeight: 33.25,
    tamanho: 19,
    corNormal: COR.tinta,
    corForte: COR.verde,
  });

  const baseRodape = ALTURA - 78;
  const colAssinaturaX = 280;
  const colSeloX = 750;
  const colDataX = 1220;

  if (assinatura) {
    const pos = encaixarImagem(assinatura, colAssinaturaX - 120, baseRodape - 80, 240, 60);
    doc.addImage(assinatura.dataUrl, 'PNG', pos.x, pos.y, pos.largura, pos.altura, undefined, 'MEDIUM');
  }
  doc.setDrawColor(COR.tinta);
  doc.setLineWidth(1);
  doc.line(colAssinaturaX - 90, baseRodape - 36, colAssinaturaX + 90, baseRodape - 36);
  textoCentralizado(doc, 'AUREA EDUCACIONAL LTDA', colAssinaturaX, baseRodape - 20, { fonte: 'Fraunces', estilo: 'bold', tamanho: 14, cor: COR.verde });
  textoCentralizado(doc, 'Direção — Toca o Negócio', colAssinaturaX, baseRodape - 4, { fonte: 'Inter', estilo: 'normal', tamanho: 11, cor: COR.neutro, tracking: 0.5 });

  if (selo) {
    const pos = encaixarImagem(selo, colSeloX - 95, baseRodape - 190, 190, 190);
    doc.addImage(selo.dataUrl, 'PNG', pos.x, pos.y, pos.largura, pos.altura, undefined, 'MEDIUM');
  }

  textoCentralizado(doc, 'EMITIDO EM', colDataX, baseRodape - 22, { fonte: 'Inter', estilo: 'normal', tamanho: 11, cor: COR.ambarLabel, tracking: 2 });
  textoCentralizado(doc, dataEmissao, colDataX, baseRodape - 4, { fonte: 'Fraunces', estilo: 'normal', tamanho: 15, cor: COR.tinta });

  textoCentralizado(
    doc,
    `CÓDIGO DE VERIFICAÇÃO   ·   ${codigoVerificacao}   ·   tocaonegocio.com.br/verificar`,
    centroX,
    ALTURA - 32,
    { fonte: 'courier', estilo: 'bold', tamanho: 14, cor: COR.ambarEscuro, tracking: 1.2 }
  );
}

export async function criarDocumentoCertificado(dados) {
  await garantirBibliotecas();

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'landscape', unit: 'px', format: [LARGURA, ALTURA] });

  await registrarFontes(doc);
  await desenharCertificado(doc, dados);

  return doc;
}

export async function baixarCertificadoPdf(dados) {
  const doc = await criarDocumentoCertificado(dados);
  doc.save(`certificado-${dados.nomeTrilha.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.pdf`);
}
