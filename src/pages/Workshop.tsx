import React, { useState } from "react";
import { Download, Box, Settings } from "lucide-react";
import { DrawingCanvas } from "../feature_2d3d/components/DrawingCanvas";
import { Viewer3D } from "../feature_2d3d/components/Viewer3D";
import { ModifierToolbar } from "../feature_2d3d/components/ModifierToolbar";
import { MaterialSelector } from "../feature_2d3d/components/MaterialSelector";
import { RECYCLED_MATERIALS } from "../feature_2d3d/constants/materials";
import { ExtrudeSettings, GeometryStyle, MaterialConfig, StrokeData } from "../feature_2d3d/types";
import PageContainer from "../components/PageContainer";
import { BRAND } from "@/src/lib/brand-colors";

export type Material = {
  id: string;
  name: string;
  color: string;
  roughness: number;
  metalness: number;
};

export const MATERIALS: Material[] = [
  { id: "hdpe_blue", name: "HDPE_BLUE", color: BRAND.blue, roughness: 0.7, metalness: 0.2 },
  { id: "petg_pink", name: "PETG_PINK", color: BRAND.pink, roughness: 0.6, metalness: 0.3 },
  { id: "pp_white", name: "PP_WHITE", color: BRAND.white, roughness: 0.8, metalness: 0.1 },
];

/**
 * ============================================================================
 * CẤU HÌNH VỊ TRÍ VÀ KÍCH THƯỚC CHI TIẾT CHO TỪNG ASSET TRONG TRANG WORKSHOP
 * (INDIVIDUAL CONFIGURATION FOR EACH ASSET POSITION & SCALE)
 * 
 * - `offsetX`: Dịch ngang (số dương sang phải (+), số âm sang trái (-) | đơn vị: px)
 * - `offsetY`: Dịch dọc (số dương dịch xuống (+), số âm dịch lên (-) | đơn vị: px)
 * - `scale`: Phóng to / thu nhỏ (ví dụ: 1.0 = 100%, 1.2 = 120%, 0.8 = 80%)
 * ============================================================================
 */
export const WORKSHOP_ASSETS_CONFIG = {
  // --- 2D DRAWING CANVAS ASSETS (KHUNG VẼ 2D) ---
  canvas: {
    // Tiêu đề Bước 1 (Choose Base Shape - Asset 28.svg)
    chooseBaseHeader: { offsetX: -560, offsetY: 0, scale: 2.5 },

    // Tiêu đề Bước 2 (Draw Details - Asset 29.svg)
    drawDetailsHeader: { offsetX: 1060, offsetY: 240, scale: 3.5 },

    // Nút Chế độ Chọn (Select Mode - Asset 36.svg)
    selectModeButton: { offsetX: -130, offsetY: 300, scale: 2.0 },

    // Nút Tô màu (Paint Bucket - Asset 37.svg)
    paintBucketButton: { offsetX: -130, offsetY: 350, scale: 2.0 },

    // Chữ nhãn "Size" (Asset 38.svg)
    sizeLabel: { offsetX: -215, offsetY: 400, scale: 2.3 },

    // Dải màu chọn vẽ
    colorsPalette: { offsetX: -210, offsetY: 400, scale: 1.9 },

    // Nút Thùng rác (Trash Icon - Asset 40.svg)
    trashIcon: { offsetX: -200, offsetY: 430, scale: 2.0 },

    // Nút Hoàn tác (Undo Icon - Asset 41.svg)
    undoIcon: { offsetX: -50, offsetY: 430, scale: 2.0 },

    // Nút Làm lại (Redo Icon - Asset 42.svg)
    redoIcon: { offsetX: -13, offsetY: 430, scale: 2.0 },

    // Linh vật Mascot Yang màu xanh lá góc trái dưới (Asset 43.svg)
    mascot: { offsetX: -120, offsetY: 530, scale: 3.0 },

    // Gợi ý chọn hình khi chưa bắt đầu vẽ (Asset 44.svg)
    selectBasePrompt: { offsetX: 0, offsetY: 0, scale: 1.0 },

    // Nút GENERATE 3D màu hồng tràn góc (Asset 47.svg)
    generate3DButton: { offsetX: 16, offsetY: 16, scale: 1.0 },

    // Khung viền vẽ 2D (Asset 46.svg)
    canvasFrame: { offsetX: 0, offsetY: 200, scale: 1.0 },

    // --- CÁC HÌNH NÚT CHỌN HÌNH ĐẾ DƯỚI BƯỚC 1 (BASE PRESETS - Asset 30.svg đến 35.svg) ---
    // Điều chỉnh chung cho toàn bộ các ô vuông chọn hình đế (tịnh tiến, tỷ lệ scale, khoảng cách giữa các ô và hình vẽ bên trong)
    basePresets: {
      offsetX: -85,
      offsetY: 150,
      cardScale: 3.0,
      imageWidth: 80,  // Chiều rộng hình vẽ bên trong ô vuông (đơn vị: px, mặc định 56px)
      imageHeight: 80, // Chiều cao hình vẽ bên trong ô vuông (đơn vị: px, mặc định 56px)
      gap: 280// Khoảng cách giữa các ô vuông (đơn vị: px) để tránh đè lên nhau khi scale to 
    },
  },

  // --- 3D VIEWPORT ASSETS (KHUNG HÌNH 3D) ---
  viewer3d: {
    // Nút xuất file STL (Asset 49.svg)
    stlButton: { offsetX: 0, offsetY: 0, scale: 1.0 },

    // Nút xuất file GLB (Asset 48.svg)
    glbButton: { offsetX: 0, offsetY: 0, scale: 1.0 },

    // Nút bật/tắt khung dây Wireframe (Asset 50.svg)
    wireframeButton: { offsetX: 0, offsetY: 0, scale: 1.0 },

    // Khung viền 3D (Asset 51.svg)
    viewerFrame: { offsetX: 0, offsetY: 300, scale: 1.0 },

    // Khung chữ nhắc chờ dữ liệu (Asset 52.svg)
    waitingPrompt: { offsetX: 0, offsetY: 0, scale: 1.0 },

    // Chữ nhãn độ sâu "Extrusion Depth" (Asset 55.svg)
    depthLabel: { offsetX: 0, offsetY: 0, scale: 1.0 },

    // Chữ nhãn độ dày nét vẽ "Detail Thickness" (Asset 54.svg)
    thicknessLabel: { offsetX: 0, offsetY: 0, scale: 1.0 }
  }
};

export default function Workshop() {
  const [strokes, setStrokes] = useState<StrokeData[]>([]);
  const [baseShapeId, setBaseShapeId] = useState<string | null>(null);
  const [baseMaterialId, setBaseMaterialId] = useState<string>(RECYCLED_MATERIALS[0].id);
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialConfig>(RECYCLED_MATERIALS[0]);
  const [geometryStyle, setGeometryStyle] = useState<GeometryStyle>('smooth');
  const [smoothActive, setSmoothActive] = useState(false);
  const [smoothRadius, setSmoothRadius] = useState(20);
  const [smoothStrength, setSmoothStrength] = useState(0.1);
  const [subdivisionLevel, setSubdivisionLevel] = useState(0);
  const [retopologyDecimate, setRetologyDecimate] = useState(0);

  const [extrudeSettings, setExtrudeSettings] = useState<ExtrudeSettings>({
    depth: 10,
    detailThickness: 4,
    bevelEnabled: true,
    bevelThickness: 2,
    bevelSize: 2,
    bevelOffset: 0,
    bevelSegments: 5,
    artistMark: { type: 'none' },
    scaleX: 1.0,
    scaleY: 1.0
  });

  const handleGenerate = (newStrokes: StrokeData[], newBaseShapeId: string | null) => {
    // Nếu có hình dạng cơ sở, đảm bảo nó sử dụng baseMaterialId
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
    <PageContainer
      size="full"
      className="pt-32 pb-16 min-h-screen bg-[#F5F5F5] relative z-10 font-sans"
    >
      {/* Grid Paper Background Pattern */}
      <div className="fixed inset-0 grid-paper pointer-events-none z-0"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
        {/* Main Header */}
        <div className="relative text-center select-none">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-brand-black uppercase tracking-tight leading-none">
            RECYCLE3D PRO // SKETCH_TO_PRINT
          </h1>
          <p className="font-mono text-xs text-brand-blue mt-2.5 tracking-widest uppercase">
            [ circular_fabrication_module_sys_v.2.0 ]
          </p>
        </div>

        {/* Vertical CAD Workspace Layout */}
        <div className="flex flex-col gap-10 w-full pb-8">
          {/* 2D Sketching & Base Shapes */}
          <div className="w-full">
            <DrawingCanvas
              onGenerate={handleGenerate}
              bucketMaterial={selectedMaterial}
              onUpdateBaseMaterial={setBaseMaterialId}
              assetsConfig={WORKSHOP_ASSETS_CONFIG.canvas}
            />
          </div>

          {/* 3D Visualizer Viewport */}
          <div className="w-full">
            <Viewer3D
              strokes={strokes}
              baseShapeId={baseShapeId}
              onUpdateStrokeMaterial={updateStrokeMaterial}
              activeMaterial={selectedMaterial}
              extrudeSettings={extrudeSettings}
              setExtrudeSettings={setExtrudeSettings}
              style={geometryStyle}
              smoothBrushActive={smoothActive}
              smoothRadius={smoothRadius}
              smoothStrength={smoothStrength}
              subdivisionLevel={subdivisionLevel}
              retopologyDecimate={retopologyDecimate}
              assetsConfig={WORKSHOP_ASSETS_CONFIG.viewer3d}
            />
          </div>

          {/* Properties and Customization Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {/* Material Inventory */}
            <div className="bg-white border-2 border-black rounded-[20px] p-5 shadow-sm flex flex-col h-fit">
              <div className="text-[10px] font-black text-[#0020D7] uppercase tracking-widest mb-3 font-mono">
                [ Material Inventory ]
              </div>
              <MaterialSelector
                selectedId={selectedMaterial.id}
                onSelect={setSelectedMaterial}
              />
            </div>

            {/* Advanced 3D Tuning modifiers */}
            <div className="w-full">
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
                subdivisionLevel={subdivisionLevel}
                setSubdivisionLevel={setSubdivisionLevel}
                retopologyDecimate={retopologyDecimate}
                setRetologyDecimate={setRetologyDecimate}
              />
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
