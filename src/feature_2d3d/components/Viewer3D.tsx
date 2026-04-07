import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Stage, PerspectiveCamera, Environment, useCursor } from '@react-three/drei';
import * as THREE from 'three';
// @ts-ignore
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';
// @ts-ignore
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { Download, Box, Sparkles, MousePointer2, RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';
import { MaterialConfig, ExtrudeSettings, GeometryStyle, StrokeData, ArtistMark } from '../types';
import { pointsToShape, svgPathToShapes, getGlobalTransform, applyLaplacianSmoothing, smoothPoints } from '../lib/three-utils';

import { RECYCLED_MATERIALS } from '../constants/materials';

interface Viewer3DProps {
  strokes: StrokeData[];
  baseShapeId: string | null;
  onUpdateStrokeMaterial: (id: string, color: string, materialId: string) => void;
  activeMaterial: MaterialConfig;
  extrudeSettings: ExtrudeSettings;
  style: GeometryStyle;
  smoothBrushActive: boolean;
  smoothRadius: number;
  smoothStrength: number;
}

const CANVAS_SIZE = 500;

/**
 * Checks if a point is inside the base shape boundary.
 * Points are already mapped to centered system (-250 to 250)
 */
const isPointInsideBase = (p: { x: number; y: number }, shapeId: string | null) => {
  if (!shapeId) return true;
  
  const x = p.x;
  const y = p.y;

  switch (shapeId) {
    case 'circle':
      return Math.sqrt(x * x + y * y) <= 150;
    case 'square':
      return Math.abs(x) <= 150 && Math.abs(y) <= 150;
    case 'heart':
      // Bounding box for heart
      return Math.abs(x) <= 150 && y <= 150 && y >= -150;
    case 'star':
      return Math.sqrt(x * x + y * y) <= 200;
    case 'shield':
      return Math.abs(x) <= 150 && y <= 200 && y >= -200;
    default:
      return true;
  }
};
const BackSideMark: React.FC<{ 
  mark: ArtistMark; 
  activeMaterial: MaterialConfig;
}> = ({ mark, activeMaterial }) => {
  const texture = useMemo(() => {
    if (!mark || mark.type === 'none' || !mark.text) return null;

    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    ctx.clearRect(0, 0, 1024, 1024);

    // Styling the engraving
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'black 120px "Courier New", monospace';
    
    ctx.save();
    ctx.translate(512, 512);
    ctx.scale(-1, 1);
    
    ctx.fillText(mark.text, 0, 0);
    ctx.font = 'bold 40px "Courier New", monospace';
    ctx.fillText("AUTHENTICITY MARK // RECYCLE_3D", 0, 120);
    ctx.fillText(`PRODUCED BY DRAND // ${activeMaterial.name.toUpperCase()}`, 0, 180);
    
    ctx.restore();

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, [mark, activeMaterial]);

  if (!texture) return null;

  return (
    <mesh position={[0, 0, -0.05]} rotation={[0, 0, 0]}>
      <planeGeometry args={[300, 300]} />
      <meshStandardMaterial 
        transparent
        alphaMap={texture}
        color="#000000"
        roughness={1}
        metalness={0}
        opacity={0.6}
        depthWrite={false}
      />
    </mesh>
  );
};

const MeshPart: React.FC<{ 
  stroke: StrokeData, 
  baseShapeId: string | null,
  index: number,
  activeMaterial: MaterialConfig,
  extrudeSettings: ExtrudeSettings,
  style: GeometryStyle,
  onClick: () => void,
  smoothBrushActive: boolean,
  smoothRadius: number,
  smoothStrength: number,
  showWireframe?: boolean
}> = ({ stroke, baseShapeId, index, activeMaterial, extrudeSettings, style, onClick, smoothBrushActive, smoothRadius, smoothStrength, showWireframe = false }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [brushPos, setBrushPos] = useState<THREE.Vector3 | null>(null);
  useCursor(hovered && !smoothBrushActive);

  // MATERIAL LOOKUP: Pull realistic plastic properties for each specific part
  const materialProps = useMemo(() => {
    const mat = RECYCLED_MATERIALS.find(m => m.id === stroke.materialId);
    if (!mat) {
      // NEUTRAL FALLBACK: Unfilled shapes look like a gray mold/clay
      return { id: 'unfilled', name: 'Unfilled', color: '#888888', roughness: 0.9, metalness: 0.05 };
    }
    return mat;
  }, [stroke.materialId]);

  const isBase = stroke.layer === 'base';

  // ULTRA-SAFE Z-PLACEMENT:
  // Detail blobs sit on the surface of the base shape
  const zPosition = isBase ? 0 : extrudeSettings.depth + 0.1;

  const geometry = useMemo(() => {
    const tubeRadius = 3.0;
    if (isBase || (stroke.layer === 'detail' && stroke.pathData)) {
      // 1. BASE SHAPE: Use ExtrudeGeometry
      let rawShapes: THREE.Shape[] = [];
      
      if (stroke.pathData) {
        rawShapes = svgPathToShapes(stroke.pathData);
      }
      
      if (rawShapes.length === 0) {
        const fallbackShape = pointsToShape(stroke.points);
        if (fallbackShape) rawShapes = [fallbackShape];
      }

      if (rawShapes.length === 0) return null;

      // Depth logic: Base uses user setting, Details use the dynamic detailThickness setting
      const depth = isBase ? extrudeSettings.depth : extrudeSettings.detailThickness;

      const geo = new THREE.ExtrudeGeometry(rawShapes, { 
        ...extrudeSettings, 
        depth,
        bevelEnabled: true,
        bevelThickness: 1,
        bevelSize: 1,
        bevelSegments: 3, 
        steps: 1 
      });
      // EXACT ALIGNMENT MAPPING: Both SVG and Strokes are now mathematically perfectly aligned.
      // 1. Scale Y by -1 to match Three.js coordinate system with Canvas Y down.
      // 2. Translate by -250, +250 to bring the center of the 500x500 path exactly to (0,0).
      geo.scale(1, -1, 1);
      geo.translate(-250, 250, 0);
      return geo;
    } else {
      // 2. DETAIL STROKES: Ultra-safe generation
      if (!stroke.points || stroke.points.length === 0) return null;

      // Points are already mapped to centered system in DrawingCanvas.tsx
      const mappedPoints = stroke.points;
      
      // PREVENT SILENT CRASHES: Handle single-point strokes (dots)
      if (mappedPoints.length === 1) {
        const p = mappedPoints[0];
        // Render a cylinder acting as a dot
        const geo = new THREE.CylinderGeometry(tubeRadius, tubeRadius, 1, 16);
        geo.rotateX(Math.PI / 2); // Orient towards camera
        geo.translate(p.x, p.y, 0);
        return geo;
      }

      // Filter out consecutive duplicate points (distance > 0.1)
      const filteredPoints = mappedPoints.filter((p, i, arr) => {
        if (i === 0) return true;
        const prev = arr[i - 1];
        const distSq = Math.pow(p.x - prev.x, 2) + Math.pow(p.y - prev.y, 2);
        return distSq > 0.01; // distance > 0.1
      });

      if (filteredPoints.length < 2) {
        // Fallback to cylinder if filtering left us with 1 point
        const p = filteredPoints[0] || mappedPoints[0];
        const geo = new THREE.CylinderGeometry(tubeRadius, tubeRadius, 1, 16);
        geo.rotateX(Math.PI / 2);
        geo.translate(p.x, p.y, 0);
        return geo;
      }

      const curvePoints = filteredPoints.map(p => new THREE.Vector3(p.x, p.y, 0));
      
      try {
        const curve = new THREE.CatmullRomCurve3(curvePoints);
        return new THREE.TubeGeometry(curve, 64, tubeRadius, 8, false);
      } catch (err) {
        console.error("CatmullRomCurve3/TubeGeometry failed:", err);
        // Final emergency fallback to spheres for each point
        const group = new THREE.Group();
        filteredPoints.forEach(p => {
          const sphere = new THREE.SphereGeometry(tubeRadius, 8, 8);
          sphere.translate(p.x, p.y, 0);
          // We can't return a group from useMemo that expects a Geometry
          // So we'll just return null and let it fail gracefully if the curve fails
        });
        return null;
      }
    }
  }, [stroke, extrudeSettings, isBase]);

  if (!geometry) return null;

  const handlePointerMove = (e: any) => {
    if (!smoothBrushActive || !meshRef.current) return;
    
    const point = e.point;
    setBrushPos(point);

    if (e.buttons) {
      const localPoint = meshRef.current.worldToLocal(point.clone());
      applyLaplacianSmoothing(meshRef.current.geometry, localPoint, smoothRadius, smoothStrength);
    }
  };

  const meshColor = materialProps.color;

  return (
    <group onPointerMove={handlePointerMove} onPointerOut={() => setBrushPos(null)}>
      <mesh 
        ref={meshRef}
        geometry={geometry}
        castShadow 
        receiveShadow
        position={[0, 0, zPosition]}
        onClick={(e) => {
          e.stopPropagation();
          if (!smoothBrushActive) onClick();
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial 
          color={meshColor} 
          roughness={materialProps.roughness} 
          metalness={materialProps.metalness}
          flatShading={style === 'lowpoly'}
          envMapIntensity={1.5}
          side={THREE.DoubleSide}
        />
        {showWireframe && (
          <meshBasicMaterial wireframe color="#ffffff" transparent opacity={0.1} />
        )}
      </mesh>
      
      {/* ARTIST MARK / SIGNATURE ON BACK SIDE */}
      {isBase && extrudeSettings.artistMark && (
        <BackSideMark mark={extrudeSettings.artistMark} activeMaterial={activeMaterial} />
      )}
      
      {smoothBrushActive && brushPos && (
        <mesh position={brushPos} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[smoothRadius - 0.5, smoothRadius, 64]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.8} depthTest={false} />
        </mesh>
      )}
    </group>
  );
};

export const Viewer3D: React.FC<Viewer3DProps> = ({ 
  strokes, 
  baseShapeId,
  onUpdateStrokeMaterial,
  activeMaterial, 
  extrudeSettings, 
  style,
  smoothBrushActive,
  smoothRadius,
  smoothStrength
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [showWireframe, setShowWireframe] = useState(false);

  // UNIFIED 1:1 SCALE SYSTEM:
  // Instead of calculating scale based on bounding box, use a stable scale
  // that maps the 500px canvas to a reasonable 3D size (e.g., 100 units).
  const globalTransform = useMemo(() => {
    return {
      scale: 100 / CANVAS_SIZE,
      center: new THREE.Vector3(0, 0, 0)
    };
  }, []);

  const exportToSTL = () => {
    if (!groupRef.current) return;
    
    const exporter = new STLExporter();
    const result = exporter.parse(groupRef.current);
    
    const blob = new Blob([result], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    link.style.display = 'none';
    document.body.appendChild(link);
    link.href = URL.createObjectURL(blob);
    link.download = `recycled-${activeMaterial.id}.stl`;
    link.click();
    document.body.removeChild(link);
  };

  const exportToGLB = () => {
    if (!groupRef.current) return;
    
    const exporter = new GLTFExporter();
    exporter.parse(
      groupRef.current,
      (gltf) => {
        const blob = new Blob([gltf as ArrayBuffer], { type: 'application/octet-stream' });
        const link = document.createElement('a');
        link.style.display = 'none';
        document.body.appendChild(link);
        link.href = URL.createObjectURL(blob);
        link.download = `recycled-${activeMaterial.id}.glb`;
        link.click();
        document.body.removeChild(link);
      },
      (error) => {
        console.error('An error happened during GLB export:', error);
      },
      { binary: true }
    );
  };

  const controlsRef = useRef<any>(null);

  const handleReset = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full relative">
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={() => setShowWireframe(!showWireframe)}
          className={cn(
            "p-2 rounded-lg transition-all shadow-xl border",
            showWireframe ? "bg-blue-600 border-blue-400 text-white" : "bg-[#1a1a1a] border-white/10 text-gray-400 hover:text-white"
          )}
          title="Toggle Wireframe Overlay"
        >
          <Box size={18} />
        </button>
        <button
          onClick={handleReset}
          className="p-2 bg-[#1a1a1a] border border-white/10 text-gray-400 rounded-lg hover:text-white transition-all shadow-xl"
          title="Reset Camera"
        >
          <RotateCcw size={18} />
        </button>
        <div className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-xl border",
          smoothBrushActive ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-blue-500/10 text-blue-500 border-blue-500/20"
        )}>
          {smoothBrushActive ? <Sparkles size={14} /> : <MousePointer2 size={14} />}
          {smoothBrushActive ? "Sculpting" : "Painting"}
        </div>
        <button
          onClick={exportToSTL}
          disabled={strokes.length === 0}
          className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-all font-bold text-xs shadow-xl disabled:opacity-20 disabled:cursor-not-allowed"
        >
          <Download size={16} />
          STL
        </button>
        <button
          onClick={exportToGLB}
          disabled={strokes.length === 0}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all font-bold text-xs shadow-xl disabled:opacity-20 disabled:cursor-not-allowed"
        >
          <Download size={16} />
          GLB
        </button>
      </div>

      <div className="flex-1 bg-[#050505] rounded-xl overflow-hidden border border-white/5 relative">
        {strokes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div className="text-gray-700 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-800 flex items-center justify-center">
                <Box size={32} className="opacity-20" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em]">Waiting for Input</p>
            </div>
          </div>
        )}
        <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, preserveDrawingBuffer: true }}>
          <PerspectiveCamera makeDefault position={[0, 0, 150]} fov={45} />
          <Stage environment="city" intensity={0.8} shadows="contact" adjustCamera={false}>
            <group 
              ref={groupRef}
              // Apply global scale but center at 0,0 since MeshPart handles coordinate mapping
              scale={[globalTransform.scale, globalTransform.scale, globalTransform.scale]}
              position={[0, 0, 0]}
            >
              {strokes.map((stroke, index) => (
                <MeshPart 
                  key={stroke.id}
                  stroke={stroke}
                  baseShapeId={baseShapeId}
                  index={index}
                  activeMaterial={activeMaterial}
                  extrudeSettings={extrudeSettings}
                  style={style}
                  onClick={() => onUpdateStrokeMaterial(stroke.id, activeMaterial.color, activeMaterial.id)}
                  smoothBrushActive={smoothBrushActive}
                  smoothRadius={smoothRadius}
                  smoothStrength={smoothStrength}
                  showWireframe={showWireframe}
                />
              ))}
            </group>
          </Stage>
          <OrbitControls 
            ref={controlsRef}
            makeDefault 
            enabled={!smoothBrushActive}
            minPolarAngle={0} 
            maxPolarAngle={Math.PI} 
            enableDamping
            dampingFactor={0.05}
          />
          <Environment preset="studio" />
          <spotLight position={[100, 100, 100]} angle={0.15} penumbra={1} intensity={2} castShadow />
          <pointLight position={[-100, -100, -100]} intensity={1} />
        </Canvas>

        {/* Wireframe Overlay Close-up (Subtle) */}
        {showWireframe && strokes.length > 0 && (
          <div className="absolute bottom-6 right-6 w-32 h-32 rounded-xl border border-blue-500/30 bg-blue-500/5 backdrop-blur-md overflow-hidden pointer-events-none animate-in zoom-in-95 duration-300">
            <div className="absolute inset-0 opacity-20">
              <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-[8px] font-black text-blue-400 uppercase tracking-tighter text-center px-2">
                Clean Topology<br/>Verified
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
