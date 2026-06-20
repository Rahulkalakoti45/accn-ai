import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';

// 3D Solar Panel Model Representation
const SolarPanelNode: React.FC = () => {
  const panelRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (panelRef.current) {
      panelRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2;
    }
  });

  return (
    <group ref={panelRef} position={[-2.8, 0, 0]}>
      {/* Stand pole */}
      <mesh position={[0, -0.8, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 0.8]} />
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Panel grid plate */}
      <mesh position={[0, -0.2, 0]} rotation={[0.6, 0, 0.3]}>
        <boxGeometry args={[1.2, 0.05, 0.8]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.1} />
        {/* Glow rim */}
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(1.2, 0.05, 0.8)]} />
          <lineBasicMaterial color="#F59E0B" />
        </lineSegments>
      </mesh>
    </group>
  );
};

// 3D House Model Representation
const HouseNode: React.FC = () => {
  return (
    <group position={[0, -0.4, 0]}>
      {/* House Base */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 0.8, 1]} />
        <meshStandardMaterial color="#1E2D45" roughness={0.4} />
      </mesh>
      {/* Glowing window */}
      <mesh position={[0, 0, 0.51]}>
        <planeGeometry args={[0.3, 0.3]} />
        <meshBasicMaterial color="#F59E0B" />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 0.65, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[0.85, 0.6, 4]} />
        <meshStandardMaterial color="#00FF88" roughness={0.3} />
      </mesh>
    </group>
  );
};

// 3D Grid Tower Representation
const GridTowerNode: React.FC = () => {
  return (
    <group position={[2.8, 0, 0]}>
      {/* Tower Pole base */}
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[0.05, 0.1, 1.2]} />
        <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Crossbar 1 */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.8, 0.06, 0.06]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      {/* Crossbar 2 */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[0.6, 0.06, 0.06]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      {/* Cyan power insulator nodes */}
      <mesh position={[-0.4, 0, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#00D4FF" />
      </mesh>
      <mesh position={[0.4, 0, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#00D4FF" />
      </mesh>
    </group>
  );
};

// Flowing Particles component
interface ParticlesProps {
  from: [number, number, number];
  to: [number, number, number];
  color: string;
  count?: number;
}

const FlowingParticles: React.FC<ParticlesProps> = ({ from, to, color, count = 25 }) => {
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const instancedRef = useRef<THREE.InstancedMesh>(null);

  // Store particle positions along progress path
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      progress: i / count,
      speed: 0.12 + Math.random() * 0.04,
    }));
  }, [count]);

  useFrame((state, delta) => {
    if (!instancedRef.current) return;

    particles.forEach((p, idx) => {
      // Advance progress
      p.progress += delta * p.speed;
      if (p.progress > 1) {
        p.progress = 0;
      }

      // Interpolate position
      const x = from[0] + (to[0] - from[0]) * p.progress;
      const y = from[1] + (to[1] - from[1]) * p.progress + Math.sin(p.progress * Math.PI) * 0.25; // small arc
      const z = from[2] + (to[2] - from[2]) * p.progress;

      dummy.position.set(x, y, z);
      dummy.updateMatrix();
      instancedRef.current!.setMatrixAt(idx, dummy.matrix);
    });

    instancedRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={instancedRef} args={[null as any, null as any, count]}>
      <sphereGeometry args={[0.035, 8, 8]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </instancedMesh>
  );
};

export const EnergyFlow3D: React.FC = () => {
  return (
    <div className="w-full h-full min-h-[300px] relative select-none canvas-container">
      <Canvas
        camera={{ position: [0, 2.5, 4.5], fov: 45 }}
        gl={{ antialias: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 10, 5]} intensity={1.8} color="#00FF88" />
        <pointLight position={[-5, 5, -5]} intensity={0.5} color="#F59E0B" />

        {/* Isometric Platform / Grid grid base */}
        <gridHelper args={[10, 20, '#1E2D45', '#111827']} position={[0, -0.81, 0]} />

        {/* Connected path lines */}
        <Line
          points={[[-2.8, -0.4, 0], [0, -0.4, 0]]}
          color="#F59E0B"
          lineWidth={0.5}
          opacity={0.15}
          transparent
        />
        <Line
          points={[[0, -0.4, 0], [2.8, -0.4, 0]]}
          color="#00FF88"
          lineWidth={0.5}
          opacity={0.15}
          transparent
        />

        {/* Nodes */}
        <SolarPanelNode />
        <HouseNode />
        <GridTowerNode />

        {/* Flow Particles */}
        <FlowingParticles from={[-2.8, -0.3, 0]} to={[0, -0.3, 0]} color="#F59E0B" count={30} />
        <FlowingParticles from={[0, -0.3, 0]} to={[2.8, -0.3, 0]} color="#00FF88" count={30} />

        {/* Basic view controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2 - 0.1}
          minPolarAngle={0.2}
          autoRotate
          autoRotateSpeed={0.3}
        />
      </Canvas>
    </div>
  );
};
