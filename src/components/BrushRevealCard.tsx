import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface BrushRevealCardProps {
  children: React.ReactNode;
  className?: string;
  coverColor?: string;
  brushSize?: number;
  healDelay?: number; // ms before healing starts
  healRate?: number; // alpha to add per frame
}

export default function BrushRevealCard({
  children,
  className,
  coverColor = '#121212', // Charcoal Black
  brushSize = 60,
  healDelay = 3000,
  healRate = 0.005,
}: BrushRevealCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const lastMoveTime = useRef(Date.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      // Initial fill
      ctx.fillStyle = coverColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add some "frosted" texture
      ctx.globalAlpha = 0.1;
      for (let i = 0; i < 1000; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? '#ffffff' : '#000000';
        ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
      }
      ctx.globalAlpha = 1.0;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let animationFrameId: number;

    const render = () => {
      const now = Date.now();
      
      // Healing effect
      if (now - lastMoveTime.current > healDelay) {
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = healRate;
        ctx.fillStyle = coverColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1.0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [coverColor, healDelay, healRate]);

  const handlePointerMove = (e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePos({ x, y });
    lastMoveTime.current = Date.now();

    // Erase logic
    ctx.globalCompositeOperation = 'destination-out';
    
    // Soft brush using radial gradient
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, brushSize);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, brushSize, 0, Math.PI * 2);
    ctx.fill();
  };

  return (
    <div 
      ref={containerRef}
      className={cn("relative overflow-hidden group", className)}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => {
        setIsHovered(false);
        setMousePos({ x: -100, y: -100 });
      }}
    >
      {/* Background Image/Content */}
      <div className="relative z-0 w-full h-full">
        {children}
      </div>

      {/* Canvas Cover */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 pointer-events-none w-full h-full"
      />

      {/* Acid Green Glow at Cursor */}
      {isHovered && (
        <div 
          className="absolute z-20 pointer-events-none w-4 h-4 bg-acid rounded-full blur-sm mix-blend-screen opacity-80"
          style={{ 
            left: mousePos.x, 
            top: mousePos.y,
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 15px #D1FF00, 0 0 30px #D1FF00'
          }}
        />
      )}
    </div>
  );
}
