# Platform Architecture — PathFinder AI

## 1. System Overview

PathFinder AI is an end-to-end full-stack career guidance and family decision-support web platform designed for vocational and technical education.

```
+-----------------------------------------------------------------------------------------+
|                                    React 18 + Vite Frontend                             |
|  - 13 Student Pages   - Parent Decision Dashboard   - Admin Management Portal           |
|  - Recharts Visualizations (Radar / Bar)   - Lucide Icons   - Tailwind Modern UI        |
+-----------------------------------------------------------------------------------------+
                                           │
                                     REST APIs / JWT
                                           │
+-----------------------------------------------------------------------------------------+
|                                  FastAPI Backend Layer                                  |
|  - Auth & Security (JWT, bcrypt)        - Profile Manager (6 Student Dimensions)        |
|  - Aptitude Diagnostic Engine           - Recommendation Engine (Configurable Weights)  |
|  - Rule-Based Eligibility Engine        - Skill-Gap Diagnostic Module                   |
|  - Family Decision-Support Hub          - Admin Taxonomy Management                     |
+-----------------------------------------------------------------------------------------+
                                           │
                    ┌──────────────────────┴──────────────────────┐
                    ▼                                             ▼
+---------------------------------------+     +---------------------------------------+
|        AI & Recommendation Layer      |     |             Database Layer            |
|  - Weighted Recommendation Engine     |     |  - PostgreSQL (Production / Docker)   |
|  - Rule-Based Eligibility Validator   |     |  - SQLite (Local Zero-Config Dev)     |
|  - Feature Pipeline (scikit-learn)    |     |  - SQLAlchemy 2.0 ORM                 |
|  - Pluggable ML Model Interface       |     |  - 22 Relational Database Entities    |
|  - LLM Explanation Provider           |     |  - Realistic Seed Taxonomies          |
+---------------------------------------+     +---------------------------------------+
```

---

## 2. Six-Input Mathematical Formulation

The recommendation score is calculated dynamically without hardcoding:

$$\text{Career Score} = (I \times w_I) + (S \times w_S) + (A_{cad} \times w_{Acad}) + (A_{pt} \times w_{Apt}) + (St \times w_{St}) + (P \times w_P)$$

Configurable in `backend/app/config.py`:
- **Vocational Interest ($w_I$)**: $30\%$ ($0.30$)
- **Acquired Skills ($w_S$)**: $20\%$ ($0.20$)
- **Academic Foundation ($w_{Acad}$)**: $15\%$ ($0.15$)
- **Cognitive Aptitude ($w_{Apt}$)**: $15\%$ ($0.15$)
- **Core Strengths ($w_{St}$)**: $10\%$ ($0.10$)
- **Practical Preferences ($w_P$)**: $10\%$ ($0.10$)

Normalized strictly between $0$ and $100\%$.

---

## 3. Pluggable Machine Learning Architecture

The recommendation engine adheres to an abstract interface:

```python
class RecommendationEngineBase(ABC):
    @abstractmethod
    def evaluate_career(self, student: Student, career: Career) -> Dict[str, Any]:
        pass
```

- **Active Engine**: `WeightedRecommendationEngine` (interpretable, mathematically verifiable, transparent).
- **Extensible Engine**: `MLRecommendationEngineStub` (transforms inputs into numerical scikit-learn feature vectors, allowing a trained model artifact to be loaded without altering frontend or API contracts).

---

## 4. LLM Explanation Provider Abstraction

The LLM is strictly separated from the scoring logic:
1. The scoring engine calculates the exact percentage, sub-scores, and skill gaps.
2. The LLM provider formats human-readable, transparent summaries explaining *why* the student matches.
3. Fallback: `TemplateExplanationProvider` produces detailed multi-paragraph rationale without requiring external API keys.

---

## 5. Family Decision Support Model

- **Student-Parent Linking**: Secure code-based relationship (`STU-XXXXX`) ensures parents can only view linked children.
- **Data Protection**: Parents have read-only access to screening results; they cannot alter aptitude questions or student answers.
- **Collaborative Consensus**:
  - Student selects a preferred career.
  - Parent selects a preferred career.
  - System checks alignment:
    - If identical: Status is marked `aligned`.
    - If different: Status is marked `discussing`.
    - When locked: Status is marked `finalized`.
- **Philosophical Principle**: AI guides and recommends; the student and family make the final decision.
