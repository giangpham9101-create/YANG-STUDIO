import React from 'react';
import { RECYCLED_MATERIALS } from '../constants/materials';
import { MaterialConfig } from '../types';
import { cn } from '../lib/utils';

interface MaterialSelectorProps {
  selectedId: string;
  onSelect: (material: MaterialConfig) => void;
}

export const MaterialSelector: React.FC<MaterialSelectorProps> = ({ selectedId, onSelect }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
        {RECYCLED_MATERIALS.map((mat) => (
          <button
            key={mat.id}
            onClick={() => onSelect(mat)}
            className={cn(
              "flex items-center gap-4 p-3 rounded-xl border transition-all text-left group relative overflow-hidden",
              selectedId === mat.id
                ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-900/20"
                : "border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10"
            )}
          >
            {selectedId === mat.id && (
              <div className="absolute top-0 right-0 w-12 h-12 bg-blue-500/20 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2" />
            )}
            <div 
              className="w-10 h-10 rounded-lg shadow-2xl border border-white/10 flex-shrink-0 relative z-10"
              style={{ backgroundColor: mat.color }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-white/20 rounded-lg" />
            </div>
            <div className="flex flex-col relative z-10">
              <span className={cn(
                "font-bold text-sm tracking-tight",
                selectedId === mat.id ? "text-blue-400" : "text-gray-200"
              )}>{mat.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">{mat.id.split('-')[1]}</span>
                <div className="w-1 h-1 rounded-full bg-gray-700" />
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Matte Finish</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
