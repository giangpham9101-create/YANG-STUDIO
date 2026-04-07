import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';
import { usePet, PetType } from '../lib/PetContext';

// Assets
import bottleImg from '../assets/pets/bottle.png';
import jugImg from '../assets/pets/jug.png';

const CursorPet: React.FC = () => {
  const { activePet, setPetPosition } = usePet();
  const [isClicking, setIsClicking] = useState(false);
  
  // Mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for "chasing" feel
  const springConfig = { damping: 25, stiffness: 150 };
  const petX = useSpring(mouseX, springConfig);
  const petY = useSpring(mouseY, springConfig);

  // Rotation based on movement direction
  const rotate = useMotionValue(0);

  useEffect(() => {
    if (activePet === 'none') return;

    const handleMouseMove = (e: MouseEvent) => {
      // Offset so pet follows slightly behind and above cursor
      mouseX.set(e.clientX + 20);
      mouseY.set(e.clientY - 40);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Broadcast position to Context for particle interaction
    const unsubscribeX = petX.on('change', (val) => {
      setPetPosition({ x: val, y: petY.get() });
    });
    const unsubscribeY = petY.on('change', (val) => {
      setPetPosition({ x: petX.get(), y: val });
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      unsubscribeX();
      unsubscribeY();
    };
  }, [activePet, mouseX, mouseY, petX, petY, setPetPosition]);

  if (activePet === 'none') return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <motion.div
        style={{ x: petX, y: petY, rotate }}
        className="relative w-16 h-16 flex items-center justify-center"
      >
        <motion.div
          whileTap={{ scale: 1.4 }}
          animate={{ 
            y: [0, -5, 0],
            rotate: [activePet === 'icon' ? 0 : -2, activePet === 'icon' ? 360 : 2, activePet === 'icon' ? 720 : -2]
          }}
          transition={{ 
            y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            rotate: activePet === 'icon' ? { duration: 4, repeat: Infinity, ease: "linear" } : { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
          className="w-full h-full flex items-center justify-center drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]"
        >
          {activePet === 'bottle' && (
            <img src={bottleImg} alt="Bottle Pet" className="w-full h-full object-contain" />
          )}
          {activePet === 'jug' && (
            <img src={jugImg} alt="Jug Pet" className="w-full h-full object-contain" />
          )}
          {activePet === 'icon' && (
            <svg viewBox="0 0 100 100" className="w-full h-full text-neon-green fill-current">
              <path d="M50 10L90 30V70L50 90L10 70V30L50 10ZM50 20L20 35V65L50 80L80 65V35L50 20Z" />
              <path d="M45 40H55V60H45V40Z" />
            </svg>
          )}
          {activePet === 'flake' && (
            <div className="relative w-full h-full">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    x: [0, (i - 2) * 10, 0],
                    y: [0, (i % 2 === 0 ? 10 : -10), 0],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ duration: 2 + i, repeat: Infinity }}
                  className={`absolute w-4 h-4 brutalist-border ${['bg-neon-green', 'bg-neon-pink', 'bg-neon-blue', 'bg-acid-orange'][i % 4]}`}
                  style={{ top: '40%', left: '40%' }}
                />
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CursorPet;
