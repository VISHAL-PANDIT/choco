import React from 'react'
import {zodResolver} from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl,  FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { deliveryPersonSchema } from '@/lib/validators/deliveryPersonsSchema'

export type FormValue = z.input<typeof deliveryPersonSchema>

const CreatePersonForm = ({onSubmit , disabled}: {onSubmit: (FormValue: FormValue)=> void ; disabled: boolean}) => {
    const form = useForm<z.infer<typeof deliveryPersonSchema>>({
        resolver: zodResolver(deliveryPersonSchema),
        defaultValues: {
            name: '',
            phone: '',
            warehouseId:1
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
                                <FormLabel>Warehouse ID</FormLabel>
                                <FormControl>
                                    <Input 
                                        type='number' 
                                        value={field.value || ''}
                                        onChange={(e) => {
                                            const value = e.target.value ? Number(e.target.value) : '';
                                            field.onChange(value);
                                        }}
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

export default CreatePersonForm