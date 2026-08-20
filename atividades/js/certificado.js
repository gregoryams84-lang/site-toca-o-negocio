const LARGURA = 1500;
const ALTURA = 1060;

function montarHtmlCertificado({ nomeAluno, nomeTrilha, cargaHoraria, dataEmissao, codigoVerificacao }) {
  return `
    <style>
      #certificado-gerado {
        width: ${LARGURA}px;
        height: ${ALTURA}px;
        background:
          radial-gradient(ellipse at center, rgba(255,255,255,0.4) 0%, rgba(20,81,60,0.05) 100%),
          #FBF8F1;
        position: relative;
        box-sizing: border-box;
        font-family: 'Inter', Arial, sans-serif;
        overflow: hidden;
      }
      #certificado-gerado .marca-dagua {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 640px;
        height: 640px;
        transform: translate(-50%, -50%);
        opacity: 0.05;
        z-index: 0;
      }
      #certificado-gerado .moldura-out {
        position: absolute;
        inset: 26px;
        border: 3px solid #14513C;
      }
      #certificado-gerado .moldura-in {
        position: absolute;
        inset: 34px;
        border: 1px solid #9C7A2E;
      }
      #certificado-gerado .conteudo {
        position: relative;
        z-index: 1;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 0 150px;
        box-sizing: border-box;
      }
      #certificado-gerado .crista { width: 64px; height: 72px; object-fit: contain; margin-bottom: 14px; }
      #certificado-gerado .marca {
        font-family: 'Fraunces', Georgia, serif;
        font-size: 24px;
        font-weight: 700;
        letter-spacing: 3px;
        color: #14513C;
        margin: 0 0 4px 0;
      }
      #certificado-gerado .marca span { color: #6B2A20; }
      #certificado-gerado .rotulo {
        font-family: 'Inter', sans-serif;
        font-size: 12px;
        letter-spacing: 5px;
        color: #6B4E14;
        text-transform: uppercase;
        margin: 0 0 26px 0;
      }
      #certificado-gerado h1.titulo {
        font-family: 'Fraunces', Georgia, serif;
        font-size: 46px;
        font-weight: 700;
        color: #16191C;
        margin: 0 0 16px 0;
        letter-spacing: 0.5px;
      }
      #certificado-gerado .flourish { width: 220px; height: 20px; margin-bottom: 34px; }
      #certificado-gerado .certificamos-que {
        font-family: 'Inter', sans-serif;
        font-size: 13px;
        letter-spacing: 3px;
        text-transform: uppercase;
        color: #5B6560;
        margin: 0 0 14px 0;
      }
      #certificado-gerado .nome-aluno {
        font-family: 'Fraunces', Georgia, serif;
        font-style: italic;
        font-weight: 600;
        font-size: 54px;
        color: #0D3A2A;
        margin: 0 0 20px 0;
        line-height: 1.1;
      }
      #certificado-gerado .divisor { width: 90px; height: 14px; margin-bottom: 24px; }
      #certificado-gerado .corpo {
        font-family: 'Fraunces', Georgia, serif;
        font-size: 19px;
        line-height: 1.75;
        color: #16191C;
        max-width: 820px;
        margin: 0;
      }
      #certificado-gerado .corpo strong { color: #14513C; font-weight: 600; }
      #certificado-gerado .rodape-certificado {
        position: absolute;
        z-index: 1;
        bottom: 78px;
        left: 150px;
        right: 150px;
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
      }
      #certificado-gerado .assinatura { text-align: center; width: 260px; }
      #certificado-gerado .assinatura img.assinatura-img {
        height: 60px;
        max-width: 240px;
        object-fit: contain;
        display: block;
        margin: 0 auto 4px auto;
      }
      #certificado-gerado .assinatura .linha { border-top: 1px solid #16191C; margin-bottom: 8px; }
      #certificado-gerado .assinatura .nome-empresa {
        font-family: 'Fraunces', Georgia, serif;
        font-weight: 700;
        font-size: 14px;
        color: #14513C;
        margin: 0;
      }
      #certificado-gerado .assinatura .cargo {
        font-size: 11px;
        color: #5B6560;
        margin: 2px 0 0 0;
        letter-spacing: 0.5px;
      }
      #certificado-gerado .bloco-data { text-align: center; width: 260px; }
      #certificado-gerado .bloco-data .rotulo-data {
        font-size: 11px;
        letter-spacing: 2px;
        text-transform: uppercase;
        color: #6B4E14;
        margin: 0 0 8px 0;
      }
      #certificado-gerado .bloco-data .valor-data {
        font-family: 'Fraunces', Georgia, serif;
        font-size: 15px;
        color: #16191C;
        margin: 0;
      }
      #certificado-gerado .selo-wrap { width: 260px; display: flex; justify-content: center; }
      #certificado-gerado .selo { position: relative; width: 168px; height: 168px; }
      #certificado-gerado .codigo-verificacao {
        position: absolute;
        z-index: 1;
        bottom: 32px;
        left: 0;
        right: 0;
        text-align: center;
        font-family: 'Courier New', monospace;
        font-size: 14px;
        font-weight: 700;
        color: #4A3410;
        letter-spacing: 2px;
        margin: 0;
      }
    </style>
    <div id="certificado-gerado">
      <svg class="marca-dagua" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="90" fill="none" stroke="#14513C" stroke-width="1"/>
        <circle cx="100" cy="100" r="78" fill="none" stroke="#14513C" stroke-width="0.5"/>
        <text x="100" y="112" text-anchor="middle" font-family="Fraunces, serif" font-weight="700" font-size="70" fill="#14513C">TN</text>
      </svg>

      <div class="moldura-out"></div>
      <div class="moldura-in"></div>

      <svg width="130" height="130" style="position:absolute; top:34px; left:34px;" viewBox="0 0 130 130">
        <path d="M4,4 L4,50 Q4,10 50,4 Z" fill="none" stroke="#9C7A2E" stroke-width="2"/>
        <path d="M4,4 L4,30" stroke="#14513C" stroke-width="2"/>
        <path d="M4,4 L30,4" stroke="#14513C" stroke-width="2"/>
        <circle cx="4" cy="4" r="4" fill="#9C7A2E"/>
      </svg>
      <svg width="130" height="130" style="position:absolute; top:34px; right:34px; transform:scaleX(-1);" viewBox="0 0 130 130">
        <path d="M4,4 L4,50 Q4,10 50,4 Z" fill="none" stroke="#9C7A2E" stroke-width="2"/>
        <path d="M4,4 L4,30" stroke="#14513C" stroke-width="2"/>
        <path d="M4,4 L30,4" stroke="#14513C" stroke-width="2"/>
        <circle cx="4" cy="4" r="4" fill="#9C7A2E"/>
      </svg>
      <svg width="130" height="130" style="position:absolute; bottom:34px; left:34px; transform:scaleY(-1);" viewBox="0 0 130 130">
        <path d="M4,4 L4,50 Q4,10 50,4 Z" fill="none" stroke="#9C7A2E" stroke-width="2"/>
        <path d="M4,4 L4,30" stroke="#14513C" stroke-width="2"/>
        <path d="M4,4 L30,4" stroke="#14513C" stroke-width="2"/>
        <circle cx="4" cy="4" r="4" fill="#9C7A2E"/>
      </svg>
      <svg width="130" height="130" style="position:absolute; bottom:34px; right:34px; transform:scale(-1,-1);" viewBox="0 0 130 130">
        <path d="M4,4 L4,50 Q4,10 50,4 Z" fill="none" stroke="#9C7A2E" stroke-width="2"/>
        <path d="M4,4 L4,30" stroke="#14513C" stroke-width="2"/>
        <path d="M4,4 L30,4" stroke="#14513C" stroke-width="2"/>
        <circle cx="4" cy="4" r="4" fill="#9C7A2E"/>
      </svg>

      <div class="conteudo">
        <img class="crista" src="../img/simbolo-aurea.png" alt="" crossorigin="anonymous">
        <p class="marca">TOCA <span>O NEGÓCIO</span></p>
        <p class="rotulo">Aurea Educacional LTDA</p>
        <h1 class="titulo">Certificado de Conclusão</h1>
        <svg class="flourish" viewBox="0 0 220 20">
          <line x1="0" y1="10" x2="85" y2="10" stroke="#9C7A2E" stroke-width="1"/>
          <line x1="135" y1="10" x2="220" y2="10" stroke="#9C7A2E" stroke-width="1"/>
          <path d="M100 10 L110 4 L120 10 L110 16 Z" fill="#9C7A2E"/>
        </svg>

        <p class="certificamos-que">Certificamos que</p>
        <p class="nome-aluno">${nomeAluno}</p>

        <svg class="divisor" viewBox="0 0 90 14">
          <line x1="0" y1="7" x2="38" y2="7" stroke="#9C7A2E" stroke-width="1"/>
          <line x1="52" y1="7" x2="90" y2="7" stroke="#9C7A2E" stroke-width="1"/>
          <circle cx="45" cy="7" r="4" fill="none" stroke="#9C7A2E" stroke-width="1"/>
        </svg>

        <p class="corpo">
          concluiu com aproveitamento a trilha <strong>"${nomeTrilha}"</strong>,
          com carga horária de <strong>${cargaHoraria} horas</strong>, ministrada pela AUREA EDUCACIONAL LTDA,
          em conformidade com o Decreto nº 5.154/2004.
        </p>
      </div>

      <div class="rodape-certificado">
        <div class="assinatura">
          <img class="assinatura-img" src="../img/assinatura.png" alt="" onerror="this.style.display='none'">
          <div class="linha"></div>
          <p class="nome-empresa">AUREA EDUCACIONAL LTDA</p>
          <p class="cargo">Direção — Toca o Negócio</p>
        </div>

        <div class="selo-wrap">
          <svg class="selo" viewBox="0 0 160 160">
            <defs>
              <radialGradient id="ouroBase" cx="38%" cy="26%" r="78%">
                <stop offset="0%" stop-color="#FFF9E8"/>
                <stop offset="16%" stop-color="#FBEAB4"/>
                <stop offset="42%" stop-color="#E8C876"/>
                <stop offset="70%" stop-color="#B8912F"/>
                <stop offset="100%" stop-color="#5E4210"/>
              </radialGradient>
              <linearGradient id="anelBorda" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FFEFC2"/>
                <stop offset="30%" stop-color="#B8912F"/>
                <stop offset="55%" stop-color="#6B4E14"/>
                <stop offset="80%" stop-color="#D9AE4E"/>
                <stop offset="100%" stop-color="#FFEFC2"/>
              </linearGradient>
              <filter id="sombraSelo" x="-40%" y="-40%" width="180%" height="180%">
                <feDropShadow dx="0" dy="7" stdDeviation="7" flood-color="#000" flood-opacity="0.4"/>
              </filter>
              <path id="curvaTopo" d="M 22 82 A 58 58 0 0 1 138 82" fill="none"/>
              <path id="curvaBase" d="M 34 116 A 48 48 0 0 0 126 116" fill="none"/>
            </defs>

            <g fill="#C9A23F" stroke="#5E4210" stroke-width="0.6">
              <ellipse cx="6" cy="94" rx="7.5" ry="3.3" transform="rotate(-20 6 94)"/>
              <ellipse cx="1" cy="82" rx="7.5" ry="3.3" transform="rotate(-45 1 82)"/>
              <ellipse cx="0" cy="68" rx="7" ry="3.1" transform="rotate(-72 0 68)"/>
              <ellipse cx="4" cy="55" rx="6.5" ry="2.9" transform="rotate(-98 4 55)"/>
              <ellipse cx="12" cy="44" rx="6" ry="2.7" transform="rotate(-122 12 44)"/>
              <ellipse cx="154" cy="94" rx="7.5" ry="3.3" transform="rotate(20 154 94)"/>
              <ellipse cx="159" cy="82" rx="7.5" ry="3.3" transform="rotate(45 159 82)"/>
              <ellipse cx="160" cy="68" rx="7" ry="3.1" transform="rotate(72 160 68)"/>
              <ellipse cx="156" cy="55" rx="6.5" ry="2.9" transform="rotate(98 156 55)"/>
              <ellipse cx="148" cy="44" rx="6" ry="2.7" transform="rotate(122 148 44)"/>
            </g>

            <g filter="url(#sombraSelo)">
              <circle cx="80" cy="80" r="70" fill="url(#anelBorda)"/>
              <circle cx="80" cy="80" r="63" fill="url(#ouroBase)" stroke="#4A3410" stroke-width="1"/>
              <circle cx="80" cy="80" r="63" fill="none" stroke="#FFF3CE" stroke-width="1.5" stroke-dasharray="0.4,3.2" opacity="0.3"/>
              <ellipse cx="58" cy="50" rx="30" ry="15" fill="#FFFFFF" opacity="0.4" transform="rotate(-28 58 50)"/>
              <circle cx="80" cy="80" r="50" fill="none" stroke="#FFF6DC" stroke-width="1.1" stroke-dasharray="1.4,3.2" opacity="0.85"/>
              <circle cx="80" cy="80" r="46" fill="none" stroke="#5E4210" stroke-width="0.6" opacity="0.5"/>
              <text font-family="Fraunces, serif" font-weight="700" font-size="12.5" letter-spacing="2.5" fill="#4A3410">
                <textPath href="#curvaTopo" startOffset="50%" text-anchor="middle">CERTIFICADO</textPath>
              </text>
              <text font-family="Fraunces, serif" font-weight="700" font-size="11" letter-spacing="3" fill="#4A3410">
                <textPath href="#curvaBase" startOffset="50%" text-anchor="middle">AUTÊNTICO</textPath>
              </text>
              <path d="M80 68 L84.5 79 L96 79 L86.7 86 L90 97 L80 90 L70 97 L73.3 86 L64 79 L75.5 79 Z" fill="#4A3410"/>
            </g>
          </svg>
        </div>

        <div class="bloco-data">
          <p class="rotulo-data">Emitido em</p>
          <p class="valor-data">${dataEmissao}</p>
        </div>
      </div>

      <p class="codigo-verificacao">CÓDIGO DE VERIFICAÇÃO&nbsp;&nbsp;·&nbsp;&nbsp;${codigoVerificacao}&nbsp;&nbsp;·&nbsp;&nbsp;tocaonegocio.com.br/verificar</p>
    </div>
  `;
}

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
  if (typeof window.html2canvas === 'undefined') {
    await carregarScript('https://cdn.jsdelivr.net/npm/html2canvas@1/dist/html2canvas.min.js');
  }
  if (typeof window.jspdf === 'undefined') {
    await carregarScript('https://cdn.jsdelivr.net/npm/jspdf@2/dist/jspdf.umd.min.js');
  }
}

export async function baixarCertificadoPdf(dados) {
  await garantirBibliotecas();

  const wrapper = document.createElement('div');
  wrapper.style.position = 'fixed';
  wrapper.style.left = '-9999px';
  wrapper.style.top = '0';
  wrapper.innerHTML = montarHtmlCertificado(dados);
  document.body.appendChild(wrapper);

  try {
    const alvo = wrapper.querySelector('#certificado-gerado');
    const canvas = await window.html2canvas(alvo, { scale: 2, useCORS: true });
    const imagem = canvas.toDataURL('image/png');

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [LARGURA, ALTURA] });
    pdf.addImage(imagem, 'PNG', 0, 0, LARGURA, ALTURA);
    pdf.save(`certificado-${dados.nomeTrilha.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.pdf`);
  } finally {
    document.body.removeChild(wrapper);
  }
}
