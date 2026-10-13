import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, Text, ForeignKey, DateTime, JSON
)
from sqlalchemy.orm import relationship
from app.database.connection import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    role = Column(String(50), default="student", nullable=False)  # student, parent, admin
    education_level = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    preferred_language = Column(String(50), default="English")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # 1-to-1 relationships
    student_profile = relationship("Student", back_populates="user", uselist=False, cascade="all, delete-orphan")
    parent_profile = relationship("Parent", back_populates="user", uselist=False, cascade="all, delete-orphan")

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    student_code = Column(String(32), unique=True, index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="student_profile")
    profile = relationship("StudentProfile", back_populates="student", uselist=False, cascade="all, delete-orphan")
    skills = relationship("StudentSkill", back_populates="student", cascade="all, delete-orphan")
    interests = relationship("StudentInterest", back_populates="student", cascade="all, delete-orphan")
    academic_records = relationship("AcademicRecord", back_populates="student", cascade="all, delete-orphan")
    strengths = relationship("StudentStrength", back_populates="student", cascade="all, delete-orphan")
    preferences = relationship("Preference", back_populates="student", uselist=False, cascade="all, delete-orphan")
    aptitude_results = relationship("AptitudeResult", back_populates="student", cascade="all, delete-orphan")
    recommendations = relationship("Recommendation", back_populates="student", cascade="all, delete-orphan")
    family_report = relationship("FamilyReport", back_populates="student", uselist=False, cascade="all, delete-orphan")
    parent_links = relationship("ParentStudentLink", back_populates="student", cascade="all, delete-orphan")

class Parent(Base):
    __tablename__ = "parents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="parent_profile")
    student_links = relationship("ParentStudentLink", back_populates="parent", cascade="all, delete-orphan")

class ParentStudentLink(Base):
    __tablename__ = "parent_student_links"

    id = Column(Integer, primary_key=True, index=True)
    parent_id = Column(Integer, ForeignKey("parents.id", ondelete="CASCADE"), nullable=False)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    status = Column(String(50), default="active")  # pending, active
    invite_code = Column(String(32), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    parent = relationship("Parent", back_populates="student_links")
    student = relationship("Student", back_populates="parent_links")

class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), unique=True, nullable=False)
    education_level = Column(String(100), nullable=True)
    education_status = Column(String(50), default="12th Standard")  # 10th, 12th, Diploma, Degree, Dropout, Other
    background_stream = Column(String(100), default="Science")      # CS / IT, Science, Commerce, Arts, Other
    career_transition = Column(String(150), default="I am from an IT background")  # Non-IT -> IT, Career Change, Self-taught
    stream = Column(String(100), nullable=True)
    gpa_or_percentage = Column(Float, nullable=True)
    school_college = Column(String(255), nullable=True)
    graduation_year = Column(Integer, nullable=True)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    student = relationship("Student", back_populates="profile")

class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    category = Column(String(100), nullable=False)  # Technical, Analytical, Creative, Practical, Soft Skill
    description = Column(Text, nullable=True)

class StudentSkill(Base):
    __tablename__ = "student_skills"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id", ondelete="CASCADE"), nullable=False)
    proficiency_level = Column(Integer, default=1)  # 1: Beginner, 2: Elementary, 3: Intermediate, 4: Advanced, 5: Expert

    student = relationship("Student", back_populates="skills")
    skill = relationship("Skill")

class Interest(Base):
    __tablename__ = "interests"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    category = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)

class StudentInterest(Base):
    __tablename__ = "student_interests"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    interest_id = Column(Integer, ForeignKey("interests.id", ondelete="CASCADE"), nullable=False)
    interest_level = Column(Integer, default=3)  # 1 to 5 scale

    student = relationship("Student", back_populates="interests")
    interest = relationship("Interest")

class AcademicRecord(Base):
    __tablename__ = "academic_records"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    level = Column(String(100), nullable=False)  # 10th Standard, 12th Standard, ITI, Polytechnic Diploma, Bachelor's
    board_or_univ = Column(String(255), nullable=True)
    stream = Column(String(100), nullable=True)  # Science, Commerce, Arts, Vocational/Technical
    marks_percentage = Column(Float, nullable=False)
    passing_year = Column(Integer, nullable=True)

    student = relationship("Student", back_populates="academic_records")

class Strength(Base):
    __tablename__ = "strengths"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    category = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)

class StudentStrength(Base):
    __tablename__ = "student_strengths"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    strength_id = Column(Integer, ForeignKey("strengths.id", ondelete="CASCADE"), nullable=False)

    student = relationship("Student", back_populates="strengths")
    strength = relationship("Strength")

class Preference(Base):
    __tablename__ = "preferences"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), unique=True, nullable=False)
    preferred_work_env = Column(String(100), default="Indoor/Office")  # Indoor/Office, Outdoor/Field, Workshop/Lab, Remote
    preferred_industry = Column(String(100), default="Information Technology")
    budget_max = Column(Float, default=50000.0)  # Max course budget in INR
    max_course_duration_months = Column(Integer, default=12)
    location_type = Column(String(100), default="Flexible")  # Local, Metro, Remote, Relocatable
    expected_salary_min = Column(Float, default=25000.0)  # Monthly expectation
    work_style = Column(String(100), default="Hands-on & Computer")  # Hands-on, Computer-based, Collaborative

    student = relationship("Student", back_populates="preferences")

class AptitudeQuestion(Base):
    __tablename__ = "aptitude_questions"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String(100), nullable=False, index=True)  # Logical Reasoning, Numerical Ability, Verbal Ability, Analytical Thinking, Problem Solving
    question_text = Column(Text, nullable=False)
    option_a = Column(String(255), nullable=False)
    option_b = Column(String(255), nullable=False)
    option_c = Column(String(255), nullable=False)
    option_d = Column(String(255), nullable=False)
    correct_option = Column(String(10), nullable=False)  # 'A', 'B', 'C', 'D'
    explanation = Column(Text, nullable=True)

class AptitudeResult(Base):
    __tablename__ = "aptitude_results"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    logical_score = Column(Float, default=0.0)
    numerical_score = Column(Float, default=0.0)
    verbal_score = Column(Float, default=0.0)
    analytical_score = Column(Float, default=0.0)
    problem_solving_score = Column(Float, default=0.0)
    total_score = Column(Float, default=0.0)
    percentage = Column(Float, default=0.0)
    completed_at = Column(DateTime, default=datetime.datetime.utcnow)

    student = relationship("Student", back_populates="aptitude_results")
    answers = relationship("AptitudeAnswer", back_populates="result", cascade="all, delete-orphan")

class AptitudeAnswer(Base):
    __tablename__ = "aptitude_answers"

    id = Column(Integer, primary_key=True, index=True)
    result_id = Column(Integer, ForeignKey("aptitude_results.id", ondelete="CASCADE"), nullable=False)
    question_id = Column(Integer, ForeignKey("aptitude_questions.id", ondelete="CASCADE"), nullable=False)
    selected_option = Column(String(10), nullable=False)
    is_correct = Column(Boolean, default=False)

    result = relationship("AptitudeResult", back_populates="answers")
    question = relationship("AptitudeQuestion")

class Career(Base):
    __tablename__ = "careers"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), unique=True, nullable=False, index=True)
    category = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    salary_range = Column(String(100), nullable=False)
    job_outlook = Column(String(100), default="High Demand")  # High Demand, Very High Demand, Growing
    minimum_education = Column(String(100), default="10th Standard")  # 10th Standard, 12th Standard, ITI, Diploma
    required_stream = Column(String(100), default="Any")  # Science, Commerce, Any, Technical
    preferred_interests = Column(JSON, default=list)  # list of interest names
    required_aptitude_profile = Column(JSON, default=dict)  # {"Logical": 60, "Numerical": 50, ...}
    job_roles = Column(JSON, default=list)  # list of typical job titles
    is_skill_first = Column(Boolean, default=False)
    learning_roadmap = Column(JSON, default=list)
    alternative_pathways = Column(JSON, default=list)
    qualification_guidance = Column(Text, default="Degree and qualification requirements vary by employer and role. Check specific job eligibility before applying.")

    skills = relationship("CareerSkill", back_populates="career", cascade="all, delete-orphan")
    courses = relationship("CareerCourse", back_populates="career", cascade="all, delete-orphan")
    recommendations = relationship("Recommendation", back_populates="career", cascade="all, delete-orphan")

class CareerSkill(Base):
    __tablename__ = "career_skills"

    id = Column(Integer, primary_key=True, index=True)
    career_id = Column(Integer, ForeignKey("careers.id", ondelete="CASCADE"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id", ondelete="CASCADE"), nullable=False)
    required_level = Column(Integer, default=3)  # 1 to 5
    importance_weight = Column(Float, default=1.0)

    career = relationship("Career", back_populates="skills")
    skill = relationship("Skill")

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    provider = Column(String(150), nullable=False)  # e.g. National Skill Development Corp, Coursera, Polytechnic
    duration_weeks = Column(Integer, nullable=False)
    approximate_cost = Column(Float, default=0.0)  # in INR
    eligibility = Column(String(150), default="10th Standard Pass")
    description = Column(Text, nullable=True)
    mode = Column(String(50), default="Hybrid")  # Online, Offline, Hybrid
    certification_type = Column(String(100), default="Industry Recognized Certificate")
    level = Column(String(50), default="Beginner")  # Beginner, Intermediate, Advanced
    skills_covered = Column(JSON, default=list)

    careers = relationship("CareerCourse", back_populates="course", cascade="all, delete-orphan")

class CareerCourse(Base):
    __tablename__ = "career_courses"

    id = Column(Integer, primary_key=True, index=True)
    career_id = Column(Integer, ForeignKey("careers.id", ondelete="CASCADE"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)

    career = relationship("Career", back_populates="courses")
    course = relationship("Course")

class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    career_id = Column(Integer, ForeignKey("careers.id", ondelete="CASCADE"), nullable=False)
    overall_score = Column(Float, nullable=False)  # 0 to 100
    interest_match = Column(Float, default=0.0)
    skill_match = Column(Float, default=0.0)
    academic_match = Column(Float, default=0.0)
    aptitude_match = Column(Float, default=0.0)
    strength_match = Column(Float, default=0.0)
    preference_match = Column(Float, default=0.0)
    is_eligible = Column(Boolean, default=True)
    eligibility_notes = Column(Text, nullable=True)
    reasons_json = Column(JSON, default=list)
    generated_at = Column(DateTime, default=datetime.datetime.utcnow)

    student = relationship("Student", back_populates="recommendations")
    career = relationship("Career", back_populates="recommendations")
    skill_gaps = relationship("SkillGap", back_populates="recommendation", cascade="all, delete-orphan")

class SkillGap(Base):
    __tablename__ = "skill_gaps"

    id = Column(Integer, primary_key=True, index=True)
    recommendation_id = Column(Integer, ForeignKey("recommendations.id", ondelete="CASCADE"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id", ondelete="CASCADE"), nullable=False)
    current_level = Column(Integer, default=0)
    required_level = Column(Integer, default=3)
    gap = Column(Integer, default=3)
    priority = Column(String(20), default="Medium")  # High, Medium, Low
    learning_recommendation = Column(Text, nullable=True)

    recommendation = relationship("Recommendation", back_populates="skill_gaps")
    skill = relationship("Skill")

class FamilyReport(Base):
    __tablename__ = "family_reports"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), unique=True, nullable=False)
    report_token = Column(String(64), unique=True, nullable=False, index=True)
    student_notes = Column(Text, nullable=True)
    parent_notes = Column(Text, nullable=True)
    student_preferred_career_id = Column(Integer, ForeignKey("careers.id", ondelete="SET NULL"), nullable=True)
    parent_preferred_career_id = Column(Integer, ForeignKey("careers.id", ondelete="SET NULL"), nullable=True)
    final_family_career_id = Column(Integer, ForeignKey("careers.id", ondelete="SET NULL"), nullable=True)
    consensus_status = Column(String(50), default="discussing")  # discussing, aligned, finalized
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    student = relationship("Student", back_populates="family_report")
    student_preferred_career = relationship("Career", foreign_keys=[student_preferred_career_id])
    parent_preferred_career = relationship("Career", foreign_keys=[parent_preferred_career_id])
    final_family_career = relationship("Career", foreign_keys=[final_family_career_id])
