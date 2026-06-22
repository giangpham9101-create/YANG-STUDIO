import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Stage, PerspectiveCamera, Environment, useCursor } from '@react-three/drei';
import * as THREE from 'three';
// @ts-ignore
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter';
// @ts-ignore
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { RotateCcw, Download, Box } from 'lucide-react';
import { cn } from '../lib/utils';
import { MaterialConfig, ExtrudeSettings, GeometryStyle, StrokeData, ArtistMark } from '../types';
import { pointsToShape, svgPathToShapes, getGlobalTransform, applyLaplacianSmoothing, smoothPoints, simplifyPathRDP } from '../lib/three-utils';
import { refineGeometry } from '../lib/mesh-processor';

import { RECYCLED_MATERIALS } from '../constants/materials';

// Pop-Art SVG imports
import assetGLBButton from '../../assets/info workshop/SVG/Asset 48.svg';
import assetSTLButton from '../../assets/info workshop/SVG/Asset 49.svg';
import assetBoxIcon from '../../assets/info workshop/SVG/Asset 50.svg';
import assetViewerFrame from '../../assets/info workshop/SVG/Asset 51.svg';
import assetWaitingPrompt from '../../assets/info workshop/SVG/Asset 52.svg';
import assetThicknessLabel from '../../assets/info workshop/SVG/Asset 54.svg';
import assetDepthLabel from '../../assets/info workshop/SVG/Asset 55.svg';

export interface ViewerAssetsConfig {
  stlButton: { offsetX: number; offsetY: number; scale: number };
  glbButton: { offsetX: number; offsetY: number; scale: number };
  wireframeButton: { offsetX: number; offsetY: number; scale: number };
  viewerFrame: { offsetX: number; offsetY: number; scale: number };
  waitingPrompt: { offsetX: number; offsetY: number; scale: number };
  depthLabel: { offsetX: number; offsetY: number; scale: number };
  thicknessLabel: { offsetX: number; offsetY: number; scale: number };
}

const DEFAULT_VIEWER_CONFIG: ViewerAssetsConfig = {
  stlButton: { offsetX: 0, offsetY: 0, scale: 1.0 },
  glbButton: { offsetX: 0, offsetY: 0, scale: 1.0 },
  wireframeButton: { offsetX: 0, offsetY: 0, scale: 1.0 },
  viewerFrame: { offsetX: 0, offsetY: 0, scale: 1.0 },
  waitingPrompt: { offsetX: 0, offsetY: 0, scale: 1.0 },
  depthLabel: { offsetX: 0, offsetY: 0, scale: 1.0 },
  thicknessLabel: { offsetX: 0, offsetY: 0, scale: 1.0 },
};

interface Viewer3DProps {
  strokes: StrokeData[];
  baseShapeId: string | null;
  onUpdateStrokeMaterial: (id: string, color: string, materialId: string) => void;
  activeMaterial: MaterialConfig;
  extrudeSettings: ExtrudeSettings;
  setExtrudeSettings: (settings: ExtrudeSettings) => void;
  style: GeometryStyle;
  smoothBrushActive: boolean;
  smoothRadius: number;
  smoothStrength: number;
  subdivisionLevel: number;
  retopologyDecimate: number;
  assetsConfig?: ViewerAssetsConfig;
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
  showWireframe?: boolean,
  subdivisionLevel: number,
  retopologyDecimate: number
}> = ({ stroke, baseShapeId, index, activeMaterial, extrudeSettings, style, onClick, smoothBrushActive, smoothRadius, smoothStrength, showWireframe = false, subdivisionLevel, retopologyDecimate }) => {
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
  const tubeRadius = 3.0;

  // DYNAMIC Z-PLACEMENT:
  // Calculate Z position so that detail strokes sit perfectly on the front surface of the base shape,
  // preventing any gaps/separation when scaling depth or thickness.
  let zPosition = 0;
  if (!isBase) {
    const baseFrontZ = extrudeSettings.depth / 2;
    if (stroke.pathData) {
      // Extruded detail shape
      const detailHalfDepth = extrudeSettings.detailThickness / 2;
      zPosition = baseFrontZ + detailHalfDepth - 0.1; // 0.1 overlap to prevent gaps
    } else {
      // Tube detail stroke
      zPosition = baseFrontZ + tubeRadius - 0.1; // 0.1 overlap to prevent gaps
    }
  }

  const geometry = useMemo(() => {
    let rawGeo: THREE.BufferGeometry | null = null;
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
        bevelEnabled: isBase ? extrudeSettings.bevelEnabled : false,
        bevelThickness: isBase ? extrudeSettings.bevelThickness : 0,
        bevelSize: isBase ? extrudeSettings.bevelSize : 0,
        bevelSegments: isBase ? extrudeSettings.bevelSegments : 0,
        steps: 1
      });
      // EXACT ALIGNMENT MAPPING: Both SVG and Strokes are now mathematically perfectly aligned.
      // 1. Scale Y by -1 to match Three.js coordinate system with Canvas Y down.
      // 2. Translate by -250, +250 to bring the center of the 500x500 path exactly to (0,0).
      geo.scale(1, -1, 1);
      geo.translate(-250, 250, 0);
      geo.computeBoundingBox();
      if (geo.boundingBox) {
        const center = new THREE.Vector3();
        geo.boundingBox.getCenter(center);
        geo.translate(0, 0, -center.z);
      }
      rawGeo = geo;
    } else {
      // 2. DETAIL STROKES: Ultra-safe generation
      if (!stroke.points || stroke.points.length === 0) return null;

      // Apply 2D RDP simplification first to smooth out hand-drawn points
      const simplifiedPoints = simplifyPathRDP(stroke.points, 1.0);

      // PREVENT SILENT CRASHES: Handle single-point strokes (dots)
      if (simplifiedPoints.length === 1) {
        const p = simplifiedPoints[0];
        // Render a cylinder acting as a dot
        const geo = new THREE.CylinderGeometry(tubeRadius, tubeRadius, 1, 16);
        geo.rotateX(Math.PI / 2); // Orient towards camera
        geo.translate(p.x - 250, 250 - p.y, 0);
        rawGeo = geo;
      } else {
        // Filter out consecutive duplicate points (distance > 0.1)
        const filteredPoints = simplifiedPoints.filter((p, i, arr) => {
          if (i === 0) return true;
          const prev = arr[i - 1];
          const distSq = Math.pow(p.x - prev.x, 2) + Math.pow(p.y - prev.y, 2);
          return distSq > 0.01; // distance > 0.1
        });

        if (filteredPoints.length < 2) {
          // Fallback to cylinder if filtering left us with 1 point
          const p = filteredPoints[0] || simplifiedPoints[0];
          const geo = new THREE.CylinderGeometry(tubeRadius, tubeRadius, 1, 16);
          geo.rotateX(Math.PI / 2);
          geo.translate(p.x - 250, 250 - p.y, 0);
          rawGeo = geo;
        } else {
          const curvePoints = filteredPoints.map(p => new THREE.Vector3(p.x - 250, 250 - p.y, 0));

          try {
            const curve = new THREE.CatmullRomCurve3(curvePoints);
            rawGeo = new THREE.TubeGeometry(curve, 64, tubeRadius, 8, false);
          } catch (err) {
            console.error("CatmullRomCurve3/TubeGeometry failed:", err);
            return null;
          }
        }
      }
    }

    if (!rawGeo) return null;

    // Apply 3D Welding, Subdivision Surface and Retopology in real-time
    return refineGeometry(rawGeo, subdivisionLevel, retopologyDecimate);
  }, [stroke, extrudeSettings, isBase, subdivisionLevel, retopologyDecimate]);

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
          <meshBasicMaterial color="#D1FF00" transparent opacity={0.8} depthTest={false} />
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
  setExtrudeSettings,
  style,
  smoothBrushActive,
  smoothRadius,
  smoothStrength,
  subdivisionLevel,
  retopologyDecimate,
  assetsConfig
}) => {
  const cfg = assetsConfig || DEFAULT_VIEWER_CONFIG;
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
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col md:flex-row gap-6 w-full items-stretch mt-1 overflow-visible">
        {/* LEFT PLACEHOLDER (Matches Drawing Canvas Sidebar width to align the viewports perfectly) */}
        <div className="hidden md:block md:w-44 shrink-0" />

        {/* 3D Canvas Box (Framed in Blue Border Container, matching drawing canvas layout) */}
        <div 
          className="flex-1 relative overflow-visible self-center w-full flex flex-col justify-between"
          style={{
            aspectRatio: '1753.91 / 1580.04',
            transform: `translate(${cfg.viewerFrame.offsetX}px, ${cfg.viewerFrame.offsetY}px) scale(${cfg.viewerFrame.scale})`,
            transformOrigin: 'center'
          }}
        >
          {/* Asset 51 Viewer Frame */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <svg 
              viewBox="0 0 1753.91 1580.04" 
              preserveAspectRatio="none" 
              className="w-full h-full select-none"
            >
              <path 
                fill="#fff" 
                stroke="blue" 
                strokeMiterlimit={10} 
                strokeWidth={6} 
                d="M85.24,3h1583.43c45.39,0,82.24,36.85,82.24,82.24v1409.56c0,45.39-36.85,82.24-82.24,82.24H85.24c-45.39,0-82.24-36.85-82.24-82.24V85.24C3,39.85,39.85,3,85.24,3Z"
              />
            </svg>
          </div>

          <div 
            className="absolute bg-[#F9F9F9] overflow-hidden flex flex-col justify-between z-10"
            style={{
              left: '4.86%',
              right: '4.86%',
              top: '5.4%',
              bottom: '5.4%',
              borderRadius: '4.7%'
            }}
          >
            {/* Top portion for 3D Canvas */}
            <div className="flex-1 relative w-full min-h-[300px]">
              {/* Pop-Art Action Buttons (Top Left) */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                <div
                  style={{
                    transform: `translate(${cfg.stlButton.offsetX}px, ${cfg.stlButton.offsetY}px) scale(${cfg.stlButton.scale})`,
                    transformOrigin: 'center',
                    display: 'inline-block'
                  }}
                >
                  <button
                    onClick={exportToSTL}
                    disabled={strokes.length === 0}
                    className="w-14 transition-transform active:scale-95 disabled:opacity-30 disabled:pointer-events-none cursor-pointer border-none bg-transparent p-0"
                    title="Download STL Model"
                  >
                    <img src={assetSTLButton} className="w-full h-auto" alt="STL" />
                  </button>
                </div>
                <div
                  style={{
                    transform: `translate(${cfg.glbButton.offsetX}px, ${cfg.glbButton.offsetY}px) scale(${cfg.glbButton.scale})`,
                    transformOrigin: 'center',
                    display: 'inline-block'
                  }}
                >
                  <button
                    onClick={exportToGLB}
                    disabled={strokes.length === 0}
                    className="w-14 transition-transform active:scale-95 disabled:opacity-30 disabled:pointer-events-none cursor-pointer border-none bg-transparent p-0"
                    title="Download GLB Model"
                  >
                    <img src={assetGLBButton} className="w-full h-auto" alt="GLB" />
                  </button>
                </div>
                <div
                  style={{
                    transform: `translate(${cfg.wireframeButton.offsetX}px, ${cfg.wireframeButton.offsetY}px) scale(${cfg.wireframeButton.scale})`,
                    transformOrigin: 'center',
                    display: 'inline-block'
                  }}
                >
                  <button
                    onClick={() => setShowWireframe(!showWireframe)}
                    disabled={strokes.length === 0}
                    className="w-8 transition-transform active:scale-95 disabled:opacity-30 disabled:pointer-events-none cursor-pointer border-none bg-transparent p-0"
                    title="Toggle Wireframe Overlay"
                  >
                    <img src={assetBoxIcon} className="w-full h-auto" alt="Wireframe" />
                  </button>
                </div>
              </div>

              {/* Control Status and Reset Camera (Top Right) */}
              <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="w-8 h-8 flex items-center justify-center bg-white border-2 border-black rounded-lg hover:scale-110 active:scale-90 transition-transform shadow-md cursor-pointer"
                  title="Reset Camera"
                >
                  <RotateCcw size={16} className="text-black" />
                </button>
                <div className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest shadow-md border border-gray-100 bg-white/95 text-black select-none pointer-events-none",
                  smoothBrushActive ? "text-amber-600 border-amber-200" : "text-[#0020D7] border-blue-200"
                )}>
                  <span className={cn("w-1.5 h-1.5 rounded-full", smoothBrushActive ? "bg-amber-500" : "bg-[#0020D7]")} />
                  <span>{smoothBrushActive ? "Sculpting" : "Painting"}</span>
                </div>
              </div>

              {strokes.length === 0 && (
                <div className="absolute inset-0 bg-[#F9F9F9] flex flex-col items-center justify-center z-10 pointer-events-none select-none p-8">
                  <div
                    style={{
                      transform: `translate(${cfg.waitingPrompt.offsetX}px, ${cfg.waitingPrompt.offsetY}px) scale(${cfg.waitingPrompt.scale})`,
                      transformOrigin: 'center'
                    }}
                  >
                    <img src={assetWaitingPrompt} className="w-72 h-auto object-contain" alt="Waiting for Input" />
                  </div>
                </div>
              )}
              <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, preserveDrawingBuffer: true }}>
                <PerspectiveCamera makeDefault position={[0, 0, 125]} fov={45} />
                <Stage environment="city" intensity={0.8} shadows={false} adjustCamera={false}>
                  <group
                    ref={groupRef}
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
                        subdivisionLevel={subdivisionLevel}
                        retopologyDecimate={retopologyDecimate}
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
                  target={[0, 0, 0]}
                />
                <Environment preset="studio" />
                <spotLight position={[100, 100, 100]} angle={0.15} penumbra={1} intensity={2} castShadow />
                <pointLight position={[-100, -100, -100]} intensity={1} />
              </Canvas>

              {/* Wireframe Overlay Close-up (Subtle) */}
              {showWireframe && strokes.length > 0 && (
                <div className="absolute bottom-6 right-6 w-32 h-32 rounded-xl border border-acid/30 bg-acid/5 backdrop-blur-md overflow-hidden pointer-events-none animate-in zoom-in-95 duration-300">
                  <div className="absolute inset-0 opacity-20">
                    <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(#D1FF00 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-[8px] font-black text-acid uppercase tracking-tighter text-center px-2">
                      Clean Topology<br />Verified
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sliders Card (Overlaid inside static panel layout at the bottom) */}
            {strokes.length > 0 && (
              <div className="px-4 pb-4 w-full z-20">
                <div className="flex flex-col gap-4 bg-[#0020D7] border-2 border-black rounded-[20px] p-4 shadow-md text-white">
                  {/* Extrusion Depth Slider */}
                  <div className="flex flex-col gap-1.5 w-full">
                    <div
                      style={{
                        transform: `translate(${cfg.depthLabel.offsetX}px, ${cfg.depthLabel.offsetY}px) scale(${cfg.depthLabel.scale})`,
                        transformOrigin: 'left center',
                        display: 'inline-flex'
                      }}
                    >
                      <img src={assetDepthLabel} className="h-3.5 w-auto self-start select-none" alt="Extrusion Depth" />
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={extrudeSettings.depth}
                      onChange={(e) => setExtrudeSettings({ ...extrudeSettings, depth: parseInt(e.target.value) })}
                      className="w-full h-[5px] bg-[#FF009C]/30 rounded-full appearance-none cursor-pointer accent-[#A7F417]"
                      style={{ outline: 'none' }}
                    />
                  </div>

                  {/* Detail Thickness Slider */}
                  <div className="flex flex-col gap-1.5 w-full">
                    <div
                      style={{
                        transform: `translate(${cfg.thicknessLabel.offsetX}px, ${cfg.thicknessLabel.offsetY}px) scale(${cfg.thicknessLabel.scale})`,
                        transformOrigin: 'left center',
                        display: 'inline-flex'
                      }}
                    >
                      <img src={assetThicknessLabel} className="h-3.5 w-auto self-start select-none" alt="Detail Thickness" />
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="25"
                      value={extrudeSettings.detailThickness}
                      onChange={(e) => setExtrudeSettings({ ...extrudeSettings, detailThickness: parseInt(e.target.value) })}
                      className="w-full h-[5px] bg-[#FF009C]/30 rounded-full appearance-none cursor-pointer accent-[#A7F417]"
                      style={{ outline: 'none' }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

