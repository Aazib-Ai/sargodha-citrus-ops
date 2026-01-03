'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateTransactionSchema, TransactionCategory } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
import { createTransaction } from '@/lib/services/transactions'
import { ImageUpload } from '@/components/shared/image-upload'
import { Loader2 } from 'lucide-react'

const categories: { value: TransactionCategory; label: string }[] = [
    { value: 'marketing', label: 'Marketing' },
    { value: 'packaging', label: 'Packaging' },
    { value: 'fruit_stock', label: 'Fruit Stock' },
    { value: 'logistics', label: 'Logistics' },
    { value: 'food_misc', label: 'Food / Misc' },
    { value: 'capital_injection', label: 'Capital Injection' },
]

export default function NewTransactionPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    const form = useForm({
        resolver: zodResolver(CreateTransactionSchema),
        defaultValues: {
            amount: undefined, // undefined to show placeholder
            category: undefined,
            description: '',
            receipt_url: '',
        },
    })

    const onSubmit = async (values: any) => {
        setIsSubmitting(true)
        try {
            const res = await createTransaction(values)

            if (res.error) {
                toast({
                    title: 'Error',
                    description: res.error,
                    variant: 'destructive',
                })
            } else {
                toast({
                    title: 'Success',
                    description: 'Transaction recorded successfully',
                })
                router.push('/transactions')
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to create transaction',
                variant: 'destructive',
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">New Transaction</h1>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                    <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Amount (PKR)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        {...field}
                                        onChange={e => field.onChange(e.target.valueAsNumber)}
                                        className="text-lg"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categories.map((c) => (
                                            <SelectItem key={c.value} value={c.value}>
                                                {c.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
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
                                    <Textarea placeholder="Details about this expense..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="receipt_url"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Receipt (Optional)</FormLabel>
                                <FormControl>
                                    <ImageUpload
                                        onUpload={field.onChange}
                                        folder="receipts"
                                        label="Upload Receipt"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

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
                            Save Transaction
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
