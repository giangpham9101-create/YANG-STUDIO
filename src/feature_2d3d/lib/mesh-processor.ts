import * as THREE from 'three';
import { mergeVertices, SimplifyModifier } from 'three-stdlib';
import { LoopSubdivision } from 'three-subdivide';

/**
 * Refines a BufferGeometry by welding vertices, applying Loop subdivision,
 * and decimating (retopology) to reduce polygon count.
 * 
 * @param geometry The input THREE.BufferGeometry.
 * @param subdivisionLevel The Loop subdivision iterations (0, 1, or 2).
 * @param decimateRatio The decimation percentage (0 to 80, representing 0% to 80% reduction).
 */
export function refineGeometry(
  geometry: THREE.BufferGeometry,
  subdivisionLevel: number,
  decimateRatio: number
): THREE.BufferGeometry {
  if (!geometry) return geometry;

  // 1. Clone to avoid modifying the cached/shared original geometry
  let processed = geometry.clone();

  // 2. Vertex Welding (Merge vertices that are identical in position)
  // This is a prerequisite for both Subdivision and Simplification because Extrude/Tube geometries
  // have duplicate vertices at boundaries and seams that prevent continuous mesh smoothing.
  try {
    processed = mergeVertices(processed);
  } catch (err) {
    console.warn("Vertex merging failed:", err);
  }

  // 3. Blender-like Subdivision Surface (Loop Subdivision)
  if (subdivisionLevel > 0) {
    try {
      // LoopSubdivision.modify returns a new subdivided BufferGeometry.
      // We cap the level in the UI, but we also safety check it here.
      const iterations = Math.min(2, Math.max(0, subdivisionLevel));
      processed = LoopSubdivision.modify(processed, iterations, {
        split: true,
        uvSmooth: true,
      });
    } catch (err) {
      console.error("Subdivision Surface failed:", err);
    }
  }

  // 4. Retopology (Mesh Decimation/Simplification)
  if (decimateRatio > 0 && decimateRatio < 100) {
    try {
      const positionAttr = processed.getAttribute('position');
      if (positionAttr && positionAttr.count > 4) {
        const initialCount = positionAttr.count;
        const targetPercent = (100 - decimateRatio) / 100;
        const targetCount = Math.max(4, Math.floor(initialCount * targetPercent));
        
        if (targetCount < initialCount) {
          const modifier = new SimplifyModifier();
          processed = modifier.modify(processed, targetCount);
        }
      }
    } catch (err) {
      console.warn("Retopology (Mesh simplification) failed: fallback to unsimplified geometry", err);
    }
  }

  // 5. Clean up normals and bounds
  processed.computeVertexNormals();
  processed.computeBoundingBox();
  processed.computeBoundingSphere();

  return processed;
}
