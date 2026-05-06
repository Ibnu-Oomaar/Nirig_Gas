import { create } from "zustand";

interface ExpenseState {
  isExpenseModalOpen: boolean;
  setExpenseModalOpen: (open: boolean) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export const useExpenseStore = create<ExpenseState>((set) => ({
  isExpenseModalOpen: false,
  setExpenseModalOpen: (open) => set({ isExpenseModalOpen: open }),
  selectedCategory: "ALL",
  setSelectedCategory: (category) => set({ selectedCategory: category }),
}));
