import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Starfield Background Component
const Stars: React.FC = () => {
  const ref = useRef<THREE.Points>(null);
  
  // Generate random star positions
  const sphere = new Float32Array(2000 * 3);
  for (let i = 0; i < 2000; i++) {
    sphere[i * 3] = (Math.random() - 0.5) * 50;
    sphere[i * 3 + 1] = (Math.random() - 0.5) * 50;
    sphere[i * 3 + 2] = (Math.random() - 0.5) * 50;
  }

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.x = -elapsed * 0.02;
      ref.current.rotation.y = -elapsed * 0.015;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#00D4FF"
          size={0.06}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.3}
        />
      </Points>
    </group>
  );
};

// Holographic Wireframe Earth Component
const WireframeEarth: React.FC = () => {
  const earthRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Generate energy nodes (nodes on Earth's surface)
  const nodeCount = 150;
  const positions = new Float32Array(nodeCount * 3);
  for (let i = 0; i < nodeCount; i++) {
    const phi = Math.acos(Math.random() * 2 - 1);
    const theta = Math.random() * Math.PI * 2;
    const r = 2.02; // Slightly above surface

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    if (earthRef.current) {
      earthRef.current.rotation.y = elapsed * 0.05;
      earthRef.current.rotation.x = elapsed * 0.01;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y = -elapsed * 0.02;
    }
  });

  return (
    <group ref={earthRef}>
      {/* Glow outer atmosphere */}
      <mesh>
        <sphereGeometry args={[2.2, 32, 32]} />
        <meshBasicMaterial
          color="#00D4FF"
          wireframe
          transparent
          opacity={0.02}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Main wireframe sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial
          color="#00FF88"
          wireframe
          transparent
          opacity={0.08}
        />
      </mesh>

      {/* Internal core sphere for occlusion */}
      <mesh>
        <sphereGeometry args={[1.98, 32, 32]} />
        <meshBasicMaterial color="#0A0F1E" transparent opacity={0.6} />
      </mesh>

      {/* Surface Nodes / Glowing points */}
      <Points ref={particlesRef} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#00FF88"
          size={0.12}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
    </group>
  );
};

// Orbiting Carbon Tokens
const OrbitingTokens: React.FC = () => {
  const tokenGroupRef = useRef<THREE.Group>(null);
  const tokens = Array.from({ length: 12 });

  useFrame((state) => {
    if (tokenGroupRef.current) {
      const time = state.clock.getElapsedTime();
      tokenGroupRef.current.children.forEach((child, index) => {
        const offset = (index * Math.PI * 2) / tokens.length;
        const radius = 3.2 + Math.sin(time + index) * 0.3;
        const speed = 0.2;
        
        child.position.x = radius * Math.cos(time * speed + offset);
        child.position.z = radius * Math.sin(time * speed + offset);
        child.position.y = Math.sin(time * 0.5 + index) * 1.2;
      });
    }
  });

  return (
    <group ref={tokenGroupRef}>
      {tokens.map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshBasicMaterial color="#00FF88" toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
};

export const Earth3D: React.FC = () => {
  return (
    <div className="w-full h-full min-h-[400px] select-none canvas-container">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 60 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#00D4FF" />
        <Stars />
        <WireframeEarth />
        <OrbitingTokens />
      </Canvas>
    </div>
  );
};
