/**
 * FestivaPlan AI - Conversational AI Copilot View Component
 * Provides an interactive chat drawer with quick suggestion chips,
 * conversational memory, and context-aware responses.
 */

import { eventState } from '../state.js';
import { aiEngine } from '../aiEngine.js';

let conversationHistory = [];

export function renderCopilotView(container) {
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
            <span class="chat-avatar">🤖</span>
            <div>
              <h3>FestivaPlan Event Copilot</h3>
              <p class="chat-context-badge">
                Active Context: <strong>${state.title}</strong> (${state.type}) · ${state.guestCount} Guests · ${state.currency}${Number(state.totalBudget).toLocaleString()}
              </p>
            </div>
          </div>
          <div class="chat-header-actions">
            <button class="btn btn-ghost btn-sm" id="btn-clear-chat" title="Clear Conversation">
              🧹 Clear Chat
            </button>
          </div>
        </div>

        <!-- Quick Starter Chips -->
        <div class="quick-chips-row" aria-label="Suggested Prompt Starters">
          <button class="chip-btn" data-prompt="How can we trim 10% of expenses without compromising food quality?">
            💡 Trim 10% Budget Safely
          </button>
          <button class="chip-btn" data-prompt="What is our exact 24h weather contingency protocol for sudden rain?">
            🌧️ Rain Contingency Plan
          </button>
          <button class="chip-btn" data-prompt="How can we keep 30 kids engaged during formal speeches and dinner?">
            👶 Entertain Kids During Speeches
          </button>
          <button class="chip-btn" data-prompt="What should we negotiate before signing contracts with our caterer?">
            📜 Vendor Contract Checklist
          </button>
        </div>

        <!-- Chat Messages Scroll Box -->
        <div class="chat-messages-box" id="chat-messages-box">
          ${conversationHistory.map(msg => renderChatMessage(msg)).join('')}
        </div>

        <!-- Input Box -->
        <form id="form-copilot-chat" class="chat-input-form">
          <div class="chat-input-wrap">
            <input type="text" id="copilot-input-text" class="form-input chat-input" placeholder="Ask about budgets, vendor trade-offs, timelines, or guest comfort..." autocomplete="off" required>
            <button type="submit" class="btn btn-primary btn-chat-send" id="btn-chat-send">
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

  // Scroll to bottom
  if (messagesBox) messagesBox.scrollTop = messagesBox.scrollHeight;

  // Handle Quick Chips
  container.querySelectorAll('.chip-btn').forEach(chip => {
    chip.addEventListener('click', () => {
      const prompt = chip.getAttribute('data-prompt');
      if (chatInput) {
        chatInput.value = prompt;
        chatForm.dispatchEvent(new Event('submit'));
      }
    });
  });

  // Handle Send Form
  if (chatForm && chatInput && messagesBox) {
    chatForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (!text) return;

      // Add user message
      const userMsg = { sender: 'user', time: getCurrentTimeStr(), text };
      conversationHistory.push(userMsg);
      appendMessageToDOM(messagesBox, userMsg);
      chatInput.value = '';

      // Add loading indicator
      const loadingEl = document.createElement('div');
      loadingEl.className = 'chat-bubble bubble-ai loading-bubble animate-pulse';
      loadingEl.innerHTML = '<span class="spinner"></span> Consulting Event Copilot...';
      messagesBox.appendChild(loadingEl);
      messagesBox.scrollTop = messagesBox.scrollHeight;

      try {
        const apiKey = eventState.getApiKey();
        const res = await aiEngine.chatWithCopilot(eventState.getState(), text, conversationHistory, apiKey);
        loadingEl.remove();

        const aiMsg = { sender: 'ai', time: getCurrentTimeStr(), text: res.text, mode: res.mode };
        conversationHistory.push(aiMsg);
        appendMessageToDOM(messagesBox, aiMsg);
      } catch (err) {
        console.error('Chat error', err);
        loadingEl.remove();
        const errBubble = { sender: 'ai', time: getCurrentTimeStr(), text: 'Sorry, I encountered an issue processing that query. Please try again.' };
        conversationHistory.push(errBubble);
        appendMessageToDOM(messagesBox, errBubble);
      }
    });
  }

  // Handle Clear Chat
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      conversationHistory = [];
      renderCopilotView(container);
    });
  }
}

function renderChatMessage(msg) {
  const isUser = msg.sender === 'user';
  return `
    <div class="chat-message-row ${isUser ? 'msg-user' : 'msg-ai'} animate-fade-in">
      <div class="chat-bubble ${isUser ? 'bubble-user' : 'bubble-ai'}">
        <div class="bubble-header">
          <strong class="bubble-sender">${isUser ? 'You' : 'FestivaPlan AI'}</strong>
          <span class="bubble-time">${msg.time}</span>
          ${msg.mode ? `<span class="bubble-mode-tag">${msg.mode}</span>` : ''}
        </div>
        <div class="bubble-content markdown-body">
          ${formatMarkdown(msg.text)}
        </div>
      </div>
    </div>
  `;
}

function appendMessageToDOM(container, msg) {
  const temp = document.createElement('div');
  temp.innerHTML = renderChatMessage(msg);
  container.appendChild(temp.firstElementChild);
  container.scrollTop = container.scrollHeight;
}

function getCurrentTimeStr() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatMarkdown(text) {
  if (!text) return '';
  let html = escapeHtml(text);
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
  html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
  html = html.replace(/<\/li>\n<li>/gim, '</li><li>');
  html = html.replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>');
  html = html.replace(/\n\n/gim, '</p><p>');
  html = html.replace(/\n/gim, '<br>');
  return `<p>${html}</p>`;
}
