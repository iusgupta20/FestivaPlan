/**
 * FestivaPlan AI - Main Application Coordinator
 * Handles tab navigation, header metrics synchronization,
 * theme toggling, and global pub/sub reactions.
 */

import { eventState } from './state.js';
import { renderBlueprintView } from './components/blueprintView.js';
import { renderBudgetView } from './components/budgetView.js';
import { renderVendorView } from './components/vendorView.js';
import { renderTimelineView } from './components/timelineView.js';
import { renderGuestView } from './components/guestView.js';
import { renderCopilotView } from './components/copilotView.js';
import { setupApiKeyModal } from './components/apiKeyModal.js';
import { setupExportModal } from './components/exportModal.js';
import { calculateEventCountdown } from './timelineScheduler.js';

let currentTab = 'blueprint';

function initApp() {
  const mainContent = document.querySelector('#main-content');
  const navTabs = document.querySelectorAll('.nav-tab');

  // 1. Navigation Tab Switching
  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');
      switchTab(target);
    });
  });

  // 2. Initialize Modals
  setupApiKeyModal();
  setupExportModal();

  // 3. Theme Toggle Setup
  setupThemeToggle();

  // 4. Header Synchronization
  syncHeaderData();

  // 5. Subscribe to State Changes
  eventState.subscribe('stateChanged', () => {
    syncHeaderData();
    renderCurrentTab();
  });

  eventState.subscribe('presetLoaded', (presetKey) => {
    showToast(`Loaded ${presetKey.toUpperCase()} celebration scenario.`);
    syncHeaderData();
    renderCurrentTab();
  });

  // 6. Keyboard accessibility for tabs
  setupTabAccessibility(navTabs);

  // 7. Initial Render
  renderCurrentTab();
}

function switchTab(tabId) {
  currentTab = tabId;
  const navTabs = document.querySelectorAll('.nav-tab');
  navTabs.forEach(tab => {
    const isMatch = tab.getAttribute('data-tab') === tabId;
    tab.classList.toggle('active', isMatch);
    tab.setAttribute('aria-selected', isMatch ? 'true' : 'false');
  });

  renderCurrentTab();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderCurrentTab() {
  const container = document.querySelector('#main-content');
  if (!container) return;

  switch (currentTab) {
    case 'blueprint':
      renderBlueprintView(container);
      break;
    case 'budget':
      renderBudgetView(container);
      break;
    case 'vendor':
      renderVendorView(container);
      break;
    case 'timeline':
      renderTimelineView(container);
      break;
    case 'guests':
      renderGuestView(container);
      break;
    case 'copilot':
      renderCopilotView(container);
      break;
    default:
      renderBlueprintView(container);
  }
}

function syncHeaderData() {
  const state = eventState.getState();
  const metrics = eventState.getBudgetMetrics();
  const countdown = calculateEventCountdown(state.date);

  const titleEl = document.querySelector('#header-event-title');
  const budgetPill = document.querySelector('#header-budget-pill');
  const countdownPill = document.querySelector('#header-countdown-pill');

  if (titleEl) titleEl.textContent = state.title;
  if (budgetPill) {
    budgetPill.innerHTML = `<strong>${state.currency}${metrics.allocated.toLocaleString()}</strong> / ${state.currency}${Number(state.totalBudget).toLocaleString()}`;
    budgetPill.className = `header-pill ${metrics.isOverbudget ? 'pill-danger' : 'pill-success'}`;
  }
  if (countdownPill) {
    countdownPill.textContent = `⏳ ${countdown.days}d to event`;
  }
}

function setupThemeToggle() {
  const toggleBtn = document.querySelector('#btn-theme-toggle');
  const currentTheme = localStorage.getItem('festivaplan_theme') || 'light';

  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(toggleBtn, currentTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const active = document.documentElement.getAttribute('data-theme') || 'dark';
      const nextTheme = active === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('festivaplan_theme', nextTheme);
      updateThemeIcon(toggleBtn, nextTheme);
    });
  }
}

function updateThemeIcon(btn, theme) {
  if (!btn) return;
  btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
  btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
}

function setupTabAccessibility(navTabs) {
  navTabs.forEach((tab, index) => {
    tab.addEventListener('keydown', (e) => {
      let targetIndex = null;
      if (e.key === 'ArrowRight') {
        targetIndex = (index + 1) % navTabs.length;
      } else if (e.key === 'ArrowLeft') {
        targetIndex = (index - 1 + navTabs.length) % navTabs.length;
      }

      if (targetIndex !== null) {
        navTabs[targetIndex].focus();
        navTabs[targetIndex].click();
      }
    });
  });
}

function showToast(msg) {
  const toast = document.createElement('div');
  toast.className = 'festiva-toast animate-slide-up';
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

// Bootstrap on DOM ready
document.addEventListener('DOMContentLoaded', initApp);
