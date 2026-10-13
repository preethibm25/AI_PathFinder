# Implementation Plan: Skill-First / Non-IT to Tech Career Pathway

Enhance the existing **AI-Enabled Career Counselling & Family Decision-Support Platform for Vocational Education** with a dedicated **Skill-First / Non-IT to Tech Career Pathway**. This empowers students with non-IT backgrounds, low academic marks, dropouts, or non-degree statuses to discover realistic entry paths into technical careers while preserving all existing functionality, tests, and security guarantees.

---

## User Review & Ethical Guidelines

> [!IMPORTANT]
> **Safety, Realism & Non-Discrimination Philosophy:**
> 1. **No Automatic Absolute Job Eligibility Claims**:
>    - Degree and qualification requirements vary by employer and role.
>    - Every recommendation displays:
>      > *"Degree and qualification requirements vary by employer and role. Check specific job eligibility before applying."*
> 2. **Constructive & Positive Language (Zero Negative Labeling)**:
>    - The platform **never uses negative labels** (such as *"Low Student"*, *"Poor Student"*, or *"Rejected"*).
>    - Instead, it uses constructive phrases: *"Your current profile"*, *"Skills to develop"*, *"Recommended pathway"*, and *"Next steps"*.
> 3. **Guidance Roadmap, Not a Job Guarantee**:
>    - The *Practice Projects → Portfolio → Entry Jobs* sequence is framed strictly as a preparation pathway and learning roadmap, not a job guarantee.
>    - Final decision transparency:
>      > *"The final career decision remains with the student and family."*

---

## Architecture & Data Flow

```
Student Profile
  (Education Status: 10th/12th/Diploma/Degree/Dropout)
  (Stream: CS/IT, Science, Commerce, Arts, Other)
  (Transition Mode: Non-IT to Tech, Career Switch, Self-Taught)
       │
       ▼
Six-Input Weighted Scoring & Rules Engine
  (Interests 30% + Skills 20% + Academics 15% + Aptitude 15% + Strengths 10% + Preferences 10%)
       │
       ▼
Skill-First Pathway Detection
       │
       ├──► Current Skills vs Required Skills
       ├──► Skill Gap Analysis
       ├──► Recommended Vocational Courses
       ├──► Practice Projects Roadmap
       ├──► Portfolio & GitHub Development
       └──► Possible Entry Roles & Stepping-Stone Pathways
```

---

## Detailed Implementation Components

### 1. Database & Schema Layer
- **`StudentProfile` Model**:
  - `education_status`: String (10th, 12th, Diploma, Degree, Dropout, Other)
  - `background_stream`: String (Computer Science / IT, Science, Commerce, Arts, Other)
  - `career_transition`: String ("I am from an IT background", "I am from a non-IT background but interested in IT", "I want to change my career", "I am self-taught")
- **`Career` Model**:
  - `is_skill_first`: Boolean (True for Web Developer, IT Support, UI/UX, Graphic Design, Digital Marketing, Data Analyst)
  - `learning_roadmap`: JSON (Structured stages: Foundation Skills → Practice Projects → Portfolio Development → Possible Entry Roles)
  - `alternative_pathways`: JSON (Stepping-stone routes for non-degree candidates)
  - `qualification_guidance`: Text (Transparent employer qualification notices)

### 2. Rule & Scoring Engine
- For `is_skill_first` careers:
  - Do not disqualify students based on non-IT stream or non-degree status.
  - Academic score focuses on foundational readiness rather than penalizing stream differences.
  - Boost compatibility when student indicates interest in tech transition so skill-first options rank at the top.
  - Constructive notes: *"Skill-First Pathway: You can enter through portfolio projects, practical skills, and certifications."*

### 3. Frontend Pages
- **Student Profile**: Education Status, Stream, and Career Transition options in Academics tab with an encouraging guidance banner.
- **Recommendations Page**: Filter by `⚡ Skill-First Tech Careers`, badges for `⚡ Skill-First Pathway` and `Non-IT → Tech Bridge`, plus clear employer eligibility disclaimer.
- **Career Details Page**: Visual step-by-step roadmap (`Foundation` → `Practice Projects` → `Portfolio` → `Possible Entry Roles`), alternative stepping stones, and qualification guidance.
- **Family Decision Report**: Dedicated "Skill-First Career Pathway" section explaining portfolio entry routes, course costs, and timeline to parents.

---

## Verification Plan
1. **Automated Tests**: Pytest suite in `backend/tests/test_platform.py` validating skill-first recommendation calculation and non-IT transition handling.
2. **Build Validation**: TypeScript compile and Vite build verification in `frontend/`.
3. **End-to-End Testing**: Profile update, recommendation generation, career detail viewing, and family report inspection.
