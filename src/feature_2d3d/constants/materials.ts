import { MaterialConfig } from "../types";

export const RECYCLED_MATERIALS: MaterialConfig[] = [
  // HDPE - High Density Polyethylene (Matte, Opaque)
  { id: "hdpe-white", name: "Recycled White HDPE", color: "#f3f4f6", roughness: 0.8, metalness: 0.1 },
  { id: "hdpe-blue", name: "Recycled Blue HDPE", color: "#2563eb", roughness: 0.7, metalness: 0.1 },
  { id: "hdpe-orange", name: "Recycled Orange HDPE", color: "#f97316", roughness: 0.75, metalness: 0.1 },
  { id: "hdpe-yellow", name: "Recycled Yellow HDPE", color: "#eab308", roughness: 0.8, metalness: 0.05 },
  
  // PET - Polyethylene Terephthalate (Glossy, Deep Colors)
  { id: "pet-clear", name: "Recycled Clear PET", color: "#e2e8f0", roughness: 0.2, metalness: 0.1 },
  { id: "pet-green", name: "Recycled Green PET", color: "#15803d", roughness: 0.3, metalness: 0.1 },
  { id: "pet-amber", name: "Recycled Amber PET", color: "#92400e", roughness: 0.35, metalness: 0.2 },
  { id: "pet-black", name: "Recycled Black PET", color: "#0a0a0a", roughness: 0.25, metalness: 0.15 },
];
