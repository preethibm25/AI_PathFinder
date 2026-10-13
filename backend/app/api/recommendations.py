from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.database.models import Student, Career, Recommendation, SkillGap
from app.schemas.schemas import RecommendationItem, SkillGapResponse, CourseOut
from app.auth.security import get_current_student, get_current_user, User
from app.ai.recommendation_engine import recommendation_engine
from app.ai.llm_provider import get_llm_provider

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])

def format_recommendation_item(rec: Recommendation) -> RecommendationItem:
    career = rec.career
    gaps = [
        SkillGapResponse(
            id=g.id,
            skill_id=g.skill_id,
            skill_name=g.skill.name if g.skill else "Skill",
            category=g.skill.category if g.skill else "General",
            current_level=g.current_level,
            required_level=g.required_level,
            gap=g.gap,
            priority=g.priority,
            learning_recommendation=g.learning_recommendation
        )
        for g in rec.skill_gaps
    ]

    courses = []
    if career and career.courses:
        for cc in career.courses:
            c = cc.course
            if c:
                courses.append(CourseOut(
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
                ))

    return RecommendationItem(
        id=rec.id,
        career_id=career.id if career else 0,
        career_title=career.title if career else "Career",
        category=career.category if career else "",
        description=career.description if career else "",
        salary_range=career.salary_range if career else "",
        job_outlook=career.job_outlook if career else "High Demand",
        overall_score=rec.overall_score,
        interest_match=rec.interest_match,
        skill_match=rec.skill_match,
        academic_match=rec.academic_match,
        aptitude_match=rec.aptitude_match,
        strength_match=rec.strength_match,
        preference_match=rec.preference_match,
        is_eligible=rec.is_eligible,
        eligibility_notes=rec.eligibility_notes,
        reasons=rec.reasons_json or [],
        required_skills=[
            {
                "skill_id": cs.skill_id,
                "name": cs.skill.name if cs.skill else "",
                "required_level": cs.required_level
            }
            for cs in (career.skills if career else [])
        ],
        skill_gaps=gaps,
        related_courses=courses,
        job_roles=career.job_roles or [] if career else [],
        is_skill_first=bool(career.is_skill_first) if (career and career.is_skill_first) else False,
        learning_roadmap=career.learning_roadmap or [] if (career and career.learning_roadmap) else [],
        alternative_pathways=career.alternative_pathways or [] if (career and career.alternative_pathways) else [],
        qualification_guidance=career.qualification_guidance or "Degree and qualification requirements vary by employer and role. Check specific job eligibility before applying." if career else None
    )

@router.post("/generate", response_model=List[RecommendationItem])
def generate_recommendations(
    student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    careers = db.query(Career).all()
    if not careers:
        raise HTTPException(status_code=400, detail="No careers found in database.")

    # Delete existing recommendations for this student to regenerate clean evaluation
    db.query(Recommendation).filter(Recommendation.student_id == student.id).delete()
    db.flush()

    new_recs = []
    for career in careers:
        eval_result = recommendation_engine.evaluate_career(student, career)

        rec = Recommendation(
            student_id=student.id,
            career_id=career.id,
            overall_score=eval_result["overall_score"],
            interest_match=eval_result["interest_match"],
            skill_match=eval_result["skill_match"],
            academic_match=eval_result["academic_match"],
            aptitude_match=eval_result["aptitude_match"],
            strength_match=eval_result["strength_match"],
            preference_match=eval_result["preference_match"],
            is_eligible=eval_result["is_eligible"],
            eligibility_notes=eval_result["eligibility_notes"],
            reasons_json=eval_result["reasons"]
        )
        db.add(rec)
        db.flush()

        for g in eval_result["skill_gaps"]:
            sg = SkillGap(
                recommendation_id=rec.id,
                skill_id=g["skill_id"],
                current_level=g["current_level"],
                required_level=g["required_level"],
                gap=g["gap"],
                priority=g["priority"],
                learning_recommendation=g["learning_recommendation"]
            )
            db.add(sg)

        new_recs.append(rec)

    db.commit()

    # Re-query sorted by overall_score descending
    sorted_recs = (
        db.query(Recommendation)
        .filter(Recommendation.student_id == student.id)
        .order_by(Recommendation.overall_score.desc())
        .all()
    )

    return [format_recommendation_item(r) for r in sorted_recs]

@router.get("", response_model=List[RecommendationItem])
def get_recommendations(
    refresh: bool = False,
    student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    total_careers = db.query(Career).count()
    recs = (
        db.query(Recommendation)
        .filter(Recommendation.student_id == student.id)
        .order_by(Recommendation.overall_score.desc())
        .all()
    )
    if refresh or not recs or (total_careers > 0 and len(recs) < total_careers):
        # Auto-generate if not yet generated, explicitly refreshed, or career count changed
        return generate_recommendations(student=student, db=db)

    return [format_recommendation_item(r) for r in recs]

@router.get("/{id}", response_model=RecommendationItem)
def get_recommendation_by_id(
    id: int,
    student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    rec = db.query(Recommendation).filter(Recommendation.id == id, Recommendation.student_id == student.id).first()
    if not rec:
        # Check by career_id
        rec = db.query(Recommendation).filter(Recommendation.career_id == id, Recommendation.student_id == student.id).first()

    if not rec:
        raise HTTPException(status_code=404, detail="Recommendation not found.")

    return format_recommendation_item(rec)
