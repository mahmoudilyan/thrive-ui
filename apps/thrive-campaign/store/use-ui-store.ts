import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  activeMenu: string | null;
  setActiveMenu: (menu: string | null) => void;
}

export const useUIStore = create<UIState>(set => ({
  sidebarOpen: true,
  toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
  activeMenu: null,
  setActiveMenu: (menu: string | null) => set({ activeMenu: menu }),
}));
