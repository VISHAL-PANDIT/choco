import { create } from "zustand";

type newWarehouseState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useNewWarehouse = create<newWarehouseState>((set) => {
    return{
        isOpen: false,
        onOpen: () => set({ isOpen: true }),
        onClose: () => set({ isOpen: false })
    }
});
