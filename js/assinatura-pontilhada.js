(function () {
  const canvas = document.getElementById('assinatura-pontilhada');
  if (!canvas || typeof canvas.getContext !== 'function') return;

  const ctx = canvas.getContext('2d');
  const corPonto = '#9AA39D';
  const corPontoPerto = '#6B2A20';
  const raioPonto = 1.6;
  const raioInfluencia = 42;
  const forcaEmpurrao = 16;
  const rigidezMola = 0.12;
  const amortecimento = 0.82;
  const reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let largura = 0;
  let altura = 0;
  let pontos = [];
  const ponteiro = { x: -9999, y: -9999, ativo: false };

  function gerarPontos() {
    const retangulo = canvas.getBoundingClientRect();
    largura = Math.round(retangulo.width);
    altura = Math.round(retangulo.height);
    if (largura === 0 || altura === 0) return;

    canvas.width = largura * dpr;
    canvas.height = altura * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const auxiliar = document.createElement('canvas');
    auxiliar.width = largura;
    auxiliar.height = altura;
    const ctxAux = auxiliar.getContext('2d');
    const tamanhoFonte = Math.min(altura * 0.6, largura * 0.088);
    ctxAux.fillStyle = '#000';
    ctxAux.font = `700 ${tamanhoFonte}px 'Inter', system-ui, sans-serif`;
    ctxAux.textAlign = 'center';
    ctxAux.textBaseline = 'middle';
    ctxAux.fillText('TOCA O NEGÓCIO', largura / 2, altura / 2);

    const dados = ctxAux.getImageData(0, 0, largura, altura).data;
    const passo = 4;
    const novosPontos = [];
    for (let y = 0; y < altura; y += passo) {
      for (let x = 0; x < largura; x += passo) {
        const indice = (y * largura + x) * 4 + 3;
        if (dados[indice] > 128) {
          novosPontos.push({ hx: x, hy: y, x: x, y: y, vx: 0, vy: 0 });
        }
      }
    }
    pontos = novosPontos;
  }

  function desenhar() {
    ctx.clearRect(0, 0, largura, altura);
    for (let i = 0; i < pontos.length; i++) {
      const ponto = pontos[i];
      const dx = ponto.x - ponteiro.x;
      const dy = ponto.y - ponteiro.y;
      const distancia = Math.sqrt(dx * dx + dy * dy) || 1;

      if (ponteiro.ativo && distancia < raioInfluencia) {
        const forca = (1 - distancia / raioInfluencia) * forcaEmpurrao;
        ponto.vx += (dx / distancia) * forca;
        ponto.vy += (dy / distancia) * forca;
      }

      ponto.vx += (ponto.hx - ponto.x) * rigidezMola;
      ponto.vy += (ponto.hy - ponto.y) * rigidezMola;
      ponto.vx *= amortecimento;
      ponto.vy *= amortecimento;
      ponto.x += ponto.vx;
      ponto.y += ponto.vy;

      const perto = ponteiro.ativo && distancia < raioInfluencia * 1.3;
      ctx.fillStyle = perto ? corPontoPerto : corPonto;
      ctx.beginPath();
      ctx.arc(ponto.x, ponto.y, raioPonto, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function loop() {
    desenhar();
    requestAnimationFrame(loop);
  }

  function atualizarPonteiro(clientX, clientY) {
    const retangulo = canvas.getBoundingClientRect();
    ponteiro.x = clientX - retangulo.left;
    ponteiro.y = clientY - retangulo.top;
    ponteiro.ativo = true;
  }

  canvas.addEventListener('pointermove', (evento) => {
    atualizarPonteiro(evento.clientX, evento.clientY);
  });

  canvas.addEventListener('pointerleave', () => {
    ponteiro.ativo = false;
  });

  canvas.addEventListener(
    'touchmove',
    (evento) => {
      if (evento.touches[0]) {
        atualizarPonteiro(evento.touches[0].clientX, evento.touches[0].clientY);
      }
    },
    { passive: true }
  );

  canvas.addEventListener('touchend', () => {
    ponteiro.ativo = false;
  });

  gerarPontos();

  if (reduzMovimento) {
    desenhar();
  } else {
    requestAnimationFrame(loop);
  }

  let redimensionarTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(redimensionarTimeout);
    redimensionarTimeout = setTimeout(() => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      gerarPontos();
    }, 200);
  });
})();
