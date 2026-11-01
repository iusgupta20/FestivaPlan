/**
 * FestivaPlan AI - Vendor Coordination & Quotation Matrix View
 * Features multi-attribute utility comparison, AI contract evaluation badges,
 * status workflows, and automated vendor RFP generation.
 */

import { eventState } from '../state.js';
import { scoreVendorQuotation, generateVendorRFP } from '../vendorScorer.js';

let activeCategoryFilter = 'all';

export function renderVendorView(container) {
  const state = eventState.getState();
  const cur = state.currency || '$';
  const vendors = state.vendors || [];

  // Extract unique categories
  const categories = ['all', ...new Set(vendors.map(v => v.category))];

  const filteredVendors = activeCategoryFilter === 'all'
    ? vendors
    : vendors.filter(v => v.category === activeCategoryFilter);

  container.innerHTML = `
    <div class="vendor-container animate-fade-in">
      <!-- Section Header -->
      <section class="section-card vendor-header-card" aria-labelledby="vendor-title">
        <div class="section-header">
          <div class="header-left">
            <span class="section-icon">🤝</span>
            <div>
              <h2 id="vendor-title">Vendor Coordination & Quotation Comparison Matrix</h2>
              <p class="section-desc">Evaluate proposals using our Multi-Attribute Utility scoring engine (Quality vs Price vs Flexibility vs Perks). Compare terms side-by-side.</p>
            </div>
          </div>
          <button class="btn btn-primary btn-sm" id="btn-open-add-vendor-modal">
            <span>➕</span> Add Vendor Proposal
          </button>
        </div>

        <!-- Category Filter Pills -->
        <div class="filter-pills-bar" role="tablist" aria-label="Vendor Categories">
          ${categories.map(cat => `
            <button class="filter-pill ${activeCategoryFilter === cat ? 'active' : ''}" data-cat="${cat}">
              ${cat === 'all' ? 'All Partners (' + vendors.length + ')' : cat}
            </button>
          `).join('')}
        </div>
      </section>

      <!-- Vendor Cards Grid -->
      <div class="vendor-cards-grid" id="vendor-cards-grid">
        ${filteredVendors.length === 0 ? `
          <div class="empty-state">
            <span class="empty-icon">📂</span>
            <h4>No vendors found in this category.</h4>
            <p>Click "Add Vendor Proposal" above to compare a new quote.</p>
          </div>
        ` : filteredVendors.map(vendor => {
          // Find target category budget
          const budgetItem = (state.budgetItems || []).find(b => b.category === vendor.category);
          const targetBudget = budgetItem ? (Number(budgetItem.target) || vendor.quoteAmount) : vendor.quoteAmount;
          const scoreData = scoreVendorQuotation(vendor, targetBudget, vendors);

          return `
            <div class="vendor-card glassmorphism" data-id="${vendor.id}">
              <div class="vendor-card-header">
                <div class="vendor-title-wrap">
                  <span class="vendor-category-badge">${vendor.category}</span>
                  <h3 class="vendor-name">${vendor.name}</h3>
                  <div class="vendor-rating-row">
                    <span class="stars">${renderStars(vendor.rating)}</span>
                    <strong class="rating-number">${vendor.rating}</strong>
                    <span class="rating-sub">/ 5.0</span>
                  </div>
                </div>
                <div class="vendor-score-box">
                  <div class="utility-score-circle">
                    <span class="score-number">${scoreData.compositeScore}</span>
                    <span class="score-label">AI Score</span>
                  </div>
                  <span class="badge ${scoreData.badgeClass}">${scoreData.badge}</span>
                </div>
              </div>

              <!-- Pricing & Deliverables -->
              <div class="vendor-pricing-strip">
                <div class="price-block">
                  <span class="price-label">Quoted Fee:</span>
                  <div class="price-value">${cur}${Number(vendor.quoteAmount).toLocaleString()}</div>
                  <span class="price-target-sub">Target: ${cur}${Number(targetBudget).toLocaleString()}</span>
                </div>
                <div class="overtime-block">
                  <span class="price-label">Overtime Rate:</span>
                  <div class="overtime-value">${cur}${Number(vendor.overtimeRate || 0).toLocaleString()}/hr</div>
                  <span class="price-target-sub">Beyond contract window</span>
                </div>
              </div>

              <!-- Deliverables & Perks -->
              <div class="vendor-details-block">
                <div class="detail-row">
                  <strong>📦 Scope & Deliverables:</strong>
                  <p>${vendor.deliverables || 'Standard event coverage'}</p>
                </div>
                <div class="detail-row">
                  <strong>🎁 Bonus Perks:</strong>
                  <p class="text-teal">${vendor.perks || 'Standard package terms'}</p>
                </div>
                <div class="detail-row">
                  <strong>📜 Cancellation & Rescheduling:</strong>
                  <p class="text-muted">${vendor.cancellationPolicy || 'Standard contract terms'}</p>
                </div>
              </div>

              <!-- AI Analysis Justification -->
              <div class="vendor-ai-rationale">
                <strong>🤖 AI Assessment:</strong>
                <p>${scoreData.recommendation}</p>
              </div>

              <!-- Status & Actions Bar -->
              <div class="vendor-card-actions">
                <div class="status-select-wrap">
                  <label for="vendor-status-${vendor.id}">Status:</label>
                  <select id="vendor-status-${vendor.id}" class="form-select form-select-sm vendor-status-select" data-id="${vendor.id}">
                    <option value="Contacted" ${vendor.status === 'Contacted' ? 'selected' : ''}>⏳ Contacted</option>
                    <option value="Shortlisted" ${vendor.status === 'Shortlisted' ? 'selected' : ''}>⭐ Shortlisted</option>
                    <option value="Confirmed" ${vendor.status === 'Confirmed' ? 'selected' : ''}>✅ Confirmed</option>
                    <option value="Declined" ${vendor.status === 'Declined' ? 'selected' : ''}>❌ Declined</option>
                  </select>
                </div>
                <div class="btn-group">
                  <button class="btn btn-outline btn-sm btn-generate-rfp" data-id="${vendor.id}" title="Generate Formal RFP Inquiry">
                    <span>✉️</span> Generate RFP
                  </button>
                  <button class="btn btn-ghost btn-sm btn-delete-vendor" data-id="${vendor.id}" title="Remove Vendor">
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- Modal: Add Vendor Proposal -->
    <dialog class="festiva-modal" id="modal-add-vendor">
      <div class="modal-box">
        <div class="modal-header">
          <h3>➕ Add Vendor Quotation for Comparison</h3>
          <button class="btn-modal-close" id="btn-close-vendor-modal">✕</button>
        </div>
        <form id="form-add-vendor" class="modal-form">
          <div class="form-group">
            <label for="new-vendor-category">Service Category:</label>
            <select id="new-vendor-category" class="form-select" required>
              ${(state.budgetItems || []).map(b => `<option value="${b.category}">${b.category}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label for="new-vendor-name">Vendor or Agency Name:</label>
            <input type="text" id="new-vendor-name" class="form-input" placeholder="e.g. Royal Beats Sound & Light" required>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="new-vendor-quote">Quoted Amount (${cur}):</label>
              <input type="number" id="new-vendor-quote" class="form-input" placeholder="e.g. 150000" min="1" required>
            </div>
            <div class="form-group">
              <label for="new-vendor-rating">Rating (1.0 - 5.0):</label>
              <input type="number" id="new-vendor-rating" class="form-input" min="1.0" max="5.0" step="0.1" value="4.7" required>
            </div>
          </div>
          <div class="form-group">
            <label for="new-vendor-deliverables">Key Scope Deliverables:</label>
            <input type="text" id="new-vendor-deliverables" class="form-input" placeholder="e.g. 6 hours live band, dual stage sound, wireless mics">
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="new-vendor-overtime">Overtime Hourly Rate (${cur}):</label>
              <input type="number" id="new-vendor-overtime" class="form-input" placeholder="e.g. 5000">
            </div>
            <div class="form-group">
              <label for="new-vendor-perks">Complimentary Perks / Bonuses:</label>
              <input type="text" id="new-vendor-perks" class="form-input" placeholder="e.g. Free ambient uplighting & smoke machine">
            </div>
          </div>
          <div class="form-group">
            <label for="new-vendor-policy">Cancellation & Refund Policy:</label>
            <input type="text" id="new-vendor-policy" class="form-input" placeholder="e.g. Fully refundable up to 21 days prior">
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" id="btn-cancel-vendor-modal">Cancel</button>
            <button type="submit" class="btn btn-primary">Save Proposal & Score with AI</button>
          </div>
        </form>
      </div>
    </dialog>

    <!-- Modal: View & Copy RFP -->
    <dialog class="festiva-modal" id="modal-view-rfp">
      <div class="modal-box modal-box-large">
        <div class="modal-header">
          <h3>✉️ AI-Generated Formal Vendor RFP / Outreach Message</h3>
          <button class="btn-modal-close" id="btn-close-rfp-modal">✕</button>
        </div>
        <div class="modal-body">
          <p class="modal-desc">This formal Request for Proposal is pre-filled with your event's exact date, guest count, dietary notes, and contractual expectations.</p>
          <textarea id="rfp-content-text" class="code-box form-textarea" rows="14" readonly></textarea>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" id="btn-cancel-rfp-modal">Close</button>
          <button type="button" class="btn btn-primary" id="btn-copy-rfp">
            📋 Copy RFP to Clipboard
          </button>
        </div>
      </div>
    </dialog>
  `;

  // Attach filter pill listeners
  container.querySelectorAll('.filter-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      activeCategoryFilter = btn.getAttribute('data-cat');
      renderVendorView(container);
    });
  });

  // Attach status change listener
  container.querySelectorAll('.vendor-status-select').forEach(sel => {
    sel.addEventListener('change', (e) => {
      const id = sel.getAttribute('data-id');
      eventState.updateVendor(id, { status: e.target.value });
      showToast(`Updated status to "${e.target.value}"`);
    });
  });

  // Attach delete vendor listener
  container.querySelectorAll('.btn-delete-vendor').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      if (confirm('Are you sure you want to delete this vendor proposal?')) {
        eventState.deleteVendor(id);
        renderVendorView(container);
        showToast('Vendor deleted.');
      }
    });
  });

  // Attach RFP generator
  const rfpModal = container.querySelector('#modal-view-rfp');
  const rfpTextArea = container.querySelector('#rfp-content-text');
  container.querySelectorAll('.btn-generate-rfp').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const v = vendors.find(item => item.id === id);
      if (v && rfpModal && rfpTextArea) {
        const generated = generateVendorRFP(state, v.category, state.date, state.guestCount, v.perks);
        rfpTextArea.value = generated;
        rfpModal.showModal();
      }
    });
  });

  const copyRfpBtn = container.querySelector('#btn-copy-rfp');
  if (copyRfpBtn && rfpTextArea) {
    copyRfpBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(rfpTextArea.value).then(() => {
        showToast('📋 RFP copied to clipboard!');
        copyRfpBtn.textContent = '✅ Copied!';
        setTimeout(() => copyRfpBtn.textContent = '📋 Copy RFP to Clipboard', 2000);
      });
    });
  }

  // Add Vendor Modal handlers
  const addModal = container.querySelector('#modal-add-vendor');
  const openAddBtn = container.querySelector('#btn-open-add-vendor-modal');
  const closeAddBtn = container.querySelector('#btn-close-vendor-modal');
  const cancelAddBtn = container.querySelector('#btn-cancel-vendor-modal');
  const addForm = container.querySelector('#form-add-vendor');

  if (openAddBtn && addModal) openAddBtn.addEventListener('click', () => addModal.showModal());
  if (closeAddBtn && addModal) closeAddBtn.addEventListener('click', () => addModal.close());
  if (cancelAddBtn && addModal) cancelAddBtn.addEventListener('click', () => addModal.close());

  const closeRfpBtn = container.querySelector('#btn-close-rfp-modal');
  const cancelRfpBtn = container.querySelector('#btn-cancel-rfp-modal');
  if (closeRfpBtn && rfpModal) closeRfpBtn.addEventListener('click', () => rfpModal.close());
  if (cancelRfpBtn && rfpModal) cancelRfpBtn.addEventListener('click', () => rfpModal.close());

  if (addForm && addModal) {
    addForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newVendor = {
        category: container.querySelector('#new-vendor-category').value,
        name: container.querySelector('#new-vendor-name').value,
        quoteAmount: Number(container.querySelector('#new-vendor-quote').value) || 0,
        rating: Number(container.querySelector('#new-vendor-rating').value) || 4.5,
        deliverables: container.querySelector('#new-vendor-deliverables').value || 'Standard deliverables',
        overtimeRate: Number(container.querySelector('#new-vendor-overtime').value) || 0,
        perks: container.querySelector('#new-vendor-perks').value || 'Standard terms',
        cancellationPolicy: container.querySelector('#new-vendor-policy').value || 'Standard cancellation policy',
        status: 'Contacted'
      };

      eventState.addVendor(newVendor);
      addModal.close();
      addForm.reset();
      showToast(`✅ Added "${newVendor.name}"! AI Utility Score computed.`);
      renderVendorView(container);
    });
  }
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
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
