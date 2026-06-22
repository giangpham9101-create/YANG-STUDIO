import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import { Environment, useCursor, useTexture, shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, X, Plus, Minus } from "lucide-react";

// --- CUSTOM SHADER MATERIAL FOR PREMIUM SOFT SHADOWS ---
// SDF-based rounded rectangle shadow eliminates "banding" and preserves perfect corner radii
const SoftShadowMaterial = shaderMaterial(
  {
    color: new THREE.Color("#000000"),
    opacity: 0.1,
    size: new THREE.Vector2(1, 1),
    radius: 0.1,
    blur: 0.1,
  },
  // Vertex Shader
  `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  // Fragment Shader (SDF Based)
  `
  varying vec2 vUv;
  uniform vec3 color;
  uniform float opacity;
  uniform vec2 size;
  uniform float radius;
  uniform float blur;

  float sdRoundedBox(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
  }

  void main() {
    // Total size of the shadow plane (includes padding for blur)
    vec2 planeSize = size + (blur * 5.0);
    vec2 p = (vUv - 0.5) * planeSize;
    
    float d = sdRoundedBox(p, size * 0.5, radius);
    
    // Smooth transition for the shadow glow
    float shadow = 1.0 - smoothstep(-blur, blur, d);
    
    // Soft vignette/falloff at the extreme edges to prevent hard cutoffs
    float edgeMask = smoothstep(0.5, 0.4, abs(vUv.x - 0.5)) * smoothstep(0.5, 0.4, abs(vUv.y - 0.5));
    
    gl_FragColor = vec4(color, shadow * opacity * edgeMask);
  }
  `
);

extend({ SoftShadowMaterial });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      softShadowMaterial: any;
    }
  }
}

// --- IMPORT ASSETS ---
import o1 from "../assets/anhonhiem/o1.jpg";
import o2 from "../assets/anhonhiem/o2.jpg";
import o3 from "../assets/anhonhiem/o3.webp";
import o4 from "../assets/anhonhiem/o4.webp";
import o5 from "../assets/anhonhiem/o5.jpg";
import o6 from "../assets/anhonhiem/o6.webp";
import o7 from "../assets/anhonhiem/o7.webp";
import o8 from "../assets/anhonhiem/o8.jpg";
import o9 from "../assets/anhonhiem/o9.jpg";
import o10 from "../assets/anhonhiem/o10.webp";
import o11 from "../assets/anhonhiem/o11.jpg";

type MediaType = "image" | "video";
export type CarouselItem = {
  id: number;
  title: string;
  material: string;
  type: MediaType;
  src: string;
  href?: string;
};

// --- BỘ ĐIỀU KHIỂN DÀNH CHO NHÀ THIẾT KẾ ---
export type GalleryCarouselConfig = {
  autoplay: boolean;
  direction: 1 | -1;
  autoplaySpeed: number;
  momentumDecay: number;
  dragSensitivity: number;
  edgeFade: boolean;
  edgeFadeWidthPx: number;
  // Hiệu ứng 3D
  radiusDesktop: number;
  radiusMobile: number;
  zOffset: number; // Tâm của vòng tròn. Nên mang giá trị âm để nằm trước camera.
  cameraZ: number; // Vị trí Z của camera. 
  yOffset: number;
  cardWidth: number;
  cardHeight: number;
  cornerRadius: number;
  // Mới: Điều khiển số lượng và khoảng cách
  maxVisible: number;
  itemSpacing: number; // Mặc định 1.0. Tăng lên để giãn cách rộng hơn.
};

const DEFAULT_CAROUSEL_CONFIG: GalleryCarouselConfig = {
  autoplay: true,
  direction: -1 as 1 | -1,
  autoplaySpeed: 0.15,
  momentumDecay: 0.95,
  dragSensitivity: 0.008,
  edgeFade: true,
  edgeFadeWidthPx: 200,
  // Cảm giác 3D - Thiết lập CONCAVE (camera bên trong vòng tròn, nhìn vào tường xa)
  radiusDesktop: 12,
  radiusMobile: 8,
  zOffset: -2, // Tâm vòng tròn nằm hơi chếch về phía trước camera
  cameraZ: 2,  // Camera được đặt ở vị trí nhìn thấy bức tường phía sau của vòng tròn
  yOffset: 0,
  cardWidth: 5,
  cardHeight: 7.5,
  cornerRadius: 0.4,
  maxVisible: 7,
  itemSpacing: 0.8,
};

const FALLBACK_ITEMS: CarouselItem[] = [
  { id: 1, title: "Ô NHIỄM 01", material: "WASTE", type: "image", src: o1 },
  { id: 2, title: "Ô NHIỄM 02", material: "WASTE", type: "image", src: o2 },
  { id: 3, title: "Ô NHIỄM 03", material: "WASTE", type: "image", src: o3 },
  { id: 4, title: "Ô NHIỄM 04", material: "WASTE", type: "image", src: o4 },
  { id: 5, title: "Ô NHIỄM 05", material: "WASTE", type: "image", src: o5 },
  { id: 6, title: "Ô NHIỄM 06", material: "WASTE", type: "image", src: o6 },
  { id: 7, title: "Ô NHIỄM 07", material: "WASTE", type: "image", src: o7 },
  { id: 8, title: "Ô NHIỄM 08", material: "WASTE", type: "image", src: o8 },
  { id: 9, title: "Ô NHIỄM 09", material: "WASTE", type: "image", src: o9 },
  { id: 10, title: "Ô NHIỄM 10", material: "WASTE", type: "image", src: o10 },
  { id: 11, title: "Ô NHIỄM 11", material: "WASTE", type: "image", src: o11 },
];

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

function RoundedPlane({
  width,
  height,
  radius,
}: {
  width: number;
  height: number;
  radius: number;
}) {
  const shape = useMemo(() => {
    const w = width;
    const h = height;
    const r = Math.min(radius, Math.min(w, h) / 2);
    const s = new THREE.Shape();
    s.moveTo(-w / 2 + r, -h / 2);
    s.lineTo(w / 2 - r, -h / 2);
    s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
    s.lineTo(w / 2, h / 2 - r);
    s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
    s.lineTo(-w / 2 + r, h / 2);
    s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
    s.lineTo(-w / 2, -h / 2 + r);
    s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
    return s;
  }, [width, height, radius]);

  const geom = useMemo(() => {
    const geometry = new THREE.ShapeGeometry(shape, 64);
    geometry.computeBoundingBox();
    const pos = geometry.attributes.position;
    const uvs = new Float32Array(pos.count * 2);
    for (let i = 0; i < pos.count; i++) {
      uvs[i * 2] = (pos.getX(i) + width / 2) / width;
      uvs[i * 2 + 1] = (pos.getY(i) + height / 2) / height;
    }
    geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    return geometry;
  }, [shape, width, height]);

  return <primitive object={geom} attach="geometry" />;
}

function normalizeAngle(angle: number) {
  let a = angle % (Math.PI * 2);
  if (a < 0) a += Math.PI * 2;
  return a;
}

function VideoCardMedia({ src, width, height, radius }: { src: string; width: number; height: number; radius: number }) {
  const [texture, setTexture] = useState<THREE.VideoTexture | null>(null);

  useEffect(() => {
    const video = document.createElement("video");
    video.src = src;
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.autoplay = true;

    const tex = new THREE.VideoTexture(video);
    tex.colorSpace = THREE.SRGBColorSpace;

    video.addEventListener("loadedmetadata", () => {
      if (!video.videoWidth || !video.videoHeight) return;
      const imgAspect = video.videoWidth / video.videoHeight;
      const planeAspect = width / height;

      let repeatX = 1, repeatY = 1, offsetX = 0, offsetY = 0;
      if (imgAspect > planeAspect) {
        repeatX = planeAspect / imgAspect;
        offsetX = (1 - repeatX) / 2;
      } else {
        repeatY = imgAspect / planeAspect;
        offsetY = (1 - repeatY) / 2;
      }
      tex.repeat.set(repeatX, repeatY);
      tex.offset.set(offsetX, offsetY);
    });

    setTexture(tex);

    video.play().catch(() => { });
    return () => {
      tex.dispose();
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [src]);

  if (!texture) return null;

  return (
    <mesh>
      <RoundedPlane width={width} height={height} radius={radius} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

function ImageCardMedia({ src, width, height, radius }: { src: string; width: number; height: number; radius: number }) {
  const tex = useTexture(src) as THREE.Texture;

  useMemo(() => {
    if (!tex) return;
    tex.colorSpace = THREE.SRGBColorSpace;
    const img = tex.image as HTMLImageElement | undefined;
    if (!img || !img.width || !img.height) return;

    const imgAspect = img.width / img.height;
    const frameAspect = width / height;

    if (imgAspect > frameAspect) {
      // Image is wider than frame -> cover height, crop sides
      tex.repeat.set(frameAspect / imgAspect, 1);
      tex.offset.set((1 - tex.repeat.x) / 2, 0);
    } else {
      // Image is taller than frame -> cover width, crop top/bottom
      tex.repeat.set(1, imgAspect / frameAspect);
      tex.offset.set(0, (1 - tex.repeat.y) / 2);
    }
  }, [tex, width, height]);

  return (
    <mesh>
      <RoundedPlane width={width} height={height} radius={radius} />
      <meshBasicMaterial map={tex} toneMapped={false} />
    </mesh>
  );
}

function Card({
  item,
  index,
  total,
  radius,
  rotationRef,
  onNavigate,
  cfg,
  baseAngleOverride,
}: {
  item: CarouselItem;
  index: number;
  total: number;
  radius: number;
  rotationRef: React.MutableRefObject<number>;
  onNavigate?: (href: string) => void;
  cfg: GalleryCarouselConfig;
  baseAngleOverride?: number;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  // Góc cơ bản cho thẻ này trên vòng tròn.
  const baseAngle = baseAngleOverride ?? (index / total) * Math.PI * 2;

  useFrame((state) => {
    if (!meshRef.current) return;

    // Hiệu ứng nghiêng khi di chuột qua
    if (hovered) {
      const mouseX = state.mouse.x * 0.15;
      const mouseY = state.mouse.y * 0.15;
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, mouseY, 0.1);
      meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, -mouseX, 0.1);
    } else {
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, 0, 0.1);
      meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, 0, 0.1);
    }

    // Giữ nguyên opacity và visibility của tất cả các phần tử
    // để tạo thành một vòng lặp vô cực liền mạch. Không ẩn (culling) đột ngột.
  });

  // Tính toán vị trí tĩnh trên vòng tròn sử dụng itemSpacing
  const x = Math.sin(baseAngle) * radius;
  const z = Math.cos(baseAngle) * radius;
  const SoftShadowMaterialElement = "softShadowMaterial" as any;

  return (
    <group
      position={[x, cfg.yOffset, z]}
      // Hướng VÀO TRONG tâm của vòng tròn.
      // Math.PI + baseAngle giúp thẻ nhìn về hướng (0, yOffset, 0)
      rotation={[0, Math.PI + baseAngle, 0]}
    >
      <group
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => {
          const href = item.href || item.src;
          if (onNavigate) onNavigate(href);
          else window.open(href, "_blank");
        }}
      >
        {/* Premium SDF Shadow - Perfectly smooth gradient without banding */}
        <mesh position={[0, 0, -0.1]}>
          <planeGeometry args={[cfg.cardWidth + 2.5, cfg.cardHeight + 2.5]} />
          <SoftShadowMaterialElement
            color="#000000"
            opacity={0.35}
            size={new THREE.Vector2(cfg.cardWidth, cfg.cardHeight)}
            radius={cfg.cornerRadius}
            blur={0.5}
            transparent
            depthWrite={false}
          />
        </mesh>

        {/* Outer Frame Highlight for card definition */}
        <mesh position={[0, 0, -0.015]}>
          <RoundedPlane width={cfg.cardWidth + 0.04} height={cfg.cardHeight + 0.04} radius={cfg.cornerRadius + 0.02} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.6} depthWrite={false} />
        </mesh>

        {item.type === "image" ? (
          <ImageCardMedia
            src={item.src}
            width={cfg.cardWidth}
            height={cfg.cardHeight}
            radius={cfg.cornerRadius}
          />
        ) : (
          <VideoCardMedia
            src={item.src}
            width={cfg.cardWidth}
            height={cfg.cardHeight}
            radius={cfg.cornerRadius}
          />
        )}
      </group>
    </group>
  );
}

function CarouselScene({
  isMobile,
  rotationRef,
  velocityRef,
  isDragging,
  onNavigate,
  items,
  cfg,
}: {
  isMobile: boolean;
  rotationRef: React.MutableRefObject<number>;
  velocityRef: React.MutableRefObject<number>;
  isDragging: React.MutableRefObject<boolean>;
  onNavigate?: (href: string) => void;
  items: CarouselItem[];
  cfg: GalleryCarouselConfig;
}) {
  const baseRadius = isMobile ? cfg.radiusMobile : cfg.radiusDesktop;
  // Bán kính động: giãn thẻ ra mà vòng tròn vẫn khép kín 360 độ
  const dynamicRadius = baseRadius * cfg.itemSpacing;
  
  // Tinh chỉnh zOffset để giữ nguyên khoảng cách tối ưu từ camera đến bức tường phía sau
  const originalFarZ = cfg.zOffset - baseRadius;
  const dynamicZOffset = originalFarZ + dynamicRadius;

  const ringGroupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  useEffect(() => {
    // Camera được đặt ở phía trước tâm của bức tường phía sau.
    camera.position.set(0, 0, cfg.cameraZ);
  }, [camera, cfg.cameraZ]);

  useFrame((state, delta) => {
    if (!ringGroupRef.current) return;

    if (!isDragging.current) {
      velocityRef.current *= cfg.momentumDecay;
      rotationRef.current += velocityRef.current;

      if (cfg.autoplay) {
        rotationRef.current += cfg.direction * cfg.autoplaySpeed * delta;
      }
    }

    ringGroupRef.current.rotation.y = rotationRef.current;
  });

  return (
    <>
      <ambientLight intensity={1} />
      {/* Nhóm Vòng Tròn 3D tự động dời ra xa khi bán kính tăng, giúp hình ảnh vẫn ở đúng tiêu cự */}
      <group position={[0, 0, dynamicZOffset]} ref={ringGroupRef}>
        {items.map((item, i) => {
          // Góc chia ĐỀU 360 độ (bắt buộc để tạo vòng lặp vô cực, không bao giờ bị cắt rỗng)
          const baseAngle = (i / items.length) * Math.PI * 2;

          return (
            <Card
              key={item.id}
              item={item}
              index={i}
              total={items.length}
              radius={dynamicRadius}
              rotationRef={rotationRef}
              onNavigate={onNavigate}
              cfg={cfg}
              // Truyền baseAngle đã tính toán xuống
              baseAngleOverride={baseAngle}
            />
          );
        })}
      </group>
      <Environment preset="city" />
    </>
  );
}

export type GalleryCarouselProps = {
  items?: CarouselItem[];
  config?: Partial<GalleryCarouselConfig>;
  onNavigate?: (href: string) => void;
  className?: string;
};

const GalleryCarouselComp = function GalleryCarousel({ items, config, onNavigate, className = "" }: GalleryCarouselProps) {
  const rotationRef = useRef(0);
  const velocityRef = useRef(0);
  const isDragging = useRef(false);
  const lastX = useRef(0);
  const [isMobile, setIsMobile] = useState(false);

  // --- TRẠNG THÁI ĐIỀU KHIỂN ĐỘNG ---
  const [localSpacing, setLocalSpacing] = useState(DEFAULT_CAROUSEL_CONFIG.itemSpacing);
  const [localMaxVisible, setLocalMaxVisible] = useState(DEFAULT_CAROUSEL_CONFIG.maxVisible);
  const [showPanel, setShowPanel] = useState(false);

  const cfg = useMemo<GalleryCarouselConfig>(() => {
    const base = { ...DEFAULT_CAROUSEL_CONFIG, ...(config || {}) };
    return {
      ...base,
      itemSpacing: localSpacing,
      maxVisible: localMaxVisible
    };
  }, [config, localSpacing, localMaxVisible]);

  const resolvedItems = useMemo(() => items && items.length > 0 ? items : FALLBACK_ITEMS, [items]);

  // --- ĐỒNG BỘ HÓA TRẠNG THÁI VỚI CODE (REACTIVE CONFIG) ---
  // Đảm bảo rằng khi bạn chỉnh sửa DEFAULT_CAROUSEL_CONFIG hoặc truyền props mới, 
  // giao diện sẽ cập nhật ngay cả khi không tải lại trang (HMR).
  useEffect(() => {
    setLocalSpacing(config?.itemSpacing ?? DEFAULT_CAROUSEL_CONFIG.itemSpacing);
    setLocalMaxVisible(config?.maxVisible ?? DEFAULT_CAROUSEL_CONFIG.maxVisible);
  }, [
    config?.itemSpacing,
    config?.maxVisible,
    DEFAULT_CAROUSEL_CONFIG.itemSpacing,
    DEFAULT_CAROUSEL_CONFIG.maxVisible
  ]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    lastX.current = e.clientX;
    velocityRef.current = 0;
    (e.currentTarget as HTMLDivElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const delta = (e.clientX - lastX.current) * cfg.dragSensitivity;
    velocityRef.current = delta;
    rotationRef.current += delta;
    lastX.current = e.clientX;
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  return (
    <div
      className={`w-full min-h-[500px] h-[65vh] md:h-[75vh] relative cursor-grab active:cursor-grabbing overflow-hidden rounded-2xl bg-[#FAFAFA] ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      style={{ touchAction: "none" }}
    >
      {/* BỘ ĐIỀU KHIỂN - CONTROL PANEL UI */}
      <div className="absolute top-4 right-4 z-50 flex flex-col items-end gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowPanel(!showPanel)}
          className="p-3 bg-white/80 backdrop-blur-md border border-neutral-200 rounded-full shadow-lg text-neutral-800 pointer-events-auto"
        >
          {showPanel ? <X size={20} /> : <Settings size={20} />}
        </motion.button>

        <AnimatePresence>
          {showPanel && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="p-5 bg-white/80 backdrop-blur-xl border border-neutral-200 rounded-2xl shadow-2xl w-64 pointer-events-auto overflow-hidden ring-1 ring-black/5"
            >
              <h3 className="text-sm font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <Settings size={14} className="text-blue-600" />
                CẤU HÌNH GALLERY 3D
              </h3>

              {/* Điều chỉnh Spacing */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Khoảng cách</label>
                  <span className="text-xs font-mono bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-700">{localSpacing.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="3.0"
                  step="0.1"
                  value={localSpacing}
                  onChange={(e) => setLocalSpacing(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Điều chỉnh Max Visible */}
              <div className="mb-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Số lượng hiển thị</label>
                  <span className="text-xs font-mono bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-700">{localMaxVisible}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setLocalMaxVisible(Math.max(1, localMaxVisible - 1))}
                    className="flex-1 py-2 bg-neutral-50 border border-neutral-200 rounded-lg flex justify-center text-neutral-600 hover:bg-neutral-100 transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <button
                    onClick={() => setLocalMaxVisible(Math.min(resolvedItems.length, localMaxVisible + 1))}
                    className="flex-1 py-2 bg-neutral-50 border border-neutral-200 rounded-lg flex justify-center text-neutral-600 hover:bg-neutral-100 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-neutral-100">
                <p className="text-[10px] text-neutral-400 leading-relaxed italic last:mb-0">
                  * Kéo để xoay, click để xem chi tiết.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Canvas
        key="gallery-carousel-canvas"
        camera={{ position: [0, 0, 5], fov: 65 }} // FOV được tinh chỉnh để tạo hiệu ứng phối cảnh kịch tính
        gl={{ antialias: true, alpha: true }}
      >
        <CanvasErrorBoundary>
          <React.Suspense fallback={null}>
            <CarouselScene
              isMobile={isMobile}
              rotationRef={rotationRef}
              velocityRef={velocityRef}
              isDragging={isDragging}
              onNavigate={onNavigate}
              items={resolvedItems}
              cfg={cfg}
            />
          </React.Suspense>
        </CanvasErrorBoundary>
      </Canvas>


      {/* Hiệu ứng Mờ Cạnh Điện Ảnh khớp với giao diện chính */}
      {cfg.edgeFade && (
        <>
          <div
            className="absolute inset-y-0 left-0 pointer-events-none z-10"
            style={{
              width: cfg.edgeFadeWidthPx,
              background: "linear-gradient(90deg, #FAFAFA 0%, rgba(250,250,250,0.85) 20%, rgba(250,250,250,0) 100%)",
            }}
          />
          <div
            className="absolute inset-y-0 right-0 pointer-events-none z-10"
            style={{
              width: cfg.edgeFadeWidthPx,
              background: "linear-gradient(270deg, #FAFAFA 0%, rgba(250,250,250,0.85) 20%, rgba(250,250,250,0) 100%)",
            }}
          />
        </>
      )}
    </div>
  );
}

export default React.memo(GalleryCarouselComp);
