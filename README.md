# AI-Enabled Career Counselling & Family Decision-Support Platform for Vocational Education

An enterprise-grade, full-stack web application designed to guide students and families through vocational and technical career discovery, cognitive aptitude diagnostics, transparent AI matching, skill-gap analysis, course roadmaps, side-by-side career comparison, and family consensus decision-making.

---

## 🚀 Key Features

1. **6-Input Student Profile**: Captures Vocational Interests, Current Skills (1-5 proficiency), Academic Performance, Strengths, Practical Preferences, and Aptitude Diagnostics.
2. **30-Question Aptitude Assessment**: Multi-choice diagnostic across 5 categories (Logical Reasoning, Numerical Ability, Verbal Ability, Analytical Thinking, Problem Solving) with category-wise breakdown scores.
3. **Transparent Weighted Recommendation Engine**: Computes exact percentage compatibility based on configurable weights:
   - Interest Match: **30%**
   - Skill Match: **20%**
   - Academic Match: **15%**
   - Aptitude Match: **15%**
   - Strength Match: **10%**
   - Preference Match: **10%**
4. **Rule-Based Eligibility Engine**: Evaluates educational prerequisites (10th, 12th, ITI, Diploma), stream alignment, and minimum marks before recommending careers.
5. **Skill-Gap Diagnostic**: Pinpoints missing competencies with visual levels (Current vs Target), priority tags (High, Medium, Low), and actionable learning recommendations.
6. **Vocational Course Registry**: Connects careers with practical certifications (NSDC, ITI, Polytechnic, DGCA) with verified duration and fee disclosures.
7. **Multi-Career Side-by-Side Comparison**: Compare up to 4 careers across match scores, training duration, average costs, and job roles.
8. **Shared Family Decision-Support Report**: Facilitates student-parent collaboration, parent commentary, and shared family consensus tracking. AI recommends and explains; the family decides.
9. **Role-Based Portals**:
   - **Student Portal**: 13 dedicated pages from profile collection to aptitude testing and recommendations.
   - **Parent Portal**: Secure code-based linking (`STU-XXXXX`), read-only diagnostic view, and career preference voting.
   - **Admin Portal**: Platform metrics, student roster, and full CRUD for careers, courses, and questions.

---

## 🛠 Technology Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, React Router v6, Axios, Recharts, Lucide React
- **Backend**: Python 3.12, FastAPI, SQLAlchemy 2.0, Pydantic v2, JWT Authentication (`python-jose`), Password Hashing (`passlib`, `bcrypt`)
- **Database**:
  - **Development Fallback**: SQLite (`sqlite:///./career_guidance.db`) for instant zero-dependency local execution
  - **Production**: PostgreSQL (`postgresql://...`) via `docker-compose.yml`
- **AI / ML**:
  - Transparent Weighted Scoring Engine with configurable weights
  - Rule-Based Eligibility Engine
  - Pluggable ML Model Architecture (scikit-learn feature vectors)
  - LLM Explanation Layer with deterministic template fallback and optional OpenAI / Gemini integration

---

## ⚡ Quick Start Instructions

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v24.13)
- **Python**: 3.10+ (tested on Python 3.12)

---

### 2. Backend Setup & Run

1. Open a terminal in the project root:
   ```bash
   cd backend
   ```

2. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the FastAPI development server:
   ```bash
   python main.py
   # OR using uvicorn directly:
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
   *Note: On first startup, the application will automatically create database tables and seed 22 vocational careers, 30+ categorized aptitude questions, courses, skills, and demo accounts.*

- **Backend API URL**: `http://localhost:8000`
- **Interactive Swagger Documentation**: `http://localhost:8000/docs`

---

### 3. Frontend Setup & Run

1. Open a separate terminal in the project root:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the Vite development server:
   ```bash
   npm run dev
   ```

- **Frontend URL**: `http://localhost:5173`

---

## 👤 Development Demo Accounts

Use these pre-configured credentials to immediately explore all roles:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Student** | `student@example.com` | `student123` | Aarav Sharma (Code: `STU-88219`, 12th Standard, Profile pre-populated) |
| **Parent** | `parent@example.com` | `parent123` | Rajesh Sharma (Pre-linked to Aarav's Family Report) |
| **Admin** | `admin@example.com` | `admin123` | Platform Administrator (Full taxonomy & analytics access) |

*Tip: The Login page also features **1-Click Demo Fill** buttons for instant testing.*

---

## 🧪 Automated Testing

Run the automated backend test suite using `pytest`:

```bash
python -m pytest backend/tests/test_platform.py -v
```

This validates:
- User registration and JWT authentication
- Student profile options and 6-input persistence
- 30-question aptitude scoring and category calculations
- 6-input transparent weighted recommendation engine
- Multi-career side-by-side comparison
- Parent-student linkage and family decision consensus
- Admin portal route authorization and security

To test the frontend TypeScript build:
```bash
cd frontend
npm run build
```

---

## 🐳 Docker Deployment (PostgreSQL + Backend + Frontend)

To run the full stack containerized with PostgreSQL:

```bash
docker-compose up --build
```

Services:
- **PostgreSQL Database**: `localhost:5432`
- **FastAPI Backend**: `localhost:8000`
- **React Frontend**: `localhost:5173`

---

## 📂 Project Directory Structure

```
ai-career-counselling/
├── backend/
│   ├── app/
│   │   ├── ai/                      # AI & Recommendation core
│   │   │   ├── feature_engineering.py
│   │   │   ├── llm_provider.py
│   │   │   ├── recommendation_engine.py
│   │   │   └── rules_engine.py
│   │   ├── api/                     # REST API routers
│   │   │   ├── admin.py
│   │   │   ├── assessment.py
│   │   │   ├── auth.py
│   │   │   ├── careers.py
│   │   │   ├── courses.py
│   │   │   ├── family.py
│   │   │   ├── profile.py
│   │   │   ├── recommendations.py
│   │   │   ├── reports.py
│   │   │   └── skills.py
│   │   ├── auth/                    # JWT & security
│   │   ├── database/                # SQLAlchemy models & seed data
│   │   │   ├── connection.py
│   │   │   ├── models.py
│   │   │   └── seed.py
│   │   ├── schemas/                 # Pydantic validation schemas
│   │   └── config.py                # Configurable recommendation weights
│   ├── tests/
│   │   └── test_platform.py         # Comprehensive test suite
│   ├── main.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/              # Navbar, Footer, ProtectedRoute
│   │   ├── context/                 # AuthContext
│   │   ├── pages/                   # 15 Complete Pages/Views
│   │   ├── services/                # Axios API bindings
│   │   ├── types/                   # TypeScript interfaces
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── Dockerfile
├── database/
│   └── seed_data.py                 # Standalone seed runner
├── docs/
│   ├── api_documentation.md
│   └── architecture.md
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 📜 End-to-End Demo Workflow

1. **Landing Page (`/`)**: Explore the 6-input methodology, vocational roadmap, and family consensus overview.
2. **Sign In (`/login`)**: Use the 1-Click "Student" demo button.
3. **Student Dashboard (`/student/dashboard`)**: View 6-input completion progress, aptitude results radar chart, top career matches, and family report status.
4. **6 Profile Inputs (`/student/profile`)**: Adjust vocational interests (1-5 sliders), skills proficiency, academics, and practical family preferences.
5. **Aptitude Diagnostic (`/student/assessment`)**: Review 30 questions across Logical, Numerical, Verbal, Analytical, and Problem Solving categories, submit, and view immediate breakdown.
6. **Processing Stage Engine (`/student/analyse`)**: Watch the 8 real processing stages synthesize your profile into career recommendations.
7. **Ranked Career Matches (`/student/recommendations`)**: Browse 22 vocational occupations with match percentages, supporting rationale, and prerequisite checks.
8. **Career Deep Dive (`/student/career/:id`)**: Inspect skill gaps, view recommended training courses with fee disclosures, and read the AI counselling explanation.
9. **Skill Gap Diagnostics (`/student/skill-gap`)**: Compare your current level against target industry benchmarks with actionable learning paths.
10. **Vocational Courses (`/student/courses`)**: Browse NSDC, ITI, and Polytechnic accredited training programs with duration and cost filters.
11. **Career Comparison (`/student/compare`)**: Select 2 to 4 careers side-by-side to compare fees, timelines, and aptitude alignment.
12. **Family Decision Report (`/family/report`)**: Collaborative consensus view for students and parents.
13. **Parent Portal (`/parent/dashboard`)**: Log in as `parent@example.com`, inspect child's aptitude diagnostic and recommendations, review fees, and vote on family career preferences.
14. **Admin Portal (`/admin`)**: Log in as `admin@example.com`, inspect student rosters, view top recommended career analytics, and manage career/course/question taxonomies.
#   A I _ P a t h F i n d e r  
 