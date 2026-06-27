import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function CreatorNodes({ isDepleted }) {
  const groupRef = useRef(null);

  const nodes = useMemo(() =>
    Array.from({ length: 8 }, () => ({
      pos: new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 6,
        -2 - Math.random() * 5
      ),
      pulseSpeed: 0.5 + Math.random() * 1.5,
      pulsePhase: Math.random() * Math.PI * 2,
    })),
  []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    groupRef.current.children.forEach((child, i) => {
      const node = nodes[i];
      const mesh = child;

      const pulse =
        Math.sin(t * node.pulseSpeed + node.pulsePhase) * 0.5 + 0.5;

      const baseScale = 0.04 + pulse * 0.03;
      mesh.scale.setScalar(baseScale);

      const mat = mesh.material;
      mat.emissiveIntensity = isDepleted
        ? 0.2
        : 0.5 + pulse * 1.0;

      mat.opacity = isDepleted
        ? 0.2
        : 0.4 + pulse * 0.3;

      // Gentle drift
      mesh.position.x =
        node.pos.x + Math.sin(t * 0.1 + i) * 0.2;

      mesh.position.y =
        node.pos.y + Math.cos(t * 0.08 + i) * 0.15;
    });
  });

  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => (
        <mesh key={i} position={node.pos}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshStandardMaterial
            color="#4488cc"
            emissive="#3366aa"
            emissiveIntensity={0.8}
            transparent
            opacity={0.5}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}