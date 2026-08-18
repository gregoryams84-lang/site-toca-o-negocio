if (typeof Vivus !== 'undefined' && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  const idsIcones = ['icone-aula', 'icone-atividade', 'icone-material', 'icone-certificado'];

  idsIcones.forEach((id, indice) => {
    const elemento = document.getElementById(id);
    if (!elemento) return;

    const vivus = new Vivus(id, { type: 'oneByOne', duration: 120, start: 'manual' });

    ScrollTrigger.create({
      trigger: elemento,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        setTimeout(() => vivus.play(), indice * 150);
      },
    });
  });
}
