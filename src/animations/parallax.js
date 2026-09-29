// Video-like 3D Layer Parallax Module — Laxman & Abi Engagement Invitation

export function initParallax() {
  const frames = document.querySelectorAll('.artwork-container, .glass-panel');
  if (frames.length === 0 || window.innerWidth <= 768) return;

  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 16;
    const y = (e.clientY / window.innerHeight - 0.5) * 16;

    frames.forEach((frame) => {
      frame.style.transform = `perspective(1000px) rotateY(${x * 0.4}deg) rotateX(${-y * 0.4}deg)`;
    });
  });

  window.addEventListener('mouseleave', () => {
    frames.forEach((frame) => {
      frame.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
    });
  });
}
