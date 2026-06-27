import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function EnergyOrbs({ hearts, coreState }) {
  const groupRef = useRef(null);

  const orbPositions = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => {
      const angle = (i / 5) * Math.PI * 2;
      return {
        angle,
        radius: 2.0 + Math.random() * 0.3,
        speed: 0.2 + Math.random() * 0.15,
        yOff: (Math.random() - 0.5) * 0.6,
      };
    });
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    groupRef.current.children.forEach((child, i) => {
      const orb = orbPositions[i];
      const alive = i < hearts;
      const mesh = child;

      if (alive) {
        const a = orb.angle + t * orb.speed;
        mesh.position.x = Math.cos(a) * orb.radius;
        mesh.position.z = Math.sin(a) * orb.radius;
        mesh.position.y =
          orb.yOff + Math.sin(t * 0.8 + i) * 0.15;

        const breathScale =
          0.12 + Math.sin(t * 2 + i * 1.5) * 0.02;
        mesh.scale.setScalar(breathScale);

        const mat = mesh.material;
        mat.opacity = 0.9;
        mat.emissiveIntensity =
          1.5 + Math.sin(t * 3 + i) * 0.5;
      } else {
        // Shrink and fade dead orbs
        mesh.scale.lerp(new THREE.Vector3(0, 0, 0), 0.05);
        const mat = mesh.material;
        mat.opacity = Math.max(0, mat.opacity - 0.02);
      }
    });
  });

  return (
    <group ref={groupRef}>
      {orbPositions.map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial
            color="#f5c842"
            emissive="#e8824a"
            emissiveIntensity={1.5}
            transparent
            opacity={0.9}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}