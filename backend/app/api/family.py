import uuid
from typing import Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.database.models import (
    User, Student, Parent, ParentStudentLink, FamilyReport, Career, Recommendation
)
from app.schemas.schemas import (
    FamilyReportResponse, FamilyPreferenceSubmit, LinkParentStudentRequest, RecommendationItem
)
from app.auth.security import get_current_user
from app.api.recommendations import format_recommendation_item

router = APIRouter(prefix="/family", tags=["Family Decision Support"])

def get_or_create_family_report(student: Student, db: Session) -> FamilyReport:
    report = db.query(FamilyReport).filter(FamilyReport.student_id == student.id).first()
    if not report:
        report = FamilyReport(
            student_id=student.id,
            report_token=str(uuid.uuid4()),
            consensus_status="discussing"
        )
        db.add(report)
        db.commit()
        db.refresh(report)
    return report

def build_family_report_response(report: FamilyReport, db: Session) -> FamilyReportResponse:
    student = report.student
    top_recs = (
        db.query(Recommendation)
        .filter(Recommendation.student_id == student.id)
        .order_by(Recommendation.overall_score.desc())
        .limit(5)
        .all()
    )

    aptitude_summary = None
    if student.aptitude_results:
        latest = student.aptitude_results[-1]
        aptitude_summary = {
            "percentage": latest.percentage,
            "logical_score": latest.logical_score,
            "numerical_score": latest.numerical_score,
            "verbal_score": latest.verbal_score,
            "analytical_score": latest.analytical_score,
            "problem_solving_score": latest.problem_solving_score,
        }

    return FamilyReportResponse(
        id=report.id,
        report_token=report.report_token,
        student_id=student.id,
        student_name=student.user.full_name,
        student_code=student.student_code,
        education_level=student.profile.education_level if student.profile else student.user.education_level,
        aptitude_summary=aptitude_summary,
        top_recommendations=[format_recommendation_item(r) for r in top_recs],
        student_preferred_career={
            "id": report.student_preferred_career.id,
            "title": report.student_preferred_career.title,
            "category": report.student_preferred_career.category,
            "salary_range": report.student_preferred_career.salary_range
        } if report.student_preferred_career else None,
        parent_preferred_career={
            "id": report.parent_preferred_career.id,
            "title": report.parent_preferred_career.title,
            "category": report.parent_preferred_career.category,
            "salary_range": report.parent_preferred_career.salary_range
        } if report.parent_preferred_career else None,
        final_family_career={
            "id": report.final_family_career.id,
            "title": report.final_family_career.title,
            "category": report.final_family_career.category,
            "salary_range": report.final_family_career.salary_range
        } if report.final_family_career else None,
        student_notes=report.student_notes,
        parent_notes=report.parent_notes,
        consensus_status=report.consensus_status,
        created_at=report.created_at,
        updated_at=report.updated_at
    )

@router.post("/invite")
def get_parent_invite_code(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "student" or not current_user.student_profile:
        raise HTTPException(status_code=403, detail="Only students can generate parent invitations.")

    student = current_user.student_profile
    return {
        "student_code": student.student_code,
        "message": f"Share this code with your parent/guardian: {student.student_code}. They can enter it on their dashboard to view your career guidance report."
    }

@router.post("/link")
def link_parent_to_student(
    payload: LinkParentStudentRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "parent" or not current_user.parent_profile:
        raise HTTPException(status_code=403, detail="Only parents can link to a student account.")

    parent = current_user.parent_profile
    code = payload.student_code.strip().upper()
    student = db.query(Student).filter(Student.student_code == code).first()
    if not student:
        raise HTTPException(status_code=404, detail="No student found with this invitation code.")

    # Check if already linked
    existing = db.query(ParentStudentLink).filter(
        ParentStudentLink.parent_id == parent.id,
        ParentStudentLink.student_id == student.id
    ).first()

    if not existing:
        link = ParentStudentLink(
            parent_id=parent.id,
            student_id=student.id,
            status="active",
            invite_code=code
        )
        db.add(link)
        db.commit()

    return {
        "success": True,
        "message": f"Successfully linked with student {student.user.full_name}!",
        "student_name": student.user.full_name,
        "student_id": student.id
    }

@router.get("/report", response_model=FamilyReportResponse)
def get_family_report(
    student_id: Optional[int] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    target_student = None

    if current_user.role == "student":
        target_student = current_user.student_profile
    elif current_user.role == "parent":
        parent = current_user.parent_profile
        if not parent or not parent.student_links:
            raise HTTPException(status_code=404, detail="No student linked to this parent account yet. Please enter your student's invite code.")

        if student_id:
            # Verify security check: parent can ONLY access linked student
            link = db.query(ParentStudentLink).filter(
                ParentStudentLink.parent_id == parent.id,
                ParentStudentLink.student_id == student_id
            ).first()
            if not link:
                raise HTTPException(status_code=403, detail="Unauthorized: You can only access reports for your linked students.")
            target_student = link.student
        else:
            # Default to first linked student
            target_student = parent.student_links[0].student
    elif current_user.role == "admin":
        if student_id:
            target_student = db.query(Student).filter(Student.id == student_id).first()
        else:
            target_student = db.query(Student).first()

    if not target_student:
        raise HTTPException(status_code=404, detail="Student profile not found.")

    report = get_or_create_family_report(target_student, db)
    return build_family_report_response(report, db)

@router.post("/preference")
def record_career_preference(
    payload: FamilyPreferenceSubmit,
    student_id: Optional[int] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    career = db.query(Career).filter(Career.id == payload.career_id).first()
    if not career:
        raise HTTPException(status_code=404, detail="Career not found.")

    target_student = None
    if current_user.role == "student":
        target_student = current_user.student_profile
        report = get_or_create_family_report(target_student, db)
        report.student_preferred_career_id = career.id
        if payload.notes:
            report.student_notes = payload.notes
        if payload.is_final_family_choice:
            report.final_family_career_id = career.id
            report.consensus_status = "finalized"

    elif current_user.role == "parent":
        parent = current_user.parent_profile
        if not parent or not parent.student_links:
            raise HTTPException(status_code=403, detail="No linked student found.")

        # Check authorization
        if student_id:
            link = db.query(ParentStudentLink).filter(
                ParentStudentLink.parent_id == parent.id,
                ParentStudentLink.student_id == student_id
            ).first()
            if not link:
                raise HTTPException(status_code=403, detail="Unauthorized: Access denied to unlinked student.")
            target_student = link.student
        else:
            target_student = parent.student_links[0].student

        report = get_or_create_family_report(target_student, db)
        report.parent_preferred_career_id = career.id
        if payload.notes:
            report.parent_notes = payload.notes
        if payload.is_final_family_choice:
            report.final_family_career_id = career.id
            report.consensus_status = "finalized"

    # Evaluate consensus status
    if report.student_preferred_career_id and report.parent_preferred_career_id:
        if report.student_preferred_career_id == report.parent_preferred_career_id:
            report.consensus_status = "aligned"
            if not report.final_family_career_id:
                report.final_family_career_id = report.student_preferred_career_id
        else:
            if report.consensus_status != "finalized":
                report.consensus_status = "discussing"

    db.commit()
    db.refresh(report)

    return {
        "success": True,
        "message": "Preference successfully recorded in Family Report.",
        "consensus_status": report.consensus_status,
        "final_family_choice": report.final_family_career.title if report.final_family_career else None
    }
