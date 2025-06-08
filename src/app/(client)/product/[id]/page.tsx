"use client";
import { getSingleProduct } from "@/http/api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React from "react";
import Header from "../../_components/Header";
import MainContainer from "../../_components/MainContainer";
import Image from "next/image";
import { Product } from "@/types";
import { Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

const SingleProduct = () => {
  const params = useParams();
  const id = params.id;
  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["products", id],
    queryFn: async (): Promise<Product> => {
      const response = await getSingleProduct(id as string);
      return response as Product;
    },
  });

  return (
    <div>
      <MainContainer />
      <Header />
      <section className="custom-height relative bg-[#f5f5f5]">
        <div className="z-50 mx-auto flex h-full max-w-6xl gap-x-10 px-5 py-14 md:py-20">
          <div>
            {isLoading ? (
              <Skeleton className="aspect-square w-[28rem] bg-amber-100" />
            ) : (
              <Image
                src={`/assets/${product?.image}`}
                alt={product?.name ?? "image"}
                width={0}
                height={0}
                sizes="100vw"
                className="aspect-square w-[28rem] rounded-md object-cover shadow-2xl"
              />
            )}
          </div>
          <div className="flex flex-1 flex-col gap-y-2">
            {isLoading ? (
              <>
                <Skeleton className="h-4 w-16 bg-amber-100" />
                <Skeleton className="h-10 w-2/3 bg-amber-100" />
                <div className="flex items-center gap-x-3">
                  <div className="flex items-center gap-x-0.5">
                    <Star className="size-4 text-yellow-400" fill="#facc15" />
                    <Star className="size-4 text-yellow-400" fill="#facc15" />
                    <Star className="size-4 text-yellow-400" fill="#facc15" />
                    <Star className="size-4 text-yellow-400" fill="#facc15" />
                    <Star className="size-4 text-yellow-400" fill="#facc15" />
                    <Star className="size-4 text-yellow-400" />
                  </div>
                  <span className="text-sm">144 Review</span>
                </div>
                <Skeleton className="mt-2 h-28 w-full bg-amber-100" />
                <Separator className="my-6 bg-amber-900" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-10 w-28 bg-amber-100" />
                </div>
              </>
            ) : (
              <>
                <h2 className="text-sm tracking-widest text-amber-700">
                  BRAND NAME
                </h2>
                <h2 className="text-4xl font-semibold text-amber-900">
                  {product?.name}
                </h2>
                <div className="flex items-center gap-x-3">
                  <div className="flex items-center gap-x-0.5">
                    <Star className="size-4 text-yellow-400" fill="#facc15" />
                    <Star className="size-4 text-yellow-400" fill="#facc15" />
                    <Star className="size-4 text-yellow-400" fill="#facc15" />
                    <Star className="size-4 text-yellow-400" fill="#facc15" />
                    <Star className="size-4 text-yellow-400" fill="#facc15" />
                    <Star className="size-4 text-yellow-400" />
                  </div>
                  <span className="text-sm">144 Review</span>
                </div>
                <p className="mt-1">{product?.description}</p>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SingleProduct;
