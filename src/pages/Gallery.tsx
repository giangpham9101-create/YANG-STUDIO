import React, { useState } from "react";
import { Plus, Filter, Settings } from "lucide-react";
import AsciiWaveText from "../components/AsciiWaveText";
import GalleryCarousel from "../components/GalleryCarousel";

export default function Gallery() {
  const [density, setDensity] = useState(50);

  return (
    <div className="pt-32 pb-12 min-h-screen bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-8">
          <div className="w-full md:w-2/3">
            <div className="flex items-center gap-2 font-mono text-xs mb-4">
              <Plus size={14} className="text-acid" />
              <span>PORTFOLIO_V.4.0</span>
            </div>

            {/* ASCII WaveText FX */}
            <div className="relative h-[300px] md:h-[400px] -mt-12 -ml-12 overflow-hidden">
              <AsciiWaveText density={density} />
            </div>
          </div>

          <div className="flex flex-col gap-6 w-full md:w-1/3">
            {/* Density Slider */}
            <div className="brutalist-border bg-black p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[10px] text-acid uppercase tracking-widest flex items-center gap-2">
                  <Settings size={12} /> [SYSTEM_ASCII_DENSITY]
                </span>
                <span className="font-mono text-xs text-white">{density}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={density}
                onChange={(e) => setDensity(Number(e.target.value))}
                className="w-full h-1 bg-white/20 appearance-none cursor-pointer accent-acid"
              />
              <div className="flex justify-between font-mono text-[8px] text-gray-500">
                <span>MIN_RES</span>
                <span>MAX_RES</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button className="brutalist-border bg-white p-4 flex items-center gap-2 font-mono text-xs w-full justify-center">
                <Filter size={12} /> FILTER_BY_MATERIAL
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Carousel Section - Full Width */}
      <div className="relative mb-24 w-full overflow-hidden">
        <GalleryCarousel />
      </div>
    </div>
  );
}
