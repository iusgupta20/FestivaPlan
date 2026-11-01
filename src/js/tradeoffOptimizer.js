/**
 * FestivaPlan AI - Budget Tradeoff & Rebalancing Optimizer
 * Implements intelligent constraint-based reallocation algorithms for event budgets.
 * Solves real-world cost surges, overbudget scenarios, and provides actionable compromise packages.
 */

export const CELEBRATION_BENCHMARKS = {
  wedding: {
    'Venue & Banquet': { min: 0.30, max: 0.45, priorityWeight: 1.0 },
    'Catering & Dining': { min: 0.20, max: 0.30, priorityWeight: 1.0 },
    'Decor & Floral Styling': { min: 0.10, max: 0.18, priorityWeight: 0.6 },
    'Photo & Cinematic Video': { min: 0.08, max: 0.14, priorityWeight: 0.8 },
    'Entertainment & Live Band': { min: 0.05, max: 0.10, priorityWeight: 0.6 },
    'Attire & Makeup Styling': { min: 0.03, max: 0.08, priorityWeight: 0.5 },
    'Invitations & Guest Favors': { min: 0.01, max: 0.04, priorityWeight: 0.3 },
    'Emergency Contingency Buffer': { min: 0.04, max: 0.08, priorityWeight: 0.9 }
  },
  birthday: {
    'Venue & Gazebo Rental': { min: 0.25, max: 0.35, priorityWeight: 0.9 },
    'Kids & Adult Catering': { min: 0.25, max: 0.35, priorityWeight: 1.0 },
    'Theme Balloon Arch & Space Decor': { min: 0.12, max: 0.20, priorityWeight: 0.6 },
    'Kids Entertainer & Bubble Show': { min: 0.08, max: 0.15, priorityWeight: 0.8 },
    'Custom Cake & Smash Corner': { min: 0.05, max: 0.10, priorityWeight: 0.7 },
    'Event Photography': { min: 0.05, max: 0.10, priorityWeight: 0.6 },
    'Goodie Bags & Sensory Toys': { min: 0.02, max: 0.06, priorityWeight: 0.4 }
  },
  community: {
    'Stage, Sound System & AV Tech': { min: 0.22, max: 0.30, priorityWeight: 1.0 },
    'Civic Permits, Security & EMS': { min: 0.18, max: 0.25, priorityWeight: 1.0 },
    'Artist Fees & Honorariums': { min: 0.18, max: 0.25, priorityWeight: 0.7 },
    'Sanitation, Waste & Eco-Borders': { min: 0.10, max: 0.16, priorityWeight: 0.9 },
    'Seating, Tents & Crowd Barriers': { min: 0.08, max: 0.15, priorityWeight: 0.6 },
    'Promotions, Signage & Wayfinding': { min: 0.03, max: 0.08, priorityWeight: 0.4 },
    'Emergency Weather Contingency': { min: 0.03, max: 0.08, priorityWeight: 0.8 }
  }
};

/**
 * Analyzes health and variance of current budget vs target
 */
export function analyzeBudgetHealth(totalBudget, items) {
  const safeTotal = Math.max(1, Number(totalBudget) || 1);
  const currentSpent = items.reduce((sum, item) => sum + (Number(item.actual) || Number(item.target) || 0), 0);
  const deficit = currentSpent - safeTotal;
  const isOverbudget = deficit > 0;
  const burnRatio = currentSpent / safeTotal;

  const categoryBreakdown = items.map(item => {
    const val = Number(item.actual) || Number(item.target) || 0;
    const sharePercent = ((val / safeTotal) * 100).toFixed(1);
    const varianceFromTarget = val - (Number(item.target) || 0);
    return {
      id: item.id,
      category: item.category,
      amount: val,
      target: Number(item.target) || 0,
      sharePercent: Number(sharePercent),
      varianceFromTarget,
      isOverTarget: varianceFromTarget > 0,
      priority: item.priority || 'Medium',
      flexibility: item.flexibility || 'Medium'
    };
  });

  return {
    totalBudget: safeTotal,
    currentSpent,
    deficit: Math.max(0, deficit),
    surplus: Math.max(0, -deficit),
    isOverbudget,
    burnRatio: Number(burnRatio.toFixed(3)),
    categoryBreakdown
  };
}

/**
 * Solves a What-If Cost Surge Scenario:
 * Generates three distinct trade-off packages to absorb a price hike in a specific category.
 */
export function solveWhatIfCostSurge(items, totalBudget, surgeCategoryId, surgeAmount) {
  const safeSurge = Math.max(0, Number(surgeAmount) || 0);
  const safeTotal = Math.max(1, Number(totalBudget) || 1);

  const targetCategory = items.find(i => i.id === surgeCategoryId) || items[0];
  const otherItems = items.filter(i => i.id !== targetCategory.id);

  if (safeSurge === 0) {
    return {
      message: 'No surge amount entered. Budget remains within nominal bounds.',
      packages: []
    };
  }

  // Package 1: Aesthetic & Decor Trim (Prioritizes cutting High-Flexibility / Low-Priority items)
  const flexibleItems = otherItems.filter(i => i.flexibility === 'High' || i.priority === 'Low');
  const pkg1Cuts = [];
  let pkg1Remaining = safeSurge;

  for (const item of flexibleItems) {
    if (pkg1Remaining <= 0) break;
    const currentVal = Number(item.actual) || Number(item.target) || 0;
    const maxCut = Math.round(currentVal * 0.35); // Cut up to 35% of flexible categories
    const cut = Math.min(maxCut, pkg1Remaining);
    if (cut > 0) {
      pkg1Cuts.push({
        id: item.id,
        category: item.category,
        currentAmount: currentVal,
        cutAmount: cut,
        newAmount: currentVal - cut,
        tacticalAction: getTacticalCutRecommendation(item.category, cut)
      });
      pkg1Remaining -= cut;
    }
  }

  // If still remaining, draw from contingency buffer
  const contingency = otherItems.find(i => i.category.toLowerCase().includes('contingency'));
  if (pkg1Remaining > 0 && contingency) {
    const contVal = Number(contingency.actual) || Number(contingency.target) || 0;
    const contCut = Math.min(contVal * 0.7, pkg1Remaining);
    pkg1Cuts.push({
      id: contingency.id,
      category: contingency.category,
      currentAmount: contVal,
      cutAmount: contCut,
      newAmount: contVal - contCut,
      tacticalAction: `Draw ${formatAmount(contCut)} from safety contingency reserves.`
    });
    pkg1Remaining -= contCut;
  }

  // Package 2: Schedule & Production Hours Reallocation
  const entertainmentOrPhoto = otherItems.filter(i =>
    i.category.toLowerCase().includes('photo') ||
    i.category.toLowerCase().includes('entertainment') ||
    i.category.toLowerCase().includes('music') ||
    i.category.toLowerCase().includes('stage')
  );
  const pkg2Cuts = [];
  let pkg2Remaining = safeSurge;

  for (const item of entertainmentOrPhoto) {
    if (pkg2Remaining <= 0) break;
    const currentVal = Number(item.actual) || Number(item.target) || 0;
    const maxCut = Math.round(currentVal * 0.22);
    const cut = Math.min(maxCut, pkg2Remaining);
    if (cut > 0) {
      pkg2Cuts.push({
        id: item.id,
        category: item.category,
        currentAmount: currentVal,
        cutAmount: cut,
        newAmount: currentVal - cut,
        tacticalAction: `Scale booking package duration (e.g. 5 hours vs 7 hours) and utilize curated digital playlists for cocktail hour.`
      });
      pkg2Remaining -= cut;
    }
  }

  // Package 3: Balanced Proportional Reallocation across all non-critical categories
  const pkg3Cuts = [];
  const eligibleItems = otherItems.filter(i => i.priority !== 'Critical' && i.flexibility !== 'Low');
  const totalEligiblePool = eligibleItems.reduce((sum, item) => sum + (Number(item.actual) || Number(item.target) || 0), 0);

  if (totalEligiblePool > 0) {
    for (const item of eligibleItems) {
      const currentVal = Number(item.actual) || Number(item.target) || 0;
      const weight = currentVal / totalEligiblePool;
      const cut = Math.round(safeSurge * weight);
      if (cut > 0) {
        pkg3Cuts.push({
          id: item.id,
          category: item.category,
          currentAmount: currentVal,
          cutAmount: cut,
          newAmount: currentVal - cut,
          tacticalAction: `Reduce scope by ${(weight * 100).toFixed(0)}% across vendor deliverables.`
        });
      }
    }
  }

  return {
    targetCategory: targetCategory.category,
    surgeAmount: safeSurge,
    packages: [
      {
        id: 'pkg-aesthetic',
        name: 'Aesthetic & Decor Trade-Off',
        tag: 'Recommended for High Guest Experience',
        summary: `Absorbs the ${formatAmount(safeSurge)} surge primarily through smart floral trimming, digital invitations, and minor contingency buffer use without degrading guest dining or venue quality.`,
        cuts: pkg1Cuts,
        totalSavings: pkg1Cuts.reduce((s, c) => s + c.cutAmount, 0),
        deficitUncovered: Math.max(0, pkg1Remaining)
      },
      {
        id: 'pkg-schedule',
        name: 'Production & Schedule Duration Optimization',
        tag: 'Keeps Decor & Food 100% Intact',
        summary: `Shaves coverage duration on live band/DJ and secondary videographers, relying on ambient playlists during early hours.`,
        cuts: pkg2Cuts,
        totalSavings: pkg2Cuts.reduce((s, c) => s + c.cutAmount, 0),
        deficitUncovered: Math.max(0, pkg2Remaining)
      },
      {
        id: 'pkg-proportional',
        name: 'Uniform Balanced Spread',
        tag: 'Minimal Impact on Any Single Vendor',
        summary: `Evenly scales down all non-essential line items by a modest percentage so no single vendor experiences severe budget cuts.`,
        cuts: pkg3Cuts,
        totalSavings: pkg3Cuts.reduce((s, c) => s + c.cutAmount, 0),
        deficitUncovered: 0
      }
    ]
  };
}

/**
 * Automates Rebalancing:
 * Mathematically adjusts actual spend items so that their sum precisely matches totalBudget.
 */
export function autoRebalanceBudget(items, totalBudget) {
  const safeTotal = Math.max(1, Number(totalBudget) || 1);
  const cloned = items.map(i => ({ ...i }));
  const currentTotal = cloned.reduce((sum, i) => sum + (Number(i.actual) || Number(i.target) || 0), 0);
  const excess = currentTotal - safeTotal;

  if (excess <= 0) {
    // Budget is already within bounds, ensure actual is cleanly defined
    return cloned.map(item => ({
      ...item,
      actual: Number(item.actual) || Number(item.target) || 0
    }));
  }

  // Weights based on flexibility & priority:
  // Low priority + High flexibility = highest cut elasticity
  // High priority + Low flexibility = lowest cut elasticity
  const weights = cloned.map(item => {
    let w = 1.0;
    if (item.priority === 'High' || item.priority === 'Critical') w *= 0.3;
    else if (item.priority === 'Medium') w *= 0.8;
    else if (item.priority === 'Low') w *= 1.8;

    if (item.flexibility === 'High') w *= 1.6;
    else if (item.flexibility === 'Medium') w *= 1.0;
    else if (item.flexibility === 'Low') w *= 0.3;

    return w;
  });

  const sumWeights = weights.reduce((a, b) => a + b, 0);
  let remainingExcess = excess;

  for (let idx = 0; idx < cloned.length; idx++) {
    const item = cloned[idx];
    const currentVal = Number(item.actual) || Number(item.target) || 0;
    const proportion = weights[idx] / sumWeights;
    const intendedReduction = Math.round(excess * proportion);

    // Floor protection: do not reduce an item below 50% of its target
    const floor = Math.round((Number(item.target) || currentVal) * 0.5);
    const maxPossibleReduction = Math.max(0, currentVal - floor);
    const appliedReduction = Math.min(intendedReduction, maxPossibleReduction);

    item.actual = Math.max(floor, currentVal - appliedReduction);
    remainingExcess -= appliedReduction;
  }

  // Any remaining fractional dollar/rupee difference gets absorbed by contingency or lowest priority
  if (remainingExcess > 0) {
    const lowestPriority = cloned.find(i => i.priority === 'Low') || cloned[cloned.length - 1];
    lowestPriority.actual = Math.max(10, lowestPriority.actual - remainingExcess);
  }

  return cloned;
}

function getTacticalCutRecommendation(category, cutAmount) {
  const cat = category.toLowerCase();
  if (cat.includes('decor') || cat.includes('floral')) {
    return `Swap exotic imported blooms with in-season local marigolds/hydrangeas and amplify atmospheric warm LED uplighting (-${formatAmount(cutAmount)}).`;
  }
  if (cat.includes('favor') || cat.includes('invite')) {
    return `Switch to animated high-resolution mobile RSVP invitations with QR codes instead of heavyweight embossed paper suites (-${formatAmount(cutAmount)}).`;
  }
  if (cat.includes('catering') || cat.includes('dining')) {
    return `Streamline buffet stations by substituting 2 heavy meat carving tables with a signature artisanal pasta/chaat counter (-${formatAmount(cutAmount)}).`;
  }
  if (cat.includes('photo') || cat.includes('video')) {
    return `Limit drone cinematic flight hours to ceremony highlights rather than full 12-hour continuous standby (-${formatAmount(cutAmount)}).`;
  }
  return `Negotiate volume discount or trim extraneous equipment rentals to save ${formatAmount(cutAmount)}.`;
}

function formatAmount(val) {
  return Number(val).toLocaleString();
}
