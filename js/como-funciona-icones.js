if (typeof Vivus !== 'undefined' && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  const idsIcones = ['icone-aula', 'icone-atividade', 'icone-material', 'icone-certificado'];
  const secao = document.getElementById('como-funciona');
  const todosPresentes = idsIcones.every((id) => document.getElementById(id));

  if (secao && todosPresentes) {
    function desenharEmSequencia(indice) {
      if (indice >= idsIcones.length) return;
      new Vivus(
        idsIcones[indice],
        { type: 'oneByOne', duration: 120, start: 'manual' },
        () => desenharEmSequencia(indice + 1)
      ).play();
    }

    ScrollTrigger.create({
      trigger: secao,
      start: 'top 85%',
      once: true,
      onEnter: () => desenharEmSequencia(0),
    });
  }
}
