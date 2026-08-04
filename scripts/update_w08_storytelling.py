import json
import os
import sys

demo_outline_text = [
    "## 8. Week-8 Showcase: 5-Minute Demo Outline\n",
    "\n",
    "A 5-minute structured presentation outline ready for the Week-8 FlyRank Showcase:\n",
    "\n",
    "### [0:00 - 1:00] Minute 1: The Question & FlyRank Problem\n",
    "- **The Core Problem:** FlyRank manages organic search intelligence across thousands of client articles. Over time, published content suffers traffic decay due to SERP layout shifts, competitor actions, and algorithm updates.\n",
    "- **The Failure of Traditional Rules:** Traditional SEO agency rules (e.g., *\"flag articles older than 6 months\"*) generate a ~76% false-positive rate, swamping editorial teams with healthy pages while missing critical traffic losses.\n",
    "- **Research Question:** Can we build a decision-support filter that accurately predicts 30-day traffic decay to prioritize high-ROI editorial refreshes?\n",
    "\n",
    "### [1:00 - 2:00] Minute 2: The Method & Honest Validation Architecture\n",
    "- **Data Foundation:** Evaluated on 30,000 anonymized search page records sampled from FlyRank's 79M-row DuckDB production warehouse (spanning GSC performance, GA4 behavior, and content metadata).\n",
    "- **Leakage Prevention:** Benchmark models using **5-Fold Grouped Client Cross-Validation (`GroupKFold` on `client_id`)**. All pages from a client remain strictly isolated in either train or test folds to prevent intra-client data leakage.\n",
    "- **Safety Exclusions:** Label-derived columns (`trend_direction`, `trend_pct`) strictly excluded from model feature matrices.\n",
    "\n",
    "### [2:00 - 3:00] Minute 3: One Key Chart (Figure 1: ROC Curve & Discrimination Lift)\n",
    "- **Visual Highlight:** Present Figure 1 (ROC Curve comparison).\n",
    "- **Chart Takeaway:** Random Forest achieves an out-of-sample ROC-AUC of **0.812** compared to the Hand-Rule Baseline AUC of **0.542** under honest grouped cross-validation.\n",
    "- **Key Insight:** The model demonstrates clear rank discrimination across unseen client domains, distinguishing true traffic decay candidates from stable legacy pages.\n",
    "\n",
    "### [3:00 - 4:00] Minute 4: One Honest Result & Limitation Framing\n",
    "- **Headline Finding:** Random Forest achieves a **Precision@50 of 0.740 — a 3.08× precision lift over the hand-rule baseline (0.240)**.\n",
    "- **Honest Framing (Claim Ladder):** We observe precision lift in ranking decaying content. We do *not* claim to predict Google's search algorithm, nor do we guarantee rank recovery without human editorial review.\n",
    "\n",
    "### [4:00 - 5:00] Minute 5: One Actionable Recommendation & Action Playbook Deployment\n",
    "- **Operationalization:** Model probabilities are converted into an operational Content Action Playbook with Reason Codes (`HIGH_CTR_LOW_POSITION`, `SERP_DECAY_CANDIDATE`).\n",
    "- **Human-in-the-Loop:** Top 500 pages are organized into P1_CRITICAL and P2_HIGH priority queues for human review.\n",
    "- **No-Go Boundaries:** Enforce strict safety boundaries — no automated page deletions, canonical tag alterations, or unreviewed AI copy publishing."
]

shareable_cuts_text = [
    "## 9. Shareable Cuts\n",
    "\n",
    "Two ready-to-share summaries framed for different audiences:\n",
    "\n",
    "---\n",
    "\n",
    "### Cut 1: Short Social Post (Methodology & Results Focus)\n",
    "\n",
    "🚀 Most SEO recommendations fail because naive rules generate 76% false positives.\n",
    "\n",
    "In my ML Capstone at FlyRank, I evaluated content decay prediction across 30,000 production search pages (sampled from a 79M DuckDB warehouse).\n",
    "\n",
    "Key Method: Applied 5-Fold GroupKFold client cross-validation to eliminate intra-client data leakage.  \n",
    "Key Finding: Random Forest boosted Precision@50 from 0.24 → 0.74 (a 3.08× precision lift over traditional SEO hand-rules).\n",
    "\n",
    "Read the full paper & explore the live action queue: https://muhammadabdullah-devpk.github.io/flyrank-ml-internship/\n",
    "#MachineLearning #SearchIntelligence #DataScience #Python #FlyRank\n",
    "\n",
    "---\n",
    "\n",
    "### Cut 2: 3-Sentence Employer-Facing Summary (\"What I built, on what data, what it showed\")\n",
    "\n",
    "**What I built:** I engineered and validated a production search intelligence pipeline that predicts Google organic traffic decay and operationalizes predictions into a human-in-the-loop editorial action queue.\n",
    "\n",
    "**On what data:** I evaluated models on 30,000 anonymized search page records sampled from FlyRank's 79M-row DuckDB warehouse, enforcing strict 5-Fold Grouped Client Cross-Validation (GroupKFold by client_id) to eliminate intra-client data leakage.\n",
    "\n",
    "**What it showed:** The Random Forest model achieved a Precision@50 of 0.74 — a 3.08× precision lift over traditional SEO hand-rules (0.24) — enabling editorial teams to prioritize high-ROI content refreshes while maintaining strict no-go automation safety boundaries."
]

def update_notebook(nb_path):
    with open(nb_path, 'r', encoding='utf-8') as f:
        nb = json.load(f)

    # Check if demo outline already exists
    has_demo = any("5-Minute Demo Outline" in "".join(c.get("source", [])) for c in nb["cells"])
    
    if not has_demo:
        # Find self-check cell index or append at end
        self_check_idx = -1
        for i, c in enumerate(nb["cells"]):
            if "Self-check" in "".join(c.get("source", [])):
                self_check_idx = i
                break
        
        demo_cell = {
            "cell_type": "markdown",
            "metadata": {},
            "source": demo_outline_text
        }
        cuts_cell = {
            "cell_type": "markdown",
            "metadata": {},
            "source": shareable_cuts_text
        }
        
        if self_check_idx != -1:
            nb["cells"].insert(self_check_idx, cuts_cell)
            nb["cells"].insert(self_check_idx, demo_cell)
        else:
            nb["cells"].append(demo_cell)
            nb["cells"].append(cuts_cell)

    with open(nb_path, 'w', encoding='utf-8') as f:
        json.dump(nb, f, indent=1)
    print(f"Updated {nb_path} with 5-Minute Demo Outline and Shareable Cuts.")

update_notebook('work/notebooks/capstone.ipynb')
update_notebook('work/notebooks/w07_action_playbook.ipynb')
