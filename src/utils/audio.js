// Audio Engine with Real MP3 Background Music & Smart Autoplay / Mute Controller
// Laxman & Abi Engagement Invitation

let bgAudio = null;
let isPlaying = false;
let userManuallyMuted = false;

export function initMusic() {
  const musicBtn = document.getElementById('music-toggle');
  if (!musicBtn) return;

  // Initialize HTML Audio element with the uploaded music
  if (!bgAudio) {
    bgAudio = new Audio('/audio/bg-music.mp3');
    bgAudio.loop = true;
    bgAudio.volume = 0.65;
    bgAudio.preload = 'auto';
  }

  function updateButtonUI() {
    if (isPlaying) {
      musicBtn.innerHTML = '<span class="music-icon" style="color: var(--gold-light);">♫</span>';
      musicBtn.title = 'Mute Background Music';
      musicBtn.classList.add('playing');
      musicBtn.setAttribute('aria-label', 'Mute Music');
    } else {
      musicBtn.innerHTML = '<span class="music-icon" style="opacity: 0.7;">🔇</span>';
      musicBtn.title = 'Play Background Music';
      musicBtn.classList.remove('playing');
      musicBtn.setAttribute('aria-label', 'Unmute Music');
    }
  }

  async function tryPlay() {
    if (userManuallyMuted || isPlaying || !bgAudio) return;
    try {
      await bgAudio.play();
      isPlaying = true;
      updateButtonUI();
    } catch (err) {
      // Browser autoplay policy blocked; waiting for first interaction
      isPlaying = false;
      updateButtonUI();
    }
  }

  // Attempt instant autoplay on load
  tryPlay();

  // Smart Autoplay fallback on the very first user touch / click / scroll anywhere on the screen
  function handleFirstInteraction() {
    if (!userManuallyMuted && !isPlaying) {
      tryPlay();
    }
    removeInteractionListeners();
  }

  function removeInteractionListeners() {
    window.removeEventListener('click', handleFirstInteraction, true);
    window.removeEventListener('touchstart', handleFirstInteraction, true);
    window.removeEventListener('scroll', handleFirstInteraction, true);
    window.removeEventListener('keydown', handleFirstInteraction, true);
  }

  window.addEventListener('click', handleFirstInteraction, true);
  window.addEventListener('touchstart', handleFirstInteraction, { capture: true, passive: true });
  window.addEventListener('scroll', handleFirstInteraction, { capture: true, passive: true });
  window.addEventListener('keydown', handleFirstInteraction, true);

  // Manual Mute / Unmute Button Toggle
  musicBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!bgAudio) return;

    if (isPlaying) {
      bgAudio.pause();
      isPlaying = false;
      userManuallyMuted = true;
    } else {
      userManuallyMuted = false;
      bgAudio.play().then(() => {
        isPlaying = true;
        updateButtonUI();
      }).catch((e) => console.warn('Audio play error:', e));
    }
    updateButtonUI();
  });

  // Exported global trigger to start audio (e.g. when clicking "Enter Invitation" or "Join Celebration")
  window.playInvitationMusic = tryPlay;
}
