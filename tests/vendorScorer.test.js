import { describe, it } from 'node:test';
import assert from 'node:assert';
import { scoreVendorQuotation, generateVendorRFP } from '../src/js/vendorScorer.js';

describe('Vendor Coordination & Quotation Evaluation Matrix', () => {
  const targetBudget = 500000;

  const topValueVendor = {
    id: 'v-1',
    name: 'Top Value Caterer',
    quoteAmount: 480000,
    rating: 4.9,
    cancellationPolicy: 'Refundable up to 30 days prior',
    perks: 'Complimentary midnight snacks and signature mocktail bar',
    overtimeRate: 5000
  };

  const overpricedVendor = {
    id: 'v-2',
    name: 'Ultra Luxe Studio',
    quoteAmount: 750000,
    rating: 4.8,
    cancellationPolicy: 'Non-refundable deposit',
    perks: 'Standard deliverables',
    overtimeRate: 15000
  };

  const budgetVendor = {
    id: 'v-3',
    name: 'Economy Lights',
    quoteAmount: 350000,
    rating: 4.2,
    cancellationPolicy: '50% non-refundable',
    perks: 'Free fairy lights',
    overtimeRate: 3000
  };

  it('calculates high composite utility score for top value vendor', () => {
    const scored = scoreVendorQuotation(topValueVendor, targetBudget);
    assert.ok(scored.compositeScore >= 85, `Expected score >= 85, got ${scored.compositeScore}`);
    assert.ok(scored.badge.includes('Best Overall Value') || scored.badge.includes('Standard Fit'));
    assert.strictEqual(scored.subScores.ratingScore, 39); // 4.9/5 * 40 ~ 39.2 -> 39
    assert.ok(scored.subScores.perkScore >= 8, 'Should reward comprehensive complimentary perks');
    assert.ok(scored.subScores.contractScore >= 12, 'Should reward flexible refundable policy');
  });

  it('penalizes overpriced vendors exceeding target allocation', () => {
    const scored = scoreVendorQuotation(overpricedVendor, targetBudget);
    assert.ok(scored.compositeScore < 75, `Expected score < 75, got ${scored.compositeScore}`);
    assert.ok(scored.badge.includes('Premium') || scored.badge.includes('Strict') || scored.badge.includes('Standard'));
    assert.ok(scored.subScores.costScore < 20, 'Cost score should be heavily penalized for 50% price markup');
  });

  it('flags budget-friendly vendor with appropriate badge', () => {
    const scored = scoreVendorQuotation(budgetVendor, targetBudget);
    assert.ok(scored.badge.includes('Budget Friendly') || scored.badge.includes('Standard'));
    assert.ok(Number(scored.priceVariancePercent) < 0, 'Variance should be negative (savings)');
  });

  it('generates customized formal RFP message with correct parameter injection', () => {
    const mockEvent = {
      title: 'Aarav & Meera Wedding',
      type: 'wedding',
      location: 'Udaipur Palace',
      currency: '₹'
    };

    const rfp = generateVendorRFP(mockEvent, 'Catering & Dining', '2026-12-18', 250, 'Allergen segregation required');
    assert.ok(rfp.includes('Aarav & Meera Wedding'), 'RFP must include event title');
    assert.ok(rfp.includes('2026-12-18'), 'RFP must include event date');
    assert.ok(rfp.includes('250 attendees'), 'RFP must include guest count');
    assert.ok(rfp.includes('Catering & Dining'), 'RFP must include category');
    assert.ok(rfp.includes('Allergen segregation required'), 'RFP must include special instructions');
  });
});
