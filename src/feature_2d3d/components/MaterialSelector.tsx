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
              "flex items-center gap-4 p-3 rounded-xl border transition-all text-left group relative overflow-hidden cursor-pointer",
              selectedId === mat.id
                ? "border-brand-blue bg-brand-blue/5 shadow-md"
                : "border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300"
            )}
          >
            {selectedId === mat.id && (
              <div className="absolute top-0 right-0 w-12 h-12 bg-brand-blue/5 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2" />
            )}
            <div 
              className="w-10 h-10 rounded-lg shadow-md border border-black/5 flex-shrink-0 relative z-10"
              style={{ backgroundColor: mat.color }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-white/10 rounded-lg" />
            </div>
            <div className="flex flex-col relative z-10">
              <span className={cn(
                "font-bold text-sm tracking-tight transition-colors",
                selectedId === mat.id ? "text-brand-blue" : "text-gray-800 group-hover:text-black"
              )}>{mat.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{mat.id.split('_')[1] || mat.id}</span>
                <div className="w-1 h-1 rounded-full bg-gray-300" />
                <span className="text-[9px] text-gray-400 font-medium uppercase tracking-widest">Matte Finish</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
