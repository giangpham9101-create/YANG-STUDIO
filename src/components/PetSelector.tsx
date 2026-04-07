import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePet, PetType } from '../lib/PetContext';

const PET_OPTIONS: { type: PetType; label: string; icon: React.ReactNode }[] = [
  { 
    type: 'bottle', 
    label: 'BOTTI (PET)', 
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M9 3h6v3H9V3zM7 6h10v13a2 2 0 01-2 2H9a2 2 0 01-2-2V6zM9 10h6M9 14h6" />
      </svg>
    ) 
  },
  { 
    type: 'jug', 
    label: 'CRUSH (HDPE)', 
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M6 3h12l1 4h2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7h2l1-4zM6 10h12M6 14h12" />
      </svg>
    ) 
  },
  { 
    type: 'icon', 
    label: 'LOOP (RECYCLE)', 
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ) 
  },
  { 
    type: 'flake', 
    label: 'FLAKY (P6)', 
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 4l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4z" />
      </svg>
    ) 
  },
];

const PetSelector: React.FC = () => {
  const { activePet, setActivePet } = usePet();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-[10000] flex flex-col items-end gap-3 pointer-events-auto">
      {/* Selector Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="flex flex-col gap-2 mb-2 p-2 bg-black brutalist-border shadow-[4px_4px_0px_rgba(218,255,0,1)]"
          >
            <div className="text-[10px] text-neon-green font-mono px-2 mb-1 border-b border-neon-green/30 pb-1">
              CHOOSE COMPANION
            </div>
            {PET_OPTIONS.map((opt) => (
              <button
                key={opt.type}
                onClick={() => {
                  setActivePet(opt.type);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-3 px-3 py-2 text-xs font-mono transition-colors border border-transparent hover:border-neon-green hover:bg-neon-green/10 ${
                  activePet === opt.type ? 'bg-neon-green text-black' : 'text-white'
                }`}
              >
                <span>{opt.icon}</span>
                <span>{opt.label}</span>
              </button>
            ))}
            <button
              onClick={() => {
                setActivePet('none');
                setIsOpen(false);
              }}
              className="flex items-center gap-3 px-3 py-2 text-xs font-mono text-neon-pink hover:bg-neon-pink/10 border border-transparent hover:border-neon-pink mt-1"
            >
              <span>🚫</span>
              <span>DISMISS ALL</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Trigger */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-black text-neon-green border-2 border-neon-green flex items-center justify-center shadow-[4px_4px_0px_#D1FF00] hover:shadow-none transition-all shadow-[0_0_15px_rgba(209,255,0,0.2)]"
      >
        <span className="text-xl">
          {isOpen ? '✖' : (
            <svg className="w-6 h-6 animate-[spin_10s_linear_infinity]" fill="none" stroke="#D1FF00" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )}
        </span>
      </motion.button>
    </div>
  );
};

export default PetSelector;
