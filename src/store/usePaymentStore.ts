import { create } from "zustand";

interface PaymentState {
  isPaymentModalOpen: boolean;
  setPaymentModalOpen: (open: boolean) => void;
  selectedTransaction: any | null;
  setSelectedTransaction: (transaction: any | null) => void;
}

export const usePaymentStore = create<PaymentState>((set) => ({
  isPaymentModalOpen: false,
  setPaymentModalOpen: (open) => set({ isPaymentModalOpen: open }),
  selectedTransaction: null,
  setSelectedTransaction: (transaction) => set({ selectedTransaction: transaction }),
}));
