// Global Click Grand Particle Shower — Laxman & Abi

export function initGlobalClickShower() {
  window.addEventListener('click', (e) => {
    // Ignore clicks on input fields or buttons to prevent obscuring text entry
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    spawnClickShower(e.clientX, e.clientY);
  });
}

function spawnClickShower(originX, originY) {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.inset = '0';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '9999999';
  document.body.appendChild(container);

  const count = 12;
  const symbols = ['✨', '🌟', '💖', '💛', '🌸'];

  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.position = 'absolute';
    el.style.left = `${originX}px`;
    el.style.top = `${originY}px`;
    el.style.fontSize = `${Math.random() * 16 + 12}px`;
    el.style.transition = 'all 1s cubic-bezier(0.1, 1, 0.1, 1)';
    el.style.opacity = '1';

    container.appendChild(el);

    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 120 + 40;
    const destX = originX + Math.cos(angle) * distance;
    const destY = originY + Math.sin(angle) * distance - 30;

    requestAnimationFrame(() => {
      el.style.transform = `translate(${destX - originX}px, ${destY - originY}px) scale(1.2) rotate(${Math.random() * 180}deg)`;
      el.style.opacity = '0';
    });
  }

  setTimeout(() => {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }, 1100);
}
