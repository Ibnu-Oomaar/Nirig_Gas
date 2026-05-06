import { create } from "zustand";

interface TransactionState {
  cart: any[];
  addToCart: (item: any) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  selectedCustomer: any | null;
  setSelectedCustomer: (customer: any | null) => void;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  cart: [],
  addToCart: (item) => set((state) => ({ cart: [...state.cart, item] })),
  removeFromCart: (productId) => set((state) => ({ cart: state.cart.filter(i => i.productId !== productId) })),
  clearCart: () => set({ cart: [] }),
  selectedCustomer: null,
  setSelectedCustomer: (customer) => set({ selectedCustomer: customer }),
}));
