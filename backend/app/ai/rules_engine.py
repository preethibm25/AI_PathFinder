from typing import Tuple, Dict, Any, List
from app.database.models import Career, Student, AcademicRecord

EDUCATION_LEVEL_RANK = {
    "Below 10th": 0,
    "10th Standard": 1,
    "10th": 1,
    "12th Standard": 2,
    "12th": 2,
    "ITI": 2,
    "Polytechnic Diploma": 3,
    "Diploma": 3,
    "Dropout": 1,
    "Other": 1,
    "Bachelor's": 4,
    "Degree": 4,
    "Master's": 5
}

class EligibilityEngine:
    """
    Rule-Based Eligibility Engine with Skill-First & Alternative Pathway Support.
    Evaluates baseline qualifications while providing constructive guidance:
    - Never uses negative labels (no 'rejected', 'low student', or 'poor marks').
    - Disclaims that employer requirements vary by role and firm.
    - Enables Skill-First pathways for non-IT, non-degree, or career-change students.
    """

    @staticmethod
    def evaluate_career_eligibility(career: Career, student: Student) -> Tuple[bool, List[str]]:
        reasons = []
        is_eligible = True

        student_edu_level = "12th Standard"
        student_stream = "Any"
        student_marks = 60.0

        if student.profile:
            if student.profile.education_status:
                student_edu_level = student.profile.education_status
            elif student.profile.education_level:
                student_edu_level = student.profile.education_level

            if student.profile.background_stream:
                student_stream = student.profile.background_stream
            elif student.profile.stream:
                student_stream = student.profile.stream

            if student.profile.gpa_or_percentage is not None:
                student_marks = student.profile.gpa_or_percentage

        student_rank = EDUCATION_LEVEL_RANK.get(student_edu_level, 1)
        required_rank = EDUCATION_LEVEL_RANK.get(career.minimum_education, 1)

        # A. Skill-First Pathway Evaluation
        if getattr(career, "is_skill_first", False):
            # Skill-First careers allow students with 10th/12th/Diploma/Dropout/Non-IT to enter via verified portfolio
            is_eligible = True
            reasons.append(
                "Skill-First Pathway Available: You can enter through portfolio projects, practical skills, and certifications. "
                "Degree and qualification requirements vary by employer and role. Check specific job eligibility before applying."
            )

            if student_marks < 50.0:
                reasons.append("Skills to Develop: Employers in this pathway prioritize verified skills, practice projects, and portfolio over academic scores.")
            
            return is_eligible, reasons

        # B. Traditional / Degree-Oriented Career Evaluation
        # 1. Education Level Check
        if student_rank < required_rank:
            is_eligible = False
            reasons.append(
                f"Formal qualification requirement ({career.minimum_education}) may not currently be met for certain employer tiers. "
                f"Your current profile ({student_edu_level}) can access this field through alternative stepping-stone pathways or bridging credentials."
            )

        # 2. Stream Requirement Check
        if career.required_stream and career.required_stream not in ["Any", "None"]:
            if student_stream != "Any" and career.required_stream.lower() not in student_stream.lower():
                if "vocational" not in student_stream.lower() and "diploma" not in student_stream.lower():
                    is_eligible = False
                    reasons.append(
                        f"Specialized for {career.required_stream} stream backgrounds. Additional bridging coursework or practical portfolio recommended."
                    )

        # 3. Marks Check (Constructive wording)
        if student_marks < 40.0:
            is_eligible = False
            reasons.append("Skills to Develop: Foundational academic readiness recommended before pursuing rigorous technical degree modules.")

        if is_eligible:
            reasons.append(
                f"Meets baseline academic criteria. Note: Degree and qualification requirements vary by employer and role. Check specific job eligibility before applying."
            )

        return is_eligible, reasons
