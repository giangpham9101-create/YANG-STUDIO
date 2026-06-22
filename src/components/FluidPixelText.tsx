import React, { useEffect, useRef } from 'react';
import { usePet } from '../lib/PetContext';

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  color: string;
  size: number;
  vx: number;
  vy: number;
  friction: number;
  ease: number;
  isConsumed?: boolean;
}

interface TextLine {
  text: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  offsetY: number;
  isItalic?: boolean;
}

interface FluidPixelTextProps {
  lines: TextLine[];
  className?: string;
  interactRadius?: number;
}

const FluidPixelText: React.FC<FluidPixelTextProps> = ({ 
  lines, 
  className,
  interactRadius = 120
}) => {
  const { activePet, petPosition } = usePet();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const mouse = useRef({ x: 0, y: 0, radius: interactRadius });
  const animationFrameId = useRef<number | null>(null);

  // Sử dụng refs để giữ cho vòng lặp animate luôn được cập nhật mà không cần chạy lại useEffect
  const petRef = useRef({ activePet, petPosition });
  useEffect(() => {
    petRef.current = { activePet, petPosition };
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const initParticles = () => {
      if (canvas.width === 0 || canvas.height === 0) return;
      
      particles.current = [];
      const offscreenCanvas = document.createElement('canvas');
      const offscreenCtx = offscreenCanvas.getContext('2d')!;
      
      offscreenCanvas.width = canvas.width;
      offscreenCanvas.height = canvas.height;
      
      offscreenCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
      
      lines.forEach((line) => {
        offscreenCtx.fillStyle = line.color;
        const fontStyle = line.isItalic ? 'italic' : 'normal';
        const fontWeight = (line.fontFamily.includes('Archivo') || line.fontFamily.includes('FSEX300')) ? '900' : '400';
        offscreenCtx.font = `${fontStyle} ${fontWeight} ${line.fontSize}px "${line.fontFamily}", sans-serif`;
        offscreenCtx.textAlign = 'center';
        offscreenCtx.textBaseline = 'middle';
        
        const yPos = offscreenCanvas.height / 2 + line.offsetY;
        offscreenCtx.fillText(line.text, offscreenCanvas.width / 2, yPos);
      });

      const pixels = offscreenCtx.getImageData(0, 0, offscreenCanvas.width, offscreenCanvas.height).data;
      const step = 4; 

      for (let y = 0; y < offscreenCanvas.height; y += step) {
        for (let x = 0; x < offscreenCanvas.width; x += step) {
          const index = (y * offscreenCanvas.width + x) * 4;
          const alpha = pixels[index + 3];

          if (alpha > 128) {
            const r = pixels[index];
            const g = pixels[index + 1];
            const b = pixels[index + 2];
            const color = `rgb(${r},${g},${b})`;

            particles.current.push({
              x: x, 
              y: y,
              originX: x,
              originY: y,
              color: color,
              size: Math.random() * 2 + 2,
              vx: 0,
              vy: 0,
              friction: 0.94,
              ease: 0.08,
              isConsumed: false
            });
          }
        }
      }
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const loadFontsAndInit = async () => {
      // Khởi tạo lần đầu với bất kỳ thứ gì có sẵn
      resize();
      
      try {
        const families = Array.from(new Set(lines.map(l => l.fontFamily)));
        await Promise.all(families.map(f => document.fonts.load(`100px "${f}"`)));
        // Khởi tạo lại sau khi font chữ thực sự được tải xong
        initParticles();
      } catch (err) {
        console.warn("Font loading failed, using fallback", err);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current.forEach(p => {
        if (p.isConsumed) return; // Bỏ qua việc vẽ và xử lý logic cho các hạt đã bị "ăn"

        const dx = mouse.current.x - p.x;
        const dy = mouse.current.y - p.y;
        const distanceSq = dx * dx + dy * dy;
        const distance = Math.sqrt(distanceSq);

        if (distance < mouse.current.radius) {
          const force = (mouse.current.radius - distance) / mouse.current.radius;
          const forceX = dx / distance;
          const forceY = dy / distance;
          p.vx -= (forceX * force * 12);
          p.vy -= (forceY * force * 12);
        }

        // --- MỚI: Logic Hút Của Thú Cưng ---
        const { activePet, petPosition } = petRef.current;
        if (activePet !== 'none') {
          const pdx = petPosition.x - p.x;
          const pdy = petPosition.y - p.y;
          const pDistSq = pdx * pdx + pdy * pdy;
          const pDist = Math.sqrt(pDistSq);
          const pRadius = 180; // Phạm vi hút

          if (pDist < pRadius) {
            const pForce = (pRadius - pDist) / pRadius;
            const pForceX = pdx / pDist;
            const pForceY = pdy / pDist;
            
            // --- MỚI: Logic tiêu thụ/ăn hạt ---
            if (pDist < 30) {
              p.isConsumed = true;
              return;
            }
            // ------------------------------

            // Lực kéo về tâm (tương tự lực ma sát ngược)
            p.vx += (pForceX * pForce * 18);
            p.vy += (pForceY * pForce * 18);
          }
        }
        // ------------------------------

        p.vx += (p.originX - p.x) * p.ease;
        p.vy += (p.originY - p.y) * p.ease;
        p.vx *= p.friction;
        p.vy *= p.friction;
        p.x += p.vx;
        p.y += p.vy;

        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    
    loadFontsAndInit();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [lines, interactRadius]);

  return (
    <div className={className} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <canvas 
        ref={canvasRef} 
        style={{ 
          display: 'block', 
          width: '100%', 
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0
        }} 
      />
    </div>
  );
};

export default FluidPixelText;
