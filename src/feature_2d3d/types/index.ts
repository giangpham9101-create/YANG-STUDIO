export interface MaterialConfig {
  id: string;
  name: string;
  color: string;
  roughness: number;
  metalness: number;
}

export interface ArtistMark {
  text?: string;
  signaturePath?: string;
  type: 'text' | 'signature' | 'none';
}

export interface ExtrudeSettings {
  depth: number;
  detailThickness: number;
  bevelEnabled: boolean;
  bevelThickness: number;
  bevelSize: number;
  bevelOffset: number;
  bevelSegments: number;
  artistMark?: ArtistMark;
}

export type GeometryStyle = 'smooth' | 'lowpoly';

export interface StrokeData {
  id: string;
  points: { x: number; y: number }[];
  pathData?: string;
  color: string;
  materialId?: string;
  layer?: 'base' | 'detail';
}
