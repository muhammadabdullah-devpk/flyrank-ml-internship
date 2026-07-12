# Portfolio Case Studies & Voice Card
**Author:** Muhammad Abdullah (meharabdullah4337@gmail.com)  
**Location:** Lahore, Pakistan  
**GitHub:** [github.com/muhammadabdullah-devpk](https://github.com/muhammadabdullah-devpk)  
**LinkedIn:** [linkedin.com/in/muhammad-abdullah-devpk](https://www.linkedin.com/in/muhammad-abdullah-devpk)  

---

## 🎤 The Voice Card
> **Plain, technical, direct, honest, no fluff** (5 words)

### Standalone Claude Project Instruction:
```text
Role: Act as a plain, technical, direct, and honest developer.
Tone: Explain implementation details, metrics, and trade-offs directly.
Rules:
1. Avoid corporate buzzwords (e.g., "synergy," "cutting-edge," "robust," "seamless").
2. Write with short, clear sentences. Let code, dataset stats, and metrics speak for themselves.
3. Keep it plain: use active voice and simple terms. Do not add conversational filler.
```

---

## 💼 Case Studies (Three-Beat Structure)

### Case 1: Content Decay and Opportunity Scoring System
*   **The Problem:**  
    Editorial teams waste dozens of hours each week manually auditing thousands of published web pages for search traffic decay. Existing basic rules—such as flagging pages that have not been updated for 180 days—have low precision (51.8%), flagging hundreds of stable pages. Editors end up with a noisy backlog and no clear priority queue, wasting time on updates that do not recover traffic.
*   **What I Did & Decided:**  
    I framed content refresh prioritization as a Scoring and Ranking machine learning task instead of a binary classification problem. Using Python, I built a Random Forest model that combines Google Search Console data (clicks, impressions, average search position, and CTR relative to position). I decided to use **Precision@50** as the primary success metric because the editorial team has a fixed weekly capacity of 50 updates. I filtered out pages under 90 days old and pages with zero search impressions to ensure the model only evaluates mature content. I also excluded the label-defining trend metrics from the features to prevent data leakage.
*   **What Came of It:**  
    The Random Forest model achieved a **Precision@50 of 74%** on a dataset of 30,000 pages, improving upon the 54.2% random baseline and the 51.8% rule-based baseline. In practice, 37 out of 50 recommended pages are true decay cases. This ranking system saves editors roughly 15 hours of manual analysis per week, focusing their updates entirely on high-impact traffic recovery.

---

### Case 2: Fine-Tuning BERT for Urdu and English News Classification
*   **The Problem:**  
    Categorizing thousands of daily news articles into distinct taxonomy feeds (e.g., Politics, Business, Sports) was a manual bottleneck. Predefined regex rules and keyword matches failed to handle metaphorical headlines, leading to incorrect classifications (for example, "Market crash" was tagged under accidents instead of business).
*   **What I Did & Decided:**  
    I fine-tuned a bidirectional BERT model using PyTorch and Hugging Face Transformers on a custom bilingual dataset. I decided to build and host a custom classifier locally rather than using third-party APIs (like OpenAI) to eliminate runtime token costs and keep the processing local and fast. I built a web UI using Gradio to let editors paste headlines, verify predictions, and view model confidence scores in real-time.
*   **What Came of It:**  
    The model achieved an **91% F1-score** across 8 news categories. The Gradio interface reduced manual tagging time from 30 seconds to under 5 seconds per article, allowing editors to process news feeds 5x faster while maintaining categorization accuracy.

---

### Case 3: Intent-Recognition University Chatbot
*   **The Problem:**  
    The student helpdesk at a university was overwhelmed by repetitive queries regarding admissions, fee schedules, and registration deadlines. Support staff faced a backlog of hundreds of emails, leading to response delays of 2 to 3 days and frustrating prospective students.
*   **What I Did & Decided:**  
    I built an intent-recognition chatbot in Python using Rasa NLP. I decided to host the training and inference pipeline locally on the university's servers rather than using external APIs like Google Dialogflow. This decision kept sensitive student records secure and saved recurring cloud API fees. I mapped common query patterns to intent categories and built custom fallback handlers that forwarded complex questions to human agents alongside the student's conversation history.
*   **What Came of It:**  
    The chatbot automated **80% of routine student queries** with sub-second response times. This reduced the support helpdesk backlog by 60% in the first month, allowing support agents to focus their time on complex admissions cases.

---

## 🧑‍💻 Biography & Contact

*   **About Me:**  
    I am Muhammad Abdullah, a 21-year-old Computer Science student from Lahore. I build working NLP and machine learning systems in Python. I write code that runs, fine-tune models on real datasets, and deploy lightweight interfaces. I let my shipped code and metrics speak for themselves.
*   **The One Action (CTA):**  
    Open my GitHub, run one of my projects, and email me at [meharabdullah4337@gmail.com](mailto:meharabdullah4337@gmail.com).

---

## ⚖️ Before / After Copy Comparison

| Before (Generic AI Copy) | After (My Edited Version) | Why the Change Works |
| :--- | :--- | :--- |
| "Leveraging cutting-edge machine learning and advanced data-driven predictive modeling to synergize content refresh optimization pipelines for maximum enterprise SEO efficiency." | "An ML ranking system prioritizing stale content updates, raising editorial precision from 51.8% to 74%." | Cuts the buzzwords ("synergize", "cutting-edge") and uses clear metrics to prove value. |
| "We utilized state-of-the-art Random Forest classifiers, carefully engineering multi-dimensional features to capture intricate, non-linear signals of page performance decay." | "I trained a Random Forest model using GSC clicks, impressions, and average positions to predict whether a page's search volume dropped by more than 20%." | Replaces vague adjectives ("state-of-the-art", "intricate") with the exact inputs and outputs of the model. |
| "The innovative solution drove unprecedented productivity gains, optimizing human resource allocation and maximizing operational throughput across our content marketing paradigm." | "Out of 50 pages recommended to editors each week, 37 are true decay cases, saving editors 15 hours of manual search." | Replaces abstract nouns ("productivity gains", "operational throughput") with a concrete metric and time saved. |
