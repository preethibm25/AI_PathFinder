from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.database.models import Skill, Student, Recommendation, SkillGap
from app.schemas.schemas import SkillBase, SkillGapResponse
from app.auth.security import get_current_student

router = APIRouter(prefix="/skills", tags=["Skills & Gap Analysis"])

@router.get("", response_model=List[SkillBase])
def get_all_skills(db: Session = Depends(get_db)):
    skills = db.query(Skill).order_by(Skill.category, Skill.name).all()
    return [
        SkillBase(
            id=s.id,
            name=s.name,
            category=s.category,
            description=s.description
        )
        for s in skills
    ]

@router.get("/gap", response_model=List[SkillGapResponse])
def get_aggregated_skill_gaps(
    student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    # Retrieve top 3 recommendations for this student
    top_recs = (
        db.query(Recommendation)
        .filter(Recommendation.student_id == student.id)
        .order_by(Recommendation.overall_score.desc())
        .limit(3)
        .all()
    )

    if not top_recs:
        return []

    # Aggregate skill gaps across top recommendations, deduplicating by skill_id
    seen_skills = set()
    aggregated_gaps = []

    for rec in top_recs:
        for g in rec.skill_gaps:
            if g.skill_id not in seen_skills and g.gap > 0:
                seen_skills.add(g.skill_id)
                aggregated_gaps.append(SkillGapResponse(
                    id=g.id,
                    skill_id=g.skill_id,
                    skill_name=g.skill.name if g.skill else "Skill",
                    category=g.skill.category if g.skill else "General",
                    current_level=g.current_level,
                    required_level=g.required_level,
                    gap=g.gap,
                    priority=g.priority,
                    learning_recommendation=g.learning_recommendation
                ))

    # Sort gaps by priority: High first, then Medium, then Low
    priority_order = {"High": 0, "Medium": 1, "Low": 2, "None": 3}
    aggregated_gaps.sort(key=lambda x: priority_order.get(x.priority, 4))

    return aggregated_gaps
