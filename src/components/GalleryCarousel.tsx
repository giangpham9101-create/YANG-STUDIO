import React, { useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Image, Text, PerspectiveCamera, Environment, useCursor } from "@react-three/drei";
import * as THREE from "three";

import img1 from '../assets/anhonhiem/o1.jpg';
import img2 from '../assets/anhonhiem/o2.jpg';
import img3 from '../assets/anhonhiem/o3.webp';
import img4 from '../assets/anhonhiem/o4.webp';
import img5 from '../assets/anhonhiem/o5.jpg';
import img6 from '../assets/anhonhiem/o6.webp';
import img7 from '../assets/anhonhiem/o7.webp';
import img8 from '../assets/anhonhiem/o8.jpg';
import img9 from '../assets/anhonhiem/o9.jpg';
import img10 from '../assets/anhonhiem/o10.webp';

const GALLERY_ITEMS = [
  { id: 1, title: "OCEAN_PLASTIC_WASTE", material: "HDPE", img: img1 },
  { id: 2, title: "URBAN_POLLUTION_SITE", material: "LDPE", img: img2 },
  { id: 3, title: "MICROPLASTIC_IMPACT", material: "PP", img: img3 },
  { id: 4, title: "INDUSTRIAL_RESIDUE", material: "MIX", img: img4 },
  { id: 5, title: "CHEMICAL_CONTAINMENT", material: "HDPE", img: img5 },
  { id: 6, title: "PLASTIC_FRAGMENTATION", material: "PP", img: img6 },
  { id: 7, title: "LANDFILL_ACCUMULATION", material: "MIX", img: img7 },
  { id: 8, title: "AQUATIC_DEBRIS", material: "LDPE", img: img8 },
  { id: 9, title: "SYNTHETIC_OVERLOAD", material: "PET", img: img9 },
  { id: 10, title: "ENVIRONMENTAL_RECOVERY", material: "HDPE", img: img10 },
];

const FONTS = {
  MONO: "https://cdn.jsdelivr.net/fontsource/fonts/ibm-plex-mono@latest/latin-400-normal.woff",
  SANS: "https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.woff"
};

// Simple Error Boundary for Canvas
class CanvasErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

function Card({ item, index, total, radius, rotationRef }: { item: any, index: number, total: number, radius: number, rotationRef: React.MutableRefObject<number> }) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  // Calculate position on the circle
  const angle = (index / total) * Math.PI * 2;
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Position on the circle based on global rotation ref
    const currentAngle = angle + rotationRef.current;
    meshRef.current.position.x = Math.sin(currentAngle) * radius;
    meshRef.current.position.z = Math.cos(currentAngle) * radius;
    
    // Always face the center
    meshRef.current.rotation.y = currentAngle;

    // Tilt effect on hover
    if (hovered) {
        const mouseX = state.mouse.x * 0.3;
        const mouseY = state.mouse.y * 0.3;
        meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, mouseY, 0.1);
        meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, -mouseX, 0.1);
    } else {
        meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, 0, 0.1);
        meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, 0, 0.1);
    }

    // Depth effects based on Z position
    const zPos = meshRef.current.position.z;
    const normalizedZ = (zPos + radius) / (2 * radius); // 0 (back) to 1 (front)
    
    // Scale and Opacity for depth
    meshRef.current.scale.setScalar(0.7 + normalizedZ * 0.5);
  });

  return (
    <group 
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => window.open(item.img, '_blank')}
    >
        {/* Card Background */}
        <mesh>
            <planeGeometry args={[4.5, 6]} />
            <meshBasicMaterial color="white" />
        </mesh>
        
        {/* Card Border */}
        <mesh position={[0, 0, -0.01]}>
            <planeGeometry args={[4.6, 6.1]} />
            <meshBasicMaterial color="black" />
        </mesh>

        {/* Image */}
        <Image 
            key={`img-${item.id}`}
            url={item.img} 
            transparent 
            scale={[4.2, 5.7]} 
            position={[0, 0, 0.01]}
            grayscale={hovered ? 0 : 0.8}
        />

        {/* Labels */}
        <group position={[-1.7, 2.5, 0.02]}>
            <mesh>
                <planeGeometry args={[1.0, 0.4]} />
                <meshBasicMaterial color="black" />
            </mesh>
            <Text
                position={[0, 0, 0.01]}
                fontSize={0.12}
                color="white"
                font={FONTS.MONO}
            >
                {item.material}
            </Text>
        </group>

        <group position={[-1.1, 2.0, 0.02]}>
            <mesh>
                <planeGeometry args={[2.2, 0.4]} />
                <meshBasicMaterial color="#D1FF00" />
            </mesh>
            <Text
                position={[0, 0, 0.01]}
                fontSize={0.12}
                color="black"
                font={FONTS.MONO}
            >
                PROJECT_ID: {item.id}
            </Text>
        </group>

        {/* Title */}
        <Text
            position={[0, -2.2, 0.02]}
            fontSize={0.22}
            color="black"
            maxWidth={3.5}
            textAlign="center"
            font={FONTS.SANS}
        >
            {item.title}
        </Text>
    </group>
  );
}


function CarouselScene({ isMobile, rotationRef, velocityRef, isDragging }: { isMobile: boolean, rotationRef: React.MutableRefObject<number>, velocityRef: React.MutableRefObject<number>, isDragging: React.MutableRefObject<boolean> }) {
  const radius = isMobile ? 5 : 8.5;

  useFrame(() => {
    if (!isDragging.current) {
        // Apply inertia
        velocityRef.current *= 0.95;
        rotationRef.current += velocityRef.current;
        
        // Auto-spin slightly
        rotationRef.current += 0.002;
    }
  });

  return (
    <>
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        

        <group position={[0, 0, 0]}>
          {GALLERY_ITEMS.map((item, i) => (
            <Card 
                key={item.id} 
                item={item} 
                index={i} 
                total={GALLERY_ITEMS.length} 
                radius={radius} 
                rotationRef={rotationRef}
            />
          ))}
        </group>

        <Environment preset="city" />
    </>
  );
}

const GalleryCarouselComp = function GalleryCarousel() {
  const rotationRef = useRef(0);
  const velocityRef = useRef(0);
  const isDragging = useRef(false);
  const lastX = useRef(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    lastX.current = e.clientX;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const delta = (e.clientX - lastX.current) * 0.005;
    velocityRef.current = delta;
    rotationRef.current += delta;
    lastX.current = e.clientX;
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  return (
    <div 
        className="w-full h-[600px] md:h-[800px] relative cursor-grab active:cursor-grabbing overflow-hidden"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
    >
      <Canvas key="gallery-carousel-canvas" shadows camera={{ position: [0, 0, 22], fov: 45 }}>
        <CanvasErrorBoundary>
          <React.Suspense fallback={null}>
            <CarouselScene 
                isMobile={isMobile} 
                rotationRef={rotationRef} 
                velocityRef={velocityRef} 
                isDragging={isDragging} 
            />
          </React.Suspense>
        </CanvasErrorBoundary>
      </Canvas>

      {/* Navigation Hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-widest text-gray-400 pointer-events-none">
        [ DRAG_TO_ROTATE_SYSTEM ]
      </div>
    </div>
  );
}

export default React.memo(GalleryCarouselComp);
