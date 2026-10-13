from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# --- Auth Schemas ---
class UserRegister(BaseModel):
    name: str = Field(..., min_length=2)
    email: EmailStr
    phone: Optional[str] = None
    password: str = Field(..., min_length=6)
    confirm_password: Optional[str] = None
    education_level: Optional[str] = "10th Standard"
    state: Optional[str] = "Karnataka"
    preferred_language: Optional[str] = "English"
    role: str = Field(default="student")  # 'student', 'parent', 'admin'

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    phone: Optional[str]
    role: str
    education_level: Optional[str]
    state: Optional[str]
    preferred_language: Optional[str]
    student_code: Optional[str] = None

# --- Skill, Interest, Strength Master Schemas ---
class SkillBase(BaseModel):
    id: int
    name: str
    category: str
    description: Optional[str] = None

class InterestBase(BaseModel):
    id: int
    name: str
    category: str
    description: Optional[str] = None

class StrengthBase(BaseModel):
    id: int
    name: str
    category: str
    description: Optional[str] = None

# --- Six Student Inputs Schemas ---
class StudentSkillInput(BaseModel):
    skill_id: int
    proficiency_level: int = Field(..., ge=1, le=5)

class StudentInterestInput(BaseModel):
    interest_id: int
    interest_level: int = Field(..., ge=1, le=5)

class AcademicRecordInput(BaseModel):
    level: str
    board_or_univ: Optional[str] = None
    stream: Optional[str] = None
    marks_percentage: float = Field(..., ge=0, le=100)
    passing_year: Optional[int] = None

class PreferenceInput(BaseModel):
    preferred_work_env: str = "Indoor/Office"
    preferred_industry: str = "Information Technology"
    budget_max: float = 50000.0
    max_course_duration_months: int = 12
    location_type: str = "Flexible"
    expected_salary_min: float = 25000.0
    work_style: str = "Hands-on & Computer"

class ProfileUpdateRequest(BaseModel):
    education_level: Optional[str] = None
    education_status: Optional[str] = None
    background_stream: Optional[str] = None
    career_transition: Optional[str] = None
    stream: Optional[str] = None
    gpa_or_percentage: Optional[float] = None
    school_college: Optional[str] = None
    graduation_year: Optional[int] = None
    skills: Optional[List[StudentSkillInput]] = []
    interests: Optional[List[StudentInterestInput]] = []
    strengths: Optional[List[int]] = []  # list of strength_ids
    academic_records: Optional[List[AcademicRecordInput]] = []
    preferences: Optional[PreferenceInput] = None

class ProfileResponse(BaseModel):
    student_id: int
    student_code: str
    full_name: str
    email: str
    completion_percentage: int
    has_profile: bool
    has_skills: bool
    has_interests: bool
    has_strengths: bool
    has_academics: bool
    has_preferences: bool
    has_aptitude: bool
    education_level: Optional[str]
    education_status: Optional[str] = "12th Standard"
    background_stream: Optional[str] = "Science"
    career_transition: Optional[str] = "I am from an IT background"
    stream: Optional[str]
    gpa_or_percentage: Optional[float]
    school_college: Optional[str]
    graduation_year: Optional[int]
    skills: List[Dict[str, Any]]
    interests: List[Dict[str, Any]]
    strengths: List[Dict[str, Any]]
    academic_records: List[Dict[str, Any]]
    preferences: Optional[Dict[str, Any]]
    aptitude_summary: Optional[Dict[str, Any]]

# --- Aptitude Assessment Schemas ---
class QuestionOut(BaseModel):
    id: int
    category: str
    question_text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str

class AssessmentSubmitRequest(BaseModel):
    answers: Dict[int, str]  # question_id -> 'A', 'B', 'C', 'D'

class AssessmentResultResponse(BaseModel):
    id: int
    logical_score: float
    numerical_score: float
    verbal_score: float
    analytical_score: float
    problem_solving_score: float
    total_score: float
    percentage: float
    completed_at: datetime
    category_breakdown: Dict[str, Dict[str, Any]]

# --- Recommendation & Skill Gap Schemas ---
class SkillGapResponse(BaseModel):
    id: int
    skill_id: int
    skill_name: str
    category: str
    current_level: int
    required_level: int
    gap: int
    priority: str
    learning_recommendation: Optional[str]

class CourseOut(BaseModel):
    id: int
    title: str
    provider: str
    duration_weeks: int
    approximate_cost: float
    eligibility: str
    description: Optional[str]
    mode: str
    certification_type: str
    level: str
    skills_covered: List[str]

class RecommendationItem(BaseModel):
    id: int
    career_id: int
    career_title: str
    category: str
    description: str
    salary_range: str
    job_outlook: str
    overall_score: float
    interest_match: float
    skill_match: float
    academic_match: float
    aptitude_match: float
    strength_match: float
    preference_match: float
    is_eligible: bool
    eligibility_notes: Optional[str]
    reasons: List[str]
    required_skills: List[Dict[str, Any]]
    skill_gaps: List[SkillGapResponse]
    related_courses: List[CourseOut]
    job_roles: List[str]
    is_skill_first: Optional[bool] = False
    learning_roadmap: Optional[List[Dict[str, Any]]] = []
    alternative_pathways: Optional[List[str]] = []
    qualification_guidance: Optional[str] = "Degree and qualification requirements vary by employer and role. Check specific job eligibility before applying."

class CareerDetailResponse(BaseModel):
    id: int
    title: str
    category: str
    description: str
    salary_range: str
    job_outlook: str
    minimum_education: str
    required_stream: str
    job_roles: List[str]
    is_skill_first: Optional[bool] = False
    learning_roadmap: Optional[List[Dict[str, Any]]] = []
    alternative_pathways: Optional[List[str]] = []
    qualification_guidance: Optional[str] = "Degree and qualification requirements vary by employer and role. Check specific job eligibility before applying."
    match_score: Optional[float] = None
    sub_scores: Optional[Dict[str, float]] = None
    is_eligible: Optional[bool] = True
    eligibility_notes: Optional[str] = None
    why_it_matches: Optional[List[str]] = []
    required_skills: List[Dict[str, Any]]
    student_skills: List[Dict[str, Any]]
    skill_gaps: List[SkillGapResponse]
    recommended_courses: List[CourseOut]
    ai_explanation: Optional[str] = None

# --- Career Comparison Schemas ---
class CompareCareersRequest(BaseModel):
    career_ids: List[int]

class CareerComparisonItem(BaseModel):
    id: int
    title: str
    category: str
    description: str
    salary_range: str
    job_outlook: str
    overall_score: float
    interest_match: float
    skill_match: float
    academic_match: float
    aptitude_match: float
    preference_match: float
    education_required: str
    average_course_cost: float
    average_course_duration_weeks: int
    job_roles: List[str]
    required_skills_count: int
    skill_gap_count: int
    skills_summary: List[Dict[str, Any]]
    courses_summary: List[Dict[str, Any]]

# --- Family Decision-Support Schemas ---
class FamilyReportResponse(BaseModel):
    id: int
    report_token: str
    student_id: int
    student_name: str
    student_code: str
    education_level: Optional[str]
    aptitude_summary: Optional[Dict[str, Any]]
    top_recommendations: List[RecommendationItem]
    student_preferred_career: Optional[Dict[str, Any]]
    parent_preferred_career: Optional[Dict[str, Any]]
    final_family_career: Optional[Dict[str, Any]]
    student_notes: Optional[str]
    parent_notes: Optional[str]
    consensus_status: str
    created_at: datetime
    updated_at: datetime

class FamilyPreferenceSubmit(BaseModel):
    career_id: int
    notes: Optional[str] = None
    is_final_family_choice: Optional[bool] = False

class LinkParentStudentRequest(BaseModel):
    student_code: str

# --- Admin Schemas ---
class AdminCareerCreate(BaseModel):
    title: str
    category: str
    description: str
    salary_range: str
    job_outlook: str = "High Demand"
    minimum_education: str = "10th Standard"
    required_stream: str = "Any"
    preferred_interests: List[str] = []
    required_aptitude_profile: Dict[str, float] = {}
    job_roles: List[str] = []
    skill_ids: List[Dict[str, Any]] = []  # [{"skill_id": 1, "required_level": 3, "importance": 1.0}]
    course_ids: List[int] = []
    is_skill_first: Optional[bool] = False
    learning_roadmap: Optional[List[Dict[str, Any]]] = []
    alternative_pathways: Optional[List[str]] = []
    qualification_guidance: Optional[str] = "Degree and qualification requirements vary by employer and role. Check specific job eligibility before applying."

class AdminCourseCreate(BaseModel):
    title: str
    provider: str
    duration_weeks: int
    approximate_cost: float
    eligibility: str
    description: Optional[str]
    mode: str = "Hybrid"
    certification_type: str = "Industry Recognized Certificate"
    level: str = "Beginner"
    skills_covered: List[str] = []
    career_ids: List[int] = []

class AdminQuestionCreate(BaseModel):
    category: str
    question_text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_option: str
    explanation: Optional[str] = None
