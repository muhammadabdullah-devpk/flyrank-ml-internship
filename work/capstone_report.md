# Capstone Report — Applied Search Intelligence: Content Decay Prediction & Action Playbook

- **Author:** Muhammad Abdullah
- **Lane:** Content Refresh / Search Intelligence
- **Repo:** [flyrank-ml-internship](https://github.com/muhammadabdullah-devpk/flyrank-ml-internship)
- **Deployed Research Paper:** [https://muhammadabdullah-devpk.github.io/flyrank-ml-internship/](https://muhammadabdullah-devpk.github.io/flyrank-ml-internship/)
- **Date:** August 2026

---

## 1. Problem framing

**The FlyRank Content Problem:**  
Organic search traffic is the lifeblood of digital publishing. However, individual page performance naturally decays over time due to search engine algorithm updates, shifting user intent, and competitor publishing. Traditional editorial workflows rely on manual intuition or naive rules (e.g. *"flag any article older than 6 months"*). In FlyRank operations, these naive rules generate a ~76% false-positive rate, swamping editorial staff with low-impact pages while missing high-volume assets suffering subtle positioning drops.

**Unit of Analysis:** Individual published content page (`content_id`).  
**Output:** Calibrated content refresh probability score, impact priority tier (P1-P4), and interpretable reason codes (`HIGH_CTR_LOW_POSITION`, `SERP_DECAY_CANDIDATE`).  
**Action Supported:** Decision-support for content editors to select candidates for title/meta restructure, content depth expansion, or comprehensive refresh.  
**Cost of Wrong Call:** False positives waste expensive editorial writing hours on healthy content; false negatives lose organic search impressions and revenue.

---

## 2. Data safety

**Dataset Scope:**  
30,000 anonymized search page records sampled from FlyRank's 79M-row DuckDB production search intelligence warehouse. Analysis is restricted to active indexed pages with `impressions_90d > 0` and `content_age_days >= 90`.

**Data Safety & Exclusion Rules:**  
- **Explicit Label Exclusion:** `trend_direction` and `trend_pct` strictly excluded from features to prevent target leakage.
- **Pseudonymization:** `client_id` and `content_id` are pseudonymized hashes. `client_id` is used strictly as a GroupKFold grouping key — never as a feature.
- **Zero Private Identifiers:** No client domain names, proprietary URLs, or raw user search queries are stored anywhere in `work/` or in the repository.

---

## 3. Baseline

**SEO Agency Rule Baseline:**  
```python
baseline_flag = (content_age_days > 180) & (ctr < 0.02) & (avg_position > 15)
```
- **Fair Comparison:** Evaluated on the exact same 30,000 active search pages and identical grouped 5-fold evaluation splits.
- **Baseline Metrics:** Precision@50 = **0.240**, Precision@100 = **0.230**, ROC-AUC = **0.542**.

---

## 4. Model / analysis

**Methodology & Feature Selection:**  
Evaluated Logistic Regression, Decision Tree, and Random Forest models across 16 core features spanning GSC metrics (`impressions_90d`, `clicks_90d`, `ctr`, `avg_position`), GA4 behavior (`engagement_rate`, `scroll_rate`, `ai_traffic_pct`), and content metadata (`content_age_days`, `days_since_last_update`, `word_count`).

**Target Definition:**  
Binary target `is_declining = (trend_direction == 'down')`.

---

## 5. Evaluation

**Honest Validation Architecture:**  
Enforced strict **5-Fold Grouped Client Cross-Validation (GroupKFold by `client_id`)**. Pages belonging to the same client domain are strictly isolated within train or test folds to prevent intra-client data leakage.

| Model | Validation Design | Precision@50 | Precision@100 | ROC-AUC | Lift vs Baseline |
|---|---|---|---|---|---|
| Hand-Rule Baseline | Domain Heuristic | 0.240 | 0.230 | 0.542 | 1.00× |
| Logistic Regression | 5-Fold GroupKFold | 0.580 | 0.540 | 0.725 | 2.42× |
| Decision Tree | 5-Fold GroupKFold | 0.660 | 0.610 | 0.748 | 2.75× |
| **Random Forest (Winner)** | **5-Fold GroupKFold** | **0.740** | **0.690** | **0.812** | **3.08×** |

---

## 6. Interpretation

**Feature Importances & Signals:**  
Top predictive signals for content decay: `avg_position`, `ctr`, `days_since_last_update`, `impressions_90d`, and `engagement_rate`. High average position combined with low CTR is the single strongest indicator of impending traffic loss.

---

## 7. Recommendation & Playbook

**Operational Action Playbook:**  
Model probability scores are mapped to Reason Codes and human-in-the-loop review steps:
1. **Queue Prioritization:** Top 500 pages filtered into P1_CRITICAL and P2_HIGH tiers.
2. **Reason Code Tagging:** Every queue item tagged with reason codes (e.g., `HIGH_CTR_LOW_POSITION`).
3. **No-Go Safety Boundaries:** Explicit prohibition of automated URL deletion, canonical tag mutation, or direct auto-publishing of unreviewed AI content.

---

## 8. Reproducibility

**Re-run Command:**  
```bash
git clone https://github.com/muhammadabdullah-devpk/flyrank-ml-internship.git
cd flyrank-ml-internship
pip install -r requirements.txt
python scripts/run_capstone_simple.py
```
- **Random Seed:** `42` fixed across numpy, scikit-learn, and python random.

---

## 9. Week-8 Showcase: 5-Minute Demo Outline

### [0:00 - 1:00] Minute 1: The Question & FlyRank Problem
- **The Core Problem:** FlyRank manages organic search performance across thousands of articles. Legacy content decays over time due to SERP shifts and algorithm updates.
- **The Failure of Rules:** Traditional rules (*"flag articles older than 6 months"*) generate a ~76% false-positive rate.
- **Research Question:** Can we build a decision-support filter predicting 30-day decay to prioritize editorial refreshes?

### [1:00 - 2:00] Minute 2: The Method & Leakage Prevention
- **Data:** 30,000 anonymized search page records from FlyRank's 79M-row DuckDB warehouse.
- **Validation:** 5-Fold GroupKFold client cross-validation (`GroupKFold` on `client_id`) preventing cross-client data leakage.
- **Safety:** Label features strictly excluded.

### [2:00 - 3:00] Minute 3: One Key Chart (Figure 1: ROC Curve)
- **Highlight:** Figure 1 (ROC Curve comparison).
- **Takeaway:** Random Forest ROC-AUC of 0.812 vs Baseline 0.542 under honest grouped validation.

### [3:00 - 4:00] Minute 4: One Honest Result
- **Headline Finding:** Precision@50 of 0.740 (3.08× precision lift over 0.240 baseline).
- **Honest Limits:** Association model; non-causal without editorial review and live intent verification.

### [4:00 - 5:00] Minute 5: One Action Recommendation
- **Playbook:** Calibrated probabilities mapped to Reason Codes and human-in-the-loop workflows.
- **Safety:** Enforce strict no-go boundaries against automated URL deletions or unreviewed AI publishing.

---

## 10. Shareable Cuts

### Cut 1: Short Social Post (Methodology Focus)

> 🚀 Most SEO recommendations fail because naive rules generate 76% false positives.
>
> In my ML Capstone at FlyRank, I evaluated content decay prediction across 30,000 production search pages (sampled from a 79M DuckDB warehouse).
>
> Key Method: Applied 5-Fold GroupKFold client cross-validation to eliminate intra-client data leakage.  
> Key Finding: Random Forest boosted Precision@50 from 0.24 → 0.74 (a 3.08× precision lift over traditional SEO hand-rules).
>
> Read the full paper & explore the live action queue: https://muhammadabdullah-devpk.github.io/flyrank-ml-internship/
> #MachineLearning #SearchIntelligence #DataScience #Python #FlyRank

### Cut 2: 3-Sentence Employer-Facing Summary

> **What I built:** I engineered and validated a production search intelligence pipeline that predicts Google organic traffic decay and operationalizes predictions into a human-in-the-loop editorial action queue.
>
> **On what data:** I evaluated models on 30,000 anonymized search page records sampled from FlyRank's 79M-row DuckDB warehouse, enforcing strict 5-Fold Grouped Client Cross-Validation (GroupKFold by client_id) to eliminate intra-client data leakage.
>
> **What it showed:** The Random Forest model achieved a Precision@50 of 0.74 — a 3.08× precision lift over traditional SEO hand-rules (0.24) — enabling editorial teams to prioritize high-ROI content refreshes while maintaining strict no-go automation safety boundaries.
