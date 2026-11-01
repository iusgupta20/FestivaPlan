/**
 * FestivaPlan AI - Budget & Trade-Off View Component
 * Features interactive spend sliders, real-time variance tracking,
 * What-If cost surge simulation, and 1-click AI auto-rebalancing.
 */

import { eventState } from '../state.js';
import { analyzeBudgetHealth, solveWhatIfCostSurge, autoRebalanceBudget } from '../tradeoffOptimizer.js';
import { aiEngine } from '../aiEngine.js';

export function renderBudgetView(container) {
  const state = eventState.getState();
  const metrics = eventState.getBudgetMetrics();
  const health = analyzeBudgetHealth(state.totalBudget, state.budgetItems);
  const cur = state.currency || '$';

  container.innerHTML = `
    <div class="budget-container animate-fade-in">
      <!-- KPI Strip -->
      <section class="kpi-grid" aria-label="Budget Key Performance Indicators">
        <div class="kpi-card">
          <span class="kpi-label">Total Cap</span>
          <div class="kpi-value">${cur}${Number(state.totalBudget).toLocaleString()}</div>
          <span class="kpi-hint">Authorized celebration cap</span>
        </div>
        <div class="kpi-card ${metrics.isOverbudget ? 'kpi-danger' : 'kpi-success'}">
          <span class="kpi-label">Allocated / Actual</span>
          <div class="kpi-value">${cur}${metrics.allocated.toLocaleString()}</div>
          <span class="kpi-hint">${((metrics.allocated / metrics.total) * 100).toFixed(1)}% of total authorized</span>
        </div>
        <div class="kpi-card ${metrics.isOverbudget ? 'kpi-danger' : 'kpi-neutral'}">
          <span class="kpi-label">${metrics.isOverbudget ? 'Deficit (Over Budget)' : 'Remaining Buffer'}</span>
          <div class="kpi-value ${metrics.isOverbudget ? 'text-danger' : 'text-success'}">
            ${metrics.isOverbudget ? '-' : '+'}${cur}${Math.abs(metrics.difference).toLocaleString()}
          </div>
          <span class="kpi-hint">${metrics.isOverbudget ? `Over budget by ${metrics.overbudgetPercent}%` : 'Unassigned reserve'}</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">Per-Guest Velocity</span>
          <div class="kpi-value">${cur}${metrics.perGuestSpend.toLocaleString()}</div>
          <span class="kpi-hint">Across ${state.guestCount} invited guests</span>
        </div>
      </section>

      <!-- Overbudget Emergency Action Banner -->
      ${metrics.isOverbudget ? `
        <div class="alert-banner alert-danger" role="alert" id="overbudget-banner">
          <div class="alert-icon">⚠️</div>
          <div class="alert-content">
            <h4>Budget Exceeded by ${cur}${metrics.overbudgetAmount.toLocaleString()} (${metrics.overbudgetPercent}%)</h4>
            <p>Your current planned expenses exceed the allocated cap. Use our mathematical constraint optimizer to restore balance without losing core quality.</p>
          </div>
          <button class="btn btn-warning" id="btn-auto-rebalance">
            ⚡ Auto-Rebalance Budget with AI
          </button>
        </div>
      ` : ''}

      <!-- What-If Cost Surge Simulation Console -->
      <section class="section-card what-if-card" aria-labelledby="what-if-title">
        <div class="section-header">
          <div class="header-left">
            <span class="section-icon">⚖️</span>
            <div>
              <h2 id="what-if-title">"What-If" Cost Surge & Trade-Off Simulator</h2>
              <p class="section-desc">Experience real-world decision making: test price spikes (e.g. caterer fee increase) and let AI generate tactical offset trade-offs.</p>
            </div>
          </div>
          <button class="btn btn-outline btn-sm" id="btn-export-budget-csv">
            📥 Export Budget CSV
          </button>
        </div>

        <div class="what-if-form-bar">
          <div class="form-group">
            <label for="select-surge-category">Surge In Category:</label>
            <select id="select-surge-category" class="form-select">
              ${(state.budgetItems || []).map(item => `
                <option value="${item.id}">${item.category} (Current: ${cur}${Number(item.actual || item.target).toLocaleString()})</option>
              `).join('')}
            </select>
          </div>
          <div class="form-group">
            <label for="input-surge-amount">Cost Surge Amount (${cur}):</label>
            <input type="number" id="input-surge-amount" class="form-input" value="${state.type === 'wedding' ? 50000 : 1000}" step="500" min="100">
          </div>
          <button class="btn btn-primary" id="btn-run-what-if">
            <span>⚡</span> Solve Trade-Offs
          </button>
        </div>

        <!-- Simulation Results Area -->
        <div id="what-if-results-container" class="what-if-results hidden"></div>
      </section>

      <!-- Category Allocation Breakdown Table -->
      <section class="section-card category-breakdown-card" aria-labelledby="breakdown-title">
        <div class="section-header">
          <div class="header-left">
            <span class="section-icon">📊</span>
            <div>
              <h2 id="breakdown-title">Itemized Category Allocations & Flexibility</h2>
              <p class="section-desc">Drag sliders or type exact values to adjust live vendor allocations. Variance updates dynamically.</p>
            </div>
          </div>
          <div class="header-actions">
            <button class="btn btn-secondary btn-sm" id="btn-reset-targets">
              ↺ Reset to Target Baseline
            </button>
          </div>
        </div>

        <div class="budget-items-list" id="budget-items-list">
          ${(state.budgetItems || []).map(item => {
            const actual = Number(item.actual) || Number(item.target) || 0;
            const target = Number(item.target) || 0;
            const variance = actual - target;
            const maxSlider = Math.max(actual * 1.8, target * 1.8, 1000);
            const percentOfTotal = ((actual / (state.totalBudget || 1)) * 100).toFixed(1);

            return `
              <div class="budget-item-row" data-id="${item.id}">
                <div class="item-meta">
                  <div class="item-title-row">
                    <strong class="item-name">${item.category}</strong>
                    <div class="item-badges">
                      <span class="badge ${getPriorityBadge(item.priority)}">${item.priority} Priority</span>
                      <span class="badge ${getFlexibilityBadge(item.flexibility)}">${item.flexibility} Flexibility</span>
                    </div>
                  </div>
                  <p class="item-notes">${item.notes || ''}</p>
                </div>

                <div class="item-slider-col">
                  <div class="slider-labels">
                    <span>Target: ${cur}${target.toLocaleString()}</span>
                    <span class="item-actual-text"><strong>${cur}${actual.toLocaleString()}</strong> (${percentOfTotal}%)</span>
                  </div>
                  <input type="range" class="slider-input" min="0" max="${maxSlider}" step="${state.type === 'wedding' ? 5000 : 100}" value="${actual}" data-id="${item.id}">
                </div>

                <div class="item-input-col">
                  <div class="input-prefix-wrap">
                    <span class="input-prefix">${cur}</span>
                    <input type="number" class="actual-input form-input form-input-sm" value="${actual}" data-id="${item.id}">
                  </div>
                  <div class="variance-tag ${variance > 0 ? 'var-over' : variance < 0 ? 'var-under' : 'var-even'}">
                    ${variance > 0 ? `+${cur}${variance.toLocaleString()}` : variance < 0 ? `-${cur}${Math.abs(variance).toLocaleString()}` : 'On Target'}
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </section>
    </div>
  `;

  // Attach event handlers
  // Auto-Rebalance Button
  const autoRebalBtn = container.querySelector('#btn-auto-rebalance');
  if (autoRebalBtn) {
    autoRebalBtn.addEventListener('click', () => {
      const rebalanced = autoRebalanceBudget(state.budgetItems, state.totalBudget);
      eventState.setBudgetItems(rebalanced);
      showToast('✅ Budget successfully rebalanced to 100% capacity using priority constraints!');
      renderBudgetView(container);
    });
  }

  // Reset to Target
  const resetBtn = container.querySelector('#btn-reset-targets');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      const resetItems = state.budgetItems.map(i => ({
        ...i,
        actual: Number(i.target) || 0
      }));
      eventState.setBudgetItems(resetItems);
      showToast('↺ All allocations restored to baseline targets.');
      renderBudgetView(container);
    });
  }

  // Live Slider & Input Sync
  container.querySelectorAll('.slider-input').forEach(slider => {
    slider.addEventListener('input', (e) => {
      const id = slider.getAttribute('data-id');
      const val = Number(e.target.value);
      eventState.updateBudgetItem(id, { actual: val });
      renderBudgetView(container);
    });
  });

  container.querySelectorAll('.actual-input').forEach(inp => {
    inp.addEventListener('change', (e) => {
      const id = inp.getAttribute('data-id');
      const val = Math.max(0, Number(e.target.value));
      eventState.updateBudgetItem(id, { actual: val });
      renderBudgetView(container);
    });
  });

  // What-If Tradeoff Simulator
  const runWhatIfBtn = container.querySelector('#btn-run-what-if');
  const resultsContainer = container.querySelector('#what-if-results-container');
  if (runWhatIfBtn && resultsContainer) {
    runWhatIfBtn.addEventListener('click', async () => {
      const categoryId = container.querySelector('#select-surge-category').value;
      const surgeAmount = Number(container.querySelector('#input-surge-amount').value) || 0;

      runWhatIfBtn.disabled = true;
      runWhatIfBtn.innerHTML = '<span class="spinner"></span> Simulating Trade-Offs...';

      try {
        const tradeOffResult = solveWhatIfCostSurge(state.budgetItems, state.totalBudget, categoryId, surgeAmount);
        renderWhatIfResults(resultsContainer, tradeOffResult, cur, container);
        resultsContainer.classList.remove('hidden');
      } catch (err) {
        console.error('Error running what-if trade-off solver', err);
      } finally {
        runWhatIfBtn.disabled = false;
        runWhatIfBtn.innerHTML = '<span>⚡</span> Solve Trade-Offs';
      }
    });
  }

  // Export CSV
  const exportCsvBtn = container.querySelector('#btn-export-budget-csv');
  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', () => {
      exportBudgetCSV(state);
    });
  }
}

function renderWhatIfResults(container, result, cur, parentView) {
  if (!result || !result.packages || result.packages.length === 0) {
    container.innerHTML = '<p class="text-muted">No trade-off packages required.</p>';
    return;
  }

  container.innerHTML = `
    <div class="what-if-packages-wrapper animate-fade-in">
      <div class="what-if-header">
        <h4>⚡ AI Trade-Off Packages to Absorb +${cur}${result.surgeAmount.toLocaleString()} in ${result.targetCategory}:</h4>
        <p>Choose an optimal compromise strategy to automatically reallocate vendor allocations:</p>
      </div>
      <div class="packages-grid">
        ${result.packages.map(pkg => `
          <div class="package-card" id="${pkg.id}">
            <div class="pkg-header">
              <span class="pkg-tag">${pkg.tag}</span>
              <h5>${pkg.name}</h5>
              <p class="pkg-summary">${pkg.summary}</p>
            </div>
            <div class="pkg-cuts-list">
              <strong>Proposed Reallocations:</strong>
              <ul>
                ${pkg.cuts.map(cut => `
                  <li>
                    <span class="cut-category"><strong>${cut.category}</strong>: -${cur}${cut.cutAmount.toLocaleString()}</span>
                    <span class="cut-tactical">${cut.tacticalAction}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
            <div class="pkg-footer">
              <span class="pkg-savings">Total Offset: <strong>${cur}${pkg.totalSavings.toLocaleString()}</strong></span>
              <button class="btn btn-primary btn-sm btn-apply-pkg" data-pkg-id="${pkg.id}">
                Apply This Package
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // Attach apply handler
  container.querySelectorAll('.btn-apply-pkg').forEach(btn => {
    btn.addEventListener('click', () => {
      const pkgId = btn.getAttribute('data-pkg-id');
      const chosen = result.packages.find(p => p.id === pkgId);
      if (chosen) {
        // Apply cuts
        for (const cut of chosen.cuts) {
          eventState.updateBudgetItem(cut.id, { actual: cut.newAmount });
        }
        // Also apply surge to target category
        const targetItem = eventState.getState().budgetItems.find(i => i.category === result.targetCategory);
        if (targetItem) {
          eventState.updateBudgetItem(targetItem.id, {
            actual: (Number(targetItem.actual) || Number(targetItem.target)) + result.surgeAmount
          });
        }
        showToast(`✅ Applied "${chosen.name}"! Budget successfully realigned.`);
        renderBudgetView(parentView);
      }
    });
  });
}

function exportBudgetCSV(state) {
  const cur = state.currency || '$';
  let csv = 'Category,Priority,Flexibility,Target Allocation,Actual Planned,Variance,Notes\n';

  for (const item of (state.budgetItems || [])) {
    const actual = Number(item.actual) || Number(item.target) || 0;
    const target = Number(item.target) || 0;
    const diff = actual - target;
    csv += `"${item.category}","${item.priority}","${item.flexibility}",${target},${actual},${diff},"${(item.notes || '').replace(/"/g, '""')}"\n`;
  }

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${state.title.replace(/\s+/g, '_')}_Budget.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('📥 Budget CSV exported successfully.');
}

function getPriorityBadge(p) {
  if (p === 'Critical' || p === 'High') return 'badge-danger';
  if (p === 'Medium') return 'badge-amber';
  return 'badge-neutral';
}

function getFlexibilityBadge(f) {
  if (f === 'High') return 'badge-teal';
  if (f === 'Medium') return 'badge-neutral';
  return 'badge-danger';
}

function showToast(msg) {
  const toast = document.createElement('div');
  toast.className = 'festiva-toast animate-slide-up';
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 400);
  }, 3200);
}
