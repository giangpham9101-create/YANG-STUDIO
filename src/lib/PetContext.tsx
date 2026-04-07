import React, { createContext, useContext, useState, ReactNode } from 'react';

export type PetType = 'bottle' | 'jug' | 'icon' | 'flake' | 'none';

interface PetContextType {
  activePet: PetType;
  setActivePet: (pet: PetType) => void;
  petPosition: { x: number; y: number };
  setPetPosition: (pos: { x: number; y: number }) => void;
}

const PetContext = createContext<PetContextType | undefined>(undefined);

export const PetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activePet, setActivePet] = useState<PetType>('none');
  const [petPosition, setPetPosition] = useState({ x: 0, y: 0 });

  return (
    <PetContext.Provider value={{ activePet, setActivePet, petPosition, setPetPosition }}>
      {children}
    </PetContext.Provider>
  );
};

export const usePet = () => {
  const context = useContext(PetContext);
  if (!context) {
    throw new Error('usePet must be used within a PetProvider');
  }
  return context;
};
