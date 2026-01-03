'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateOrderSchema } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { createOrder } from '@/lib/services/orders'
import { Loader2 } from 'lucide-react'
import { calculateNetMargin } from '@/lib/utils/calculations'

export default function NewOrderPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    const form = useForm({
        resolver: zodResolver(CreateOrderSchema),
        defaultValues: {
            customer_name: '',
            product_variant: undefined,
            quantity: 1,
            sell_price: undefined,
        },
    })

    const watchVariant = form.watch('product_variant')
    const watchQuantity = form.watch('quantity')
    const watchPrice = form.watch('sell_price')

    const margin = (watchVariant && watchQuantity && watchPrice)
        ? calculateNetMargin(watchVariant, watchPrice, watchQuantity)
        : null

    const onSubmit = async (values: any) => {
        setIsSubmitting(true)
        try {
            const res = await createOrder(values)

            if (res.error) {
                toast({
                    title: 'Error',
                    description: res.error,
                    variant: 'destructive',
                })
            } else {
                toast({
                    title: 'Success',
                    description: 'Order created successfully',
                })
                router.push('/orders')
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to create order',
                variant: 'destructive',
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">New Order</h1>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                    <FormField
                        control={form.control}
                        name="customer_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Customer Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="product_variant"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product Variant</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select variant" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="10kg">10kg Box</SelectItem>
                                        <SelectItem value="5kg">5kg Box</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex gap-4">
                        <FormField
                            control={form.control}
                            name="quantity"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Quantity</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min="1"
                                            {...field}
                                            onChange={e => field.onChange(e.target.valueAsNumber)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="sell_price"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Sell Price (Per Unit)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="3250"
                                            {...field}
                                            onChange={e => field.onChange(e.target.valueAsNumber)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {margin !== null && (
                        <div className="p-4 bg-muted rounded-lg flex justify-between items-center">
                            <span className="font-medium">Estimated Net Margin:</span>
                            <span className={`text-lg font-bold ${margin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {margin.toLocaleString()} PKR
                            </span>
                        </div>
                    )}

                    <div className="flex gap-4 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={() => router.back()}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Order
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
