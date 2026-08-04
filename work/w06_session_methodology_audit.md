# Week 06 — Session Methodology Audit & Deliverables Report

**Track:** FlyRank ML Engineering Internship  
**Topic:** Validation Design, Data Leakage Audits, Precision@K, Effect Sizes, and Claim Discipline  
**Deliverable Links:**
- **GitHub Repository:** [https://github.com/muhammadabdullah-devpk/flyrank-ml-internship](https://github.com/muhammadabdullah-devpk/flyrank-ml-internship)
- **YouTube Session Recording:** [https://www.youtube.com/@flyrank/videos](https://www.youtube.com/@flyrank/videos)
- **YouTube Live Stream Replays:** [https://www.youtube.com/@flyrank/streams](https://www.youtube.com/@flyrank/streams)

---

## 1. Executive Summary & Session Overview

This week bridges machine learning model training with industrial research methodology. As ML engineers reviewing shipped research (such as FlyRank's public paper *The State of AI-Driven SEO in Numbers*), we must critically audit:
1. **Label Provenance:** How ground-truth labels are created and whether cross-sectional snapshots introduce selection bias.
2. **Validation Split Rigor:** Why standard random K-fold cross-validation causes severe group leakage when multiple URLs belong to the same client domain, and why `GroupKFold` (by `client_id`) or `TimeSeriesSplit` provides the true generalization baseline.
3. **Leakage Audits:** Building automated attack harnesses to detect target leakage, sibling feature leakage, and temporal lookahead leakage.
4. **Ranking & Decision Support Evaluation:** Using Precision@K (P@10, P@20, P@50, P@100) and PR-AUC alongside ROC-AUC under class imbalance.
5. **Statistical Rigor & Claim Discipline:** Replacing overclaimed statements ("predicted Google algorithms") with measured, directional, decision-support framing supported by empirical metrics.

---

## 2. Methodology Audit: Ground Truth & Validation Splits

### 2.1 Where Do Labels Come From?
- In the FlyRank dataset of 30,000 anonymized pages, the target label is defined as:
  $$\text{is\_declining\_label} = (\text{trend\_direction} == \text{"down"})$$
- Ground truth comes from comparing organic Search Console traffic across consecutive 30-day windows (`impressions_last_30d` vs `impressions_prev_30d`).
- **Audit Finding:** Any feature derived from `impressions_last_30d` or `impressions_prev_30d` (or their ratio `trend_pct`) directly leaks the target label into the model.

### 2.2 Random K-Fold vs. GroupKFold (`client_id`)
When multiple pages belong to the same client site, standard Random 5-Fold Cross-Validation splits pages from the same client across both train and validation folds.

#### Empirical Results (30,000 Pages across 32 Client Domains)

| Model | Random CV ROC-AUC | Grouped CV ROC-AUC | Overestimation Gap | Random PR-AUC | Grouped PR-AUC | PR-AUC Gap |
|---|---|---|---|---|---|---|
| **HistGradientBoosting** | 0.7728 | 0.7004 | **+0.0724 (+7.24%)** | 0.7870 | 0.7045 | +0.0825 |
| **Random Forest** | 0.7543 | 0.6877 | **+0.0666 (+6.66%)** | 0.7667 | 0.6909 | +0.0758 |
| **Decision Tree (depth=4)** | 0.7059 | 0.6259 | **+0.0800 (+8.00%)** | 0.6905 | 0.6116 | +0.0789 |
| **Logistic Regression** | 0.7169 | 0.6721 | **+0.0448 (+4.48%)** | 0.7299 | 0.6773 | +0.0526 |
| **Week-4 Baseline Heuristic** | 0.6100 | 0.6100 | **0.0000** | 0.6314 | 0.6314 | 0.0000 |

*Key Insight:* Random K-Fold inflates model performance by **4.5 to 8.0 ROC-AUC points** because the model memorizes client-wide base rates and domain authority rather than learning generalizable signals across unseen sites.

---

## 3. Leakage Diagnostic Attack Harness

To verify that our validation pipeline actively detects target leakage:
1. **Honest Baseline:** `HistGradientBoosting` trained on 46 strictly vetted non-leaky features achieves **0.7004 Grouped ROC-AUC**.
2. **Leak Injected:** We deliberately inject `impressions_last_30d` into the feature matrix.
3. **Harness Result:** Grouped ROC-AUC jumps to **0.8952** (+0.1948 ROC-AUC points).
4. **Assertion Check:** Automated code assertions confirm 0 leakage columns are present in `X`.

---

## 4. Precision@K Ranking Evaluation

In SEO content refresh queue operations, engineers care about top-ranked action items. Evaluated under 5-Fold Grouped CV:

| Metric | HistGradientBoosting | Random Forest | Logistic Regression | Week-4 Baseline Rule |
|---|---|---|---|---|
| **P@10** | **100.0%** | 70.0% | 30.0% | 70.0% |
| **P@20** | **90.0%** | 80.0% | 55.0% | 60.0% |
| **P@50** | **86.0%** | 88.0% | 70.0% | 66.0% |
| **P@100** | **84.0%** | 89.0% | 79.0% | 74.0% |

---

## 5. The Claim Ladder: Safe Scientific Language

| Overclaimed Draft (Banned Phrasing) | Public-Safe Rewritten Claim (Honest Standard) |
|---|---|
| *"Our AI model predicts Google search traffic decline with 100% precision."* | *"In 5-fold grouped cross-validation across 32 client domains, HistGradientBoosting prioritized declining content at **Precision@10 of 100.0%** and **ROC-AUC of 0.7004** (vs 54.2% base rate). Scores act as **decision-support signals** for content audit queues."* |
| *"Updating content in the 31-90 day window causes a 7.88x traffic increase."* | *"In this portfolio snapshot, pages updated 31-90 days ago **exhibited a 7.88:1 ratio** of growing-to-declining performance. While this **directional association** highlights recency as an operational filter, selection bias means individual page outcomes vary."* |

---

## 6. AI Red Teaming & Critique Validation

During AI red teaming of our model:
- **Critique:** *"The model relies on search volume which might be correlated with client size."*
- **Empirical Validation:** GroupKFold split explicitly isolates client domain boundaries. When evaluated on unseen domains, search volume ranks as a secondary feature while relative traffic consistency (`days_with_impressions`, 11.4%) dominates out-of-fold predictions.
- **Negative Result Finding:** Simple Decision Trees collapsed on out-of-fold P@10/P@20 (0.0%), confirming that shallow tree rules fail to generalize across diverse client portfolios without ensemble regularization. Negative results are documented as clear engineering findings.
