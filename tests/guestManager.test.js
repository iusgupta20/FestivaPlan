import { describe, it } from 'node:test';
import assert from 'node:assert';
import { analyzeGuestDemographicsAndDietary } from '../src/js/guestManager.js';

describe('Guest Personalization & Inclusivity Manager', () => {
  const sampleGuests = {
    total: 250,
    confirmed: 200,
    declined: 15,
    pending: 35,
    dietary: {
      vegetarian: 100,
      vegan: 20,
      glutenFree: 15,
      nutAllergy: 6,
      jain: 25,
      halal: 0,
      standard: 34
    },
    demographics: {
      seniors: 30,
      adults: 140,
      children: 20,
      infants: 10
    },
    accommodations: {
      wheelchairRamp: true,
      seniorQuietLounge: true,
      golfCartShuttle: true,
      kidActivityZone: true,
      lactationRoom: true
    },
    weatherPlan: {
      selected: 'hybrid',
      planA: 'Lakeside Courtyard lawn',
      planB_rain: 'Pavilion indoor hall hold',
      weatherNotice: 'Pleasant autumn breeze'
    }
  };

  it('aggregates dietary counts and percentages accurately', () => {
    const analysis = analyzeGuestDemographicsAndDietary(sampleGuests);
    assert.strictEqual(analysis.totalGuests, 250);
    assert.strictEqual(analysis.confirmedGuests, 200);

    const veg = analysis.dietaryEntries.find(d => d.rawType === 'vegetarian');
    assert.ok(veg, 'Vegetarian entry should exist');
    assert.strictEqual(veg.count, 100);
    assert.strictEqual(veg.percent, 50.0); // 100 / 200 = 50%
  });

  it('triggers critical allergen directives when nut allergy is detected', () => {
    const analysis = analyzeGuestDemographicsAndDietary(sampleGuests);
    const nutAlert = analysis.kitchenDirectives.find(k => k.title.includes('Nut Allergy'));
    assert.ok(nutAlert, 'Must flag severe nut allergy to kitchen');
    assert.strictEqual(nutAlert.severity, 'CRITICAL');
  });

  it('generates high severity directives for celiac gluten-free and Jain diets', () => {
    const analysis = analyzeGuestDemographicsAndDietary(sampleGuests);
    const glutenAlert = analysis.kitchenDirectives.find(k => k.title.includes('Gluten-Free'));
    const jainAlert = analysis.kitchenDirectives.find(k => k.title.includes('Jain'));

    assert.ok(glutenAlert, 'Must flag gluten-free segregation');
    assert.ok(jainAlert, 'Must flag Jain meal root-free requirements');
  });

  it('evaluates senior citizen and child accommodation checklists', () => {
    const analysis = analyzeGuestDemographicsAndDietary(sampleGuests);
    const seniorCheck = analysis.inclusivityChecks.find(c => c.category.includes('Seniors'));
    assert.ok(seniorCheck);
    assert.strictEqual(seniorCheck.status, 'Ready');

    const kidCheck = analysis.inclusivityChecks.find(c => c.category.includes('Kids'));
    assert.ok(kidCheck);
    assert.strictEqual(kidCheck.status, 'Ready');
  });

  it('constructs a formal 24-hour weather contingency plan with checklist items', () => {
    const analysis = analyzeGuestDemographicsAndDietary(sampleGuests);
    assert.ok(analysis.weatherAction.planA);
    assert.ok(analysis.weatherAction.planB_rain);
    assert.ok(analysis.weatherAction.checklist.length >= 3);
  });
});
