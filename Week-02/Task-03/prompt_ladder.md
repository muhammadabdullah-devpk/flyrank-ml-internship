# Prompt Ladder: Model Interpretability & Page Rank Evaluation

This document details the progressive refinement of a prompt designed to generate Python code for training and evaluating an interpretable Machine Learning model for ranking search pages. It follows a 5-step ladder starting from a lazy prompt, adding one specific layer at each step, analyzing the outputs, and culminating in a robust, production-ready prompt template.

---

## Ladder Overview
Each step in this ladder adds exactly one named prompt engineering layer to target the weaknesses of the previous output:

```
[Baseline: Generic request]
          │
          ▼ (Layer 1: Clearer Goal)
[Version 1: Tree interpretability & Comparison]
          │
          ▼ (Layer 2: Real Context)
[Version 2: Dataset schema & Hand-rule formulas]
          │
          ▼ (Layer 3: Quality Metric)
[Version 3: Evaluation via Precision@K]
          │
          ▼ (Layer 4: Visual Example FAIL)
[Version 4: Graphviz Visualization - Fragile Dependency]
          │
          ▼ (Layer 5: Constraints)
[Version 5: Client-Holdout & Leakage Protection - Robust]
```

---

## Baseline: The Lazy Prompt

### The Prompt
> Write python code to train a machine learning model to rank web pages.

### Representative Output Excerpt
```python
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error

# Generate synthetic dataset
data = {
    'feature_1': [1.2, 3.4, 0.5, 2.3],
    'feature_2': [10, 20, 15, 30],
    'target_rank': [1, 4, 2, 3]
}
df = pd.DataFrame(data)

# Split and train
X = df[['feature_1', 'feature_2']]
y = df['target_rank']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

model = RandomForestRegressor()
model.fit(X_train, y_train)

# Evaluate
preds = model.predict(X_test)
print("MSE:", mean_squared_error(y_test, preds))
```

### Evaluation Notes
1. **What changed in the prompt:** None (this is the baseline).
2. **What actually improved in the output:** N/A (baseline).
3. **What still failed:** The code trains a black-box model (Random Forest) on synthetic variables (`feature_1`, `feature_2`) and evaluates it using Mean Squared Error (MSE). This fails to address the ranking problem, does not use our actual dataset features, has no comparative hand-written heuristic, and offers zero model interpretability.
4. **What to try next:** Add a **clearer goal**—restrict the model to a depth-2 decision tree classifier for interpretability, print its rules, and compare it against a hand-written rule.

---

## Version 1: Adding a Clearer Goal

### The Prompt
> Write a python code to train a depth-2 decision tree classifier to predict page traffic decline (is_declining_label) and compare its ranking performance to a hand-written rule. Print the tree rules.

### Representative Output Excerpt
```python
import pandas as pd
from sklearn.tree import DecisionTreeClassifier, export_text
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# Dummy dataset
df = pd.DataFrame({
    'feature_1': [100, 200, 50, 120, 80],
    'feature_2': [0.1, 0.4, 0.8, 0.2, 0.3],
    'is_declining_label': [1, 1, 0, 0, 0]
})

X = df[['feature_1', 'feature_2']]
y = df['is_declining_label']

clf = DecisionTreeClassifier(max_depth=2, class_weight='balanced')
clf.fit(X, y)

# Print tree rules
rules = export_text(clf, feature_names=['feature_1', 'feature_2'])
print("Tree splits:\n", rules)

# Hand-rule comparison
df['hand_rule_score'] = (df['feature_1'] > 100).astype(int)
print("Tree Accuracy:", accuracy_score(y, clf.predict(X)))
print("Hand Rule Accuracy:", accuracy_score(y, df['hand_rule_score']))
```

### Evaluation Notes
1. **What changed in the prompt:** Added a **clearer goal** specifying a depth-2 decision tree model, a target label (`is_declining_label`), a printout of the split rules, and a comparison against a hand-written rule.
2. **What actually improved in the output:** The output restricted model complexity to a highly interpretable depth-2 tree and outputted its rules using `export_text`. It also introduced code comparing the model against a custom heuristic.
3. **What still failed:** The features are still synthetic placeholders, and the hand rule is an arbitrary heuristic (`feature_1 > 100`). It does not represent our search ranking schema or the specific "stale x visible" logic. Additionally, evaluating ranking using `accuracy_score` is incorrect.
4. **What to try next:** Add **real context**—specify the actual dataset features and the formula for our hand-written ranking rule.

---

## Version 2: Adding Real Context

### The Prompt
> Write a python code to train a depth-2 decision tree classifier to predict page traffic decline (is_declining_label) and compare its ranking performance to a hand-written rule. The dataset is loaded from a pandas DataFrame df. The features are 'content_age_days', 'days_since_last_update', 'impressions_90d', 'avg_position', 'ctr', and 'word_count'. The target label is 'is_declining_label'. The hand-written rule calculates a score = (days_since_last_update >= 180) * (impressions_90d >= 500) * impressions_90d. Print the tree's split rules in text.

### Representative Output Excerpt
```python
import pandas as pd
import numpy as np
from sklearn.tree import DecisionTreeClassifier, export_text
from sklearn.metrics import classification_report

# Assume df is loaded
features = ['content_age_days', 'days_since_last_update', 'impressions_90d', 'avg_position', 'ctr', 'word_count']
X = df[features].fillna(0)
y = df['is_declining_label']

clf = DecisionTreeClassifier(max_depth=2, class_weight='balanced', random_state=42)
clf.fit(X, y)

# Hand rule calculation
df['hand_rule_score'] = (df['days_since_last_update'] >= 180) * (df['impressions_90d'] >= 500) * df['impressions_90d']

# Output splits
print(export_text(clf, feature_names=features))

# Print standard reports
print("Decision Tree Classification Report:")
print(classification_report(y, clf.predict(X)))
```

### Evaluation Notes
1. **What changed in the prompt:** Added **real context** by providing the exact dataset columns and the mathematical formula for our hand-written ranking rule.
2. **What actually improved in the output:** The generated code now processes the true feature space and applies the actual formula for the "stale x visible" hand-rule score.
3. **What still failed:** The code evaluates performance using a standard classification report (precision/recall/F1 overall). For ranking tasks, overall accuracy is misleading; we care about the quality of the top-ranked suggestions (e.g., top 20 or top 50 pages flagged for review).
4. **What to try next:** Add a **specified output format / metric quality criteria**—require that both rankings be evaluated and compared using the `Precision@K` metric (specifically at K=20 and K=50) using a custom helper function.

---

## Version 3: Adding Quality Criteria & Metrics

### The Prompt
> Write a python code to train a depth-2 decision tree classifier to predict page traffic decline (is_declining_label) and compare its ranking performance to a hand-written rule. Features: 'content_age_days', 'days_since_last_update', 'impressions_90d', 'avg_position', 'ctr', 'word_count'. Target: 'is_declining_label'. Hand-written rule: (days_since_last_update >= 180) * (impressions_90d >= 500) * impressions_90d. The model and hand-rule must be evaluated and compared using the Precision@K metric (specifically for K=20 and K=50) to evaluate how many of the top-ranked pages are actually declining. Write a helper function 'precision_at_k(scores, labels, k)' to compute this. Print the decision tree rules using scikit-learn's export_text.

### Representative Output Excerpt
```python
import pandas as pd
import numpy as np
from sklearn.tree import DecisionTreeClassifier, export_text

def precision_at_k(scores, labels, k):
    order = np.argsort(-np.asarray(scores))
    topk = np.asarray(labels)[order[:k]]
    return topk.mean()

# Train
features = ['content_age_days', 'days_since_last_update', 'impressions_90d', 'avg_position', 'ctr', 'word_count']
X = df[features].fillna(0)
y = df['is_declining_label']

clf = DecisionTreeClassifier(max_depth=2, class_weight='balanced', random_state=42)
clf.fit(X, y)

# Predict probability of decline (class 1)
tree_scores = clf.predict_proba(X)[:, 1]

# Hand rule
hand_scores = (df['days_since_last_update'] >= 180) * (df['impressions_90d'] >= 500) * df['impressions_90d']

# Evaluate at K=20 and K=50
for k in [20, 50]:
    print(f"Precision@{k}: Hand Rule = {precision_at_k(hand_scores, y, k):.3f} | Decision Tree = {precision_at_k(tree_scores, y, k):.3f}")

print("\nTree splits:")
print(export_text(clf, feature_names=features))
```

### Evaluation Notes
1. **What changed in the prompt:** Added **quality criteria & metrics** specifying `Precision@K` for evaluation at K=20 and 50, and requested a custom implementation of the `precision_at_k` helper function.
2. **What actually improved in the output:** The output comparison changed from classification metrics to ranking metrics. It implemented the correct `precision_at_k` sorting logic, allowing us to evaluate model performance deep in the top list vs. at the very top.
3. **What still failed:** The evaluation is done *in-sample* (on the entire training set). In machine learning, evaluating on the training set hides overfitting and does not validate generalizability. Furthermore, pages belong to specific clients—fitting a model on one client and evaluating it on the same client creates data leakage.
4. **What to try next:** Attempt to add **examples of what good looks like** by requesting a beautiful visual tree plot using the `graphviz` library to make the output more executive-friendly.

---

## Version 4: The Failure Moment (Visual Example)

### The Prompt
> Write a python code to train a depth-2 decision tree classifier to predict page traffic decline (is_declining_label) and compare its ranking performance to a hand-written rule. Features: 'content_age_days', 'days_since_last_update', 'impressions_90d', 'avg_position', 'ctr', 'word_count'. Target: 'is_declining_label'. Hand-written rule: (days_since_last_update >= 180) * (impressions_90d >= 500) * impressions_90d. Evaluated using precision_at_k(scores, labels, k) for K=20 and K=50. To make the model highly interpretable, visualize the decision tree structure as a beautiful diagram. Example of what good looks like: import graphviz; dot_data = tree.export_graphviz(clf, ...); graph = graphviz.Source(dot_data); graph.render('tree'). Generate code that creates this graphviz plot.

### Representative Output Excerpt
```python
import pandas as pd
import numpy as np
from sklearn.tree import DecisionTreeClassifier, export_graphviz
import graphviz

# ... [Previous data prep & precision_at_k code] ...

# Fit
clf = DecisionTreeClassifier(max_depth=2, class_weight='balanced', random_state=42)
clf.fit(X, y)

# Visual Tree Diagram
dot_data = export_graphviz(clf, out_file=None, feature_names=features, 
                           class_names=['Not Declining', 'Declining'], filled=True, rounded=True)
graph = graphviz.Source(dot_data)
graph.render("decision_tree_structure", format="png")
```

### Evaluation Notes (The "Made it Worse" moment)
1. **What changed in the prompt:** Added **examples of what good looks like** by showing a snippet of how to visualize the tree diagram using the `graphviz` python module.
2. **What actually improved in the output:** The output code includes graphviz export and rendering instructions, which theoretically makes a nice image.
3. **What still failed:** **This change introduced a fatal run-time dependency crash.** While the python package `graphviz` installs easily, it is merely a wrapper. Calling `graph.render()` requires the **Graphviz system-level binary** (`dot` or `dot.exe`) to be installed in the operating system's PATH. In a clean Python environment, a local command terminal, or Google Colab, this script throws a catastrophic `ExecutableNotFound` exception. It makes the code non-executable out-of-the-box.
4. **What to try next:** Revert the visual tree generation back to the robust, native `export_text`. Add two strict structural **constraints**: client-holdout validation based on `client_id` (so clients are separated between train and test to prevent leakage), and an anti-leakage feature assertion checking that `trend_pct` is excluded from the feature list.

---

## Version 5: Adding Constraints & Data Safety (Final Version)

### The Prompt
> Write a python code to train a depth-2 decision tree classifier to predict page traffic decline (is_declining_label) and compare its ranking performance to a hand-written rule. Features: 'content_age_days', 'days_since_last_update', 'impressions_90d', 'avg_position', 'ctr', 'word_count'. Target: 'is_declining_label'. Hand-written rule: (days_since_last_update >= 180) * (impressions_90d >= 500) * impressions_90d. Evaluated using precision_at_k(scores, labels, k) for K=20 and K=50.
> 
> - Constraint 1 (No Data Leakage): Do NOT include features that leak the target label (specifically 'trend_pct' or 'trend_direction' must never be features). Include a check that raises a ValueError if these features are accidentally included in the training list.
> - Constraint 2 (Client-Holdout Validation): Split the data into train and test sets using client-holdout validation based on 'client_id' (so a client's pages never appear in both train and test sets).
> - Clean up: Revert the tree visualization to standard text-based rules using 'export_text' (avoid external graphviz dependencies). Print the evaluation results for both train and test splits.

### Representative Output Excerpt
```python
import pandas as pd
import numpy as np
from sklearn.tree import DecisionTreeClassifier, export_text
from sklearn.model_selection import train_test_split

def precision_at_k(scores, labels, k):
    order = np.argsort(-np.asarray(scores))
    topk = np.asarray(labels)[order[:k]]
    return topk.mean()

# Assume df is loaded
df["is_declining_label"] = df["trend_direction"].str.lower().eq("down").astype(int)

features = ["content_age_days", "days_since_last_update", "impressions_90d", "avg_position", "ctr", "word_count"]

# Leakage prevention assertion
forbidden_features = ["trend_pct", "trend_direction"]
for f in features:
    if f in forbidden_features:
        raise ValueError(f"Data Leakage: Feature '{f}' is derived from the target variable!")

# Hand rule calculation
df["hand_rule_score"] = (df["days_since_last_update"] >= 180) * (df["impressions_90d"] >= 500) * df["impressions_90d"]

# Client-holdout validation
unique_clients = df["client_id"].unique()
train_clients, test_clients = train_test_split(unique_clients, test_size=0.2, random_state=42)

train_df = df[df["client_id"].isin(train_clients)].copy()
test_df = df[df["client_id"].isin(test_clients)].copy()

X_train = train_df[features].replace([np.inf, -np.inf], np.nan).fillna(0)
y_train = train_df["is_declining_label"].values

X_test = test_df[features].replace([np.inf, -np.inf], np.nan).fillna(0)
y_test = test_df["is_declining_label"].values

# Train
clf = DecisionTreeClassifier(max_depth=2, class_weight="balanced", random_state=42)
clf.fit(X_train, y_train)

# Scores
train_tree_scores = clf.predict_proba(X_train)[:, 1]
test_tree_scores = clf.predict_proba(X_test)[:, 1]

# Evaluate
for split_name, y_split, tree_scores, df_split in [
    ("TRAIN", y_train, train_tree_scores, train_df),
    ("TEST (Holdout)", y_test, test_tree_scores, test_df)
]:
    print(f"\n--- {split_name} Split ---")
    for k in (20, 50):
        hr_prec = precision_at_k(df_split["hand_rule_score"], y_split, k)
        tree_prec = precision_at_k(tree_scores, y_split, k)
        print(f"Precision@{k}: Hand Rule = {hr_prec:.3f} | Decision Tree = {tree_prec:.3f}")

print("\n=== Decision Tree splits ===")
print(export_text(clf, feature_names=features))
```

### Evaluation Notes
1. **What changed in the prompt:** Added two critical **constraints** (explicit data leakage checks and client-holdout validation) and removed the fragile Graphviz library dependency.
2. **What actually improved in the output:** The generated code is now fully executable and adheres to robust ML design. It splits the dataset by `client_id` grouping to run client-holdout validation, preventing target leakage. The explicit asset checks guard against the common mistake of passing `trend_pct` into the training features.
3. **What still failed:** The code is completely correct and runs without errors. However, a depth-2 decision tree is a simple model; if we want to model more complex interactions, we would need to tune depth or try different models, though for the goal of text-interpretable tree rules, it is the optimal approach.
4. **What to try next:** This prompt is complete and ready for distribution.

---

## Final Reusable Prompt
Below is the clean, parameterized prompt that any Machine Learning engineering intern can use to train and evaluate interpretable models on search data without further guidance:

```text
Act as a Senior Machine Learning Engineer specializing in SEO and Search Analytics models. 

Write a Python script that loads a CSV file from a specified local path, trains an interpretable depth-2 decision tree classifier to predict page traffic declines, and compares its ranking performance to a hand-written baseline heuristic.

Dataset details:
- CSV Path: "d:\FlyRank\Week-02\Task-01\data\raw\content_refresh_anonymized.csv"
- Target variable: 'is_declining_label' (should be derived from 'trend_direction' == 'down')
- Feature space: 'content_age_days', 'days_since_last_update', 'impressions_90d', 'avg_position', 'ctr', 'word_count'
- Split identifier: 'client_id' (for client-holdout grouping)

Requirements & Constraints:
1. Data Leakage Prevention: Exclude any target-derived indicators from features (e.g. 'trend_pct' or 'trend_direction'). Write an explicit assertion or ValueCheck that halts execution and raises a ValueError if any forbidden features are found in the training list.
2. Client-Holdout Validation: Implement client-holdout validation. Split the unique client IDs ('client_id') 80/20 into train/test groups. Create train and test splits such that a client's pages never exist in both splits simultaneously.
3. Hand Heuristic Formula: Compute a baseline ranking score using the formula: (days_since_last_update >= 180) * (impressions_90d >= 500) * impressions_90d.
4. Evaluation Metric: Compare both the hand rule and the decision tree's predicted probabilities using the Precision@K metric (for K=20 and K=50) to evaluate the top-ranked pages. Implement this in a helper function:
   def precision_at_k(scores, labels, k):
       order = np.argsort(-np.asarray(scores))
       topk = np.asarray(labels)[order[:k]]
       return topk.mean()
5. Interpretability Report: Output the comparison results at K=20 and K=50 for both the TRAIN and TEST splits. Print the text rules of the trained decision tree classifier using scikit-learn's `export_text`. Avoid external plotting libraries like Graphviz to ensure the script runs immediately without system dependency errors.
```
