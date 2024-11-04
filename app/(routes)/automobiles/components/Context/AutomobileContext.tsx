"use client";
import { createContext, useContext, useState } from 'react';
import { Voiture } from '../ListAutomobiles/ListAutomobiles.type';

interface AutomobileContextType {
  voitures: Voiture[];
  setVoitures: React.Dispatch<React.SetStateAction<Voiture[]>>;
}

const AutomobileContext = createContext<AutomobileContextType | undefined>(undefined);

export const useAutomobileContext = () => {
  const context = useContext(AutomobileContext);
  if (!context) {
    throw new Error('useAutomobileContext must be used within an AutomobileProvider');
  }
  return context;
};

export const AutomobileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [voitures, setVoitures] = useState<Voiture[]>([]);
  
  return (
    <AutomobileContext.Provider value={{ voitures, setVoitures }}>
      {children}
    </AutomobileContext.Provider>
  );
};
