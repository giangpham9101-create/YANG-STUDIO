import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  PerspectiveCamera, 
  Float, 
  Instances, 
  Instance, 
  Text, 
  Environment, 
  MeshDistortMaterial,
  MeshWobbleMaterial,
  useTexture
} from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';
import gsap from 'gsap';

const PARTICLE_COUNT = 2000;
const WASTE_COUNT = 40;

const COLORS = [
  "#D1FF00", // Acid Green
  "#FF4D00", // Neon Orange
  "#00D1FF", // Electric Blue
  "#FFFFFF"  // White
];

function Microplastics() {
  const pointsRef = useRef<THREE.Points>(null);
  
  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const cols = new Float32Array(PARTICLE_COUNT * 3);
    const sz = new Float32Array(PARTICLE_COUNT);
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 100;

      const color = new THREE.Color(COLORS[Math.floor(Math.random() * COLORS.length)]);
      cols[i * 3] = color.r;
      cols[i * 3 + 1] = color.g;
      cols[i * 3 + 2] = color.b;

      sz[i] = Math.random() * 0.1;
    }
    return [pos, cols, sz];
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.getElapsedTime();
    
    // Ocean Current Sway
    pointsRef.current.position.x = Math.sin(t * 0.2) * 0.5;
    pointsRef.current.position.y = Math.cos(t * 0.3) * 0.5;
    
    // Subtle drift
    const attr = pointsRef.current.geometry.attributes.position;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const ix = i * 3;
      attr.array[ix + 2] += 0.01;
      if (attr.array[ix + 2] > 50) attr.array[ix + 2] = -50;
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        sizeAttenuation={true}
      />
    </points>
  );
}

function PlasticWaste({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  const items = useMemo(() => {
    return Array.from({ length: WASTE_COUNT }).map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10 - 2,
        (Math.random() - 0.5) * 100 - 30
      ] as [number, number, number],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI] as [number, number, number],
      scale: 0.8 + Math.random() * 2,
      color: COLORS[Math.floor(Math.random() * 3)], // Acid Green, Orange, Blue
      type: Math.floor(Math.random() * 4) // 0: bottle, 1: scrap, 2: container, 3: sheet
    }));
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    
    // Ocean Current Sway
    groupRef.current.children.forEach((child, i) => {
      child.rotation.x += Math.sin(t * 0.3 + i) * 0.003;
      child.rotation.y += Math.cos(t * 0.2 + i) * 0.003;
      child.position.y += Math.sin(t * 0.1 + i) * 0.001;
    });
  });

  return (
    <group ref={groupRef}>
      {items.map((item, i) => (
        <Float key={i} speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh position={item.position} rotation={item.rotation} scale={item.scale}>
            {item.type === 0 ? (
              // Bottle
              <cylinderGeometry args={[0.15, 0.15, 0.6, 8]} />
            ) : item.type === 1 ? (
              // Scrap
              <boxGeometry args={[0.4, 0.05, 0.4]} />
            ) : item.type === 2 ? (
              // Container
              <boxGeometry args={[0.3, 0.3, 0.3]} />
            ) : (
              // Sheet
              <planeGeometry args={[0.5, 0.5]} />
            )}
            <MeshDistortMaterial 
              color={item.color} 
              speed={1.5} 
              distort={0.5} 
              radius={1} 
              roughness={0.05}
              metalness={0.9}
              transparent
              opacity={0.7}
              side={THREE.DoubleSide}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function PlasticTerrain() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Create a U-shape by bending a plane
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(100, 200, 64, 64);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      // Bend the edges up to create a U-shape
      const z = (x * x) * 0.05;
      pos.setZ(i, z);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -8, -20]} geometry={geometry}>
      <MeshWobbleMaterial 
        color="#050505" 
        speed={0.2} 
        factor={0.1} 
        roughness={0.9}
        metalness={0.1}
      />
      {/* Grid lines for brutalist look */}
      <mesh position={[0, 0, 0.01]}>
        <primitive object={geometry} />
        <meshBasicMaterial color="#D1FF00" wireframe transparent opacity={0.03} />
      </mesh>
    </mesh>
  );
}

function CinematicCamera({ scrollProgress }: { scrollProgress: number }) {
  const { camera } = useThree();
  
  useFrame(() => {
    // Scroll-driven forward movement
    // 0 to 1 progress maps to 0 to -60 Z position
    const targetZ = 10 - scrollProgress * 80;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);
    
    // Low-angle shot
    camera.position.y = 1 + Math.sin(scrollProgress * Math.PI) * 0.5;
    camera.lookAt(0, 0, camera.position.z - 20);
  });

  return <PerspectiveCamera makeDefault fov={60} position={[0, 1, 10]} />;
}

export default function PlasticWasteScroll({ scrollProgress = 0 }: { scrollProgress?: number }) {
  return (
    <div className="fixed inset-0 z-0 bg-black">
      <Canvas dpr={[1, 2]}>
        <color attach="background" args={["#000000"]} />
        <fog attach="fog" args={["#000000", 5, 45]} />
        
        <CinematicCamera scrollProgress={scrollProgress} />
        
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#D1FF00" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00D1FF" />
        
        <Microplastics />
        <PlasticWaste scrollProgress={scrollProgress} />
        <PlasticTerrain />
        
        <Environment preset="night" />
        
        <EffectComposer>
          <Bloom 
            intensity={1.5} 
            luminanceThreshold={0.2} 
            luminanceSmoothing={0.9} 
            mipmapBlur 
          />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
          <Noise opacity={0.05} />
        </EffectComposer>
      </Canvas>
      
      {/* Shadow Vignette Overlay for extra depth */}
      <div className="absolute inset-0 pointer-events-none bg-radial-vignette opacity-60"></div>
    </div>
  );
}
