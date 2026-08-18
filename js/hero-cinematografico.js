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

      return () => {
        observador.disconnect();
        capitulos.forEach((capitulo) => {
          const conteudo = capitulo.querySelector('.hero-capitulo-conteudo');
          gsap.set(conteudo, { clearProps: 'all' });
          capitulo.classList.remove('capitulo-ativo');
        });
      };
    },
  });
}
