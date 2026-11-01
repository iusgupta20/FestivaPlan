/**
 * FestivaPlan AI - Central Reactive State Management
 * Handles event configuration, presets, budget allocations, vendor lists,
 * timeline tasks, guest demographics, and pub/sub subscribers.
 */

export const EVENT_PRESETS = {
  wedding: {
    id: 'preset-wedding',
    title: 'Aarav & Meera’s Royal Sangeet & Palace Wedding',
    type: 'wedding',
    currency: '₹',
    currencyCode: 'INR',
    date: '2026-12-18',
    location: 'Udaipur Heritage Palace & Lakeside Lawn',
    totalBudget: 2500000,
    guestCount: 250,
    vibe: 'Regal Heritage meets Contemporary Luxury',
    themeDescription: 'Marigold sunset palette with warm ambient brass lanterns, live acoustic Sufi melodies, and royal Rajasthani banquet hospitality.',
    colorPalette: ['#FFFFFF', '#10B981', '#F59E0B', '#EF4444', '#38BDF8', '#8B5CF6', '#F97316', '#92400E'],
    budgetItems: [
      { id: 'b-1', category: 'Venue & Banquet', target: 950000, actual: 980000, priority: 'High', flexibility: 'Low', notes: 'Heritage courtyard + lakeside lawn hold' },
      { id: 'b-2', category: 'Catering & Dining', target: 600000, actual: 630000, priority: 'High', flexibility: 'Medium', notes: 'Multi-course vegetarian & regional delicacies' },
      { id: 'b-3', category: 'Decor & Floral Styling', target: 350000, actual: 380000, priority: 'Medium', flexibility: 'High', notes: 'Peonies, marigold canopies, warm fairy drapes' },
      { id: 'b-4', category: 'Photo & Cinematic Video', target: 250000, actual: 240000, priority: 'High', flexibility: 'Low', notes: '3-day drone, teaser trailer, candid album' },
      { id: 'b-5', category: 'Entertainment & Live Band', target: 150000, actual: 160000, priority: 'Medium', flexibility: 'High', notes: 'Sufi folk fusion ensemble + DJ Sangeet night' },
      { id: 'b-6', category: 'Attire & Makeup Styling', target: 100000, actual: 95000, priority: 'Medium', flexibility: 'Medium', notes: 'Bridal HMUA and family styling assistance' },
      { id: 'b-7', category: 'Invitations & Guest Favors', target: 50000, actual: 45000, priority: 'Low', flexibility: 'High', notes: 'Digital animated RSVP + artisanal spice boxes' },
      { id: 'b-8', category: 'Emergency Contingency Buffer', target: 50000, actual: 35000, priority: 'High', flexibility: 'Medium', notes: 'Unforeseen weather, overtime generator backup' }
    ],
    vendors: [
      {
        id: 'v-1',
        category: 'Catering & Dining',
        name: 'Shahi Dawat Royal Caterers',
        quoteAmount: 630000,
        rating: 4.9,
        deliverables: 'Live Chaat counter, 4-tier dessert buffet, uniformed silver service, bar setup',
        overtimeRate: 8000,
        cancellationPolicy: 'Refundable up to 30 days prior (10% admin fee)',
        perks: 'Complimentary midnight snack bar & herbal digestive station',
        status: 'Confirmed'
      },
      {
        id: 'v-2',
        category: 'Catering & Dining',
        name: 'Gourmet Heritage Flavors',
        quoteAmount: 580000,
        rating: 4.5,
        deliverables: 'Standard 3-course buffet, 2 live counters, standard banquet staff',
        overtimeRate: 10000,
        cancellationPolicy: '50% non-refundable deposit',
        perks: 'Free welcome mocktails (up to 150 servings)',
        status: 'Shortlisted'
      },
      {
        id: 'v-3',
        category: 'Photo & Cinematic Video',
        name: 'AuraLens Studios',
        quoteAmount: 240000,
        rating: 4.8,
        deliverables: '3 Photographers, 2 Cinematographers, 4K Drone coverage, 3-min same-day teaser',
        overtimeRate: 6000,
        cancellationPolicy: 'Flexible rescheduling within 6 months',
        perks: 'Complimentary Pre-wedding Sunset Shoot in Udaipur',
        status: 'Confirmed'
      },
      {
        id: 'v-4',
        category: 'Decor & Floral Styling',
        name: 'Vibrant Petals & Lights',
        quoteAmount: 380000,
        rating: 4.7,
        deliverables: 'Mandap floral cascade, LED tunnel entry, 30 table centerpieces',
        overtimeRate: 5000,
        cancellationPolicy: 'Non-refundable floral advance 14 days prior',
        perks: 'Includes complimentary photo-booth backdrop with neon sign',
        status: 'Confirmed'
      },
      {
        id: 'v-5',
        category: 'Decor & Floral Styling',
        name: 'Minimalist Luxe Concepts',
        quoteAmount: 310000,
        rating: 4.4,
        deliverables: 'Fabric draping, fairy lighting canopy, local seasonal floral accents',
        overtimeRate: 4000,
        cancellationPolicy: 'Full refund up to 21 days prior',
        perks: 'Free ambient uplighting for garden trees',
        status: 'Contacted'
      }
    ],
    tasks: [
      { id: 't-1', title: 'Lock Palace Venue Contract & Deposit', category: 'Venue', phase: 'T-90', dueDate: '2026-09-18', priority: 'Critical', completed: true, dependencies: 'None' },
      { id: 't-2', title: 'Finalize Master Guest List & Dispatch Digital RSVPs', category: 'Guests', phase: 'T-90', dueDate: '2026-09-30', priority: 'High', completed: true, dependencies: 'None' },
      { id: 't-3', title: 'Catering Menu Tasting & Food Restriction Tagging', category: 'Catering', phase: 'T-30', dueDate: '2026-11-18', priority: 'Critical', completed: true, dependencies: 't-2' },
      { id: 't-4', title: 'Review Floral Samples & Rain Proofing Canopies', category: 'Decor', phase: 'T-30', dueDate: '2026-11-25', priority: 'Medium', completed: false, dependencies: 't-1' },
      { id: 't-5', title: 'Lock Sangeet Choreography & DJ Playlist Cue Sheet', category: 'Entertainment', phase: 'T-7', dueDate: '2026-12-11', priority: 'Medium', completed: false, dependencies: 'None' },
      { id: 't-6', title: 'Confirm Elderly Wheelchair Ramp & Golf Cart Shuttle', category: 'Accessibility', phase: 'T-7', dueDate: '2026-12-14', priority: 'High', completed: false, dependencies: 't-1' },
      { id: 't-7', title: 'D-Day Run-sheet Handover to Family Leads', category: 'Logistics', phase: 'D-Day', dueDate: '2026-12-18', priority: 'Critical', completed: false, dependencies: 't-6' }
    ],
    guests: {
      total: 250,
      confirmed: 218,
      declined: 14,
      pending: 18,
      dietary: {
        vegetarian: 140,
        vegan: 22,
        glutenFree: 15,
        jain: 28,
        nutAllergy: 7,
        halal: 0,
        standard: 38
      },
      demographics: {
        seniors: 42,
        adults: 165,
        children: 28,
        infants: 15
      },
      accommodations: {
        wheelchairRamp: true,
        seniorQuietLounge: true,
        lactationRoom: true,
        kidActivityZone: true,
        golfCartShuttle: true
      },
      weatherPlan: {
        selected: 'hybrid',
        planA: 'Lakeside Courtyard open-air ceremony under stars',
        planB_rain: 'Covered Crystal Pavilion hall hold with heated blowers',
        weatherNotice: '70% pleasant evening breeze expected; lawn heaters on standby'
      }
    }
  },

  birthday: {
    id: 'preset-birthday',
    title: 'Leo’s 1st Birthday: Cosmic Little Astronaut Journey',
    type: 'birthday',
    currency: '$',
    currencyCode: 'USD',
    date: '2026-11-28',
    location: 'Skyline Garden Club & Glasshouse',
    totalBudget: 4500,
    guestCount: 65,
    vibe: 'Playful Space Odyssey & Pastel Galactic Wonder',
    themeDescription: 'Soft blues, cosmic silvers, star-shaped sensory play, toddler astronaut photo-booth, and bespoke smash-cake reveal.',
    colorPalette: ['#5E60CE', '#4EA8DE', '#56CFE1', '#F72585', '#E9ECEF'],
    budgetItems: [
      { id: 'bb-1', category: 'Venue & Gazebo Rental', target: 1400, actual: 1450, priority: 'High', flexibility: 'Low', notes: 'Private lawn + indoor play atrium' },
      { id: 'bb-2', category: 'Kids & Adult Catering', target: 1200, actual: 1300, priority: 'High', flexibility: 'Medium', notes: 'Finger foods, toddler organic fruit purees, adult grazing board' },
      { id: 'bb-3', category: 'Theme Balloon Arch & Space Decor', target: 700, actual: 650, priority: 'Medium', flexibility: 'High', notes: 'Zero-gravity balloon cloud + metallic planet mobiles' },
      { id: 'bb-4', category: 'Kids Entertainer & Bubble Show', target: 450, actual: 450, priority: 'High', flexibility: 'Medium', notes: 'Astronaut character + 45-min giant bubble artist' },
      { id: 'bb-5', category: 'Custom Cake & Smash Corner', target: 350, actual: 380, priority: 'Medium', flexibility: 'Low', notes: '2-tier astronaut cake + gluten-free smash cake' },
      { id: 'bb-6', category: 'Event Photography', target: 300, actual: 300, priority: 'Medium', flexibility: 'High', notes: '3-hour documentary coverage' },
      { id: 'bb-7', category: 'Goodie Bags & Sensory Toys', target: 100, actual: 120, priority: 'Low', flexibility: 'High', notes: 'Space coloring books + non-toxic playdough' }
    ],
    vendors: [
      {
        id: 'vb-1',
        category: 'Theme Balloon Arch & Space Decor',
        name: 'Galactic Party Crafts',
        quoteAmount: 650,
        rating: 4.9,
        deliverables: 'Organic 12ft balloon arch, backdrop board, neon "One" sign, 4 helium astronauts',
        overtimeRate: 50,
        cancellationPolicy: 'Refundable up to 7 days prior',
        perks: 'Complimentary smash-cake pedestal table',
        status: 'Confirmed'
      },
      {
        id: 'vb-2',
        category: 'Kids Entertainer & Bubble Show',
        name: 'Starlight Magic & Bubbles',
        quoteAmount: 450,
        rating: 4.8,
        deliverables: '90 minutes interactive show, toddler balloon twisting, musical games',
        overtimeRate: 75,
        cancellationPolicy: 'Free reschedule in case of toddler illness',
        perks: 'Free mini astronaut badge for all attending kids',
        status: 'Confirmed'
      }
    ],
    tasks: [
      { id: 'tb-1', title: 'Confirm Sensory Soft-play Rental', category: 'Entertainment', phase: 'T-30', dueDate: '2026-10-28', priority: 'High', completed: true, dependencies: 'None' },
      { id: 'tb-2', title: 'Order Custom Astronaut Smash Cake', category: 'Catering', phase: 'T-30', dueDate: '2026-11-05', priority: 'Critical', completed: true, dependencies: 'None' },
      { id: 'tb-3', title: 'Assemble Toddler Safety Goodie Bags', category: 'Favors', phase: 'T-7', dueDate: '2026-11-21', priority: 'Medium', completed: false, dependencies: 'None' },
      { id: 'tb-4', title: 'Setup Nap/Sensory Quiet Corner in Atrium', category: 'Accessibility', phase: 'D-Day', dueDate: '2026-11-28', priority: 'High', completed: false, dependencies: 'None' }
    ],
    guests: {
      total: 65,
      confirmed: 58,
      declined: 4,
      pending: 3,
      dietary: {
        vegetarian: 18,
        vegan: 6,
        glutenFree: 8,
        jain: 0,
        nutAllergy: 5,
        halal: 10,
        standard: 25
      },
      demographics: {
        seniors: 8,
        adults: 35,
        children: 14,
        infants: 8
      },
      accommodations: {
        wheelchairRamp: true,
        seniorQuietLounge: false,
        lactationRoom: true,
        kidActivityZone: true,
        golfCartShuttle: false
      },
      weatherPlan: {
        selected: 'indoor',
        planA: 'Sunny lawn picnic & bubble playground',
        planB_rain: 'Move soft-play equipment into glasshouse atrium with zero disruption',
        weatherNotice: 'Forecast shows crisp sunny day (21°C)'
      }
    }
  },

  community: {
    id: 'preset-community',
    title: 'Oakridge Autumn Harmony Food & Jazz Festival',
    type: 'community',
    currency: '$',
    currencyCode: 'USD',
    date: '2026-12-05',
    location: 'Oakridge Central Community Plaza & Amphitheater',
    totalBudget: 18000,
    guestCount: 750,
    vibe: 'Vibrant Civic Celebration, Local Culinary Hub & Live Indie Melodies',
    themeDescription: 'Eclectic neighborhood celebration featuring local artisan food trucks, youth eco-workshops, two live acoustic stages, and warm lantern lighting.',
    colorPalette: ['#2A9D8F', '#E76F51', '#F4A261', '#264653', '#E9C46A'],
    budgetItems: [
      { id: 'bc-1', category: 'Civic Permits, Security & EMS', target: 3500, actual: 3600, priority: 'High', flexibility: 'Low', notes: 'City council street closure permit, licensed security, paramedic station' },
      { id: 'bc-2', category: 'Stage, Sound System & AV Tech', target: 4500, actual: 4800, priority: 'High', flexibility: 'Low', notes: 'Line-array audio, dynamic lighting, 2 power generator trailers' },
      { id: 'bc-3', category: 'Sanitation, Waste & Eco-Borders', target: 2500, actual: 2300, priority: 'High', flexibility: 'Medium', notes: '12 portable washrooms (2 ADA accessible), compost sorting team' },
      { id: 'bc-4', category: 'Artist Fees & Honorariums', target: 4000, actual: 4200, priority: 'Medium', flexibility: 'Medium', notes: '6 local jazz & folk bands, MC, sound engineer' },
      { id: 'bc-5', category: 'Seating, Tents & Crowd Barriers', target: 2000, actual: 2200, priority: 'Medium', flexibility: 'High', notes: '25 picnic benches, 4 marquee tents, perimeter stanchions' },
      { id: 'bc-6', category: 'Promotions, Signage & Wayfinding', target: 1000, actual: 800, priority: 'Low', flexibility: 'High', notes: 'Recyclable directional signs, QR code schedule flyers' },
      { id: 'bc-7', category: 'Emergency Weather Contingency', target: 500, actual: 400, priority: 'High', flexibility: 'Low', notes: 'Industrial water pumps & heavy tarpaulins' }
    ],
    vendors: [
      {
        id: 'vc-1',
        category: 'Stage, Sound System & AV Tech',
        name: 'MetroSonic Live Events',
        quoteAmount: 4800,
        rating: 4.8,
        deliverables: 'Dual stage PA system, 2 digital mixers, 2 dedicated audio techs, sound license filing',
        overtimeRate: 200,
        cancellationPolicy: 'Refundable up to 14 days prior',
        perks: 'Complimentary wireless microphones for community announcements',
        status: 'Confirmed'
      },
      {
        id: 'vc-2',
        category: 'Civic Permits, Security & EMS',
        name: 'ShieldGuard Event Protection',
        quoteAmount: 3600,
        rating: 4.9,
        deliverables: '6 licensed crowd managers, 2 certified paramedics, direct liaison with local police',
        overtimeRate: 150,
        cancellationPolicy: 'Full refund 48h prior in case of civic force majeure',
        perks: 'Free emergency perimeter first-aid kits',
        status: 'Confirmed'
      }
    ],
    tasks: [
      { id: 'tc-1', title: 'Finalize City Council Noise & Street Permits', category: 'Permits', phase: 'T-90', dueDate: '2026-09-20', priority: 'Critical', completed: true, dependencies: 'None' },
      { id: 'tc-2', title: 'Screen Food Truck Health Inspector Certifications', category: 'Compliance', phase: 'T-30', dueDate: '2026-11-10', priority: 'Critical', completed: true, dependencies: 'tc-1' },
      { id: 'tc-3', title: 'Conduct Acoustic Sound Check with MetroSonic', category: 'Production', phase: 'T-7', dueDate: '2026-12-04', priority: 'High', completed: false, dependencies: 'None' },
      { id: 'tc-4', title: 'Verify ADA Accessibility Pathways & Ramps', category: 'Accessibility', phase: 'D-Day', dueDate: '2026-12-05', priority: 'Critical', completed: false, dependencies: 'None' }
    ],
    guests: {
      total: 750,
      confirmed: 680,
      declined: 0,
      pending: 70,
      dietary: {
        vegetarian: 310,
        vegan: 95,
        glutenFree: 75,
        jain: 20,
        nutAllergy: 30,
        halal: 85,
        standard: 220
      },
      demographics: {
        seniors: 120,
        adults: 480,
        children: 110,
        infants: 40
      },
      accommodations: {
        wheelchairRamp: true,
        seniorQuietLounge: true,
        lactationRoom: true,
        kidActivityZone: true,
        golfCartShuttle: true
      },
      weatherPlan: {
        selected: 'outdoor_contingency',
        planA: 'Open park lawns with string lighting',
        planB_rain: 'Canopy covered pavilions + emergency crowd dispersal pathway',
        weatherNotice: 'Light afternoon cloud cover predicted; rain tarps pre-staged'
      }
    }
  },

  corporate: {
    id: 'preset-corporate',
    title: 'Nexus Cloud Summit 2026 Innovation Gala',
    type: 'corporate',
    currency: '$',
    currencyCode: 'USD',
    date: '2026-11-20',
    location: 'Metropolitan Convention Hall & Horizon Terrace',
    totalBudget: 45000,
    guestCount: 300,
    vibe: 'Sleek Cybernetic Luxe, Executive Networking & High-Tech Visuals',
    themeDescription: 'Deep navy and holographic platinum visual design with interactive AI demonstration kiosks, keynote theatre, and curated champagne networking lounge.',
    colorPalette: ['#0A192F', '#0077B6', '#00B4D8', '#90E0EF', '#E2E8F0'],
    budgetItems: [
      { id: 'bcor-1', category: 'Convention Ballroom & Terrace', target: 16000, actual: 16500, priority: 'High', flexibility: 'Low', notes: 'Main auditorium + breakout exhibition wings' },
      { id: 'bcor-2', category: 'Keynote AV, LED Video Wall & Livestream', target: 12000, actual: 12500, priority: 'High', flexibility: 'Low', notes: '4K ultra-wide curved LED wall + 3 camera broadcast' },
      { id: 'bcor-3', category: 'Executive Plated Dinner & Cocktails', target: 10000, actual: 10400, priority: 'High', flexibility: 'Medium', notes: '3-course fusion dinner + premium sommelier pairings' },
      { id: 'bcor-4', category: 'Keynote Speaker Honorarium & VIP Travel', target: 4000, actual: 3800, priority: 'Medium', flexibility: 'Medium', notes: 'Industry thought-leader flights & 5-star lodging' },
      { id: 'bcor-5', category: 'Badging, NFC Passes & Swag Packs', target: 2000, actual: 1900, priority: 'Low', flexibility: 'High', notes: 'Sustainable bamboo NFC badges + smart notebooks' },
      { id: 'bcor-6', category: 'Contingency & Incident Management', target: 1000, actual: 800, priority: 'High', flexibility: 'Low', notes: 'Dual-ISP redundant internet failover' }
    ],
    vendors: [
      {
        id: 'vcor-1',
        category: 'Keynote AV, LED Video Wall & Livestream',
        name: 'OmniStage Visuals Inc.',
        quoteAmount: 12500,
        rating: 4.95,
        deliverables: 'Curved 40ft LED screen, Shure wireless microphones, low-latency worldwide broadcast stream',
        overtimeRate: 300,
        cancellationPolicy: 'Refundable up to 21 days prior',
        perks: 'Free recorded 4K session recordings with master editing',
        status: 'Confirmed'
      }
    ],
    tasks: [
      { id: 'tcor-1', title: 'Confirm Keynote Speaker Flight & Rehearsal Schedule', category: 'Programming', phase: 'T-30', dueDate: '2026-10-25', priority: 'Critical', completed: true, dependencies: 'None' },
      { id: 'tcor-2', title: 'Test 1Gbps Redundant Network Stream with OmniStage', category: 'AV & Tech', phase: 'T-7', dueDate: '2026-11-15', priority: 'Critical', completed: false, dependencies: 'None' },
      { id: 'tcor-3', title: 'Print VIP Badge Access Cards & VIP Dining Badges', category: 'Logistics', phase: 'T-7', dueDate: '2026-11-17', priority: 'Medium', completed: false, dependencies: 'None' }
    ],
    guests: {
      total: 300,
      confirmed: 285,
      declined: 8,
      pending: 7,
      dietary: {
        vegetarian: 90,
        vegan: 45,
        glutenFree: 38,
        jain: 12,
        nutAllergy: 18,
        halal: 35,
        standard: 120
      },
      demographics: {
        seniors: 25,
        adults: 260,
        children: 0,
        infants: 0
      },
      accommodations: {
        wheelchairRamp: true,
        seniorQuietLounge: true,
        lactationRoom: true,
        kidActivityZone: false,
        golfCartShuttle: false
      },
      weatherPlan: {
        selected: 'indoor',
        planA: 'Auditorium + Skyline Terrace dinner',
        planB_rain: 'Move evening cocktail bar into Grand Foyer glass atrium',
        weatherNotice: 'Weather proof indoor facility'
      }
    }
  }
};

export class EventStateManager {
  constructor() {
    this.storageKey = 'festivaplan_active_event_v1';
    this.listeners = new Map();
    this.state = this.loadInitialState();
  }

  loadInitialState() {
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.id && parsed.totalBudget) {
            return parsed;
          }
        }
      }
    } catch (e) {
      // Safe fallback
    }
    return JSON.parse(JSON.stringify(EVENT_PRESETS.wedding));
  }

  save() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.storageKey, JSON.stringify(this.state));
      }
    } catch (e) {
      // Safe fallback
    }
  }

  getState() {
    return this.state;
  }

  loadPreset(presetKey) {
    if (EVENT_PRESETS[presetKey]) {
      this.state = JSON.parse(JSON.stringify(EVENT_PRESETS[presetKey]));
      this.save();
      this.emit('stateChanged', this.state);
      this.emit('presetLoaded', presetKey);
    }
  }

  updateEventDetails(updates) {
    this.state = {
      ...this.state,
      ...updates
    };
    this.save();
    this.emit('eventDetailsChanged', this.state);
    this.emit('stateChanged', this.state);
  }

  // --- Budget Methods ---
  updateBudgetItem(id, updates) {
    const item = this.state.budgetItems.find(b => b.id === id);
    if (item) {
      Object.assign(item, updates);
      this.save();
      this.emit('budgetChanged', this.state.budgetItems);
      this.emit('stateChanged', this.state);
    }
  }

  setBudgetItems(newItems) {
    this.state.budgetItems = newItems;
    this.save();
    this.emit('budgetChanged', this.state.budgetItems);
    this.emit('stateChanged', this.state);
  }

  getBudgetMetrics() {
    const total = Number(this.state.totalBudget) || 1;
    const items = this.state.budgetItems || [];
    const allocated = items.reduce((sum, item) => sum + (Number(item.actual) || Number(item.target) || 0), 0);
    const targetSum = items.reduce((sum, item) => sum + (Number(item.target) || 0), 0);
    const difference = total - allocated;
    const isOverbudget = difference < 0;
    const overbudgetAmount = isOverbudget ? Math.abs(difference) : 0;
    const overbudgetPercent = isOverbudget ? ((overbudgetAmount / total) * 100).toFixed(1) : '0.0';
    const perGuestSpend = this.state.guestCount > 0 ? Math.round(allocated / this.state.guestCount) : 0;

    return {
      total,
      allocated,
      targetSum,
      difference,
      isOverbudget,
      overbudgetAmount,
      overbudgetPercent,
      perGuestSpend,
      currency: this.state.currency || '$'
    };
  }

  // --- Vendor Methods ---
  addVendor(vendor) {
    const newVendor = {
      id: 'v-' + Date.now(),
      status: 'Contacted',
      rating: 4.5,
      ...vendor
    };
    this.state.vendors.push(newVendor);
    this.save();
    this.emit('vendorsChanged', this.state.vendors);
    this.emit('stateChanged', this.state);
    return newVendor;
  }

  updateVendorStatus(id, status) {
    return this.updateVendor(id, { status });
  }

  updateVendor(id, updates) {
    const vendor = this.state.vendors.find(v => v.id === id);
    if (vendor) {
      Object.assign(vendor, updates);
      this.save();
      this.emit('vendorsChanged', this.state.vendors);
      this.emit('stateChanged', this.state);
    }
  }

  deleteVendor(id) {
    this.state.vendors = this.state.vendors.filter(v => v.id !== id);
    this.save();
    this.emit('vendorsChanged', this.state.vendors);
    this.emit('stateChanged', this.state);
  }

  // --- Task Methods ---
  addTask(task) {
    const newTask = {
      id: 't-' + Date.now(),
      completed: false,
      priority: 'Medium',
      phase: 'T-7',
      dependencies: 'None',
      ...task
    };
    this.state.tasks.push(newTask);
    this.save();
    this.emit('tasksChanged', this.state.tasks);
    this.emit('stateChanged', this.state);
    return newTask;
  }

  toggleTask(id) {
    const task = this.state.tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      this.save();
      this.emit('tasksChanged', this.state.tasks);
      this.emit('stateChanged', this.state);
    }
  }

  updateTask(id, updates) {
    const task = this.state.tasks.find(t => t.id === id);
    if (task) {
      Object.assign(task, updates);
      this.save();
      this.emit('tasksChanged', this.state.tasks);
      this.emit('stateChanged', this.state);
    }
  }

  deleteTask(id) {
    this.state.tasks = this.state.tasks.filter(t => t.id !== id);
    this.save();
    this.emit('tasksChanged', this.state.tasks);
    this.emit('stateChanged', this.state);
  }

  // --- Guests & Inclusivity ---
  updateGuests(guestUpdates) {
    this.state.guests = {
      ...this.state.guests,
      ...guestUpdates
    };
    this.save();
    this.emit('guestsChanged', this.state.guests);
    this.emit('stateChanged', this.state);
  }

  // --- API Key Management (Security Conscious) ---
  getApiKey() {
    if (typeof sessionStorage !== 'undefined') {
      return sessionStorage.getItem('festivaplan_gemini_api_key') || '';
    }
    return this._mockApiKey || '';
  }

  setApiKey(key) {
    if (typeof sessionStorage !== 'undefined') {
      if (!key) {
        sessionStorage.removeItem('festivaplan_gemini_api_key');
      } else {
        sessionStorage.setItem('festivaplan_gemini_api_key', key.trim());
      }
    } else {
      this._mockApiKey = key ? key.trim() : '';
    }
    this.emit('apiKeyChanged', !!key);
  }

  hasApiKey() {
    return !!this.getApiKey();
  }

  // --- Pub/Sub Event System ---
  subscribe(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.listeners.get(event).delete(callback);
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      for (const cb of this.listeners.get(event)) {
        try {
          cb(data);
        } catch (err) {
          console.error(`Error in subscriber for event "${event}":`, err);
        }
      }
    }
  }

  // Reset to default
  reset() {
    this.loadPreset('wedding');
  }
}

export const eventState = new EventStateManager();
