# Platform Walkthrough: Skill-First / Non-IT to Tech Career Pathway

The **Skill-First / Non-IT to Tech Career Pathway** feature has been implemented, integrated, and verified across both backend and frontend of the **AI-Enabled Career Counselling & Family Decision-Support Platform for Vocational Education**.

---

## 🌟 What Was Built & Accomplished

### 1. Safety & Ethical Governance (The 3 Core User Corrections)
1. **No Automatic Absolute Job Eligibility Claims**:
   - Degree and qualification requirements vary by employer and role.
   - Every recommendation, career detail, and family report prominently displays:
     > *"Degree and qualification requirements vary by employer and role. Check specific job eligibility before applying."*
2. **Zero Negative Labeling**:
   - The platform never uses negative labels (no *"Rejected"*, *"Low Student"*, or *"Poor Marks"*).
   - The system displays encouraging, constructive phrases: *"Skill-First Pathway"*, *"Skills to Develop"*, *"Your current profile"*, and *"Recommended next steps"*.
3. **Guidance Roadmap, Not a Job Guarantee**:
   - The *Practice Projects → Portfolio → Entry Jobs* sequence is framed strictly as an instructional preparation guide, not an employment guarantee.
   - Transparent final authority disclosure:
     > *"The final career decision remains with the student and family."*

---

## 2. Full-Stack Implementation Details

### A. Backend & Database Enhancements
- **Extended `StudentProfile` ([`models.py`](file:///C:/Users/Preethi%20B%20M/Downloads/Anemia_detection/AI_careerGuidance/backend/app/database/models.py))**:
  - `education_status`: 10th Standard, 12th Standard, Diploma, Degree, Dropout, Other
  - `background_stream`: Computer Science / IT, Science, Commerce, Arts / Humanities, Other
  - `career_transition`: Non-IT to Tech, Career Switch, Self-Taught, Low Marks Skill-First, etc.
- **Extended `Career` ([`models.py`](file:///C:/Users/Preethi%20B%20M/Downloads/Anemia_detection/AI_careerGuidance/backend/app/database/models.py))**:
  - `is_skill_first`: Flagged `True` for 6 entry tech careers: Web Developer, IT Support Specialist, UI/UX Designer, Graphic Designer, Digital Marketing Specialist, Data Analyst.
  - `learning_roadmap`: Structured 4-phase preparation progression (Foundation → Practice Projects → Portfolio Development → Possible Entry Roles).
  - `alternative_pathways`: Practical stepping-stone paths for non-degree or career-changing students.
  - `qualification_guidance`: Transparent employer qualification guidance.
- **Rules & Recommendation Engine ([`rules_engine.py`](file:///C:/Users/Preethi%20B%20M/Downloads/Anemia_detection/AI_careerGuidance/backend/app/ai/rules_engine.py), [`recommendation_engine.py`](file:///C:/Users/Preethi%20B%20M/Downloads/Anemia_detection/AI_careerGuidance/backend/app/ai/recommendation_engine.py))**:
  - For `is_skill_first` careers: non-IT or non-degree students are evaluated via the Skill-First Pathway instead of disqualified.
  - Academic score does not penalize non-matching streams for skill-first tracks.
  - Tech transition affinity boost surfaces skill-first tech careers prominently for non-IT and career-changing candidates.
- **Seeded Metadata ([`seed.py`](file:///C:/Users/Preethi%20B%20M/Downloads/Anemia_detection/AI_careerGuidance/backend/app/database/seed.py))**:
  - Attached 4-stage roadmaps, practice projects, deliverables, and entry roles to Web Developer, IT Support, UI/UX Designer, Graphic Designer, Digital Marketing, and Data Analyst.
  - Attached stepping-stone paths to Software Developer, AI/ML Engineer, Cloud Engineer, and Cybersecurity Analyst.

### B. Frontend Enhancements
- **Profile Page ([`StudentProfilePage.tsx`](file:///C:/Users/Preethi%20B%20M/Downloads/Anemia_detection/AI_careerGuidance/frontend/src/pages/StudentProfilePage.tsx))**:
  - Tab 1 (Academics) contains the new dedicated **"Skill-First / Non-IT to Tech Transition Setup"** card with Education Status, Background Stream, and Career Transition selectors.
- **Recommendations Page ([`RecommendationsPage.tsx`](file:///C:/Users/Preethi%20B%20M/Downloads/Anemia_detection/AI_careerGuidance/frontend/src/pages/RecommendationsPage.tsx))**:
  - Added `⚡ Skill-First Tech Careers` quick filter toggle.
  - Added `⚡ Skill-First` badges on cards and replaced negative badges with `Skills to Develop`.
  - Added prominent **Skill-First Guidance & Employer Eligibility Notice** banner.
- **Career Details Page ([`CareerDetailPage.tsx`](file:///C:/Users/Preethi%20B%20M/Downloads/Anemia_detection/AI_careerGuidance/frontend/src/pages/CareerDetailPage.tsx))**:
  - Rendered interactive 4-phase preparation roadmap:
    1. *Phase 1: Foundation & Core Skills* (Targeted tools and timeline)
    2. *Phase 2: Practice Projects* (Specific real-world apps to build)
    3. *Phase 3: Portfolio Development* (GitHub repositories, live URLs, case studies)
    4. *Phase 4: Possible Entry Roles* (Entry-level titles, freelance, boutique agencies)
  - Rendered Alternative Stepping-Stone Pathways and Employer Qualification Notice.
- **Family Decision Report ([`FamilyReportPage.tsx`](file:///C:/Users/Preethi%20B%20M/Downloads/Anemia_detection/AI_careerGuidance/frontend/src/pages/FamilyReportPage.tsx))**:
  - Added dedicated **"Non-IT to Tech Career Pathway Guide for Families"** matrix breaking down the 4 stages, budget expectations, and the reminder that the final decision remains with the student and family.

---

## 🧪 Verification & Validation Results

### 1. Automated Pytest Suite
Ran `python -m pytest backend/tests/test_platform.py -v`:
- **11/11 tests passed in 4.13s**, including `test_skill_first_non_it_transition_pathway`.

### 2. Frontend Production Build
Ran `npm run build` in `frontend/`:
- **0 TypeScript errors, 0 bundling errors.**

### 3. Live Server Status
- **Backend API**: Running on `http://localhost:8000` (and `http://10.100.54.179:8000/api`) with status `healthy`.
- **Frontend App**: Running on `http://localhost:5173` (and `http://10.100.54.179:5173`).
