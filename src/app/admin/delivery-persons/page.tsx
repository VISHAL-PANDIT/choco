"use client";

import { columns } from "./_components/Columns";

import { useQuery } from "@tanstack/react-query";
import { getAllDeliveryPersons } from "@/http/api";
import { DeliveryPerson } from "@/types";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/DataTable/data-table";
import DeliveryPersonSheet from "./_components/deliveryPerson-sheet";
import { useNewDeliveryPerson } from "@/store/delivery-person/delivery-person-store";


const DeliveryPersonPage = () => {
  const { onOpen } = useNewDeliveryPerson();
  const {
    data: deliveryPersons = [],
    isLoading,
    isError,
    error,
  } = useQuery<DeliveryPerson[]>({
    queryKey: ["delivery-persons"],
    queryFn: async () => {
      try {
        console.log("Fetching delivery persons...");
        const response = await getAllDeliveryPersons();
        console.log("Response:", response);
        return response as DeliveryPerson[];
      } catch (err) {
        console.error("Error fetching delivery persons:", err);
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
        <div className="text-xl font-bold tracking-tight">Delivery Persons</div>
        <div className="flex items-center ">
          <Button size={"sm"} onClick={onOpen}>
            Add Delivery Person
          </Button>
          <DeliveryPersonSheet />
        </div>
      </div>

      {isError && <span className="text-red-600">Something went wrong</span>}

      <div className="px-5 ">
        {isLoading ? (
          <div className="flex items-center justify-center ">
            <Loader2 className="size-10 animate-spin" />
          </div>
        ) : (
          <DataTable columns={columns} data={deliveryPersons} />
        )}
      </div>
    </>
  );
};

export default DeliveryPersonPage;
