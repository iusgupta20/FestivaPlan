/**
 * FestivaPlan AI - API Key Settings Modal
 * Securely manages optional Google Gemini API key with session storage,
 * live connection testing, and clear zero-leakage security boundaries.
 */

import { eventState } from '../state.js';
import { aiEngine } from '../aiEngine.js';
import { escapeHtml } from '../utils/sanitize.js';

export function setupApiKeyModal() {
  const modal = document.querySelector('#modal-api-key');
  const openBtn = document.querySelector('#btn-open-api-modal');
  const closeBtn = document.querySelector('#btn-close-api-modal');
  const form = document.querySelector('#form-api-key');
  const input = document.querySelector('#input-gemini-key');
  const testBtn = document.querySelector('#btn-test-api-key');
  const statusEl = document.querySelector('#api-test-status');
  const clearBtn = document.querySelector('#btn-clear-api-key');

  if (!modal) return;

  if (openBtn) {
    openBtn.addEventListener('click', () => {
      const currentKey = eventState.getApiKey();
      if (input) input.value = currentKey;
      if (statusEl) statusEl.innerHTML = '';
      modal.showModal();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => modal.close());
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      eventState.setApiKey('');
      if (input) input.value = '';
      if (statusEl) {
        statusEl.innerHTML = '<span class="text-teal">Key cleared. Operating in built-in Cognitive AI mode.</span>';
      }
      showToast('API key removed from browser memory.');
      updateHeaderBadge();
    });
  }

  if (testBtn && input && statusEl) {
    testBtn.addEventListener('click', async () => {
      const key = input.value.trim();
      if (!key) {
        statusEl.innerHTML = '<span class="text-warning">Please enter an API key to test.</span>';
        return;
      }

      testBtn.disabled = true;
      testBtn.innerHTML = '<span class="spinner" aria-hidden="true"></span> Testing connection...';
      statusEl.innerHTML = '';

      try {
        await aiEngine.callGeminiAPI('Ping test: Respond with single word "ONLINE"', key);
        statusEl.innerHTML = '<span class="text-success">✅ Connection Successful! Google Gemini API is live and verified.</span>';
        eventState.setApiKey(key);
        updateHeaderBadge();
      } catch (err) {
        statusEl.innerHTML = `<span class="text-danger">❌ Connection error: ${escapeHtml(err.message)}</span>`;
      } finally {
        testBtn.disabled = false;
        testBtn.innerHTML = '🧪 Test Live Connection';
      }
    });
  }

  if (form && input) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const key = input.value.trim();
      eventState.setApiKey(key);
      updateHeaderBadge();
      modal.close();
      showToast(key ? '✨ Gemini Live API enabled!' : '🧠 Built-in Cognitive Engine active.');
    });
  }

  // Initial badge update
  updateHeaderBadge();
}

function updateHeaderBadge() {
  const badge = document.querySelector('#header-ai-status-badge');
  if (badge) {
    if (eventState.hasApiKey()) {
      badge.className = 'badge badge-success';
      badge.textContent = '✨ Gemini Live Active';
    } else {
      badge.className = 'badge badge-teal';
      badge.textContent = '🧠 Cognitive Engine (100% Offline Ready)';
    }
  }
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
