import { create } from "zustand";

interface InventoryState {
  isMovementModalOpen: boolean;
  setMovementModalOpen: (open: boolean) => void;
  selectedMovement: any | null;
  setSelectedMovement: (movement: any | null) => void;
}

export const useInventoryStore = create<InventoryState>((set) => ({
  isMovementModalOpen: false,
  setMovementModalOpen: (open) => set({ isMovementModalOpen: open }),
  selectedMovement: null,
  setSelectedMovement: (movement) => set({ selectedMovement: movement }),
}));
