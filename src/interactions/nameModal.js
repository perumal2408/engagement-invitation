// Name Entry Popup Modal & Personalized Greeting — Laxman & Abi
// Asks for the guest's name, stores it, and customizes the bottom-right couple avatar and leave message widget

export function initNameModal() {
  const overlay = document.getElementById('name-modal-overlay');
  const form = document.getElementById('name-modal-form');
  const input = document.getElementById('name-input');
  const skipBtn = document.getElementById('name-modal-skip');

  if (!overlay || !form || !input) return;

  const STORAGE_KEY = 'laxman_abi_guest_name';
  const savedName = localStorage.getItem(STORAGE_KEY);

  // Show name modal after a short delay so the page has revealed
  setTimeout(() => {
    // If not entered yet, popup the modal
    if (!savedName) {
      overlay.classList.add('active');
      input.focus();
    }
  }, 1200);

  // Form Submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = input.value.trim() || 'Guest';
    setGuestName(name);
    overlay.classList.remove('active');

    // Trigger music autoplay if not already playing
    if (typeof window.playInvitationMusic === 'function') {
      window.playInvitationMusic();
    }
  });

  // Skip / Continue as Guest option
  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      overlay.classList.remove('active');
      if (typeof window.playInvitationMusic === 'function') {
        window.playInvitationMusic();
      }
    });
  }

  // Global helper to open name modal anytime (e.g. from guestbook "Change name" link)
  window.openNameModal = () => {
    const current = localStorage.getItem(STORAGE_KEY) || '';
    input.value = current;
    overlay.classList.add('active');
    setTimeout(() => input.focus(), 300);
  };
}

export function setGuestName(name) {
  localStorage.setItem('laxman_abi_guest_name', name);
  // Broadcast event to coupleHiWidget and guestbook
  window.dispatchEvent(new CustomEvent('guestNameChanged', { detail: { name } }));
}
