import { create } from "zustand";

interface DescSidebarStore {
  isDescSidebarOpen: boolean;
  openDescSidebar: () => void;
  closeDescSidebar: () => void;
}

export const useDescSidebarStore = create<DescSidebarStore>((set) => ({
  isDescSidebarOpen: false,
  openDescSidebar: () => set({ isDescSidebarOpen: true }),
  closeDescSidebar: () => set({ isDescSidebarOpen: false }),
}));
