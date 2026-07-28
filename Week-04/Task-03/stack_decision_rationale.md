# Week 04 — Task 03: Three Roads — Portfolio Stack Options & Decision Rationale

**Intern Name:** Muhammad Abdullah  
**Track:** Machine Learning & Search Intelligence  
**Role:** AI & Machine Learning Engineer (BSCS Student, Lahore Garrison University)  
**Live Portfolio URL:** [https://muhammadabdullah-portfolio-mu.vercel.app/](https://muhammadabdullah-portfolio-mu.vercel.app/)  
**GitHub Repository:** [https://github.com/muhammadabdullah-devpk/flyrank-ml-internship](https://github.com/muhammadabdullah-devpk/flyrank-ml-internship)  
**Task Reference:** [https://aifluency.flyrank.ai/week-04.html#three-roads](https://aifluency.flyrank.ai/week-04.html#three-roads)  

---

## 1. Context & The Four Real Constraints

Choosing how to build is an essential AI-fluency skill. Rather than accepting an AI-generated stack recommendation blindly, this evaluation subjects three distinct architectural options to real constraints, trade-off analysis, and pressure testing.

### Constraint 1: Budget ($0 Free Only)
- **Constraint:** Zero financial cost. Hosting, build pipelines, domain subdomains, database storage, and content management must remain 100% free with no hidden credit card requirements or trial expiration traps.

### Constraint 2: Honest Skill Level
- **Constraint:** BSCS Student at Lahore Garrison University (LGU) with strong proficiency in Python, ML/NLP libraries (`scikit-learn`, `DuckDB`, `Pandas`, `PyTorch`), SQL, and basic frontend fundamentals (HTML5, CSS3, JavaScript). Solid understanding of React concepts, but not a full-stack DevOps engineer specialized in Kubernetes, Docker clusters, or server administration.

### Constraint 3: Sitemap & Content Map Requirements
- **Sitemap Structure (4 Core Pages):**
  1. **Home / Hero Page:** Introduction, core value claim statement (*"I build, evaluate, and deploy production ML & NLP pipelines in Python that solve high-impact search and classification problems with verifiable precision"*), live BERT classification model training status widget.
  2. **Search ML Model Case Study Page:** Deep-dive technical breakdown of the 79 Million row DuckDB search content refresh model, baseline rule vs ML Precision@50 metric comparison charts (0.24 vs 0.74), feature importance weights, and query architecture.
  3. **LGU Chatbot & NLP Case Study Page:** Intent classification pipeline, TF-IDF vectorization, semantic scoring rules, and >60% support ticket reduction metrics.
  4. **Live Demos & Code Repos Page:** Direct GitHub repository cards (`flyrank-ml-internship`), Google Colab notebook badges, HuggingFace space links, and live interactive demo widgets.
- **Content Map Needs:** Long-form technical case studies, SVG/interactive metric charts, syntax-highlighted Python code snippets, architecture flowcharts, and embedded interactive widgets.

### Constraint 4: Work Display & Backend Necessity
- **Display Needs:** Image galleries, high-density performance tables, metric charts, syntax-highlighted code blocks, and embedded iframe demo widgets.
- **Is anything dynamic yet?** **Honest Answer: Not yet.** All ML models are evaluated offline or hosted asynchronously on free external services (Google Colab / HuggingFace Spaces). The portfolio itself only needs to render static pre-calculated metrics, benchmark charts, and code walk-throughs. No user logins, live database write operations, or real-time custom API backend servers are required for launch.

---

## 2. Three Stack Options (Simplest to Most Powerful)

```
   [ Option 1: Simplest ]             [ Option 2: Balanced / Front-Runner ]            [ Option 3: Most Powerful ]
  Static HTML5 / CSS3 / JS              Next.js (React) + Tailwind CSS              Next.js + FastAPI + Supabase
     Host: GitHub Pages                         Host: Vercel                              Host: Vercel + Render
    Backend: None (0%)                    Backend: Static / SSG (0% yet)               Backend: Python API + PostgreSQL
```

### Option 1: Simplest — Static HTML5 / CSS3 / Vanilla JS
- **How you'd build:** Hand-crafted HTML5 semantic files (`index.html`, `search-model.html`, `lgu-chatbot.html`, `demos.html`) styled with custom CSS3 flexbox/grid and Prism.js for syntax highlighting.
- **Where you'd host (Free):** GitHub Pages or Cloudflare Pages.
- **Backend needed?:** No (0% backend).
- **Real Trade-off:** Zero build tooling and instant setup speed. However, header/footer navigation components must be manually duplicated across all 4 pages. Updating typography or color design tokens requires editing multiple files. Writing long-form technical case studies in raw HTML tags is tedious and prone to formatting inconsistencies.

### Option 2: Balanced / Front-Runner — Next.js (React) + Tailwind CSS
- **How you'd build:** Next.js (App Router or Pages Router) with React component architecture, Tailwind CSS for dark cyber obsidian glassmorphism styling, and MDX / React components for case study rendering.
- **Where you'd host (Free):** Vercel (Global Edge CDN Network) with automated CI/CD deployments triggered on GitHub push.
- **Backend needed?:** No ("Not yet" — static site generation / SSG at build time).
- **Real Trade-off:** Requires basic Node.js/npm setup and React knowledge. In exchange, provides modular component reusability (single header/footer component), automatic image optimization, instant global CDN caching, sub-second page transition speeds, and seamless future scalability if dynamic serverless API routes are needed later.

### Option 3: Most Powerful — Next.js + Python FastAPI Backend + PostgreSQL (Supabase)
- **How you'd build:** Next.js dynamic frontend connected via REST API to a Python FastAPI backend handling live model inference queries, with Supabase (PostgreSQL) storing request logs, visitor feedback, and live telemetry.
- **Where you'd host (Free):** Vercel (Frontend) + Render / Railway (FastAPI Backend) + Supabase (Free Tier PostgreSQL).
- **Backend needed?:** Yes (Active Python API server + Live Database connections).
- **Real Trade-off:** Maximum capability for live interactive inference. However, high operational complexity, cold-start delays on free hosting tiers (Render puts free instances to sleep after 15 minutes of inactivity causing 50-second delays for visitors), database connection pooling overhead, CORS configuration friction, and severe risk of getting bogged down in DevOps instead of completing portfolio content within two weeks.

---

## 3. Pressure-Testing the Front-Runner (Option 2: Next.js + Tailwind on Vercel)

| Question / Pressure Test | Evaluation & Impact |
|---|---|
| **What breaks if I pick the simplest (Option 1 - Vanilla HTML/CSS)?** | Navigation maintainability breaks. Modifying a link or header status badge requires updating 4 HTML files. Writing multi-page ML case studies in raw HTML is slow, and adding dynamic interactive elements or dark/light mode toggles requires writing fragile custom Vanilla JS scripts from scratch. |
| **What do I maintain if I pick the most powerful (Option 3 - Full-Stack)?** | I must maintain live server uptime, handle Render cold starts, manage database migrations, debug CORS errors between Vercel and Render, handle API rate limits, and secure secret keys. A single server timeout makes the entire portfolio appear broken to recruiters. |
| **Can I finish in two weeks?** | **YES.** Option 2 can be fully scaffolded and deployed in under 2 hours. That leaves 13+ full days focused entirely on writing high-quality ML case study content, refining metric visualizations, and polishing code presentation. Option 3 would consume 10+ days on server deployment, CORS debugging, and database configuration. |
| **Does it show my work the way it needs to be shown?** | **YES.** Next.js pre-rendering delivers sub-second page loads globally. Tailwind CSS creates a high-end dark cyber theme (`#09090b` obsidian background with cyan/blue glow accents). Embedded HuggingFace demo widgets, Colab badges, SVG metric charts, and syntax-highlighted Python blocks render cleanly without server dependencies. |

---

## 4. Final Decision & Written Rationale (In My Own Words)

### The Chosen Stack
I have chosen **Option 2: Next.js (React) + Tailwind CSS hosted on Vercel**.

### Alternatives Considered & Why Rejected
1. **Rejected Option 1 (Vanilla HTML/CSS on GitHub Pages):** While simple, hand-coding static HTML across 4 separate pages creates unacceptable maintenance friction. Any layout change requires redundant edits across multiple files, and managing long-form case studies without component abstraction slows down content creation.
2. **Rejected Option 3 (Full-Stack Next.js + FastAPI + Supabase on Render):** While technically powerful, introducing a live Python API backend and database is an over-engineering trap for launch. Render's free tier suffers from 30–50 second cold starts, which destroys visitor user experience. Since my ML models are trained offline and evaluated on benchmark metrics (such as the 79M row DuckDB model achieving Precision@50 0.74), static pre-rendering presents my work with zero latency and zero downtime.

### Key Rationale Factors:
- **Can I maintain this?** **Yes, effortlessly.** Next.js static pre-rendering on Vercel requires zero server maintenance, zero database monitoring, and zero security patching. Updating my portfolio is as simple as pushing a markdown file or component edit to GitHub, which automatically triggers Vercel CI/CD to build and publish globally in seconds.
- **Does it show my work well?** **Excellently.** It provides a modern, fast, and responsive showcase for my ML case studies. High-density DuckDB benchmark tables, interactive SVG charts, embedded Google Colab/HuggingFace demo widgets, and clean syntax-highlighted code blocks all load instantly.
- **Is a backend needed right now?** **Not yet.** Choosing "not yet" is the honest and strategic engineering decision. Offline model evaluation pre-rendered statically delivers better performance, reliability, and presentation than an unstable free-tier live server backend.

---

## 5. Pass / Revise Verification Checklist

| Requirement | Evaluation | Status |
|---|---|---|
| **Three genuine options considered** | Evaluated Vanilla HTML/CSS (Simplest), Next.js + Tailwind (Balanced Front-Runner), and Next.js + FastAPI + Supabase (Most Powerful). | **PASS** |
| **Chosen stack is free & matched to real needs** | Vercel Global Edge Network ($0), Next.js SSG ($0), matched to 4-page sitemap and ML case study display needs. | **PASS** |
| **Rationale in own words including maintainability** | Detailed personal rationale addressing *"can I maintain this"* and *"does it show my work well"*. | **PASS** |
| **Backend question answered honestly** | Answered "not yet" — static pre-rendering offline ML metrics avoids free-tier server cold starts. | **PASS** |
