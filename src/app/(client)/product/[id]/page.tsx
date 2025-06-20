"use client";
import { getSingleProduct } from "@/http/api";
import { useQuery } from "@tanstack/react-query";
import { useParams, usePathname } from "next/navigation";
import React from "react";
import Header from "../../_components/Header";
import MainContainer from "../../_components/MainContainer";
import Image from "next/image";
import { Product } from "@/types";
import { Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { orderSchema } from "@/lib/validators/orderSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";

const SingleProduct = () => {
  const params = useParams();
  const pathname = usePathname();

  const id = params.id;

  const { data: session } = useSession();

  const form = useForm<z.infer<typeof orderSchema>>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      address: "",
      pincode: "",
      qty: 1,
      productId: Number(id),
    },
  });

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["products", id],
    queryFn: async (): Promise<Product> => {
      const response = await getSingleProduct(id as string);
      return response as Product;
    },
  });
  type FormValues = z.infer<typeof orderSchema>;
  const onSubmit = (values: FormValues) => {
    //submit the form
    console.log("Values", values);
  };

  const qty = form.watch("qty");
  const price = React.useMemo(() => {
    if (product?.price) {
      // Ensure quantity is always positive and at least 1
      const safeQuantity = Math.abs(Math.max(1, qty || 1));
      return Math.abs(product.price * safeQuantity);
    }
    return 0;
  }, [qty, product]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    // If value is negative or less than 1, set to 1
    if (isNaN(value) || value < 1) {
      form.setValue("qty", 1);
      return;
    }
    form.setValue("qty", value);
  };

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
                  <Skeleton className="h-10 w-60 bg-amber-100" />
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

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex gap-x-2 mt-2">
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => {
                          return (
                            <FormItem className="w-3/6">
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <Textarea
                                  className="border-amber-200 bg-white placeholder:text-gray-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 focus-visible:ring-offset-0"
                                  placeholder="e.g. Open Street 55"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          );
                        }}
                      />
                      <FormField
                        control={form.control}
                        name="pincode"
                        render={({ field }) => {
                          return (
                            <FormItem className="w-3/6">
                              <FormLabel>Pincode</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  className="h-9 border-amber-200 bg-white placeholder:text-gray-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 focus-visible:ring-offset-0 "
                                  placeholder="e.g. 596532"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          );
                        }}
                      />
                      <FormField
                        control={form.control}
                        name="qty"
                        render={({ field }) => {
                          return (
                            <FormItem className="w-3/6">
                              <FormLabel>Qty</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="1"
                                  className="h-9 border-amber-200 bg-white placeholder:text-gray-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 focus-visible:ring-offset-0 "
                                  placeholder="e.g. 1"
                                  {...field}
                                  onKeyDown={(e) => {
                                    // Prevent negative sign and decimal point
                                    if (e.key === '-' || e.key === '.') {
                                      e.preventDefault();
                                    }
                                  }}
                                  onChange={(e) => {
                                    handleQuantityChange(e);
                                    field.onChange(e);
                                  }}
                                  onBlur={(e) => {
                                    // Ensure value is at least 1 on blur
                                    const value = parseInt(e.target.value);
                                    if (isNaN(value) || value < 1) {
                                      e.target.value = "1";
                                      form.setValue("qty", 1);
                                    }
                                    field.onBlur();
                                  }}
                                />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          );
                        }}
                      />
                    </div>
                    <Separator className="my-6 bg-amber-900" />
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-semibold">${price}
                        </span>
                      {session ? (
                        <Button type="submit">Buy Now</Button>
                      ) : (
                        <Link href={`/api/auth/signin?callbackUrl=${pathname}`}>
                          <Button>Buy Now</Button>
                        </Link>
                      )}
                    </div>
                  </form>
                </Form>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SingleProduct;
