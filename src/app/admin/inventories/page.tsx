"use client";

import { columns } from "./_components/Columns";

import { useQuery } from "@tanstack/react-query";
import {  Inventory } from "@/types";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/DataTable/data-table";
import { useNewInventory } from "@/store/inventory/inventory-store";
import { getAllInvtories } from "@/http/api";
import InventorySheet from "./_components/inventorySheet";

interface InventoryResponse {
  allInventories: Inventory[];
}

const InventoryPage = () => {
  const { onOpen } = useNewInventory();
  const {
    data: inventories,
    isLoading,
    isError,
    error,
  } = useQuery<Inventory[]>({
    queryKey: ["inventories"],
    queryFn: async () => {
      try {  
        const response = await getAllInvtories();
        return (response as InventoryResponse).allInventories;
      } catch (err) {
        console.error("Error fetching inventories:", err);
        throw err;
      }
    },
  });

  if (isError) {
    console.error("Query error:", error);
  }

  return (
    <>
      <div className="w-full flex items-center justify-between px-5 ">
        <div className="text-xl font-bold tracking-tight">Inventories</div>
        <div className="flex items-center ">
          <Button size={"sm"} onClick={onOpen}>
            Add Inventories
          </Button>
          <InventorySheet />
        </div>
      </div>

      {isError && <span className="text-red-600">Something went wrong</span>}

      <div className="px-5 ">
        {isLoading ? (
          <div className="flex items-center justify-center ">
            <Loader2 className="size-10 animate-spin" />
          </div>
        ) : (
          <DataTable columns={columns} data={inventories || []} />
        )}
      </div>
    </>
  );
};

export default InventoryPage;
