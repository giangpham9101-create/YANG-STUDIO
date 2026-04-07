import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { Eraser, Pencil, Trash2, Zap, Undo2, Redo2, Sliders, Layers as LayersIcon, Circle, Square, Heart, Star, Shield, MousePointer2, PaintBucket } from 'lucide-react';
import { cn } from '../lib/utils';
import { MaterialConfig, StrokeData } from '../types';
import { contours } from 'd3-contour';

const PRESET_COLORS = [
  { name: 'Black', value: '#1a1a1a' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Yellow', value: '#eab308' },
];

const BASE_SHAPES = [
  { id: 'circle', icon: Circle, path: 'M 250, 250 m -150, 0 a 150,150 0 1,0 300,0 a 150,150 0 1,0 -300,0' },
  { id: 'square', icon: Square, path: 'M 100 100 h 300 v 300 h -300 Z' },
  { id: 'heart', icon: Heart, path: 'M 250 150 C 200 100 100 100 100 200 C 100 300 250 400 250 400 C 250 400 400 300 400 200 C 400 100 300 100 250 150 Z' },
  { id: 'star', icon: Star, path: 'M 250 50 L 310 180 L 450 180 L 340 270 L 380 400 L 250 320 L 120 400 L 160 270 L 50 180 L 190 180 Z' },
  { id: 'shield', icon: Shield, path: 'M 250 50 L 400 100 L 400 250 C 400 350 250 450 250 450 C 250 450 100 350 100 250 L 100 100 Z' },
];

interface DrawingCanvasProps {
  onGenerate: (strokes: StrokeData[], baseShapeId: string | null) => void;
  bucketMaterial: MaterialConfig;
  onUpdateBaseMaterial: (materialId: string) => void;
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ 
  onGenerate, 
  bucketMaterial,
  onUpdateBaseMaterial 
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const [isEraser, setIsEraser] = useState(false);
  const [isFillingMode, setIsFillingMode] = useState(false);
  const [brushSize, setBrushSize] = useState(10);
  const [brushColor, setBrushColor] = useState(PRESET_COLORS[1].value); // Default blue
  const [activeLayer, setActiveLayer] = useState<'base' | 'detail'>('base');
  const [stabilization, setStabilization] = useState(50);
  const [history, setHistory] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const [selectedBaseShape, setSelectedBaseShape] = useState<string | null>(null);

  /** path:created chạy trong effect init (deps []); ref giữ màu / cỡ cọ hiện tại */
  const brushColorRef = useRef(brushColor);
  const brushSizeRef = useRef(brushSize);
  brushColorRef.current = brushColor;
  brushSizeRef.current = brushSize;

  /** Fabric 7: base shape vừa nằm trên canvas vừa là clipPath — nếu objectCaching=true, renderCache(forClipping) làm hỏng cache → màu nét sai/mất. */
  const applyBaseShapeNoCache = (canvas: fabric.Canvas) => {
    const base = canvas.getObjects().find((o: any) => o.customLayer === 'base');
    if (base) {
      base.set({ objectCaching: false });
      canvas.clipPath = base;
    }
  };

  useEffect(() => {
    if (!canvasRef.current || !wrapperRef.current) return;

    if (fabricRef.current) {
      fabricRef.current.dispose();
    }

    const { clientWidth, clientHeight } = wrapperRef.current;

    const canvas = new fabric.Canvas(canvasRef.current, {
      isDrawingMode: false,
      width: clientWidth,
      height: clientHeight,
      backgroundColor: '#ffffff',
    });

    if (!canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    }
    
    const pencilBrush = canvas.freeDrawingBrush as fabric.PencilBrush;
    pencilBrush.width = brushSize;
    pencilBrush.color = brushColor;
    pencilBrush.decimate = (100 - stabilization) / 10;
    
    canvas.on('path:created', (e: any) => {
      const path = e.path as fabric.Path;
      const color = brushColorRef.current;
      const width = brushSizeRef.current;
      path.set({
        customLayer: 'detail',
        stroke: color,
        strokeWidth: width,
        fill: null,
        materialId: undefined,
        selectable: true,
        evented: true,
        objectCaching: false,
        globalCompositeOperation: 'source-over',
      });
      path.setCoords();
      canvas.requestRenderAll();

      const json = JSON.stringify(canvas.toObject(['customLayer', 'materialId', 'objectCaching']));
      setHistory(prev => [...prev, json]);
      setRedoStack([]);
    });

    // PAINT BUCKET LOGIC: Fill objects on click
    canvas.on('mouse:down', (e) => {
      if (!isFillingMode || !e.target) return;
      
      const obj = e.target as any;
      if (obj.customLayer === 'base') {
        // SOLID FILL: For the base block, fill the entire shape
        obj.set({ 
          fill: bucketMaterial.color,
          stroke: bucketMaterial.color 
        });
        onUpdateBaseMaterial(bucketMaterial.id);
      } else if (obj.customLayer === 'detail') {
        obj.set({ stroke: bucketMaterial.color, materialId: bucketMaterial.id });
      }
      
      canvas.requestRenderAll();
      const json = JSON.stringify(canvas.toObject(['customLayer', 'materialId', 'objectCaching']));
      setHistory(prev => [...prev, json]);
    });

    fabricRef.current = canvas;

    const handleResize = () => {
      if (!wrapperRef.current || !fabricRef.current) return;
      const { clientWidth, clientHeight } = wrapperRef.current;
      const canvas = fabricRef.current;
      
      const prevWidth = canvas.width || 500;
      const prevHeight = canvas.height || 500;
      
      canvas.setDimensions({ width: clientWidth, height: clientHeight });
      
      const dx = (clientWidth - prevWidth) / 2;
      const dy = (clientHeight - prevHeight) / 2;
      
      canvas.getObjects().forEach(obj => {
        if (obj.left !== undefined) obj.left += dx;
        if (obj.top !== undefined) obj.top += dy;
      });
      canvas.requestRenderAll();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.dispose();
      fabricRef.current = null;
    };
  }, []);

  // Update brush settings
  useEffect(() => {
    if (fabricRef.current?.freeDrawingBrush) {
      const brush = fabricRef.current.freeDrawingBrush as fabric.PencilBrush;
      brush.width = brushSize;
      brush.color = isEraser ? '#ffffff' : brushColor;
      brush.decimate = (100 - stabilization) / 10;
    }
    if (fabricRef.current) {
      fabricRef.current.isDrawingMode = activeLayer === 'detail' && !isFillingMode;
      fabricRef.current.requestRenderAll();
    }
  }, [brushSize, brushColor, stabilization, isEraser, activeLayer, isFillingMode]);

  const addBaseShape = (shapeId: string) => {
    if (!fabricRef.current) return;
    const canvas = fabricRef.current;
    
    // Remove existing base shape
    const existingBase = canvas.getObjects().find((obj: any) => obj.customLayer === 'base');
    if (existingBase) canvas.remove(existingBase);

    const shapeData = BASE_SHAPES.find(s => s.id === shapeId);
    if (!shapeData) return;

    const path = new fabric.Path(shapeData.path, {
      fill: 'transparent',
      stroke: '#888888', // START AS NEUTRAL GRAY
      strokeWidth: 2,
      selectable: true,
      evented: true,
      customLayer: 'base',
      originX: 'center',
      originY: 'center',
      left: canvas.width ? canvas.width / 2 : 250,
      top: canvas.height ? canvas.height / 2 : 250,
      // Bắt buộc khi path này đồng thời là canvas.clipPath (Fabric 7 không được cache object đó)
      objectCaching: false,
    });

    canvas.add(path);
    canvas.sendObjectToBack(path);
    
    // MATHEMATICAL CENTERING: Always place the base shape at the center of the expanded canvas
    const cx = canvas.getWidth() / 2;
    const cy = canvas.getHeight() / 2;
    path.set({
      left: cx,
      top: cy
    });

    // STRICT 2D CLIPPING: cùng object làm clipPath — tắt cache base (applyBaseShapeNoCache / objectCaching)
    applyBaseShapeNoCache(canvas);

    setSelectedBaseShape(shapeId);
    setActiveLayer('detail'); // Auto switch to detail drawing
    
    const json = JSON.stringify(canvas.toObject(['customLayer', 'materialId', 'objectCaching']));
    setHistory(prev => [...prev, json]);
    canvas.requestRenderAll();
  };

  const undo = () => {
    if (!fabricRef.current || history.length === 0) return;
    const canvas = fabricRef.current;
    const current = history[history.length - 1];
    const newHistory = history.slice(0, -1);
    setRedoStack(prev => [current, ...prev]);
    setHistory(newHistory);
    if (newHistory.length === 0) {
      canvas.clear();
      canvas.backgroundColor = '#ffffff';
      canvas.clipPath = undefined;
      setSelectedBaseShape(null);
    } else {
      canvas.loadFromJSON(newHistory[newHistory.length - 1]).then(() => {
        const base = canvas.getObjects().find((obj: any) => obj.customLayer === 'base');
        if (!base) {
          setSelectedBaseShape(null);
          canvas.clipPath = undefined;
        } else {
          applyBaseShapeNoCache(canvas);
        }
        canvas.requestRenderAll();
      });
    }
  };

  const redo = () => {
    if (!fabricRef.current || redoStack.length === 0) return;
    const canvas = fabricRef.current;
    const next = redoStack[0];
    setHistory(prev => [...prev, next]);
    setRedoStack(prev => prev.slice(1));
    canvas.loadFromJSON(next).then(() => {
      applyBaseShapeNoCache(canvas);
      canvas.requestRenderAll();
    });
  };

  const clearCanvas = () => {
    if (!fabricRef.current) return;
    fabricRef.current.clear();
    fabricRef.current.backgroundColor = '#ffffff';
    fabricRef.current.clipPath = undefined;
    fabricRef.current.requestRenderAll();
    setSelectedBaseShape(null);
    setActiveLayer('base');
    setHistory([]);
    setRedoStack([]);
  };

  const handleGenerate = () => {
    if (!fabricRef.current) return;
    const canvas = fabricRef.current;
    const width = canvas.width!;
    const height = canvas.height!;
    const strokes: StrokeData[] = [];

    const baseObj = canvas.getObjects().find((obj: any) => obj.customLayer === 'base');
    if (!baseObj || !selectedBaseShape) {
      alert("Please select a Base Shape first!");
      return;
    }

    // 1. Process Base Layer - Export direct native SVG path for mathematical perfection
    const processBase = () => {
      const shapeData = BASE_SHAPES.find(s => s.id === selectedBaseShape);
      if (!shapeData) return;
      
      strokes.push({
        id: `base-${Date.now()}`,
        points: [],
        pathData: shapeData.path,
        color: '#3b82f6',
        layer: 'base'
      });
    };

    // 2. Process Detail Layer - UNIFIED BLOB EXTRUSION
    // We render ALL detail strokes to an offscreen canvas and run contour detection
    // to find the unified boundaries of overlapping brush strokes.
    const processDetails = () => {
      const details = canvas.getObjects().filter((obj: any) => obj.customLayer === 'detail');
      if (details.length === 0) return;

      // Group strokes by color AND materialId to maintain multi-material 3D parts
      const materialGroups = new Map<string, any[]>();
      details.forEach((obj: any) => {
        const key = `${obj.stroke}-${obj.materialId || 'default'}`;
        if (!materialGroups.has(key)) materialGroups.set(key, []);
        materialGroups.get(key)!.push(obj);
      });

      materialGroups.forEach((groupStrokes, key) => {
        const [color, materialId] = key.split('-');
        const offCanvas = document.createElement('canvas');
        offCanvas.width = width;
        offCanvas.height = height;
        const offCtx = offCanvas.getContext('2d')!;
        
        // 1. Fill background with white
        offCtx.fillStyle = '#ffffff';
        offCtx.fillRect(0, 0, width, height);

        // 2. Apply NATIVE VECTOR CLIPPING so the 3D details never spill over the edges
        const shapeData = BASE_SHAPES.find(s => s.id === selectedBaseShape);
        if (shapeData) {
          const path2d = new Path2D(shapeData.path);
          offCtx.save();
          // Map the 500-unit preset path to the current dynamic canvas center for CLIPPING ONLY
          offCtx.translate(width/2 - 250, height/2 - 250);
          offCtx.clip(path2d);
          // CRITICAL: Reset transform before rendering strokes so pixels are in absolute canvas space
          offCtx.setTransform(1, 0, 0, 1, 0, 0);
        }

        // 3. Render only strokes of the current color
        const colorStrokes = details.filter((obj: any) => 
          (typeof obj.stroke === 'string' ? obj.stroke : '#ef4444') === color
        );
        
        colorStrokes.forEach(obj => {
          // Temporarily set brush to solid black for contour detection
          const originalStroke = obj.stroke;
          obj.set({ stroke: '#000000' });
          obj.render(offCtx);
          obj.set({ stroke: originalStroke });
        });

        if (shapeData) offCtx.restore();

        // 4. Extract Contours from the pixels!
        const imgData = offCtx.getImageData(0, 0, width, height).data;
        const grid = new Float32Array(width * height);
        for (let i = 0; i < imgData.length; i += 4) {
          grid[i / 4] = imgData[i] < 200 ? 1 : 0;
        }

        // NOISE REDUCTION: Aggressive 5x5 box blur to melt jagged edges 
        // to ensure the 3D extruder can successfully triangulate a SOLID face.
        const smoothedGrid = new Float32Array(width * height);
        const radius = 2; // 5x5 kernel
        for (let y = radius; y < height - radius; y++) {
          for (let x = radius; x < width - radius; x++) {
            let sum = 0;
            for (let ky = -radius; ky <= radius; ky++) {
              for (let kx = -radius; kx <= radius; kx++) {
                sum += grid[(y + ky) * width + (x + kx)];
              }
            }
            // Higher threshold to ensure only solid painted areas survive
            smoothedGrid[y * width + x] = sum / 25 > 0.4 ? 1 : 0;
          }
        }

        const detected = contours().size([width, height]).thresholds([0.5])(Array.from(smoothedGrid));
        
        detected.forEach((contour, cIdx) => {
          // Flatten contour coordinates to handle each individual GLYPH/BLOB as its own 3D part
          // This prevents complex nested polygon errors in the 3D viewer.
          contour.coordinates.forEach((polygon, pIdx) => {
            if (polygon.length === 0) return;
            
            // Build a single solid shape for EACH isolated blob
            let blobPath = "";
            const samplePoints: {x:number, y:number}[] = [];

            polygon.forEach(ring => {
              if (ring.length < 3) return;
              
              // POINT SIMPLIFICATION: Aggressively remove noise 
              // only keep points if they move significantly, maintaining the shape but reducing vertex count.
              const simplifiedRing: number[][] = [];
              let lastPt = ring[0];
              simplifiedRing.push(lastPt);
              
              // Keep significant points (distance > 2 pixels)
              for (let i = 1; i < ring.length; i++) {
                const pt = ring[i];
                const dx = pt[0] - lastPt[0];
                const dy = pt[1] - lastPt[1];
                if (Math.abs(dx) > 2 || Math.abs(dy) > 2 || i === ring.length - 1) {
                  simplifiedRing.push(pt);
                  lastPt = pt;
                }
              }

              if (simplifiedRing.length < 3) return;

              const mapX = (x: number) => (x - (width / 2)) + 250;
              const mapY = (y: number) => (y - (height / 2)) + 250;

              blobPath += `M ${mapX(simplifiedRing[0][0])} ${mapY(simplifiedRing[0][1])} `;
              for (let i = 1; i < simplifiedRing.length; i++) {
                const mx = mapX(simplifiedRing[i][0]);
                const my = mapY(simplifiedRing[i][1]);
                blobPath += `L ${mx} ${my} `;
                if (i % 5 === 0) samplePoints.push({x: mx, y: my});
              }
              blobPath += "Z ";
            });

            if (blobPath) {
              strokes.push({
                id: `blob-${color}-${cIdx}-${pIdx}-${Date.now()}`,
                points: samplePoints,
                pathData: blobPath,
                color: color,
                materialId: materialId === 'default' ? undefined : materialId,
                layer: 'detail'
              });
            }
          });
        });
      });
    };

    processBase();
    processDetails();
    onGenerate(strokes, selectedBaseShape);
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex flex-col gap-4 bg-[#1a1a1a] p-4 rounded-xl shadow-inner border border-white/5">
        <div className="flex flex-col gap-4">
          {/* Layer 1: Base Shape Library */}
          <div className="flex flex-col gap-3 border-b border-white/5 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LayersIcon size={14} className="text-blue-500" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Step 1: Choose Base Shape</span>
              </div>
              <button
                onClick={handleGenerate}
                className="flex items-center gap-2 bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-200 transition-all font-bold text-xs shadow-xl active:scale-95"
              >
                <Zap size={14} fill="currentColor" />
                Generate 3D
              </button>
            </div>
            <div className="flex gap-2">
              {BASE_SHAPES.map((shape) => (
                <button
                  key={shape.id}
                  onClick={() => addBaseShape(shape.id)}
                  className={cn(
                    "flex-1 flex flex-col items-center gap-2 p-3 rounded-xl border transition-all",
                    selectedBaseShape === shape.id 
                      ? "bg-blue-600/10 border-blue-500 text-blue-400 shadow-lg shadow-blue-900/20" 
                      : "bg-white/5 border-white/5 text-gray-500 hover:text-gray-300 hover:bg-white/10"
                  )}
                >
                  <shape.icon size={20} />
                  <span className="text-[8px] font-black uppercase tracking-widest">{shape.id}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Layer 2: Detail Drawing */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pencil size={14} className="text-amber-500" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Step 2: Draw Details (Clipped)</span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={undo}
                  disabled={history.length === 0}
                  className="p-1.5 rounded-md hover:bg-white/5 text-gray-500 transition-all disabled:opacity-10"
                >
                  <Undo2 size={14} />
                </button>
                <button
                  onClick={redo}
                  disabled={redoStack.length === 0}
                  className="p-1.5 rounded-md hover:bg-white/5 text-gray-500 transition-all disabled:opacity-10"
                >
                  <Redo2 size={14} />
                </button>
                <button
                  onClick={clearCanvas}
                  className="p-1.5 rounded-md hover:bg-red-500/10 text-red-500/50 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setActiveLayer(activeLayer === 'detail' ? 'base' : 'detail')}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border",
                    activeLayer === 'detail' 
                      ? "bg-amber-600 border-amber-400 text-white shadow-lg shadow-amber-900/20" 
                      : "bg-white/5 border-white/5 text-gray-500 hover:text-gray-300"
                  )}
                >
                  {activeLayer === 'detail' ? <Pencil size={12} /> : <MousePointer2 size={12} />}
                  {activeLayer === 'detail' ? "Drawing Mode" : "Select Mode"}
                </button>

                <button
                  onClick={() => {
                    setIsFillingMode(!isFillingMode);
                    if (!isFillingMode) setActiveLayer('base'); // Switch to selection for bucket
                  }}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border",
                    isFillingMode 
                      ? "bg-acid border-acid/40 text-black shadow-lg shadow-acid/20" 
                      : "bg-white/5 border-white/5 text-gray-500 hover:text-gray-300"
                  )}
                >
                  <PaintBucket size={12} fill={isFillingMode ? "currentColor" : "none"} />
                  {isFillingMode ? "Bucket Active" : "Paint Bucket"}
                </button>

                <div className="flex items-center gap-1.5 px-2 border-l border-white/10">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => {
                        setBrushColor(color.value);
                        setIsEraser(false);
                        setActiveLayer('detail');
                        setIsFillingMode(false);
                      }}
                      className={cn(
                        "w-5 h-5 rounded-full border-2 transition-all hover:scale-110",
                        brushColor === color.value && !isEraser ? "border-white scale-110" : "border-transparent"
                      )}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Sliders size={12} className="text-gray-500" />
                  <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Size</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="30"
                  value={brushSize}
                  onChange={(e) => setBrushSize(parseInt(e.target.value))}
                  className="w-24 h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div ref={wrapperRef} className="flex-1 bg-white rounded-xl overflow-hidden border border-white/5 relative shadow-2xl">
        <canvas ref={canvasRef} />
        {!selectedBaseShape && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center z-10">
            <div className="flex flex-col items-center gap-4 text-gray-400">
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center">
                <LayersIcon size={24} className="opacity-30" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em]">Select a Base Shape to Start</p>
            </div>
          </div>
        )}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em] pointer-events-none flex flex-col items-center gap-2 bg-white/80 px-4 py-2 rounded-full backdrop-blur-sm border border-gray-100 shadow-sm">
          <span>{activeLayer === 'detail' ? "Drawing Detail (Clipped)" : "Base Layer Active"}</span>
          <div className={cn("w-12 h-0.5 rounded-full", activeLayer === 'detail' ? "bg-amber-500" : "bg-blue-500")} />
        </div>
      </div>
    </div>
  );
};
