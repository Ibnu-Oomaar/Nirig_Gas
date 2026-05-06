import { create } from "zustand";

interface UserState {
  selectedUser: any | null;
  setSelectedUser: (user: any | null) => void;
  isCreateModalOpen: boolean;
  setCreateModalOpen: (open: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  selectedUser: null,
  setSelectedUser: (user) => set({ selectedUser: user }),
  isCreateModalOpen: false,
  setCreateModalOpen: (open) => set({ isCreateModalOpen: open }),
}));
