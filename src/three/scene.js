import * as THREE from 'three';
import { createFireflies } from './particles.js';
import { createInfinityRings } from './rings.js';
import { initFallbackBackground } from './fallback.js';

let scene, camera, renderer;
let firefliesSystem;
let ringsObj;

const targetMouse = { x: 0, y: 0 };
const currentMouse = { x: 0, y: 0 };

export function initScene() {
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas) return;

  try {
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      initFallbackBackground();
      return;
    }
  } catch (e) {
    initFallbackBackground();
    return;
  }

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x05130b, 0.003);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 60;

  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
  scene.add(ambientLight);

  const goldLight = new THREE.PointLight(0xd4af37, 3, 160);
  goldLight.position.set(0, 20, 30);
  scene.add(goldLight);

  firefliesSystem = createFireflies(scene);
  ringsObj = createInfinityRings(scene);

  window.addEventListener('mousemove', (e) => {
    targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  window.addEventListener('resize', onWindowResize);

  const clock = new THREE.Clock();

  function renderLoop() {
    const elapsedTime = clock.getElapsedTime();

    currentMouse.x += (targetMouse.x - currentMouse.x) * 0.05;
    currentMouse.y += (targetMouse.y - currentMouse.y) * 0.05;

    if (firefliesSystem) {
      firefliesSystem.rotation.y = elapsedTime * 0.03;
      firefliesSystem.rotation.x = elapsedTime * 0.015;
    }

    if (ringsObj && ringsObj.group) {
      ringsObj.group.rotation.y = elapsedTime * 0.2;
      ringsObj.group.rotation.z = Math.sin(elapsedTime * 0.3) * 0.1;

      ringsObj.ring1.rotation.z = elapsedTime * 0.4;
      ringsObj.ring2.rotation.z = -elapsedTime * 0.4;
    }

    camera.position.x = currentMouse.x * 6;
    camera.position.y = currentMouse.y * 6;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
    requestAnimationFrame(renderLoop);
  }

  renderLoop();
}

function onWindowResize() {
  if (!camera || !renderer) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

export function updateSceneOnScroll(progress) {
  if (!camera) return;
  camera.position.z = 60 - progress * 25;
}
