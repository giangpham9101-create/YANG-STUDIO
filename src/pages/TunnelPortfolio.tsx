import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Image, Environment } from '@react-three/drei';
import * as THREE from 'three';

/**
 * --- CHUYÊN GIA THREE.JS & REACT THREE FIBER ---
 * FIX: White Screen of Death & Performance Optimization
 */

// Import local images
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

const ASSETS = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10];

// --- GLOBAL CONFIGURATION ---
const GLOBAL_SCALE = 2; // Phóng to quy mô tunnel
const MAX_IMAGES_PER_ROW = 5;
const ROW_SPACING = 1;
const TUNNEL_LENGTH = 160 * GLOBAL_SCALE; // 320 units
const CELL_SIZE = 4 * GLOBAL_SCALE;       // 8 units
const TUNNEL_WIDTH = 20 * GLOBAL_SCALE;    // 40 units
const TUNNEL_HEIGHT = 12 * GLOBAL_SCALE;   // 24 units

// --- HELPER: GRID TEXTURE ---
// Tạo texture lưới sắc nét để dán lên tường
function createGridTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Nền tối cho phong cách Brutalist
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 512, 512);

    // Đường lưới màu Xanh Acid (D1FF00)
    ctx.strokeStyle = '#D1FF00';
    ctx.lineWidth = 4;
    // Vẽ viền 1x1 của ô lưới (Sẽ lặp lại theo CELL_SIZE)
    ctx.strokeRect(0, 0, 512, 512);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 16;
  return tex;
}

// --- FIXED LAYOUT GENERATOR ---
// Tạo layout ngẫu nhiên nhưng so le tự nhiên (không dính nhau)
const FIXED_LAYOUT = (() => {
  const layout: any[] = [];
  const numZCells = Math.round(TUNNEL_LENGTH / CELL_SIZE);

  // Tọa độ tâm các ô lưới
  const xCenters = [-16, -8, 0, 8, 16]; 
  const yCenters = [-8, 0, 8];         

  // Cấu trúc dữ liệu để theo dõi các ô đã bị chiếm đóng trên từng mặt tường
  // Sử dụng để kiểm tra hàng xóm trước khi đặt ảnh mới
  const occupied: Record<number, Set<string>> = { 0: new Set(), 1: new Set(), 2: new Set(), 3: new Set() };

  for (let z = 0; z < numZCells; z++) {
    const zPos = -z * CELL_SIZE - (CELL_SIZE / 2);

    for (let wall = 0; wall < 4; wall++) {
      const isHorizontal = (wall === 0 || wall === 1);
      const centers = isHorizontal ? xCenters : yCenters;

      centers.forEach((pos, i) => {
        // Tỷ lệ xuất hiện ngẫu nhiên (Giảm xuống 0.18 để thưa hơn nữa theo yêu cầu)
        const spawnChance = 0.18;
        
        if (Math.random() < spawnChance) {
          // KIỂM TRA HÀNG XÓM (Trái, Phải, Trước Z-1 và Z-2) để tăng độ thưa
          const neighbors = [
            `${z}-${i - 1}`, // Trái
            `${z}-${i + 1}`, // Phải
            `${z - 1}-${i}`, // Trước (Z-1)
            `${z - 2}-${i}`  // Trước nữa (Z-2) để so le rộng hơn
          ];
          
          const isNeighborOccupied = neighbors.some(n => occupied[wall].has(n));

          if (!isNeighborOccupied) {
            occupied[wall].add(`${z}-${i}`);
            
            layout.push({
              pos: isHorizontal 
                ? [pos, (wall === 0 ? 1 : -1) * (TUNNEL_HEIGHT / 2), zPos]
                : [(wall === 2 ? -1 : 1) * (TUNNEL_WIDTH / 2), pos, zPos],
              rot: isHorizontal
                ? [(wall === 0 ? 1 : -1) * (Math.PI / 2), 0, 0]
                : [0, (wall === 2 ? 1 : -1) * (Math.PI / 2), 0],
              url: ASSETS[Math.floor(Math.random() * ASSETS.length)]
            });
          }
        }
      });
    }
  }
  return layout;
})();

// --- COMPONENTS ---

function ImageTile({ position, rotation, url }: { position: [number, number, number], rotation: [number, number, number], url: string }) {
  const [hovered, setHovered] = useState(false);
  const scaleRef = useRef(new THREE.Vector3(1, 1, 1));

  useFrame((state, delta) => {
    const target = hovered ? 1.1 : 1;
    scaleRef.current.lerp(new THREE.Vector3(target, target, target), 10 * delta);
  });

  return (
    <group position={position} rotation={rotation}>
      <group
        scale={scaleRef.current}
        position={[0, 0, 0.05]} // Nhô ra khỏi mặt tường một chút để tránh clipping
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <Image
          url={url}
          scale={[CELL_SIZE, CELL_SIZE]} // Phủ kín ô lưới (8x8)
          toneMapped={false}
          transparent
          side={THREE.DoubleSide}
          // drei/Image tự động tối ưu tỉ lệ ảnh theo khung (object-fit: cover) để tránh méo hình
        />
        {/* Khung neon bao quanh khi hover */}
        {hovered && (
          <mesh position={[0, 0, -0.01]}>
            <planeGeometry args={[CELL_SIZE, CELL_SIZE]} />
            <meshBasicMaterial color="#D1FF00" transparent opacity={0.4} />
          </mesh>
        )}
      </group>
    </group>
  );
}

function TunnelBlock({ offsetZ }: { offsetZ: number }) {
  const gridTexture = useMemo(() => createGridTexture(), []);

  // Thiết lập texture repeat cho các diện tường
  const floorTex = useMemo(() => {
    const t = gridTexture.clone();
    t.repeat.set(TUNNEL_WIDTH / CELL_SIZE, TUNNEL_LENGTH / CELL_SIZE);
    return t;
  }, [gridTexture]);

  const wallTex = useMemo(() => {
    const t = gridTexture.clone();
    t.repeat.set(TUNNEL_LENGTH / CELL_SIZE, TUNNEL_HEIGHT / CELL_SIZE);
    return t;
  }, [gridTexture]);

  return (
    <group position={[0, 0, offsetZ]}>
      {/* Tường TRÊN */}
      <mesh position={[0, TUNNEL_HEIGHT / 2, -TUNNEL_LENGTH / 2]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[TUNNEL_WIDTH, TUNNEL_LENGTH]} />
        <meshStandardMaterial map={floorTex} roughness={0.5} metalness={0.5} />
      </mesh>

      {/* Tường DƯỚI */}
      <mesh position={[0, -TUNNEL_HEIGHT / 2, -TUNNEL_LENGTH / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[TUNNEL_WIDTH, TUNNEL_LENGTH]} />
        <meshStandardMaterial map={floorTex} roughness={0.5} metalness={0.5} />
      </mesh>

      {/* Tường TRÁI */}
      <mesh position={[-TUNNEL_WIDTH / 2, 0, -TUNNEL_LENGTH / 2]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[TUNNEL_LENGTH, TUNNEL_HEIGHT]} />
        <meshStandardMaterial map={wallTex} roughness={0.5} metalness={0.5} />
      </mesh>

      {/* Tường PHẢI */}
      <mesh position={[TUNNEL_WIDTH / 2, 0, -TUNNEL_LENGTH / 2]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[TUNNEL_LENGTH, TUNNEL_HEIGHT]} />
        <meshStandardMaterial map={wallTex} roughness={0.5} metalness={0.5} />
      </mesh>

      {/* RENDER IMAGES CHECK */}
      {FIXED_LAYOUT.map((item, i) => (
        <ImageTile
          key={`${offsetZ}-${i}`}
          position={item.pos}
          rotation={item.rot}
          url={item.url}
        />
      ))}
    </group>
  );
}

function InfiniteTunnelController() {
  const scrollRef = useRef(0);
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      scrollRef.current -= e.deltaY * 0.05;
    };


    // Mouse events cho rotation
    const onMouseDown = () => { isDragging.current = true; document.body.style.cursor = 'grabbing'; };
    const onMouseUp = () => { isDragging.current = false; document.body.style.cursor = 'grab'; targetRotation.current = { x: 0, y: 0 }; };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      targetRotation.current.y += e.movementX * 0.002;
      targetRotation.current.x += e.movementY * 0.002;
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  useFrame((state, delta) => {
    // Tự động trôi
    if (!isDragging.current) {
      scrollRef.current += 10 * delta;
    }

    // Scroll Logic: Loop seamless
    const z = -(scrollRef.current % TUNNEL_LENGTH);
    state.camera.position.z = z + 50; // Offset camera 50 units như yêu cầu

    // Rotation Lerp
    currentRotation.current.x = THREE.MathUtils.lerp(currentRotation.current.x, targetRotation.current.x, 5 * delta);
    currentRotation.current.y = THREE.MathUtils.lerp(currentRotation.current.y, targetRotation.current.y, 5 * delta);
    state.camera.rotation.x = -currentRotation.current.x;
    state.camera.rotation.y = -currentRotation.current.y;
  });

  return (
    <group>
      {/* Vẽ 3 block để gối đầu nhau tạo cảm giác vô tận */}
      <TunnelBlock offsetZ={TUNNEL_LENGTH} />
      <TunnelBlock offsetZ={0} />
      <TunnelBlock offsetZ={-TUNNEL_LENGTH} />
      <TunnelBlock offsetZ={-TUNNEL_LENGTH * 2} />
    </group>
  );
}

// --- MAIN PAGE ---
export default function TunnelPortfolio() {
  return (
    <div
      style={{ width: '100vw', height: '100vh', background: '#000', position: 'relative', overflow: 'hidden' }}
    >
      {/* UI OVERLAY */}
      <div className="absolute top-12 left-12 z-10 pointer-events-none mix-blend-difference text-white">
        <h1 className="font-display text-6xl uppercase tracking-tighter leading-none mb-2">
          KINETIC<br />TUNNEL_V2
        </h1>
        <p className="font-mono text-xs text-gray-400 uppercase tracking-widest">
          Expert_Refinement: Protocol_Online
        </p>
      </div>

      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
        style={{ width: '100%', height: '100%' }}
      >
        <color attach="background" args={["#000000"]} />
        {/* Fog dense hơn để giới hạn tầm nhìn tại điểm hút (vanishing point) */}
        <fog attach="fog" args={["#000000", 10, 220]} />

        {/* LIGHTING: AmbientLight 1.5 as requested */}
        <ambientLight intensity={1.5} />
        <pointLight position={[0, 0, 0]} intensity={1} color="#D1FF00" />

        {/* CAMERA: FOV 85 tăng cảm giác chiều sâu, Far 10000 */}
        <PerspectiveCamera makeDefault position={[0, 0, 50]} fov={85} near={0.1} far={10000} />

        <InfiniteTunnelController />

        <Environment preset="night" />
      </Canvas>
    </div>
  );
}
