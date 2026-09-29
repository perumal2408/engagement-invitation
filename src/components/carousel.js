// Interactive Image Carousel — Manual-Only, Right Arrow = Forward
// Laxman & Abi Engagement Website

export function initCarousel() {
  const track = document.getElementById('carousel-track');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const dotsContainer = document.getElementById('carousel-dots');

  if (!track) return;

  const slides = Array.from(track.children);
  if (slides.length === 0) return;

  let currentIndex = 0;

  // Create dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.className = `carousel-dot ${idx === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
      dot.addEventListener('click', () => goToSlide(idx));
      dotsContainer.appendChild(dot);
    });
  }

  function goToSlide(index) {
    // Clamp with wrap-around
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;

    currentIndex = index;

    // Scroll right: positive index = translate left (slides move right visually)
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Update dots
    if (dotsContainer) {
      const dots = Array.from(dotsContainer.children);
      dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
    }
  }

  // ❮ = go back (previous) — scroll left visually
  if (prevBtn) {
    prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
  }

  // ❯ = go forward (next) — scroll right visually  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
  }

  // Touch/swipe support — swipe left = go right, swipe right = go left
  let touchStartX = 0;
  let touchStartY = 0;

  track.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    if (e.changedTouches.length > 0) {
      const diffX = e.changedTouches[0].clientX - touchStartX;
      const diffY = Math.abs(e.changedTouches[0].clientY - touchStartY);

      // Only handle horizontal swipes
      if (Math.abs(diffX) > 50 && diffY < 60) {
        if (diffX < 0) {
          // Swiped left → go to next (scroll right)
          goToSlide(currentIndex + 1);
        } else {
          // Swiped right → go to previous (scroll left)
          goToSlide(currentIndex - 1);
        }
      }
    }
  }, { passive: true });

  // Auto-play is DISABLED (manual-only per user request)
}
