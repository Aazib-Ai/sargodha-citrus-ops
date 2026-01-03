'use server'

import { createClient } from '@/lib/supabase/server'
import { DashboardStats, PartnerPayout } from '@/types'
import { calculateProfit, calculatePartnerPayout, calculateROI, calculateReturnRate } from '@/lib/utils/calculations'

const FIXED_COSTS = {
  '10kg': 1720,
  '5kg': 860,
} as const;

export async function getDashboardStats() {
    const supabase = await createClient()

    // 1. Fetch all delivered orders for revenue and fixed costs
    const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')

    if (ordersError) {
        console.error('Error fetching orders:', ordersError)
        return null
    }

    // 2. Fetch all expenses (transactions)
    const { data: transactions, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')

    if (transactionsError) {
        console.error('Error fetching transactions:', transactionsError)
        return null
    }

    // 3. Fetch partners for payout calculation
    const { data: partners, error: partnersError } = await supabase
        .from('partners')
        .select('*')

    if (partnersError) {
        console.error('Error fetching partners:', partnersError)
        return null
    }

    // --- Calculations ---

    // Revenue & Fixed Costs (only from delivered orders)
    const deliveredOrders = orders.filter(o => o.status === 'delivered')

    let totalRevenue = 0
    let totalFixedCosts = 0

    deliveredOrders.forEach(o => {
        totalRevenue += o.sell_price * o.quantity
        // @ts-ignore
        const fixedCostPerUnit = FIXED_COSTS[o.product_variant] || 0
        totalFixedCosts += fixedCostPerUnit * o.quantity
    })

    // Expenses (exclude capital injections)
    const expenses = transactions.filter(t => t.category !== 'capital_injection')
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0)

    // Capital Contributions (for ROI and Payouts)
    const capitalInjections = transactions.reduce((acc, t) => {
        // As per requirements, expenses paid by partners count as capital contribution too
        acc[t.partner_id] = (acc[t.partner_id] || 0) + t.amount
        return acc
    }, {} as Record<string, number>)

    const totalCapital = Object.values(capitalInjections).reduce((sum, val) => sum + val, 0)

    // Profit
    const profit = calculateProfit(totalRevenue, totalFixedCosts, totalExpenses)

    // ROI
    const roi = calculateROI(profit, totalCapital)

    // Return Rate
    const returnedOrdersCount = orders.filter(o => o.status === 'returned').length
    const totalOrdersCount = orders.length
    const returnRate = calculateReturnRate(returnedOrdersCount, totalOrdersCount)

    // Partner Payouts
    const partnerPayouts: PartnerPayout[] = partners.map(p => {
        const contribution = capitalInjections[p.id] || 0
        const totalPayout = calculatePartnerPayout(contribution, profit)

        return {
            partnerId: p.id,
            partnerName: p.name,
            contribution,
            profitShare: profit / 3,
            totalPayout
        }
    })

    const stats: DashboardStats = {
        totalRevenue,
        totalExpenses,
        totalFixedCosts,
        profit,
        roi,
        returnRate,
        totalOrders: totalOrdersCount,
        deliveredOrders: deliveredOrders.length,
        returnedOrders: returnedOrdersCount
    }

    return { stats, partnerPayouts }
}
