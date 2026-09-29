// Audio Utility — Laxman & Abi Engagement Invitation
// Auto-starts ambient music on first user interaction (browser autoplay policy)

let audioCtx = null;
let isPlaying = false;
let masterGain = null;
let timerId = null;
let autoStarted = false;

export function initMusic() {
  const musicBtn = document.getElementById('music-toggle');
  if (!musicBtn) return;

  // Update button icon state
  function updateButton() {
    if (isPlaying) {
      musicBtn.innerHTML = '<span class="music-icon" style="color: var(--gold-light);">♫</span>';
      musicBtn.title = 'Pause Music';
      musicBtn.classList.add('playing');
    } else {
      musicBtn.innerHTML = '<span class="music-icon">🔇</span>';
      musicBtn.title = 'Play Music';
      musicBtn.classList.remove('playing');
    }
  }

  // Auto-start on first interaction (click, scroll, touch anywhere)
  function autoStartOnInteraction() {
    if (autoStarted) return;
    autoStarted = true;
    document.removeEventListener('click', autoStartOnInteraction, true);
    document.removeEventListener('scroll', autoStartOnInteraction, true);
    document.removeEventListener('touchstart', autoStartOnInteraction, true);

    if (!isPlaying) {
      startAmbientSynth();
      isPlaying = true;
      updateButton();
    }
  }

  // Listen for first interaction
  document.addEventListener('click', autoStartOnInteraction, true);
  document.addEventListener('scroll', autoStartOnInteraction, true);
  document.addEventListener('touchstart', autoStartOnInteraction, { capture: true, passive: true });

  // Manual toggle
  musicBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Don't double-fire the auto-start
    if (isPlaying) {
      stopAmbientSynth();
      isPlaying = false;
    } else {
      startAmbientSynth();
      isPlaying = true;
    }
    updateButton();
    autoStarted = true; // Mark as handled
  });
}

function startAmbientSynth() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }

  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
  masterGain.gain.linearRampToValueAtTime(0.14, audioCtx.currentTime + 2);
  masterGain.connect(audioCtx.destination);

  // Gentle romantic pentatonic chimes in D Major (warm & celebratory)
  const frequencies = [
    293.66, // D4
    329.63, // E4
    369.99, // F#4
    440.00, // A4
    493.88, // B4
    587.33, // D5
    659.25, // E5
  ];

  function playNextChime() {
    if (!isPlaying || !audioCtx || !masterGain) return;

    const freq = frequencies[Math.floor(Math.random() * frequencies.length)];
    const osc = audioCtx.createOscillator();
    const noteGain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    // Also add a soft harmonics oscillator for warmth
    const osc2 = audioCtx.createOscillator();
    const noteGain2 = audioCtx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, audioCtx.currentTime);
    noteGain2.gain.setValueAtTime(0.001, audioCtx.currentTime);
    noteGain2.gain.exponentialRampToValueAtTime(0.04, audioCtx.currentTime + 0.6);
    noteGain2.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 3.5);
    osc2.connect(noteGain2);
    noteGain2.connect(masterGain);
    osc2.start();
    osc2.stop(audioCtx.currentTime + 3.5);

    noteGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    noteGain.gain.exponentialRampToValueAtTime(0.18, audioCtx.currentTime + 0.5);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 4.0);

    osc.connect(noteGain);
    noteGain.connect(masterGain);

    osc.start();
    osc.stop(audioCtx.currentTime + 4.0);

    timerId = setTimeout(playNextChime, 1400 + Math.random() * 1200);
  }

  playNextChime();
}

function stopAmbientSynth() {
  if (timerId) {
    clearTimeout(timerId);
    timerId = null;
  }
  if (masterGain && audioCtx) {
    masterGain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
  }
  masterGain = null;
}
