import React from 'react'
import {zodResolver} from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl,  FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { warehouseSchema } from '@/lib/validators/warehouseSchema'

export type FormValue = z.input<typeof warehouseSchema>

const CreateWarehousesForm = ({onSubmit , disabled}: {onSubmit: (FormValue: FormValue)=> void ; disabled: boolean}) => {
    const form = useForm<z.infer<typeof warehouseSchema>>({
        resolver: zodResolver(warehouseSchema),
        defaultValues: {
            name: '',
            pincode: '',
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
                                    <Input placeholder="e.g. Main Warehouse" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="pincode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Pincode</FormLabel>
                                <FormControl>
                                    <Input 
                                        type="pincode"
                                        placeholder="XXXXXX"
                                        maxLength={6}
                                        {...field}
                                    />
                                </FormControl>
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

export default CreateWarehousesForm