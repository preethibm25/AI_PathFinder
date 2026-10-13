from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.database.models import (
    User, Student, StudentProfile, Skill, StudentSkill,
    Interest, StudentInterest, Strength, StudentStrength,
    AcademicRecord, Preference, AptitudeResult, Recommendation
)
from app.schemas.schemas import ProfileUpdateRequest, ProfileResponse
from app.auth.security import get_current_user, get_current_student

router = APIRouter(prefix="/profile", tags=["Student Profile"])

@router.get("/options")
def get_profile_options(db: Session = Depends(get_db)):
    """Returns master lists of available skills, interests, and strengths."""
    skills = db.query(Skill).all()
    interests = db.query(Interest).all()
    strengths = db.query(Strength).all()

    return {
        "skills": [{"id": s.id, "name": s.name, "category": s.category, "description": s.description} for s in skills],
        "interests": [{"id": i.id, "name": i.name, "category": i.category, "description": i.description} for i in interests],
        "strengths": [{"id": st.id, "name": st.name, "category": st.category, "description": st.description} for st in strengths],
        "education_levels": [
            "10th Standard",
            "12th Standard",
            "ITI (Industrial Training Institute)",
            "Polytechnic Diploma",
            "Bachelor's Degree",
            "Vocational Certificate"
        ],
        "streams": ["Science", "Commerce", "Arts", "Vocational / Technical", "Any"],
        "education_statuses": [
            "10th Standard",
            "12th Standard",
            "Diploma",
            "Degree",
            "Dropout",
            "Other"
        ],
        "background_streams": [
            "Computer Science / IT",
            "Science",
            "Commerce",
            "Arts / Humanities",
            "Other"
        ],
        "career_transitions": [
            "I am from an IT / CS background",
            "I am from Arts / Commerce / Non-IT background and want to enter Tech / IT",
            "I have low academic marks and want a skill-first entry into Tech",
            "I am a Diploma / 12th / Non-degree student aiming for IT roles",
            "Career changer from another industry seeking Tech jobs",
            "Self-taught / Portfolio-based entry into Tech"
        ],
        "work_environments": ["Indoor/Office", "Outdoor/Field", "Workshop/Lab", "Remote/Hybrid"],
        "industries": [
            "Information Technology",
            "Renewable Energy & Vocational",
            "Healthcare & Allied Health",
            "Manufacturing & Mechanical",
            "Finance & Commerce",
            "Design & Multimedia",
            "Automotive & Engineering"
        ]
    }

@router.get("", response_model=ProfileResponse)
def get_student_profile(
    student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    profile = student.profile
    has_skills = len(student.skills) > 0
    has_interests = len(student.interests) > 0
    has_strengths = len(student.strengths) > 0
    has_academics = len(student.academic_records) > 0 or (profile and profile.gpa_or_percentage is not None)
    has_preferences = student.preferences is not None
    has_aptitude = len(student.aptitude_results) > 0

    # Calculate completion percentage across 6 key pillars
    pillars = [has_academics, has_interests, has_skills, has_strengths, has_preferences, has_aptitude]
    completion = int((sum(1 for p in pillars if p) / len(pillars)) * 100)

    aptitude_summary = None
    if has_aptitude:
        latest = student.aptitude_results[-1]
        aptitude_summary = {
            "total_score": latest.total_score,
            "percentage": latest.percentage,
            "logical_score": latest.logical_score,
            "numerical_score": latest.numerical_score,
            "verbal_score": latest.verbal_score,
            "analytical_score": latest.analytical_score,
            "problem_solving_score": latest.problem_solving_score,
            "completed_at": latest.completed_at
        }

    preferences_dict = None
    if student.preferences:
        preferences_dict = {
            "preferred_work_env": student.preferences.preferred_work_env,
            "preferred_industry": student.preferences.preferred_industry,
            "budget_max": student.preferences.budget_max,
            "max_course_duration_months": student.preferences.max_course_duration_months,
            "location_type": student.preferences.location_type,
            "expected_salary_min": student.preferences.expected_salary_min,
            "work_style": student.preferences.work_style
        }

    return {
        "student_id": student.id,
        "student_code": student.student_code,
        "full_name": student.user.full_name,
        "email": student.user.email,
        "completion_percentage": completion,
        "has_profile": profile is not None,
        "has_skills": has_skills,
        "has_interests": has_interests,
        "has_strengths": has_strengths,
        "has_academics": has_academics,
        "has_preferences": has_preferences,
        "has_aptitude": has_aptitude,
        "education_level": profile.education_level if profile else student.user.education_level,
        "education_status": getattr(profile, "education_status", "12th Standard") if profile else "12th Standard",
        "background_stream": getattr(profile, "background_stream", "Science") if profile else "Science",
        "career_transition": getattr(profile, "career_transition", "I am from an IT / CS background") if profile else "I am from an IT / CS background",
        "stream": profile.stream if profile else None,
        "gpa_or_percentage": profile.gpa_or_percentage if profile else None,
        "school_college": profile.school_college if profile else None,
        "graduation_year": profile.graduation_year if profile else None,
        "skills": [
            {
                "skill_id": ss.skill_id,
                "name": ss.skill.name if ss.skill else "",
                "category": ss.skill.category if ss.skill else "",
                "proficiency_level": ss.proficiency_level
            }
            for ss in student.skills
        ],
        "interests": [
            {
                "interest_id": si.interest_id,
                "name": si.interest.name if si.interest else "",
                "category": si.interest.category if si.interest else "",
                "interest_level": si.interest_level
            }
            for si in student.interests
        ],
        "strengths": [
            {
                "strength_id": st.strength_id,
                "name": st.strength.name if st.strength else "",
                "category": st.strength.category if st.strength else ""
            }
            for st in student.strengths
        ],
        "academic_records": [
            {
                "level": ar.level,
                "board_or_univ": ar.board_or_univ,
                "stream": ar.stream,
                "marks_percentage": ar.marks_percentage,
                "passing_year": ar.passing_year
            }
            for ar in student.academic_records
        ],
        "preferences": preferences_dict,
        "aptitude_summary": aptitude_summary
    }

@router.put("", response_model=ProfileResponse)
def update_student_profile(
    profile_in: ProfileUpdateRequest,
    student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    profile = student.profile
    if not profile:
        profile = StudentProfile(student_id=student.id)
        db.add(profile)
        db.flush()

    if profile_in.education_level is not None:
        profile.education_level = profile_in.education_level
    if profile_in.education_status is not None:
        profile.education_status = profile_in.education_status
    if profile_in.background_stream is not None:
        profile.background_stream = profile_in.background_stream
    if profile_in.career_transition is not None:
        profile.career_transition = profile_in.career_transition
    if profile_in.stream is not None:
        profile.stream = profile_in.stream
    if profile_in.gpa_or_percentage is not None:
        profile.gpa_or_percentage = profile_in.gpa_or_percentage
    if profile_in.school_college is not None:
        profile.school_college = profile_in.school_college
    if profile_in.graduation_year is not None:
        profile.graduation_year = profile_in.graduation_year

    # Update Skills
    if profile_in.skills is not None:
        db.query(StudentSkill).filter(StudentSkill.student_id == student.id).delete()
        for sk in profile_in.skills:
            db.add(StudentSkill(
                student_id=student.id,
                skill_id=sk.skill_id,
                proficiency_level=sk.proficiency_level
            ))

    # Update Interests
    if profile_in.interests is not None:
        db.query(StudentInterest).filter(StudentInterest.student_id == student.id).delete()
        for it in profile_in.interests:
            db.add(StudentInterest(
                student_id=student.id,
                interest_id=it.interest_id,
                interest_level=it.interest_level
            ))

    # Update Strengths
    if profile_in.strengths is not None:
        db.query(StudentStrength).filter(StudentStrength.student_id == student.id).delete()
        for st_id in profile_in.strengths:
            db.add(StudentStrength(
                student_id=student.id,
                strength_id=st_id
            ))

    # Update Academics
    if profile_in.academic_records is not None:
        db.query(AcademicRecord).filter(AcademicRecord.student_id == student.id).delete()
        for ac in profile_in.academic_records:
            db.add(AcademicRecord(
                student_id=student.id,
                level=ac.level,
                board_or_univ=ac.board_or_univ,
                stream=ac.stream,
                marks_percentage=ac.marks_percentage,
                passing_year=ac.passing_year
            ))

    # Update Preferences
    if profile_in.preferences is not None:
        pref = student.preferences
        if not pref:
            pref = Preference(student_id=student.id)
            db.add(pref)
        pref.preferred_work_env = profile_in.preferences.preferred_work_env
        pref.preferred_industry = profile_in.preferences.preferred_industry
        pref.budget_max = profile_in.preferences.budget_max
        pref.max_course_duration_months = profile_in.preferences.max_course_duration_months
        pref.location_type = profile_in.preferences.location_type
        pref.expected_salary_min = profile_in.preferences.expected_salary_min
        pref.work_style = profile_in.preferences.work_style

    # Invalidate cached recommendations so next evaluation recalculates with updated inputs
    db.query(Recommendation).filter(Recommendation.student_id == student.id).delete()

    db.commit()
    db.refresh(student)

    return get_student_profile(student=student, db=db)
