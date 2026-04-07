import React, { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import * as fabric from "fabric";

interface SketchCanvasProps {
  onPathsUpdate: (paths: any[]) => void;
  tool: "brush" | "eraser";
}

export interface SketchCanvasRef {
  clear: () => void;
}

const SketchCanvas = forwardRef<SketchCanvasRef, SketchCanvasProps>(({ onPathsUpdate, tool }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);

  useImperativeHandle(ref, () => ({
    clear: () => {
      if (fabricRef.current) {
        fabricRef.current.clear();
      }
    }
  }));

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Fabric Canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
      isDrawingMode: true,
      width: 600,
      height: 600,
      backgroundColor: "transparent",
    });

    fabricRef.current = canvas;

    // Configure Brush
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    canvas.freeDrawingBrush.width = 10;
    canvas.freeDrawingBrush.color = "#000000";

    // Handle path creation
    canvas.on("path:created", (e: any) => {
      // We'll send all paths to the parent to convert to 3D
      const allPaths = canvas.getObjects("path").map((obj: any) => {
        return {
          path: obj.path,
          width: obj.width,
          height: obj.height,
          left: obj.left,
          top: obj.top,
          scaleX: obj.scaleX,
          scaleY: obj.scaleY,
        };
      });
      onPathsUpdate(allPaths);
    });

    // Resize observer to keep canvas responsive
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        canvas.setDimensions({ width, height });
        canvas.renderAll();
      }
    });

    if (canvasRef.current.parentElement) {
      resizeObserver.observe(canvasRef.current.parentElement);
    }

    return () => {
      canvas.dispose();
      resizeObserver.disconnect();
    };
  }, []);

  // Update tool
  useEffect(() => {
    if (!fabricRef.current) return;
    const canvas = fabricRef.current;

    if (tool === "eraser") {
      canvas.freeDrawingBrush.color = "#ffffff";
      canvas.freeDrawingBrush.width = 20;
    } else {
      canvas.freeDrawingBrush.color = "#000000";
      canvas.freeDrawingBrush.width = 10;
    }
  }, [tool]);

  return (
    <div className="w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
});

export default SketchCanvas;
