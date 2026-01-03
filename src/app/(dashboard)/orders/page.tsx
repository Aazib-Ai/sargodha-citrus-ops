import { getOrders } from '@/lib/services/orders'
import { OrderCard } from '@/components/orders/order-card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function OrdersPage() {
    const orders = await getOrders()

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Orders</h1>
                <Button asChild>
                    <Link href="/orders/new">
                        <Plus className="w-4 h-4 mr-2" />
                        New Order
                    </Link>
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {orders.map(order => (
                    <OrderCard key={order.id} order={order} />
                ))}

                {orders.length === 0 && (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        No orders found.
                    </div>
                )}
            </div>
        </div>
    )
}
