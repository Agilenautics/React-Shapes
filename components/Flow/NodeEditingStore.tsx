import { create } from "zustand";

// Define the type for the editingNodeId store
type EditingNodeIdStore = {
  editingNodeId: string | null;
  setEditingNodeId: (id: string | null) => void;
};

// Create the store for editingNodeId
export const useEditingNodeId = create<EditingNodeIdStore>((set) => ({
  editingNodeId: null,
  setEditingNodeId: (id) => set({ editingNodeId: id }),
}));
