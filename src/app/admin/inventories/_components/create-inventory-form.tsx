import React from 'react'
import {zodResolver} from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getAllWarehouses, getAllProducts } from '@/http/api'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Product } from '@/types'

const inventorySchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  warehouseId: z.number().min(1, "Warehouse is required"),
  productId: z.number().min(1, "Product is required"),
})

export type FormValue = z.input<typeof inventorySchema>

const CreateInventoryForm = ({onSubmit, disabled}: {onSubmit: (FormValue: FormValue)=> void; disabled: boolean}) => {
    const form = useForm<z.infer<typeof inventorySchema>>({
        resolver: zodResolver(inventorySchema),
        defaultValues: {
            sku: '',
            warehouseId: undefined,
            productId: undefined
        }
    })

    const {
        data: warehouses = [],
        isLoading: isLoadingWarehouses
    } = useQuery({
        queryKey: ['warehouses'],
        queryFn: async () => {
            const response = await getAllWarehouses();
            return response.AllWarehouses || [];
        }
    })

    const {
        data: products = [] as Product[],
        isLoading: isLoadingProducts
    } = useQuery<Product[]>({
        queryKey: ['products'],
        queryFn: async () => {
            const response = await getAllProducts();
            return response as Product[];
        }
    })

    const handleSubmit = (values: FormValue) => {
        onSubmit(values);
    }

    return (
        <div className='px-4'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="sku"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>SKU</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter SKU" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="warehouseId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Warehouse</FormLabel>
                                <Select 
                                    onValueChange={(value) => field.onChange(Number(value))}
                                    value={field.value?.toString()}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a warehouse" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {isLoadingWarehouses ? (
                                            <SelectItem value="loading" disabled>
                                                Loading warehouses...
                                            </SelectItem>
                                        ) : (
                                            Array.from(new Set(warehouses.map(w => w.name)))
                                                .map(uniqueName => {
                                                    const warehouse = warehouses.find(w => w.name === uniqueName);
                                                    if (!warehouse) return null;
                                                    return (
                                                        <SelectItem 
                                                            key={warehouse.id} 
                                                            value={warehouse.id.toString()}
                                                        >
                                                            {uniqueName}
                                                        </SelectItem>
                                                    );
                                                })
                                                .filter(Boolean)
                                        )}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="productId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product</FormLabel>
                                <Select 
                                    onValueChange={(value) => field.onChange(Number(value))}
                                    value={field.value?.toString()}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a product" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {isLoadingProducts ? (
                                            <SelectItem value="loading" disabled>
                                                Loading products...
                                            </SelectItem>
                                        ) : (
                                            products.map(product => (
                                                <SelectItem 
                                                    key={product.id} 
                                                    value={product.id.toString()}
                                                >
                                                    {product.name}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button className='w-full' disabled={disabled}>
                        {
                            disabled ? <Loader2 className='size-4 animate-spin'/> : "Create"
                        }
                    </Button>
                </form>
            </Form>
        </div>
    )
}

export default CreateInventoryForm
