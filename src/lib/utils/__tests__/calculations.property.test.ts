import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  calculateNetMargin,
  calculateProfit,
  calculatePartnerPayout,
  calculateROI,
  calculateReturnRate
} from '../calculations';

describe('Financial Calculation Properties', () => {

  // **Feature: sargodha-citrus-ops, Property 2: Net Margin Calculation**
  it('should calculate margin as (sellPrice - fixedCost) * quantity for any valid order', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('10kg', '5kg'),
        fc.integer({ min: 1, max: 10000 }),
        fc.integer({ min: 1, max: 100 }),
        (variant, sellPrice, quantity) => {
          // Explicit cast to '10kg' | '5kg' as fast-check infers string
          const v = variant as '10kg' | '5kg';
          const fixedCost = v === '10kg' ? 1720 : 860;
          const expected = (sellPrice - fixedCost) * quantity;
          const result = calculateNetMargin(v, sellPrice, quantity);
          return result === expected;
        }
      ),
      { numRuns: 100 }
    );
  });

  // **Feature: sargodha-citrus-ops, Property 6: Profit Calculation**
  it('should calculate profit as revenue - fixedCosts - expenses', () => {
    fc.assert(
        fc.property(
            fc.integer(),
            fc.integer(),
            fc.integer(),
            (revenue, fixedCosts, expenses) => {
                const result = calculateProfit(revenue, fixedCosts, expenses);
                return result === revenue - fixedCosts - expenses;
            }
        )
    );
  });

  // **Feature: sargodha-citrus-ops, Property 7: Partner Payout Calculation**
  it('should calculate payout as contribution + (profit / 3)', () => {
      fc.assert(
          fc.property(
              fc.integer(),
              fc.integer(),
              (contribution, profit) => {
                  const result = calculatePartnerPayout(contribution, profit);
                  return result === contribution + (profit / 3);
              }
          )
      );
  });

  // **Feature: sargodha-citrus-ops, Property 8: ROI Calculation**
  it('should calculate ROI as (profit / totalCapital) * 100', () => {
      fc.assert(
          fc.property(
              fc.integer(),
              fc.integer({ min: 0 }), // Capital is usually non-negative
              (profit, capital) => {
                  const result = calculateROI(profit, capital);
                  if (capital === 0) {
                      return result === 0;
                  }
                  return Math.abs(result - (profit / capital) * 100) < 0.0001; // FP precision
              }
          )
      );
  });

  // **Feature: sargodha-citrus-ops, Property 9: Return Rate Calculation**
  it('should calculate return rate as (returned / total) * 100', () => {
      fc.assert(
          fc.property(
              fc.integer({ min: 0 }),
              fc.integer({ min: 0 }),
              (returned, total) => {
                  const result = calculateReturnRate(returned, total);
                  if (total === 0) {
                      return result === 0;
                  }
                  return Math.abs(result - (returned / total) * 100) < 0.0001;
              }
          )
      );
  });

});
