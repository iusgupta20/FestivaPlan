/**
 * FestivaPlan AI - Vendor Coordination & Quotation Evaluation Matrix
 * Computes multi-attribute utility scores for vendor quotations,
 * evaluates contract risk factors, and generates automated RFP inquiries.
 */

/**
 * Evaluates a single vendor quotation relative to category target budget and competitors
 */
export function scoreVendorQuotation(vendor, targetCategoryBudget, categoryVendors = []) {
  const quote = Number(vendor.quoteAmount) || 1;
  const target = Number(targetCategoryBudget) || quote;
  const rating = Number(vendor.rating) || 4.0;
  const overtimeRate = Number(vendor.overtimeRate) || 0;

  // 1. Rating Score (Max 40 points)
  // 5.0 -> 40, 4.0 -> 32, 3.0 -> 24
  const ratingScore = Math.min(40, (rating / 5.0) * 40);

  // 2. Cost Competitiveness (Max 35 points)
  // If quote <= target, gets full 35. If quote > target, score decreases.
  const priceRatio = quote / target;
  let costScore = 35;
  if (priceRatio > 1.0) {
    costScore = Math.max(5, 35 - ((priceRatio - 1.0) * 50));
  } else if (priceRatio < 0.7) {
    // Abnormally cheap might signal quality compromise
    costScore = 30;
  }

  // 3. Contract & Cancellation Flexibility (Max 15 points)
  let contractScore = 8;
  const policy = (vendor.cancellationPolicy || '').toLowerCase();
  if (policy.includes('full refund') || policy.includes('flexible') || policy.includes('refundable up to')) {
    contractScore = 15;
  } else if (policy.includes('non-refundable') || policy.includes('50%')) {
    contractScore = 5;
  }

  // 4. Perks & Bonus Deliverables (Max 10 points)
  let perkScore = 4;
  const perks = (vendor.perks || '').toLowerCase();
  if (perks.length > 20) perkScore = 8;
  if (perks.includes('complimentary') || perks.includes('free') || perks.includes('unlimited')) {
    perkScore = 10;
  }

  const compositeScore = Math.round(ratingScore + costScore + contractScore + perkScore);

  // Determine Tag
  let badge = '⚖️ Standard Fit';
  let badgeClass = 'badge-neutral';
  if (compositeScore >= 88) {
    badge = '🏆 Best Overall Value';
    badgeClass = 'badge-success';
  } else if (rating >= 4.8 && quote > target) {
    badge = '💎 Premium Quality';
    badgeClass = 'badge-purple';
  } else if (quote < target * 0.85) {
    badge = '🏷️ Budget Friendly';
    badgeClass = 'badge-teal';
  } else if (contractScore < 8) {
    badge = '⚠️ Strict Cancellation';
    badgeClass = 'badge-warning';
  }

  // AI Recommendation Justification
  let recommendation = '';
  if (badge.includes('Best Overall Value')) {
    recommendation = `Optimal balance of high customer rating (${rating}★) and competitive pricing (${formatCurrency(quote)}). Includes high-value bonus perks with fair rescheduling terms.`;
  } else if (badge.includes('Premium')) {
    recommendation = `Exemplary industry rating (${rating}★) with luxury deliverables. Priced at a ${Math.round((priceRatio - 1) * 100)}% premium over baseline allocation.`;
  } else if (badge.includes('Budget')) {
    recommendation = `Saves ${formatCurrency(target - quote)} against target allocation. Verify that equipment fidelity and overtime rates meet peak hour requirements.`;
  } else {
    recommendation = `Balanced mid-tier candidate. Ensure cancellation buffer and overtime terms (${formatCurrency(overtimeRate)}/hr) are confirmed in writing.`;
  }

  return {
    vendorId: vendor.id,
    vendorName: vendor.name,
    compositeScore: Math.min(100, Math.max(0, compositeScore)),
    subScores: {
      ratingScore: Math.round(ratingScore),
      costScore: Math.round(costScore),
      contractScore: Math.round(contractScore),
      perkScore: Math.round(perkScore)
    },
    badge,
    badgeClass,
    recommendation,
    priceVariancePercent: ((priceRatio - 1) * 100).toFixed(1)
  };
}

/**
 * Generates an automated formal RFP (Request for Proposal) message to send to vendors.
 */
export function generateVendorRFP(event, vendorCategory, targetDate, guestCount, specialRequirements = '') {
  const currency = event.currency || '$';
  return `Subject: RFP / Inquiry: ${event.type.toUpperCase()} Booking for ${event.title} - ${targetDate}

Dear ${vendorCategory} Partner,

We are planning "${event.title}", scheduled to take place on ${targetDate} at ${event.location || 'our designated celebration venue'}.

We are currently curating and confirming preferred partners for our ${vendorCategory} requirements and would like to formally request an itemized quotation and availability check.

KEY EVENT SPECIFICATIONS:
- Event Nature: ${event.type} celebration (${event.vibe || 'Special gathering'})
- Guest Count: Approximately ${guestCount} attendees
- Event Date: ${targetDate}
- Preferred Category: ${vendorCategory}
${specialRequirements ? `- Specific Requirements & Inclusivity Notes: ${specialRequirements}\n` : ''}
PLEASE PROVIDE IN YOUR FORMAL PROPOSAL:
1. Itemized quotation for setup, operation, and teardown
2. Standard hourly coverage and overtime rate policy
3. Cancellation, force-majeure, and deposit refund terms
4. High-resolution portfolio / sample deliverables
5. Power / space / staging setup requirements from the venue

We look forward to receiving your response within 3 business days to facilitate vendor shortlisting.

Warm regards,
Event Operations Team
FestivaPlan AI Assistant
`;
}

function formatCurrency(val) {
  return Number(val).toLocaleString();
}
