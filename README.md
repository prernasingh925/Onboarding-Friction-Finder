# Onboarding Friction Finder

> **AI diagnostic tool that identifies why consumer app users drop off during onboarding — and gives PMs two specific, testable experiments to fix it.**

🔗 **[Live Demo](#)** *(add Vercel URL here after deploy)* &nbsp;|&nbsp; Built by [Prerna Singh](https://linkedin.com/in/prernasingh925) — Product Manager, AI & Enterprise Platforms

---

## The Problem

Consumer apps lose 60–80% of new users in the first 3 days. Product Managers can see *where* users drop off in their funnel analytics — but they cannot quickly diagnose *why* a specific step causes friction or *what* to do about it.

Without a clear diagnosis, every fix is a guess. Guesses waste engineering time and sprint cycles.

**This tool turns funnel data into a diagnosis and two experiments — in under 10 seconds.**

---

## Who It's For

Product Managers at B2C consumer apps who own D1/D7 activation metrics and need to:
- Diagnose why their onboarding funnel is underperforming
- Understand which specific step is the highest-friction point and why
- Walk into sprint planning with a clear, evidence-based experiment proposal

**Works for:** Food Delivery · Payments & Fintech · Quick Commerce · Shopping & D2C · Health & Fitness · Learning & EdTech

---

## How It Works

**Input:** Fill in your onboarding funnel — step names, action types, drop-off % at each step, time to first value, and current D1 retention. Takes 3 minutes.

**Output:** A 4-part diagnosis:

### 1. Funnel Health Score
A 1–10 score with category-specific benchmark comparison.
> *"Your funnel scores 3/10. Food delivery apps at your stage typically achieve D1 retention of 28–35%."*

### 2. The Broken Step
The single highest-friction step identified with a friction type classification:

| Friction Type | What It Means |
|---|---|
| **Ask Before Give** | Requesting something from the user before delivering any value |
| **Cognitive Overload** | Too many decisions or inputs required in a single step |
| **Trust Barrier** | Sensitive information requested before trust is established |
| **Value Not Visible** | User can't see what they gain from completing the step |
| **High Routine Friction** | The action is technically difficult or unfamiliar |

### 3. The Friction Story
A plain-English causal narrative — not a list of data points, but a story of *why* users leave.
> *"Your onboarding asks for location access at step 2, before the user has seen a single restaurant or delivery time. With a 71% drop-off here, this is a classic 'Ask Before Give' pattern — users haven't received any value yet, so the permission request feels invasive."*

### 4. Two Experiments to Run
Specific, testable hypotheses in PM-standard format:
> **IF** we move the location permission to after the restaurant discovery screen **THEN** step 2 drop-off will fall from 71% to ~40% **BECAUSE** the user has already received value and the permission now enables more of it.

---

## Why This Is Not a ChatGPT Wrapper

Four PM decisions make this differentiated:

**1. The 5-type friction classification system** is a PM framework embedded in the prompt — it's not something an LLM knows by default. It forces a specific, actionable diagnosis rather than generic feedback.

**2. Category-aware benchmarking** — the agent calibrates its assessment against domain-specific D1 retention benchmarks. A food delivery app and a fintech app have fundamentally different onboarding expectations. The same funnel data produces a meaningfully different diagnosis depending on which category you select.

**3. Healthy funnel detection** — if your D1 retention is 10%+ above category benchmark, the agent shifts tone entirely: score 7–9/10, "Highest Friction Point" (not "Broken Step"), optimisation-focused experiments. It doesn't alarm you when your funnel is working.

**4. PM-format experiment output** — the IF/THEN/BECAUSE hypothesis format with primary metric, test method, and risk is standard PM experiment design. Specific, mechanism-driven hypotheses — not generic suggestions.

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | React 19 + Vite | Fast development, consistent with portfolio |
| Styling | CSS (mobile-responsive) | Clean SaaS aesthetic, works on desktop and phone |
| AI Engine | Google Gemini API | Free tier, structured JSON output |
| Deployment | Vercel | Zero-config CI/CD, API key security via env vars |

---

## Prompt Engineering (6 Iterations)

The AI prompt is the product engine. Getting it right required the same skills as writing a PRD.

| Version | Problem Found | Fix Applied |
|---|---|---|
| v1 | Output was unstructured prose | Added strict JSON output mandate |
| v2 | Friction types were inconsistent | Added detailed definitions for all 5 types |
| v3 | Experiments were generic ("run an A/B test") | Added IF/THEN/BECAUSE format requirement |
| v4 | Same output regardless of app category | Added category benchmark table to prompt |
| v5 | Edge cases caused nonsense output | Added explicit edge case instructions |
| v6 | Healthy funnel scored Critical instead of Good | Added healthy funnel detection rule with tone shift |

---

## Validation — 5 Test Scenarios

After building, I ran 5 structured test scenarios across 4 app categories to validate output quality:

| Test | Category | Scenario | Friction Type | Score | Result |
|---|---|---|---|---|---|
| 1 | Food Delivery | Swiggy — location permission at step 2 | Ask Before Give | 3/10 Critical | ✅ Pass |
| 2 | Payments & Fintech | OTP wall before bank linking | Trust Barrier | 4/10 Critical | ✅ Pass |
| 3 | Shopping & D2C | 6-field form on step 1 | Cognitive Overload | 4/10 Critical | ✅ Pass |
| 4 | Health & Fitness | Loading screen before value | Value Not Visible | 3/10 Critical | ✅ Pass |
| 5 | Food Delivery | Healthy funnel (D1=41%, simplified) | Optimisation mode | 8/10 Optimise | ✅ Pass |

**Friction type accuracy: 5/5 (100%)** &nbsp;|&nbsp; **Experiment format compliance: 100% IF/THEN/BECAUSE** &nbsp;|&nbsp; **Response time: <8 seconds**

---

## Sample Demo Scenarios

Three built-in samples — click any button in the app to load instantly.

### 🍕 Swiggy (Food Delivery)

| Step | Action Type | Drop-off |
|---|---|---|
| Download & open app | See first value | 15% |
| Allow location access | Grant permission | **71%** ← broken step |
| Create account | Create account | 38% |
| Browse restaurants | See first value | 22% |
| Add to cart & checkout | Connect payment | 45% |

**D1:** 22% (benchmark: 28–35%) → **Diagnosis:** Ask Before Give at step 2

---

### 💳 PhonePe (Payments & Fintech)

| Step | Action Type | Drop-off |
|---|---|---|
| Download & open app | See first value | 12% |
| Enter mobile number | Enter personal details | 28% |
| Verify OTP | Verify identity (OTP/KYC) | **64%** ← broken step |
| Link bank account | Connect payment method | 57% |

**D1:** 21% (benchmark: 25–32%) → **Diagnosis:** Trust Barrier at OTP + bank linking

---

### 🏃 Health App (Health & Fitness)

| Step | Action Type | Drop-off |
|---|---|---|
| Open app | See first value | 10% |
| Allow notifications | Grant permission | **58%** ← friction point |
| Allow health data access | Grant permission | **62%** ← broken step |
| Set fitness goal | Enter personal details | 34% |
| See personalised plan | See first value | 19% |

**D1:** 17% (benchmark: 18–25%) → **Diagnosis:** Double permission wall before any value

---

## Roadmap

**v1.0 — Shipped**
- ✅ Category-aware friction diagnosis across 6 app domains
- ✅ 5-type friction classification system
- ✅ IF/THEN/BECAUSE experiment output with risk rating
- ✅ Healthy funnel detection — optimisation mode for well-performing funnels
- ✅ 3 built-in sample scenarios (Swiggy, PhonePe, Health App)
- ✅ Mobile-responsive layout

**v2.0 — Next**
- 🔲 Full funnel diagnosis (identify 2–3 friction points, not just 1)
- 🔲 Benchmark database updated from real industry data
- 🔲 Export diagnosis as a shareable PDF for sprint planning
- 🔲 Competitor comparison (how does your funnel compare to Zomato / Zepto?)

---

## Running Locally

```bash
git clone https://github.com/prernasingh925/onboarding-friction-finder
cd onboarding-friction-finder
npm install
```

Create a `.env` file:
```
VITE_GEMINI_API_KEY=your_api_key_here
```

```bash
npm run dev
```

Open `http://localhost:5173`

> Get a free Gemini API key at [aistudio.google.com](https://aistudio.google.com)

---

## The PM Behind This

This project was built to demonstrate B2C product thinking — specifically around consumer activation, funnel analysis, and experiment design.

The onboarding problem is one of the most important unsolved challenges in consumer product management. Swiggy's D4 retention is ~15%. PhonePe tracks "habitual users" as its north star. Every consumer app lives or dies on its first 72 hours.

This agent is my attempt to make the PM's diagnostic process faster, more structured, and more hypothesis-driven.

---

**Prerna Singh** — Product Manager, AI & Enterprise Platforms

- 🔗 [LinkedIn](https://linkedin.com/in/prernasingh925)
- 📧 prerna.singh1990@yahoo.in
- 💻 [GitHub](https://github.com/prernasingh925)

*Built using AI-assisted development (vibe coding). Zero lines of code written by hand. All product thinking, prompt design, output specification, and QA by me.*
