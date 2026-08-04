# Clinic Question — Week 08 Open-Floor Session

**Author:** Muhammad Abdullah | AI & ML Engineer  
**Track:** Machine Learning  
**Session:** Aug 27, 2026 — ML Showcase & Clinic

---

## My Prepared Clinic Question

### Context

My capstone model (Random Forest, 5-Fold GroupKFold) achieves **Precision@50 = 0.74** on the 30,000-row anonymized dataset. The action playbook is deployed and the paper is live.

The model is now being considered for the broader FlyRank production pipeline with entirely new client domains — clients who contributed zero rows to the training data.

---

### The Blocker

**Question:**  
When deploying a ranking model to a brand-new client domain that was never in the training set, how do I honestly estimate and communicate the expected Precision@K degradation before any live feedback is available?

**Why I'm stuck:**

My GroupKFold evaluation validates across 32 known clients — but it still assumes those clients represent the full distribution. A brand-new client could have:
- A very different content mix (e.g., 90% product pages vs. 90% editorial)
- A different average position distribution (brand-new domain vs. established authority)
- Seasonal topics that spike at certain months

My concern: if I hand over P@50 = 0.74 as the deployment estimate, a client with an atypical content portfolio could see P@50 drop to 0.40 or lower, and that would be a broken promise.

---

### What I've Tried

1. **Subgroup analysis by content_segment:** Precision@50 varies from 0.68 (product/commercial intent pages) to 0.82 (informational/educational content). New clients heavy in commercial intent will land lower.

2. **Calibration:** I ran `CalibratedClassifierCV` with isotonic regression — the calibration curve looks reasonable but I can't test it on held-out client types I haven't seen.

3. **Conservative reporting:** I currently say *"estimate 0.65–0.74 Precision@50 across client types"* with a note that the lower bound applies to atypical portfolios.

---

### The Specific Help I Want

1. Is the "conservative range + subgroup breakdown" communication approach standard in production ML, or is there a better framework?

2. Is there a lightweight test I can run on a new client's first 500 pages to estimate where their Precision@K will land before committing to a deployment estimate?

3. Should I be reporting a **worst-case bound** (e.g., decision theory / conformal prediction intervals) rather than a range?

---

### Why This Matters Beyond My Project

This is a general pattern in B2B ML deployment:  
**Train on one cohort of clients, deploy to new clients.**  
The client-holdout cross-validation is the right architecture — but the communication of uncertainty to non-technical stakeholders is the unsolved piece.

---

*Public question — answer can help all ML track interns deploying to new client portfolios.*
