/**
 * FestivaPlan AI - Centralized Application Constants
 * Defines storage keys, event taxonomies, priority hierarchies, and celebratory design tokens.
 *
 * @module constants
 */

export const STORAGE_KEYS = Object.freeze({
  ACTIVE_EVENT: 'festivaplan_active_event_v1',
  THEME: 'festivaplan_theme',
  GEMINI_API_KEY: 'festivaplan_gemini_api_key'
});

export const EVENT_TYPES = Object.freeze({
  WEDDING: 'wedding',
  BIRTHDAY: 'birthday',
  COMMUNITY: 'community',
  CORPORATE: 'corporate'
});

export const PRIORITY_LEVELS = Object.freeze({
  CRITICAL: 'Critical',
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low'
});

export const VENDOR_STATUS = Object.freeze({
  CONTACTED: 'Contacted',
  SHORTLISTED: 'Shortlisted',
  CONFIRMED: 'Confirmed',
  DECLINED: 'Declined'
});

export const ALLERGEN_SEVERITY = Object.freeze({
  CRITICAL: 'CRITICAL',
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  INFO: 'INFO'
});

/**
 * 8-Color Celebratory Design System Tokens
 */
export const CELEBRATORY_PALETTE = Object.freeze({
  WHITE: '#FFFFFF',
  GREEN: '#10B981',
  YELLOW: '#F59E0B',
  RED: '#EF4444',
  SKY_BLUE: '#38BDF8',
  PURPLE: '#8B5CF6',
  ORANGE: '#F97316',
  BROWN: '#78350F'
});

export const BUDGET_LIMITS = Object.freeze({
  MIN_BUDGET: 100,
  MAX_BUDGET: 1000000000,
  MIN_GUESTS: 1,
  MAX_GUESTS: 100000
});

export const GEMINI_CONFIG = Object.freeze({
  MODEL_NAME: 'gemini-1.5-flash',
  API_ENDPOINT: 'https://generativelanguage.googleapis.com/v1beta/models',
  MAX_OUTPUT_TOKENS: 1024,
  TEMPERATURE: 0.7
});

