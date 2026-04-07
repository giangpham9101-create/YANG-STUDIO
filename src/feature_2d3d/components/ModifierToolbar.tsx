import React from 'react';
import { ExtrudeSettings, GeometryStyle } from '../types';
import { Sliders, Box, Layers, Sparkles, MousePointer2, Info, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

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
  setSmoothStrength
}) => {
  return (
    <div className="bg-[#1a1a1a] p-5 rounded-2xl shadow-inner border border-white/5 flex flex-col gap-8">
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-500 font-black uppercase text-[10px] tracking-[0.2em]">
            <Sparkles size={14} className="text-blue-500" />
            <span>Advanced Sculpting</span>
          </div>
          <button
            onClick={() => setSmoothActive(!smoothActive)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border",
              smoothActive 
                ? "bg-blue-600 border-blue-400 text-white shadow-xl shadow-blue-900/20" 
                : "bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10"
            )}
          >
            {smoothActive ? <Sparkles size={12} fill="currentColor" /> : <MousePointer2 size={12} />}
            {smoothActive ? "Sculpt Active" : "Enable Sculpt"}
          </button>
        </div>

        {smoothActive && (
          <div className="flex flex-col gap-5 p-4 bg-blue-500/5 rounded-xl border border-blue-500/10 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between text-[9px] font-black text-blue-400 uppercase tracking-widest">
                <span>Brush Radius</span>
                <span className="bg-blue-500/10 px-2 py-0.5 rounded">{smoothRadius}px</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                value={smoothRadius}
                onChange={(e) => setSmoothRadius(parseInt(e.target.value))}
                className="w-full h-1 bg-blue-500/20 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between text-[9px] font-black text-blue-400 uppercase tracking-widest">
                <span>Smooth Intensity</span>
                <span className="bg-blue-500/10 px-2 py-0.5 rounded">{(smoothStrength * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.01"
                max="0.5"
                step="0.01"
                value={smoothStrength}
                onChange={(e) => setSmoothStrength(parseFloat(e.target.value))}
                className="w-full h-1 bg-blue-500/20 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
            <div className="flex items-start gap-2 p-2 bg-blue-500/5 rounded-lg border border-blue-500/10">
              <Info size={12} className="text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-[9px] text-blue-300/70 font-medium leading-relaxed">
                Refine surfaces by dragging over the 3D mesh. Perfect for smoothing hand-drawn jagged edges.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="h-px bg-white/5" />

      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-2 text-gray-500 font-black uppercase text-[10px] tracking-[0.2em]">
          <Layers size={14} className="text-gray-400" />
          <span>Extrusion Depth</span>
        </div>
        <div className="flex flex-col gap-3">
          <input
            type="range"
            min="1"
            max="50"
            value={settings.depth}
            onChange={(e) => setSettings({ ...settings, depth: parseInt(e.target.value) })}
            className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-[9px] text-gray-600 font-black uppercase tracking-widest">
            <span>1mm</span>
            <span className="text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">{settings.depth}mm</span>
            <span>50mm</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5 p-4 bg-acid/5 rounded-xl border border-acid/10">
        <div className="flex items-center gap-2 text-gray-500 font-black uppercase text-[10px] tracking-[0.2em]">
          <Box size={14} className="text-acid/70" />
          <span className="text-acid/90">Detail Thickness</span>
        </div>
        <div className="flex flex-col gap-3">
          <input
            type="range"
            min="1"
            max="25"
            value={settings.detailThickness}
            onChange={(e) => setSettings({ ...settings, detailThickness: parseInt(e.target.value) })}
            className="w-full h-1 bg-acid/10 rounded-lg appearance-none cursor-pointer accent-acid"
          />
          <div className="flex justify-between text-[9px] text-gray-600 font-black uppercase tracking-widest">
            <span>1mm</span>
            <span className="text-acid bg-acid/10 px-2 py-0.5 rounded">{settings.detailThickness}mm</span>
            <span>25mm</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-2 text-gray-500 font-black uppercase text-[10px] tracking-[0.2em]">
          <Sliders size={14} className="text-gray-400" />
          <span>Bevel / Fillet</span>
        </div>
        <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
          <span className="text-xs font-bold text-gray-300">Enable Bevel</span>
          <button
            onClick={() => setSettings({ ...settings, bevelEnabled: !settings.bevelEnabled })}
            className={`relative inline-flex h-5 w-10 items-center rounded-full transition-all ${
              settings.bevelEnabled ? 'bg-blue-600 shadow-lg shadow-blue-900/20' : 'bg-gray-800'
            }`}
          >
            <span
              className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                settings.bevelEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        {settings.bevelEnabled && (
          <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Size</label>
              <input
                type="number"
                value={settings.bevelSize}
                onChange={(e) => setSettings({ ...settings, bevelSize: parseFloat(e.target.value) })}
                className="bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-xs font-bold text-gray-200 focus:outline-none focus:border-blue-500/50 transition-all"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Thickness</label>
              <input
                type="number"
                value={settings.bevelThickness}
                onChange={(e) => setSettings({ ...settings, bevelThickness: parseFloat(e.target.value) })}
                className="bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-xs font-bold text-gray-200 focus:outline-none focus:border-blue-500/50 transition-all"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-2 text-gray-500 font-black uppercase text-[10px] tracking-[0.2em]">
          <Box size={14} className="text-gray-400" />
          <span>Surface Style</span>
        </div>
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
          <button
            onClick={() => setStyle('smooth')}
            className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
              style === 'smooth' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Smooth
          </button>
          <button
            onClick={() => setStyle('lowpoly')}
            className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
              style === 'lowpoly' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Low Poly
          </button>
        </div>
      <div className="flex flex-col gap-5 pt-4 border-t-2 border-white/5 mt-4">
        <div className="flex items-center gap-2 text-gray-500 font-black uppercase text-[10px] tracking-[0.2em]">
          <Zap size={14} className="text-acid/70" />
          <span className="text-acid/90">Authenticity Mark (Back-side)</span>
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            {(['none', 'text'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setSettings({ 
                  ...settings, 
                  artistMark: { ...settings.artistMark, type, text: settings.artistMark?.text || 'RECYCLE_3D' } 
                })}
                className={cn(
                  "flex-1 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border",
                  (settings.artistMark?.type || 'none') === type
                    ? "bg-acid border-acid/40 text-black shadow-lg shadow-acid/20"
                    : "bg-white/5 border-white/5 text-gray-500 hover:text-gray-300"
                )}
              >
                {type}
              </button>
            ))}
          </div>

          {(settings.artistMark?.type || 'none') === 'text' && (
            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="ENTER NAME..."
                value={settings.artistMark?.text || ''}
                onChange={(e) => setSettings({ 
                  ...settings, 
                  artistMark: { ...settings.artistMark, type: 'text', text: e.target.value.toUpperCase() } 
                })}
                className="w-full bg-black/40 border-2 border-white/10 rounded-lg px-4 py-3 text-acid font-black text-xs tracking-widest focus:border-acid/50 outline-none transition-all"
              />
              <span className="text-[8px] text-gray-600 font-black uppercase tracking-widest">
                [ Text will be engraved in Reverse for mirroring ]
              </span>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};
