// Hero & Interactive Tug-of-War Module — Laxman & Abi Engagement Invitation
import gsap from 'gsap';

export function initHeroTugOfWar() {
  const ropeOverlay = document.getElementById('interactive-rope');
  const coupleFrame = document.getElementById('couple-art-frame');
  const groupFrame = document.getElementById('group-art-frame');
  const teaserRope = document.getElementById('teaser-rope');

  if (!coupleFrame) return;

  // Interactive Tug-of-War Rope Physics
  window.addEventListener('mousemove', (e) => {
    const rect = coupleFrame.getBoundingClientRect();
    if (
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom
    ) {
      const relativeX = (e.clientX - rect.left) / rect.width;
      
      // If hovering towards Laxman's side (left < 0.5), shift rope left (-14px)
      // If hovering towards Abi's side (right > 0.5), shift rope right (+14px)
      const shiftX = (relativeX - 0.5) * 28;
      
      if (ropeOverlay) {
        ropeOverlay.style.transform = `translateY(-50%) translateX(${shiftX}px)`;
      }
      if (teaserRope) {
        teaserRope.style.transform = `translateX(${shiftX * 0.7}px)`;
      }
    } else {
      if (ropeOverlay) ropeOverlay.style.transform = 'translateY(-50%) translateX(0px)';
      if (teaserRope) teaserRope.style.transform = 'translateX(0px)';
    }
  });

  // Touch drag tug-of-war interaction on mobile
  let startTouchX = 0;
  window.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) startTouchX = e.touches[0].clientX;
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0 && ropeOverlay) {
      const deltaX = e.touches[0].clientX - startTouchX;
      const clampedDelta = Math.min(25, Math.max(-25, deltaX));
      ropeOverlay.style.transform = `translateY(-50%) translateX(${clampedDelta}px)`;
    }
  });
}
