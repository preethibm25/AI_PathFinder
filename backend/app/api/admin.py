from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.connection import get_db
from app.database.models import (
    User, Student, Parent, Career, Course, Skill, AptitudeQuestion,
    AptitudeResult, Recommendation, CareerSkill, CareerCourse
)
from app.schemas.schemas import AdminCareerCreate, AdminCourseCreate, AdminQuestionCreate
from app.auth.security import require_roles

router = APIRouter(prefix="/admin", tags=["Admin Portal"])

@router.get("/stats")
def get_admin_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin"]))
):
    total_students = db.query(Student).count()
    total_parents = db.query(Parent).count()
    total_careers = db.query(Career).count()
    total_courses = db.query(Course).count()
    total_questions = db.query(AptitudeQuestion).count()
    total_assessments = db.query(AptitudeResult).count()

    avg_aptitude = db.query(func.avg(AptitudeResult.percentage)).scalar() or 0.0

    # Top recommended careers
    top_careers = (
        db.query(Career.title, func.count(Recommendation.id).label("count"))
        .join(Recommendation, Recommendation.career_id == Career.id)
        .group_by(Career.title)
        .order_by(func.count(Recommendation.id).desc())
        .limit(5)
        .all()
    )

    return {
        "total_students": total_students,
        "total_parents": total_parents,
        "total_careers": total_careers,
        "total_courses": total_courses,
        "total_questions": total_questions,
        "total_assessments": total_assessments,
        "average_aptitude_score": round(float(avg_aptitude), 1),
        "top_recommended_careers": [{"title": title, "recommendation_count": count} for title, count in top_careers]
    }

@router.get("/students")
def list_students(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin"]))
):
    students = db.query(Student).all()
    result = []
    for s in students:
        latest_apt = s.aptitude_results[-1] if s.aptitude_results else None
        top_rec = (
            db.query(Recommendation)
            .filter(Recommendation.student_id == s.id)
            .order_by(Recommendation.overall_score.desc())
            .first()
        )

        result.append({
            "id": s.id,
            "student_code": s.student_code,
            "full_name": s.user.full_name,
            "email": s.user.email,
            "education_level": s.profile.education_level if s.profile else s.user.education_level,
            "stream": s.profile.stream if s.profile else "-",
            "percentage": s.profile.gpa_or_percentage if s.profile else None,
            "assessment_completed": latest_apt is not None,
            "assessment_score": latest_apt.percentage if latest_apt else None,
            "top_career": top_rec.career.title if top_rec and top_rec.career else None,
            "top_match_score": top_rec.overall_score if top_rec else None,
            "joined_at": s.created_at
        })
    return result

@router.post("/careers")
def create_career(
    career_in: AdminCareerCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin"]))
):
    career = Career(
        title=career_in.title,
        category=career_in.category,
        description=career_in.description,
        salary_range=career_in.salary_range,
        job_outlook=career_in.job_outlook,
        minimum_education=career_in.minimum_education,
        required_stream=career_in.required_stream,
        preferred_interests=career_in.preferred_interests,
        required_aptitude_profile=career_in.required_aptitude_profile,
        job_roles=career_in.job_roles
    )
    db.add(career)
    db.flush()

    for item in career_in.skill_ids:
        cs = CareerSkill(
            career_id=career.id,
            skill_id=item.get("skill_id"),
            required_level=item.get("required_level", 3),
            importance_weight=item.get("importance", 1.0)
        )
        db.add(cs)

    for c_id in career_in.course_ids:
        db.add(CareerCourse(career_id=career.id, course_id=c_id))

    db.commit()
    db.refresh(career)
    return {"success": True, "career_id": career.id, "message": "Career successfully created."}

@router.put("/careers/{id}")
def update_career(
    id: int,
    career_in: AdminCareerCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin"]))
):
    career = db.query(Career).filter(Career.id == id).first()
    if not career:
        raise HTTPException(status_code=404, detail="Career not found.")

    career.title = career_in.title
    career.category = career_in.category
    career.description = career_in.description
    career.salary_range = career_in.salary_range
    career.job_outlook = career_in.job_outlook
    career.minimum_education = career_in.minimum_education
    career.required_stream = career_in.required_stream
    career.preferred_interests = career_in.preferred_interests
    career.required_aptitude_profile = career_in.required_aptitude_profile
    career.job_roles = career_in.job_roles

    db.commit()
    return {"success": True, "message": "Career updated successfully."}

@router.delete("/careers/{id}")
def delete_career(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin"]))
):
    career = db.query(Career).filter(Career.id == id).first()
    if not career:
        raise HTTPException(status_code=404, detail="Career not found.")

    db.delete(career)
    db.commit()
    return {"success": True, "message": "Career deleted successfully."}

@router.post("/courses")
def create_course(
    course_in: AdminCourseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin"]))
):
    course = Course(
        title=course_in.title,
        provider=course_in.provider,
        duration_weeks=course_in.duration_weeks,
        approximate_cost=course_in.approximate_cost,
        eligibility=course_in.eligibility,
        description=course_in.description,
        mode=course_in.mode,
        certification_type=course_in.certification_type,
        level=course_in.level,
        skills_covered=course_in.skills_covered
    )
    db.add(course)
    db.flush()

    for c_id in course_in.career_ids:
        db.add(CareerCourse(career_id=c_id, course_id=course.id))

    db.commit()
    db.refresh(course)
    return {"success": True, "course_id": course.id, "message": "Course created successfully."}

@router.delete("/courses/{id}")
def delete_course(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin"]))
):
    course = db.query(Course).filter(Course.id == id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found.")

    db.delete(course)
    db.commit()
    return {"success": True, "message": "Course deleted successfully."}

@router.post("/questions")
def create_question(
    q_in: AdminQuestionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin"]))
):
    q = AptitudeQuestion(
        category=q_in.category,
        question_text=q_in.question_text,
        option_a=q_in.option_a,
        option_b=q_in.option_b,
        option_c=q_in.option_c,
        option_d=q_in.option_d,
        correct_option=q_in.correct_option.strip().upper(),
        explanation=q_in.explanation
    )
    db.add(q)
    db.commit()
    db.refresh(q)
    return {"success": True, "question_id": q.id, "message": "Question created successfully."}

@router.delete("/questions/{id}")
def delete_question(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin"]))
):
    q = db.query(AptitudeQuestion).filter(AptitudeQuestion.id == id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found.")

    db.delete(q)
    db.commit()
    return {"success": True, "message": "Question deleted successfully."}
