import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { useScroll, useSpring, useTransform } from 'motion/react';
import { BottleBody, BottleCap, RecycleFragment, COLORS } from './BottleModels';

// --- Individual Waste Object with Mouse Interaction ---
const WasteObject = ({ position, rotation, type, color, index }: any) => {
  const meshRef = useRef<THREE.Group>(null);
  const initialPos = useMemo(() => new THREE.Vector3(...position), [position]);
  const initialRot = useMemo(() => new THREE.Euler(...rotation), [rotation]);
  const speed = useMemo(() => 0.5 + Math.random(), []);
  
  useFrame((state) => {
    if (!meshRef.current) return;

    // Base rotation
    meshRef.current.rotation.x += 0.01 * speed;
    meshRef.current.rotation.y += 0.01 * speed;

    // Mouse Interaction: Repel or dodge cursor
    const mouse = state.pointer; // Normalized mouse (-1 to 1)
    // Project mouse to roughly the same Z plane as the object for a 2D-plane distance check
    // Since it's a tunnel, we mostly care about proximity in XY
    const dx = (mouse.x * 10) - meshRef.current.position.x;
    const dy = (mouse.y * 10) - meshRef.current.position.y;
    const distSq = dx * dx + dy * dy + 0.01; // Epsilon to prevent div by zero

    if (distSq < 15) {
      const force = (15 - distSq) / 15;
      meshRef.current.position.x -= (dx / distSq) * force * 0.2;
      meshRef.current.position.y -= (dy / distSq) * force * 0.2;
      meshRef.current.rotation.z += force * 0.1;
    } else {
      // Return to original XY track (drift back)
      meshRef.current.position.x += (initialPos.x - meshRef.current.position.x) * 0.05;
      meshRef.current.position.y += (initialPos.y - meshRef.current.position.y) * 0.05;
    }
  });

  return (
    <group ref={meshRef} position={initialPos} rotation={initialRot}>
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        {type === 'body' && <BottleBody color={color} />}
        {type === 'cap' && <BottleCap color={color} />}
        {type === 'flake' && <RecycleFragment color={color} />}
      </Float>
    </group>
  );
};

// --- Scene Logic that listens to Scroll ---
const TunnelScene = ({ scrollProgress }: { scrollProgress: any }) => {
  const { camera } = useThree();
  
  // Calculate objects once
  const objects = useMemo(() => {
    return Array.from({ length: 80 }).map((_, i) => {
      let x = (Math.random() - 0.5) * 40;
      let y = (Math.random() - 0.5) * 30;
      
      // Clear center hole
      if (Math.abs(x) < 8 && Math.abs(y) < 6) {
        x = x > 0 ? x + 8 : x - 8;
        y = y > 0 ? y + 6 : y - 6;
      }

      const z = -200 + Math.random() * 200; // Scatter from -200 to 0
      const type = i % 3 === 0 ? 'body' : i % 3 === 1 ? 'cap' : 'flake';
      const color = type === 'body' 
        ? COLORS.pet[i % COLORS.pet.length] 
        : COLORS.hdpe[i % COLORS.hdpe.length];

      return {
        id: i,
        position: [x, y, z],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
        type,
        color
      };
    });
  }, []);

  useFrame(() => {
    // Camera flies through the tunnel based on scroll
    // Map scroll 0 -> 1 to Z 20 -> -160
    const targetZ = 20 - (scrollProgress.get() * 200);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.1);
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} color="#D1FF00" intensity={0.5} />
      <Environment preset="city" />
      
      {objects.map((obj) => (
        <WasteObject key={obj.id} {...obj} />
      ))}
      
      <fog attach="fog" args={['#000', 10, 150]} />
    </>
  );
};

export default function ZoomTunnelGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    damping: 40,
    stiffness: 90,
    mass: 1,
  });

  return (
    <div ref={containerRef} className="h-[300vh] w-full relative z-10">
      <div className="sticky top-0 h-screen w-full bg-black overflow-hidden pointer-events-auto">
        <Canvas dpr={[1, 2]} shadows gl={{ antialias: true, alpha: true }}>
          <PerspectiveCamera makeDefault position={[0, 0, 20]} />
          <TunnelScene scrollProgress={smoothProgress} />
        </Canvas>
      </div>
    </div>
  );
}
