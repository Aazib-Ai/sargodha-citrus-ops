'use server'

import { createClient } from '@/lib/supabase/server'
import { Order, CreateOrderSchema, OrderStatus } from '@/types'
import { calculateNetMargin } from '@/lib/utils/calculations'
import { revalidatePath } from 'next/cache'

export async function createOrder(data: any) {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return { error: 'Unauthorized' }
    }

    const validation = CreateOrderSchema.safeParse(data)

    if (!validation.success) {
        return { error: 'Invalid data', details: validation.error.flatten() }
    }

    const { error } = await supabase
        .from('orders')
        .insert({
            ...validation.data,
            created_by: user.id,
            status: 'pending'
        })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/orders')
    revalidatePath('/')

    return { success: true }
}

export async function getOrders(filters?: { status?: string }) {
    const supabase = await createClient()

    let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

    if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status)
    }

    const { data, error } = await query

    if (error) {
        console.error('Error fetching orders:', error)
        return []
    }

    // Calculate margins for display
    return data.map(o => ({
        ...o,
        netMargin: calculateNetMargin(o.product_variant, o.sell_price, o.quantity)
    })) as Order[]
}

export async function updateOrderStatus(orderId: string, newStatus: OrderStatus, oldStatus: OrderStatus) {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return { error: 'Unauthorized' }
    }

    // Validate transition
    // Pending -> Shipped
    // Shipped -> Delivered
    // Shipped -> Returned

    const isValid =
        (oldStatus === 'pending' && newStatus === 'shipped') ||
        (oldStatus === 'shipped' && newStatus === 'delivered') ||
        (oldStatus === 'shipped' && newStatus === 'returned');

    if (!isValid) {
        return { error: 'Invalid status transition' }
    }

    // Update order
    const { error: updateError } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)

    if (updateError) {
        return { error: updateError.message }
    }

    // Record history
    await supabase.from('order_status_history').insert({
        order_id: orderId,
        old_status: oldStatus,
        new_status: newStatus,
        changed_by: user.id
    })

    revalidatePath('/orders')
    revalidatePath('/')

    return { success: true }
}
