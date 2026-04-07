import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

const ACID_GREEN = "#D1FF00";
const ORANGE_RED = "#FF4500";
const BLACK = "#1A1A1A";

const sampleText = (text: string, width: number, height: number) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  canvas.width = width;
  canvas.height = height;
  ctx.fillStyle = 'white';
  // Industrial bold font
  ctx.font = '900 120px "FSEX300", "Impact", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  const lines = text.split('\n');
  const lineHeight = 130;
  lines.forEach((line, i) => {
    ctx.fillText(line, width / 2, height / 2 + (i - (lines.length - 1) / 2) * lineHeight);
  });

  const data = ctx.getImageData(0, 0, width, height).data;
  const points = [];
  // Sample every 3 pixels for a "dust" look and performance
  for (let y = 0; y < height; y += 3) {
    for (let x = 0; x < width; x += 3) {
      const alpha = data[(y * width + x) * 4 + 3];
      if (alpha > 128) {
        points.push({
          x: (x - width / 2) * 0.02,
          y: (height / 2 - y) * 0.02,
          z: 0
        });
      }
    }
  }
  return points;
};

function GlitchLayer({ text, color, offset, exploded, delay = 0 }: any) {
  const pointsRef = useRef<THREE.Points>(null);
  const [positions, scatteredPositions] = useMemo(() => {
    const pts = sampleText(text, 1000, 600);
    const pos = new Float32Array(pts.length * 3);
    const scat = new Float32Array(pts.length * 3);
    
    pts.forEach((p, i) => {
      pos[i * 3] = p.x + offset[0];
      pos[i * 3 + 1] = p.y + offset[1];
      pos[i * 3 + 2] = p.z + offset[2];
      
      // Random direction for explosion
      const angle = Math.random() * Math.PI * 2;
      const dist = 8 + Math.random() * 20;
      scat[i * 3] = pos[i * 3] + Math.cos(angle) * dist;
      scat[i * 3 + 1] = pos[i * 3 + 1] + Math.sin(angle) * dist;
      scat[i * 3 + 2] = (Math.random() - 0.5) * 15;
    });
    return [pos, scat];
  }, [text, offset]);

  const animationData = useMemo(() => ({ progress: 0, opacity: 1 }), []);

  useEffect(() => {
    if (exploded) {
      const count = positions.length / 3;
      
      gsap.to(animationData, {
        progress: 1,
        opacity: 0,
        duration: 3,
        delay: delay,
        ease: "expo.out",
        onUpdate: () => {
          if (!pointsRef.current) return;
          const attr = pointsRef.current.geometry.attributes.position;
          for (let i = 0; i < count; i++) {
            const ix = i * 3;
            // Individual progress for stagger effect
            const p = Math.max(0, Math.min(1, animationData.progress * 1.4 - (i / count) * 0.4));
            attr.array[ix] = THREE.MathUtils.lerp(positions[ix], scatteredPositions[ix], p);
            attr.array[ix + 1] = THREE.MathUtils.lerp(positions[ix + 1], scatteredPositions[ix + 1], p);
            attr.array[ix + 2] = THREE.MathUtils.lerp(positions[ix + 2], scatteredPositions[ix + 2], p);
          }
          attr.needsUpdate = true;
          (pointsRef.current.material as THREE.PointsMaterial).opacity = animationData.opacity;
        }
      });
    }
  }, [exploded]);

  return (
    <Points 
      ref={pointsRef} 
      positions={positions} 
      stride={3} 
    >
      <PointMaterial
        transparent
        color={color}
        size={0.07}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={1}
      />
    </Points>
  );
}

export default function ParticleLogo({ className }: { className?: string }) {
  const [exploded, setExploded] = useState(false);
  const handleExplode = () => {
    if (!exploded) setExploded(true);
  };

  return (
    <div className={className}>
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 15], fov: 45 }}>
        <ambientLight intensity={1} />
        <group>
          {/* Invisible Hit Area for better interaction */}
          <mesh onClick={handleExplode} onPointerDown={handleExplode} visible={false}>
            <planeGeometry args={[20, 10]} />
            <meshBasicMaterial transparent opacity={0} />
          </mesh>

          {/* Layer 1: Acid Green (Back, Offset Left) */}
          <GlitchLayer 
            text={"PLASTIC\nINTO\nREBORN"} 
            color={ACID_GREEN} 
            offset={[-0.15, 0.08, -0.2]} 
            exploded={exploded} 
            delay={0.15}
          />
          {/* Layer 2: Orange-Red (Middle, Offset Right) */}
          <GlitchLayer 
            text={"PLASTIC\nINTO\nREBORN"} 
            color={ORANGE_RED} 
            offset={[0.15, -0.08, -0.1]} 
            exploded={exploded} 
            delay={0.08}
          />
          {/* Layer 3: Black (Front, Centered) */}
          <GlitchLayer 
            text={"PLASTIC\nINTO\nREBORN"} 
            color={BLACK} 
            offset={[0, 0, 0]} 
            exploded={exploded} 
            delay={0}
          />
        </group>
      </Canvas>
    </div>
  );
}
