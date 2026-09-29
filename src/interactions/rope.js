// Spring-Damped Interactive SVG Bezier Rope Physics Engine — Laxman & Abi

export function initInteractiveRope() {
  const ropeSvg = document.getElementById('continuous-rope');
  const pathBg = document.getElementById('rope-path-bg');
  const pathMain = document.getElementById('rope-path-main');
  const pathCore = document.getElementById('rope-path-core');
  const hintPill = document.getElementById('tug-hint');

  if (!ropeSvg || !pathBg || !pathMain || !pathCore) return;

  // Initial Control State
  let targetDeltaX = 0;
  let targetDeltaY = 0;
  let currentDeltaX = 0;
  let currentDeltaY = 0;

  let hasInteracted = false;

  // Viewport Anchor Coordinates (Width: 1200, Height: 400)
  const startX = 50;
  const startY = 220;
  const endX = 1150;
  const endY = 220;

  function updateRopePaths() {
    // Spring Damping Interpolation
    currentDeltaX += (targetDeltaX - currentDeltaX) * 0.12;
    currentDeltaY += (targetDeltaY - currentDeltaY) * 0.12;

    // Bezier Control Points
    const cp1x = 400 + currentDeltaX;
    const cp1y = 220 + currentDeltaY + Math.abs(currentDeltaX) * 0.2;
    const cp2x = 800 + currentDeltaX;
    const cp2y = 220 + currentDeltaY + Math.abs(currentDeltaX) * 0.2;

    const d = `M ${startX},${startY} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${endX},${endY}`;

    pathBg.setAttribute('d', d);
    pathMain.setAttribute('d', d);
    pathCore.setAttribute('d', d);

    requestAnimationFrame(updateRopePaths);
  }

  updateRopePaths();

  // Mouse Interactivity
  const heroWrapper = document.querySelector('.panoramic-hero-wrapper');
  if (heroWrapper) {
    heroWrapper.addEventListener('mousemove', (e) => {
      const rect = heroWrapper.getBoundingClientRect();
      const relativeX = (e.clientX - rect.left) / rect.width; // 0 (left) to 1 (right)
      const relativeY = (e.clientY - rect.top) / rect.height;

      // Tug Left towards Laxman & Abi if X < 0.5, Tug Right towards Friends if X > 0.5
      targetDeltaX = (relativeX - 0.5) * 80;
      targetDeltaY = (relativeY - 0.5) * 30;

      if (!hasInteracted) {
        hasInteracted = true;
        if (hintPill) hintPill.style.opacity = '0';
      }
    });

    heroWrapper.addEventListener('mouseleave', () => {
      targetDeltaX = 0;
      targetDeltaY = 0;
    });
  }

  // Mobile Touch Drag Interactivity
  let touchStartX = 0;
  let isTouching = false;

  ropeSvg.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
      isTouching = true;
      touchStartX = e.touches[0].clientX;
      if (!hasInteracted) {
        hasInteracted = true;
        if (hintPill) hintPill.style.opacity = '0';
      }
    }
  });

  ropeSvg.addEventListener('touchmove', (e) => {
    if (isTouching && e.touches.length > 0) {
      const diffX = e.touches[0].clientX - touchStartX;
      targetDeltaX = Math.min(65, Math.max(-65, diffX * 0.8));
    }
  });

  ropeSvg.addEventListener('touchend', () => {
    isTouching = false;
    // Elastic Recoil to Center
    targetDeltaX = 0;
    targetDeltaY = 0;
  });
}
