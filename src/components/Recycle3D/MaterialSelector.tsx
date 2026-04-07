import React from "react";
import { Material, MATERIALS } from "../../pages/Workshop";

interface MaterialSelectorProps {
  activeMaterial: Material;
  onSelect: (material: Material) => void;
}

export default function MaterialSelector({ activeMaterial, onSelect }: MaterialSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-[8px] text-gray-500 uppercase tracking-widest mb-1">[ MATERIAL_INVENTORY ]</div>
      <div className="flex gap-4">
        {MATERIALS.map((mat) => (
          <button
            key={mat.id}
            onClick={() => onSelect(mat)}
            className={`group relative flex flex-col items-center gap-2 p-2 brutalist-border transition-all ${
              activeMaterial.id === mat.id ? "bg-white border-acid" : "bg-white/5 border-white/20 hover:border-white/50"
            }`}
          >
            <div 
              className="w-10 h-10 brutalist-border shadow-inner" 
              style={{ backgroundColor: mat.color }}
            />
            <span className={`text-[8px] font-mono ${activeMaterial.id === mat.id ? "text-black" : "text-gray-400"}`}>
              {mat.name}
            </span>
            
            {activeMaterial.id === mat.id && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-acid rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
