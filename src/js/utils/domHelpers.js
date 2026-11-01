/**
 * FestivaPlan AI - DOM Utilities & Shared UI Helpers
 * Centralized toast notifications and common DOM manipulation functions.
 *
 * @module utils/domHelpers
 */

/**
 * Displays an accessible, auto-dismissing toast notification.
 * @param {string} message - Text content of the toast notification.
 * @param {number} [durationMs=3000] - Duration before auto-dismiss (milliseconds).
 */
export function showToast(message, durationMs = 3000) {
  const toast = document.createElement('div');
  toast.className = 'festiva-toast animate-slide-up';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 400);
  }, durationMs);
}

/**
 * Safely queries a single DOM element.
 * @param {string} selector - CSS selector string.
 * @param {Element} [context=document] - Parent element to scope the query.
 * @returns {Element|null}
 */
export function qs(selector, context = document) {
  return context.querySelector(selector);
}

/**
 * Safely queries all matching DOM elements.
 * @param {string} selector - CSS selector string.
 * @param {Element} [context=document] - Parent element to scope the query.
 * @returns {NodeListOf<Element>}
 */
export function qsa(selector, context = document) {
  return context.querySelectorAll(selector);
}

/**
 * Generates a unique identifier for dynamic element creation.
 * @param {string} [prefix='fp'] - Identifier prefix.
 * @returns {string}
 */
export function generateId(prefix = 'fp') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
