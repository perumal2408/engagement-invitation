// HTML5 Canvas Scratch-to-Reveal Card — Responsive Full-Width
// Laxman & Abi Engagement Invitation

export function initScratchCard() {
  const canvas = document.getElementById('scratch-canvas');
  const wrapper = canvas?.parentElement;
  if (!canvas || !wrapper) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let isDrawing = false;
  let isRevealed = false;

  // Set canvas resolution to match the actual rendered wrapper size
  function resizeCanvas() {
    const rect = wrapper.getBoundingClientRect();
    const W = Math.round(rect.width);
    const H = Math.round(rect.height);

    if (W < 10 || H < 10) return;

    // Scale for device pixel ratio (retina sharpness)
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.scale(dpr, dpr);

    if (!isRevealed) {
      fillGoldFoil(W, H);
    }
  }

  // Render Golden Foil Coating with hint text
  function fillGoldFoil(W, H) {
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0,   '#fff7d6');
    grad.addColorStop(0.3, '#f6e297');
    grad.addColorStop(0.6, '#d4af37');
    grad.addColorStop(1,   '#9a7314');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Subtle shimmer lines
    ctx.globalAlpha = 0.18;
    for (let i = 0; i < W; i += 18) {
      const lineGrad = ctx.createLinearGradient(i, 0, i + 8, H);
      lineGrad.addColorStop(0, 'rgba(255,255,255,0)');
      lineGrad.addColorStop(0.5, 'rgba(255,255,255,0.6)');
      lineGrad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = lineGrad;
      ctx.fillRect(i, 0, 8, H);
    }
    ctx.globalAlpha = 1;

    // Scratch hint
    ctx.fillStyle = 'rgba(64, 2, 6, 0.85)';
    ctx.font = `bold ${Math.max(13, W * 0.028)}px Montserrat, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✨ Scratch Here to Reveal ✨', W / 2, H / 2);
  }

  // Initial render (wait for layout to settle)
  setTimeout(resizeCanvas, 80);
  window.addEventListener('resize', () => {
    if (!isRevealed) resizeCanvas();
  });

  function scratch(x, y) {
    if (isRevealed) return;
    const W = parseInt(canvas.style.width);
    const H = parseInt(canvas.style.height);

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    // Radius proportional to canvas width so it feels good on mobile too
    const radius = Math.max(18, W * 0.04);
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    checkProgress(W, H);
  }

  function getPos(e, canvas) {
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : e;
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    };
  }

  // Mouse events
  canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    scratch(...Object.values(getPos(e, canvas)));
  });
  canvas.addEventListener('mousemove', (e) => {
    if (isDrawing) scratch(...Object.values(getPos(e, canvas)));
  });
  window.addEventListener('mouseup', () => { isDrawing = false; });

  // Touch events
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    isDrawing = true;
    scratch(...Object.values(getPos(e, canvas)));
  }, { passive: false });

  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (isDrawing) scratch(...Object.values(getPos(e, canvas)));
  }, { passive: false });

  window.addEventListener('touchend', () => { isDrawing = false; });

  function checkProgress(W, H) {
    if (isRevealed) return;
    const dpr = window.devicePixelRatio || 1;
    const imgData = ctx.getImageData(0, 0, (W || 700) * dpr, (H || 240) * dpr);
    let clearPixels = 0;

    for (let i = 3; i < imgData.data.length; i += 4) {
      if (imgData.data[i] < 50) clearPixels++;
    }

    const total = imgData.data.length / 4;
    if (clearPixels / total > 0.45) {
      isRevealed = true;
      // Smooth fade-out of the gold foil layer
      let alpha = 1;
      const fade = setInterval(() => {
        alpha -= 0.08;
        if (alpha <= 0) {
          clearInterval(fade);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          return;
        }
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = alpha;
        const W2 = parseInt(canvas.style.width);
        const H2 = parseInt(canvas.style.height);
        fillGoldFoil(W2, H2);
        ctx.globalAlpha = 1;
      }, 30);
    }
  }
}
