import { create } from "zustand";

interface ShiftState {
  isShiftModalOpen: boolean;
  setShiftModalOpen: (open: boolean) => void;
  shiftNotes: string;
  setShiftNotes: (notes: string) => void;
}

export const useShiftStore = create<ShiftState>((set) => ({
  isShiftModalOpen: false,
  setShiftModalOpen: (open) => set({ isShiftModalOpen: open }),
  shiftNotes: "",
  setShiftNotes: (notes) => set({ shiftNotes: notes }),
}));
