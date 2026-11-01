/**
 * FestivaPlan AI - Timeline & Prioritization View Component
 * Features dynamic urgency shifting, dependency blocker tracking,
 * milestone phase gating, and automated D-Day master run-sheet.
 */

import { eventState } from '../state.js';
import {
  calculateEventCountdown,
  processTasksWithDependencies,
  getTimelineStats,
  generateDDayRunSheet
} from '../timelineScheduler.js';

let activePhaseFilter = 'all';

export function renderTimelineView(container) {
  const state = eventState.getState();
  const rawTasks = state.tasks || [];
  const processedTasks = processTasksWithDependencies(rawTasks, state.date);
  const stats = getTimelineStats(processedTasks);
  const countdown = calculateEventCountdown(state.date);
  const ddayRunSheet = generateDDayRunSheet(state);

  const filteredTasks = activePhaseFilter === 'all'
    ? processedTasks
    : processedTasks.filter(t => t.phase === activePhaseFilter);

  container.innerHTML = `
    <div class="timeline-container animate-fade-in">
      <!-- Countdown & Progress Hero -->
      <section class="section-card timeline-hero-card" aria-label="Countdown & Progress">
        <div class="timeline-hero-grid">
          <div class="countdown-block">
            <span class="countdown-badge">⏱️ Event Countdown</span>
            <div class="countdown-number">${countdown.days} <span class="countdown-unit">Days</span> : ${countdown.hours} <span class="countdown-unit">Hours</span></div>
            <p class="countdown-sub">Target Celebration Date: <strong>${state.date}</strong></p>
          </div>
          <div class="progress-stats-block">
            <div class="progress-header">
              <span>Overall Execution Progress: <strong>${stats.percent}%</strong></span>
              <span class="progress-counts">${stats.completed} of ${stats.total} Tasks Completed</span>
            </div>
            <div class="progress-bar-wrap">
              <div class="progress-bar-fill" style="width: ${stats.percent}%"></div>
            </div>
            <div class="stat-pills-row">
              <span class="stat-pill ${stats.overdue > 0 ? 'pill-danger' : 'pill-neutral'}">
                🚨 ${stats.overdue} Overdue
              </span>
              <span class="stat-pill ${stats.critical > 0 ? 'pill-warning' : 'pill-neutral'}">
                🔥 ${stats.critical} Critical
              </span>
              <span class="stat-pill ${stats.blocked > 0 ? 'pill-blocked' : 'pill-neutral'}">
                🔒 ${stats.blocked} Dependency-Blocked
              </span>
            </div>
          </div>
        </div>

        <!-- Phase Filter Tabs -->
        <div class="phase-tabs-bar" role="tablist" aria-label="Timeline Phases">
          <button class="phase-tab ${activePhaseFilter === 'all' ? 'active' : ''}" data-phase="all">
            All Tasks (${stats.total})
          </button>
          <button class="phase-tab ${activePhaseFilter === 'T-90' ? 'active' : ''}" data-phase="T-90">
            T-90 Foundation
          </button>
          <button class="phase-tab ${activePhaseFilter === 'T-30' ? 'active' : ''}" data-phase="T-30">
            T-30 Vendor Lock
          </button>
          <button class="phase-tab ${activePhaseFilter === 'T-7' ? 'active' : ''}" data-phase="T-7">
            T-7 Final Polish
          </button>
          <button class="phase-tab ${activePhaseFilter === 'D-Day' ? 'active' : ''}" data-phase="D-Day">
            🎯 D-Day Run-Sheet
          </button>
        </div>
      </section>

      <!-- Task Creation Quick-Bar -->
      <section class="section-card add-task-card" aria-label="Add New Task">
        <form id="form-add-task" class="add-task-form">
          <div class="task-form-row">
            <input type="text" id="new-task-title" class="form-input flex-2" placeholder="Add a new milestone or action item..." required>
            <select id="new-task-phase" class="form-select flex-1">
              <option value="T-90">T-90 (Foundation)</option>
              <option value="T-30">T-30 (Vendor Lock)</option>
              <option value="T-7" selected>T-7 (Final Polish)</option>
              <option value="D-Day">D-Day (Event Day)</option>
            </select>
            <input type="date" id="new-task-date" class="form-input flex-1" value="${state.date}">
            <select id="new-task-priority" class="form-select flex-1">
              <option value="Critical">🔥 Critical</option>
              <option value="High">High</option>
              <option value="Medium" selected>Medium</option>
              <option value="Low">Low</option>
            </select>
            <button type="submit" class="btn btn-primary">
              <span>➕</span> Add Task
            </button>
          </div>
        </form>
      </section>

      <!-- Interactive Tasks List -->
      <section class="section-card tasks-list-card" aria-labelledby="tasks-title">
        <div class="section-header">
          <div class="header-left">
            <span class="section-icon">📋</span>
            <div>
              <h2 id="tasks-title">Actionable Milestone Checklist</h2>
              <p class="section-desc">Urgency and priorities shift automatically as deadlines near. Tasks marked with blockers cannot proceed until parent milestones complete.</p>
            </div>
          </div>
          <button class="btn btn-outline btn-sm" id="btn-print-timeline">
            🖨️ Print Run-Sheet
          </button>
        </div>

        <div class="tasks-table" id="tasks-table">
          ${filteredTasks.length === 0 ? `
            <div class="empty-state">
              <span class="empty-icon">🎉</span>
              <h4>No tasks found for this phase!</h4>
              <p>Add a task using the bar above or switch phase filters.</p>
            </div>
          ` : filteredTasks.map(task => `
            <div class="task-row ${task.completed ? 'task-done' : ''} ${task.isBlocked ? 'task-blocked-row' : ''}" data-id="${task.id}">
              <div class="task-checkbox-wrap">
                <input type="checkbox" class="task-checkbox" id="chk-${task.id}" data-id="${task.id}" ${task.completed ? 'checked' : ''} aria-label="Mark ${task.title} as completed">
              </div>

              <div class="task-main-col">
                <div class="task-title-line">
                  <span class="task-title ${task.completed ? 'strikethrough' : ''}">${task.title}</span>
                  <span class="badge ${task.statusClass}">${task.statusBadge}</span>
                  <span class="badge ${getPriorityBadge(task.priority)}">${task.priority}</span>
                </div>
                <div class="task-meta-line">
                  <span class="meta-tag">Phase: <strong>${task.phase}</strong></span>
                  <span class="meta-tag">Category: ${task.category || 'General'}</span>
                  <span class="meta-tag">Due: ${task.dueDate || 'Flexible'}</span>
                  ${task.isBlocked ? `<span class="meta-tag text-danger">⚠️ Blocked until: "${task.blockingTaskTitle}" is completed</span>` : ''}
                </div>
              </div>

              <div class="task-action-col">
                <button class="btn btn-ghost btn-sm btn-delete-task" data-id="${task.id}" title="Remove Task">
                  🗑️
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- D-Day Minute-by-Minute Master Run-Sheet (Execution Phase) -->
      ${(activePhaseFilter === 'all' || activePhaseFilter === 'D-Day') ? `
        <section class="section-card dday-runsheet-card" aria-labelledby="runsheet-title">
          <div class="section-header">
            <div class="header-left">
              <span class="section-icon">⏱️</span>
              <div>
                <h2 id="runsheet-title">D-Day Hour-by-Hour Master Run-Sheet (On-Site Execution)</h2>
                <p class="section-desc">Pre-calibrated operational sequence for site leads, coordinators, and vendor leads on celebration day.</p>
              </div>
            </div>
          </div>

          <div class="runsheet-timeline">
            ${ddayRunSheet.map(item => `
              <div class="runsheet-step">
                <div class="runsheet-time">${item.time}</div>
                <div class="runsheet-content">
                  <div class="runsheet-phase-tag">${item.phase} &nbsp;·&nbsp; <em>Lead: ${item.lead}</em></div>
                  <p class="runsheet-action">${item.action}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}
    </div>
  `;

  // Attach phase filter listeners
  container.querySelectorAll('.phase-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      activePhaseFilter = tab.getAttribute('data-phase');
      renderTimelineView(container);
    });
  });

  // Attach task toggle
  container.querySelectorAll('.task-checkbox').forEach(chk => {
    chk.addEventListener('change', () => {
      const id = chk.getAttribute('data-id');
      eventState.toggleTask(id);
      renderTimelineView(container);
    });
  });

  // Attach task delete
  container.querySelectorAll('.btn-delete-task').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      eventState.deleteTask(id);
      renderTimelineView(container);
      showToast('Task removed.');
    });
  });

  // Attach Add Task Form
  const addForm = container.querySelector('#form-add-task');
  if (addForm) {
    addForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = container.querySelector('#new-task-title').value.trim();
      if (!title) return;

      const newTask = {
        title,
        phase: container.querySelector('#new-task-phase').value,
        dueDate: container.querySelector('#new-task-date').value,
        priority: container.querySelector('#new-task-priority').value,
        category: 'Milestone',
        completed: false,
        dependencies: 'None'
      };

      eventState.addTask(newTask);
      showToast(`✅ Added task "${title}"`);
      renderTimelineView(container);
    });
  }

  // Attach Print Handler
  const printBtn = container.querySelector('#btn-print-timeline');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

function getPriorityBadge(p) {
  if (p === 'Critical') return 'badge-danger';
  if (p === 'High') return 'badge-amber';
  if (p === 'Medium') return 'badge-neutral';
  return 'badge-teal';
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
