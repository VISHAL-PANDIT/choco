"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { columns } from "./Columns";
import { DataTable } from "./data-table";
import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "@/http/api";
import { Product } from "@/types";

const ProductsPage = () => {
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await getAllProducts();
      return response as Product[];
    },
  });

  return (
    <>
      <div className="flex items-center justify-between px-5">
        <div className="text-xl font-bold tracking-tight">Products</div>
        <Button size={"sm"}>Add Product</Button>
      </div>
      <div className="px-5">
        <DataTable columns={columns} data={products} />
      </div>
    </>
  );
};

export default ProductsPage;
