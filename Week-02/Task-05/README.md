# Task 05 Submission: ML Task Framing & Foundations

**Author:** Muhammad Abdullah (ML & Search Intelligence Intern)  
**Repository:** [github.com/muhammadabdullah-devpk/flyrank-ml-internship](https://github.com/muhammadabdullah-devpk/flyrank-ml-internship)  
**Track:** Applied Search Intelligence (FlyRank)  
**Date:** July 21, 2026  

---

## 📌 Submission Overview

This directory contains the completed deliverable for **Week 02 - Task 05: ML Task Framing & Foundations**.

### 📄 Primary Deliverable File
- **[`ml_task_framing.md`](file:///d:/FlyRank/Week-02/Task-01/Week-02/Task-05/ml_task_framing.md)**: Full technical breakdown covering plain rules vs ML, AI vs ML vs analytics vs rules taxonomy, the 7-step ML loop, supervised vs unsupervised paradigms, generalization vs overfitting (client-level split), and capstone task framing (Content Decay Opportunity Scoring & Ranking with Precision@50).

---

## 🔗 Deliverable Links & Submission Metadata

### 1. Deliverable Link (Required for completion credit)
```text
https://github.com/muhammadabdullah-devpk/flyrank-ml-internship/blob/main/Week-02/Task-05/ml_task_framing.md
```

### 2. Context for Reviewers (Notes)
```text
In Task 05, I framed the Search Intelligence Capstone project ("Content Decay and Opportunity Scoring System") as a Supervised Opportunity Scoring and Ranking ML task.

Key Highlights:
- Core Foundations: Disambiguated AI vs ML vs Analytics vs Rule-Based Systems. Defined when plain rules excel (determinism, zero cold-start data, auditability) vs ML (high-dimensional non-linear interactions, distribution shift, continuous ranking).
- ML Loop & Paradigms: Detailed the 7-stage ML lifecycle and contrasted Supervised Learning (Scoring/Ranking) against Unsupervised Learning (Clustering).
- Generalization & Data Leakage: Explained why model memorization fails and established a strict client-level holdout strategy (80/20 train/test split by client_id) to prevent domain leakage.
- Target & Metric Defense: Defined target label is_declining_label (derived from 30-day click momentum, excluding trend_direction and trend_pct from feature set X to avoid data leakage) and defended Precision@50 as the primary metric, aligned with the editorial team's fixed weekly capacity of 50 page updates (aiming for >= 74% Precision@50 vs 51.8% rule baseline).
```

---

## 📑 Core Concepts Covered

1. **Plain Rules vs. Machine Learning:**
   - Plain rules offer instant auditability and $O(1)$ execution for simple thresholds (e.g. `age > 180`).
   - ML handles 44+ non-linear feature interactions (impressions, CTR, position, decay history) and yields calibrated continuous ranking.

2. **System Disambiguation Matrix:**
   - **AI:** Umbrella field of intelligent decision-making systems.
   - **ML:** Statistical parameter learning $f(X) \rightarrow y$ without explicit rule coding.
   - **Analytics:** Historical querying (`GROUP BY`, aggregations) answering *"What happened?"*.
   - **Rules:** Manual `IF-THEN` conditional code.

3. **The ML Loop:**
   - Framing $\rightarrow$ Data Ingestion $\rightarrow$ Baseline Construction $\rightarrow$ Model Training $\rightarrow$ Client Split Validation $\rightarrow$ Output Generation $\rightarrow$ Feedback & Retraining.

4. **Supervised vs. Unsupervised Learning:**
   - Supervised (Scoring/Ranking) maps multi-signal page metrics to decay risk $y$.
   - Unsupervised groups pages structurally without identifying actionable traffic loss.

5. **Generalization vs. Overfitting:**
   - Overfitting memorizes training instances/client artifacts (99% train precision $\rightarrow$ 48% test precision).
   - Client-level split prevents domain leakage by holding out entire client domains during evaluation.

6. **Capstone Framing:**
   - **Task Type:** Scoring & Ranking (Supervised Opportunity Scoring).
   - **Target Variable ($y$):** `is_declining_label` (`trend_direction == "down"`).
   - **Leakage Rule:** Exclude `trend_direction` and `trend_pct` from feature matrix $X$.
   - **Primary Metric:** **Precision@50** ($\ge 74\%$ target vs. $51.8\%$ 180-day age baseline and $54.2\%$ random baseline).
