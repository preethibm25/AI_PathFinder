from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.database.models import Student, FamilyReport
from app.schemas.schemas import FamilyReportResponse
from app.auth.security import get_current_student
from app.api.family import get_or_create_family_report, build_family_report_response

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.post("/generate", response_model=FamilyReportResponse)
def generate_report(
    student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    report = get_or_create_family_report(student, db)
    return build_family_report_response(report, db)

@router.get("/{id_or_token}", response_model=FamilyReportResponse)
def get_report_by_token(id_or_token: str, db: Session = Depends(get_db)):
    report = db.query(FamilyReport).filter(FamilyReport.report_token == id_or_token).first()
    if not report and id_or_token.isdigit():
        report = db.query(FamilyReport).filter(FamilyReport.id == int(id_or_token)).first()

    if not report:
        raise HTTPException(status_code=404, detail="Family report not found.")

    return build_family_report_response(report, db)
