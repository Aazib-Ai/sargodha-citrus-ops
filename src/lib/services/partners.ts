'use server'

import { createClient } from '@/lib/supabase/server'
import { Partner } from '@/types'

export async function getPartners() {
    const supabase = await createClient()

    // 1. Get all partners
    const { data: partnersData, error: partnersError } = await supabase
        .from('partners')
        .select('*')

    if (partnersError || !partnersData) {
        console.error('Error fetching partners:', partnersError)
        return []
    }

    // 2. Get transaction aggregates per partner
    const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('partner_id, amount, category')

    if (transactionsError) {
        console.error('Error fetching transactions:', transactionsError)
        return []
    }

    // Calculate totals
    const partnersMap = new Map<string, Partner>()

    // Initialize
    partnersData.forEach(p => {
        partnersMap.set(p.id, {
            ...p,
            totalContribution: 0,
            totalExpenses: 0,
            contributionPercentage: 0
        })
    })

    let totalPool = 0

    transactionsData?.forEach(t => {
        const partner = partnersMap.get(t.partner_id)
        if (partner) {
            // Requirement 2.1 & 2.2: All transactions add to contribution
            // Note: Expenses are "paid from pocket", so they count as capital injection + expense
            // But if we track just the 'amount' field in transactions table, does it represent money IN or money OUT?
            // "WHEN a partner records an expense THEN the System SHALL add the amount to that partner's total contribution (as capital) and log the expense details"
            // So ALL transactions increase the partner's contribution score.

            partner.totalContribution = (partner.totalContribution || 0) + t.amount

            if (t.category !== 'capital_injection') {
                partner.totalExpenses = (partner.totalExpenses || 0) + t.amount
            }

            totalPool += t.amount
        }
    })

    // Calculate percentages
    if (totalPool > 0) {
        partnersMap.forEach(p => {
            p.contributionPercentage = ((p.totalContribution || 0) / totalPool) * 100
        })
    }

    return Array.from(partnersMap.values())
}
