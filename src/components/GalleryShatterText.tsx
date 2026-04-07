import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, PerspectiveCamera, Center, Float } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

const PARTICLE_COUNT = 8000;
const ACID_GREEN = "#D1FF00";
const NEON_RED = "#FF4500";
const SOLID_BLACK = "#1A1A1A";

function ShatterParticles({ active, onComplete }: { active: boolean, onComplete: () => void }) {
  const pointsRef = useRef<THREE.Points>(null);
  
  const [positions, colors, initialPositions] = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const cols = new Float32Array(PARTICLE_COUNT * 3);
    const initPos = new Float32Array(PARTICLE_COUNT * 3);
    
    const colorOptions = [
      new THREE.Color(ACID_GREEN),
      new THREE.Color(NEON_RED),
      new THREE.Color(SOLID_BLACK)
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Initial positions: clumped in a wide, thin rectangle (like the text)
      const x = (Math.random() - 0.5) * 15;
      const y = (Math.random() - 0.5) * 4;
      const z = (Math.random() - 0.5) * 0.5;
      
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      initPos[i * 3] = x;
      initPos[i * 3 + 1] = y;
      initPos[i * 3 + 2] = z;

      const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
      cols[i * 3] = color.r;
      cols[i * 3 + 1] = color.g;
      cols[i * 3 + 2] = color.b;
    }
    return [pos, cols, initPos];
  }, []);

  useEffect(() => {
    if (active && pointsRef.current) {
      const posAttr = pointsRef.current.geometry.attributes.position;
      
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const ix = i * 3;
        const targetX = initialPositions[ix] + (Math.random() - 0.5) * 40;
        const targetY = initialPositions[ix + 1] + (Math.random() - 0.5) * 40;
        const targetZ = initialPositions[ix + 2] + (Math.random() - 0.5) * 40;

        gsap.to(posAttr.array, {
          [ix]: targetX,
          [ix + 1]: targetY,
          [ix + 2]: targetZ,
          duration: 2 + Math.random() * 2,
          delay: Math.random() * 0.5,
          ease: "power4.out",
          onUpdate: () => {
            posAttr.needsUpdate = true;
          }
        });
      }

      // Fade out
      const material = pointsRef.current.material as THREE.PointsMaterial;
      gsap.to(material, {
        opacity: 0,
        duration: 3,
        delay: 1,
        ease: "power2.inOut",
        onComplete
      });
    }
  }, [active, initialPositions, onComplete]);

  return (
    <points ref={pointsRef} visible={active}>
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
        size={0.08}
        vertexColors
        transparent
        opacity={1}
        sizeAttenuation={true}
      />
    </points>
  );
}

function GlitchText({ onShatter }: { onShatter: () => void }) {
  const [isShattered, setIsShattered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!isShattered && groupRef.current) {
      const t = state.clock.getElapsedTime();
      // Subtle glitch jitter
      groupRef.current.children.forEach((child, i) => {
        if (i < 2) { // Only jitter the color layers
          child.position.x += Math.sin(t * 20 + i) * 0.01;
          child.position.y += Math.cos(t * 15 + i) * 0.01;
        }
      });
    }
  });

  const handleShatter = () => {
    if (isShattered) return;
    setIsShattered(true);
    onShatter();
  };

  return (
    <>
      <group ref={groupRef} visible={!isShattered} onClick={handleShatter}>
        {/* Layer 1: Acid Green (Left Offset) */}
        <Text
          position={[-0.15, 0, -0.1]}
          fontSize={1.5}
          font="https://fonts.gstatic.com/s/archivo/v19/8uIn7Ke7Pb6v0BfP_2jd.woff"
          color={ACID_GREEN}
          anchorX="center"
          anchorY="middle"
          maxWidth={15}
          textAlign="center"
        >
          PROJECT GALLERY
        </Text>

        {/* Layer 2: Neon Red (Right Offset) */}
        <Text
          position={[0.15, 0, -0.05]}
          fontSize={1.5}
          font="https://fonts.gstatic.com/s/archivo/v19/8uIn7Ke7Pb6v0BfP_2jd.woff"
          color={NEON_RED}
          anchorX="center"
          anchorY="middle"
          maxWidth={15}
          textAlign="center"
        >
          PROJECT GALLERY
        </Text>

        {/* Layer 3: Solid Black (Centered) */}
        <Text
          position={[0, 0, 0]}
          fontSize={1.5}
          font="https://fonts.gstatic.com/s/archivo/v19/8uIn7Ke7Pb6v0BfP_2jd.woff"
          color={SOLID_BLACK}
          anchorX="center"
          anchorY="middle"
          maxWidth={15}
          textAlign="center"
        >
          PROJECT GALLERY
        </Text>
      </group>
      
      <ShatterParticles active={isShattered} onComplete={() => {}} />
    </>
  );
}

export default function GalleryShatterText({ onShatterComplete }: { onShatterComplete: () => void }) {
  return (
    <div className="absolute inset-0 z-10 w-full h-full">
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
        <ambientLight intensity={0.5} />
        <Center>
          <GlitchText onShatter={onShatterComplete} />
        </Center>
      </Canvas>
    </div>
  );
}
