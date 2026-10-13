from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.database.models import Career, Student, Recommendation, Course, SkillGap
from app.schemas.schemas import (
    CareerDetailResponse, CompareCareersRequest, CareerComparisonItem,
    CourseOut, SkillGapResponse
)
from app.auth.security import get_current_user, User
from app.ai.llm_provider import get_llm_provider

router = APIRouter(prefix="/careers", tags=["Careers"])

@router.get("")
def list_careers(
    search: Optional[str] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Career)
    if search:
        query = query.filter(Career.title.ilike(f"%{search}%") | Career.description.ilike(f"%{search}%"))
    if category:
        query = query.filter(Career.category == category)

    careers = query.all()
    return [
        {
            "id": c.id,
            "title": c.title,
            "category": c.category,
            "description": c.description,
            "salary_range": c.salary_range,
            "job_outlook": c.job_outlook,
            "minimum_education": c.minimum_education,
            "required_stream": c.required_stream,
            "job_roles": c.job_roles or [],
            "is_skill_first": bool(c.is_skill_first) if c.is_skill_first else False,
            "learning_roadmap": c.learning_roadmap or [],
            "alternative_pathways": c.alternative_pathways or [],
            "qualification_guidance": c.qualification_guidance or "Degree and qualification requirements vary by employer and role. Check specific job eligibility before applying."
        }
        for c in careers
    ]

@router.get("/{id}", response_model=CareerDetailResponse)
def get_career_detail(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    career = db.query(Career).filter(Career.id == id).first()
    if not career:
        raise HTTPException(status_code=404, detail="Career not found.")

    student = None
    if current_user.role == "student" and current_user.student_profile:
        student = current_user.student_profile

    # Look up recommendation if available
    rec = None
    if student:
        rec = db.query(Recommendation).filter(
            Recommendation.student_id == student.id,
            Recommendation.career_id == career.id
        ).first()

    student_skills_map = {}
    if student:
        student_skills_map = {ss.skill_id: ss.proficiency_level for ss in student.skills}

    required_skills = []
    gaps_list = []
    for cs in career.skills:
        skill = cs.skill
        s_name = skill.name if skill else ""
        s_cat = skill.category if skill else "General"
        curr_lvl = student_skills_map.get(cs.skill_id, 0)
        gap = max(0, cs.required_level - curr_lvl)

        priority = "None"
        if gap >= 3 or (cs.required_level >= 4 and curr_lvl == 0):
            priority = "High"
        elif gap == 2:
            priority = "Medium"
        elif gap == 1:
            priority = "Low"

        required_skills.append({
            "skill_id": cs.skill_id,
            "name": s_name,
            "category": s_cat,
            "required_level": cs.required_level
        })

        gaps_list.append(SkillGapResponse(
            id=cs.id,
            skill_id=cs.skill_id,
            skill_name=s_name,
            category=s_cat,
            current_level=curr_lvl,
            required_level=cs.required_level,
            gap=gap,
            priority=priority,
            learning_recommendation=f"Complete hands-on vocational modules to advance {s_name} from {curr_lvl} to {cs.required_level}."
        ))

    student_skills_out = [
        {
            "skill_id": ss.skill_id,
            "name": ss.skill.name if ss.skill else "",
            "proficiency_level": ss.proficiency_level
        }
        for ss in (student.skills if student else [])
    ]

    courses_out = []
    if career.courses:
        for cc in career.courses:
            c = cc.course
            if c:
                courses_out.append(CourseOut(
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

    # Generate LLM explanation
    llm = get_llm_provider()
    score = rec.overall_score if rec else 75.0
    reasons = rec.reasons_json if rec and rec.reasons_json else ["Core vocational curriculum matches career competencies."]
    stu_name = current_user.full_name
    ai_expl = llm.explain_career_recommendation(
        student_name=stu_name,
        career_title=career.title,
        overall_score=score,
        reasons=reasons,
        skill_gaps=[g.model_dump() for g in gaps_list],
        courses=[c.model_dump() for c in courses_out]
    )

    sub_scores = None
    if rec:
        sub_scores = {
            "interest": rec.interest_match,
            "skill": rec.skill_match,
            "academic": rec.academic_match,
            "aptitude": rec.aptitude_match,
            "strength": rec.strength_match,
            "preference": rec.preference_match
        }

    return CareerDetailResponse(
        id=career.id,
        title=career.title,
        category=career.category,
        description=career.description,
        salary_range=career.salary_range,
        job_outlook=career.job_outlook,
        minimum_education=career.minimum_education,
        required_stream=career.required_stream,
        job_roles=career.job_roles or [],
        is_skill_first=bool(career.is_skill_first) if career.is_skill_first else False,
        learning_roadmap=career.learning_roadmap or [],
        alternative_pathways=career.alternative_pathways or [],
        qualification_guidance=career.qualification_guidance or "Degree and qualification requirements vary by employer and role. Check specific job eligibility before applying.",
        match_score=score,
        sub_scores=sub_scores,
        is_eligible=rec.is_eligible if rec else True,
        eligibility_notes=rec.eligibility_notes if rec else "Prerequisites met.",
        why_it_matches=reasons,
        required_skills=required_skills,
        student_skills=student_skills_out,
        skill_gaps=gaps_list,
        recommended_courses=courses_out,
        ai_explanation=ai_expl
    )

@router.post("/compare", response_model=List[CareerComparisonItem])
def compare_careers(
    payload: CompareCareersRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if len(payload.career_ids) < 2:
        raise HTTPException(status_code=400, detail="Select at least 2 careers to compare.")

    student = None
    if current_user.role == "student" and current_user.student_profile:
        student = current_user.student_profile

    student_skills_map = {ss.skill_id: ss.proficiency_level for ss in student.skills} if student else {}

    results = []
    for c_id in payload.career_ids:
        career = db.query(Career).filter(Career.id == c_id).first()
        if not career:
            continue

        rec = None
        if student:
            rec = db.query(Recommendation).filter(
                Recommendation.student_id == student.id,
                Recommendation.career_id == career.id
            ).first()

        overall = rec.overall_score if rec else 70.0
        int_m = rec.interest_match if rec else 65.0
        skl_m = rec.skill_match if rec else 60.0
        acd_m = rec.academic_match if rec else 75.0
        apt_m = rec.aptitude_match if rec else 70.0
        prf_m = rec.preference_match if rec else 70.0

        courses = [cc.course for cc in career.courses if cc.course]
        avg_cost = sum(c.approximate_cost for c in courses) / len(courses) if courses else 15000.0
        avg_dur = int(sum(c.duration_weeks for c in courses) / len(courses)) if courses else 16

        skills_list = []
        gaps_count = 0
        for cs in career.skills:
            s_name = cs.skill.name if cs.skill else "Skill"
            curr_lvl = student_skills_map.get(cs.skill_id, 0)
            if curr_lvl < cs.required_level:
                gaps_count += 1
            skills_list.append({
                "name": s_name,
                "required": cs.required_level,
                "current": curr_lvl
            })

        results.append(CareerComparisonItem(
            id=career.id,
            title=career.title,
            category=career.category,
            description=career.description,
            salary_range=career.salary_range,
            job_outlook=career.job_outlook,
            overall_score=overall,
            interest_match=int_m,
            skill_match=skl_m,
            academic_match=acd_m,
            aptitude_match=apt_m,
            preference_match=prf_m,
            education_required=career.minimum_education,
            average_course_cost=avg_cost,
            average_course_duration_weeks=avg_dur,
            job_roles=career.job_roles or [],
            required_skills_count=len(career.skills),
            skill_gap_count=gaps_count,
            skills_summary=skills_list,
            courses_summary=[
                {"title": c.title, "duration": c.duration_weeks, "cost": c.approximate_cost}
                for c in courses
            ]
        ))

    return results
