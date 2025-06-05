import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createInventory } from "@/http/api";
import { toast } from "sonner";
import CreateInventoryForm, { FormValue } from "./create-inventory-form";
import { useNewInventory } from "@/store/inventory/inventory-store";

const InventorySheet = () => {
  const { isOpen, onClose } = useNewInventory();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["create-inventory"],
    mutationFn: (data: { sku: string; warehouseId: number; productId: number }) =>
      createInventory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventories"] });
      toast("Inventory has been Created");
      onClose();
    },
  });

  const onSubmit = (values: FormValue) => {
    mutate({
      sku: values.sku,
      warehouseId: values.warehouseId,
      productId: values.productId,
    });
  };

  return (
    <div>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Add Inventory</SheetTitle>
            <SheetDescription>Add a new Inventory</SheetDescription>
          </SheetHeader>
          <CreateInventoryForm onSubmit={onSubmit} disabled={isPending} />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default InventorySheet;
