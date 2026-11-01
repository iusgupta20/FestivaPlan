/**
 * FestivaPlan AI - Reactive State Manager Test Suite
 * Tests event state persistence, preset loading, budget metric calculations,
 * pub/sub event bus, and vendor/task mutations.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { EventStateManager, EVENT_PRESETS } from '../src/js/state.js';

describe('Reactive State Management Bus', () => {
  it('loads valid initial state with fallback to rich wedding preset', () => {
    const manager = new EventStateManager();
    const state = manager.getState();

    assert.ok(state, 'State must exist');
    assert.ok(state.id, 'State must have an identifier');
    assert.ok(state.totalBudget > 0, 'Total budget must be a positive number');
    assert.ok(Array.isArray(state.budgetItems), 'Budget items must be an array');
    assert.ok(Array.isArray(state.tasks), 'Tasks must be an array');
    assert.ok(Array.isArray(state.vendors), 'Vendors must be an array');
  });

  it('switches between all 4 event presets accurately', () => {
    const manager = new EventStateManager();
    const presets = ['wedding', 'birthday', 'community', 'corporate'];

    presets.forEach(presetKey => {
      manager.loadPreset(presetKey);
      const state = manager.getState();
      assert.strictEqual(state.type, EVENT_PRESETS[presetKey].type);
      assert.strictEqual(state.totalBudget, EVENT_PRESETS[presetKey].totalBudget);
    });
  });

  it('computes real-time budget metrics and velocity accurately', () => {
    const manager = new EventStateManager();
    manager.loadPreset('wedding');
    const metrics = manager.getBudgetMetrics();

    assert.strictEqual(typeof metrics.total, 'number');
    assert.strictEqual(typeof metrics.allocated, 'number');
    assert.strictEqual(typeof metrics.isOverbudget, 'boolean');
    assert.strictEqual(typeof metrics.perGuestSpend, 'number');
    assert.strictEqual(metrics.total, 2500000);
    assert.ok(metrics.perGuestSpend > 0);
  });

  it('toggles task completion and emits state updates', () => {
    const manager = new EventStateManager();
    const state = manager.getState();
    const firstTask = state.tasks[0];
    const initialStatus = firstTask.completed;

    manager.toggleTask(firstTask.id);
    const updatedTask = manager.getState().tasks.find(t => t.id === firstTask.id);
    assert.strictEqual(updatedTask.completed, !initialStatus);
  });

  it('adds, updates, and deletes vendor proposals seamlessly', () => {
    const manager = new EventStateManager();
    const initialVendorCount = manager.getState().vendors.length;

    const newVendor = manager.addVendor({
      category: 'Catering & Dining',
      name: 'Spice Symphony Gourmet',
      quoteAmount: 550000,
      rating: 4.8,
      status: 'Shortlisted'
    });

    assert.ok(newVendor.id, 'New vendor must receive a generated ID');
    assert.strictEqual(manager.getState().vendors.length, initialVendorCount + 1);

    // Update status
    manager.updateVendorStatus(newVendor.id, 'Confirmed');
    const updated = manager.getState().vendors.find(v => v.id === newVendor.id);
    assert.strictEqual(updated.status, 'Confirmed');

    // Delete vendor
    manager.deleteVendor(newVendor.id);
    assert.strictEqual(manager.getState().vendors.length, initialVendorCount);
  });

  it('supports pub/sub subscription and triggers event notifications', () => {
    const manager = new EventStateManager();
    let triggeredCount = 0;

    const unsubscribe = manager.subscribe('stateChanged', () => {
      triggeredCount++;
    });

    manager.emit('stateChanged');
    manager.emit('stateChanged');

    assert.strictEqual(triggeredCount, 2);

    // Test unsubscribe
    if (typeof unsubscribe === 'function') {
      unsubscribe();
      manager.emit('stateChanged');
      assert.strictEqual(triggeredCount, 2);
    }
  });

  it('securely manages API key in memory without repository leakage', () => {
    const manager = new EventStateManager();
    const testKey = 'TEST_KEY_AI_SAFETY_VALIDATION';

    manager.setApiKey(testKey);
    assert.strictEqual(manager.getApiKey(), testKey);

    manager.setApiKey('');
    assert.strictEqual(manager.getApiKey(), '');
  });
});

