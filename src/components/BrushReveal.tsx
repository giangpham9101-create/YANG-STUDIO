import React, { useRef, useEffect, useState } from 'react';

interface BrushRevealProps {
  children: React.ReactNode;
  coverColor?: string;
  brushSize?: number;
  className?: string;
}

export default function BrushReveal({ 
  children, 
  coverColor = '#121212', 
  brushSize = 40,
  className = "" 
}: BrushRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const lastMoveTime = useRef<number>(Date.now());
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      
      // Initial fill
      ctx.fillStyle = coverColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add some "frosted plastic" texture
      ctx.globalAlpha = 0.05;
      for (let i = 0; i < 1000; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? '#ffffff' : '#000000';
        ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
      }
      ctx.globalAlpha = 1.0;
      setIsInitialized(true);
    };

    resize();
    window.addEventListener('resize', resize);

    // Healing logic
    const healInterval = setInterval(() => {
      if (Date.now() - lastMoveTime.current > 5000) {
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 0.02;
        ctx.fillStyle = coverColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1.0;
      }
    }, 100);

    return () => {
      window.removeEventListener('resize', resize);
      clearInterval(healInterval);
    };
  }, [coverColor]);

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
      className={`relative overflow-hidden group ${className}`}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setIsHovering(true)}
      onPointerLeave={() => {
        setIsHovering(false);
        setMousePos({ x: -100, y: -100 });
      }}
    >
      {/* Background Image/Content */}
      <div className="w-full h-full">
        {children}
      </div>

      {/* Canvas Cover Layer */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-300"
        style={{ opacity: isInitialized ? 1 : 0 }}
      />

      {/* Acid Green Spark/Glow at Cursor */}
      {isHovering && (
        <div 
          className="absolute z-20 pointer-events-none w-4 h-4 bg-acid rounded-full blur-sm animate-pulse"
          style={{ 
            left: mousePos.x, 
            top: mousePos.y,
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 15px #D1FF00'
          }}
        />
      )}
    </div>
  );
}
