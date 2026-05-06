import { create } from "zustand";

interface AlertState {
  isAlertSidebarOpen: boolean;
  setAlertSidebarOpen: (open: boolean) => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  isAlertSidebarOpen: false,
  setAlertSidebarOpen: (open) => set({ isAlertSidebarOpen: open }),
}));
