// Name Entry Popup Modal & Personalized Welcome Banner — Laxman & Abi

export function initNameModal() {
  const overlay = document.getElementById('name-modal-overlay');
  const form = document.getElementById('name-modal-form');
  const input = document.getElementById('name-input');
  const welcomeBanner = document.getElementById('welcome-user-banner');

  if (!overlay || !form || !input || !welcomeBanner) return;

  const STORAGE_KEY = 'laxman_abi_guest_name';
  const savedName = localStorage.getItem(STORAGE_KEY);

  if (savedName) {
    showWelcomeGreeting(savedName);
  } else {
    // Raise modal 1s after intro black fade
    setTimeout(() => {
      overlay.classList.add('active');
    }, 1000);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = input.value.trim() || 'Guest';
    localStorage.setItem(STORAGE_KEY, name);

    overlay.classList.remove('active');
    showWelcomeGreeting(name);
  });

  function showWelcomeGreeting(name) {
    welcomeBanner.textContent = `✨ Hi ${name}! Welcome to our celebration ✨`;
    welcomeBanner.style.display = 'block';
  }
}
