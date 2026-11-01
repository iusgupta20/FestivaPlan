/**
 * FestivaPlan AI - Timeline & Task Prioritization Scheduler
 * Handles countdown tracking, dynamic urgency shifting, dependency blocker detection,
 * and automated D-Day run-of-show scheduling.
 */

/**
 * Calculates days and hours remaining until event date
 */
export function calculateEventCountdown(targetDateStr) {
  if (!targetDateStr) {
    return { days: 0, hours: 0, isPast: false, label: 'Date not set' };
  }

  const target = new Date(targetDateStr + 'T00:00:00');
  const now = new Date();
  const diffMs = target.getTime() - now.getTime();

  if (diffMs < 0) {
    const daysPast = Math.floor(Math.abs(diffMs) / (1000 * 60 * 60 * 24));
    return { days: daysPast, hours: 0, isPast: true, label: `Event passed ${daysPast}d ago` };
  }

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  return {
    days,
    hours,
    isPast: false,
    label: `${days} Days, ${hours} Hours remaining`
  };
}

/**
 * Enriches tasks with dynamic urgency badges, dependency blockers, and deadline status
 */
export function processTasksWithDependencies(tasks, eventDateStr) {
  const now = new Date();
  const taskMap = new Map(tasks.map(t => [t.id, t]));

  return tasks.map(task => {
    const taskCopy = { ...task };
    const due = task.dueDate ? new Date(task.dueDate + 'T23:59:59') : null;

    // 1. Dependency Analysis
    taskCopy.isBlocked = false;
    taskCopy.blockingTaskTitle = null;

    if (task.dependencies && task.dependencies !== 'None') {
      const depIds = task.dependencies.split(',').map(s => s.trim());
      for (const depId of depIds) {
        const parent = taskMap.get(depId);
        if (parent && !parent.completed) {
          taskCopy.isBlocked = true;
          taskCopy.blockingTaskTitle = parent.title;
          break;
        }
      }
    }

    // 2. Dynamic Urgency Shifting
    taskCopy.statusBadge = 'On Track';
    taskCopy.statusClass = 'badge-neutral';

    if (task.completed) {
      taskCopy.statusBadge = 'Completed';
      taskCopy.statusClass = 'badge-success';
    } else if (taskCopy.isBlocked) {
      taskCopy.statusBadge = `Blocked by: ${taskCopy.blockingTaskTitle}`;
      taskCopy.statusClass = 'badge-blocked';
    } else if (due) {
      const msUntilDue = due.getTime() - now.getTime();
      const daysUntilDue = Math.ceil(msUntilDue / (1000 * 60 * 60 * 24));

      if (daysUntilDue < 0) {
        taskCopy.statusBadge = `Overdue (${Math.abs(daysUntilDue)}d ago)`;
        taskCopy.statusClass = 'badge-danger';
        taskCopy.priority = 'Critical'; // Automatically elevate overdue tasks
      } else if (daysUntilDue <= 3) {
        taskCopy.statusBadge = `Due in ${daysUntilDue}d (Urgent)`;
        taskCopy.statusClass = 'badge-warning';
        taskCopy.priority = 'Critical';
      } else if (daysUntilDue <= 7) {
        taskCopy.statusBadge = `Due this week (${daysUntilDue}d)`;
        taskCopy.statusClass = 'badge-amber';
      }
    }

    return taskCopy;
  });
}

/**
 * Computes progress stats across all task phases
 */
export function getTimelineStats(processedTasks) {
  const total = processedTasks.length;
  const completed = processedTasks.filter(t => t.completed).length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  const overdue = processedTasks.filter(t => !t.completed && t.statusBadge && t.statusBadge.includes('Overdue')).length;
  const critical = processedTasks.filter(t => !t.completed && t.priority === 'Critical').length;
  const blocked = processedTasks.filter(t => !t.completed && t.isBlocked).length;

  return {
    total,
    completed,
    percent,
    overdue,
    critical,
    blocked
  };
}

/**
 * Generates an automated D-Day (Event Day) Hour-by-Hour Master Run-Sheet
 */
export function generateDDayRunSheet(event) {
  const type = event.type || 'wedding';

  if (type === 'wedding') {
    return [
      { time: '07:00 AM', phase: 'Setup', lead: 'Venue & Decor', action: 'Lawn and ballroom gates unlock; floral install team begins mandap / altar construction.' },
      { time: '09:30 AM', phase: 'Vendor Load-in', lead: 'AV & Sound', action: 'Sound check for acoustic microphones, DJ console, and ambient courtyard speakers.' },
      { time: '11:00 AM', phase: 'Styling', lead: 'HMUA & Attire', action: 'Bridal party and groom makeup styling commences in suite 101/102.' },
      { time: '01:30 PM', phase: 'Catering Inspection', lead: 'Event Lead', action: 'Inspection of buffet warmers, dietary allergy segregation, and welcome mocktail bar.' },
      { time: '03:30 PM', phase: 'Pre-Ceremony Shoot', lead: 'Photo & Drone', action: 'Candid portraits of couple and immediate family in courtyard garden.' },
      { time: '04:30 PM', phase: 'Guest Arrival', lead: 'Hospitality', action: 'Welcome drink service, live acoustic music, golf cart shuttle active for seniors.' },
      { time: '05:30 PM', phase: 'Main Ceremony', lead: 'Master of Ceremony', action: 'Processional begins; ceremony under canopy; floral shower coordination.' },
      { time: '07:30 PM', phase: 'Cocktail & Sangeet', lead: 'DJ / Live Band', action: 'First dance, live performances, appetizers and interactive live food stalls open.' },
      { time: '09:00 PM', phase: 'Royal Dinner', lead: 'Catering Lead', action: 'Multi-course dinner buffet served; quiet acoustic background music.' },
      { time: '11:00 PM', phase: 'Midnight Snacks & Wrap', lead: 'Logistics', action: 'Late night snack station active; guest departures, vendor teardown commences.' }
    ];
  }

  if (type === 'birthday') {
    return [
      { time: '11:00 AM', phase: 'Setup', lead: 'Decor Team', action: 'Balloon arch installation, toddler soft-play mat assembly, backdrop erection.' },
      { time: '01:00 PM', phase: 'Catering Arrival', lead: 'Baker & Kitchen', action: 'Custom cake delivery & refrigerated display placement; kid finger snacks prep.' },
      { time: '02:00 PM', phase: 'Guest Welcoming', lead: 'Host', action: 'Welcome juice bar opens; sensory play zone active for kids.' },
      { time: '02:45 PM', phase: 'Live Entertainment', lead: 'Bubble Artist', action: 'Interactive 45-min magic bubble and musical freeze dance show.' },
      { time: '03:45 PM', phase: 'Cake Cutting & Smash', lead: 'Photographer', action: 'Gather all guests around stage; toddler smash cake photo session.' },
      { time: '04:30 PM', phase: 'Buffet & Goodie Bags', lead: 'Host Lead', action: 'Afternoon treats served; custom astronaut favors gifted to departing kids.' }
    ];
  }

  // Community / Festival
  return [
    { time: '06:00 AM', phase: 'Perimeter Lockdown', lead: 'Security & Civic Lead', action: 'Road barriers positioned; EMS ambulance vehicle staged at Gate 2.' },
    { time: '08:00 AM', phase: 'Food Trucks Load-in', lead: 'Logistics Coordinator', action: 'Food trucks parked; health inspection check; grease disposal bins deployed.' },
    { time: '10:00 AM', phase: 'AV Sound Checks', lead: 'Production Lead', action: 'Amphitheater line-array tested; decibel level calibrated to city limits (<85 dB).' },
    { time: '12:00 PM', phase: 'Gates Open', lead: 'Welcome Volunteers', action: 'Community attendees enter; digital QR schedules and water stations active.' },
    { time: '02:00 PM', phase: 'Main Stage Show 1', lead: 'MC', action: 'Youth indie orchestra performance; artisan craft booths open.' },
    { time: '06:00 PM', phase: 'Evening Headliner Band', lead: 'Sound Engineer', action: 'Lanterns lit throughout plaza; headline jazz act takes stage.' },
    { time: '09:30 PM', phase: 'Eco-Teardown', lead: 'Sanitation Team', action: 'Event concludes; volunteer compost & recycling sweep commences.' }
  ];
}
