import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  analyzeBudgetHealth,
  solveWhatIfCostSurge,
  autoRebalanceBudget
} from '../src/js/tradeoffOptimizer.js';

describe('Budget Tradeoff & Rebalancing Optimizer', () => {
  const sampleItems = [
    { id: 'b-1', category: 'Venue', target: 10000, actual: 10000, priority: 'High', flexibility: 'Low' },
    { id: 'b-2', category: 'Catering', target: 8000, actual: 8000, priority: 'High', flexibility: 'Medium' },
    { id: 'b-3', category: 'Decor & Florals', target: 4000, actual: 4000, priority: 'Medium', flexibility: 'High' },
    { id: 'b-4', category: 'Entertainment', target: 2000, actual: 2000, priority: 'Low', flexibility: 'High' },
    { id: 'b-5', category: 'Emergency Contingency', target: 1000, actual: 1000, priority: 'High', flexibility: 'Medium' }
  ];

  it('correctly calculates budget health under balanced allocation', () => {
    const health = analyzeBudgetHealth(25000, sampleItems);
    assert.strictEqual(health.totalBudget, 25000);
    assert.strictEqual(health.currentSpent, 25000);
    assert.strictEqual(health.deficit, 0);
    assert.strictEqual(health.isOverbudget, false);
    assert.strictEqual(health.categoryBreakdown.length, 5);
  });

  it('detects overbudget state and computes exact deficit', () => {
    const overspentItems = [
      { id: 'b-1', category: 'Venue', target: 10000, actual: 14000, priority: 'High', flexibility: 'Low' },
      { id: 'b-2', category: 'Catering', target: 8000, actual: 9500, priority: 'High', flexibility: 'Medium' },
      { id: 'b-3', category: 'Decor & Florals', target: 4000, actual: 4500, priority: 'Medium', flexibility: 'High' }
    ];

    const health = analyzeBudgetHealth(25000, overspentItems);
    assert.strictEqual(health.isOverbudget, true);
    assert.strictEqual(health.currentSpent, 28000);
    assert.strictEqual(health.deficit, 3000);
  });

  it('generates 3 distinct trade-off packages for a cost surge scenario', () => {
    const result = solveWhatIfCostSurge(sampleItems, 25000, 'b-2', 2000);
    assert.strictEqual(result.targetCategory, 'Catering');
    assert.strictEqual(result.surgeAmount, 2000);
    assert.strictEqual(result.packages.length, 3);

    const aestheticPkg = result.packages.find(p => p.id === 'pkg-aesthetic');
    assert.ok(aestheticPkg, 'Aesthetic package should exist');
    assert.ok(aestheticPkg.cuts.length > 0, 'Aesthetic package must propose cuts');
    assert.ok(aestheticPkg.totalSavings > 0, 'Aesthetic package must yield positive savings');

    const durationPkg = result.packages.find(p => p.id === 'pkg-schedule');
    assert.ok(durationPkg, 'Duration package should exist');

    const proportionalPkg = result.packages.find(p => p.id === 'pkg-proportional');
    assert.ok(proportionalPkg, 'Proportional package should exist');
  });

  it('auto-rebalances overbudget state back to <= total authorized cap', () => {
    const overspent = [
      { id: 'b-1', category: 'Venue', target: 10000, actual: 12000, priority: 'Critical', flexibility: 'Low' },
      { id: 'b-2', category: 'Catering', target: 8000, actual: 10000, priority: 'High', flexibility: 'Medium' },
      { id: 'b-3', category: 'Decor', target: 4000, actual: 5500, priority: 'Low', flexibility: 'High' },
      { id: 'b-4', category: 'Favors', target: 2000, actual: 3000, priority: 'Low', flexibility: 'High' }
    ]; // Total actual = 30,500 vs Cap = 25,000 (Excess = 5,500)

    const rebalanced = autoRebalanceBudget(overspent, 25000);
    const sumActual = rebalanced.reduce((s, i) => s + i.actual, 0);

    assert.ok(sumActual <= 25000, `Rebalanced sum (${sumActual}) must not exceed total cap (25000)`);

    // Verify low priority items absorb larger reduction than critical
    const venue = rebalanced.find(i => i.id === 'b-1');
    const decor = rebalanced.find(i => i.id === 'b-3');
    const venueReduction = 12000 - venue.actual;
    const decorReduction = 5500 - decor.actual;

    assert.ok(decorReduction > venueReduction * 0.5, 'Decor must absorb meaningful proportional reduction');
  });

  it('handles zero or negative surge amounts gracefully', () => {
    const result = solveWhatIfCostSurge(sampleItems, 25000, 'b-1', 0);
    assert.strictEqual(result.packages.length, 0);
  });
});
