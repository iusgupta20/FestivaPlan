/**
 * FestivaPlan AI - Guest Personalization & Inclusivity View
 * Manages dietary restriction breakdown, allergen directives for kitchen leads,
 * senior & child accessibility checklists, and weather contingency triggers.
 */

import { eventState } from '../state.js';
import { analyzeGuestDemographicsAndDietary } from '../guestManager.js';
import { escapeHtml } from '../utils/sanitize.js';

export function renderGuestView(container) {
  if (!container) return;
  const state = eventState.getState();
  const guests = state.guests || {};
  const analysis = analyzeGuestDemographicsAndDietary(guests);

  container.innerHTML = `
    <div class="guest-container animate-fade-in">
      <!-- RSVP Headcount Overview -->
      <section class="section-card guest-rsvp-card" aria-label="Guest RSVP Overview">
        <div class="section-header">
          <div class="header-left">
            <span class="section-icon">👥</span>
            <div>
              <h2>Guest Demographics & Inclusivity Matrix</h2>
              <p class="section-desc">Move from basic headcount to precise dietary segregation, age accommodations, and venue accessibility compliance.</p>
            </div>
          </div>
        </div>

        <div class="rsvp-stats-grid">
          <div class="rsvp-stat-box">
            <span class="rsvp-stat-label">Total Invited</span>
            <div class="rsvp-stat-num">${analysis.totalGuests}</div>
            <span class="rsvp-stat-hint">Target guest count</span>
          </div>
          <div class="rsvp-stat-box stat-confirmed">
            <span class="rsvp-stat-label">Confirmed Attending</span>
            <div class="rsvp-stat-num text-success">${analysis.confirmedGuests}</div>
            <span class="rsvp-stat-hint">${((analysis.confirmedGuests / (analysis.totalGuests || 1)) * 100).toFixed(0)}% RSVP response rate</span>
          </div>
          <div class="rsvp-stat-box stat-pending">
            <span class="rsvp-stat-label">Pending Response</span>
            <div class="rsvp-stat-num text-warning">${guests.pending || 0}</div>
            <span class="rsvp-stat-hint">Follow-up reminder queued</span>
          </div>
          <div class="rsvp-stat-box">
            <span class="rsvp-stat-label">Declined</span>
            <div class="rsvp-stat-num text-muted">${guests.declined || 0}</div>
            <span class="rsvp-stat-hint">Capacity recovered</span>
          </div>
        </div>
      </section>

      <!-- Dietary Requirements & Kitchen Directives -->
      <section class="section-card dietary-card" aria-labelledby="dietary-title">
        <div class="section-header">
          <div class="header-left">
            <span class="section-icon">🥗</span>
            <div>
              <h3 id="dietary-title">Dietary Distribution & Kitchen Allergen Directives</h3>
              <p class="section-desc">Automated dietary segregation metrics to hand over to executive catering chefs.</p>
            </div>
          </div>
        </div>

        <!-- Dietary Distribution Bars -->
        <div class="dietary-pills-grid">
          ${analysis.dietaryEntries.map(entry => {
            const safeType = escapeHtml(entry.type);
            return `
              <div class="dietary-pill-card">
                <div class="dietary-pill-header">
                  <strong>${safeType}</strong>
                  <span class="dietary-badge">${entry.count} Guests (${entry.percent}%)</span>
                </div>
                <div class="dietary-bar-track" role="progressbar" aria-valuenow="${entry.percent}" aria-valuemin="0" aria-valuemax="100" aria-label="${safeType} dietary proportion">
                  <div class="dietary-bar-fill" style="width: ${Math.min(100, entry.percent * 1.5)}%"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Kitchen Compliance Alerts -->
        <div class="kitchen-alerts-wrapper">
          <h4 class="kitchen-alerts-title">👨‍🍳 Chef & Kitchen Operational Directives:</h4>
          ${analysis.kitchenDirectives.length === 0 ? `
            <p class="text-muted">No high-risk allergen warnings identified.</p>
          ` : analysis.kitchenDirectives.map(dir => {
            const safeSeverity = escapeHtml(dir.severity);
            const safeTitle = escapeHtml(dir.title);
            const safeDesc = escapeHtml(dir.description);
            return `
              <div class="alert-box ${dir.severity === 'CRITICAL' ? 'alert-danger' : dir.severity === 'HIGH' ? 'alert-warning' : 'alert-teal'}" role="alert">
                <div class="alert-box-icon" aria-hidden="true">${dir.severity === 'CRITICAL' ? '🚨' : '⚠️'}</div>
                <div class="alert-box-content">
                  <strong>[${safeSeverity}] ${safeTitle}</strong>
                  <p>${safeDesc}</p>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </section>

      <!-- Age Demographic & Inclusivity Readiness -->
      <section class="section-card inclusivity-card" aria-labelledby="inclusivity-title">
        <div class="section-header">
          <div class="header-left">
            <span class="section-icon">♿</span>
            <div>
              <h3 id="inclusivity-title">Accessibility & Demographic Accommodations</h3>
              <p class="section-desc">Physical venue requirements for elderly guests, toddlers, nursing mothers, and sensory comfort.</p>
            </div>
          </div>
        </div>

        <div class="inclusivity-grid">
          <div class="inclusivity-item-box">
            <div class="inclusivity-title-row">
              <span class="inc-icon" aria-hidden="true">👵</span>
              <div>
                <strong>Seniors & Elders (${guests.demographics?.seniors || 0} Attending)</strong>
                <p>Comfort and physical accessibility checklist</p>
              </div>
            </div>
            <div class="inc-checkbox-list">
              <label class="inc-checkbox-label">
                <input type="checkbox" id="chk-wheelchair" ${guests.accommodations?.wheelchairRamp ? 'checked' : ''} aria-label="Wheelchair Access Ramps">
                <span>Wheelchair Access Ramps (Min 1:12 incline ratio)</span>
              </label>
              <label class="inc-checkbox-label">
                <input type="checkbox" id="chk-quiet-lounge" ${guests.accommodations?.seniorQuietLounge ? 'checked' : ''} aria-label="Dedicated Low-Decibel Quiet Lounge Seating">
                <span>Dedicated Low-Decibel Quiet Lounge Seating</span>
              </label>
              <label class="inc-checkbox-label">
                <input type="checkbox" id="chk-shuttle" ${guests.accommodations?.golfCartShuttle ? 'checked' : ''} aria-label="Golf Cart / Valet Shuttle from Arrival Gate">
                <span>Golf Cart / Valet Shuttle from Arrival Gate</span>
              </label>
            </div>
          </div>

          <div class="inclusivity-item-box">
            <div class="inclusivity-title-row">
              <span class="inc-icon" aria-hidden="true">👶</span>
              <div>
                <strong>Children & Infants (${(guests.demographics?.children || 0) + (guests.demographics?.infants || 0)} Attending)</strong>
                <p>Family hospitality and childcare safeguards</p>
              </div>
            </div>
            <div class="inc-checkbox-list">
              <label class="inc-checkbox-label">
                <input type="checkbox" id="chk-kids-zone" ${guests.accommodations?.kidActivityZone ? 'checked' : ''} aria-label="Soft-Play Mat & Craft Activity Corner">
                <span>Soft-Play Mat & Craft Activity Corner</span>
              </label>
              <label class="inc-checkbox-label">
                <input type="checkbox" id="chk-lactation" ${guests.accommodations?.lactationRoom ? 'checked' : ''} aria-label="Private Nursing & Diaper Changing Facility">
                <span>Private Nursing & Diaper Changing Facility</span>
              </label>
              <label class="inc-checkbox-label">
                <input type="checkbox" id="chk-kids-menu" checked aria-label="Kid-Friendly Finger Buffet & Fruit Purees">
                <span>Kid-Friendly Finger Buffet & Fruit Purees</span>
              </label>
            </div>
          </div>
        </div>
      </section>

      <!-- Weather Contingency Protocol Matrix -->
      <section class="section-card weather-card" aria-labelledby="weather-title">
        <div class="section-header">
          <div class="header-left">
            <span class="section-icon">⛅</span>
            <div>
              <h3 id="weather-title">Weather Contingency & Venue Resilience Protocol</h3>
              <p class="section-desc">Pre-defined trigger points so sudden rain, cold snaps, or heatwaves never derail your celebration.</p>
            </div>
          </div>
        </div>

        <div class="weather-matrix-grid">
          <div class="weather-plan-col">
            <div class="plan-badge-tag tag-success">PLAN A: Primary Layout</div>
            <h4>Outdoor & Lawn Execution</h4>
            <p>${escapeHtml(analysis.weatherAction.planA)}</p>
            <span class="weather-status">Active baseline configuration</span>
          </div>

          <div class="weather-plan-col">
            <div class="plan-badge-tag tag-warning">PLAN B: Weather Backup</div>
            <h4>Rain / Storm Ballroom Hold</h4>
            <p>${escapeHtml(analysis.weatherAction.planB_rain)}</p>
            <span class="weather-status">Tentatively reserved with venue manager</span>
          </div>

          <div class="weather-plan-col">
            <div class="plan-badge-tag tag-purple">DECISION TRIGGER</div>
            <h4>Cut-off Milestone</h4>
            <p><strong>${escapeHtml(analysis.weatherAction.decisionDeadline)}</strong></p>
            <span class="weather-status">Threshold: >35% precipitation probability</span>
          </div>
        </div>

        <div class="weather-checklist-box">
          <strong>🛡️ Site Lead Pre-Event Weather Checklist:</strong>
          <ul>
            ${analysis.weatherAction.checklist.map(item => `<li>${escapeHtml(item)}</li>`).join('')}
          </ul>
        </div>
      </section>
    </div>
  `;

  // Attach accommodation toggle listeners
  const chkWheelchair = container.querySelector('#chk-wheelchair');
  const chkQuietLounge = container.querySelector('#chk-quiet-lounge');
  const chkShuttle = container.querySelector('#chk-shuttle');
  const chkKidsZone = container.querySelector('#chk-kids-zone');
  const chkLactation = container.querySelector('#chk-lactation');

  const updateAccoms = () => {
    eventState.updateGuests({
      accommodations: {
        wheelchairRamp: chkWheelchair?.checked ?? true,
        seniorQuietLounge: chkQuietLounge?.checked ?? true,
        golfCartShuttle: chkShuttle?.checked ?? true,
        kidActivityZone: chkKidsZone?.checked ?? true,
        lactationRoom: chkLactation?.checked ?? true
      }
    });
    showToast('Updated inclusivity accommodations.');
  };

  [chkWheelchair, chkQuietLounge, chkShuttle, chkKidsZone, chkLactation].forEach(chk => {
    if (chk) chk.addEventListener('change', updateAccoms);
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
