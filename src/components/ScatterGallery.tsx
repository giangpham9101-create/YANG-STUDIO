import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { RefreshCw, Plus, Quote, Camera } from 'lucide-react';
import { cn } from '../lib/utils';

import img1 from '../assets/anhonhiem/o1.jpg';
import img2 from '../assets/anhonhiem/o2.jpg';
import img3 from '../assets/anhonhiem/o3.webp';
import img4 from '../assets/anhonhiem/o4.webp';
import img5 from '../assets/anhonhiem/o5.jpg';
import img6 from '../assets/anhonhiem/o6.webp';
import img7 from '../assets/anhonhiem/o7.webp';
import img8 from '../assets/anhonhiem/o8.jpg';


interface CardData {
  id: string;
  type: 'text' | 'image';
  content: string;
  subtext?: string;
  image?: string;
  color?: string;
  initialPos: { x: number; y: number; rotate: number };
}

const CARDS: CardData[] = [
  {
    id: '1',
    type: 'text',
    content: 'WASTE IS A RESOURCE',
    subtext: 'RE_MOLD // PROTOCOL_01',
    color: 'bg-acid',
    initialPos: { x: -350, y: -200, rotate: -8 }
  },
  {
    id: '2',
    type: 'image',
    content: 'POLLUTION_SCAN_01',
    image: img2,
    initialPos: { x: 50, y: -250, rotate: 5 }
  },
  {
    id: '3',
    type: 'text',
    content: '100% RECYCLED PET',
    subtext: 'BOTTLE_REBIRTH_SYS',
    color: 'bg-black text-white',
    initialPos: { x: 400, y: -150, rotate: -12 }
  },
  {
    id: '4',
    type: 'image',
    content: 'WASTE_TEXTURE_V.2',
    image: img4,
    initialPos: { x: -100, y: 50, rotate: 10 }
  },
  {
    id: '5',
    type: 'text',
    content: 'CIRCULAR DESIGN',
    subtext: 'NO_WASTE_LEFT_BEHIND',
    color: 'bg-burnt-orange text-white',
    initialPos: { x: -450, y: 150, rotate: 6 }
  },
  {
    id: '6',
    type: 'image',
    content: 'PROCESS_ANomaly',
    image: img6,
    initialPos: { x: 250, y: 50, rotate: -5 }
  },
  {
    id: '7',
    type: 'text',
    content: 'REBUILD THE SYSTEM',
    subtext: 'PLASTIC_PEOPLE_LAB',
    color: 'bg-warning text-white',
    initialPos: { x: 150, y: 250, rotate: 8 }
  },
  {
    id: '8',
    type: 'image',
    content: 'MATERIAL_ARCHIVE',
    image: img8,
    initialPos: { x: -300, y: 300, rotate: -10 }
  }

];

const ScatterCard = ({ card, topZ, setTopZ }: { card: CardData; topZ: number; setTopZ: (z: number) => void }) => {
  const [zIndex, setZIndex] = useState(1);
  const [position] = useState(card.initialPos);
  const [hasTape] = useState(Math.random() > 0.5);
  const [tapePos] = useState({
    top: Math.random() > 0.5 ? -10 : 'auto',
    bottom: Math.random() > 0.5 ? 'auto' : -10,
    left: Math.random() > 0.5 ? -20 : 'auto',
    right: Math.random() > 0.5 ? 'auto' : -20,
    rotate: Math.random() * 40 - 20
  });

  const handleDragStart = () => {
    const newZ = topZ + 1;
    setZIndex(newZ);
    setTopZ(newZ);
  };

  return (
    <motion.div
      drag
      dragConstraints={{ left: -800, right: 800, top: -500, bottom: 500 }}
      onDragStart={handleDragStart}
      initial={{ 
        x: card.initialPos.x, 
        y: card.initialPos.y, 
        rotate: card.initialPos.rotate,
        opacity: 0,
        scale: 0.8
      }}
      animate={{ 
        rotate: card.initialPos.rotate,
        opacity: 1,
        scale: 1,
        zIndex: zIndex
      }}
      whileHover={{ 
        scale: 1.02, 
        zIndex: topZ + 1,
        boxShadow: "20px 20px 0px 0px rgba(0,0,0,0.15)"
      }}
      whileTap={{ scale: 0.98, cursor: 'grabbing' }}
      transition={{ type: 'spring', stiffness: 150, damping: 25 }}
      className={cn(
        "absolute cursor-grab active:cursor-grabbing brutalist-border p-4 select-none shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]",
        card.type === 'text' ? cn("w-[340px] min-h-[220px]", card.color) : "w-[400px] bg-white"
      )}
    >
      {/* Decorative Tape Element */}
      {hasTape && (
        <div 
          className="absolute w-24 h-8 bg-amber-900/20 backdrop-blur-sm z-50 pointer-events-none border border-white/10"
          style={{
            top: tapePos.top,
            bottom: tapePos.bottom,
            left: tapePos.left,
            right: tapePos.right,
            transform: `rotate(${tapePos.rotate}deg)`
          }}
        />
      )}

      {card.type === 'image' ? (
        <div className="space-y-4">
          <div className="aspect-[4/5] bg-gray-100 overflow-hidden brutalist-border border-black">
            <img 
              src={card.image} 
              alt={card.content} 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-105 hover:scale-100" 
              draggable="false"
            />
          </div>
          <div className="flex justify-between items-center px-1">
            <span className="font-mono text-[10px] font-black tracking-[0.2em] uppercase">{card.content}</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[8px] opacity-30">SCAN_0{card.id}</span>
              <Camera size={14} className="text-gray-400" />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full justify-between gap-12 p-2">
          <div className="flex justify-between items-start">
            <Quote size={24} className="opacity-10" />
            <div className="bg-black/10 px-2 py-1 rounded-sm">
              <span className="font-mono text-[9px] font-black tracking-widest uppercase">/RE_MOLD</span>
            </div>
          </div>
          <h3 className="font-display text-4xl uppercase leading-none tracking-tighter">
            {card.content}
          </h3>
          <div className="pt-4 border-t border-black/20 flex justify-between items-center">
            <span className="font-mono text-[9px] font-black tracking-widest uppercase opacity-60">{card.subtext}</span>
            <Plus size={14} />
          </div>
        </div>
      )}
    </motion.div>
  );
};

const ScatterGallery: React.FC = () => {
  const [topZ, setTopZ] = useState(10);
  const [key, setKey] = useState(0);

  const shuffle = () => {
    setKey(prev => prev + 1);
  };

  return (
    <section className="relative min-h-screen w-full bg-[#f8f8f8] overflow-hidden flex items-center justify-center border-t-4 border-black">
      {/* Noise Texture */}
      <div className="absolute inset-0 noise-overlay opacity-[0.04] pointer-events-none z-10"></div>
      
      {/* Billboard Text - RE_mould */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <motion.h2 
          key={key}
          initial={{ opacity: 0, scale: 0.85, rotate: -2 }}
          animate={{ opacity: 0.1, scale: 1, rotate: 0 }}
          className="font-display text-[28vw] uppercase leading-none text-transparent tracking-tighter select-none whitespace-nowrap"
          style={{ 
            WebkitTextStroke: '3px #000',
          }}
        >
          RE_mould
        </motion.h2>
      </div>

      {/* Industrial Grid Lines */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-10">
        {[...Array(6)].map((_, i) => (
          <div key={`h-${i}`} className="absolute w-full h-[1px] bg-black" style={{ top: `${(i + 1) * 16.6}%` }}></div>
        ))}
        {[...Array(6)].map((_, i) => (
          <div key={`v-${i}`} className="absolute h-full w-[1px] bg-black" style={{ left: `${(i + 1) * 16.6}%` }}></div>
        ))}
      </div>

      {/* Draggable Cards Container */}
      <div className="relative w-full h-full max-w-[1600px] flex items-center justify-center">
        {CARDS.map((card) => (
          <ScatterCard 
            key={`${key}-${card.id}`} 
            card={{
              ...card,
              initialPos: {
                x: card.initialPos.x + (Math.random() * 100 - 50),
                y: card.initialPos.y + (Math.random() * 100 - 50),
                rotate: card.initialPos.rotate + (Math.random() * 14 - 7)
              }
            }} 
            topZ={topZ} 
            setTopZ={setTopZ} 
          />
        ))}
      </div>

      {/* Scatter Control */}
      <div className="absolute bottom-16 right-16 z-50">
        <button 
          onClick={shuffle}
          className="group flex items-center gap-6 bg-acid border-2 border-black px-8 py-5 hover:bg-black hover:text-white transition-all shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-none translate-x-[-6px] translate-y-[-6px] hover:translate-x-0 hover:translate-y-0"
        >
          <span className="font-display text-2xl uppercase tracking-[0.2em]">Shuffle_Lab</span>
          <RefreshCw size={24} className="group-hover:rotate-180 transition-transform duration-1000" />
        </button>
      </div>

      {/* Footer Instructions */}
      <div className="absolute bottom-16 left-16 z-50 pointer-events-none">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-[2px] bg-black"></div>
            <div className="font-mono text-[10px] text-black font-bold uppercase tracking-[0.3em]">
              SYSTEM_GALLERY_V2.5
            </div>
          </div>
          <div className="font-display text-lg uppercase text-black/60 tracking-tight">
            Drag to explore the archive
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScatterGallery;
