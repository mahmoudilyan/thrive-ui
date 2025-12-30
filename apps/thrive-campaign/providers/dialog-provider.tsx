'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { DialogContextType, DialogEntry, DialogConfig } from '@/types/dialog';

export const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const DialogProvider = ({ children }: { children: ReactNode }) => {
  const [dialogStack, setDialogStack] = useState<DialogEntry[]>([]);

  const openDialog = (
    dialogType: string,
    dialogProps: Record<string, any> = {},
    config?: DialogConfig
  ) => {
    setDialogStack(prev => [...prev, { dialogType, dialogProps, config }]);
  };

  const closeDialog = () => {
    setDialogStack(prev => prev.slice(0, -1));
  };

  const closeAllDialogs = () => {
    setDialogStack([]);
  };

  return (
    <DialogContext.Provider 
      value={{ 
        dialogStack, 
        openDialog, 
        closeDialog, 
        closeAllDialogs 
      }}
    >
      {children}
    </DialogContext.Provider>
  );
};

export const useDialog = (): DialogContextType => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
};
