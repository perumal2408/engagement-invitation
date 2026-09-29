import * as THREE from 'three';

export function createInfinityRings(scene) {
  const group = new THREE.Group();
  const ringGeometry = new THREE.TorusGeometry(8.5, 0.45, 32, 100);

  const goldMaterial = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    metalness: 0.9,
    roughness: 0.2,
    emissive: 0x332200,
    emissiveIntensity: 0.3
  });

  const ring1 = new THREE.Mesh(ringGeometry, goldMaterial);
  ring1.position.x = -4.5;
  ring1.rotation.x = Math.PI / 3;
  ring1.rotation.y = Math.PI / 6;

  const ring2 = new THREE.Mesh(ringGeometry, goldMaterial);
  ring2.position.x = 4.5;
  ring2.rotation.x = -Math.PI / 3;
  ring2.rotation.y = -Math.PI / 6;

  group.add(ring1);
  group.add(ring2);

  group.position.set(0, 0, -35);
  scene.add(group);

  return { group, ring1, ring2 };
}
