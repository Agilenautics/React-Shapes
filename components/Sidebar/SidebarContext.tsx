// store.tsx
import { create, SetState } from "zustand";

interface LayoutStore {
  isSideBarOpen: boolean;
  setIsSideBarOpen: (isOpen: boolean) => void;
}

const useStore = create<LayoutStore>((set: SetState<LayoutStore>) => ({
  isSideBarOpen: true,
  setIsSideBarOpen: (isOpen: boolean) => set({ isSideBarOpen: isOpen }),
}));

export default useStore;