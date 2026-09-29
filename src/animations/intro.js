// 3-Second "Something BIG is happening..." Intro Fade Engine — Laxman & Abi
import gsap from 'gsap';

export function playIntroAnimation(onCompleteCallback) {
  const introEl = document.getElementById('page-transition');
  const skipBtn = document.getElementById('btn-skip-intro');
  const glowText = document.querySelector('.intro-glowing-text');
  const tagline = document.querySelector('.intro-tagline');
  const goldLine = document.querySelector('.gold-line');
  const skipBtnEl = document.querySelector('.skip-intro-btn');

  let hasEnded = false;

  function finishIntro() {
    if (hasEnded) return;
    hasEnded = true;
    gsap.to(introEl, {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.inOut',
      onComplete: () => {
        if (introEl) introEl.style.display = 'none';
        if (onCompleteCallback) onCompleteCallback();
      }
    });
  }

  // Staggered reveal timeline
  const tl = gsap.timeline({ onComplete: finishIntro });

  tl.set(introEl, { opacity: 1 })
    // Gold line draws in from center
    .fromTo(goldLine,
      { width: 0, opacity: 0 },
      { width: '200px', opacity: 1, duration: 0.9, ease: 'power3.inOut' }
    )
    // Main glowing headline fades in and lifts
    .fromTo(glowText,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.85, ease: 'power2.out' },
      '-=0.3'
    )
    // Tagline appears
    .fromTo(tagline,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      '-=0.2'
    )
    // Skip button fades in
    .fromTo(skipBtnEl,
      { opacity: 0 },
      { opacity: 1, duration: 0.5 },
      '-=0.1'
    )
    // Hold for 2 seconds then fade out
    .to({}, { duration: 2.2 })
    .call(finishIntro);

  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      tl.kill();
      finishIntro();
    });
  }
}
