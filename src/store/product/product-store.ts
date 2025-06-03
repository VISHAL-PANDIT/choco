import { create } from "zustand";

type newProductState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useNewProduct = create<newProductState>((set) => {
    return{
        isOpen: false,
        onOpen: () => set({ isOpen: true }),
        onClose: () => set({ isOpen: false })
    }
});
