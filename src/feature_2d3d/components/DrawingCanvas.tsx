import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { cn } from '../lib/utils';
import { MaterialConfig, StrokeData } from '../types';
import { MousePointer, PaintBucket, Trash2, Undo2, Redo2, CircleDot } from 'lucide-react';
import { contours } from 'd3-contour';
import { BRAND } from '@/src/lib/brand-colors';
import { scaleAndCenterSVGPath } from '../lib/three-utils';

// Import SVG Assets
import assetChooseBase from '../../assets/info workshop/SVG/Asset 28.svg';
import assetDrawDetails from '../../assets/info workshop/SVG/Asset 29.svg';
import assetSelectMode from '../../assets/info workshop/SVG/Asset 36.svg';
import assetPaintBucket from '../../assets/info workshop/SVG/Asset 37.svg';
import assetSizeLabel from '../../assets/info workshop/SVG/Asset 38.svg';
import assetTrashIcon from '../../assets/info workshop/SVG/Asset 40.svg';
import assetUndoIcon from '../../assets/info workshop/SVG/Asset 41.svg';
import assetRedoIcon from '../../assets/info workshop/SVG/Asset 42.svg';
import assetCharacter from '../../assets/info workshop/SVG/Asset 43.svg';
import assetSelectBasePrompt from '../../assets/info workshop/SVG/Asset 44.svg';
import assetGenerate3D from '../../assets/info workshop/SVG/Asset 47.svg';
import assetCanvasFrame from '../../assets/info workshop/SVG/Asset 46.svg';

export interface AssetOffsetScale {
  offsetX: number;
  offsetY: number;
  scale: number;
}

export interface CanvasAssetsConfig {
  chooseBaseHeader: AssetOffsetScale;
  drawDetailsHeader: AssetOffsetScale;
  selectModeButton: AssetOffsetScale;
  paintBucketButton: AssetOffsetScale;
  sizeLabel: AssetOffsetScale;
  colorsPalette?: AssetOffsetScale;
  trashIcon: AssetOffsetScale;
  undoIcon: AssetOffsetScale;
  redoIcon: AssetOffsetScale;
  mascot: AssetOffsetScale;
  selectBasePrompt: AssetOffsetScale;
  generate3DButton: AssetOffsetScale;
  canvasFrame: AssetOffsetScale;
  basePresets: {
    offsetX: number;
    offsetY: number;
    cardWidth?: number;
    cardHeight?: number;
    cardScale: number;
    imageWidth: number;
    imageHeight: number;
    gap: number;
  };
}

const DEFAULT_CANVAS_CONFIG: CanvasAssetsConfig = {
  chooseBaseHeader: { offsetX: 0, offsetY: 0, scale: 1.0 },
  drawDetailsHeader: { offsetX: 0, offsetY: 0, scale: 1.0 },
  selectModeButton: { offsetX: 0, offsetY: 0, scale: 1.0 },
  paintBucketButton: { offsetX: 0, offsetY: 0, scale: 1.0 },
  sizeLabel: { offsetX: 0, offsetY: 0, scale: 1.0 },
  colorsPalette: { offsetX: 0, offsetY: 0, scale: 1.0 },
  trashIcon: { offsetX: 0, offsetY: 0, scale: 1.0 },
  undoIcon: { offsetX: 0, offsetY: 0, scale: 1.0 },
  redoIcon: { offsetX: 0, offsetY: 0, scale: 1.0 },
  mascot: { offsetX: 0, offsetY: 0, scale: 1.0 },
  selectBasePrompt: { offsetX: 0, offsetY: 0, scale: 1.0 },
  generate3DButton: { offsetX: 16, offsetY: 16, scale: 1.0 },
  canvasFrame: { offsetX: 0, offsetY: 0, scale: 1.0 },
  basePresets: { offsetX: 0, offsetY: 0, cardWidth: 80, cardHeight: 80, cardScale: 1.0, imageWidth: 56, imageHeight: 56, gap: 20 },
};

import iconHeart from '../../assets/info workshop/SVG/Asset 30.svg';
import iconFlower from '../../assets/info workshop/SVG/Asset 31.svg';
import iconBottle from '../../assets/info workshop/SVG/Asset 32.svg';
import iconBag from '../../assets/info workshop/SVG/Asset 33.svg';
import iconOrnament from '../../assets/info workshop/SVG/Asset 34.svg';
import iconPlasticBag from '../../assets/info workshop/SVG/Asset 35.svg';

const PRESET_COLORS = [
  { name: 'Blue', value: '#0020D7' },
  { name: 'Pink', value: '#FF009C' },
  { name: 'Green', value: '#A7F417' },
  { name: 'Black', value: '#000000' },
  { name: 'Yellow', value: '#FFDE00' },
  { name: 'Red', value: '#FF2222' }
];

const BASE_SHAPES = [
  { id: 'flower', image: iconFlower, name: 'Flower', path: scaleAndCenterSVGPath('M207.12,113.71c-4.05-12.48-15.58-20.86-28.69-20.86-3.15,0-6.29.5-9.33,1.49-2.68.87-5.14,2.11-7.38,3.6.73-2.59,1.14-5.31,1.14-8.13,0-16.64-13.53-30.17-30.17-30.17-8.8,0-16.73,3.79-22.25,9.82-2.16-1.97-4.72-3.54-7.6-4.58-8.58-3.1-18.71-.29-24.52,6.71-5.5,6.61-6.83,15.96-3.32,23.73-7.79,3.36-13.98,9.93-16.73,18.4-5.14,15.82,3.55,32.88,19.37,38.02,2.63.85,5.33,1.32,8.06,1.44-2.13,1.68-4.05,3.65-5.68,5.89-4.74,6.52-6.65,14.49-5.39,22.45,1.26,7.96,5.55,14.95,12.07,19.69,5.19,3.77,11.31,5.76,17.7,5.76,9.64,0,18.78-4.65,24.44-12.44,1.66-2.28,2.92-4.72,3.85-7.25.93,2.52,2.19,4.97,3.85,7.25,5.66,7.79,14.8,12.44,24.44,12.44,6.39,0,12.51-1.99,17.7-5.76,6.52-4.74,10.8-11.73,12.07-19.69,1.26-7.96-.65-15.93-5.39-22.45-1.63-2.24-3.55-4.21-5.68-5.89,2.72-.12,5.43-.58,8.06-1.44,15.82-5.14,24.51-22.2,19.37-38.02ZM82.42,78.32c3.18-5.35,9.55-8.33,15.7-7.2,3.18.59,5.96,2.13,8.08,4.3-2.34,4.28-3.66,9.19-3.66,14.4,0,2.82.42,5.54,1.14,8.13-2.24-1.49-4.7-2.73-7.38-3.6-3.04-.99-6.18-1.49-9.33-1.49-1.65,0-3.28.13-4.87.39-2.46-4.61-2.39-10.36.32-14.93Z') },
  { id: 'bottle', image: iconBottle, name: 'Bottle', path: scaleAndCenterSVGPath('M233.76,145.43c-.14-24.08,1.5-25.35-15.53-24.2-3.69-3.14-7.45-.36-6.69,3.49-21.67,1.33-17.1-30.59-58.51-29.3-.84-.07-1.63-.11-2.4-.12.04-.43.07-.87.08-1.31.01-.15.02-.3.02-.46,0-.15,0-.3-.02-.45-.34-9.35-6.17-17.54-15.03-20.73-8.58-3.1-18.71-.29-24.52,6.71-4.11,4.94-5.89,11.41-5.06,17.61-.39.05-.79.1-1.21.17-13.36,6.17-7.7-.19-20.18.77-3.57.58-4.63,2.21-7.01,3.07-12.22.81-15.38-8.8-31.97,1.31-4.73,3.28-8.12,9.43-9.2,27.59-2.69,30.39-2.34,77.07,36.79,63.5,7.36-6.28,9.67,3.67,19.27.44,11.15-4.13,6.38-1.99,16.64,0,12.94-.92,16.73-9.48,29.78-2.63,24.28,5.4,45.74-1.2,61.62-23.66.51-3.45,7.47-6.87,10.9-5.38-.8,4.47,4.6,5.95,7.48,3.55,15.41.94,15.47.78,14.75-19.98ZM115.25,85.8c3.18-5.35,9.55-8.33,15.7-7.2,7.25,1.34,12.37,7.63,12.5,14.94-.02.89-.11,1.77-.27,2.63-4.71,1.19-8.67,3.36-14.24,4.96-7.92.52-10.7-2.49-15.35-3.9-.93-3.81-.4-7.96,1.66-11.42Z') },
  { id: 'bag', image: iconBag, name: 'Shopping Bag', path: scaleAndCenterSVGPath('M207.9,117.05c5.13-4.1,8.37-10.45,8.62-17.21.01-.15.02-.3.02-.46,0-.15,0-.3-.02-.45-.34-9.35-6.17-17.54-15.03-20.73-8.58-3.1-18.71-.29-24.52,6.71-.86,1.03-1.61,2.13-2.26,3.27-29.81-27.88-42.18-48.05-53.17-43.7-.2.08-4.76,1.96-5.79,5.91-2.84,10.98,25.67,22.13,23.41,35.11-.78,4.48-4.94,7.53-8.01,9.78-8.23,6.03-13.21,1.95-19.58,7.01-7.27,5.77-4.45,13.99-11.92,18.26-5.37,3.07-11.53,1.49-11.89,1.39-13.88-3.76-14.28-26.3-25.23-27.6-3.63-.43-7.72,1.56-9.76,4.32-6.31,8.57,6.48,25.49,25.76,57.53,28.41,47.21,33.37,64.86,49.68,66.44,5.79.56,11.35-1.92,22.48-6.88,5.91-2.64,11.66-5.79,42.82-31.29,15.38-12.59,23.65-19.74,28.42-32.56,1.21-3.24,1.81-4.86,2.08-7.14,1.19-9.93-5.27-17.96-16.13-27.71ZM196.76,84.44c7.25,1.34,12.37,7.63,12.5,14.94-.09,5.18-2.7,10.01-6.98,12.78-6.43-5.48-13.94-11.61-22.04-18.9.24-.55.51-1.09.82-1.62,3.18-5.35,9.55-8.33,15.7-7.2Z') },
  { id: 'ornament', image: iconOrnament, name: 'Ornament', path: scaleAndCenterSVGPath('M152.66,76.28c.04-.41.06-.81.08-1.22.01-.15.02-.3.02-.46,0-.15,0-.3-.02-.45-.34-9.35-6.17-17.54-15.03-20.73-8.58-3.1-18.71-.29-24.52,6.71-4.45,5.35-6.16,12.48-4.8,19.13-25.58,10.48-43.61,35.63-43.61,64.99h0c0,38.77,31.43,70.21,70.21,70.21h0c38.77,0,70.21-31.43,70.21-70.21h0c0-32.67-22.31-60.12-52.53-67.96ZM117.28,66.85c3.18-5.35,9.55-8.33,15.7-7.2,7.25,1.34,12.37,7.63,12.5,14.94,0,.07,0,.14-.01.22-3.42-.51-6.92-.78-10.49-.78h0c-6.82,0-13.41.98-19.65,2.79-.49-3.39.15-6.94,1.95-9.97Z') },
  { id: 'plasticbag', image: iconPlasticBag, name: 'Plastic Bag', path: scaleAndCenterSVGPath('M156.77,75.15c.04-.4.06-.8.08-1.21.01-.15.02-.3.02-.46,0-.15,0-.3-.02-.45-.34-9.35-6.17-17.54-15.03-20.73-8.58-3.1-18.71-.29-24.52,6.71-3.78,4.55-5.59,10.4-5.21,16.14h-46.92v140.41h140.41V75.15h-48.81ZM121.38,65.74c3.18-5.35,9.55-8.33,15.7-7.2,7.25,1.34,12.37,7.63,12.5,14.94,0,.56-.06,1.12-.13,1.67h-30.08c-.35-3.22.31-6.55,2.01-9.41Z') },
  { id: 'heart', image: iconHeart, name: 'Heart', path: scaleAndCenterSVGPath('M225.56,105c-2.65-13.29-11.12-25.86-23.9-32.62-12.78-6.76-28.6-8.4-42.7-.37-8.78,5-14.86,12.97-17.97,21.43-3.11-8.46-9.19-16.43-17.97-21.43-10.87-6.19-22.76-6.63-33.49-3.42-2.48-5.47-7.05-9.86-12.99-12-8.58-3.1-18.71-.29-24.52,6.71-6.08,7.32-7.06,17.98-2.03,26.16,2.14,3.48,5.13,6.2,8.57,8.03-.92,2.45-1.64,4.97-2.15,7.51-2.65,13.29-.13,27.32,6.12,39.54,17.95,35.1,55.79,56.9,78.46,66.73,22.67-9.83,60.5-31.63,78.45-66.73,6.25-12.22,8.77-26.25,6.12-39.54ZM57.37,87.34c-3.99-4.87-4.45-11.92-1.26-17.31,3.18-5.35,9.55-8.33,15.7-7.2,4.92.91,8.86,4.1,10.92,8.34-.82.38-1.63.78-2.42,1.2-8.09,4.28-14.45,10.88-18.7,18.53-1.6-.91-3.05-2.1-4.25-3.56Z') }
];

interface DrawingCanvasProps {
  onGenerate: (strokes: StrokeData[], baseShapeId: string | null) => void;
  bucketMaterial: MaterialConfig;
  onUpdateBaseMaterial: (materialId: string) => void;
  assetsConfig?: CanvasAssetsConfig;
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  onGenerate,
  bucketMaterial,
  onUpdateBaseMaterial,
  assetsConfig
}) => {
  const cfg = assetsConfig || DEFAULT_CANVAS_CONFIG;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const [isEraser, setIsEraser] = useState(false);
  const [isFillingMode, setIsFillingMode] = useState(false);
  const [brushSize, setBrushSize] = useState(10);
  const [brushColor, setBrushColor] = useState(PRESET_COLORS[0].value);
  const [activeLayer, setActiveLayer] = useState<'base' | 'detail'>('base');
  const [stabilization, setStabilization] = useState(50);
  const [history, setHistory] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const [selectedBaseShape, setSelectedBaseShape] = useState<string | null>(null);
  const [baseScale, setBaseScale] = useState(2.0);

  const brushColorRef = useRef(brushColor);
  const brushSizeRef = useRef(brushSize);
  brushColorRef.current = brushColor;
  brushSizeRef.current = brushSize;

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
      backgroundColor: BRAND.white,
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

    canvas.on('mouse:down', (e) => {
      if (!isFillingMode || !e.target) return;

      const obj = e.target as any;
      if (obj.customLayer === 'base') {
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

    canvas.on('object:scaling', (e) => {
      const obj = e.target as any;
      if (obj && obj.customLayer === 'base') {
        setBaseScale(obj.scaleX);
      }
    });

    canvas.on('object:modified', (e) => {
      const obj = e.target as any;
      if (obj && obj.customLayer === 'base') {
        setBaseScale(obj.scaleX);
      }
    });

    fabricRef.current = canvas;

    const handleResize = () => {
      if (!wrapperRef.current || !fabricRef.current) return;
      const { clientWidth, clientHeight } = wrapperRef.current;
      const canvas = fabricRef.current;

      const prevWidth = canvas.width || 500;
      const prevHeight = canvas.height || 500;

      if (clientWidth === prevWidth && clientHeight === prevHeight) return;

      canvas.setDimensions({ width: clientWidth, height: clientHeight });

      const dx = (clientWidth - prevWidth) / 2;
      const dy = (clientHeight - prevHeight) / 2;

      canvas.getObjects().forEach(obj => {
        if (obj.left !== undefined) obj.left += dx;
        if (obj.top !== undefined) obj.top += dy;
      });
      canvas.requestRenderAll();
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    if (wrapperRef.current) {
      resizeObserver.observe(wrapperRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      canvas.dispose();
      fabricRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!fabricRef.current) return;
    const canvas = fabricRef.current;
    const base = canvas.getObjects().find((obj: any) => obj.customLayer === 'base');
    if (base) {
      if (base.scaleX !== baseScale) {
        base.set({
          scaleX: baseScale,
          scaleY: baseScale
        });
        base.setCoords();
        canvas.requestRenderAll();
      }
    }
  }, [baseScale]);

  useEffect(() => {
    if (fabricRef.current?.freeDrawingBrush) {
      const brush = fabricRef.current.freeDrawingBrush as fabric.PencilBrush;
      brush.width = brushSize;
      brush.color = isEraser ? BRAND.white : brushColor;
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

    const existingBase = canvas.getObjects().find((obj: any) => obj.customLayer === 'base');
    if (existingBase) canvas.remove(existingBase);

    const shapeData = BASE_SHAPES.find(s => s.id === shapeId);
    if (!shapeData) return;

    const path = new fabric.Path(shapeData.path, {
      fill: 'rgba(0,0,0,0)',
      stroke: BRAND.black,
      strokeWidth: 2,
      selectable: true,
      evented: true,
      customLayer: 'base',
      originX: 'center',
      originY: 'center',
      left: canvas.getWidth() / 2,
      top: canvas.getHeight() / 2,
      objectCaching: false,
      scaleX: 2.0,
      scaleY: 2.0,
    });


    path.lockRotation = true;
    path.setControlsVisibility({ mtr: false });

    canvas.add(path);
    canvas.sendObjectToBack(path);

    const cx = canvas.getWidth() / 2;
    const cy = canvas.getHeight() / 2;
    path.set({
      left: cx,
      top: cy
    });

    applyBaseShapeNoCache(canvas);

    setSelectedBaseShape(shapeId);
    setBaseScale(2.0); // Reset scale to 2.0 when a new shape is loaded
    setActiveLayer('detail');

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

    const processBase = () => {
      const shapeData = BASE_SHAPES.find(s => s.id === selectedBaseShape);
      if (!shapeData) return;

      strokes.push({
        id: `base-${Date.now()}`,
        points: [],
        pathData: shapeData.path,
        color: BRAND.blue,
        layer: 'base'
      });
    };

    const processDetails = () => {
      const details = canvas.getObjects().filter((obj: any) => obj.customLayer === 'detail');
      if (details.length === 0) return;

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

        offCtx.fillStyle = BRAND.white;
        offCtx.fillRect(0, 0, width, height);

        const shapeData = BASE_SHAPES.find(s => s.id === selectedBaseShape);
        if (shapeData && baseObj) {
          const path2d = new Path2D(shapeData.path);
          offCtx.save();

          const left = baseObj.left ?? (width / 2);
          const top = baseObj.top ?? (height / 2);
          const scaleX = baseObj.scaleX ?? 1;
          const scaleY = baseObj.scaleY ?? 1;
          const pathOffsetX = (baseObj as any).pathOffset?.x ?? width / 2;
          const pathOffsetY = (baseObj as any).pathOffset?.y ?? height / 2;

          offCtx.translate(left, top);
          offCtx.scale(scaleX, scaleY);
          offCtx.translate(-pathOffsetX, -pathOffsetY);
          offCtx.clip(path2d);
          offCtx.setTransform(1, 0, 0, 1, 0, 0);
        }

        const colorStrokes = details.filter((obj: any) =>
          (typeof obj.stroke === 'string' ? obj.stroke : BRAND.pink) === color
        );

        colorStrokes.forEach(obj => {
          const originalStroke = obj.stroke;
          obj.set({ stroke: BRAND.black });
          obj.render(offCtx);
          obj.set({ stroke: originalStroke });
        });

        if (shapeData) offCtx.restore();

        const imgData = offCtx.getImageData(0, 0, width, height).data;
        const grid = new Float32Array(width * height);
        for (let i = 0; i < imgData.length; i += 4) {
          grid[i / 4] = imgData[i] < 200 ? 1 : 0;
        }

        const smoothedGrid = new Float32Array(width * height);
        const radius = 2;
        for (let y = radius; y < height - radius; y++) {
          for (let x = radius; x < width - radius; x++) {
            let sum = 0;
            for (let ky = -radius; ky <= radius; ky++) {
              for (let kx = -radius; kx <= radius; kx++) {
                sum += grid[(y + ky) * width + (x + kx)];
              }
            }
            smoothedGrid[y * width + x] = sum / 25 >= 0.5 ? 1 : 0;
          }
        }

        const detected = contours().size([width, height]).thresholds([0.5])(Array.from(smoothedGrid));

        detected.forEach((contour, cIdx) => {
          contour.coordinates.forEach((polygon, pIdx) => {
            if (polygon.length === 0) return;

            let blobPath = "";
            const samplePoints: { x: number, y: number }[] = [];

            polygon.forEach(ring => {
              if (ring.length < 3) return;

              const simplifiedRing: number[][] = [];
              let lastPt = ring[0];
              simplifiedRing.push(lastPt);

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

              const scaleX = baseObj.scaleX ?? 1;
              const scaleY = baseObj.scaleY ?? 1;
              const left = baseObj.left ?? (width / 2);
              const top = baseObj.top ?? (height / 2);
              const pathOffsetX = (baseObj as any).pathOffset?.x ?? 250;
              const pathOffsetY = (baseObj as any).pathOffset?.y ?? 250;

              const mapX = (x: number) => ((x - left) / scaleX) + pathOffsetX;
              const mapY = (y: number) => ((y - top) / scaleY) + pathOffsetY;

              blobPath += `M ${mapX(simplifiedRing[0][0])} ${mapY(simplifiedRing[0][1])} `;
              for (let i = 1; i < simplifiedRing.length; i++) {
                const mx = mapX(simplifiedRing[i][0]);
                const my = mapY(simplifiedRing[i][1]);
                blobPath += `L ${mx} ${my} `;
                if (i % 5 === 0) samplePoints.push({ x: mx, y: my });
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
    <div className="flex flex-col gap-6 w-full">
      {/* STEP 1: CHOOSE BASE SHAPE */}
      <div className="flex flex-col gap-3 w-full items-start">
        <div 
          className="select-none mb-1"
          style={{
            transform: `translate(${cfg.chooseBaseHeader.offsetX}px, ${cfg.chooseBaseHeader.offsetY}px) scale(${cfg.chooseBaseHeader.scale})`,
            transformOrigin: 'left center'
          }}
        >
          <img src={assetChooseBase} className="h-16 w-auto object-contain" alt="Step 1: Choose Base Shape" />
        </div>
        <div 
          className="grid grid-cols-6 w-full pt-1 justify-items-center"
          style={{ gap: `${cfg.basePresets.gap}px` }}
        >
          {BASE_SHAPES.map((shape) => (
            <div
              key={shape.id}
              style={{
                transform: `translate(${cfg.basePresets.offsetX}px, ${cfg.basePresets.offsetY}px) scale(${cfg.basePresets.cardScale})`,
                transformOrigin: 'center',
                width: `${cfg.basePresets.cardWidth ?? 80}px`,
                height: `${cfg.basePresets.cardHeight ?? 80}px`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <button
                onClick={() => addBaseShape(shape.id)}
                className={cn(
                  "relative flex items-center justify-center p-2 rounded-[20px] overflow-hidden transition-all duration-200 hover:scale-105 active:scale-95 border-2 cursor-pointer bg-[#A7F417] shadow-[2px_2px_0px_rgba(0,0,0,1)] w-full h-full",
                  selectedBaseShape === shape.id
                    ? "border-[#FF009C] ring-2 ring-[#FF009C]/40 scale-105"
                    : "border-black hover:opacity-100"
                )}
              >
                <img
                  src={shape.image}
                  alt={shape.name}
                  className="object-contain animate-in zoom-in-95 duration-200"
                  style={{
                    width: `${cfg.basePresets.imageWidth}px`,
                    height: `${cfg.basePresets.imageHeight}px`
                  }}
                />
                {selectedBaseShape === shape.id && (
                  <div className="absolute inset-0 bg-white/10 pointer-events-none rounded-[18px]" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* STEP 2: DRAW DETAILS */}
      <div className="flex flex-col gap-3 w-full items-start">
        <div 
          className="select-none mb-1 relative z-30"
          style={{
            transform: `translate(${cfg.drawDetailsHeader.offsetX}px, ${cfg.drawDetailsHeader.offsetY}px) scale(${cfg.drawDetailsHeader.scale})`,
            transformOrigin: 'left center'
          }}
        >
          <img src={assetDrawDetails} className="h-16 w-auto object-contain" alt="Step 2: Draw Details" />
        </div>

        <div className="flex flex-col md:flex-row gap-6 w-full items-stretch mt-1 overflow-visible">
          {/* SIDEBAR TOOLS (LEFT) */}
          <div className="flex flex-row md:flex-col gap-4 md:w-44 shrink-0 p-1 justify-start items-center">
            <div className="flex flex-col gap-4 w-full items-stretch">
              {/* SELECT MODE BUTTON */}
              <div
                style={{
                  transform: `translate(${cfg.selectModeButton.offsetX}px, ${cfg.selectModeButton.offsetY}px) scale(${cfg.selectModeButton.scale})`,
                  transformOrigin: 'center'
                }}
              >
                <button
                  onClick={() => {
                    setActiveLayer('base');
                    setIsFillingMode(false);
                  }}
                  className={cn(
                    "w-full transition-transform active:scale-95 cursor-pointer border-none bg-transparent p-0",
                    activeLayer === 'base' && !isFillingMode
                      ? "brightness-100 scale-105 filter drop-shadow-[0_2px_8px_rgba(255,0,156,0.3)]"
                      : "brightness-95 hover:brightness-100"
                  )}
                >
                  <img src={assetSelectMode} className="w-full h-auto" alt="Select Mode" />
                </button>
              </div>

              {/* PAINT BUCKET BUTTON */}
              <div
                style={{
                  transform: `translate(${cfg.paintBucketButton.offsetX}px, ${cfg.paintBucketButton.offsetY}px) scale(${cfg.paintBucketButton.scale})`,
                  transformOrigin: 'center'
                }}
              >
                <button
                  onClick={() => {
                    setIsFillingMode(!isFillingMode);
                    if (!isFillingMode) setActiveLayer('base');
                  }}
                  className={cn(
                    "w-full transition-transform active:scale-95 cursor-pointer border-none bg-transparent p-0",
                    isFillingMode
                      ? "brightness-100 scale-105 filter drop-shadow-[0_2px_8px_rgba(255,0,156,0.3)]"
                      : "brightness-95 hover:brightness-100"
                  )}
                >
                  <img src={assetPaintBucket} className="w-full h-auto" alt="Paint Bucket" />
                </button>
              </div>

              {/* SIZE SLIDER */}
              <div
                className="relative select-none"
                style={{
                  transform: `translate(${cfg.sizeLabel.offsetX}px, ${cfg.sizeLabel.offsetY}px) scale(${cfg.sizeLabel.scale})`,
                  transformOrigin: 'left center',
                  width: '100%',
                  maxWidth: '160px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {/* Visual SVG Slider */}
                <svg 
                  viewBox="0 0 577.91 55.07" 
                  className="w-full h-auto select-none pointer-events-none"
                >
                  <text 
                    fill="blue"
                    fontFamily="Malinton"
                    fontWeight="800"
                    fontSize="50.02px"
                    transform="translate(0 42.52)"
                  >
                    Size
                  </text>
                  <rect fill="#ff009e" x="136.47" y="23.31" width="441.45" height="13.79" rx="6.43" ry="6.43"/>
                  <circle 
                    fill="#a7f417" 
                    cx={155.87 + ((brushSize - 2) / 28) * (558.52 - 155.87)} 
                    cy="29.7" 
                    r="19.4"
                  />
                </svg>

                {/* Interactive Transparent Input Range Overlay */}
                <input
                  type="range"
                  min="2"
                  max="30"
                  value={brushSize}
                  onChange={(e) => setBrushSize(parseInt(e.target.value))}
                  className="absolute top-0 opacity-0 cursor-pointer h-full"
                  style={{
                    left: '23.61%',
                    width: '76.38%',
                    outline: 'none'
                  }}
                />
              </div>



              {/* PRESET COLORS GRID */}
              <div 
                className="flex flex-col gap-1.5 w-full pt-2"
                style={{
                  transform: `translate(${cfg.colorsPalette?.offsetX ?? 0}px, ${cfg.colorsPalette?.offsetY ?? 0}px) scale(${cfg.colorsPalette?.scale ?? 1.0})`,
                  transformOrigin: 'left center'
                }}
              >
                <div className="flex flex-nowrap gap-2 py-1 justify-start items-center">
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
                        "w-6 h-6 rounded-full border-2 transition-all duration-150 hover:scale-110 shadow-sm relative cursor-pointer",
                        brushColor === color.value && !isEraser
                          ? "border-[#0020D7] scale-110 ring-2 ring-[#0020D7]/20"
                          : "border-gray-200"
                      )}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    >
                      {brushColor === color.value && !isEraser && (
                        <span className="absolute inset-1 border border-white rounded-full pointer-events-none" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* ACTION BUTTONS (TRASH, UNDO, REDO) */}
              <div className="flex items-center gap-3 pt-2">
                <div
                  style={{
                    transform: `translate(${cfg.trashIcon.offsetX}px, ${cfg.trashIcon.offsetY}px) scale(${cfg.trashIcon.scale})`,
                    transformOrigin: 'center'
                  }}
                >
                  <button
                    onClick={clearCanvas}
                    className="w-8 h-8 transition-transform hover:scale-110 active:scale-90 cursor-pointer border-none bg-transparent p-0"
                    title="Clear Canvas"
                  >
                    <img src={assetTrashIcon} className="w-full h-full object-contain" alt="Clear" />
                  </button>
                </div>
                <div
                  style={{
                    transform: `translate(${cfg.undoIcon.offsetX}px, ${cfg.undoIcon.offsetY}px) scale(${cfg.undoIcon.scale})`,
                    transformOrigin: 'center'
                  }}
                >
                  <button
                    onClick={undo}
                    disabled={history.length === 0}
                    className="w-8 h-8 transition-transform hover:scale-110 active:scale-90 cursor-pointer border-none bg-transparent p-0 disabled:opacity-30"
                    title="Undo"
                  >
                    <img src={assetUndoIcon} className="w-full h-full object-contain" alt="Undo" />
                  </button>
                </div>
                <div
                  style={{
                    transform: `translate(${cfg.redoIcon.offsetX}px, ${cfg.redoIcon.offsetY}px) scale(${cfg.redoIcon.scale})`,
                    transformOrigin: 'center'
                  }}
                >
                  <button
                    onClick={redo}
                    disabled={redoStack.length === 0}
                    className="w-8 h-8 transition-transform hover:scale-110 active:scale-90 cursor-pointer border-none bg-transparent p-0 disabled:opacity-30"
                    title="Redo"
                  >
                    <img src={assetRedoIcon} className="w-full h-full object-contain" alt="Redo" />
                  </button>
                </div>
              </div>
            </div>

            {/* ILLUSTRATION MASCOT */}
            <div 
              className="hidden md:flex pt-4 self-center justify-center w-full"
              style={{
                transform: `translate(${cfg.mascot.offsetX}px, ${cfg.mascot.offsetY}px) scale(${cfg.mascot.scale})`,
                transformOrigin: 'center'
              }}
            >
              <img
                src={assetCharacter}
                className="w-32 h-auto object-contain select-none"
                alt="Yang Studio Mascot"
              />
            </div>
          </div>

          {/* CANVAS AREA (RIGHT) */}
          <div 
            className="flex-1 relative overflow-visible self-center w-full flex flex-col"
            style={{
              aspectRatio: '1138.09 / 1221.57',
              transform: `translate(${cfg.canvasFrame.offsetX}px, ${cfg.canvasFrame.offsetY}px) scale(${cfg.canvasFrame.scale})`,
              transformOrigin: 'center'
            }}
          >
            {/* Asset 46 Canvas Frame */}
            <div className="absolute inset-0 pointer-events-none z-0">
              <svg 
                viewBox="0 0 1138.09 1221.57" 
                preserveAspectRatio="none" 
                className="w-full h-full select-none"
              >
                <path 
                  fill="#fff" 
                  stroke="blue" 
                  strokeMiterlimit={10} 
                  strokeWidth={6} 
                  d="M61.16,3h1015.76c32.1,0,58.16,26.06,58.16,58.16v1099.25c0,32.1-26.06,58.16-58.16,58.16H61.16c-32.1,0-58.16-26.06-58.16-58.16V61.16C3,29.06,29.06,3,61.16,3Z"
                />
              </svg>
            </div>
            <div 
              ref={wrapperRef} 
              className="absolute bg-white overflow-hidden z-10"
              style={{
                left: '5.37%',
                right: '5.37%',
                top: '5%',
                bottom: '5%',
                borderRadius: '5.1%'
              }}
            >
              <canvas ref={canvasRef} />

              {/* SELECT BASE SHAPE PROMPT OVERLAY */}
              {!selectedBaseShape && (
                <div className="absolute inset-0 bg-white flex flex-col items-center justify-center z-10 p-6 select-none pointer-events-none rounded-[21px]">
                  <div
                    style={{
                      transform: `translate(${cfg.selectBasePrompt.offsetX}px, ${cfg.selectBasePrompt.offsetY}px) scale(${cfg.selectBasePrompt.scale})`,
                      transformOrigin: 'center'
                    }}
                  >
                    <img src={assetSelectBasePrompt} className="w-72 h-auto object-contain" alt="Select Base Shape Prompt" />
                  </div>
                </div>
              )}
            </div>

            {/* GENERATE 3D BUTTON (OVERLAPPING BOTTOM RIGHT) */}
            {selectedBaseShape && (
              <button
                onClick={handleGenerate}
                className="absolute bottom-0 right-0 z-20 transition-transform hover:scale-105 active:scale-95 cursor-pointer border-none bg-transparent p-0"
                title="Generate 3D Model"
                style={{
                  transform: `translate(${cfg.generate3DButton.offsetX}px, ${cfg.generate3DButton.offsetY}px) scale(${cfg.generate3DButton.scale})`,
                  transformOrigin: 'bottom right'
                }}
              >
                <img src={assetGenerate3D} className="w-44 h-auto" alt="Generate 3D" />
              </button>
            )}

            {/* Subtle drawing mode status bar inside canvas */}
            {selectedBaseShape && (
              <div className="absolute bottom-3 left-4 text-gray-400 text-[8px] font-black uppercase tracking-[0.25em] pointer-events-none flex items-center gap-1.5 bg-white/90 px-3 py-1.5 rounded-full border border-gray-100 shadow-sm backdrop-blur-sm">
                <span className={cn("w-1.5 h-1.5 rounded-full", activeLayer === 'detail' ? "bg-[#FF009C]" : "bg-[#0020D7]")} />
                <span>{activeLayer === 'detail' ? "Drawing Details (Clipped)" : "Base Layer Active"}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
