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
import { escapeHtml } from '../utils/sanitize.js';

let activePhaseFilter = 'all';

export function renderTimelineView(container) {
  if (!container) return;
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
            <p class="countdown-sub">Target Celebration Date: <strong>${escapeHtml(state.date)}</strong></p>
          </div>
          <div class="progress-stats-block">
            <div class="progress-header">
              <span>Overall Execution Progress: <strong>${stats.percent}%</strong></span>
              <span class="progress-counts">${stats.completed} of ${stats.total} Tasks Completed</span>
            </div>
            <div class="progress-bar-wrap" role="progressbar" aria-valuenow="${stats.percent}" aria-valuemin="0" aria-valuemax="100" aria-label="Overall task execution progress">
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
        <div class="phase-tabs-bar" role="tablist" aria-label="Timeline Phases" aria-orientation="horizontal">
          <button class="phase-tab ${activePhaseFilter === 'all' ? 'active' : ''}" data-phase="all" role="tab" aria-selected="${activePhaseFilter === 'all'}">
            All Tasks (${stats.total})
          </button>
          <button class="phase-tab ${activePhaseFilter === 'T-90' ? 'active' : ''}" data-phase="T-90" role="tab" aria-selected="${activePhaseFilter === 'T-90'}">
            T-90 Foundation
          </button>
          <button class="phase-tab ${activePhaseFilter === 'T-30' ? 'active' : ''}" data-phase="T-30" role="tab" aria-selected="${activePhaseFilter === 'T-30'}">
            T-30 Vendor Lock
          </button>
          <button class="phase-tab ${activePhaseFilter === 'T-7' ? 'active' : ''}" data-phase="T-7" role="tab" aria-selected="${activePhaseFilter === 'T-7'}">
            T-7 Final Polish
          </button>
          <button class="phase-tab ${activePhaseFilter === 'D-Day' ? 'active' : ''}" data-phase="D-Day" role="tab" aria-selected="${activePhaseFilter === 'D-Day'}">
            🎯 D-Day Run-Sheet
          </button>
        </div>
      </section>

      <!-- Task Creation Quick-Bar -->
      <section class="section-card add-task-card" aria-label="Add New Task">
        <form id="form-add-task" class="add-task-form">
          <div class="task-form-row">
            <input type="text" id="new-task-title" class="form-input flex-2" placeholder="Add a new milestone or action item..." required aria-label="New milestone task title">
            <select id="new-task-phase" class="form-select flex-1" aria-label="Task phase">
              <option value="T-90">T-90 (Foundation)</option>
              <option value="T-30">T-30 (Vendor Lock)</option>
              <option value="T-7" selected>T-7 (Final Polish)</option>
              <option value="D-Day">D-Day (Event Day)</option>
            </select>
            <input type="date" id="new-task-date" class="form-input flex-1" value="${escapeHtml(state.date)}" aria-label="Task due date">
            <select id="new-task-priority" class="form-select flex-1" aria-label="Task priority">
              <option value="Critical">🔥 Critical</option>
              <option value="High">High</option>
              <option value="Medium" selected>Medium</option>
              <option value="Low">Low</option>
            </select>
            <button type="submit" class="btn btn-primary" aria-label="Add Milestone Task">
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
          <button class="btn btn-outline btn-sm" id="btn-print-timeline" aria-label="Print Production Run-Sheet">
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
          ` : filteredTasks.map(task => {
            const safeId = escapeHtml(task.id);
            const safeTitle = escapeHtml(task.title);
            const safeStatus = escapeHtml(task.statusBadge);
            const safePriority = escapeHtml(task.priority);
            const safeDueDate = escapeHtml(task.dueDate || 'No date');
            const safeAssignee = escapeHtml(task.assignee || 'Unassigned');

            return `
              <div class="task-row ${task.completed ? 'task-done' : ''} ${task.isBlocked ? 'task-blocked-row' : ''}" data-id="${safeId}">
                <div class="task-checkbox-wrap">
                  <input type="checkbox" class="task-checkbox" id="chk-${safeId}" data-id="${safeId}" ${task.completed ? 'checked' : ''} aria-label="Mark ${safeTitle} as completed">
                </div>

                <div class="task-main-col">
                  <div class="task-title-line">
                    <span class="task-title ${task.completed ? 'strikethrough' : ''}">${safeTitle}</span>
                    <span class="badge ${escapeHtml(task.statusClass)}">${safeStatus}</span>
                    <span class="badge ${getPriorityBadge(task.priority)}">${safePriority}</span>
                  </div>
                  <div class="task-meta-line">
                    <span>📅 Due: ${safeDueDate}</span>
                    <span>👤 Lead: ${safeAssignee}</span>
                    ${task.dependencies && task.dependencies !== 'None' ? `<span>🔗 Depends on: ${escapeHtml(task.dependencies)}</span>` : ''}
                  </div>
                </div>

                <div class="task-actions-col">
                  <button class="btn btn-ghost btn-sm btn-delete-task" data-id="${safeId}" title="Delete task" aria-label="Delete ${safeTitle}">
                    ✕
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </section>

      <!-- D-Day Run-Sheet Section -->
      <section class="section-card dday-sheet-card" aria-labelledby="dday-title">
        <div class="section-header">
          <div class="header-left">
            <span class="section-icon">⏱️</span>
            <div>
              <h2 id="dday-title">D-Day Minute-by-Minute Master Production Run-Sheet</h2>
              <p class="section-desc">On-site execution timetable for venue staff, sound engineers, caterers, and stage managers.</p>
            </div>
          </div>
        </div>

        <div class="runsheet-table-wrap">
          <table class="runsheet-table" aria-label="D-Day Timetable">
            <thead>
              <tr>
                <th scope="col" style="width: 110px;">Time</th>
                <th scope="col" style="width: 140px;">Phase</th>
                <th scope="col" style="width: 160px;">Operational Lead</th>
                <th scope="col">Action Details & Cue</th>
              </tr>
            </thead>
            <tbody>
              ${ddayRunSheet.map(item => `
                <tr>
                  <td><strong class="runsheet-time">${escapeHtml(item.time)}</strong></td>
                  <td><span class="badge badge-neutral">${escapeHtml(item.phase)}</span></td>
                  <td><strong>${escapeHtml(item.lead)}</strong></td>
                  <td>${escapeHtml(item.action)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `;

  // Filter Buttons
  container.querySelectorAll('.phase-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      activePhaseFilter = tab.getAttribute('data-phase') || 'all';
      renderTimelineView(container);
    });
  });

  // Checkbox Toggles
  container.querySelectorAll('.task-checkbox').forEach(chk => {
    chk.addEventListener('change', () => {
      const id = chk.getAttribute('data-id');
      eventState.toggleTask(id);
    });
  });

  // Delete Task
  container.querySelectorAll('.btn-delete-task').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      eventState.deleteTask(id);
      showToast('Milestone task deleted.');
    });
  });

  // Add Task Form
  const addForm = container.querySelector('#form-add-task');
  if (addForm) {
    addForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newTask = {
        id: `t-${Date.now()}`,
        title: container.querySelector('#new-task-title').value.trim(),
        phase: container.querySelector('#new-task-phase').value,
        dueDate: container.querySelector('#new-task-date').value,
        priority: container.querySelector('#new-task-priority').value,
        completed: false,
        dependencies: 'None',
        assignee: 'Host / Coordinator'
      };

      eventState.addTask(newTask);
      addForm.reset();
      showToast(`Added milestone: "${newTask.title}"`);
    });
  }

  // Print Button
  const printBtn = container.querySelector('#btn-print-timeline');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

function getPriorityBadge(p) {
  if (p === 'Critical') return 'badge-danger';
  if (p === 'High') return 'badge-warning';
  if (p === 'Medium') return 'badge-amber';
  return 'badge-neutral';
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
