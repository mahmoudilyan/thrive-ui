import { Dialog as ChakraDialog } from '@chakra-ui/react';

export interface DialogConfig extends Omit<ChakraDialog.RootProps, 'children'> {
  closeOnEscape?: boolean;
  closeOnInteractOutside?: boolean;
  lazyMount?: boolean;
  modal?: boolean;
  preventScroll?: boolean;
  role?: 'dialog' | 'alertdialog';
  trapFocus?: boolean;
  unmountOnExit?: boolean;
  colorPalette?: 'gray' | 'red' | 'orange' | 'yellow' | 'green' | 'teal' | 'blue' | 'cyan' | 'purple' | 'pink' | 'accent';
  scrollBehavior?: 'inside' | 'outside';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  motionPreset?: 'scale' | 'slide-in-bottom' | 'slide-in-top' | 'slide-in-left' | 'slide-in-right' | 'none';
  centered?: boolean;
  'aria-label'?: string;
  defaultOpen?: boolean;
}

export interface DialogEntry {
  dialogType: string | null;
  dialogProps: Record<string, any>;
  config?: DialogConfig;
}

export interface DialogContextType {
  dialogStack: DialogEntry[];
  openDialog: (dialogType: string, dialogProps?: Record<string, any>, config?: DialogConfig) => void;
  closeDialog: () => void;
  closeAllDialogs: () => void;
}
