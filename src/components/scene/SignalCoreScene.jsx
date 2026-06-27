import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { CoreMesh } from './CoreMesh';
import { EnergyOrbs } from './EnergyOrbs';
import { BackgroundParticles } from './BackgroundParticles';
import { CreatorNodes } from './CreatorNodes';

export function SignalCoreScene({ coreState, hearts, audioData }) {
  const isDepleted = hearts <= 0;

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 60 }}
      style={{ position: 'fixed', inset: 0 }}
      flat
      gl={{ antialias: true, alpha: false }}
    >
      <color attach="background" args={['#080b14']} />
      <fog attach="fog" args={['#080b14', 5, 20]} />

      <Suspense fallback={null}>
        <ambientLight intensity={isDepleted ? 0.05 : 0.15} />
        <pointLight
          position={[0, 0, 3]}
          intensity={isDepleted ? 0.3 : 1.2}
          color="#e8824a"
        />

        <CoreMesh
          coreState={coreState}
          audioData={audioData}
          isDepleted={isDepleted}
        />

        <EnergyOrbs
          hearts={hearts}
          coreState={coreState}
        />

        <BackgroundParticles isDepleted={isDepleted} />
        <CreatorNodes isDepleted={isDepleted} />
      </Suspense>
    </Canvas>
  );
}
