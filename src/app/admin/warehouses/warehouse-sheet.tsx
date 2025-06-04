import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {  CreateWarehouses } from "@/http/api";
import { toast } from "sonner";

import { useNewProduct } from "@/store/product/product-store";
import CreateWarehousesForm, { FormValue } from "./create-warehouses-form";

const WarehouseSheet = () => {
  const { isOpen, onClose } = useNewProduct();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["create-warehouse"],
    mutationFn: (data: { name: string; pincode: string;  }) =>
      CreateWarehouses(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
      toast("Warehouse has been Created");
      onClose();
    },
  });

  const onSubmit = (values: FormValue) => {
    mutate({
      name: values.name,
      pincode: values.pincode,
    });
  };

  return (
    <div>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Add Warehouse</SheetTitle>
            <SheetDescription>Add a new warehouse to your system</SheetDescription>
          </SheetHeader>
          <CreateWarehousesForm onSubmit={onSubmit} disabled={isPending} />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default WarehouseSheet;
