# API Documentation — PathFinder AI Platform

Base URL: `http://localhost:8000/api`

---

## 1. Authentication (`/api/auth`)

### Register
- **URL**: `POST /api/auth/register`
- **Body**:
  ```json
  {
    "name": "Aarav Sharma",
    "email": "student@example.com",
    "password": "student123",
    "confirm_password": "student123",
    "phone": "9876543210",
    "education_level": "12th Standard",
    "state": "Karnataka",
    "preferred_language": "English",
    "role": "student"
  }
  ```
- **Response**: JWT access token and user metadata including unique `student_code`.

### Login
- **URL**: `POST /api/auth/login`
- **Body**:
  ```json
  {
    "email": "student@example.com",
    "password": "student123"
  }
  ```
- **Response**: JWT token and user profile.

### Current User
- **URL**: `GET /api/auth/me`
- **Header**: `Authorization: Bearer <TOKEN>`

---

## 2. Six-Input Student Profile (`/api/profile`)

### Get Master Options
- **URL**: `GET /api/profile/options`
- Returns taxonomies for skills, interests, strengths, qualification levels, and stream options.

### Get Profile & 6 Inputs
- **URL**: `GET /api/profile`
- **Header**: `Authorization: Bearer <STUDENT_TOKEN>`
- Returns completion percentage, skills with proficiency (1-5), rated interests (1-5), strengths, academic history, preferences, and aptitude summary.

### Update Profile & 6 Inputs
- **URL**: `PUT /api/profile`
- **Header**: `Authorization: Bearer <STUDENT_TOKEN>`
- **Body**:
  ```json
  {
    "education_level": "12th Standard",
    "stream": "Science / Vocational IT",
    "gpa_or_percentage": 78.5,
    "school_college": "Govt PU College, Bengaluru",
    "graduation_year": 2025,
    "skills": [
      { "skill_id": 1, "proficiency_level": 3 }
    ],
    "interests": [
      { "interest_id": 1, "interest_level": 5 }
    ],
    "strengths": [1, 2],
    "preferences": {
      "preferred_work_env": "Indoor/Office",
      "preferred_industry": "Information Technology",
      "budget_max": 40000,
      "max_course_duration_months": 12,
      "location_type": "Local / Hybrid",
      "expected_salary_min": 25000,
      "work_style": "Hands-on & Computer"
    }
  }
  ```

---

## 3. Aptitude Assessment (`/api/assessment`)

### Get 30 Diagnostic Questions
- **URL**: `GET /api/assessment/questions`
- Returns questions across Logical Reasoning, Numerical Ability, Verbal Ability, Analytical Thinking, and Problem Solving with options A, B, C, D (excluding correct option).

### Submit Assessment
- **URL**: `POST /api/assessment/submit`
- **Body**:
  ```json
  {
    "answers": {
      "1": "C",
      "2": "B",
      "3": "B"
    }
  }
  ```
- **Response**: Immediate percentage score and category breakdown:
  - Logical Reasoning %
  - Numerical Ability %
  - Verbal Ability %
  - Analytical Thinking %
  - Problem Solving %
  - Total score and timestamp

### Get Latest Result
- **URL**: `GET /api/assessment/result`

---

## 4. Recommendations & Career Matching (`/api/recommendations`)

### Generate Recommendations
- **URL**: `POST /api/recommendations/generate`
- Executes transparent weighted scoring across 22 vocational careers:
  - `Interest (30%) + Skill (20%) + Academic (15%) + Aptitude (15%) + Strength (10%) + Preference (10%)`
- Runs rule-based eligibility checks and generates skill gaps.
- Returns ranked career matches sorted by overall score descending.

### Get Recommendations
- **URL**: `GET /api/recommendations`

### Get Single Career Deep-Dive
- **URL**: `GET /api/careers/{id}`
- Returns match score, sub-scores, required vs student skills, skill gap items, recommended courses, job roles, and LLM structured explanation.

---

## 5. Career Comparison (`/api/careers/compare`)
- **URL**: `POST /api/careers/compare`
- **Body**:
  ```json
  {
    "career_ids": [1, 2, 4]
  }
  ```
- Returns side-by-side matrix of match scores, prerequisite education, course duration, average costs, and skill gap counts.

---

## 6. Family Decision Support (`/api/family`)

### Get Student Link Code
- **URL**: `POST /api/family/invite`
- Returns student code (e.g. `STU-88219`) to share with parents.

### Link Parent to Student
- **URL**: `POST /api/family/link`
- **Header**: `Authorization: Bearer <PARENT_TOKEN>`
- **Body**:
  ```json
  {
    "student_code": "STU-88219"
  }
  ```

### Get Shared Family Report
- **URL**: `GET /api/family/report`
- Accessible by linked students and parents. Parents can review top career options, skill gaps, and course fees without modifying student testing data.

### Record Family Preference
- **URL**: `POST /api/family/preference`
- **Body**:
  ```json
  {
    "career_id": 1,
    "notes": "Course duration is 16 weeks and budget fits our family savings.",
    "is_final_family_choice": false
  }
  ```
- Evaluates consensus:
  - `discussing`: choices differ
  - `aligned`: student and parent choose the same career
  - `finalized`: locked as final family commitment

---

## 7. Administrator Portal (`/api/admin`)
Requires `admin` role token.
- `GET /api/admin/stats`: KPI metrics and top recommended careers
- `GET /api/admin/students`: Student roster with assessment scores and top match
- `POST /api/admin/careers`: Add new vocational career
- `PUT /api/admin/careers/{id}`: Edit career
- `DELETE /api/admin/careers/{id}`: Remove career
- `POST /api/admin/courses`: Add course
- `DELETE /api/admin/courses/{id}`: Delete course
- `POST /api/admin/questions`: Add aptitude question
