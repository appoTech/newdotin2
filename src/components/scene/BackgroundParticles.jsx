import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

export function BackgroundParticles({ isDepleted }) {
  const pointsRef = useRef(null);
  const count = 300;

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15 - 3;

      vel[i * 3] = (Math.random() - 0.5) * 0.002;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.002;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.001;
    }

    return [pos, vel];
  }, []);

  useFrame(() => {
    if (!pointsRef.current) return;

    const geo = pointsRef.current.geometry;
    const posArr = geo.attributes.position.array;
    const speed = isDepleted ? 0.3 : 1;

    for (let i = 0; i < count; i++) {
      posArr[i * 3] += velocities[i * 3] * speed;
      posArr[i * 3 + 1] += velocities[i * 3 + 1] * speed;
      posArr[i * 3 + 2] += velocities[i * 3 + 2] * speed;

      // Wrap
      for (let j = 0; j < 3; j++) {
        if (Math.abs(posArr[i * 3 + j]) > 10) {
          posArr[i * 3 + j] *= -0.9;
        }
      }
    }

    geo.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>

      <pointsMaterial
        size={0.03}
        color={isDepleted ? '#333344' : '#667799'}
        transparent
        opacity={isDepleted ? 0.3 : 0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}