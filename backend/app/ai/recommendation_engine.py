from abc import ABC, abstractmethod
from typing import List, Dict, Any, Tuple
from app.config import settings
from app.database.models import Student, Career, SkillGap
from app.ai.rules_engine import EligibilityEngine

class RecommendationEngineBase(ABC):
    """
    Pluggable abstract interface for recommendation engines.
    Allows seamlessly swapping the weighted scoring engine for a trained scikit-learn/ML model later.
    """
    @abstractmethod
    def evaluate_career(self, student: Student, career: Career) -> Dict[str, Any]:
        pass

class WeightedRecommendationEngine(RecommendationEngineBase):
    """
    Transparent Weighted Recommendation Engine.
    Formula:
    Career Score = Interest × 0.30 + Skill × 0.20 + Academic × 0.15 + Aptitude × 0.15 + Strength × 0.10 + Preference × 0.10
    Weights are pulled dynamically from settings.
    """

    def __init__(self):
        self.w_interest = settings.WEIGHT_INTEREST
        self.w_skill = settings.WEIGHT_SKILL
        self.w_academic = settings.WEIGHT_ACADEMIC
        self.w_aptitude = settings.WEIGHT_APTITUDE
        self.w_strength = settings.WEIGHT_STRENGTH
        self.w_preference = settings.WEIGHT_PREFERENCE

    def calculate_interest_score(self, student: Student, career: Career) -> Tuple[float, List[str]]:
        reasons = []
        preferred_interests = [i.lower() for i in (career.preferred_interests or [])]
        if not preferred_interests:
            return 75.0, []

        student_interests = {si.interest.name.lower(): si.interest_level for si in student.interests if si.interest}
        if not student_interests:
            return 50.0, ["Exploration recommended: Profile does not yet have rated interests."]

        matched_ratings = []
        matched_names = []
        for pref in preferred_interests:
            for s_name, rating in student_interests.items():
                if pref in s_name or s_name in pref:
                    matched_ratings.append(rating / 5.0)
                    matched_names.append(s_name.title())

        if matched_ratings:
            score = (sum(matched_ratings) / len(preferred_interests)) * 100.0
            score = min(100.0, max(20.0, score))
            reasons.append(f"Strong interest alignment with: {', '.join(set(matched_names[:3]))}")
            return score, reasons
        else:
            return 35.0, ["Different interest domain than your primary selections."]

    def calculate_skill_score(self, student: Student, career: Career) -> Tuple[float, List[Dict[str, Any]], List[str]]:
        reasons = []
        gaps = []
        career_skills = career.skills
        if not career_skills:
            return 75.0, [], []

        student_skills = {ss.skill.name.lower(): ss.proficiency_level for ss in student.skills if ss.skill}

        total_weight = 0.0
        weighted_score_sum = 0.0
        acquired_skills = []

        for cs in career_skills:
            skill_name = cs.skill.name if cs.skill else "Skill"
            skill_name_lower = skill_name.lower()
            required_lvl = cs.required_level or 3
            imp_weight = cs.importance_weight or 1.0
            total_weight += imp_weight

            student_lvl = 0
            for s_k, s_v in student_skills.items():
                if skill_name_lower in s_k or s_k in skill_name_lower:
                    student_lvl = max(student_lvl, s_v)

            # Score fraction
            match_ratio = min(1.0, student_lvl / required_lvl)
            weighted_score_sum += match_ratio * imp_weight

            gap = max(0, required_lvl - student_lvl)
            priority = "None"
            if gap >= 3 or (required_lvl >= 4 and student_lvl == 0):
                priority = "High"
            elif gap == 2:
                priority = "Medium"
            elif gap == 1:
                priority = "Low"

            learning_rec = ""
            if gap > 0:
                learning_rec = f"Enroll in foundational/practical module to bridge {skill_name} from level {student_lvl} to {required_lvl}."
            else:
                learning_rec = f"Proficiency verified: Student meets target level {required_lvl}."
                acquired_skills.append(skill_name)

            gaps.append({
                "skill_id": cs.skill_id,
                "skill_name": skill_name,
                "category": cs.skill.category if cs.skill else "General",
                "current_level": student_lvl,
                "required_level": required_lvl,
                "gap": gap,
                "priority": priority,
                "learning_recommendation": learning_rec
            })

        skill_score = (weighted_score_sum / total_weight) * 100.0 if total_weight > 0 else 70.0
        if acquired_skills:
            reasons.append(f"Possesses foundational skills in: {', '.join(acquired_skills[:3])}")
        else:
            reasons.append(f"Prerequisite skills need to be acquired through vocational training.")

        return min(100.0, max(15.0, skill_score)), gaps, reasons

    def calculate_academic_score(self, student: Student, career: Career) -> Tuple[float, List[str]]:
        reasons = []
        base_score = 65.0

        if student.profile:
            marks = student.profile.gpa_or_percentage or 60.0
            base_score = min(98.0, max(45.0, marks))

            student_stream = student.profile.background_stream or student.profile.stream or ""

            if getattr(career, "is_skill_first", False):
                # For Skill-First pathways, academic stream is not penalized
                base_score = max(65.0, base_score)
                reasons.append("Skill-First Evaluation: Academic background evaluated as secondary to practical portfolio and skill readiness.")
            elif student_stream and career.required_stream:
                if career.required_stream.lower() in student_stream.lower():
                    base_score = min(100.0, base_score + 10.0)
                    reasons.append(f"Academic stream ({student_stream}) matches career discipline.")
                elif career.required_stream not in ["Any", "None"]:
                    base_score = max(35.0, base_score - 15.0)

        if not reasons:
            reasons.append("Standard academic eligibility satisfied.")

        return base_score, reasons

    def calculate_aptitude_score(self, student: Student, career: Career) -> Tuple[float, List[str]]:
        reasons = []
        if not student.aptitude_results:
            return 60.0, ["Aptitude assessment pending: Default baseline applied."]

        result = student.aptitude_results[-1]
        req_profile = career.required_aptitude_profile or {}

        # Default benchmarks if not specified
        benchmarks = {
            "logical": req_profile.get("Logical", 60.0),
            "numerical": req_profile.get("Numerical", 55.0),
            "verbal": req_profile.get("Verbal", 50.0),
            "analytical": req_profile.get("Analytical", 60.0),
            "problem_solving": req_profile.get("Problem Solving", 60.0),
        }

        scores = {
            "logical": result.logical_score,
            "numerical": result.numerical_score,
            "verbal": result.verbal_score,
            "analytical": result.analytical_score,
            "problem_solving": result.problem_solving_score,
        }

        matches = []
        high_performers = []
        for cat, bench in benchmarks.items():
            actual = scores.get(cat, 50.0)
            ratio = min(1.2, actual / max(1.0, bench))
            matches.append(ratio)
            if actual >= 70.0:
                high_performers.append(cat.replace("_", " ").title())

        avg_ratio = sum(matches) / len(matches)
        aptitude_score = min(100.0, max(25.0, avg_ratio * 80.0))

        if high_performers:
            reasons.append(f"Strong aptitude in: {', '.join(high_performers[:2])}")
        else:
            reasons.append("Balanced aptitude profile across evaluated cognitive domains.")

        return aptitude_score, reasons

    def calculate_strength_score(self, student: Student, career: Career) -> Tuple[float, List[str]]:
        reasons = []
        student_strengths = [s.strength.name.lower() for s in student.strengths if s.strength]
        if not student_strengths:
            return 60.0, []

        career_text = (career.title + " " + career.description + " " + career.category).lower()
        matched_strengths = []
        for s in student_strengths:
            if s in career_text or any(word in career_text for word in s.split()):
                matched_strengths.append(s.title())

        if matched_strengths:
            score = 75.0 + min(25.0, len(matched_strengths) * 10.0)
            reasons.append(f"Personal strengths match role demands: {', '.join(matched_strengths[:2])}")
            return score, reasons
        else:
            return 60.0, []

    def calculate_preference_score(self, student: Student, career: Career) -> Tuple[float, List[str]]:
        reasons = []
        score = 70.0
        prefs = student.preferences
        if not prefs:
            return score, []

        # Work environment
        if prefs.preferred_work_env and prefs.preferred_work_env.lower() in career.description.lower():
            score += 15.0
            reasons.append(f"Work environment matches preference ({prefs.preferred_work_env}).")

        # Preferred industry
        if prefs.preferred_industry and (prefs.preferred_industry.lower() in career.category.lower() or prefs.preferred_industry.lower() in career.description.lower()):
            score += 15.0
            reasons.append(f"Industry sector aligns with student's goal ({prefs.preferred_industry}).")

        return min(100.0, max(30.0, score)), reasons

    def evaluate_career(self, student: Student, career: Career) -> Dict[str, Any]:
        # 1. Check Rule-based Eligibility
        is_eligible, eligibility_notes = EligibilityEngine.evaluate_career_eligibility(career, student)

        # 2. Calculate Sub-Scores
        interest_score, interest_reasons = self.calculate_interest_score(student, career)
        skill_score, skill_gaps, skill_reasons = self.calculate_skill_score(student, career)
        academic_score, academic_reasons = self.calculate_academic_score(student, career)
        aptitude_score, aptitude_reasons = self.calculate_aptitude_score(student, career)
        strength_score, strength_reasons = self.calculate_strength_score(student, career)
        preference_score, preference_reasons = self.calculate_preference_score(student, career)

        # 3. Weighted Composite Formula
        composite = (
            (interest_score * self.w_interest) +
            (skill_score * self.w_skill) +
            (academic_score * self.w_academic) +
            (aptitude_score * self.w_aptitude) +
            (strength_score * self.w_strength) +
            (preference_score * self.w_preference)
        )

        # If ineligible, adjust composite score transparently so it does not rank as primary recommendation
        final_score = composite
        if not is_eligible:
            final_score = min(final_score, 50.0)

        # Check transition mode (e.g. Non-IT to Tech or Career Switch)
        is_transitioning = False
        if student.profile and student.profile.career_transition:
            trans = student.profile.career_transition.lower()
            if any(k in trans for k in ["non-it", "career change", "self-taught", "low academic", "diploma", "switch"]):
                is_transitioning = True

        all_reasons = interest_reasons + skill_reasons + academic_reasons + aptitude_reasons + strength_reasons + preference_reasons

        # If student is transitioning and this is a skill-first career, provide positive bridge boost
        if getattr(career, "is_skill_first", False):
            stream_val = (student.profile.background_stream if student.profile else "") or ""
            if is_transitioning or ("computer" not in stream_val.lower()):
                final_score = min(95.0, final_score + 8.0)
                all_reasons.insert(0, "⚡ Skill-First Tech Bridge: Highly recommended pathway. Employers prioritize verified project work, GitHub portfolios, and skills over formal degrees.")

        return {
            "career_id": career.id,
            "overall_score": round(final_score, 1),
            "interest_match": round(interest_score, 1),
            "skill_match": round(skill_score, 1),
            "academic_match": round(academic_score, 1),
            "aptitude_match": round(aptitude_score, 1),
            "strength_match": round(strength_score, 1),
            "preference_match": round(preference_score, 1),
            "is_eligible": is_eligible,
            "eligibility_notes": "; ".join(eligibility_notes),
            "reasons": all_reasons,
            "skill_gaps": skill_gaps,
            "is_skill_first": getattr(career, "is_skill_first", False),
            "learning_roadmap": getattr(career, "learning_roadmap", []) or [],
            "alternative_pathways": getattr(career, "alternative_pathways", []) or [],
            "qualification_guidance": getattr(career, "qualification_guidance", "Degree and qualification requirements vary by employer and role. Check specific job eligibility before applying.")
        }

class MLRecommendationEngineStub(RecommendationEngineBase):
    """
    Pluggable scikit-learn ML recommendation model architecture.
    Provides the same API interface as the weighted engine so a pre-trained
    model can be plugged in when empirical dataset becomes available.
    """
    def __init__(self, model_path: str = None):
        self.model_path = model_path
        self.fallback_engine = WeightedRecommendationEngine()

    def evaluate_career(self, student: Student, career: Career) -> Dict[str, Any]:
        # If trained model artifact exists, load and predict; otherwise fallback safely
        return self.fallback_engine.evaluate_career(student, career)

# Global recommendation engine instance
recommendation_engine = WeightedRecommendationEngine()
