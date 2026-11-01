/**
 * FestivaPlan AI - Input Validation & Defensive Sanitation Utility
 * Provides type checking, bounds validation, and sanitized parsing for event attributes.
 *
 * @module utils/validator
 */

import { BUDGET_LIMITS, PRIORITY_LEVELS, VENDOR_STATUS } from '../constants.js';

/**
 * Validates core event configuration
 * @param {Object} event - Event configuration object
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateEventConfig(event) {
  const errors = [];
  if (!event || typeof event !== 'object') {
    return { valid: false, errors: ['Event configuration must be an object.'] };
  }

  if (!event.title || typeof event.title !== 'string' || event.title.trim().length === 0) {
    errors.push('Event title is required.');
  } else if (event.title.length > 200) {
    errors.push('Event title cannot exceed 200 characters.');
  }

  const budget = Number(event.totalBudget);
  if (isNaN(budget) || budget < BUDGET_LIMITS.MIN_BUDGET || budget > BUDGET_LIMITS.MAX_BUDGET) {
    errors.push(`Total budget must be a number between ${BUDGET_LIMITS.MIN_BUDGET} and ${BUDGET_LIMITS.MAX_BUDGET}.`);
  }

  const guests = Number(event.guestCount);
  if (isNaN(guests) || guests < BUDGET_LIMITS.MIN_GUESTS || guests > BUDGET_LIMITS.MAX_GUESTS) {
    errors.push(`Guest count must be an integer between ${BUDGET_LIMITS.MIN_GUESTS} and ${BUDGET_LIMITS.MAX_GUESTS}.`);
  }

  if (event.date) {
    const parsedDate = new Date(event.date);
    if (isNaN(parsedDate.getTime())) {
      errors.push('Event date must be a valid date format (YYYY-MM-DD).');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validates vendor quotation proposal
 * @param {Object} vendor - Vendor quotation object
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateVendorProposal(vendor) {
  const errors = [];
  if (!vendor || typeof vendor !== 'object') {
    return { valid: false, errors: ['Vendor proposal must be an object.'] };
  }

  if (!vendor.name || typeof vendor.name !== 'string' || vendor.name.trim().length === 0) {
    errors.push('Vendor name is required.');
  }

  const quote = Number(vendor.quoteAmount);
  if (isNaN(quote) || quote <= 0) {
    errors.push('Quote amount must be a positive number.');
  }

  const rating = Number(vendor.rating);
  if (isNaN(rating) || rating < 1.0 || rating > 5.0) {
    errors.push('Vendor rating must be between 1.0 and 5.0.');
  }

  if (vendor.status && !Object.values(VENDOR_STATUS).includes(vendor.status)) {
    errors.push(`Invalid vendor status: "${vendor.status}".`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validates a single budget allocation item
 * @param {Object} item - Budget line item
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateBudgetItem(item) {
  const errors = [];
  if (!item || typeof item !== 'object') {
    return { valid: false, errors: ['Budget item must be an object.'] };
  }

  if (!item.category || typeof item.category !== 'string') {
    errors.push('Budget item must have a category name.');
  }

  const target = Number(item.target);
  if (isNaN(target) || target < 0) {
    errors.push('Target allocation must be non-negative.');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Sanitizes and validates user chat input before prompt synthesis
 * @param {string} message - Raw user input
 * @returns {string} Sanitized string
 */
export function sanitizeUserQuery(message) {
  if (typeof message !== 'string') return '';
  return message
    .trim()
    .slice(0, 1000)
    .replace(/<[^>]*>/g, '');
}

