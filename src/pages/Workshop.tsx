import React, { useState } from "react";
import { Download, Box, Settings } from "lucide-react";
import { DrawingCanvas } from "../feature_2d3d/components/DrawingCanvas";
import { Viewer3D } from "../feature_2d3d/components/Viewer3D";
import { ModifierToolbar } from "../feature_2d3d/components/ModifierToolbar";
import { MaterialSelector } from "../feature_2d3d/components/MaterialSelector";
import { RECYCLED_MATERIALS } from "../feature_2d3d/constants/materials";
import { ExtrudeSettings, GeometryStyle, MaterialConfig, StrokeData } from "../feature_2d3d/types";

export type Material = {
  id: string;
  name: string;
  color: string;
  roughness: number;
  metalness: number;
};

export const MATERIALS: Material[] = [
  { id: "hdpe_cyan", name: "HDPE_CYAN", color: "#00FFFF", roughness: 0.7, metalness: 0.2 },
  { id: "petg_red", name: "PETG_RED", color: "#FF4500", roughness: 0.6, metalness: 0.3 },
  { id: "pp_acid_green", name: "PP_ACID_GREEN", color: "#D1FF00", roughness: 0.8, metalness: 0.1 },
];

export default function Workshop() {
  const [strokes, setStrokes] = useState<StrokeData[]>([]);
  const [baseShapeId, setBaseShapeId] = useState<string | null>(null);
  const [baseMaterialId, setBaseMaterialId] = useState<string>(RECYCLED_MATERIALS[0].id);
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialConfig>(RECYCLED_MATERIALS[0]);
  const [geometryStyle, setGeometryStyle] = useState<GeometryStyle>('smooth');
  const [smoothActive, setSmoothActive] = useState(false);
  const [smoothRadius, setSmoothRadius] = useState(20);
  const [smoothStrength, setSmoothStrength] = useState(0.1);
  
  const [extrudeSettings, setExtrudeSettings] = useState<ExtrudeSettings>({
    depth: 10,
    detailThickness: 4,
    bevelEnabled: true,
    bevelThickness: 2,
    bevelSize: 2,
    bevelOffset: 0,
    bevelSegments: 5,
    artistMark: { type: 'none' },
  });

  const handleGenerate = (newStrokes: StrokeData[], newBaseShapeId: string | null) => {
    // If we have a base shape, ensure it uses the baseMaterialId
    const processedStrokes = newStrokes.map(s => 
      s.layer === 'base' ? { ...s, materialId: baseMaterialId } : s
    );
    setStrokes(processedStrokes);
    setBaseShapeId(newBaseShapeId);
  };

  const updateStrokeMaterial = (id: string, color: string, materialId: string) => {
    if (id === 'base-shape') {
      setBaseMaterialId(materialId);
    }
    setStrokes(prev => prev.map(s => s.id === id ? { ...s, color, materialId } : s));
  };

  return (
    <div className="pt-32 pb-12 px-6 md:px-12 min-h-screen bg-[#F5F5F5] font-mono bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] bg-repeat">
      <div className="max-w-[1920px] mx-auto">
        {/* Header with Glitch Title */}
        <div className="relative mb-16 text-center">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <h1 className="font-display text-4xl md:text-6xl text-[#D1FF00] translate-x-[-2px] translate-y-[-2px] opacity-50 uppercase">
              RECYCLE3D PRO // SKETCH_TO_PRINT
            </h1>
            <h1 className="font-display text-4xl md:text-6xl text-[#FF4500] translate-x-[2px] translate-y-[2px] opacity-50 uppercase">
              RECYCLE3D PRO // SKETCH_TO_PRINT
            </h1>
          </div>
          <h1 className="relative font-display text-4xl md:text-6xl text-black uppercase z-10">
            RECYCLE3D PRO // SKETCH_TO_PRINT
          </h1>
          <p className="mt-4 text-[10px] text-gray-500 tracking-widest uppercase">
            [ SYSTEM_READY ] // [ LATENCY: 12MS ] // [ BUFFER: OPTIMAL ]
          </p>
        </div>

        {/* Main Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:min-h-[1100px]">
          {/* LEFT: 2D SKETCHING */}
          <div className="flex flex-col brutalist-border bg-white shadow-2xl h-full">
            <div className="bg-black text-white p-4 flex justify-between items-center border-b-2 border-black">
              <span className="text-[10px] tracking-tighter text-acid">[ INPUT_MODULE_01 ]</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-[8px] uppercase">Active_Canvas</span>
              </div>
            </div>
            
            <div className="flex-1 relative bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] bg-repeat p-4 flex flex-col">
              <div className="flex-1 brutalist-border bg-black relative min-h-[750px]">
                <DrawingCanvas 
                  onGenerate={handleGenerate} 
                  bucketMaterial={selectedMaterial}
                  onUpdateBaseMaterial={setBaseMaterialId}
                />
              </div>
            </div>

            <div className="bg-gray-100 p-4 border-t-2 border-black mt-auto">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">
                [ MATERIAL_INVENTORY ]
              </div>
              <MaterialSelector 
                selectedId={selectedMaterial.id} 
                onSelect={setSelectedMaterial} 
              />
            </div>
          </div>

          {/* RIGHT: 3D VIEWER */}
          <div className="flex flex-col brutalist-border bg-black shadow-2xl h-full">
            <div className="bg-acid text-black p-4 flex justify-between items-center border-b-2 border-black">
              <span className="text-[10px] tracking-tighter">[ OUTPUT_MODULE_02 ]</span>
              <div className="bg-black text-white text-[10px] font-bold px-3 py-1 brutalist-border">
                {strokes.length} MESHES
              </div>
            </div>

            <div className="flex-1 relative bg-[#111] p-0 border-b-2 border-acid/30 min-h-[800px]">
              <Viewer3D 
                strokes={strokes} 
                baseShapeId={baseShapeId}
                onUpdateStrokeMaterial={updateStrokeMaterial}
                activeMaterial={selectedMaterial} 
                extrudeSettings={extrudeSettings}
                style={geometryStyle}
                smoothBrushActive={smoothActive}
                smoothRadius={smoothRadius}
                smoothStrength={smoothStrength}
              />
            </div>

            <div className="bg-black p-6 mt-auto">
               <div className="text-[10px] font-bold text-acid uppercase tracking-widest mb-4">
                [ REFINE_&_SCULPT ]
              </div>
              <ModifierToolbar 
                settings={extrudeSettings} 
                setSettings={setExtrudeSettings}
                style={geometryStyle}
                setStyle={setGeometryStyle}
                smoothActive={smoothActive}
                setSmoothActive={setSmoothActive}
                smoothRadius={smoothRadius}
                setSmoothRadius={setSmoothRadius}
                smoothStrength={smoothStrength}
                setSmoothStrength={setSmoothStrength}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
