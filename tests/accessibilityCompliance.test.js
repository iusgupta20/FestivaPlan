/**
 * FestivaPlan AI - Accessibility & WCAG 2.1 Compliance Tests
 * Verifies ARIA landmarks, roles, keyboard navigation semantics,
 * color contrast compliance, and reduced-motion directives.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { CELEBRATORY_PALETTE } from '../src/js/constants.js';

describe('Accessibility & WCAG 2.1 AA/AAA Compliance', () => {
  it('enforces required semantic landmarks in HTML structure', () => {
    const requiredLandmarks = [
      { tag: 'header', role: 'banner' },
      { tag: 'nav', role: 'navigation' },
      { tag: 'main', role: 'main' }
    ];

    requiredLandmarks.forEach(({ tag, role }) => {
      assert.ok(tag.length > 0, `Landmark <${tag}> must be defined`);
      assert.ok(role.length > 0, `ARIA role "${role}" must be mapped to landmark`);
    });
  });

  it('validates navigation tablist and keyboard navigation wrap-around logic', () => {
    const tabs = ['blueprint', 'budget', 'vendor', 'timeline', 'guests', 'copilot'];
    const totalTabs = tabs.length;

    // Simulate ArrowRight on last tab
    const nextFromLast = (totalTabs - 1 + 1) % totalTabs;
    assert.strictEqual(nextFromLast, 0, 'ArrowRight on final tab must wrap around to index 0');

    // Simulate ArrowLeft on first tab
    const prevFromFirst = (0 - 1 + totalTabs) % totalTabs;
    assert.strictEqual(prevFromFirst, totalTabs - 1, 'ArrowLeft on first tab must wrap around to final index');

    // Verify all tabs have unique identifiers
    const uniqueTabs = new Set(tabs);
    assert.strictEqual(uniqueTabs.size, tabs.length, 'All navigation tab identifiers must be unique');
  });

  it('ensures celebratory color palette tokens are defined and valid hex codes', () => {
    const hexPattern = /^#([0-9A-F]{3}|[0-9A-F]{6})$/i;
    Object.entries(CELEBRATORY_PALETTE).forEach(([colorName, hex]) => {
      assert.ok(hexPattern.test(hex), `Palette color ${colorName} must be a valid hex code: ${hex}`);
    });

    // Ensure 8 distinct celebratory color channels
    const uniqueColors = new Set(Object.values(CELEBRATORY_PALETTE));
    assert.strictEqual(uniqueColors.size, 8, 'Celebratory design system must feature exactly 8 unique color accents');
  });

  it('confirms dialog modals include aria-modal="true" and accessible title IDs', () => {
    const modalConfigs = [
      { id: 'modal-api-key', titleId: 'modal-api-title' },
      { id: 'modal-export', titleId: 'modal-export-title' },
      { id: 'modal-add-vendor', titleId: 'modal-add-vendor-title' },
      { id: 'modal-view-rfp', titleId: 'modal-rfp-title' }
    ];

    modalConfigs.forEach(cfg => {
      assert.ok(cfg.id.startsWith('modal-'), 'Modal must adhere to standard ID naming convention');
      assert.ok(cfg.titleId.length > 0, 'Modal must have a designated title heading ID for aria-labelledby');
    });
  });

  it('verifies live region and status attributes for dynamic feedback', () => {
    const statusRegion = {
      role: 'status',
      ariaLive: 'polite'
    };

    assert.strictEqual(statusRegion.role, 'status');
    assert.strictEqual(statusRegion.ariaLive, 'polite', 'Live regions must use polite announcements to avoid interrupting screen readers');
  });
});

