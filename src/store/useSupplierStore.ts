import { create } from "zustand";

interface SupplierState {
  selectedSupplier: any | null;
  setSelectedSupplier: (supplier: any | null) => void;
  isAddModalOpen: boolean;
  setAddModalOpen: (open: boolean) => void;
}

export const useSupplierStore = create<SupplierState>((set) => ({
  selectedSupplier: null,
  setSelectedSupplier: (supplier) => set({ selectedSupplier: supplier }),
  isAddModalOpen: false,
  setAddModalOpen: (open) => set({ isAddModalOpen: open }),
}));
