

// AppContext.tsx
import React, { createContext, useContext,useState, ReactNode } from 'react';

interface isOwnerProviderProps {
  isOwner: boolean;
  setisOwner: (value: boolean) => void;
}

export const OwnerContext = createContext<isOwnerProviderProps>({
  isOwner: false,
  setisOwner: () => {},
});
export const IsOwnerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOwner, setisOwner] = useState<boolean>(false);

  return (
    <OwnerContext.Provider value={{ isOwner, setisOwner}}>
      {children}
    </OwnerContext.Provider>
  );
};

export const useSession = () => {
    const context = useContext(OwnerContext);
    if (!context) throw new Error('useSession must be used within a SessionProvider');
    return context;
  };



