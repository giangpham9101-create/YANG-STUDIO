import React, { useEffect, useState, useMemo, Suspense } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { usePet, PetType } from '../lib/PetContext';

// Assets - Import all 9 models for flexibility
import chai1Url from '../assets/PLASTIC 3D/chai1.glb?url';
import chai2Url from '../assets/PLASTIC 3D/chai2.glb?url';
import chai3Url from '../assets/PLASTIC 3D/chai3.glb?url';
import chai4Url from '../assets/PLASTIC 3D/chai4.glb?url';
import chai5Url from '../assets/PLASTIC 3D/chai5.glb?url';
import chai6Url from '../assets/PLASTIC 3D/chai6.glb?url';
import chai7Url from '../assets/PLASTIC 3D/chai7.glb?url';
import chai8Url from '../assets/PLASTIC 3D/chai8.glb?url';
import chai9Url from '../assets/PLASTIC 3D/chai9.glb?url';

const MODEL_URLS: Record<string, string> = {
  chai1: chai1Url,
  chai2: chai2Url,
  chai3: chai3Url,
  chai4: chai4Url,
  chai5: chai5Url,
  chai6: chai6Url,
  chai7: chai7Url,
  chai8: chai8Url,
  chai9: chai9Url,
};

// Preload models
Object.values(MODEL_URLS).forEach(url => useGLTF.preload(url));

/**
 * --- PHẦN TÙY CHỈNH KÍCH THƯỚC VÀ VỊ TRÍ ---
 */
const PET_CONFIG = {
  SCALE: 10.0,
  OFFSET_X: 30,
  OFFSET_Y: 20,
  ROTATION_X: 0,
  ROTATION_Y: Math.PI / 4,
  ROTATION_Z: 0
};

function PetModel({ type }: { type: PetType }) {
  const url = MODEL_URLS[type as keyof typeof MODEL_URLS];
  if (!url) return null;

  const { scene } = useGLTF(url);

  const clonedScene = useMemo(() => {
    if (!scene) return new THREE.Group();
    const cloned = scene.clone();

    // Normalize scale and center
    const box = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);

    const scaleFactor = PET_CONFIG.SCALE / maxDim;
    cloned.scale.set(scaleFactor, scaleFactor, scaleFactor);

    const center = new THREE.Vector3();
    box.getCenter(center);
    cloned.position.set(-center.x * scaleFactor, -center.y * scaleFactor, -center.z * scaleFactor);

    // Initial orientation
    cloned.rotation.set(PET_CONFIG.ROTATION_X, PET_CONFIG.ROTATION_Y, PET_CONFIG.ROTATION_Z);

    return cloned;
  }, [scene]);

  return <primitive object={clonedScene} />;
}

const CursorPet: React.FC = () => {
  const { activePet, setPetPosition } = usePet();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 120 };
  const petX = useSpring(mouseX, springConfig);
  const petY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX + PET_CONFIG.OFFSET_X);
      mouseY.set(e.clientY + PET_CONFIG.OFFSET_Y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    const unsubscribeX = petX.on('change', (val) => {
      setPetPosition({ x: val, y: petY.get() });
    });
    const unsubscribeY = petY.on('change', (val) => {
      setPetPosition({ x: petX.get(), y: val });
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      unsubscribeX();
      unsubscribeY();
    };
  }, [mouseX, mouseY, petX, petY, setPetPosition]);

  if (activePet === 'none') return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <motion.div
        style={{
          x: petX,
          y: petY,
          width: 250,
          height: 250,
          marginLeft: -125,
          marginTop: -125
        }}
        className="relative"
      >
        <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
          <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={45} />
          <ambientLight intensity={1.5} />
          <pointLight position={[10, 10, 10]} intensity={2.5} />
          <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />

          <Suspense fallback={null}>
            <PetModel key={activePet} type={activePet} />
            <Environment preset="city" />
          </Suspense>
        </Canvas>

        <div className="absolute inset-0 bg-neon-green/5 blur-2xl rounded-full scale-50 -z-10"></div>
      </motion.div>
    </div>
  );
};

export default CursorPet;
