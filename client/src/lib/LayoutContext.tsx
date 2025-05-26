import React, { createContext, useContext, ReactNode } from 'react';

type LayoutType = 'dashboard' | 'moderator';

interface LayoutContextType {
  layoutType: LayoutType;
  setLayoutType: (type: LayoutType) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

interface LayoutProviderProps {
  children: ReactNode;
  layoutType?: LayoutType;
}

export function LayoutProvider({ children, layoutType = 'dashboard' }: LayoutProviderProps) {
  const [currentLayoutType, setCurrentLayoutType] = React.useState<LayoutType>(layoutType);

  const value = {
    layoutType: currentLayoutType,
    setLayoutType: setCurrentLayoutType,
  };

  return (
    <LayoutContext.Provider value={value}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}

// Hook to determine layout type from URL
export function useLayoutFromUrl(): LayoutType {
  const pathname = window.location.pathname;
  return pathname.startsWith('/dashboard/moderator/') ? 'moderator' : 'dashboard';
} 