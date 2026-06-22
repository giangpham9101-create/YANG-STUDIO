import React, { useState } from 'react';
import { ExtrudeSettings, GeometryStyle } from '../types';
import { Sliders, Box, Layers, Sparkles, MousePointer2, Info, Zap, Grid, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../lib/utils';

// Import Visual Assets
import assetSliderBg from '../../assets/info workshop/SVG/Asset 53.svg';
import assetThicknessLabel from '../../assets/info workshop/SVG/Asset 54.svg';
import assetDepthLabel from '../../assets/info workshop/SVG/Asset 55.svg';

interface ModifierToolbarProps {
  settings: ExtrudeSettings;
  setSettings: (settings: ExtrudeSettings) => void;
  style: GeometryStyle;
  setStyle: (style: GeometryStyle) => void;
  smoothActive: boolean;
  setSmoothActive: (active: boolean) => void;
  smoothRadius: number;
  setSmoothRadius: (radius: number) => void;
  smoothStrength: number;
  setSmoothStrength: (strength: number) => void;
  subdivisionLevel: number;
  setSubdivisionLevel: (level: number) => void;
  retopologyDecimate: number;
  setRetologyDecimate: (decimate: number) => void;
}

export const ModifierToolbar: React.FC<ModifierToolbarProps> = ({
  settings,
  setSettings,
  style,
  setStyle,
  smoothActive,
  setSmoothActive,
  smoothRadius,
  setSmoothRadius,
  smoothStrength,
  setSmoothStrength,
  subdivisionLevel,
  setSubdivisionLevel,
  retopologyDecimate,
  setRetologyDecimate
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="flex flex-col gap-5 w-full">

      {/* ADVANCED COLLAPSIBLE SETTINGS ACCORDION */}
      <div className="bg-white border-2 border-black rounded-[20px] overflow-hidden shadow-sm">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-between w-full p-3.5 font-mono font-black text-xs uppercase tracking-widest text-black bg-gray-50 border-b border-black hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Settings size={16} className={cn("text-[#0020D7]", showAdvanced && "animate-spin-slow")} />
            <span>Advanced 3D Tuning</span>
          </div>
          {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {showAdvanced && (
          <div className="p-5 flex flex-col gap-6 bg-white animate-in fade-in slide-in-from-top-2 duration-300">
            {/* ADVANCED SCULPTING BRUSH */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-500 font-black uppercase text-[9px] tracking-widest">
                  <Sparkles size={12} className="text-[#FF009C]" />
                  <span>3D Sculpting Brush</span>
                </div>
                <button
                  onClick={() => setSmoothActive(!smoothActive)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border cursor-pointer",
                    smoothActive 
                      ? "bg-[#FF009C] border-[#FF009C]/40 text-white shadow-md shadow-[#FF009C]/20" 
                      : "bg-gray-50 border-gray-200 text-gray-400 hover:text-black hover:bg-gray-100"
                  )}
                >
                  {smoothActive ? <Sparkles size={10} fill="currentColor" /> : <MousePointer2 size={10} />}
                  {smoothActive ? "Sculpt Active" : "Enable Sculpt"}
                </button>
              </div>

              {smoothActive && (
                <div className="flex flex-col gap-4 p-3.5 bg-[#FF009C]/5 rounded-xl border border-[#FF009C]/10">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-[9px] font-black text-[#FF009C] uppercase tracking-widest">
                      <span>Brush Radius</span>
                      <span className="bg-[#FF009C]/10 px-1.5 py-0.5 rounded">{smoothRadius}px</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      value={smoothRadius}
                      onChange={(e) => setSmoothRadius(parseInt(e.target.value))}
                      className="w-full h-1 bg-[#FF009C]/20 rounded-lg appearance-none cursor-pointer accent-[#FF009C]"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-[9px] font-black text-[#FF009C] uppercase tracking-widest">
                      <span>Smooth Intensity</span>
                      <span className="bg-[#FF009C]/10 px-1.5 py-0.5 rounded">{(smoothStrength * 100).toFixed(0)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.01"
                      max="0.5"
                      step="0.01"
                      value={smoothStrength}
                      onChange={(e) => setSmoothStrength(parseFloat(e.target.value))}
                      className="w-full h-1 bg-[#FF009C]/20 rounded-lg appearance-none cursor-pointer accent-[#FF009C]"
                    />
                  </div>
                  <div className="flex items-start gap-2 p-2 bg-[#FF009C]/5 rounded-lg border border-[#FF009C]/10">
                    <Info size={11} className="text-[#FF009C] mt-0.5 flex-shrink-0" />
                    <p className="text-[8px] text-gray-500 font-bold uppercase tracking-wide leading-relaxed">
                      Drag cursor over 3D model to smooth hand-drawn details.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="h-px bg-gray-100" />

            {/* SURFACE STYLE */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-gray-500 font-black uppercase text-[9px] tracking-widest">
                <Box size={12} className="text-gray-400" />
                <span>Surface Geometry Style</span>
              </div>
              <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
                <button
                  onClick={() => setStyle('smooth')}
                  className={cn(
                    "flex-1 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all cursor-pointer",
                    style === 'smooth' 
                      ? "bg-[#0020D7] text-white shadow-md" 
                      : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  Smooth
                </button>
                <button
                  onClick={() => setStyle('lowpoly')}
                  className={cn(
                    "flex-1 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all cursor-pointer",
                    style === 'lowpoly' 
                      ? "bg-[#0020D7] text-white shadow-md" 
                      : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  Low Poly
                </button>
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* BEVEL / FILLET */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-gray-500 font-black uppercase text-[9px] tracking-widest">
                <Sliders size={12} className="text-gray-400" />
                <span>Bevel & Fillet</span>
              </div>
              <div className="flex items-center justify-between bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Enable Chamfer Bevel</span>
                <button
                  onClick={() => setSettings({ ...settings, bevelEnabled: !settings.bevelEnabled })}
                  className={cn(
                    "relative inline-flex h-5 w-10 items-center rounded-full transition-all cursor-pointer",
                    settings.bevelEnabled ? 'bg-[#A7F417] border border-black/10' : 'bg-gray-200'
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-3 w-3 transform rounded-full bg-white transition-transform border border-black/10",
                      settings.bevelEnabled ? 'translate-x-6' : 'translate-x-1'
                    )}
                  />
                </button>
              </div>
              {settings.bevelEnabled && (
                <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Bevel Size</label>
                    <input
                      type="number"
                      value={settings.bevelSize}
                      onChange={(e) => setSettings({ ...settings, bevelSize: parseFloat(e.target.value) || 0 })}
                      className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-[10px] font-black text-black focus:outline-none focus:border-[#0020D7] transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Bevel Thickness</label>
                    <input
                      type="number"
                      value={settings.bevelThickness}
                      onChange={(e) => setSettings({ ...settings, bevelThickness: parseFloat(e.target.value) || 0 })}
                      className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-[10px] font-black text-black focus:outline-none focus:border-[#0020D7] transition-all"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="h-px bg-gray-100" />

            {/* TOPOLOGY & REFINEMENT */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-gray-500 font-black uppercase text-[9px] tracking-widest">
                <Grid size={12} className="text-[#0020D7]" />
                <span>Topology Refinement</span>
              </div>

              {/* Subdivision Surface */}
              <div className="flex flex-col gap-2.5 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black text-gray-500 uppercase tracking-wider">
                    Subdivision Surface
                  </span>
                  <span className="text-[9px] font-black text-[#0020D7] bg-[#0020D7]/10 px-1.5 py-0.5 rounded">Lvl {subdivisionLevel}</span>
                </div>
                <div className="flex bg-white p-0.5 rounded-lg border border-gray-200">
                  {[0, 1, 2].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setSubdivisionLevel(lvl)}
                      className={cn(
                        "flex-1 py-1 text-[8px] font-black uppercase tracking-wider rounded transition-all cursor-pointer",
                        subdivisionLevel === lvl
                          ? "bg-[#0020D7] text-white shadow-sm"
                          : "text-gray-400 hover:text-gray-600"
                      )}
                    >
                      {lvl === 0 ? "Off" : `Level ${lvl}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mesh Retopology Decimate */}
              <div className="flex flex-col gap-2.5 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex justify-between text-[9px] font-black text-gray-500 uppercase tracking-widest">
                  <span>Mesh Retopology</span>
                  <span className={cn(
                    "px-1.5 py-0.5 rounded font-black text-[9px]",
                    retopologyDecimate > 0 ? "bg-[#0020D7]/10 text-[#0020D7]" : "bg-gray-200 text-gray-400"
                  )}>
                    {retopologyDecimate > 0 ? `-${retopologyDecimate}% Grid` : "Original Grid"}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="80"
                  step="10"
                  value={retopologyDecimate}
                  onChange={(e) => setRetologyDecimate(parseInt(e.target.value))}
                  className="w-full h-[5px] bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0020D7]"
                  style={{ outline: 'none' }}
                />
                <div className="flex justify-between text-[7px] text-gray-400 font-bold uppercase tracking-wider font-mono">
                  <span>High Poly</span>
                  <span>Optimized (Low-size)</span>
                </div>
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* ENGRAVED AUTHENTICITY MARK */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-gray-500 font-black uppercase text-[9px] tracking-widest">
                <Zap size={12} className="text-[#FF009C]" />
                <span>Authenticity Mark (Engraved)</span>
              </div>
              
              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                  {(['none', 'text'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setSettings({ 
                        ...settings, 
                        artistMark: { ...settings.artistMark, type, text: settings.artistMark?.text || 'RECYCLE_3D' } 
                      })}
                      className={cn(
                        "flex-1 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border cursor-pointer",
                        (settings.artistMark?.type || 'none') === type
                          ? "bg-[#0020D7] border-[#0020D7] text-white shadow-sm"
                          : "bg-gray-50 border-gray-200 text-gray-400 hover:text-black"
                      )}
                    >
                      {type === 'none' ? "Disable Mark" : "Enable Mark"}
                    </button>
                  ))}
                </div>

                {(settings.artistMark?.type || 'none') === 'text' && (
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      placeholder="ENTER ENGRAVING TEXT..."
                      value={settings.artistMark?.text || ''}
                      onChange={(e) => setSettings({ 
                        ...settings, 
                        artistMark: { ...settings.artistMark, type: 'text', text: e.target.value.toUpperCase() } 
                      })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-black font-black text-xs tracking-wider focus:border-[#0020D7] outline-none transition-all font-mono"
                    />
                    <span className="text-[7px] text-gray-400 font-black uppercase tracking-widest font-mono">
                      * Text is automatically engraved in reverse on the base underside.
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
