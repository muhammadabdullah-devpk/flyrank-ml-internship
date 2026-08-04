# Week 06 - Deliverable Links & Live Session Assignment

## Required Links

1. **GitHub Repository (Deliverable Code & Audit Notebooks):**
   [https://github.com/muhammadabdullah-devpk/flyrank-ml-internship](https://github.com/muhammadabdullah-devpk/flyrank-ml-internship)

2. **FlyRank YouTube Channel (Recordings & Live Session Replays):**
   - **Videos Channel:** [https://www.youtube.com/@flyrank/videos](https://www.youtube.com/@flyrank/videos)
   - **Live Streams Channel:** [https://www.youtube.com/@flyrank/streams](https://www.youtube.com/@flyrank/streams)

3. **Validation & Methodology Audit Notebook:**
   `work/notebooks/w06_validation_audit.ipynb`

---

## Executive Summary of Session & Deliverable Findings

### 1. Label Provenance & Methodology Audit
- **Label Definition:** `is_declining_label = (trend_direction == "down")`.
- **Finding:** Target labels are derived from comparing 30-day traffic windows (`impressions_last_30d` vs `impressions_prev_30d`). Cross-sectional snapshots contain inherent selection bias; mature high-traffic pages updated recently show higher baseline authority rather than purely causal refresh impact.

### 2. Validation Design: Random K-Fold vs Honest GroupKFold (`client_id`)
- **Leakage Problem:** Standard Random K-Fold splits rows randomly across folds, allowing pages from the *same* client site to appear in both training and validation sets. Models memorize client-specific base rates instead of learning domain-agnostic signals.
- **Empirical Overestimation Gap:**
  - **Random K-Fold ROC-AUC:** 0.7728 (HistGradientBoosting)
  - **Grouped K-Fold ROC-AUC:** 0.7004 (HistGradientBoosting)
  - **Overestimation Gap:** **+0.0724 ROC-AUC points (+7.24%)**
  - **Decision Tree Gap:** **+0.0800 ROC-AUC points (+8.00%)**

### 3. Leakage Diagnostic Attack Harness
- We built an attack harness that intentionally injects leaky window features (`impressions_last_30d`).
- Injected leakage causes ROC-AUC to jump from **0.7004 to 0.8952** (+0.1948 points).
- Automated assertions verify that zero leakage columns (`trend_direction`, `trend_pct`, `impressions_last_30d`, `impressions_prev_30d`) exist in our final feature matrix `X`.

### 4. Precision@K Ranking Evaluation
- In content refresh prioritization, Precision@K measures top-of-queue accuracy:
  - **Precision@10:** 100.0%
  - **Precision@20:** 90.0%
  - **Precision@50:** 86.0%
  - **Precision@100:** 84.0%
- Demonstrates strong ranking utility for top refresh queue recommendations under grouped cross-validation.

### 5. Claim Discipline Framework (The Claim Ladder)
- **Initial Overclaimed Draft:** *"Our HistGradientBoosting model predicts Google search traffic decline with 100% precision."*
- **Public-Safe Rewritten Claim:** *"In 5-fold grouped cross-validation across 32 client domains, our HistGradientBoosting model prioritized declining content at **Precision@10 of 100.0%** and **ROC-AUC of 0.7004** (vs 54.2% base rate). These scores serve as **decision-support signals** for content audit queues rather than causal predictions of search engine algorithms."*
