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
  useTexture,
  useGLTF
} from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';
import gsap from 'gsap';

import chai1Url from '../assets/PLASTIC 3D/chai1.glb?url';
import chai2Url from '../assets/PLASTIC 3D/chai2.glb?url';
import chai3Url from '../assets/PLASTIC 3D/chai3.glb?url';
import chai4Url from '../assets/PLASTIC 3D/chai4.glb?url';
import chai5Url from '../assets/PLASTIC 3D/chai5.glb?url';
import chai6Url from '../assets/PLASTIC 3D/chai6.glb?url';
import chai7Url from '../assets/PLASTIC 3D/chai7.glb?url';
import chai8Url from '../assets/PLASTIC 3D/chai8.glb?url';
import chai9Url from '../assets/PLASTIC 3D/chai9.glb?url';

const BOTTLE_URLS = [
  chai1Url, chai2Url, chai3Url, chai4Url, chai5Url, chai6Url, chai7Url, chai8Url, chai9Url
];

// Tải trước các mô hình
BOTTLE_URLS.forEach(url => useGLTF.preload(url));

const PARTICLE_COUNT = 2200;
const WASTE_COUNT = 30;
const SCENE_DEPTH = {
  minZ: -220,
  maxZ: 50
};

const COLORS = [
  "#D1FF00", // Acid Green
  "#FF4D00", // Neon Orange
  "#00D1FF", // Electric Blue
  "#FFFFFF"  // White
];

// --- CỦA BẠN ĐÂY: DÙNG DÒNG NÀY ĐỂ CHỈNH KÍCH THƯỚC CHAI (VÍ DỤ 2.0 LÀ VỪA, 5.0 LÀ TO) ---
const BOTTLE_BASE_SCALE = 4.5;
// ------------------------------------------------------------------------------------

// --- CỦA BẠN ĐÂY: DÙNG DÒNG NÀY ĐỂ CHỈNH KÍCH THƯỚC HẠT NHỰA LI TI (Mặc định 0.1) ---
const PARTICLE_SIZE = 0.3;
// ------------------------------------------------------------------------------------

// --- CỦA BẠN ĐÂY: DÙNG DÒNG NÀsY ĐỂ CHỈNH SỐ LƯỢNG CHAI NHỰA (Mặc định 30) ---
const BOTTLE_COUNT = 180;
// ------------------------------------------------------------------------------------

function Microplastics() {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const cols = new Float32Array(PARTICLE_COUNT * 3);
    const sz = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 120;

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

    // Lắc lư theo dòng hải lưu
    pointsRef.current.position.x = Math.sin(t * 0.2) * 0.2;
    pointsRef.current.position.y = Math.cos(t * 0.3) * 0.2;

    // Trôi dạt nhẹ
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
        size={PARTICLE_SIZE}
        vertexColors
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        sizeAttenuation={true}
      />
    </points>
  );
}

function BottleInstance({
  gltf, item
}: {
  gltf: any,
  item: any
}) {
  const scene = useMemo(() => {
    if (!gltf || !gltf.scene) return new THREE.Group();

    const cloned = gltf.scene.clone();

    // Tính toán bounding box để chuẩn hóa tỷ lệ
    const box = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    box.getSize(size);

    const maxDim = Math.max(size.x, size.y, size.z);
    let scaleFactor = 5;

    // Buộc kích thước tối đa khoảng 1 đơn vị trước khi áp dụng tỷ lệ cho từng mục
    if (maxDim > 0 && maxDim !== Infinity) {
      scaleFactor = 1 / maxDim;
      cloned.scale.set(scaleFactor, scaleFactor, scaleFactor);
    }

    // Căn giữa trọng tâm của mô hình
    const center = new THREE.Vector3();
    box.getCenter(center);
    if (maxDim > 0 && maxDim !== Infinity) {
      cloned.position.set(-center.x * scaleFactor, -center.y * scaleFactor, -center.z * scaleFactor);
    }

    // Áp dụng vật liệu nhựa tùy chỉnh (PET hoặc HDPE)
    cloned.traverse((child: any) => {
      if (child.isMesh) {
        if (item.materialType === 'PET') {
          // Nhựa Trong Suốt (PET)
          child.material = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(item.color || "#ffffff"),
            metalness: 0,
            roughness: 0.1,
            transmission: 0.9, // High transparency
            thickness: 0.5,    // Refraction thickness
            ior: 1.5,          // Index of refraction for plastic
            transparent: true,
            opacity: 1
          });
        } else {
          // Nhựa Đục/Bán Trong Suốt (HDPE)
          child.material = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(item.color || "#ffffff"),
            metalness: 0,
            roughness: 0.4,
            transmission: 0.2, // Semi-translucent
            thickness: 1.0,
            transparent: true,
            opacity: 0.9
          });
        }
      }
    });

    // Bao bọc trong một nhóm cha để việc căn giữa không xung đột với vị trí nguyên thủy
    const wrapper = new THREE.Group();
    wrapper.add(cloned);
    return wrapper;
  }, [gltf, item.color]);

  return (
    <Float speed={item.speed} rotationIntensity={0.5} floatIntensity={0.5}>
      <primitive
        object={scene}
        position={item.position}
        rotation={item.rotation}
        scale={[item.scale, item.scale, item.scale]}
      />
    </Float>
  );
}

function FloatingBottles({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const smoothedScrollRef = useRef(scrollProgress);

  // Tải các mô hình riêng lẻ để đảm bảo an toàn tối đa cho hook array
  const m0 = useGLTF(BOTTLE_URLS[0]);
  const m1 = useGLTF(BOTTLE_URLS[1]);
  const m2 = useGLTF(BOTTLE_URLS[2]);
  const m3 = useGLTF(BOTTLE_URLS[3]);
  const m4 = useGLTF(BOTTLE_URLS[4]);
  const m5 = useGLTF(BOTTLE_URLS[5]);
  const m6 = useGLTF(BOTTLE_URLS[6]);
  const m7 = useGLTF(BOTTLE_URLS[7]);
  const m8 = useGLTF(BOTTLE_URLS[8]);
  const models = [m0, m1, m2, m3, m4, m5, m6, m7, m8];

  const items = useMemo(() => {
    // Tạo một số thực thể ngẫu nhiên cho các chai nhựa
    const instances = [];
    const colors = ["#D1FF00", "#FF4D00", "#00D1FF", "#FFFFFF"];
    // Dùng biến BOTTLE_COUNT để chỉnh số lượng chai
    for (let i = 0; i < BOTTLE_COUNT; i++) {
      const modelIndex = Math.floor(Math.random() * 9);
      
      // Tạo tọa độ bay vào từ rìa ngoài màn hình (sử dụng Polar coordinates)
      const angle = Math.random() * Math.PI * 2;
      const radius = 35 + Math.random() * 25; // Bắt đầu hoàn toàn bên ngoài khung hình camera
      const startOffsetX = Math.cos(angle) * radius;
      const startOffsetY = Math.sin(angle) * radius;
      const startOffsetZ = (Math.random() - 0.5) * 50; // Độ lệch trục dọc ngẫu nhiên

      instances.push({
        modelIndex,
        // Căn vị trí đích tập trung đều quanh tâm màn hình hơn
        position: [
          (Math.random() - 0.5) * 32, 
          (Math.random() - 0.5) * 16 - 0.5,
          SCENE_DEPTH.minZ + Math.random() * (SCENE_DEPTH.maxZ - SCENE_DEPTH.minZ)
        ] as [number, number, number],
        startOffset: [startOffsetX, startOffsetY, startOffsetZ] as [number, number, number],
        rotation: [
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        ] as [number, number, number],
        scale: BOTTLE_BASE_SCALE + Math.random() * (BOTTLE_BASE_SCALE / 2),
        speed: 0.2 + Math.random() * 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotationSpeed: [
          (Math.random() - 0.5) * 0.005,
          (Math.random() - 0.5) * 0.005,
          (Math.random() - 0.5) * 0.005
        ] as [number, number, number],
        driftAmount: 0.3 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2,
        spinBoost: 0.6 + Math.random() * 0.8,
        materialType: Math.random() > 0.4 ? 'PET' : 'HDPE' // Mostly PET (clear) and some HDPE
      });
    }
    return instances;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    smoothedScrollRef.current = THREE.MathUtils.damp(
      smoothedScrollRef.current,
      scrollProgress,
      4,
      state.clock.getDelta()
    );
    const s = smoothedScrollRef.current;

    // Hệ số intro chạy từ 0 đến 1 trong 4 giây đầu
    const intro = Math.min(1, t / 4.0);
    // Hiệu ứng easing cubic ease-out bay vào nhanh rồi chậm lại mượt mà
    const ease = 1 - Math.pow(1 - intro, 3);

    groupRef.current.children.forEach((child, i) => {
      const item = items[i];
      const phase = item.phase + i * 0.13;
      const drift = item.driftAmount;
      const basePos = item.position;
      const baseRot = item.rotation;

      // Tính toán dịch chuyển thu hẹp khoảng cách từ ngoài rìa vào tâm
      const currentOffsetX = item.startOffset[0] * (1 - ease);
      const currentOffsetY = item.startOffset[1] * (1 - ease);
      const currentOffsetZ = item.startOffset[2] * (1 - ease);

      child.position.set(
        basePos[0] + currentOffsetX + Math.sin(t * (0.25 + item.speed) + phase) * drift,
        basePos[1] + currentOffsetY + Math.cos(t * (0.30 + item.speed * 0.8) + phase) * drift * 0.6,
        basePos[2] + currentOffsetZ + Math.sin(t * 0.19 + phase) * 1.6 + s * 6
      );

      // Phóng to dần từ 0 lên kích thước thật khi mới bay vào
      const currentScale = item.scale * ease;
      child.scale.set(currentScale, currentScale, currentScale);

      // Xoáy nhanh hơn lúc bay vào từ ngoài màn hình, rồi tự động xoay chậm dần ổn định
      const spin = 1 + s * item.spinBoost * 0.20 + (1 - ease) * 5;
      child.rotation.set(
        baseRot[0] + t * item.rotationSpeed[0] * 150 * spin,
        baseRot[1] + t * item.rotationSpeed[1] * 100 * spin,
        baseRot[2] + t * item.rotationSpeed[2] * 100 * spin
      );
    });
  });

  return (
    <group ref={groupRef}>
      {items.map((item, i) => (
        <BottleInstance key={i} gltf={models[item.modelIndex]} item={item} />
      ))}
    </group>
  );
}

function PlasticWaste({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const smoothedScrollRef = useRef(scrollProgress);

  const items = useMemo(() => {
    return Array.from({ length: WASTE_COUNT }).map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10 - 2,
        SCENE_DEPTH.minZ + Math.random() * (SCENE_DEPTH.maxZ - SCENE_DEPTH.minZ)
      ] as [number, number, number],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI] as [number, number, number],
      scale: 0.8 + Math.random() * 2,
      color: COLORS[Math.floor(Math.random() * 3)], // Xanh Acid, Cam, Xanh Dương
      type: Math.floor(Math.random() * 4), // 0: chai, 1: mảnh vụn, 2: thùng chứa, 3: tấm
      phase: Math.random() * Math.PI * 2,
      driftAmount: 0.15 + Math.random() * 0.45
    }));
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    smoothedScrollRef.current = THREE.MathUtils.damp(
      smoothedScrollRef.current,
      scrollProgress,
      3.5,
      state.clock.getDelta()
    );
    const s = smoothedScrollRef.current;

    // Lắc lư theo dòng hải lưu
    groupRef.current.children.forEach((child, i) => {
      const item = items[i];
      const phase = item.phase + i * 0.09;
      const basePos = item.position;
      const baseRot = item.rotation;
      const drift = item.driftAmount;

      child.position.set(
        basePos[0] + Math.sin(t * 0.35 + phase) * drift * 1.2,
        basePos[1] + Math.cos(t * 0.25 + phase) * drift,
        basePos[2] + Math.sin(t * 0.12 + phase) * 1.2 + s * 6
      );

      child.rotation.set(
        baseRot[0] + Math.sin(t * 0.7 + phase) * 0.25,
        baseRot[1] + Math.cos(t * 0.55 + phase) * 0.25,
        baseRot[2] + Math.sin(t * 0.45 + phase) * 0.2
      );
    });
  });

  return (
    <group ref={groupRef}>
      {items.map((item, i) => (
        <Float key={i} speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh position={item.position} rotation={item.rotation} scale={item.scale}>
            {item.type === 0 ? (
              // Chai
              <cylinderGeometry args={[0.15, 0.15, 0.6, 8]} />
            ) : item.type === 1 ? (
              // Mảnh vụn
              <boxGeometry args={[0.4, 0.05, 0.4]} />
            ) : item.type === 2 ? (
              // Thùng chứa
              <boxGeometry args={[0.3, 0.3, 0.3]} />
            ) : (
              // Tấm
              <planeGeometry args={[0.5, 0.5]} />
            )}
            <meshPhysicalMaterial
              color={item.color}
              metalness={0}
              roughness={item.type === 0 ? 0.1 : 0.4}
              transmission={item.type === 0 ? 0.8 : 0.2}
              thickness={0.5}
              transparent
              opacity={0.8}
              side={THREE.DoubleSide}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function CinematicCamera({ scrollProgress }: { scrollProgress: number }) {
  const { camera } = useThree();
  const smoothedScrollRef = useRef(scrollProgress);

  useFrame((state) => {
    smoothedScrollRef.current = THREE.MathUtils.damp(
      smoothedScrollRef.current,
      scrollProgress,
      5,
      state.clock.getDelta()
    );
    const s = smoothedScrollRef.current;

    // Giữ camera di chuyển bên trong trường vật thể để cuối trang không bao giờ trống.
    const targetZ = 8 - s * 45;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);

    // Giữ camera cố định góc nhìn thẳng trục Z
    camera.position.x = 0;
    camera.position.y = 1;
    camera.rotation.z = 0;
    camera.lookAt(0, 1, camera.position.z - 18);
  });

  return (
    <PerspectiveCamera makeDefault fov={60} position={[0, 1, 10]}>
      {/* Ánh sáng đi theo camera để đảm bảo các vật thể luôn hiển thị */}
      <pointLight intensity={1.5} distance={50} color="#ffffff" />
    </PerspectiveCamera>
  );
}

function CinematicLights({ scrollProgress }: { scrollProgress: number }) {
  const keyLightRef = useRef<THREE.PointLight>(null);
  const rimLightRef = useRef<THREE.PointLight>(null);
  const fillLightRef = useRef<THREE.PointLight>(null);
  const smoothedScrollRef = useRef(scrollProgress);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    smoothedScrollRef.current = THREE.MathUtils.damp(
      smoothedScrollRef.current,
      scrollProgress,
      4,
      state.clock.getDelta()
    );
    const s = smoothedScrollRef.current;

    if (keyLightRef.current) {
      keyLightRef.current.position.set(
        8 + Math.sin(t * 0.4) * 3,
        6 + Math.cos(t * 0.35) * 2,
        18 - s * 28
      );
      keyLightRef.current.intensity = 1.5 + Math.sin(t * 0.7) * 0.2;
    }

    if (rimLightRef.current) {
      rimLightRef.current.position.set(
        -10 + Math.cos(t * 0.3) * 2,
        4 + Math.sin(t * 0.25) * 2,
        -8 - s * 22
      );
      rimLightRef.current.intensity = 1.1 + Math.cos(t * 0.6) * 0.15;
    }

    if (fillLightRef.current) {
      fillLightRef.current.position.set(
        0,
        -4 + Math.sin(t * 0.2) * 0.8,
        10 - s * 20
      );
      fillLightRef.current.intensity = 0.65;
    }
  });

  return (
    <>
      <ambientLight intensity={0.22} />
      <pointLight ref={keyLightRef} intensity={1.6} distance={80} color="#D1FF00" />
      <pointLight ref={rimLightRef} intensity={1.15} distance={70} color="#00D1FF" />
      <pointLight ref={fillLightRef} intensity={0.65} distance={50} color="#ffffff" />
    </>
  );
}

export default function PlasticWasteScroll({ scrollProgress = 0 }: { scrollProgress?: number }) {
  return (
    <div className="fixed inset-0 z-0 bg-white">
      <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <fog attach="fog" args={["#FFFFFF", 30, 250]} />

        <CinematicCamera scrollProgress={scrollProgress} />
        <CinematicLights scrollProgress={scrollProgress} />

        <Microplastics />
        <React.Suspense fallback={null}>
          <FloatingBottles scrollProgress={scrollProgress} />
        </React.Suspense>
        <PlasticWaste scrollProgress={scrollProgress} />

        <Environment preset="night" />

        <EffectComposer>
          <Bloom
            intensity={1.5}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
          <Noise opacity={0.05} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
