import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform float uTime;
  uniform float uAudio;
  uniform float uState;

  void main() {
    vUv = uv;
    vNormal = normal;
    vPosition = position;
    
    vec3 pos = position;
    
    float breath = sin(uTime * 1.2) * 0.03 + sin(uTime * 0.7) * 0.02;
    float audioDisplace = uAudio * 0.15;
    
    float stateScale = 1.0;
    if (uState > 0.5 && uState < 1.5) stateScale = 1.08;
    if (uState > 1.5 && uState < 2.5) stateScale = 1.05;
    if (uState > 2.5) stateScale = 1.15;
    
    float distort = sin(pos.x * 3.0 + uTime) * sin(pos.y * 4.0 + uTime * 0.8) * 0.02;
    distort += sin(pos.z * 2.5 + uTime * 1.3) * 0.015;
    
    pos *= stateScale + breath + audioDisplace;
    pos += normal * distort;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform float uTime;
  uniform float uAudio;
  uniform float uState;
  uniform float uDepleted;

  void main() {
    vec3 viewDir = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 3.0);
    
    vec3 warm = vec3(0.91, 0.51, 0.29);
    vec3 cool = vec3(0.25, 0.52, 0.85);
    vec3 white = vec3(1.0, 0.95, 0.9);
    
    float t = sin(uTime * 0.5 + vUv.x * 3.14) * 0.5 + 0.5;
    vec3 plasma = mix(warm, cool, t + uAudio * 0.3);
    
    float coreBright = 0.3 + uAudio * 0.4;
    if (uState > 1.5 && uState < 2.5) coreBright += 0.2;
    if (uState > 2.5) coreBright += 0.5;
    
    vec3 col = mix(plasma * coreBright, white, fresnel * 0.6);
    
    float inner = sin(vUv.x * 6.28 + uTime * 2.0) * sin(vUv.y * 6.28 + uTime * 1.5);
    col += plasma * inner * 0.1;
    
    if (uDepleted > 0.5) {
      col = mix(col, vec3(0.15, 0.15, 0.2), 0.7);
    }
    
    float alpha = 0.7 + fresnel * 0.3;
    gl_FragColor = vec4(col, alpha);
  }
`;

const stateMap = {
  idle: 0,
  pressed: 1,
  recording: 2,
  releasing: 3,
};

export function CoreMesh({ coreState, audioData, isDepleted }) {
  const meshRef = useRef(null);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uAudio: { value: 0 },
    uState: { value: 0 },
    uDepleted: { value: 0 },
  }), []);

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.getElapsedTime();

    let level = 0;
    if (audioData) {
      for (let i = 0; i < audioData.length; i++) {
        level += Math.abs(audioData[i]);
      }
      level = Math.min((level / audioData.length) * 8, 1);
    }

    uniforms.uAudio.value += (level - uniforms.uAudio.value) * 0.1;
    uniforms.uState.value += (stateMap[coreState] - uniforms.uState.value) * 0.08;
    uniforms.uDepleted.value += ((isDepleted ? 1 : 0) - uniforms.uDepleted.value) * 0.05;

    if (meshRef.current) {
      const t = clock.getElapsedTime();
      meshRef.current.rotation.y = t * 0.1;
      meshRef.current.rotation.x = Math.sin(t * 0.15) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.2, 6]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}