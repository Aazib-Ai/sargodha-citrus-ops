'use client'

import { Order, OrderStatus } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { updateOrderStatus } from '@/lib/services/orders'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

interface OrderCardProps {
    order: Order
}

const statusColors: Record<OrderStatus, string> = {
    pending: 'bg-yellow-500',
    shipped: 'bg-blue-500',
    delivered: 'bg-green-500',
    returned: 'bg-red-500',
}

export function OrderCard({ order }: OrderCardProps) {
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const handleStatusChange = async (newStatus: OrderStatus) => {
        setIsLoading(true)
        try {
            const res = await updateOrderStatus(order.id, newStatus, order.status)
            if (res.error) {
                toast({
                    title: 'Error',
                    description: res.error,
                    variant: 'destructive',
                })
            } else {
                toast({
                    title: 'Success',
                    description: 'Order status updated',
                })
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to update status',
                variant: 'destructive',
            })
        } finally {
            setIsLoading(false)
        }
    }

    const getAvailableTransitions = (current: OrderStatus): OrderStatus[] => {
        if (current === 'pending') return ['shipped']
        if (current === 'shipped') return ['delivered', 'returned']
        return []
    }

    const availableTransitions = getAvailableTransitions(order.status)

    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="font-semibold text-lg">{order.customer_name}</h3>
                        <p className="text-sm text-muted-foreground">
                            {order.quantity} x {order.product_variant} @ {order.sell_price} PKR
                        </p>
                    </div>
                    <Badge className={statusColors[order.status]}>
                        {order.status}
                    </Badge>
                </div>

                <div className="flex justify-between items-center mt-4">
                    <div className="font-bold text-green-600">
                        Margin: {order.netMargin?.toLocaleString()} PKR
                    </div>

                    {availableTransitions.length > 0 && (
                        <div className="flex items-center gap-2">
                             {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                             <Select onValueChange={(v) => handleStatusChange(v as OrderStatus)} disabled={isLoading}>
                                <SelectTrigger className="w-[140px] h-8">
                                    <SelectValue placeholder="Update Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableTransitions.map(status => (
                                        <SelectItem key={status} value={status}>
                                            Mark {status}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
