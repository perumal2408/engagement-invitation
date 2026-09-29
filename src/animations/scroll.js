// GSAP ScrollTrigger Master Controller — Laxman & Abi Engagement Invitation
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { updateSceneOnScroll } from '../three/scene.js';

gsap.registerPlugin(ScrollTrigger);

export function initScrollAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // 1. Red World to Outdoor Lawn World Shift Transition
  ScrollTrigger.create({
    trigger: '#story',
    start: 'top 75%',
    onEnter: () => document.body.classList.add('lawn-active'),
    onLeaveBack: () => document.body.classList.remove('lawn-active')
  });

  // 2. Hero Couple Frame Scale Reveal
  gsap.from('#couple-art-frame', {
    scale: 0.92,
    opacity: 0,
    duration: 1.2,
    ease: 'power3.out'
  });

  // 3. Hero Group Frame Entrance
  gsap.from('#group-art-frame', {
    scrollTrigger: {
      trigger: '#hero-group',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    },
    y: 60,
    opacity: 0,
    duration: 1,
    ease: 'power2.out'
  });

  // 4. Teaser Section Reveal ("SOMETHING BIG IS WAITING...")
  gsap.from('.teaser-title', {
    scrollTrigger: {
      trigger: '#teaser',
      start: 'top 75%'
    },
    scale: 0.85,
    opacity: 0,
    duration: 1,
    ease: 'back.out(1.4)'
  });

  // 5. Romantic Story Reveal
  gsap.from('#story .story-content', {
    scrollTrigger: {
      trigger: '#story',
      start: 'top 80%'
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: 'power2.out'
  });

  // 6. Couple Names Reveal (LAXMAN left, ABI right, & center pop)
  const namesTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#names-reveal',
      start: 'top 75%',
      toggleActions: 'play none none reverse'
    }
  });

  namesTl.from('.groom-name', { x: -120, opacity: 0, duration: 1, ease: 'power3.out' })
         .from('.bride-name', { x: 120, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.8')
         .from('.ampersand', { scale: 0, opacity: 0, duration: 0.8, ease: 'back.out(1.7)' }, '-=0.5');

  // 7. Date & Countdown Reveal
  gsap.from('.date-reveal > *', {
    scrollTrigger: {
      trigger: '#date',
      start: 'top 75%'
    },
    y: 35,
    opacity: 0,
    stagger: 0.15,
    duration: 0.8,
    ease: 'power2.out'
  });

  gsap.from('.countdown-container', {
    scrollTrigger: {
      trigger: '.countdown-container',
      start: 'top 85%'
    },
    scale: 0.9,
    opacity: 0,
    duration: 0.9,
    ease: 'power2.out'
  });

  // 8. Eden Garden Venue Scene Reveal
  gsap.from('.event-card', {
    scrollTrigger: {
      trigger: '#venue',
      start: 'top 75%'
    },
    y: 40,
    opacity: 0,
    duration: 1,
    ease: 'power2.out'
  });

  // 9. Final Thank You Section Reveal
  gsap.from('.thanks-content > *', {
    scrollTrigger: {
      trigger: '#thanks',
      start: 'top 80%'
    },
    y: 30,
    opacity: 0,
    stagger: 0.15,
    duration: 0.8,
    ease: 'power2.out'
  });

  // Three.js Camera depth shift on scroll
  ScrollTrigger.create({
    trigger: 'body',
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      updateSceneOnScroll(self.progress);
    }
  });

  // Floating Navigation Scroll Highlighting
  setupActiveNav();
}

function setupActiveNav() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('#floating-nav a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= sectionTop - sectionHeight / 3) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      const href = link.getAttribute('href').replace('#', '');
      if (href === current || (current.startsWith('hero') && href === 'hero-couple')) {
        link.classList.add('active');
      }
    });
  });
}
