// Couple Waving Hi Widget — Bottom-Right Popup
// Features personalized guest name messages and interactive avatar

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

  function buildMessages() {
    const userName = localStorage.getItem('laxman_abi_guest_name') || '';
    if (userName) {
      return [
        `✨ Hi ${userName}! We are so excited to see you! ✨`,
        `💖 ${userName}, thank you for celebrating our special day!`,
        `🥂 Counting down the days to celebrate with you, ${userName}!`,
        `🌸 Every blessing from you means the world to us!`,
        `🌟 21 October 2026 — See you at Eden Garden, ${userName}!`
      ];
    }
    return [
      '✨ Hi! We are so excited to see you! ✨',
      '🌸 Every moment with you means the world to us!',
      '🥂 Counting down the days to celebrate together!',
      '💖 Thank you for being part of our story!',
      '🌟 21 October 2026 — Save the date!'
    ];
  }

  let messages = buildMessages();
  let msgIndex = 0;
  let isVisible = false;

  function showWidget() {
    if (isVisible) return;
    isVisible = true;

    // Refresh messages with current stored name
    messages = buildMessages();

    if (bubbleEl) {
      bubbleEl.textContent = messages[msgIndex % messages.length];
      msgIndex++;
    }

    widget.classList.add('active');

    // Hold for 6 seconds
    setTimeout(() => {
      widget.classList.remove('active');
      isVisible = false;
    }, 6000);
  }

  // Listen for real-time guest name updates
  window.addEventListener('guestNameChanged', (e) => {
    messages = buildMessages();
    if (bubbleEl && e.detail?.name) {
      bubbleEl.textContent = `✨ Hi ${e.detail.name}! Welcome to our celebration! ✨`;
    }
    showWidget();
  });

  // First show 3 seconds after page loads
  setTimeout(showWidget, 3500);

  // Then recurring every 18 seconds
  setInterval(() => {
    showWidget();
  }, 18000);

  // Clicking widget triggers a jump and advances message
  widget.addEventListener('click', () => {
    messages = buildMessages();
    if (bubbleEl) {
      bubbleEl.textContent = messages[msgIndex % messages.length];
      msgIndex++;
    }
  });
}
