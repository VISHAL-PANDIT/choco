"use client";

import { columns } from "./Columns";
import { DataTable } from "./data-table";
import { useQuery } from "@tanstack/react-query";
import { getAllWarehouses } from "@/http/api";
import { Warehouse } from "@/types";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNewProduct } from "@/store/product/product-store";
import WarehouseSheet from "./warehouse-sheet";

const WarehousePage = () => {
  const { onOpen } = useNewProduct();
  const {
    data: warehouses = [],
    isLoading,
    isError,
    error,
  } = useQuery<Warehouse[]>({
    queryKey: ["warehouses"],
    queryFn: async () => {
      try {
        const response = await getAllWarehouses();
        return response.AllWarehouses || [];
      } catch (err) {
        console.log(err);
        return [];
      }
    },
  });

  if (isError) {
    console.error("Query error:", error);
  }

  return (
    <>
      <div className="w-full flex items-center justify-between px-5 ">
        <div className="text-xl font-bold tracking-tight">Warehouses</div>
        <div className="flex items-center ">
          <Button size={"sm"} onClick={onOpen}>
            Add Warehouse
          </Button>
          <WarehouseSheet />
        </div>
      </div>

      {isError && <span className="text-red-600">Something went wrong</span>}

      <div className="px-5 ">
        {isLoading ? (
          <div className="flex items-center justify-center ">
            <Loader2 className="size-10 animate-spin" />
          </div>
        ) : (
          <DataTable columns={columns} data={warehouses} />
        )}
      </div>
    </>
  );
};

export default WarehousePage;
