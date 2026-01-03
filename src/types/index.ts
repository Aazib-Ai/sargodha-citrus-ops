import { z } from 'zod';

// Zod Schemas

export const TransactionCategorySchema = z.enum([
  'marketing',
  'packaging',
  'fruit_stock',
  'logistics',
  'food_misc',
  'capital_injection'
]);

export const ProductVariantSchema = z.enum(['10kg', '5kg']);

export const OrderStatusSchema = z.enum(['pending', 'shipped', 'delivered', 'returned']);

export const TransactionSchema = z.object({
  id: z.string().uuid(),
  partner_id: z.string().uuid(),
  amount: z.number().int().positive(),
  category: TransactionCategorySchema,
  description: z.string().min(1),
  receipt_url: z.string().optional(),
  created_at: z.string().datetime().optional()
});

export const OrderSchema = z.object({
  id: z.string().uuid(),
  customer_name: z.string().min(1),
  product_variant: ProductVariantSchema,
  quantity: z.number().int().positive(),
  sell_price: z.number().int().nonnegative(),
  status: OrderStatusSchema,
  created_by: z.string().uuid(),
  created_at: z.string().datetime().optional()
});

export const JournalEntrySchema = z.object({
  id: z.string().uuid(),
  partner_id: z.string().uuid(),
  content: z.string().optional(),
  image_urls: z.array(z.string()).optional(),
  created_at: z.string().datetime().optional()
}).refine(data => !!data.content || (data.image_urls && data.image_urls.length > 0), {
  message: "Either content or image_urls must be provided"
});

export const CreateTransactionSchema = TransactionSchema.omit({ id: true, created_at: true });
export const CreateOrderSchema = OrderSchema.omit({ id: true, created_at: true, status: true });

// TypeScript Types

export type TransactionCategory = z.infer<typeof TransactionCategorySchema>;
export type ProductVariant = z.infer<typeof ProductVariantSchema>;
export type OrderStatus = z.infer<typeof OrderStatusSchema>;

export interface Partner {
  id: string;
  name: string;
  email: string;
  totalContribution?: number;
  totalExpenses?: number;
  contributionPercentage?: number;
}

export type Transaction = z.infer<typeof TransactionSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type JournalEntry = z.infer<typeof JournalEntrySchema>;

export interface DashboardStats {
  totalRevenue: number;
  totalExpenses: number;
  totalFixedCosts: number;
  profit: number;
  roi: number;
  returnRate: number;
  totalOrders: number;
  deliveredOrders: number;
  returnedOrders: number;
}

export interface PartnerPayout {
  partnerId: string;
  partnerName: string;
  contribution: number;
  profitShare: number;
  totalPayout: number;
}
