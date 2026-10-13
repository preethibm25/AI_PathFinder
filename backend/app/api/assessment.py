from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.database.models import Student, AptitudeQuestion, AptitudeResult, AptitudeAnswer
from app.schemas.schemas import QuestionOut, AssessmentSubmitRequest, AssessmentResultResponse
from app.auth.security import get_current_student

router = APIRouter(prefix="/assessment", tags=["Aptitude Assessment"])

@router.get("/questions", response_model=List[QuestionOut])
def get_assessment_questions(db: Session = Depends(get_db)):
    questions = db.query(AptitudeQuestion).order_by(AptitudeQuestion.id).all()
    return [
        QuestionOut(
            id=q.id,
            category=q.category,
            question_text=q.question_text,
            option_a=q.option_a,
            option_b=q.option_b,
            option_c=q.option_c,
            option_d=q.option_d
        )
        for q in questions
    ]

@router.post("/submit", response_model=AssessmentResultResponse)
def submit_assessment(
    payload: AssessmentSubmitRequest,
    student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    questions = db.query(AptitudeQuestion).all()
    if not questions:
        raise HTTPException(status_code=400, detail="No aptitude questions configured.")

    q_map = {q.id: q for q in questions}

    category_stats = {
        "Logical Reasoning": {"correct": 0, "total": 0},
        "Numerical Ability": {"correct": 0, "total": 0},
        "Verbal Ability": {"correct": 0, "total": 0},
        "Analytical Thinking": {"correct": 0, "total": 0},
        "Problem Solving": {"correct": 0, "total": 0},
    }

    # Record answers
    answers_to_save = []
    total_correct = 0
    total_answered = len(payload.answers)

    for q_id, selected_opt in payload.answers.items():
        if q_id in q_map:
            q = q_map[q_id]
            is_correct = (selected_opt.strip().upper() == q.correct_option.strip().upper())
            if is_correct:
                total_correct += 1

            cat = q.category
            if cat in category_stats:
                category_stats[cat]["total"] += 1
                if is_correct:
                    category_stats[cat]["correct"] += 1

            answers_to_save.append({
                "question_id": q.id,
                "selected_option": selected_opt.strip().upper(),
                "is_correct": is_correct
            })

    # Also count unanswered questions in category totals
    for q in questions:
        cat = q.category
        if cat in category_stats:
            if q.id not in payload.answers:
                category_stats[cat]["total"] += 1

    # Calculate category percentages
    cat_pct = {}
    for cat, stats in category_stats.items():
        pct = (stats["correct"] / stats["total"] * 100.0) if stats["total"] > 0 else 0.0
        cat_pct[cat] = round(pct, 1)

    total_questions = len(questions)
    overall_percentage = round((total_correct / total_questions * 100.0) if total_questions > 0 else 0.0, 1)

    result = AptitudeResult(
        student_id=student.id,
        logical_score=cat_pct.get("Logical Reasoning", 0.0),
        numerical_score=cat_pct.get("Numerical Ability", 0.0),
        verbal_score=cat_pct.get("Verbal Ability", 0.0),
        analytical_score=cat_pct.get("Analytical Thinking", 0.0),
        problem_solving_score=cat_pct.get("Problem Solving", 0.0),
        total_score=float(total_correct),
        percentage=overall_percentage
    )
    db.add(result)
    db.flush()

    for ans in answers_to_save:
        db.add(AptitudeAnswer(
            result_id=result.id,
            question_id=ans["question_id"],
            selected_option=ans["selected_option"],
            is_correct=ans["is_correct"]
        ))

    db.commit()
    db.refresh(result)

    category_breakdown = {
        cat: {
            "score": cat_pct[cat],
            "correct": category_stats[cat]["correct"],
            "total": category_stats[cat]["total"]
        }
        for cat in category_stats
    }

    return AssessmentResultResponse(
        id=result.id,
        logical_score=result.logical_score,
        numerical_score=result.numerical_score,
        verbal_score=result.verbal_score,
        analytical_score=result.analytical_score,
        problem_solving_score=result.problem_solving_score,
        total_score=result.total_score,
        percentage=result.percentage,
        completed_at=result.completed_at,
        category_breakdown=category_breakdown
    )

@router.get("/result", response_model=AssessmentResultResponse)
def get_assessment_result(
    student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    result = db.query(AptitudeResult).filter(AptitudeResult.student_id == student.id).order_by(AptitudeResult.id.desc()).first()
    if not result:
        raise HTTPException(status_code=404, detail="No aptitude assessment completed yet.")

    category_breakdown = {
        "Logical Reasoning": {"score": result.logical_score},
        "Numerical Ability": {"score": result.numerical_score},
        "Verbal Ability": {"score": result.verbal_score},
        "Analytical Thinking": {"score": result.analytical_score},
        "Problem Solving": {"score": result.problem_solving_score},
    }

    return AssessmentResultResponse(
        id=result.id,
        logical_score=result.logical_score,
        numerical_score=result.numerical_score,
        verbal_score=result.verbal_score,
        analytical_score=result.analytical_score,
        problem_solving_score=result.problem_solving_score,
        total_score=result.total_score,
        percentage=result.percentage,
        completed_at=result.completed_at,
        category_breakdown=category_breakdown
    )
