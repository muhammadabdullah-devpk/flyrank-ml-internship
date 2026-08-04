# Week 8 — Tell the Story: Demo Outline & Shareable Cuts

**Author:** Muhammad Abdullah | AI & ML Engineer  
**Track:** Machine Learning  
**Assignment Code:** ML-12  
**Date:** August 2026  

---

## 1. Case Study Framing (FlyRank Content Problem)

**The Problem:** Digital publishing platforms lose significant organic search traffic when legacy content decays without timely updates. In FlyRank search operations, traditional agency rules (such as *"flag articles older than 6 months"*) result in a ~76% false-positive rate, swamping editorial teams with low-impact pages while missing high-volume assets suffering ranking erosion.

**The ML Decision-Support Framing:** This project frames content refresh prioritization as a binary classification and learning-to-rank problem on 30,000 anonymized search page records sampled from FlyRank's 79M-row DuckDB production warehouse. To prevent intra-client data leakage, models are validated under strict **5-Fold Grouped Client Cross-Validation (GroupKFold by client_id)**. 

**Headline Result:** Our Random Forest classifier achieves a **Precision@50 of 0.74 — a 3.08× precision lift** over the traditional hand-rule baseline (0.24) — with an out-of-sample ROC-AUC of 0.812. The model outputs feed directly into an operational Content Action Playbook with reason codes (`HIGH_CTR_LOW_POSITION`, `SERP_DECAY_CANDIDATE`), human-in-the-loop validation, and strict no-go automation boundaries.

---

## 2. Week-8 Showcase: 5-Minute Demo Outline

A 5-minute structured presentation outline ready for the Week-8 FlyRank Showcase presentation:

### [0:00 - 1:00] Minute 1: The Question & FlyRank Problem
- **The Core Problem:** FlyRank manages organic search intelligence across thousands of client articles. Over time, published content suffers traffic decay due to SERP layout shifts, competitor actions, and algorithm updates.
- **The Failure of Traditional Rules:** Traditional SEO agency rules (e.g., *"flag articles older than 6 months"*) generate a ~76% false-positive rate, swamping editorial teams with healthy pages while missing critical traffic losses.
- **Research Question:** Can we build a decision-support filter that accurately predicts 30-day traffic decay to prioritize high-ROI editorial refreshes?

### [1:00 - 2:00] Minute 2: The Method & Honest Validation Architecture
- **Data Foundation:** Evaluated on 30,000 anonymized search page records sampled from FlyRank's 79M-row DuckDB production warehouse (spanning GSC performance, GA4 behavior, and content metadata).
- **Leakage Prevention:** Benchmark models using **5-Fold Grouped Client Cross-Validation (`GroupKFold` on `client_id`)**. All pages from a client remain strictly isolated in either train or test folds to prevent intra-client data leakage.
- **Safety Exclusions:** Label-derived columns (`trend_direction`, `trend_pct`) strictly excluded from model feature matrices.

### [2:00 - 3:00] Minute 3: One Key Chart (Figure 1: ROC Curve & Discrimination Lift)
- **Visual Highlight:** Present Figure 1 (ROC Curve comparison).
- **Chart Takeaway:** Random Forest achieves an out-of-sample ROC-AUC of **0.812** compared to the Hand-Rule Baseline AUC of **0.542** under honest grouped cross-validation.
- **Key Insight:** The model demonstrates clear rank discrimination across unseen client domains, distinguishing true traffic decay candidates from stable legacy pages.

### [3:00 - 4:00] Minute 4: One Honest Result & Limitation Framing
- **Headline Finding:** Random Forest achieves a **Precision@50 of 0.740 — a 3.08× precision lift over the hand-rule baseline (0.240)**.
- **Honest Framing (Claim Ladder):** We observe precision lift in ranking decaying content. We do *not* claim to predict Google's search algorithm, nor do we guarantee rank recovery without human editorial review.

### [4:00 - 5:00] Minute 5: One Actionable Recommendation & Action Playbook Deployment
- **Operationalization:** Model probabilities are converted into an operational Content Action Playbook with Reason Codes (`HIGH_CTR_LOW_POSITION`, `SERP_DECAY_CANDIDATE`).
- **Human-in-the-Loop:** Top 500 pages are organized into P1_CRITICAL and P2_HIGH priority queues for human review.
- **No-Go Boundaries:** Enforce strict safety boundaries — no automated page deletions, canonical tag alterations, or unreviewed AI copy publishing.

---

## 3. Shareable Cuts of Your Work

Two ready-to-share summaries framed for different audiences:

### Cut 1: Short Social Post (Methodology & Results Focus)

> 🚀 Most SEO recommendations fail because naive rules generate 76% false positives.
>
> In my ML Capstone at FlyRank, I evaluated content decay prediction across 30,000 production search pages (sampled from a 79M DuckDB warehouse).
>
> Key Method: Applied 5-Fold GroupKFold client cross-validation to eliminate intra-client data leakage.  
> Key Finding: Random Forest boosted Precision@50 from 0.24 → 0.74 (a 3.08× precision lift over traditional SEO hand-rules).
>
> Read the full paper & explore the live action queue: https://muhammadabdullah-devpk.github.io/flyrank-ml-internship/
> #MachineLearning #SearchIntelligence #DataScience #Python #FlyRank

### Cut 2: 3-Sentence Employer-Facing Summary ("What I built, on what data, what it showed")

> **What I built:** I engineered and validated a production search intelligence pipeline that predicts Google organic traffic decay and operationalizes predictions into a human-in-the-loop editorial action queue.
>
> **On what data:** I evaluated models on 30,000 anonymized search page records sampled from FlyRank's 79M-row DuckDB warehouse, enforcing strict 5-Fold Grouped Client Cross-Validation (GroupKFold by client_id) to eliminate intra-client data leakage.
>
> **What it showed:** The Random Forest model achieved a Precision@50 of 0.74 — a 3.08× precision lift over traditional SEO hand-rules (0.24) — enabling editorial teams to prioritize high-ROI content refreshes while maintaining strict no-go automation safety boundaries.
