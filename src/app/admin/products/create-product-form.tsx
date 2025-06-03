import React from 'react'
import {zodResolver} from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import { productSchema } from '@/lib/validators/productSchema'
import { z } from 'zod'
import { Form, FormControl,  FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'

export type FormValue = z.input<typeof productSchema>

const CreateProductForm = ({onSubmit , disabled}: {onSubmit: (FormValue: FormValue)=> void ; disabled: boolean}) => {
    const form = useForm<z.infer<typeof productSchema>>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: '',
            description: '',
            price: 0
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
                                    <Input placeholder="e.g. Chocobar" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Enter product description" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="image"
                        render={() => (
                            <FormItem>
                                <FormLabel>Image</FormLabel>
                                <FormControl>
                                    <Input type='file' {...form.register("image")} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                    <Input type='number' {...field} onChange={(e)=>{
                                        const value = parseFloat(e.target.value);
                                        field.onChange(value);
                                    }}/>
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

export default CreateProductForm