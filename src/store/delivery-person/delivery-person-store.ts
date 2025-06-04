import { create } from "zustand";

type newDeliveryPersonState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useNewDeliveryPerson = create<newDeliveryPersonState>((set) => {
    return{
        isOpen: false,
        onOpen: () => set({ isOpen: true }),
        onClose: () => set({ isOpen: false })
    }
});
