"use client";

import { Button } from "@/components/ui/button";
import { columns } from "./Columns";
import { DataTable } from "./data-table";
import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "@/http/api";
import { Product } from "@/types";
import ProductSheet from "./product-sheet";
import { useNewProduct } from "@/store/product/product-store";

const ProductsPage = () => {
  const {onOpen} = useNewProduct();
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await getAllProducts();
      return response as Product[];
    },
  });

  return (
    <>
      <div className="w-full flex items-center justify-between px-5 ">
        <div className="text-xl font-bold tracking-tight">Products</div>
        <div className="flex items-center ">
          <Button size={"sm"} onClick={onOpen}>Add Product</Button>
          <ProductSheet  />
        </div>
      </div>
      <div className="px-5 ">
        <DataTable columns={columns} data={products} />
      </div>
    </>
  );
};

export default ProductsPage;
