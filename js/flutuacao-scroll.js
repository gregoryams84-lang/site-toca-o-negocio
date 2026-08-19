if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  const reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reduzMovimento) {
    const icones = gsap.utils.toArray('.passo-card-icone');
    icones.forEach((icone, indice) => {
      gsap.to(icone, {
        y: indice % 2 === 0 ? -16 : -26,
        ease: 'none',
        scrollTrigger: {
          trigger: icone,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });

    const numeros = gsap.utils.toArray('.trilha-item-numero');
    numeros.forEach((numero, indice) => {
      gsap.to(numero, {
        y: indice % 2 === 0 ? -14 : -22,
        ease: 'none',
        scrollTrigger: {
          trigger: numero,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });
  }
}
