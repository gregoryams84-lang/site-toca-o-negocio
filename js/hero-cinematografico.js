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
      const trilhos = document.getElementById('hero-trilhos');
      const capitulos = gsap.utils.toArray('.hero-capitulo');
      const pontos = gsap.utils.toArray('.hero-cinematico-ponto');

      if (!trilhos || capitulos.length === 0) return;

      const observador = new IntersectionObserver(
        (entradas) => {
          entradas.forEach((entrada) => {
            const indice = capitulos.indexOf(entrada.target);
            entrada.target.classList.toggle('capitulo-ativo', entrada.isIntersecting);
            if (entrada.isIntersecting) {
              pontos.forEach((ponto, i) => ponto.classList.toggle('ponto-ativo', i === indice));
            }
          });
        },
        { root: trilhos, threshold: 0.6 }
      );

      capitulos.forEach((capitulo) => observador.observe(capitulo));

      pontos.forEach((ponto, indice) => {
        ponto.addEventListener('click', () => {
          capitulos[indice].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
        });
      });

      return () => {
        observador.disconnect();
      };
    },
  });
}
