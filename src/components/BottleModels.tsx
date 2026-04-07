import React, { useMemo } from 'react';
import * as THREE from 'three';

// --- PET Bottle Body Geometry ---
const createBottlePoints = () => {
  const points = [];
  // Bottom
  points.push(new THREE.Vector2(0, 0));
  points.push(new THREE.Vector2(0.4, 0));
  // Body
  points.push(new THREE.Vector2(0.45, 0.2));
  points.push(new THREE.Vector2(0.45, 1.2));
  // Shoulder
  points.push(new THREE.Vector2(0.3, 1.5));
  // Neck
  points.push(new THREE.Vector2(0.15, 1.6));
  points.push(new THREE.Vector2(0.15, 1.8));
  return points;
};

export const BottleBody: React.FC<{ color: string }> = ({ color }) => {
  const points = useMemo(() => createBottlePoints(), []);
  
  return (
    <mesh castShadow receiveShadow>
      <latheGeometry args={[points, 16]} />
      <meshPhysicalMaterial 
        color={color}
        transmission={0.95}
        thickness={0.5}
        roughness={0.05}
        metalness={0.1}
        ior={1.45}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
};

// --- HDPE Cap Geometry ---
export const BottleCap: React.FC<{ color: string }> = ({ color }) => {
  return (
    <group>
      {/* Top Cap */}
      <mesh castShadow receiveShadow position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.1, 32]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* Thread Ring */}
      <mesh position={[0, -0.02, 0]}>
        <torusGeometry args={[0.18, 0.02, 8, 32]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
    </group>
  );
};

// --- Recycle Fragment (Shredded Plastic) ---
export const RecycleFragment: React.FC<{ color: string }> = ({ color }) => {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.lineTo(0.2, 0.1);
    s.lineTo(0.3, -0.1);
    s.lineTo(0.1, -0.2);
    s.lineTo(-0.1, -0.1);
    return s;
  }, []);

  return (
    <mesh castShadow receiveShadow>
      <extrudeGeometry args={[shape, { depth: 0.02, bevelEnabled: false }]} />
      <meshStandardMaterial color={color} roughness={0.6} side={THREE.DoubleSide} />
    </mesh>
  );
};

export const COLORS = {
  pet: ['#e0f7fa', '#b2ebf2', '#80deea'],
  hdpe: ['#d32f2f', '#1976d2', '#388e3c', '#fbc02d', '#f57c00', '#7b1fa2', '#D1FF00', '#FF0080']
};
