import React from 'react'
import {zodResolver} from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { deliveryPersonSchema } from '@/lib/validators/deliveryPersonsSchema'
import { useQuery } from '@tanstack/react-query'
import { getAllWarehouses } from '@/http/api'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export type FormValue = z.input<typeof deliveryPersonSchema>

const CreatePersonForm = ({onSubmit , disabled}: {onSubmit: (FormValue: FormValue)=> void ; disabled: boolean}) => {
    const form = useForm<z.infer<typeof deliveryPersonSchema>>({
        resolver: zodResolver(deliveryPersonSchema),
        defaultValues: {
            name: '',
            phone: '',
            warehouseId: undefined
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

    const handleSubmit = (values: FormValue) => {
        onSubmit(values);
    }

    return (
        <div className='px-4'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Suraj" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                    <Input 
                                        type="tel"
                                        placeholder="+91XXXXXXXXXX"
                                        pattern="[+][0-9]{12}"
                                        maxLength={13}
                                        {...field}
                                    />
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

export default CreatePersonForm