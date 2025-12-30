'use client';

import { useContext } from 'react';
import { DialogContext } from '@/providers/dialog-provider';
import type { DialogContextType, DialogConfig } from '@/types/dialog';

interface UseCustomDialogReturn extends Omit<DialogContextType, 'dialogStack'> {
  dialogType: string | null;
  dialogProps: Record<string, any>;
  dialogConfig: DialogConfig | undefined;
}

export const useCustomDialog = (): UseCustomDialogReturn => {
  const context = useContext(DialogContext);
  
  if (!context) {
    throw new Error('useCustomDialog must be used within a DialogProvider');
  }

  const currentDialog = context.dialogStack[context.dialogStack.length - 1];
  
  return {
    openDialog: context.openDialog,
    dialogType: currentDialog?.dialogType ?? null,
    dialogProps: currentDialog?.dialogProps ?? {},
    dialogConfig: currentDialog?.config,
    closeDialog: context.closeDialog,
    closeAllDialogs: context.closeAllDialogs,
  };
};
