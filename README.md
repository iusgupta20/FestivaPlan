# FestivaPlan AI — GenAI Celebration & Intelligent Event Execution Assistant

> **Hack2skill Virtual Hackathon | Challenge 5: Celebration & Event Planner**  
> *Track: Moving from Inspiration to Execution: GenAI-Powered Celebration & Event Assistant*

---

## 🌟 Executive Overview & Chosen Vertical

**FestivaPlan AI** is a full-lifecycle, production-ready event planning and operations platform designed to organize **Weddings, Milestone Birthdays, Community Festivals, and Corporate Galas**.

Unlike traditional tools that only output static checklists or generic ideas, **FestivaPlan AI moves from inspiration to actionable execution** by embedding mathematical constraint solvers and generative intelligence directly into:
1. **Dynamic Budget Management & Trade-Offs**: Solves cost spikes and reallocation scenarios with zero guest experience compromise.
2. **Multi-Attribute Vendor Utility Scoring**: Evaluates pricing, contract risk, deliverables, and bonus perks side-by-side with automated RFP generation.
3. **Timeline Prioritization & Dependency Engine**: Automatic milestone countdown, dynamic urgency shifting (escalating overdue tasks to Critical), dependency blocker detection, and D-Day Hour-by-Hour Master Run-Sheets.
4. **Personalized Inclusivity & Contingency Management**: Quantitative dietary allergen segregation (nut allergies, celiac gluten-free, Jain, vegan), senior & infant accessibility checklists, and 24-hour weather contingency protocols.

---

## 🏛️ Architecture & System Design

```
                                  FestivaPlan AI
                                         │
        ┌────────────────────────────────┼────────────────────────────────┐
        │                                │                                │
 ┌──────▼──────┐                 ┌───────▼────────┐               ┌───────▼────────┐
 │  UI Shell   │                 │  Core Engines  │               │ Dual-AI Tier   │
 └──────┬──────┘                 └───────┬────────┘               └───────┬────────┘
        │                                │                                │
  Vanilla CSS / SPA               Trade-off Solver               Google Gemini Live
  Glassmorphic Design             Vendor Utility Matrix          (Gemini 1.5/2.0 Flash)
  Dark/Light Theme                Dependency Scheduler                   │
  WCAG 2.1 AA Accessible          Guest Dietary Engine                   ▼
  Zero-Bloat (<150KB)             Reactive State Bus             Autonomous Cognitive
                                                                 Fallback Engine
```

### 1. Dual-Mode GenAI Architecture (Zero-Failure Guarantee)
- **Live Google Gemini 1.5/2.0 Flash**: Direct generative completion for nuanced concept development, strategic trade-off rationalization, and conversational copilot advice.
- **Autonomous Cognitive Rule Engine (Deterministic AI)**: Runs 100% locally in the browser with zero external network dependencies, ensuring the evaluator or judge can test all dynamic features instantly without requiring an API key.
- **Transparency Console (Prompt & Response Inspector)**: Exposes the exact real-time prompt payload and raw model response for live auditability.

---

## 🚀 Key Functional Modules

### 1. Event Blueprint & Aesthetic Architecture
- **Demonstration Scenarios**: 1-click presets for *Aarav & Meera's Royal Sangeet & Palace Wedding*, *Leo's 1st Birthday Cosmic Journey*, *Oakridge Community Food & Jazz Fest*, and *Nexus Cloud Summit Gala*.
- **Curated Atmosphere & Sensory Direction**: Dynamic thematic narratives, sensory cues (scents, sounds, lighting), and 5-swatch symbolic hex palettes.

### 2. Intelligent Budget Trade-Off Simulator & Auto-Rebalancing
- **KPI Velocity Monitoring**: Live Tracking of Total Cap, Allocated Actuals, Variance Deficit/Surplus, and Per-Guest Spend Velocity.
- **"What-If" Cost Surge Solver**: When a vendor presents a price spike (e.g., catering costs rise by ₹50,000 or $2,000), the optimizer generates 3 distinct compromise strategies:
  - **Strategy A (Aesthetic Trim)**: Offsets the surge by trimming low-impact floral imports and switching to digital QR stationery.
  - **Strategy B (Production Duration)**: Optimizes live band/DJ hours with curated acoustic playlists.
  - **Strategy C (Proportional Spread)**: Distributes minor reductions across non-critical categories.
- **1-Click Auto-Rebalance**: Uses priority weights and floor protections (minimum 50% target floor) to restore budget balance automatically.

### 3. Vendor Coordination & Quotation Evaluation Matrix
- **Multi-Attribute Utility Scoring**:
  $$\text{Value Score} = \text{Rating (40 pts)} + \text{Cost Competitiveness (35 pts)} + \text{Contract Flexibility (15 pts)} + \text{Bonus Perks (10 pts)}$$
- **Automated AI RFP Generator**: Produces ready-to-dispatch formal Requests for Proposals containing exact event parameters, guest counts, and special dietary/accessibility requirements.

### 4. Timeline Prioritization & Minute-by-Minute Run-Sheets
- **Dynamic Urgency Shifting**: Tasks approaching deadlines within 3 days or in the past automatically escalate to `Critical` urgency.
- **Dependency Blocker Detection**: Tasks dependent on unfinished milestones (e.g., ordering florals before locking venue contract) are clearly flagged with `Blocked by: [Parent Task]`.
- **D-Day Master Run-Sheet**: Chronological, hour-by-hour operational sequence for on-site execution (Vendor load-in, styling, catering checks, ceremony, dinner, and wrap).

### 5. Guest Inclusivity & Weather Contingency
- **Allergen Directives**: Flags critical alerts for severe nut allergies, dedicated celiac-safe gluten-free preparations, and Jain root-vegetable restrictions.
- **Accessibility Safeguards**: Wheelchair ramp compliance, low-decibel elderly quiet lounges, golf cart shuttles, toddler soft-play zones, and private nursing suites.
- **24-Hour Weather Action Plan**: Plan A (Outdoor Lawn) vs Plan B (Indoor Hall Hold) with concrete cut-off milestones and tie-down ballast checklists.

---

## 🛡️ Security, Privacy & Responsible AI

1. **Zero Credential Leakage**:
   - API keys are held strictly in browser `sessionStorage` or local memory.
   - Keys are **never** persisted to server databases, disk files, or git commits.
   - The `.gitignore` excludes all local environment files, caches, and build outputs.
2. **Input Sanitization & XSS Defense**:
   - All user-supplied strings and markdown renderings undergo strict HTML entity escaping before injection into the DOM.
   - Content Security & HTTP security headers (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`) are configured in `vercel.json`.
3. **Repository Size & Performance**:
   - The entire Git repository is **under 100 KB** (well below the 10 MB hackathon ceiling).
   - Bundle size is under 140 KB uncompressed (zero heavy framework runtime dependencies).

---

## 🧪 Testing & Validation Suite

The project includes an automated test suite executed via Node.js native test runner (`node --test`), validating all core mathematical and operational logic:

```bash
npm test
```

### Test Coverage Highlights:
- **`tests/budgetOptimizer.test.js`**: Validates balanced budget calculations, deficit detection, 3-package what-if trade-off generation, and constraint-based auto-rebalancing.
- **`tests/vendorScorer.test.js`**: Validates multi-attribute utility formulas, cost penalties for overpriced vendors, bonus perk weighting, and RFP message generation.
- **`tests/timelineScheduler.test.js`**: Validates countdown maths, dependency blocker tracking, dynamic urgency shifting to Critical priority, and D-Day run-sheets.
- **`tests/guestManager.test.js`**: Validates dietary distributions, critical kitchen allergen alerts (nut allergy / celiac / Jain), and weather contingency plans.
- **`tests/securitySanitization.test.js`**: Validates that API keys are never leaked into prompt/response logs and script injections are neutralized.

---

## 💻 Quick Start & Local Execution

### Prerequisites:
- Node.js v18+ (tested on Node v24.16.0)
- npm v9+

### 1. Clone Repository & Install Dependencies
```bash
git clone https://github.com/iusgupta20/FestivaPlan.git
cd FestivaPlan
npm install
```

### 2. Run Automated Tests
```bash
npm test
```

### 3. Launch Local Development Server
```bash
npm run dev
```
Navigate to `http://localhost:5173/` in your browser.

### 4. Build for Production
```bash
npm run build
```
Production assets are generated in `dist/`.

---

## 📹 Video Walkthrough & Live Demo Guide (< 4 Minutes)

Follow this structured sequence to record your submission video:

| Timestamp | Section | What to Demonstrate On-Screen |
|---|---|---|
| **0:00 - 0:45** | **Onboarding & Presets** | Show the dashboard loading *Aarav & Meera's Royal Palace Wedding*. Switch between preset celebration scenarios (Wedding, 1st Birthday, Community Fest). |
| **0:45 - 1:30** | **GenAI Blueprint & Prompt Audit** | Click **"Generate AI Blueprint"**. Show the concept, theme pillars, and color palette. Click **"Inspect GenAI Prompt & Response"** to prove dynamic AI prompt generation. |
| **1:30 - 2:30** | **Live Budget Trade-Offs (High Impact)** | Navigate to **Budget & Tradeoffs**. Show the overbudget banner. In the **What-If Simulator**, select *Catering*, enter a surge amount (e.g. ₹50,000), and click **"Solve Trade-Offs"**. Review the 3 strategic compromise packages and click **"Apply This Package"** or **"⚡ Auto-Rebalance Budget with AI"** to see actual numbers balance live! |
| **2:30 - 3:15** | **Vendor Scoring & AI RFP** | Navigate to **Vendor Coordination**. Review the AI Utility Score (e.g. 92/100) and AI recommendation badge. Click **"Generate RFP"** to display the automated formal vendor outreach message. |
| **3:15 - 3:45** | **Timeline, Inclusivity & Weather** | Show the countdown, overdue task urgency shifting to Critical, dependency blockers (`Blocked by Venue`), and the **D-Day Minute-by-Minute Run-Sheet**. Briefly highlight dietary allergen directives (Nut allergy warning) and weather contingency plans. |
| **3:45 - 4:00** | **AI Copilot Live Query** | Open **AI Event Copilot**, click a starter chip (e.g. *"Trim 10% Budget Safely"*), and show the contextual response generated live. |

---

## 📋 Evaluation Focus Alignment

| Evaluation Criteria | Implementation Details |
|---|---|
| **High Impact: Problem Statement Alignment** | Directly addresses weddings, birthdays, and community festivals. Replaces generic ideas with mathematical budget trade-offs, vendor utility scoring, and deadline prioritization. |
| **High Impact: Code Quality** | Modular ES6 architecture, clean separation of concerns (`state.js`, `tradeoffOptimizer.js`, `vendorScorer.js`, `timelineScheduler.js`, `guestManager.js`), comprehensive inline documentation. |
| **Medium Impact: Security** | Zero API key disk leakage (session storage only), input HTML sanitization, Content Security Headers in `vercel.json`. |
| **Medium Impact: Efficiency** | Zero runtime overhead (Vanilla CSS & JS), total bundle < 140 KB, 1.7s build time, total Git repository < 100 KB (well below 10 MB limit). |
| **Medium Impact: Testing** | 24 automated unit and integration tests passing in ~500ms using Node.js native test runner. |
| **Low Impact: Accessibility** | Semantic HTML5 structure, ARIA roles (`role="tablist"`, `role="alert"`), keyboard navigation for tabs, high-contrast dark/light mode, responsive layout. |

---

## 👤 Author & Submission Information
- **Author**: Ayush Gupta
- **Challenge**: [Challenge 5] Celebration & Event Planner
- **Branch**: `main` (Single branch compliance)
- **License**: MIT
