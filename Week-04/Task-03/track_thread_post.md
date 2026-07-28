# Track Thread Deliverable: Three Roads — Portfolio Stack Options & Decision Rationale

**Intern:** Muhammad Abdullah  
**Track:** Machine Learning & Search Intelligence  
**Role:** AI & Machine Learning Engineer (BSCS Student, Lahore Garrison University)  
**Primary Live Portfolio URL:** [https://muhammadabdullah-portfolio-mu.vercel.app/](https://muhammadabdullah-portfolio-mu.vercel.app/)  
**GitHub Repository URL:** [https://github.com/muhammadabdullah-devpk/flyrank-ml-internship](https://github.com/muhammadabdullah-devpk/flyrank-ml-internship)  
**GitHub Pages Secondary URL:** [https://muhammadabdullah-devpk.github.io/flyrank-ml-internship/](https://muhammadabdullah-devpk.github.io/flyrank-ml-internship/)  
**Task Reference:** [https://aifluency.flyrank.ai/week-04.html#three-roads](https://aifluency.flyrank.ai/week-04.html#three-roads)  

---

## 1. Input Constraints

- **Budget:** Free only ($0 host, $0 DB, $0 domain).
- **Skill Level:** BSCS Student (LGU), ML/NLP Engineer proficient in Python, SQL/DuckDB, scikit-learn, basic HTML/CSS/JS, learning React/Next.js.
- **Sitemap & Content Map:** 
  - `Hero/Home`: ML Engineer core claim & system status.
  - `Search ML Model Case Study`: 79M row DuckDB model, baseline (0.24) vs ML (0.74) Precision@50 metric charts.
  - `LGU Chatbot Case Study`: Intent classification (>60% ticket reduction).
  - `Demos & Repos`: Interactive embedded widgets, GitHub repo links (`flyrank-ml-internship`), Colab badges.
- **Display Needs:** Technical markdown, metric tables/charts, syntax-highlighted Python code, embedded demo widgets.
- **Dynamic Backend Required?:** **Not yet.** Models are evaluated offline or hosted on HuggingFace Spaces. Static site generation (SSG) is optimal.

---

## 2. Three Stack Options & Trade-offs

1. **Option 1 (Simplest): Static HTML5 / CSS3 / Vanilla JS on GitHub Pages**
   - *How to build:* Plain HTML/CSS files + Prism.js.
   - *Host:* GitHub Pages ($0).
   - *Backend:* None (0%).
   - *Trade-off:* Fast setup, but high maintenance overhead due to code duplication across 4 pages and no component reusability.

2. **Option 2 (Front-Runner): Next.js (React) + Tailwind CSS on Vercel**
   - *How to build:* Next.js App/Pages Router with React components, Tailwind CSS styling, and MDX for case studies.
   - *Host:* Vercel Global Edge CDN ($0).
   - *Backend:* Not yet (Static Site Generation / SSG).
   - *Trade-off:* Requires minor Node setup, but offers single-component header/footer reusability, auto deployment on GitHub push, sub-second page loads, and modern UI.

3. **Option 3 (Most Powerful): Next.js + Python FastAPI + PostgreSQL (Supabase)**
   - *How to build:* Next.js frontend querying live Python FastAPI model server + Supabase DB.
   - *Host:* Vercel + Render + Supabase ($0 free tiers).
   - *Backend:* Active Python API + DB.
   - *Trade-off:* High capability, but Render free tier cold starts (30-50s delays), CORS complexity, and high risk of missing the 2-week deadline.

---

## 3. Pressure-Testing the Front-Runner (Next.js + Tailwind on Vercel)

- **What breaks if I pick Option 1 (Simplest)?** Component updates become manual across all HTML files; writing long-form case studies in raw HTML is slow.
- **What do I maintain if I pick Option 3 (Most Powerful)?** Server uptime, CORS policies, environment variables across 3 services, and cold-start latency.
- **Can I finish in two weeks?** YES. Option 2 deploys in 2 hours, allowing 13 days dedicated purely to ML content and case study quality. Option 3 would waste 10 days on DevOps.
- **Does it show my work well?** YES. High-end dark cyber theme, crisp metric charts, sub-second latency, and embedded interactive widgets.

---

## 4. Decision Rationale (In My Own Words)

I selected **Option 2: Next.js + Tailwind CSS on Vercel**. 

- **Why I didn't pick Option 1:** Hand-coding 4 HTML pages lacks component reusability and creates tedious maintenance when updating navigation or adding new case studies.
- **Why I didn't pick Option 3:** A live Python server backend is unnecessary right now because my ML models are trained offline and evaluated on static benchmark metrics (79M row DuckDB Precision@50 0.74). Render's free tier cold-start lag ruins user experience.
- **Can I maintain this?** Yes! Zero server maintenance, zero database overhead, and automatic deployment via GitHub commits.
- **Does it show my work well?** Yes! It delivers sub-second page load times, beautiful glassmorphism dark mode, responsive chart rendering, and clean syntax highlighting for code snippets.
- **Backend Answer:** **Not yet.** Static pre-rendering provides maximum stability, speed, and polish for my ML portfolio launch.

---

## 5. Pass / Revise Check

| Criterion | Result | Verification Notes |
|---|---|---|
| 3 genuine options with trade-offs | **PASS** | Option 1 (Vanilla HTML), Option 2 (Next.js/Tailwind), Option 3 (Full-Stack FastAPI) |
| Chosen stack free & matched to needs | **PASS** | Vercel Edge CDN ($0), Next.js SSG, matches sitemap & display needs |
| Rationale in own words + maintainability | **PASS** | Answers "can I maintain this" and "does it show my work well" |
| Backend question answered honestly | **PASS** | Answered "not yet" — offline model metrics pre-rendered statically |
