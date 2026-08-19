(function () {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cursor = document.createElement('div');
  cursor.className = 'cursor-personalizado';
  cursor.setAttribute('aria-hidden', 'true');
  document.body.appendChild(cursor);

  let mouseX = -100;
  let mouseY = -100;
  let cursorX = -100;
  let cursorY = -100;

  window.addEventListener('mousemove', (evento) => {
    mouseX = evento.clientX;
    mouseY = evento.clientY;
    cursor.classList.add('cursor-visivel');
  });

  function atualizar() {
    cursorX += (mouseX - cursorX) * 0.18;
    cursorY += (mouseY - cursorY) * 0.18;
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    requestAnimationFrame(atualizar);
  }
  requestAnimationFrame(atualizar);

  const seletorInterativo = 'a, button, .plano-card, .trilha-item, input, textarea, label';

  document.addEventListener('mouseover', (evento) => {
    if (evento.target.closest(seletorInterativo)) {
      cursor.classList.add('cursor-grande');
    }
  });

  document.addEventListener('mouseout', (evento) => {
    if (evento.target.closest(seletorInterativo)) {
      cursor.classList.remove('cursor-grande');
    }
  });

  document.addEventListener('mouseleave', () => {
    cursor.classList.remove('cursor-visivel');
  });
})();
