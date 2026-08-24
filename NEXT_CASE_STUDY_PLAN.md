# FlyRank Capstone: Next Case Study Protocol & Maintenance Habit

---

### 1. "How to Add the Next Case Study" Note (SOP)

**Exact Location in Portfolio:**
- **Target File / Section:** `src/data/projects.json` (or `content/projects/<slug>.md` / `#projects` section of the portfolio repository).
- **Asset Directory:** `public/assets/projects/<project-slug>/` for demo recordings and architecture diagrams.

**Step-by-Step Procedure (Week 2 Three-Beat Narrative):**
1. **Beat 1: The Problem (Context & Friction)**
   - Define the concrete bottleneck or inefficiency before the build.
   - *Prompt / Question answered:* Who was this for, what broke or was missing, and why did existing approaches fail?
2. **Beat 2: What I Did (Architecture & Execution)**
   - Outline the core technical decisions: stack choices (e.g., FastAPI, Claude API / Gemini 1.5 Pro, Qdrant/Pinecone, Next.js/Tailwind).
   - Detail the prompt architecture, system orchestration, and agentic workflows implemented.
3. **Beat 3: What Came Of It (Impact & Artifacts)**
   - Highlight measurable metrics (e.g., latency reduction, hallucination drop, accuracy gain, time saved).
   - Link live deployed demo, interactive playground, and GitHub repository URL.
4. **Publishing Checklist:**
   - [ ] Run automated linting and responsive design checks.
   - [ ] Generate a 15-second WebP demo preview card.
   - [ ] Commit & deploy via Vercel/GitHub Pages (`git commit -m "feat(portfolio): add <project-name> case study"`).

---

### 2. Named Next Real Piece of Work

- **Project Title:** **Automated Multi-Source Research & Synthesis Agent (with Self-Correction Loop)**
- **Domain:** AI Engineering / Agentic Workflows / Backend ML
- **Tech Stack:** Python, FastAPI, LangGraph / CrewAI, Anthropic Claude 3.5 Sonnet / Gemini API, ChromaDB, Next.js.
- **Repository Reference:** `https://github.com/muhammadabdullah-devpk/flyrank-ml-internship`

---

### 3. Concrete Reminder Setup (Evidence)

- **Platform:** Google Calendar / Notion Recurring Habit
- **Event Title:** `[Portfolio Habit] Package & Ship Case Study: Multi-Source Synthesis Agent`
- **Schedule / Cadence:** Bi-weekly every second Sunday at 6:00 PM (Starting: September 6, 2026)
- **Notification:** 1 day prior + Pop-up notification 30 minutes before.
- **Calendar Event Description:**
  ```text
  Checklist:
  1. Open Claude Project ("Muhammad Abdullah - AI Portfolio & Engineering").
  2. Paste project notes, architecture diagram, and GitHub repo link.
  3. Generate 3-beat case study (Problem -> What I Did -> What Came Of It).
  4. Update src/data/projects.json and push to GitHub.
  ```

---

### 4. Preserved Build Context (Claude Project Knowledge Kit)

The Claude Project context is configured with the following persistent identity kit:
- **Developer Identity:** Muhammad Abdullah — AI & Machine Learning Engineer.
- **Tone & Voice:** Crisp, builder-first, quantified engineering rigor, minimal buzzwords.
- **Design Tokens & Stack:** Clean dark-mode UI, sleek typography, micro-interactions, component-driven HTML/CSS/JS.
- **Prompt Preset for New Cases:**
  > *"Here is the repository and raw notes for my newest build: `[REPO_URL / NOTES]`. Write a new portfolio case study adhering strictly to my 3-beat structure, tone guidelines, and markdown schema in `projects.json`."*
