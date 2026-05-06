import { create } from "zustand";

interface ProductState {
  selectedProduct: any | null;
  setSelectedProduct: (product: any | null) => void;
  filters: any;
  setFilters: (filters: any) => void;
}

export const useProductStore = create<ProductState>((set) => ({
  selectedProduct: null,
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  filters: { fuelType: "ALL" },
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
}));
