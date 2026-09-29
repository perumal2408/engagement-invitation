// Couple Waving Hi Widget — Bottom-Right Popup
// Appears every 20 seconds, holds for 5 seconds, jump-in effect

export function initCoupleHiWidget() {
  // Inject HTML into body if not already there
  if (!document.getElementById('couple-hi-widget')) {
    const widget = document.createElement('div');
    widget.id = 'couple-hi-widget';
    widget.setAttribute('aria-label', 'Couple waving hi');
    widget.innerHTML = `
      <div class="dream-bubble" id="dream-bubble-text">
        ✨ Hi! We are so excited to see you! ✨
      </div>
      <img
        src="/images/couple-hi.png"
        alt="Laxman and Abi waving hi"
        class="couple-hi-avatar"
        id="couple-hi-img"
      />
    `;
    document.body.appendChild(widget);
  }

  const widget = document.getElementById('couple-hi-widget');
  const bubbleEl = document.getElementById('dream-bubble-text');
  if (!widget) return;

  const userName = localStorage.getItem('laxman_abi_guest_name') || '';

  const messages = [
    userName ? `✨ Hi ${userName}! We are so glad you're here! ✨` : '✨ Hi! We are so excited to see you! ✨',
    '🌸 Every moment with you means the world to us!',
    '🥂 Counting down the days to celebrate together!',
    '💖 Thank you for being part of our story!',
    '🌟 21 October 2026 — Save the date!',
  ];

  let msgIndex = 0;
  let isVisible = false;

  function showWidget() {
    if (isVisible) return;
    isVisible = true;

    // Cycle through messages
    if (bubbleEl) {
      bubbleEl.textContent = messages[msgIndex % messages.length];
      msgIndex++;
    }

    widget.classList.add('active');

    // Hide after 5 seconds
    setTimeout(() => {
      widget.classList.remove('active');
      isVisible = false;
    }, 5000);
  }

  // First show after 4 seconds (after page loads)
  setTimeout(showWidget, 4000);

  // Then every 20 seconds
  setInterval(() => {
    // Also update name in case they entered it later
    const freshName = localStorage.getItem('laxman_abi_guest_name') || '';
    if (freshName && bubbleEl) {
      messages[0] = `✨ Hi ${freshName}! We are so glad you're here! ✨`;
    }
    showWidget();
  }, 20000);

  // Allow clicking to dismiss
  widget.addEventListener('click', () => {
    widget.classList.remove('active');
    isVisible = false;
  });
}
