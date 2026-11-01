/**
 * FestivaPlan AI - Full End-to-End Integration Pipeline Test Suite
 * Simulates complete user journey: preset loading -> cost surge -> tradeoff resolution ->
 * auto-rebalance -> vendor scoring -> timeline run-sheet generation -> JSON backup.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { EventStateManager } from '../src/js/state.js';
import {
  analyzeBudgetHealth,
  solveWhatIfCostSurge,
  autoRebalanceBudget
} from '../src/js/tradeoffOptimizer.js';
import { scoreVendorQuotation, generateVendorRFP } from '../src/js/vendorScorer.js';
import {
  calculateEventCountdown,
  processTasksWithDependencies,
  generateDDayRunSheet
} from '../src/js/timelineScheduler.js';
import { analyzeGuestDemographicsAndDietary } from '../src/js/guestManager.js';
import { validateEventConfig, validateVendorProposal } from '../src/js/utils/validator.js';

describe('End-to-End Event Planning & Operations Pipeline', () => {
  it('executes full lifecycle from inspiration to tactical execution seamlessly', () => {
    // 1. Initialize State Manager
    const manager = new EventStateManager();
    manager.loadPreset('wedding');
    const state = manager.getState();

    // 2. Validate Event Input Configuration
    const eventValidation = validateEventConfig(state);
    assert.strictEqual(eventValidation.valid, true, 'Preset must satisfy all validation rules');

    // 3. Analyze Baseline Budget Health (Wedding preset starts with ₹65,000 deficit for demo)
    const initialHealth = analyzeBudgetHealth(state.totalBudget, state.budgetItems);
    assert.ok(initialHealth.deficit >= 0, 'Baseline budget deficit tracking is operational');

    // 4. Simulate Real-World Cost Surge (+₹100,000 in Catering)
    const surgeCategory = state.budgetItems[1].id;
    const surgeAmount = 100000;
    const solutions = solveWhatIfCostSurge(
      state.budgetItems,
      state.totalBudget,
      surgeCategory,
      surgeAmount
    );

    assert.ok(solutions, 'Must return surge trade-off solutions');
    assert.strictEqual(solutions.packages.length, 3, 'Must offer exactly 3 distinct trade-off packages');
    assert.ok(solutions.packages[0].cuts.length > 0, 'Package A must propose actionable cuts');

    // 5. Execute 1-Click Constraint-Based Auto-Rebalancing
    const rebalancedItems = autoRebalanceBudget(state.budgetItems, state.totalBudget);
    const rebalancedHealth = analyzeBudgetHealth(state.totalBudget, rebalancedItems);
    assert.ok(rebalancedHealth.currentSpent <= state.totalBudget, 'Rebalanced total spend must not exceed authorized cap');

    // 6. Vendor Scoring & RFP Dispatch
    const vendorProposal = {
      category: 'Catering & Dining',
      name: 'Grand Royal Caterers',
      quoteAmount: 580000,
      rating: 4.8,
      deliverables: '8-course live buffet, royal chafing dishes, certified allergen stations',
      overtimeRate: 5000,
      perks: 'Complimentary mocktail bar and dessert fondue counter',
      cancellationPolicy: 'Refundable up to 21 days prior',
      status: 'Contacted'
    };

    const vendorValidation = validateVendorProposal(vendorProposal);
    assert.strictEqual(vendorValidation.valid, true);

    const vendorScore = scoreVendorQuotation(vendorProposal, 600000, state.vendors);
    assert.ok(vendorScore.compositeScore >= 70, 'High-quality vendor must achieve competitive utility score');

    const generatedRFP = generateVendorRFP(
      state,
      vendorProposal.category,
      state.date,
      state.guestCount,
      vendorProposal.perks
    );
    assert.ok(generatedRFP.includes(vendorProposal.category));
    assert.ok(generatedRFP.includes(state.title));

    // 7. Timeline Scheduling & D-Day Master Run-Sheet
    const countdown = calculateEventCountdown(state.date);
    assert.ok(countdown.label.length > 0);

    const processedTasks = processTasksWithDependencies(state.tasks, state.date);
    assert.ok(processedTasks.length > 0);

    const runSheet = generateDDayRunSheet(state);
    assert.ok(runSheet.length >= 5, 'D-Day master run-sheet must contain structured timeline slots');
    assert.ok(runSheet[0].time && runSheet[0].action, 'Run-sheet items must contain time and action descriptions');

    // 8. Guest Personalization & Allergen Directives
    const guestAnalysis = analyzeGuestDemographicsAndDietary(state.guests);
    assert.ok(guestAnalysis.confirmedGuests > 0);
    assert.ok(guestAnalysis.kitchenDirectives.length > 0, 'Must generate kitchen allergen safety directives');
    assert.ok(guestAnalysis.weatherAction.planA, 'Must formulate weather contingency Plan A');
    assert.ok(guestAnalysis.weatherAction.planB_rain, 'Must formulate weather contingency Plan B');

    // 9. Full JSON Backup Serializability
    const exportedJson = JSON.stringify(state);
    const restoredState = JSON.parse(exportedJson);
    assert.strictEqual(restoredState.id, state.id);
    assert.strictEqual(restoredState.totalBudget, state.totalBudget);
    assert.strictEqual(restoredState.budgetItems.length, state.budgetItems.length);
  });
});

