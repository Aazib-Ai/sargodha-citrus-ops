'use server'

import { createClient } from '@/lib/supabase/server'
import { Transaction, CreateTransactionSchema } from '@/types'
import { revalidatePath } from 'next/cache'

export async function createTransaction(data: any) {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return { error: 'Unauthorized' }
    }

    const validation = CreateTransactionSchema.safeParse(data)

    if (!validation.success) {
        return { error: 'Invalid data', details: validation.error.flatten() }
    }

    const { error } = await supabase
        .from('transactions')
        .insert({
            ...validation.data,
            partner_id: user.id
        })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/transactions')
    revalidatePath('/ledger')
    revalidatePath('/')

    return { success: true }
}

export async function getTransactions(filters?: {
    category?: string
    partnerId?: string
    startDate?: string
    endDate?: string
}) {
    const supabase = await createClient()

    let query = supabase
        .from('transactions')
        .select(`
            *,
            partners (
                name
            )
        `)
        .order('created_at', { ascending: false })

    if (filters?.category && filters.category !== 'all') {
        query = query.eq('category', filters.category)
    }

    if (filters?.partnerId && filters.partnerId !== 'all') {
        query = query.eq('partner_id', filters.partnerId)
    }

    if (filters?.startDate) {
        query = query.gte('created_at', filters.startDate)
    }

    if (filters?.endDate) {
        query = query.lte('created_at', filters.endDate)
    }

    const { data, error } = await query

    if (error) {
        console.error('Error fetching transactions:', error)
        return []
    }

    return data.map(t => ({
        ...t,
        partnerName: t.partners?.name || 'Unknown'
    })) as Transaction[]
}

export async function getTransactionById(id: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('transactions')
        .select(`
            *,
            partners (
                name
            )
        `)
        .eq('id', id)
        .single()

    if (error) return null

    return {
        ...data,
        partnerName: data.partners?.name || 'Unknown'
    } as Transaction
}
