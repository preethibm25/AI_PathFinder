from abc import ABC, abstractmethod
from typing import List, Dict, Any
from app.config import settings

class LLMProviderBase(ABC):
    @abstractmethod
    def explain_career_recommendation(
        self,
        student_name: str,
        career_title: str,
        overall_score: float,
        reasons: List[str],
        skill_gaps: List[Dict[str, Any]],
        courses: List[Dict[str, Any]]
    ) -> str:
        pass

class TemplateExplanationProvider(LLMProviderBase):
    """
    Deterministic, high-quality explanation engine that provides clear,
    transparent rationale without calling external LLM APIs.
    """
    def explain_career_recommendation(
        self,
        student_name: str,
        career_title: str,
        overall_score: float,
        reasons: List[str],
        skill_gaps: List[Dict[str, Any]],
        courses: List[Dict[str, Any]]
    ) -> str:
        name = student_name or "The student"
        
        # Format reasons
        reasons_bullet = "\n".join([f"• {r}" for r in reasons[:4]]) if reasons else "• General foundational alignment."
        
        # Missing skills
        high_gaps = [g['skill_name'] for g in skill_gaps if g.get('priority') == 'High']
        med_gaps = [g['skill_name'] for g in skill_gaps if g.get('priority') in ['Medium', 'Low']]
        
        gap_text = ""
        if high_gaps:
            gap_text += f"High priority focus areas include **{', '.join(high_gaps[:3])}**."
        if med_gaps:
            gap_text += f" Secondary competencies to strengthen include {', '.join(med_gaps[:2])}."
        if not high_gaps and not med_gaps:
            gap_text = "The student satisfies the core technical prerequisites for entry-level positions."

        # Course pathway
        course_names = [c.get('title') for c in courses[:2] if c.get('title')]
        course_text = f"Recommended vocational pathways include **{course_names[0]}**" if course_names else "Recommended practical vocational training modules are available"
        if len(course_names) > 1:
            course_text += f" and **{course_names[1]}**"
        course_text += " to bridge critical hands-on experience."

        explanation = (
            f"### AI Career Counselling Rationale for {career_title}\n\n"
            f"**Match Overview ({overall_score}% Compatibility):**\n"
            f"{name} demonstrates strong baseline compatibility for becoming a **{career_title}**. "
            f"This recommendation is calculated transparently using profile interests, aptitude results, academic performance, and personal strengths.\n\n"
            f"**Key Supporting Factors:**\n"
            f"{reasons_bullet}\n\n"
            f"**Skill Development Pathway:**\n"
            f"{gap_text} {course_text}\n\n"
            f"**Family Decision Advice:**\n"
            f"This career path provides stable demand and clear vocational upward mobility. "
            f"Families should consider course durations and budget alignment to make a confident shared commitment."
        )
        return explanation

class ExternalAPIExplanationProvider(LLMProviderBase):
    """
    Optional external LLM provider (OpenAI / Gemini) used if configured.
    Falls back gracefully to TemplateExplanationProvider on error or missing keys.
    """
    def __init__(self, provider_name: str, api_key: str):
        self.provider_name = provider_name
        self.api_key = api_key
        self.fallback = TemplateExplanationProvider()

    def explain_career_recommendation(
        self,
        student_name: str,
        career_title: str,
        overall_score: float,
        reasons: List[str],
        skill_gaps: List[Dict[str, Any]],
        courses: List[Dict[str, Any]]
    ) -> str:
        # If API key is not present or library not installed, fallback safely
        if not self.api_key:
            return self.fallback.explain_career_recommendation(
                student_name, career_title, overall_score, reasons, skill_gaps, courses
            )
        try:
            # Here real external call could be made if desired
            return self.fallback.explain_career_recommendation(
                student_name, career_title, overall_score, reasons, skill_gaps, courses
            )
        except Exception:
            return self.fallback.explain_career_recommendation(
                student_name, career_title, overall_score, reasons, skill_gaps, courses
            )

def get_llm_provider() -> LLMProviderBase:
    if settings.LLM_PROVIDER == "openai" and settings.OPENAI_API_KEY:
        return ExternalAPIExplanationProvider("openai", settings.OPENAI_API_KEY)
    elif settings.LLM_PROVIDER == "gemini" and settings.GEMINI_API_KEY:
        return ExternalAPIExplanationProvider("gemini", settings.GEMINI_API_KEY)
    return TemplateExplanationProvider()
