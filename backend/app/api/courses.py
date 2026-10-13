from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.database.models import Course, CareerCourse, Career
from app.schemas.schemas import CourseOut

router = APIRouter(prefix="/courses", tags=["Courses"])

@router.get("", response_model=List[CourseOut])
def list_courses(
    career_id: Optional[int] = None,
    level: Optional[str] = None,
    mode: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Course)
    if career_id:
        query = query.join(CareerCourse).filter(CareerCourse.career_id == career_id)
    if level:
        query = query.filter(Course.level == level)
    if mode:
        query = query.filter(Course.mode == mode)
    if search:
        query = query.filter(Course.title.ilike(f"%{search}%") | Course.provider.ilike(f"%{search}%"))

    courses = query.distinct().all()
    return [
        CourseOut(
            id=c.id,
            title=c.title,
            provider=c.provider,
            duration_weeks=c.duration_weeks,
            approximate_cost=c.approximate_cost,
            eligibility=c.eligibility,
            description=c.description,
            mode=c.mode,
            certification_type=c.certification_type,
            level=c.level,
            skills_covered=c.skills_covered or []
        )
        for c in courses
    ]

@router.get("/{id}", response_model=CourseOut)
def get_course_detail(id: int, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found.")

    return CourseOut(
        id=course.id,
        title=course.title,
        provider=course.provider,
        duration_weeks=course.duration_weeks,
        approximate_cost=course.approximate_cost,
        eligibility=course.eligibility,
        description=course.description,
        mode=course.mode,
        certification_type=course.certification_type,
        level=course.level,
        skills_covered=course.skills_covered or []
    )
