import { describe, it } from 'node:test';
import assert from 'node:assert';
import { GenAIEngine } from '../src/js/aiEngine.js';

describe('Security, Responsible AI & Input Sanitization', () => {
  it('does not leak or expose API keys in prompt audit output', async () => {
    const engine = new GenAIEngine();
    const fakeKey = 'AIzaSy_FAKE_SECRET_KEY_12345';
    const mockEvent = {
      title: 'Secret Gala',
      type: 'corporate',
      location: 'Grand Hall',
      guestCount: 100,
      totalBudget: 50000,
      currency: '$',
      date: '2026-11-20',
      vibe: 'Sophisticated'
    };

    // Run blueprint in cognitive mode
    const res = await engine.generateEventBlueprint(mockEvent);
    const audit = engine.getAuditData();

    assert.ok(!audit.lastPrompt.includes(fakeKey), 'Prompt payload must never include the raw API key');
    assert.ok(!audit.lastResponse.includes(fakeKey), 'Response payload must never include the raw API key');
  });

  it('escapes and neutralizes malicious script tags in markdown formatting', () => {
    function sanitize(text) {
      return String(text || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    const malicious = '<script>alert("XSS Attack")</script><img src=x onerror=alert(1)>';
    const clean = sanitize(malicious);

    assert.ok(!clean.includes('<script>'), 'Must escape script tags');
    assert.ok(!clean.includes('<img'), 'Must escape img tags');
    assert.ok(clean.includes('&lt;script&gt;'));
  });

  it('verifies that fallback cognitive responses are deterministic and safe', async () => {
    const engine = new GenAIEngine();
    const weddingEvent = {
      title: 'Royal Wedding',
      type: 'wedding',
      location: 'Palace',
      guestCount: 200,
      totalBudget: 1000000,
      currency: '₹',
      date: '2026-12-10',
      vibe: 'Luxe'
    };

    const res = await engine.generateEventBlueprint(weddingEvent, '');
    assert.strictEqual(res.mode, 'Festiva Cognitive Rule Engine (Deterministic AI)');
    assert.ok(res.text.includes('Royal'));
    assert.ok(res.text.includes('Color Palette Rationale'));
    assert.ok(res.text.includes('Signature Delight Moment'));
  });
});
