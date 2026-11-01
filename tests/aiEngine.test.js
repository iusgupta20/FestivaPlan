/**
 * FestivaPlan AI - GenAI Engine & Cognitive Fallback Test Suite
 * Tests prompt synthesis, offline deterministic rule generation across presets,
 * copilot conversational intelligence, and audit logging.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { GenAIEngine } from '../src/js/aiEngine.js';

describe('GenAI Engine & Cognitive Fallback Tier', () => {
  it('instantiates GenAIEngine with zero errors', () => {
    const engine = new GenAIEngine();
    assert.ok(engine instanceof GenAIEngine);
    const audit = engine.getAuditData();
    assert.strictEqual(typeof audit, 'object');
  });

  it('generates rich cognitive fallback blueprints for all 4 demonstration presets', async () => {
    const engine = new GenAIEngine();
    const presets = [
      { id: 'wedding', title: 'Royal Palace Wedding', type: 'wedding', totalBudget: 2500000, currency: '₹', guestCount: 250 },
      { id: 'birthday', title: 'Cosmic 1st Birthday', type: 'birthday', totalBudget: 4500, currency: '$', guestCount: 65 },
      { id: 'community', title: 'Community Jazz Fest', type: 'community', totalBudget: 18000, currency: '$', guestCount: 750 },
      { id: 'corporate', title: 'Nexus Cloud Summit Gala', type: 'corporate', totalBudget: 45000, currency: '$', guestCount: 300 }
    ];

    for (const event of presets) {
      const blueprint = await engine.generateEventBlueprint(event);
      assert.ok(blueprint, `Blueprint must be generated for ${event.type}`);
      assert.ok(blueprint.text, 'Must include text payload');
      assert.ok(blueprint.mode.includes('Cognitive'), 'Mode must reflect Cognitive Rule Engine');
      assert.ok(blueprint.prompt.includes(event.title), 'Prompt must reflect event title context');
      assert.ok(blueprint.text.includes('THEME') || blueprint.text.includes('PALETTE') || blueprint.text.length > 50);
    }
  });

  it('delivers context-aware cognitive copilot answers for core event domains', async () => {
    const engine = new GenAIEngine();
    const mockEvent = {
      title: 'Grand Palace Gala',
      type: 'wedding',
      guestCount: 200,
      totalBudget: 50000,
      currency: '$'
    };

    // 1. Budget Question
    const budgetRes = await engine.chatWithCopilot(mockEvent, 'How can we trim 10% from our budget?');
    const budgetAnswer = budgetRes.text || '';
    assert.ok(budgetAnswer.toLowerCase().includes('budget') || budgetAnswer.toLowerCase().includes('trim'), 'Should respond with budget guidance');

    // 2. Weather Question
    const weatherRes = await engine.chatWithCopilot(mockEvent, 'What is our rain contingency plan?');
    const weatherAnswer = weatherRes.text || '';
    assert.ok(weatherAnswer.toLowerCase().includes('weather') || weatherAnswer.toLowerCase().includes('rain') || weatherAnswer.toLowerCase().includes('ballroom'), 'Should provide weather advice');

    // 3. Kids Question
    const kidsRes = await engine.chatWithCopilot(mockEvent, 'How do we keep kids entertained?');
    const kidsAnswer = kidsRes.text || '';
    assert.ok(kidsAnswer.toLowerCase().includes('kid') || kidsAnswer.toLowerCase().includes('child') || kidsAnswer.toLowerCase().includes('activity'), 'Should provide child hospitality tips');

    // 4. Vendor Question
    const vendorRes = await engine.chatWithCopilot(mockEvent, 'What should we negotiate in vendor contracts?');
    const vendorAnswer = vendorRes.text || '';
    assert.ok(vendorAnswer.toLowerCase().includes('vendor') || vendorAnswer.toLowerCase().includes('contract') || vendorAnswer.toLowerCase().includes('clause'), 'Should provide vendor contract guidance');
  });

  it('records prompt audit data accurately for transparency console', async () => {
    const engine = new GenAIEngine();
    const event = { title: 'Audit Test Event', type: 'birthday', totalBudget: 5000, currency: '$', guestCount: 50 };

    await engine.generateEventBlueprint(event);
    const audit = engine.getAuditData();

    assert.ok(audit.lastPrompt.length > 0, 'Last prompt must be recorded in audit');
    assert.ok(audit.lastResponse.length > 0, 'Last response must be recorded in audit');
    assert.ok(audit.lastPrompt.includes('Audit Test Event'), 'Prompt must inject the event title context');
  });
});
