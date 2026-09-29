// Interactive Serial Lights Canopy Module — Laxman & Abi Engagement Invitation

export function initSerialLights() {
  const bulbsGroup = document.getElementById('bulbs-group');
  if (!bulbsGroup) return;

  const count = 36;
  const bulbs = [];

  // Generate bulbs along string paths
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const x = t * 1200;
    
    // Wave 1 path y formula approx: 10 + Math.sin(t * Math.PI * 3) * 35
    const y = 20 + Math.sin(t * Math.PI * 3.5) * 30;

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'light-bulb');
    g.setAttribute('transform', `translate(${x}, ${y})`);

    const circleGlow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circleGlow.setAttribute('class', 'glow');
    circleGlow.setAttribute('cx', '0');
    circleGlow.setAttribute('cy', '0');
    circleGlow.setAttribute('r', '6');

    const cap = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    cap.setAttribute('x', '-2.5');
    cap.setAttribute('y', '-9');
    cap.setAttribute('width', '5');
    cap.setAttribute('height', '5');
    cap.setAttribute('fill', '#444');

    g.appendChild(cap);
    g.appendChild(circleGlow);
    bulbsGroup.appendChild(g);

    bulbs.push({ element: g, circle: circleGlow, x, y, baseOpacity: 0.6 + Math.random() * 0.4 });
  }

  // Organic twinkling loop
  let step = 0;
  function twinkleLoop() {
    step += 0.04;
    bulbs.forEach((bulb, idx) => {
      const flicker = Math.sin(step + idx * 0.7) * 0.25;
      const opacity = Math.min(1, Math.max(0.4, bulb.baseOpacity + flicker));
      bulb.circle.style.opacity = opacity;
    });
    requestAnimationFrame(twinkleLoop);
  }
  twinkleLoop();

  // Mouse & Touch Proximity Ripple Effect
  const canopySvg = document.getElementById('serial-lights-canopy');
  if (!canopySvg) return;

  function handlePointerMove(clientX, clientY) {
    const rect = canopySvg.getBoundingClientRect();
    const svgX = ((clientX - rect.left) / rect.width) * 1200;
    const svgY = ((clientY - rect.top) / rect.height) * 120;

    bulbs.forEach((bulb) => {
      const dist = Math.hypot(bulb.x - svgX, bulb.y - svgY);
      if (dist < 140) {
        bulb.element.classList.add('bright');
      } else {
        bulb.element.classList.remove('bright');
      }
    });
  }

  window.addEventListener('mousemove', (e) => handlePointerMove(e.clientX, e.clientY));
  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  });
}
