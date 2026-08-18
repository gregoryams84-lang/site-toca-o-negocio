if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  ScrollTrigger.matchMedia({
    '(min-width: 768px)': function () {
      const secao = document.querySelector('.hero-cinematico');
      const trilhos = document.getElementById('hero-trilhos');
      const capitulos = gsap.utils.toArray('.hero-capitulo');
      const barraProgresso = document.getElementById('progresso-barra');

      if (!secao || !trilhos || capitulos.length === 0) return;

      const distanciaHorizontal = () => trilhos.scrollWidth - secao.offsetWidth;

      const tween = gsap.to(trilhos, {
        x: () => -distanciaHorizontal(),
        ease: 'none',
        scrollTrigger: {
          trigger: secao,
          pin: true,
          scrub: 1,
          end: () => '+=' + distanciaHorizontal() * 1.2,
          onUpdate: (self) => {
            if (barraProgresso) {
              barraProgresso.style.width = (self.progress * 100) + '%';
            }
            const indiceAtivo = Math.min(
              capitulos.length - 1,
              Math.floor(self.progress * capitulos.length)
            );
            capitulos.forEach((capitulo, indice) => {
              capitulo.classList.toggle('capitulo-ativo', indice === indiceAtivo);
            });
          },
        },
      });

      return () => {
        if (tween.scrollTrigger) {
          tween.scrollTrigger.kill();
        }
        tween.kill();
      };
    },

    '(max-width: 767px)': function () {
      const capitulos = gsap.utils.toArray('.hero-capitulo');

      if (capitulos.length === 0) return;

      capitulos.forEach((capitulo) => {
        const conteudo = capitulo.querySelector('.hero-capitulo-conteudo');
        gsap.set(conteudo, { opacity: 0, y: 32 });
      });

      const observador = new IntersectionObserver(
        (entradas) => {
          entradas.forEach((entrada) => {
            if (!entrada.isIntersecting) return;
            const capitulo = entrada.target;
            const conteudo = capitulo.querySelector('.hero-capitulo-conteudo');
            capitulo.classList.add('capitulo-ativo');
            gsap.to(conteudo, { opacity: 1, y: 0, duration: 1, ease: 'power2.out', delay: 0.2 });
            observador.unobserve(capitulo);
          });
        },
        { threshold: 0.35 }
      );

      capitulos.forEach((capitulo) => observador.observe(capitulo));

      // Recorta cada "objeto vivo" (engrenagem, selo, tags penduradas...)
      // a partir das coordenadas reais do objeto na foto original (em
      // pixels), calculando como object-fit:cover recorta a imagem no
      // tamanho de tela atual — assim o círculo sempre cai em cima do
      // objeto certo, em qualquer aparelho, sem valor fixo por tela (o
      // que causava o desalinhamento da versão anterior).
      const posicionarObjetosVivos = () => {
        document.querySelectorAll('.hero-capitulo-objeto-vivo').forEach((overlay) => {
          const capitulo = overlay.closest('.hero-capitulo');
          const img = capitulo.querySelector('.hero-capitulo-imagem');
          if (!img || !img.naturalWidth || !capitulo.clientWidth) return;

          const cx = parseFloat(overlay.dataset.cx);
          const cy = parseFloat(overlay.dataset.cy);
          const r = parseFloat(overlay.dataset.r);
          const escala = Math.max(
            capitulo.clientWidth / img.naturalWidth,
            capitulo.clientHeight / img.naturalHeight
          );
          const offsetX = (img.naturalWidth * escala - capitulo.clientWidth) / 2;
          const offsetY = (img.naturalHeight * escala - capitulo.clientHeight) / 2;
          const px = cx * escala - offsetX;
          const py = cy * escala - offsetY;
          const pr = r * escala;

          overlay.style.clipPath = `circle(${pr}px at ${px}px ${py}px)`;
          overlay.style.transformOrigin = `${px}px ${py}px`;
        });
      };

      document.querySelectorAll('.hero-capitulo-imagem').forEach((img) => {
        if (img.complete) posicionarObjetosVivos();
        img.addEventListener('load', posicionarObjetosVivos);
      });
      window.addEventListener('resize', posicionarObjetosVivos);
      posicionarObjetosVivos();

      return () => {
        observador.disconnect();
        window.removeEventListener('resize', posicionarObjetosVivos);
        capitulos.forEach((capitulo) => {
          const conteudo = capitulo.querySelector('.hero-capitulo-conteudo');
          gsap.set(conteudo, { clearProps: 'all' });
          capitulo.classList.remove('capitulo-ativo');
        });
      };
    },
  });
}
