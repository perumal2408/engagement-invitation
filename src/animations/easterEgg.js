// Easter Egg Module — Laxman & Abi Engagement Invitation
import { showToast } from '../utils/share.js';

export function initEasterEgg() {
  const ampersand = document.getElementById('easter-egg-ampersand');
  if (!ampersand) return;

  let clickCount = 0;
  let timer = null;

  ampersand.addEventListener('click', (e) => {
    clickCount++;
    if (timer) clearTimeout(timer);

    if (clickCount === 3) {
      triggerGoldenHeartBurst(e.clientX, e.clientY);
      showToast("💖 Laxman & Abi send you lots of love!");
      clickCount = 0;
    } else {
      timer = setTimeout(() => { clickCount = 0; }, 1500);
    }
  });
}

function triggerGoldenHeartBurst(originX, originY) {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100vw';
  container.style.height = '100vh';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '999999';
  document.body.appendChild(container);

  const count = 40;
  const symbols = ['✨', '💛', '💖', '💍', '🌟', '🌹'];

  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.position = 'absolute';
    el.style.left = `${originX}px`;
    el.style.top = `${originY}px`;
    el.style.fontSize = `${Math.random() * 22 + 16}px`;
    el.style.transition = 'all 1.6s cubic-bezier(0.1, 1, 0.1, 1)';
    el.style.opacity = '1';

    container.appendChild(el);

    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 280 + 120;
    const destX = originX + Math.cos(angle) * velocity;
    const destY = originY + Math.sin(angle) * velocity - 120;

    requestAnimationFrame(() => {
      el.style.transform = `translate(${destX - originX}px, ${destY - originY}px) scale(1.4) rotate(${Math.random() * 360}deg)`;
      el.style.opacity = '0';
    });
  }

  setTimeout(() => {
    document.body.removeChild(container);
  }, 1700);
}
