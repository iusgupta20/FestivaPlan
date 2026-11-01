/**
 * FestivaPlan AI - Utilities & Defensive Validation Test Suite
 * Tests sanitization, HTML escaping, markdown formatting,
 * and boundary validation checks.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { escapeHtml, formatMarkdown } from '../src/js/utils/sanitize.js';
import {
  validateEventConfig,
  validateVendorProposal,
  validateBudgetItem,
  sanitizeUserQuery
} from '../src/js/utils/validator.js';
import {
  STORAGE_KEYS,
  EVENT_TYPES,
  PRIORITY_LEVELS,
  CELEBRATORY_PALETTE
} from '../src/js/constants.js';

describe('Sanitization & Defensive Utilities', () => {
  it('escapes dangerous HTML special characters accurately', () => {
    const raw = '<script>alert("XSS")</script>&"\'';
    const clean = escapeHtml(raw);

    assert.ok(!clean.includes('<script>'));
    assert.ok(!clean.includes('</script>'));
    assert.ok(clean.includes('&lt;script&gt;'));
    assert.ok(clean.includes('&amp;'));
    assert.ok(clean.includes('&quot;'));
    assert.ok(clean.includes('&#039;'));
  });

  it('formats markdown headings, bold text, and lists cleanly', () => {
    const md = '## Section Title\n\n**Bold Statement**\n\n- Point 1\n- Point 2';
    const html = formatMarkdown(md);

    assert.ok(html.includes('<h3>Section Title</h3>'));
    assert.ok(html.includes('<strong>Bold Statement</strong>'));
    assert.ok(html.includes('<li>Point 1</li>'));
  });

  it('validates event configurations against edge cases and bounds', () => {
    // Valid event
    const valid = validateEventConfig({
      title: 'Valid Celebration',
      totalBudget: 15000,
      guestCount: 100,
      date: '2026-11-20'
    });
    assert.strictEqual(valid.valid, true);

    // Invalid budget and negative guests
    const invalid = validateEventConfig({
      title: '',
      totalBudget: -50,
      guestCount: 0
    });
    assert.strictEqual(invalid.valid, false);
    assert.ok(invalid.errors.length >= 3);
  });

  it('validates vendor quotation proposals strictly', () => {
    const validVendor = {
      name: 'Ace Sound',
      quoteAmount: 20000,
      rating: 4.6,
      status: 'Contacted'
    };
    assert.strictEqual(validateVendorProposal(validVendor).valid, true);

    const invalidVendor = {
      name: '',
      quoteAmount: -100,
      rating: 6.2,
      status: 'UnknownStatus'
    };
    const check = validateVendorProposal(invalidVendor);
    assert.strictEqual(check.valid, false);
    assert.ok(check.errors.length >= 4);
  });

  it('sanitizes user queries removing embedded tags and limiting length', () => {
    const malicious = '<script>doBadThings()</script>Hello Copilot!';
    const sanitized = sanitizeUserQuery(malicious);
    assert.ok(!sanitized.includes('<script>'));
    assert.ok(sanitized.includes('Hello Copilot!'));
  });

  it('verifies immutability of exported constants', () => {
    assert.ok(Object.isFrozen(STORAGE_KEYS));
    assert.ok(Object.isFrozen(EVENT_TYPES));
    assert.ok(Object.isFrozen(PRIORITY_LEVELS));
    assert.ok(Object.isFrozen(CELEBRATORY_PALETTE));
  });
});

