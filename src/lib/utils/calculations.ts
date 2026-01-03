import { ProductVariant } from "@/types";

const FIXED_COSTS = {
  '10kg': 1720,
  '5kg': 860,
} as const;

export function calculateNetMargin(
  variant: ProductVariant,
  sellPrice: number,
  quantity: number
): number {
  const fixedCost = FIXED_COSTS[variant];
  return (sellPrice - fixedCost) * quantity;
}

export function calculateProfit(
  totalRevenue: number,
  totalFixedCosts: number,
  totalExpenses: number
): number {
  return totalRevenue - totalFixedCosts - totalExpenses;
}

export function calculatePartnerPayout(
  contribution: number,
  totalProfit: number
): number {
  const profitShare = totalProfit / 3;
  return contribution + profitShare;
}

export function calculateROI(
  profit: number,
  totalCapital: number
): number {
  if (totalCapital === 0) return 0;
  return (profit / totalCapital) * 100;
}

export function calculateReturnRate(
  returnedOrders: number,
  totalOrders: number
): number {
  if (totalOrders === 0) return 0;
  return (returnedOrders / totalOrders) * 100;
}
