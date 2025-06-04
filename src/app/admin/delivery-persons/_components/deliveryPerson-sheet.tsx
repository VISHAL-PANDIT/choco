import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDeliveryPersons } from "@/http/api";
import { toast } from "sonner";

import { useNewProduct } from "@/store/product/product-store";
import CreatePersonForm, { FormValue } from "./create-persons-form";

const DeliveryPersonSheet = () => {
  const { isOpen, onClose } = useNewProduct();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["create-delivery-person"],
    mutationFn: (data: { name: string; phone: string; warehouseId: number }) =>
      createDeliveryPersons(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery-persons"] });
      toast("Delivery Person has been Created");
      onClose();
    },
  });

  const onSubmit = (values: FormValue) => {
    mutate({
      name: values.name,
      phone: values.phone,
      warehouseId: values.warehouseId,
    });
  };

  return (
    <div>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Add Delivery Person</SheetTitle>
            <SheetDescription>Add a new Delivery Person</SheetDescription>
          </SheetHeader>
          <CreatePersonForm onSubmit={onSubmit} disabled={isPending} />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default DeliveryPersonSheet;
