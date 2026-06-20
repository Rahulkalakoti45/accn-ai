import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Orb Core & Rings Component
const AIOrb: React.FC<{ speaking: boolean }> = ({ speaking }) => {
  const coreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    const speedMultiplier = speaking ? 2.5 : 1;
    const pulseFactor = speaking ? Math.sin(elapsed * 8) * 0.15 + 1.1 : Math.sin(elapsed * 2) * 0.05 + 1;

    // Pulse core
    if (coreRef.current) {
      coreRef.current.scale.set(pulseFactor, pulseFactor, pulseFactor);
      coreRef.current.rotation.y = elapsed * 0.4;
    }

    // Rotate rings in opposite directions
    if (ring1Ref.current) {
      ring1Ref.current.rotation.y = elapsed * 0.8 * speedMultiplier;
      ring1Ref.current.rotation.x = elapsed * 0.5 * speedMultiplier;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -elapsed * 0.6 * speedMultiplier;
      ring2Ref.current.rotation.z = elapsed * 0.4 * speedMultiplier;
    }
  });

  return (
    <group>
      {/* 1. Inner core sphere */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshBasicMaterial color="#00FF88" transparent opacity={0.8} />
      </mesh>
      
      {/* 2. Inner glow aura sphere */}
      <mesh>
        <sphereGeometry args={[0.85, 16, 16]} />
        <meshBasicMaterial color="#00D4FF" transparent opacity={0.15} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* 3. Middle Ring Torus */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.3, 0.03, 16, 100]} />
        <meshBasicMaterial color="#00D4FF" wireframe />
      </mesh>

      {/* 4. Outer Ring Torus */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[1.6, 0.02, 16, 100]} />
        <meshBasicMaterial color="#7C3AED" transparent opacity={0.6} wireframe />
      </mesh>
    </group>
  );
};

// Orb Cloud Particles Component
const OrbitingCloud: React.FC<{ speaking: boolean }> = ({ speaking }) => {
  const cloudRef = useRef<THREE.Points>(null);
  const count = 120;
  const positions = new Float32Array(count * 3);

  // Generate spherical distribution
  for (let i = 0; i < count; i++) {
    const phi = Math.acos(Math.random() * 2 - 1);
    const theta = Math.random() * Math.PI * 2;
    const r = 2.0 + Math.random() * 0.4;
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }

  useFrame((state, delta) => {
    if (cloudRef.current) {
      const speed = speaking ? delta * 0.6 : delta * 0.15;
      cloudRef.current.rotation.y += speed;
      cloudRef.current.rotation.x += speed * 0.5;
    }
  });

  return (
    <Points ref={cloudRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00FF88"
        size={0.06}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  );
};

export const AIOrb3D: React.FC<{ speaking?: boolean }> = ({ speaking = false }) => {
  return (
    <div className="w-full h-full min-h-[250px] relative select-none canvas-container">
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 50 }}
        gl={{ antialias: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={1} />
        <AIOrb speaking={speaking} />
        <OrbitingCloud speaking={speaking} />
      </Canvas>
    </div>
  );
};
