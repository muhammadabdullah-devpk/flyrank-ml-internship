# Model Card — Content Decay Prediction Model

*Following the Model Cards for Model Reporting framework (Mitchell et al., 2019) and Pineau ML Reproducibility Checklist.*

---

## Model Details

| Field | Value |
|---|---|
| **Model Name** | FlyRank Content Decay Prediction — Random Forest Classifier |
| **Version** | 1.0 (August 2026) |
| **Author** | Muhammad Abdullah — AI & ML Engineer, LGU BSCS |
| **Organization** | FlyRank Applied ML Internship |
| **Model Type** | Random Forest Classifier (`sklearn.ensemble.RandomForestClassifier`) |
| **Primary Use** | Ranking content pages by probability of 30-day organic search traffic decline |
| **Output** | Calibrated probability score (0–1) + Priority Tier (P1–P4) + Reason Codes |
| **Deployment** | Decision-support tool for human editorial review queues |
| **Paper URL** | https://muhammadabdullah-devpk.github.io/flyrank-ml-internship/ |
| **Code Repository** | https://github.com/muhammadabdullah-devpk/flyrank-ml-internship |

---

## Intended Use

### Primary Use Cases
- Prioritizing monthly editorial content refresh queues
- Identifying pages at risk of search traffic decline before core rank collapse
- Allocating copywriter and editorial resources to highest-ROI content updates

### Primary Users
- FlyRank Content Editors & Strategists
- SEO Program Managers
- Digital Publishing Operations Teams

### Out-of-Scope Use Cases (Do Not Use For)
- **Automated deletions:** Never use model scores to automate URL removal, 301 redirects, or canonical tag changes without human review
- **Auto-publishing AI content:** Never trigger AI content rewrites and publish to production without editorial review
- **Newly published pages:** Pages < 90 days old are excluded — still in Google's indexing sandbox phase
- **YMYL content:** Medical, legal, or financial content requires additional domain expert review beyond model scores
- **Causal prediction:** Scores indicate statistical priority for inspection; they do not guarantee that refreshing a flagged page will recover search rank

---

## Training Data

| Field | Value |
|---|---|
| **Source** | FlyRank DuckDB production search intelligence warehouse |
| **Sample Size** | 30,000 anonymized search page records |
| **Full Warehouse Size** | ~79 million rows |
| **Anonymization** | `client_id` and `content_id` are pseudonymized hashes. No client domain names, URLs, titles, or proprietary keywords |
| **Time Period** | Search Console and GA4 data spanning 90-day performance windows |
| **Filtering** | Active indexed pages: `impressions_90d > 0` AND `content_age_days >= 90` |

### Datasheet Reference
For full column documentation, see `docs/data-dictionary.md` in the repository (44 columns documented with meaning, scale, and known gotchas).

---

## Feature Set

### Features Used (16 core)

| Feature | Category | Signal Type |
|---|---|---|
| `impressions_90d` | GSC Performance | Search volume |
| `clicks_90d` | GSC Performance | Click volume |
| `ctr` | GSC Performance | Click efficiency |
| `avg_position` | GSC Performance | Rank signal |
| `engagement_rate` | GA4 Behavior | On-page quality |
| `scroll_rate` | GA4 Behavior | Content depth engagement |
| `ai_traffic_pct` | GA4 Behavior | AI-referral share |
| `content_age_days` | Content Metadata | Page maturity |
| `days_since_last_update` | Content Metadata | Editorial recency |
| `word_count` | Content Metadata | Content depth |
| `days_with_impressions` | Derived | Consistency |
| `impression_volatility` | Derived | Traffic stability |
| `ctr_position_ratio` | Derived | CTR vs rank alignment |
| `refresh_urgency_score` | Derived | Combined urgency signal |
| `content_segment` | Categorical | Content tier |
| `primary_intent` | Categorical | Search intent type |

### Excluded Features (Label Leakage Prevention)
The following are derived from the target variable and are **strictly excluded** from all feature matrices:

- `trend_direction` — directly defines the label (`is_declining`)
- `trend_pct` — quantifies the same window comparison
- `impressions_last_30d` — one half of the label computation window
- `impressions_prev_30d` — the other half of the label computation window

Automated code assertion verifies zero leakage columns are present in `X` before any model fitting.

---

## Target Variable

```
is_declining = (trend_direction == 'down')
```

**Definition:** A page is labeled declining if its organic search impressions in the most recent 30-day window are lower than the previous 30-day window.  
**Class Distribution:** ~32% declining (positive class), ~68% stable/growing (negative class).  
**Implication:** Baseline false-positive rate for naive "flag everything" rule = 68%.

---

## Evaluation Results

### Validation Design
**5-Fold Grouped Client Cross-Validation (`GroupKFold` on `client_id`)**  
- Pages from the same client domain are strictly isolated within a single fold
- Prevents client-level data leakage that inflates random K-Fold by +4.5–8.0 ROC-AUC points
- 32 distinct client domains across 5 folds

### Results Table

| Model | Precision@50 | Precision@100 | ROC-AUC | PR-AUC | Lift vs Baseline |
|---|---|---|---|---|---|
| Hand-Rule Baseline | 0.240 | 0.230 | 0.542 | — | 1.00× |
| Logistic Regression | 0.580 | 0.540 | 0.725 | 0.677 | 2.42× |
| Decision Tree (depth=4) | 0.660 | 0.610 | 0.748 | 0.612 | 2.75× |
| **Random Forest (Selected)** | **0.740** | **0.690** | **0.812** | 0.691 | **3.08×** |
| HistGradientBoosting | 0.760 | 0.710 | 0.820 | 0.705 | 3.17× |

*Random Forest selected for model card as the primary deployed model due to interpretable feature importances and stable cross-client performance.*

### Precision@K Summary (Random Forest, Grouped CV)

| K | Precision@K |
|---|---|
| 10 | 1.000 (100%) |
| 20 | 0.900 (90%) |
| 50 | 0.740 (74%) |
| 100 | 0.690 (69%) |

### Key Negative Result
Decision Tree (depth=4) **completely collapsed at P@10 = 0.0% and P@20 = 0.0% on out-of-fold folds**, despite acceptable ROC-AUC. Shallow tree rules fail to generalize across diverse client portfolios — documented as an engineering finding, not hidden.

---

## Hyperparameters (Reproducibility)

```python
RandomForestClassifier(
    n_estimators=100,
    max_depth=None,
    min_samples_split=2,
    min_samples_leaf=1,
    random_state=42,
    n_jobs=-1
)
```

Fixed random seed: `42` across `numpy`, `scikit-learn`, and `python random`.

---

## Feature Importances (Top 5)

| Rank | Feature | Relative Importance |
|---|---|---|
| 1 | `avg_position` | ~18% |
| 2 | `ctr` | ~15% |
| 3 | `days_since_last_update` | ~13% |
| 4 | `impressions_90d` | ~12% |
| 5 | `engagement_rate` | ~10% |

*High average position combined with low CTR is the single strongest indicator of impending traffic loss.*

---

## Ethical Considerations

### Data Privacy
- All 30,000 records are pseudonymized: `client_id` and `content_id` are hashed identifiers
- No client domain names, proprietary URLs, raw page titles, or search queries are stored anywhere in the repository
- `client_id` is used **only** as a GroupKFold grouping key — it is never a model feature

### Fairness & Bias Considerations
- **Client size bias:** Larger clients with more pages may dominate high-confidence predictions. GroupKFold mitigates memorization of client-level base rates but does not fully eliminate volume correlation
- **Seasonal content:** Pages experiencing natural seasonal traffic dips may be incorrectly flagged; editorial judgment is required before acting on refresh scores for seasonal topics
- **New client domains:** Model performance on client domains entirely absent from training data is unknown — treat first-deployment scores as directional only

### Claim Discipline
This model produces **decision-support signals**, not causal predictions:

| ❌ Do Not Claim | ✅ Accurate Claim |
|---|---|
| "Predicts Google's algorithm" | "Flags pages statistically associated with declining search impressions" |
| "Guarantees traffic recovery" | "Prioritizes candidates for human editorial review" |
| "Predicts with X% accuracy" | "Achieves Precision@50 = 0.74 under 5-fold grouped cross-validation" |

---

## Monitoring & Maintenance

### Drift Indicators (Trigger Review)
- **Population Stability Index (PSI) > 0.25** on `ctr` or `avg_position` distributions
- **Google SERP layout change** introducing widespread AI Overviews (shifts baseline CTR distributions)
- **P1 refresh conversion < 40% rank recovery** over 60 days (operational feedback loop)

### Retrain Schedule
- **Cadence:** Monthly automated retrain pipeline
- **Event-driven:** Immediate retrain upon confirmed Google Core Algorithm Update

### Performance Floor
Model is considered degraded if:
- Precision@50 falls below **0.60** (threshold set at 2.5× baseline minimum lift)
- Precision@100 falls below **0.55**

---

## Reproducibility

### Re-run Command
```bash
git clone https://github.com/muhammadabdullah-devpk/flyrank-ml-internship.git
cd flyrank-ml-internship
pip install -r requirements.txt
python scripts/run_capstone_simple.py
```

### Environment
- Python 3.10+
- scikit-learn, pandas, numpy, matplotlib, duckdb, huggingface_hub
- See `requirements.txt` for pinned versions

### Data Access
Training data is hosted on Hugging Face: [`FlyRank/internship-warehouse`](https://huggingface.co/datasets/FlyRank/internship-warehouse) (gated — request access and accept data-use terms; approval is instant).

---

## References

- Mitchell, M. et al. (2019). Model Cards for Model Reporting. *FAccT 2019*.
- Pineau, J. et al. ML Reproducibility Checklist. *NeurIPS Reproducibility Program*.
- Bender, E. et al. (2021). Datasheets for Datasets. *FAccT 2021*.
- NIST AI Risk Management Framework (AI RMF 1.0).
- ICO Anonymisation Guidance.

---

*Model Card Version 1.0 — Muhammad Abdullah — August 2026*
