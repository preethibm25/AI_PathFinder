import numpy as np
from typing import Dict, Any, List
from app.database.models import Student, Career

class FeaturePipeline:
    """
    Feature preparation pipeline for career counselling.
    Converts student profile inputs into normalized numeric vectors.
    """

    @staticmethod
    def extract_student_features(student: Student, master_skills: List[str], master_interests: List[str]) -> Dict[str, Any]:
        # Skill vector (0 to 5)
        student_skill_map = {ss.skill.name.lower(): ss.proficiency_level for ss in student.skills if ss.skill}
        skill_vector = np.array([student_skill_map.get(s.lower(), 0) for s in master_skills], dtype=float)

        # Interest vector (1 to 5)
        student_interest_map = {si.interest.name.lower(): si.interest_level for si in student.interests if si.interest}
        interest_vector = np.array([student_interest_map.get(i.lower(), 0) for i in master_interests], dtype=float)

        # Academic score normalized (0 to 1)
        academic_score = 0.6
        if student.profile and student.profile.gpa_or_percentage is not None:
            academic_score = min(1.0, max(0.0, student.profile.gpa_or_percentage / 100.0))

        # Aptitude vector normalized (0 to 1)
        aptitude_map = {"logical": 0.5, "numerical": 0.5, "verbal": 0.5, "analytical": 0.5, "problem_solving": 0.5}
        if student.aptitude_results:
            latest = student.aptitude_results[-1]
            aptitude_map = {
                "logical": latest.logical_score / 100.0,
                "numerical": latest.numerical_score / 100.0,
                "verbal": latest.verbal_score / 100.0,
                "analytical": latest.analytical_score / 100.0,
                "problem_solving": latest.problem_solving_score / 100.0
            }

        # Strengths set
        strength_names = [st.strength.name.lower() for st in student.strengths if st.strength]

        # Preferences
        prefs = student.preferences

        return {
            "skill_vector": skill_vector,
            "interest_vector": interest_vector,
            "academic_score": academic_score,
            "aptitude_map": aptitude_map,
            "strengths": strength_names,
            "preferences": prefs
        }
