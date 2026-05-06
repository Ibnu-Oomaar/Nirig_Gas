import { create } from "zustand";

interface CustomerState {
  selectedCustomer: any | null;
  setSelectedCustomer: (customer: any | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useCustomerStore = create<CustomerState>((set) => ({
  selectedCustomer: null,
  setSelectedCustomer: (customer) => set({ selectedCustomer: customer }),
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
