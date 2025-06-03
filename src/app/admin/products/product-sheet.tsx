import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle,  } from "@/components/ui/sheet";
import React from "react";
import CreateProductForm, { FormValue } from "./create-product-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct } from "@/http/api";
import { useNewProduct } from "@/store/product/product-store";



const ProductSheet = () => {
    const {isOpen , onClose} = useNewProduct()
    const queryClient = useQueryClient() 

    const {mutate , isPending}  = useMutation({
        mutationKey: ["create-product"],
        mutationFn: (data : FormData) => createProduct(data),
        onSuccess: ()=>{
            queryClient.invalidateQueries({queryKey: ["products"]});
            alert("Product Created!");
            onClose();
        }
    })

    const onSubmit = (values: FormValue) => {
        const formData = new FormData()
        formData.append("name", values.name)
        formData.append("description", values.description)
        formData.append("price", String(values.price))
        
        // Handle the file properly
        const imageFile = values.image instanceof FileList ? values.image[0] : values.image;
        if (imageFile) {
            formData.append("image", imageFile);
        }

        mutate(formData)
    }

    return (
        <div>
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent side="right">
                    <SheetHeader>
                        <SheetTitle>Create Product</SheetTitle>
                        <SheetDescription>
                            Create a new product
                        </SheetDescription>
                    </SheetHeader>
                    <CreateProductForm onSubmit={onSubmit} disabled={isPending}/>
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default ProductSheet;
