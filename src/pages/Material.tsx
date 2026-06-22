import React, { useState } from "react";
import { Plus } from "lucide-react";
import AsciiWaveText from "../components/AsciiWaveText";
import GalleryCarousel from "../components/GalleryCarousel";
import PageContainer from "../components/PageContainer";
import Product3DViewer from "../components/Product3DViewer";
import chai1Model from "../assets/PLASTIC 3D/chai1.glb?url";

export default function Material() {
  const [density, setDensity] = useState(50);
  const [autoRotate, setAutoRotate] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(60); // Tốc độ xoay tự động (deg/s)

  return (
    <div className="pt-32 pb-12 min-h-screen bg-[#F5F5F5]">
      <PageContainer size="wide" className="bg-transparent p-0">
        <div className="flex flex-col gap-8 mb-16">
          {/* Header */}
          <div className="w-full">
            <div className="flex items-center gap-2 font-mono text-xs mb-4">
              <Plus size={14} className="text-acid" />
              <span>PORTFOLIO_V.4.0 // 3D_MATERIAL_INVENTORY</span>
            </div>

            <div className="relative h-[300px] md:h-[400px] -mt-12 -ml-12 overflow-hidden">
              <AsciiWaveText density={density} />
            </div>
          </div>

          {/* 3D Model Visualizer Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 sm:px-6 lg:px-8">
            {/* 3D Viewer Card */}
            <div className="lg:col-span-2 bg-white border-2 border-black rounded-[30px] p-6 shadow-[8px_8px_0px_rgba(0,0,0,1)] relative overflow-hidden flex flex-col justify-between h-[600px]">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#A7F417] animate-pulse"></span>
                  <span className="font-mono text-xs font-black uppercase tracking-wider text-gray-500">[ 3D_PRODUCT_VISUALIZER ]</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black uppercase text-gray-400 font-mono">Speed:</span>
                    <input 
                      type="range"
                      min="10"
                      max="180"
                      step="5"
                      value={rotationSpeed}
                      onChange={(e) => setRotationSpeed(parseInt(e.target.value))}
                      className="w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0020D7] outline-none"
                    />
                    <span className="text-[9px] font-black text-black font-mono w-8 text-right">{rotationSpeed}°/s</span>
                  </div>
                  <button 
                    onClick={() => setAutoRotate(!autoRotate)}
                    className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg border-2 border-black transition-all cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:shadow-[1px_1px_0px_rgba(0,0,0,1)] ${autoRotate ? 'bg-[#A7F417]' : 'bg-white'}`}
                  >
                    {autoRotate ? "Pause Spin" : "Auto Rotate"}
                  </button>
                </div>
              </div>
              
              <div className="flex-1 relative rounded-[20px] overflow-hidden border-2 border-black bg-gradient-to-br from-gray-900 via-gray-800 to-black h-full">
                <Product3DViewer 
                  modelPath={chai1Model} 
                  autoRotate={autoRotate}
                  autoRotateSpeed={`${rotationSpeed}deg`}
                  className="h-full w-full"
                />
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-white border-2 border-black rounded-[30px] p-6 shadow-[8px_8px_0px_rgba(0,0,0,1)] flex flex-col justify-between h-[600px]">
              <div>
                <div className="text-[10px] font-mono font-black text-[#0020D7] uppercase tracking-widest mb-4">
                  [ SPECIFICATIONS_&_DATA ]
                </div>
                <h2 className="font-display text-4xl text-black uppercase tracking-tight mb-4 leading-none">
                  RECYCLED_BOTTLE
                </h2>
                <p className="text-xs text-gray-500 leading-relaxed font-sans mb-6 uppercase">
                  This interactive 3D model represents a recycled plastic bottle archetype (`chai1.glb`), processed through our circular fabrication modules. Optimized for high-definition 3D rendering.
                </p>

                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center p-3.5 bg-gray-50 border-2 border-black rounded-2xl">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Base Material</span>
                    <span className="text-[9px] font-black text-black uppercase font-mono bg-[#A7F417] px-2.5 py-0.5 rounded-full border border-black">rPET / rHDPE</span>
                  </div>
                  <div className="flex justify-between items-center p-3.5 bg-gray-50 border-2 border-black rounded-2xl">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Density Code</span>
                    <span className="text-[10px] font-black text-black font-mono">0.95 g/cm³</span>
                  </div>
                  <div className="flex justify-between items-center p-3.5 bg-gray-50 border-2 border-black rounded-2xl">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Melting Temp</span>
                    <span className="text-[10px] font-black text-black font-mono">220°C - 250°C</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t-2 border-gray-100 flex flex-col gap-3">
                <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest font-mono">
                  * Drag mouse/touch to orbit, scroll/pinch to zoom in 3D viewport.
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>

      <div className="relative mb-24 w-full overflow-hidden">
        <GalleryCarousel />
      </div>
    </div>
  );
}
