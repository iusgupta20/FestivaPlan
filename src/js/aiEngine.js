/**
 * FestivaPlan AI - GenAI Engine (Gemini API & Cognitive Fallback)
 * Provides dual-mode AI reasoning: Live Google Gemini 1.5/2.0 Flash integration
 * and an autonomous, context-aware offline reasoning engine.
 * Records prompt input & output for transparent audit and live testing.
 */

export class GenAIEngine {
  constructor() {
    this.lastPrompt = '';
    this.lastResponse = '';
    this.lastMode = 'Cognitive Engine';
  }

  getAuditData() {
    return {
      lastPrompt: this.lastPrompt,
      lastResponse: this.lastResponse,
      lastMode: this.lastMode
    };
  }

  /**
   * Generates or refreshes a dynamic celebration blueprint
   */
  async generateEventBlueprint(event, apiKey = '') {
    const prompt = `You are an elite event planning director. Generate a creative, personalized event concept blueprint for this celebration:
Event: ${event.title}
Type: ${event.type}
Location: ${event.location}
Guest Count: ${event.guestCount}
Total Budget: ${event.currency}${event.totalBudget}
Target Date: ${event.date}
Core Desired Vibe: ${event.vibe}

Respond with:
1. THEME CONCEPT: A catchy 1-sentence headline and 2-sentence rationale.
2. VIBE & SENSORY PALETTE: Visuals, sounds, scents, and guest atmosphere.
3. COLOR PALETTE: 5 hex color codes with symbolic meanings for this celebration.
4. KEY EXECUTION PRIORITIES: Top 3 operational must-haves.
5. SURPRISE & DELIGHT MOMENT: 1 signature memorable guest experience.`;

    this.lastPrompt = prompt;

    if (apiKey && apiKey.trim().length > 10) {
      try {
        const result = await this.callGeminiAPI(prompt, apiKey);
        this.lastResponse = result;
        this.lastMode = 'Google Gemini 1.5/2.0 Flash';
        return { text: result, mode: this.lastMode, prompt };
      } catch (err) {
        console.warn('Gemini API call failed, falling back to built-in Cognitive Engine.', err);
      }
    }

    // Cognitive Fallback
    const result = this.cognitiveFallbackBlueprint(event);
    this.lastResponse = result;
    this.lastMode = 'Festiva Cognitive Rule Engine (Deterministic AI)';
    return { text: result, mode: this.lastMode, prompt };
  }

  /**
   * Generates tactical budget tradeoff advice
   */
  async generateTradeoffAdvice(event, surgeCategory, surgeAmount, apiKey = '') {
    const prompt = `Act as an expert event financial director. The client is organizing "${event.title}" with a budget of ${event.currency}${event.totalBudget}.
The vendor for "${surgeCategory}" has presented a cost surge of +${event.currency}${surgeAmount}.
Explain how to reallocate funds with minimum impact on guest happiness and safety.
Detail which categories to trim, by how much, and what tactical compromise is made.`;

    this.lastPrompt = prompt;

    if (apiKey && apiKey.trim().length > 10) {
      try {
        const result = await this.callGeminiAPI(prompt, apiKey);
        this.lastResponse = result;
        this.lastMode = 'Google Gemini 1.5/2.0 Flash';
        return { text: result, mode: this.lastMode, prompt };
      } catch (err) {
        console.warn('Gemini API call failed, using cognitive engine.', err);
      }
    }

    const result = this.cognitiveFallbackTradeoff(event, surgeCategory, surgeAmount);
    this.lastResponse = result;
    this.lastMode = 'Festiva Cognitive Rule Engine (Deterministic AI)';
    return { text: result, mode: this.lastMode, prompt };
  }

  /**
   * Conversational AI Copilot for interactive queries
   */
  async chatWithCopilot(arg1, arg2, arg3 = [], arg4 = '') {
    let event, userQuestion, chatHistory, apiKey;
    if (typeof arg1 === 'string' && typeof arg2 === 'object') {
      userQuestion = arg1;
      event = arg2 || {};
      chatHistory = Array.isArray(arg4) ? arg4 : (Array.isArray(arg3) ? arg3 : []);
      apiKey = typeof arg3 === 'string' ? arg3 : (typeof arg4 === 'string' ? arg4 : '');
    } else {
      event = arg1 || {};
      userQuestion = arg2 || '';
      chatHistory = Array.isArray(arg3) ? arg3 : [];
      apiKey = typeof arg4 === 'string' ? arg4 : '';
    }
    apiKey = typeof apiKey === 'string' ? apiKey : '';

    const prompt = `You are FestivaPlan AI, a sharp, empathetic, and highly resourceful celebration planner.
Context:
- Event: "${event.title}" (${event.type})
- Location: ${event.location}
- Guests: ${event.guestCount}
- Budget: ${event.currency}${event.totalBudget}
- Date: ${event.date}
- Vibe: ${event.vibe}

User Question: "${userQuestion}"

Provide a concise, practical, and highly actionable response (under 180 words). Include direct tips, estimated costs or savings, and execution steps.`;

    this.lastPrompt = prompt;

    if (apiKey && apiKey.trim().length > 10) {
      try {
        const result = await this.callGeminiAPI(prompt, apiKey);
        this.lastResponse = result;
        this.lastMode = 'Google Gemini 1.5/2.0 Flash';
        return { text: result, mode: this.lastMode, prompt };
      } catch (err) {
        console.warn('Gemini API chat failed, using cognitive engine.', err);
      }
    }

    const result = this.cognitiveFallbackChat(event, userQuestion);
    this.lastResponse = result;
    this.lastMode = 'Festiva Cognitive Rule Engine (Deterministic AI)';
    return { text: result, mode: this.lastMode, prompt };
  }

  /**
   * Calls Google Gemini Generative Language API
   */
  async callGeminiAPI(prompt, apiKey) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`;
    const payload = {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`Gemini API HTTP ${response.status}: ${errBody}`);
    }

    const data = await response.json();
    const candidate = data.candidates && data.candidates[0];
    const textPart = candidate && candidate.content && candidate.content.parts && candidate.content.parts[0];

    if (textPart && textPart.text) {
      return textPart.text;
    }
    throw new Error('Gemini API returned empty candidate text');
  }

  // --- Cognitive Fallback Logic ---
  cognitiveFallbackBlueprint(event) {
    const type = event.type || 'wedding';
    const cur = event.currency || '$';

    if (type === 'wedding') {
      return `### 🌟 AI Theme Blueprint: Royal Heritage Meets Modern Elegance

**Vision:** A breathtaking celebration blending timeless regal traditions with contemporary atmospheric aesthetics.

- **Vibe & Atmosphere:** Scent of fresh tuberose and marigold garlands, warm 2700K ambient amber lantern glow, acoustic Sufi melodies transitioning into a high-energy Sangeet night.
- **Color Palette Rationale:**
  - Gold (#C5A059): Represents royal prosperity and timeless grandeur.
  - Deep Crimson (#8B1E3F): Passion, devotion, and ceremonial sanctity.
  - Champagne (#F4E8C1): Soft luminous contrast for delicate linens and candlelit centerpieces.
  - Royal Violet (#2C1B4D): Sangeet evening drama and luxury lighting accents.
  - Terracotta Sunset (#E07A5F): Warmth for daytime lakeside welcoming rituals.
- **Top 3 Execution Priorities:**
  1. Lock covered backup pavilion for sudden dew or rain 24 hours prior.
  2. Implement dedicated senior golf-cart shuttles from arrival gates to lakeside lawns.
  3. Pre-assign dietary cards to ensure strict segregation of Jain, Vegan, and Nut-Free dishes.
- **Signature Delight Moment:** A twilight floating candle release on the palace lake accompanied by a live instrumental flute prelude.`;
    }

    if (type === 'birthday') {
      return `### 🚀 AI Theme Blueprint: Cosmic Galactic Explorer

**Vision:** An immersive, sensory-rich space journey celebrating curiosity, laughter, and family connection.

- **Vibe & Atmosphere:** Glowing celestial star lanterns, gentle electronic space lullabies, zero-gravity foam obstacle playground, and joyful photo memories.
- **Color Palette Rationale:**
  - Electric Violet (#5E60CE): Deep cosmos and futuristic excitement.
  - Nebula Blue (#4EA8DE): Clear sky optimism and playful wonder.
  - Aqua Cyan (#56CFE1): Fresh youthful energy for balloon installations.
  - Cosmic Pink (#F72585): High-vibrancy accent for smash cake and party favors.
  - Starlight Platinum (#E9ECEF): Clean backdrop balancing bold colors.
- **Top 3 Execution Priorities:**
  1. Child-proof every corner of the venue with soft-edge floor cushions.
  2. Maintain a quiet, temperature-controlled nursery/nap room away from music speakers.
  3. Certified organic, allergen-free smash cake for the birthday toddler.
- **Signature Delight Moment:** Astronaut mascot emergence during giant bubble choreography with take-home mini star-finder certificates.`;
    }

    return `### 🎪 AI Theme Blueprint: Community Harmony & Civic Culture

**Vision:** A vibrant open-air festival highlighting grassroots artistry, hyper-local street culinary talent, and inter-generational civic camaraderie.

- **Vibe & Atmosphere:** Aromas of artisanal street food grills, laughter around picnic benches, acoustic indie band rhythms, and solar fairy lights strung between heritage park trees.
- **Color Palette Rationale:**
  - Forest Emerald (#2A9D8F): Civic sustainability and public green spaces.
  - Terracotta Blaze (#E76F51): Warm hospitality and artisanal food energy.
  - Golden Ochre (#F4A261): Festive sunshine and optimism.
  - Deep Twilight (#264653): Anchoring stage structures and night lighting contrast.
- **Top 3 Execution Priorities:**
  1. Municipal sound permit compliance: calibrate stage amplifiers below 85 dB at boundary line.
  2. Dual certified paramedic station and clearly marked ADA accessible pathways.
  3. Zero-waste compost stations staffed by youth eco-volunteers.
- **Signature Delight Moment:** A collective community lantern illumination ceremony at dusk where attendees tie handwritten wishes to central oak trees.`;
  }

  cognitiveFallbackTradeoff(event, surgeCategory, surgeAmount) {
    const cur = event.currency || '$';
    const amount = Number(surgeAmount) || 1000;

    return `### 💡 AI Strategic Budget Trade-Off Plan

**Surge Context:** "${surgeCategory}" costs increased by **${cur}${amount.toLocaleString()}**.

**Strategic Assessment:**
Directly inflating the total budget will cause stress and financial creep. Instead, we can reallocate resources without compromising guest satisfaction:

1. **Aesthetic Trimming (Save ~45%):**
   - Substitute imported out-of-season floral varieties with rich local seasonal flowers and atmospheric warm LED uplighting.
   - Switch from physical custom stationery to interactive mobile QR schedules and digital animated invites.
   - *Estimated Savings:* **${cur}${Math.round(amount * 0.45).toLocaleString()}**

2. **Schedule & Duration Adjustment (Save ~35%):**
   - Book the live band/DJ for 4 hours of peak celebration instead of 6 hours; use a curated high-fidelity playlist for the initial 90-minute welcoming cocktails.
   - *Estimated Savings:* **${cur}${Math.round(amount * 0.35).toLocaleString()}**

3. **Buffer Absorption (Absorb ~20%):**
   - Draw the remaining balance from the Emergency Contingency reserve, leaving a healthy buffer for day-of operational hiccups.
   - *Estimated Draw:* **${cur}${Math.round(amount * 0.20).toLocaleString()}**

**Outcome:** Net budget impact is **${cur}0**, protecting your core event timeline and guest food quality!`;
  }

  cognitiveFallbackChat(event, question) {
    const q = question.toLowerCase();
    const cur = event.currency || '$';

    if (q.includes('budget') || q.includes('save') || q.includes('cut') || q.includes('cheap')) {
      return `To optimize budget without hurting the experience for "${event.title}":
1. **Focus on high-touch touchpoints:** Guests remember food quality, comfortable seating, and music tempo far more than table linens or paper menus.
2. **Drink & Catering flow:** Pre-batch 2 signature cocktails rather than an open premium bar to cut beverage waste by 22%.
3. **Lighting over Florals:** Warm architectural LED uplighting covers 10x more square footage than floral centerpieces at a fraction of the cost.
Use the **Budget & Tradeoff** tab to test our one-click Auto-Rebalance tool!`;
    }

    if (q.includes('weather') || q.includes('rain') || q.includes('hot') || q.includes('cold') || q.includes('wind')) {
      return `**Weather Readiness Protocol for ${event.title}:**
- **Rain Contingency:** Enforce a strict 24-hour decision point with the venue for moving from outdoor lawn to the covered ballroom hold.
- **Wind & Rain Protection:** Ensure marquee tents have certified water-resistant sidewalls and minimum 50kg leg weights.
- **Guest Comfort:** Pre-stage 50 clear bubble umbrellas for photo walks and covered golf cart shuttles. Check the **Guests & Inclusivity** tab for the full weather matrix!`;
    }

    if (q.includes('kid') || q.includes('children') || q.includes('senior') || q.includes('elder') || q.includes('accessible')) {
      return `**Inclusivity & Demographic Recommendations:**
- **For Seniors (${event.guestCount} guests):** Reserve tables in the lower decibel zone (away from subwoofer speakers) with wider aisle pathways for walking canes or wheelchairs.
- **For Kids & Toddlers:** Create a dedicated 20x20ft soft-play zone with washable coloring rolls, child-sized juice boxes, and an assigned teen activity sitter.
Check the **Guests & Inclusivity** tab to track allergy and dietary segregation!`;
    }

    if (q.includes('vendor') || q.includes('quote') || q.includes('photographer') || q.includes('cater')) {
      return `**Vendor Selection Tactics:**
- Always compare at least 2-3 quotes using our **Vendor Coordination** tab.
- Pay attention to overtime hourly rates ($/hr past midnight)—this is where hidden fees spike!
- Ask vendors for complimentary perks (e.g. free midnight snacks, free pre-wedding shoot, or sound permit filing) before signing contracts.`;
    }

    return `For "${event.title}", the key to moving from ideas to flawless execution is strict timeline phase gating:
1. Lock your non-negotiables (Venue & Date) first.
2. Align vendor deliverables against your actual guest headcount.
3. Conduct a sound & lighting walk-through 7 days prior.
Would you like me to simulate a budget trade-off, generate an automated vendor RFP, or review your D-Day run-sheet?`;
  }
}

export const aiEngine = new GenAIEngine();
