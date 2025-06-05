import { create } from "zustand";

type newInventoryState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useNewInventory = create<newInventoryState>((set) => {
    return{
        isOpen: false,
        onOpen: () => set({ isOpen: true }),
        onClose: () => set({ isOpen: false })
    }
});
