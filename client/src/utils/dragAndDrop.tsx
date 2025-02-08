import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

// Define the type for the context value
type DnDContextType = [string | null, Dispatch<SetStateAction<string | null>>];

// Create the context with a default value
const DnDContext = createContext<DnDContextType | undefined>(undefined);
// Define the props for the provider component
interface DnDProviderProps {
  children: ReactNode;
}

// Create the provider component
export const DnDProvider: React.FC<DnDProviderProps> = ({ children }) => {
  const [type, setType] = useState<string | null>(null);
  return (
    <DnDContext.Provider value={[type, setType]}>
      {children}
    </DnDContext.Provider>
  );
};

export default DnDContext;

// Create a custom hook for consuming the context
export const useDnD = (): DnDContextType => {
  const context = useContext(DnDContext);
  if (!context) {
    throw new Error('useDnD must be used within a DnDProvider');
  }
  return context;
};
