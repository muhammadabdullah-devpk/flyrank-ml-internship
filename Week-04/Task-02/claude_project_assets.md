# Claude Project Context & Loaded Assets Bundle
**Developer:** Muhammad Abdullah  
**Role:** AI & Machine Learning Engineer (BSCS Student, Lahore Garrison University)  
**Program:** FlyRank AI Internship (Week 04 — Build Preparation)  
**Live Portfolio URL:** https://muhammadabdullah-portfolio-mu.vercel.app/  

---

## 1. Visual Identity Kit

### Core Claim & Proof Statement
> *"I build, evaluate, and deploy production ML & NLP pipelines in Python that solve high-impact search and classification problems with verifiable precision."*

### Brand System & Style Tokens
- **Typography:**
  - Headings & Branding: `Geist Mono` / `Fira Code` / `Outfit`
  - Body Text: `Geist` / `Inter` / `Manrope`
- **Color Palette (Dark Cyber Theme):**
  - Background: `#09090b` (Obsidian Base)
  - Surface Cards: Glassmorphism (`rgba(255, 255, 255, 0.05)`)
  - Primary Accent: `#06b6d4` (Cyan 500)
  - Secondary Accent: `#3b82f6` (Blue 500)
  - Text Primary: `#f4f4f5` (Zinc 100)
  - Text Muted: `#9ca3af` (Gray 400)
- **Logo Wordmark:** `M. Abdullah Portfolio`

---

## 2. Loaded Portfolio Case Studies

### Case Study 1: Google Search Content Refresh Prediction Model (Lane 2 Capstone)
- **Problem Statement:** Large-scale e-commerce and media publishers lose search rankings when content decays. Identifying which pages require content updates out of millions of URL records is high-cost.
- **Data & Scale:** ~79 Million rows search analytics warehouse queried via DuckDB.
- **Baseline Rule:** Hand-crafted heuristic rule achieved **Precision@50 ≈ 0.24**.
- **Learned Model:** Supervised Random Forest / Logistic Classifier trained on historical impression, position, and click decay features achieved **Precision@50 ≈ 0.74** (~3.1x lift over baseline).
- **Business Impact:** Prioritizes high-opportunity URLs for editorial refresh, maximizing organic search traffic recovery.

### Case Study 2: LGU Smart Portal Chatbot & Intent Classification Pipeline
- **Problem Statement:** Educational institution needed automated student query routing to reduce support ticket backlogs and answer campus services inquiries instantly.
- **Architecture:** Python NLP pipeline with intent classification, TF-IDF vectorization, semantic match scoring, and structured JSON intent fallback.
- **Performance:** Reduced manual ticket volume by >60% while maintaining sub-second query response latency.

---

## 3. Portfolio Sitemap & Content Map

- **Page 1 (Home / Hero):** Hi, I'm M. Abdullah — BSCS Student at LGU & AI/ML Engineer. System status: Training BERT classification model (98% validation accuracy).
- **Page 2 (Search ML Model):** Detailed breakdown of 79M row DuckDB pipeline, baseline vs ML Precision@50 metric charts, feature importance.
- **Page 3 (LGU Chatbot):** NLP classification architecture, sample response benchmarks, system workflow.
- **Page 4 (Live Demos & Code Repos):** GitHub links (`muhammadabdullah-devpk/flyrank-ml-internship`), Colab notebook badges, Vercel live app links.

---

## 4. Environment & Hosting Specifications
- **Stack:** Next.js / React + Tailwind CSS (Vercel) / Plain HTML5 & CSS3 (GitHub Pages)
- **Live URL:** `https://muhammadabdullah-portfolio-mu.vercel.app/`
- **Secondary URL:** `https://muhammadabdullah-devpk.github.io/flyrank-ml-internship/`
- **Backend Status:** Not needed at launch (Static pre-rendering for instant loading and zero downtime)
