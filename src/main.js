// Master Main Entry Point — Laxman & Abi Cinematic Engagement Website

import './styles/global.css';
import './styles/hero.css';
import './styles/responsive.css';
import gsap from 'gsap';

import { initScene } from './three/scene.js';
import { playIntroAnimation } from './animations/intro.js';
import { initFloatingFlowers } from './animations/flowers.js';
import { initScrollAnimations } from './animations/scroll.js';
import { initParallax } from './animations/parallax.js';
import { initEasterEgg } from './animations/easterEgg.js';

import { initNameModal } from './interactions/nameModal.js';
import { initMobileNav } from './interactions/mobileNav.js';
import { initGlobalClickShower } from './interactions/clickShower.js';

import { initScratchCard } from './components/scratchCard.js';
import { initGuestbook } from './components/guestbook.js';
import { initToastWidget } from './components/toastWidget.js';
import { initCoupleHiWidget } from './components/coupleHiWidget.js';

import { initCountdown } from './utils/countdown.js';
import { initCalendar } from './utils/calendar.js';
import { initMusic } from './utils/audio.js';
import { initShare } from './utils/share.js';
import { initCursor } from './utils/cursor.js';

document.addEventListener('DOMContentLoaded', () => {
  // 3-Second "Something BIG is happening..." Black-Fade Intro
  playIntroAnimation(() => {
    initApp();
  });
});

function initApp() {
  const appEl = document.getElementById('app');
  if (appEl) {
    gsap.to(appEl, { opacity: 1, duration: 1 });
  }

  // WebGL 3D Background Engine
  try {
    initScene();
  } catch (err) {
    console.warn("WebGL Scene note:", err);
  }

  // Mobile Navigation Drawer
  initMobileNav();

  // Name Entry Modal & Personalized Greeting
  initNameModal();

  // Global Click Shower
  initGlobalClickShower();

  // Components
  initScratchCard();
  initGuestbook();
  initToastWidget();
  initCoupleHiWidget();

  // Animation Engines
  initFloatingFlowers();
  initScrollAnimations();
  initParallax();
  initEasterEgg();

  // Utilities
  initCountdown();
  initCalendar();
  initMusic();
  initShare();
  initCursor();
}
