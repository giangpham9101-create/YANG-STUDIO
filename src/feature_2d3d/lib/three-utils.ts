import * as THREE from 'three';
import { SVGLoader } from 'three-stdlib';

/**
 * Smooths a set of points using Catmull-Rom spline interpolation.
 * This rounds off jagged edges from hand-drawn or pixel-detected paths.
 */
export function smoothPoints(points: { x: number; y: number }[], divisions: number = 128): { x: number; y: number }[] {
  if (points.length < 4) return points; // Need at least 4 points for a good spline

  const vPoints = points.map(p => new THREE.Vector3(p.x, p.y, 0));
  
  // Check if the path is closed
  const first = vPoints[0];
  const last = vPoints[vPoints.length - 1];
  const isClosed = first.distanceTo(last) < 1.0;
  
  // Create the spline
  const curve = new THREE.CatmullRomCurve3(vPoints, isClosed, 'centripetal', 0.5);
  const samples = curve.getPoints(divisions);
  
  return samples.map(p => ({ x: p.x, y: p.y }));
}

/**
 * Converts an SVG path string into an array of THREE.Shapes.
 * This is used for exact tracing of Fabric.js paths.
 */
export function svgPathToShapes(pathData: string): THREE.Shape[] {
  try {
    const loader = new SVGLoader();
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg"><path d="${pathData}" /></svg>`;
    const parsed = loader.parse(svgString);
    
    if (parsed.paths.length === 0) return [];
    
    const allShapes: THREE.Shape[] = [];
    parsed.paths.forEach(path => {
      const shapes = SVGLoader.createShapes(path);
      allShapes.push(...shapes);
    });
    
    return allShapes;
  } catch (error) {
    console.error('Error parsing SVG path:', error);
    return [];
  }
}

/**
 * Converts a set of 2D points into a THREE.Shape.
 * This is used for ExtrudeGeometry.
 * 
 * LOGIC: Auto-closing open paths.
 * If the start and end points are not identical, we add a line to close the loop.
 * This ensures the resulting 3D mesh is manifold/watertight.
 */
export function pointsToShape(points: { x: number; y: number }[]): THREE.Shape | null {
  if (points.length < 3) return null;

  const shape = new THREE.Shape();
  
  // Move to start
  shape.moveTo(points[0].x, points[0].y);

  // Draw lines to each point
  for (let i = 1; i < points.length; i++) {
    shape.lineTo(points[i].x, points[i].y);
  }

  // AUTO-CLOSE LOGIC:
  // Check if the last point is close to the first point
  const first = points[0];
  const last = points[points.length - 1];
  const distSq = Math.pow(first.x - last.x, 2) + Math.pow(first.y - last.y, 2);
  
  if (distSq > 0.001) {
    // If not closed, force close it by drawing a line back to start
    shape.lineTo(first.x, first.y);
  }

  shape.closePath();
  return shape;
}

/**
 * Calculates the global bounding box and transform for a set of strokes.
 * This ensures all parts of the drawing maintain their relative positions.
 */
export function getGlobalTransform(strokes: any[], targetSize: number = 100): { scale: number; center: THREE.Vector3 } {
  if (strokes.length === 0) {
    return { scale: 1, center: new THREE.Vector3(0, 0, 0) };
  }

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  
  strokes.forEach(stroke => {
    stroke.points.forEach((p: any) => {
      minX = Math.min(minX, p.x);
      minY = Math.min(minY, p.y);
      maxX = Math.max(maxX, p.x);
      maxY = Math.max(maxY, p.y);
    });
  });

  if (minX === Infinity) {
    return { scale: 1, center: new THREE.Vector3(0, 0, 0) };
  }

  const width = maxX - minX;
  const height = maxY - minY;
  const size = Math.max(width, height);
  const scale = targetSize / (size || 1);

  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  return {
    scale,
    center: new THREE.Vector3(centerX, centerY, 0)
  };
}

/**
 * Normalizes an array of THREE.Shapes to a common center and scales them.
 * @deprecated Use getGlobalTransform for multi-stroke consistency.
 */
export function normalizeShapes(shapes: THREE.Shape[], targetSize: number = 50): { scale: number; center: THREE.Vector3 } {
  if (shapes.length === 0) {
    return { scale: 1, center: new THREE.Vector3(0, 0, 0) };
  }

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  
  shapes.forEach(shape => {
    const points = shape.getPoints();
    points.forEach(p => {
      minX = Math.min(minX, p.x);
      minY = Math.min(minY, p.y);
      maxX = Math.max(maxX, p.x);
      maxY = Math.max(maxY, p.y);
    });
  });

  if (minX === Infinity) {
    return { scale: 1, center: new THREE.Vector3(0, 0, 0) };
  }

  const width = maxX - minX;
  const height = maxY - minY;
  const size = Math.max(width, height);
  const scale = targetSize / (size || 1);

  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  return {
    scale,
    center: new THREE.Vector3(centerX, centerY, 0)
  };
}

/**
 * Laplacian Smoothing Logic for 3D Mesh Vertices
 * 
 * For a given vertex, we find its neighbors and move it towards their average position.
 * This softens jagged edges from hand-drawn lines.
 */
export function applyLaplacianSmoothing(
  geometry: THREE.BufferGeometry,
  center: THREE.Vector3,
  radius: number,
  strength: number
) {
  const positionAttribute = geometry.getAttribute('position');
  const vertexCount = positionAttribute.count;
  
  // 1. Build adjacency map (neighbors for each vertex)
  // For simplicity in this implementation, we'll use a distance-based neighbor search
  // within the brush radius, but a real Laplacian would use edge connectivity.
  // We'll simulate it by moving vertices towards the local average.
  
  const originalPositions = new Float32Array(positionAttribute.array);
  const newPositions = new Float32Array(positionAttribute.array);
  
  const vA = new THREE.Vector3();
  const vB = new THREE.Vector3();
  
  for (let i = 0; i < vertexCount; i++) {
    vA.fromArray(originalPositions, i * 3);
    
    const dist = vA.distanceTo(center);
    if (dist < radius) {
      // Find local average of neighbors within a small epsilon
      const neighbors: THREE.Vector3[] = [];
      const searchRadius = radius * 0.5;
      
      for (let j = 0; j < vertexCount; j++) {
        if (i === j) continue;
        vB.fromArray(originalPositions, j * 3);
        if (vA.distanceTo(vB) < searchRadius) {
          neighbors.push(vB.clone());
        }
        if (neighbors.length > 8) break; // Limit search for performance
      }
      
      if (neighbors.length > 0) {
        const avg = new THREE.Vector3(0, 0, 0);
        neighbors.forEach(n => avg.add(n));
        avg.divideScalar(neighbors.length);
        
        // Interpolate based on strength and distance from brush center
        const falloff = 1 - (dist / radius);
        const influence = strength * falloff;
        
        vA.lerp(avg, influence);
        vA.toArray(newPositions, i * 3);
      }
    }
  }
  
  positionAttribute.array.set(newPositions);
  positionAttribute.needsUpdate = true;
  geometry.computeVertexNormals();
}
