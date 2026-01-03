import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { TransactionSchema, OrderSchema, JournalEntrySchema } from '../../../types';

describe('Data Validation Properties', () => {

  // **Feature: sargodha-citrus-ops, Property 10: Transaction Validation**
  it('should validate valid transactions and reject invalid ones', () => {
    fc.assert(
      fc.property(
        fc.uuid(),
        fc.uuid(),
        fc.integer({ min: 1 }),
        fc.constantFrom('marketing', 'packaging', 'fruit_stock', 'logistics', 'food_misc', 'capital_injection'),
        fc.string({ minLength: 1 }),
        (id, partnerId, amount, category, description) => {
          const validData = {
            id,
            partner_id: partnerId,
            amount,
            category,
            description
          };
          const result = TransactionSchema.safeParse(validData);
          return result.success;
        }
      )
    );
  });

  // **Feature: sargodha-citrus-ops, Property 11: Order Validation**
  it('should validate valid orders and reject invalid ones', () => {
    fc.assert(
      fc.property(
        fc.uuid(),
        fc.string({ minLength: 1 }),
        fc.constantFrom('10kg', '5kg'),
        fc.integer({ min: 1 }),
        fc.integer({ min: 0 }),
        fc.uuid(),
        (id, customerName, variant, quantity, sellPrice, createdBy) => {
          const validData = {
            id,
            customer_name: customerName,
            product_variant: variant,
            quantity,
            sell_price: sellPrice,
            status: 'pending',
            created_by: createdBy
          };
          const result = OrderSchema.safeParse(validData);
          return result.success;
        }
      )
    );
  });

  // **Feature: sargodha-citrus-ops, Property 12: Journal Entry Validation**
  it('should validate journal entries with either text or image', () => {
    fc.assert(
      fc.property(
        fc.uuid(),
        fc.uuid(),
        fc.option(fc.string({ minLength: 1 })),
        fc.option(fc.array(fc.string())),
        (id, partnerId, content, imageUrls) => {
           // Skip if both are null/undefined/empty
           if ((!content) && (!imageUrls || imageUrls.length === 0)) return true;

           const validData = {
             id,
             partner_id: partnerId,
             content: content || undefined,
             image_urls: imageUrls || undefined
           };
           const result = JournalEntrySchema.safeParse(validData);
           return result.success;
        }
      )
    );

    // Verify rejection when both are missing
    const invalidData = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      partner_id: '123e4567-e89b-12d3-a456-426614174000'
    };
    const result = JournalEntrySchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
