# Claude Project Context & Loaded Assets Bundle
**Developer:** Muhammad Abdullah  
**Role:** Applied Machine Learning & Search Intelligence Intern  
**Program:** FlyRank AI Internship (Week 04 — Build Preparation)  

---

## 1. Visual Identity Kit

### Core Claim & Proof Statement
> *"I build, evaluate, and deploy production ML & NLP pipelines in Python that solve high-impact search and classification problems with verifiable precision."*

### Brand System & Style Tokens
- **Typography:**
  - Headings & Branding: `Geist Mono` / `Fira Code` (Technical, precision-first)
  - Body Text: `Geist` / `Inter` (Clean, highly readable)
- **Color Palette (Dark Obsidian Theme):**
  - Background: `#09090b` (Obsidian Base)
  - Surface Cards: `#121318` (Dark Glass Surface)
  - Primary Accent: `#0f766e` (Deep Teal)
  - Highlight Accent: `#14b8a6` / `#34d399` (Emerald / Bright Mint)
  - Text Primary: `#f4f4f5` (Zinc 100)
  - Text Muted: `#a1a1aa` (Zinc 400)
  - Borders: `#27272a` (Zinc 800)
- **Logo Wordmark:** `<M.A/> M. ABDULLAH · ML & NLP ENGINEER`

---

## 2. Loaded Portfolio Case Studies

### Case Study 1: Google Search Content Refresh Prediction Model (Lane 2 Capstone)
- **Problem Statement:** Large-scale e-commerce and media publishers lose search rankings when content decays. Identifying which pages require content updates out of millions of URL records is high-cost.
- **Data & Scale:** ~79 Million rows search analytics warehouse queried via DuckDB.
- **Baseline Rule:** Hand-crafted heuristic rule achieved **Precision@50 ≈ 0.24**.
- **Learned Model:** Supervised Random Forest / Logistic Classifier trained on historical impression, position, and click decay features achieved **Precision@50 ≈ 0.74** (~3.1x lift over baseline).
- **Business Impact:** Prioritizes high-opportunity URLs for editorial refresh, maximizing organic search traffic recovery with 74% top-tier precision.

### Case Study 2: LGU Smart Portal Chatbot & Intent Classification Pipeline
- **Problem Statement:** Educational institution needed automated student query routing to reduce support ticket backlogs and answer campus services inquiries instantly.
- **Architecture:** Python NLP pipeline with intent classification, TF-IDF vectorization, semantic match scoring, and structured JSON intent fallback.
- **Performance:** Reduced manual ticket volume by >60% while maintaining sub-second query response latency.

---

## 3. Portfolio Sitemap & Content Map

```
Ideal Visitor: Engineering Manager / Founder / Recruiter
       │
       ▼
┌──────────────┐
│  01. HERO    │ ──► States Claim, Live Status, Tech Stack, & Direct Action CTA
└──────┬───────┘
       │
       ├────────────────────────┐
       ▼                        ▼
┌──────────────┐       ┌──────────────┐
│  02. SEARCH  │       │  03. CHATBOT │
│  ML MODEL    │       │  NLP SYSTEM  │
└──────┬───────┘       └──────┬───────┘
       │                        │
       └────────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │  04. LIVE DEMOS &    │
        │  CODE REPOSITORIES   │
        └──────────────────────┘
```

- **Page 1 (Home / Hero):** Claim statement, live status, quick stack breakdown, proof links.
- **Page 2 (Search ML Model):** Detailed breakdown of 79M row DuckDB pipeline, baseline vs ML Precision@50 metric charts, feature importance.
- **Page 3 (LGU Chatbot):** NLP classification architecture, sample response benchmarks, system workflow.
- **Page 4 (Interactive Demos & Repos):** GitHub links (`muhammadabdullah-devpk/flyrank-ml-internship`), Colab notebook badges, downloadable Markdown model reports.

---

## 4. Environment & Hosting Specifications
- **Stack:** Code with AI (Plain HTML5, Vanilla CSS3, JS)
- **Live Host:** GitHub Pages / Netlify
- **Live URL:** `https://muhammadabdullah-devpk.github.io/flyrank-ml-internship/`
- **Backend Status:** Not needed (Static architecture for instant edge loading and zero downtime)
