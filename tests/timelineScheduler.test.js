import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  calculateEventCountdown,
  processTasksWithDependencies,
  getTimelineStats,
  generateDDayRunSheet
} from '../src/js/timelineScheduler.js';

describe('Timeline & Task Prioritization Scheduler', () => {
  it('correctly calculates countdown days for future dates', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const dateStr = futureDate.toISOString().split('T')[0];

    const countdown = calculateEventCountdown(dateStr);
    assert.strictEqual(countdown.isPast, false);
    assert.ok(countdown.days >= 28 && countdown.days <= 31);
    assert.ok(countdown.label.includes('Days'));
  });

  it('detects past dates correctly', () => {
    const countdown = calculateEventCountdown('2020-01-01');
    assert.strictEqual(countdown.isPast, true);
    assert.ok(countdown.label.includes('passed'));
  });

  it('flags dependency blockers when parent task is uncompleted', () => {
    const tasks = [
      { id: 't-1', title: 'Lock Venue Contract', completed: false, dependencies: 'None' },
      { id: 't-2', title: 'Order Floral Mandap', completed: false, dependencies: 't-1' }
    ];

    const processed = processTasksWithDependencies(tasks, '2026-12-18');
    const child = processed.find(t => t.id === 't-2');
    assert.strictEqual(child.isBlocked, true);
    assert.strictEqual(child.blockingTaskTitle, 'Lock Venue Contract');
    assert.ok(child.statusBadge.includes('Blocked by'));
  });

  it('unblocks child task when parent task is completed', () => {
    const tasks = [
      { id: 't-1', title: 'Lock Venue Contract', completed: true, dependencies: 'None' },
      { id: 't-2', title: 'Order Floral Mandap', completed: false, dependencies: 't-1' }
    ];

    const processed = processTasksWithDependencies(tasks, '2026-12-18');
    const child = processed.find(t => t.id === 't-2');
    assert.strictEqual(child.isBlocked, false);
  });

  it('shifts overdue tasks to Critical priority', () => {
    const tasks = [
      { id: 't-overdue', title: 'Send Invitations', dueDate: '2025-01-01', priority: 'Medium', completed: false, dependencies: 'None' }
    ];

    const processed = processTasksWithDependencies(tasks, '2026-12-18');
    const t = processed[0];
    assert.strictEqual(t.priority, 'Critical', 'Overdue task must dynamically elevate to Critical priority');
    assert.ok(t.statusBadge.includes('Overdue'));
  });

  it('computes accurate progress percentages and stat counters', () => {
    const tasks = [
      { id: '1', completed: true, priority: 'Low' },
      { id: '2', completed: true, priority: 'Medium' },
      { id: '3', completed: false, priority: 'Critical', isBlocked: false },
      { id: '4', completed: false, priority: 'High', isBlocked: true }
    ];

    const stats = getTimelineStats(tasks);
    assert.strictEqual(stats.total, 4);
    assert.strictEqual(stats.completed, 2);
    assert.strictEqual(stats.percent, 50);
    assert.strictEqual(stats.critical, 1);
    assert.strictEqual(stats.blocked, 1);
  });

  it('generates rich D-Day run-sheets for weddings, birthdays, and community festivals', () => {
    const weddingSheet = generateDDayRunSheet({ type: 'wedding' });
    assert.ok(weddingSheet.length >= 6);
    assert.ok(weddingSheet.some(s => s.action.toLowerCase().includes('ceremony')));

    const birthdaySheet = generateDDayRunSheet({ type: 'birthday' });
    assert.ok(birthdaySheet.length >= 4);
    assert.ok(birthdaySheet.some(s => s.action.toLowerCase().includes('cake')));

    const festivalSheet = generateDDayRunSheet({ type: 'community' });
    assert.ok(festivalSheet.length >= 5);
    assert.ok(festivalSheet.some(s => s.action.toLowerCase().includes('sound') || s.action.toLowerCase().includes('food')));
  });
});

