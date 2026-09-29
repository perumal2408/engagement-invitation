// \"Raise a Virtual Toast\" — Champagne Clinking Modal + Particle Shower
import { showToast } from '../utils/share.js';

export function initToastWidget() {
  const toastBtn = document.getElementById('btn-raise-toast');
  const countEl = document.getElementById('toast-count-num');

  if (!toastBtn || !countEl) return;

  // Inject clink modal if not present
  if (!document.getElementById('toast-clink-modal')) {
    const modal = document.createElement('div');
    modal.id = 'toast-clink-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-label', 'Champagne Toast Animation');
    modal.innerHTML = `
      <div class="toast-clink-container" id="toast-clink-inner">
        <span class="glass-left" id="glass-left">🥂</span>
        <span class="sparkle-clink-burst" id="clink-sparkle">✨</span>
        <span class="glass-right" id="glass-right">🥂</span>
      </div>
      <div class="toast-clink-words" id="toast-clink-words">
        <p class="script-text clink-cheers-text">Cheers! 🥂</p>
        <p class="clink-subtitle">To Laxman &amp; Abi — with love!</p>
      </div>
    `;
    document.body.appendChild(modal);

    // Click backdrop to close
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeClinkModal();
      }
    });
  }

  const STORAGE_KEY = 'laxman_abi_toast_count';
  let currentCount = parseInt(localStorage.getItem(STORAGE_KEY) || '142', 10);
  countEl.textContent = currentCount;

  toastBtn.addEventListener('click', () => {
    currentCount++;
    countEl.textContent = currentCount;
    localStorage.setItem(STORAGE_KEY, String(currentCount));

    openClinkModal();
    showToast('🥂 Toast Raised! Cheers to Laxman & Abi!');
  });
}

function openClinkModal() {
  const modal = document.getElementById('toast-clink-modal');
  const glassLeft = document.getElementById('glass-left');
  const glassRight = document.getElementById('glass-right');
  const sparkle = document.getElementById('clink-sparkle');
  const words = document.getElementById('toast-clink-words');

  if (!modal) return;

  // Reset positions
  if (glassLeft) glassLeft.style.transform = '';
  if (glassRight) glassRight.style.transform = '';
  if (sparkle) { sparkle.style.opacity = '0'; sparkle.style.transform = 'scale(0)'; }
  if (words) { words.style.opacity = '0'; words.style.transform = 'translateY(20px)'; }

  modal.style.display = 'flex';
  modal.classList.remove('clinking');

  requestAnimationFrame(() => {
    modal.classList.add('active');

    // After entrance, trigger clink after 0.5s
    setTimeout(() => {
      modal.classList.add('clinking');

      // Sparkle + words appear at peak of clink
      setTimeout(() => {
        if (sparkle) {
          sparkle.style.opacity = '1';
          sparkle.style.transform = 'scale(2)';
        }
        if (words) {
          words.style.opacity = '1';
          words.style.transform = 'translateY(0)';
        }
        triggerParticleShower();
      }, 400);

      // Auto close after 3 seconds
      setTimeout(() => {
        closeClinkModal();
      }, 3000);
    }, 500);
  });
}

function closeClinkModal() {
  const modal = document.getElementById('toast-clink-modal');
  if (!modal) return;
  modal.classList.remove('active', 'clinking');
  setTimeout(() => {
    modal.style.display = 'none';
  }, 450);
}

function triggerParticleShower() {
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed; inset: 0; pointer-events: none;
    z-index: 999999; overflow: hidden;
  `;
  document.body.appendChild(container);

  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const symbols = ['🥂', '✨', '🍾', '💖', '🌟', '💛', '🎊', '🎉'];

  for (let i = 0; i < 45; i++) {
    const el = document.createElement('span');
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.cssText = `
      position: absolute;
      left: ${centerX}px;
      top: ${centerY}px;
      font-size: ${Math.random() * 24 + 18}px;
      opacity: 1;
      pointer-events: none;
      transition: all ${1.4 + Math.random() * 0.8}s cubic-bezier(0.1, 1, 0.1, 1);
    `;
    container.appendChild(el);

    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 320 + 120;
    const destX = centerX + Math.cos(angle) * velocity;
    const destY = centerY + Math.sin(angle) * velocity - 120;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transform = `translate(${destX - centerX}px, ${destY - centerY}px) scale(1.5) rotate(${Math.random() * 360}deg)`;
        el.style.opacity = '0';
      });
    });
  }

  setTimeout(() => {
    if (container.parentNode) container.parentNode.removeChild(container);
  }, 2400);
}
