/**
 * FestivaPlan AI - Conversational AI Copilot View Component
 * Provides an interactive chat drawer with quick suggestion chips,
 * conversational memory, and context-aware responses.
 */

import { eventState } from '../state.js';
import { aiEngine } from '../aiEngine.js';
import { escapeHtml, formatMarkdown } from '../utils/sanitize.js';

let conversationHistory = [];

export function renderCopilotView(container) {
  if (!container) return;
  const state = eventState.getState();

  if (conversationHistory.length === 0) {
    conversationHistory = [
      {
        sender: 'ai',
        time: 'Just now',
        text: `Hello! I'm your **FestivaPlan AI Assistant**. I'm actively analyzing **"${state.title}"** with a budget of ${state.currency}${Number(state.totalBudget).toLocaleString()} across ${state.guestCount} guests.\n\nAsk me anything: simulated budget trade-offs, vendor contract pitfalls, weather contingencies, or guest seating ideas!`
      }
    ];
  }

  container.innerHTML = `
    <div class="copilot-container animate-fade-in">
      <section class="section-card copilot-chat-card" aria-label="AI Event Copilot Chat">
        <div class="chat-header">
          <div class="chat-title-group">
            <span class="chat-avatar" aria-hidden="true">🤖</span>
            <div>
              <h3>FestivaPlan Event Copilot</h3>
              <p class="chat-context-badge">
                Active Context: <strong>${escapeHtml(state.title)}</strong> (${escapeHtml(state.type)}) · ${escapeHtml(state.guestCount)} Guests · ${escapeHtml(state.currency)}${Number(state.totalBudget).toLocaleString()}
              </p>
            </div>
          </div>
          <div class="chat-header-actions">
            <button type="button" class="btn btn-ghost btn-sm" id="btn-clear-chat" title="Clear Conversation" aria-label="Clear chat conversation">
              🧹 Clear Chat
            </button>
          </div>
        </div>

        <!-- Quick Starter Chips -->
        <div class="quick-chips-row" aria-label="Suggested Prompt Starters">
          <button type="button" class="chip-btn" data-prompt="How can we trim 10% of expenses without compromising food quality?" aria-label="Ask: Trim 10% Budget Safely">
            💡 Trim 10% Budget Safely
          </button>
          <button type="button" class="chip-btn" data-prompt="What is our exact 24h weather contingency protocol for sudden rain?" aria-label="Ask: Rain Contingency Plan">
            🌧️ Rain Contingency Plan
          </button>
          <button type="button" class="chip-btn" data-prompt="How can we keep 30 kids engaged during formal speeches and dinner?" aria-label="Ask: Entertain Kids During Speeches">
            👶 Entertain Kids During Speeches
          </button>
          <button type="button" class="chip-btn" data-prompt="What should we negotiate before signing contracts with our caterer?" aria-label="Ask: Vendor Contract Checklist">
            📜 Vendor Contract Checklist
          </button>
        </div>

        <!-- Chat Messages Scroll Box -->
        <div class="chat-messages-box" id="chat-messages-box" role="log" aria-live="polite">
          ${conversationHistory.map(msg => renderChatMessage(msg)).join('')}
        </div>

        <!-- Input Box -->
        <form id="form-copilot-chat" class="chat-input-form">
          <div class="chat-input-wrap">
            <input type="text" id="copilot-input-text" class="form-input chat-input" placeholder="Ask about budgets, vendor trade-offs, timelines, or guest comfort..." autocomplete="off" required aria-label="Type your message to Event Copilot">
            <button type="submit" class="btn btn-primary btn-chat-send" id="btn-chat-send" aria-label="Send message">
              <span>Send</span> ➔
            </button>
          </div>
        </form>
      </section>
    </div>
  `;

  const messagesBox = container.querySelector('#chat-messages-box');
  const chatForm = container.querySelector('#form-copilot-chat');
  const chatInput = container.querySelector('#copilot-input-text');
  const clearBtn = container.querySelector('#btn-clear-chat');

  // Quick Chips
  container.querySelectorAll('.chip-btn').forEach(chip => {
    chip.addEventListener('click', () => {
      const prompt = chip.getAttribute('data-prompt');
      if (prompt && chatInput) {
        chatInput.value = prompt;
        chatForm.requestSubmit();
      }
    });
  });

  // Clear Chat
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      conversationHistory = [
        {
          sender: 'ai',
          time: 'Just now',
          text: `Chat reset. Ready to assist with **"${state.title}"**!`
        }
      ];
      renderCopilotView(container);
    });
  }

  // Chat Submission
  if (chatForm) {
    chatForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const userText = chatInput.value.trim();
      if (!userText) return;

      chatInput.value = '';

      // Append User Message
      const userMsg = {
        sender: 'user',
        time: getCurrentTimeStr(),
        text: userText
      };
      conversationHistory.push(userMsg);
      appendMessageToDOM(messagesBox, userMsg);

      // Loading Indicator
      const loadingEl = document.createElement('div');
      loadingEl.className = 'chat-message-row ai-message';
      loadingEl.innerHTML = '<span class="spinner" aria-hidden="true"></span> Consulting Event Copilot...';
      messagesBox.appendChild(loadingEl);
      messagesBox.scrollTop = messagesBox.scrollHeight;

      // Call AI Engine
      try {
        const apiKey = eventState.getApiKey();
        const response = await aiEngine.chatWithCopilot(userText, state, apiKey, conversationHistory);
        loadingEl.remove();

        const aiMsg = {
          sender: 'ai',
          time: getCurrentTimeStr(),
          text: response.text,
          mode: response.mode
        };
        conversationHistory.push(aiMsg);
        appendMessageToDOM(messagesBox, aiMsg);
      } catch (err) {
        loadingEl.remove();
        const errReply = {
          sender: 'ai',
          time: getCurrentTimeStr(),
          text: `I apologize, but I encountered an issue: ${escapeHtml(err.message)}. Falling back to deterministic mode.`,
          mode: 'Offline Safe Mode'
        };
        conversationHistory.push(errReply);
        appendMessageToDOM(messagesBox, errReply);
      }
    });
  }
}

function renderChatMessage(msg) {
  const isUser = msg.sender === 'user';
  return `
    <div class="chat-message-row ${isUser ? 'user-message' : 'ai-message'} animate-slide-up">
      <div class="message-bubble ${isUser ? 'bubble-user' : 'bubble-ai'}">
        <div class="bubble-header">
          <strong class="bubble-sender">${isUser ? 'You' : 'FestivaPlan AI'}</strong>
          <span class="bubble-time">${escapeHtml(msg.time)}</span>
          ${msg.mode ? `<span class="bubble-mode-tag">${escapeHtml(msg.mode)}</span>` : ''}
        </div>
        <div class="bubble-content markdown-body">
          ${formatMarkdown(msg.text)}
        </div>
      </div>
    </div>
  `;
}

function appendMessageToDOM(container, msg) {
  if (!container) return;
  const temp = document.createElement('div');
  temp.innerHTML = renderChatMessage(msg);
  if (temp.firstElementChild) {
    container.appendChild(temp.firstElementChild);
    container.scrollTop = container.scrollHeight;
  }
}

function getCurrentTimeStr() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
