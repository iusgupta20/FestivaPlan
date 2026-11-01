/**
 * FestivaPlan AI - Guest Personalization & Inclusivity Manager
 * Evaluates dietary restrictions, demographics (seniors/toddlers),
 * accessibility readiness, and weather contingency trigger protocols.
 */

export function analyzeGuestDemographicsAndDietary(guests) {
  const total = Number(guests.total) || 1;
  const confirmed = Number(guests.confirmed) || total;
  const dietary = guests.dietary || {};
  const demographics = guests.demographics || {};
  const accommodations = guests.accommodations || {};
  const weather = guests.weatherPlan || {};

  // 1. Dietary Breakdown
  const dietaryEntries = Object.entries(dietary).map(([type, count]) => {
    const num = Number(count) || 0;
    const percent = confirmed > 0 ? ((num / confirmed) * 100).toFixed(1) : 0;
    return {
      type: formatDietaryName(type),
      rawType: type,
      count: num,
      percent: Number(percent)
    };
  }).filter(e => e.count > 0);

  // 2. Kitchen & Catering Compliance Warnings
  const kitchenDirectives = [];
  if (dietary.nutAllergy && dietary.nutAllergy > 0) {
    kitchenDirectives.push({
      severity: 'CRITICAL',
      title: 'Severe Nut Allergy Protocol',
      description: `${dietary.nutAllergy} confirmed guests have severe nut allergies. Require caterer to maintain certified peanut-free preparation counters and visible allergen markers.`
    });
  }
  if (dietary.glutenFree && dietary.glutenFree > 0) {
    kitchenDirectives.push({
      severity: 'HIGH',
      title: 'Celiac & Gluten-Free Segregation',
      description: `${dietary.glutenFree} guests require dedicated gluten-free options and clean serving utensils to prevent cross-contact.`
    });
  }
  if (dietary.jain && dietary.jain > 0) {
    kitchenDirectives.push({
      severity: 'HIGH',
      title: 'Jain Meal Preparation',
      description: `${dietary.jain} guests require root-vegetable-free (no onion, garlic, potatoes) traditional pure-vegetarian preparations.`
    });
  }
  if (dietary.vegan && dietary.vegan > 0) {
    kitchenDirectives.push({
      severity: 'MEDIUM',
      title: 'Plant-Based & Dairy-Free Stations',
      description: `${dietary.vegan} guests require clearly marked 100% plant-based entrees and non-dairy dessert choices.`
    });
  }

  // 3. Demographic & Inclusivity Readiness
  const inclusivityChecks = [];
  const seniors = demographics.seniors || 0;
  if (seniors > 0) {
    inclusivityChecks.push({
      category: 'Seniors & Elders',
      count: seniors,
      status: accommodations.wheelchairRamp && accommodations.seniorQuietLounge ? 'Ready' : 'Attention Needed',
      notes: 'Ensure low-step access ramps, golf cart shuttle from parking, and lounge seating away from loud subwoofer speakers.'
    });
  }

  const children = (demographics.children || 0) + (demographics.infants || 0);
  if (children > 0) {
    inclusivityChecks.push({
      category: 'Kids & Infants',
      count: children,
      status: accommodations.kidActivityZone && accommodations.lactationRoom ? 'Ready' : 'Attention Needed',
      notes: 'Confirm enclosed safe play zone, high-chairs at dining tables, baby diaper changing stations, and quiet nursing space.'
    });
  }

  // 4. Weather Contingency Action Plan
  const weatherAction = {
    selected: weather.selected || 'hybrid',
    summary: weather.weatherNotice || 'Standard seasonal outlook',
    planA: weather.planA || 'Primary outdoor celebration layout',
    planB_rain: weather.planB_rain || 'Indoor covered alternative hold',
    decisionDeadline: '24 Hours Prior to Event (12:00 PM T-1)',
    checklist: [
      'Confirm indoor hall hold with venue management without extra penalty fees',
      'Ensure heavy industrial canopy weights (min 50kg per tent leg)',
      'Inspect covered transition walkways between parking, ceremony, and dining zones',
      'Pre-stage commercial misting fans (heat) or portable patio blowers (cold)'
    ]
  };

  return {
    totalGuests: total,
    confirmedGuests: confirmed,
    dietaryEntries,
    kitchenDirectives,
    inclusivityChecks,
    weatherAction
  };
}

function formatDietaryName(key) {
  const map = {
    vegetarian: 'Vegetarian (Lacto-Ovo)',
    vegan: 'Strict Vegan',
    glutenFree: 'Gluten-Free / Celiac Safe',
    jain: 'Jain Pure Vegetarian',
    nutAllergy: 'Nut & Peanut Allergy',
    halal: 'Halal Certified',
    standard: 'Standard Omnivore',
    kidsMeal: 'Kids Friendly Menu'
  };
  return map[key] || key.charAt(0).toUpperCase() + key.slice(1);
}
