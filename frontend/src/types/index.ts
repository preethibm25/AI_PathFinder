export interface User {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  role: 'student' | 'parent' | 'admin';
  education_level?: string;
  state?: string;
  preferred_language?: string;
  student_code?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface StudentSkill {
  skill_id: number;
  name: string;
  category: string;
  proficiency_level: number;
}

export interface StudentInterest {
  interest_id: number;
  name: string;
  category: string;
  interest_level: number;
}

export interface StudentStrength {
  strength_id: number;
  name: string;
  category: string;
}

export interface AcademicRecord {
  level: string;
  board_or_univ?: string;
  stream?: string;
  marks_percentage: number;
  passing_year?: number;
}

export interface Preferences {
  preferred_work_env: string;
  preferred_industry: string;
  budget_max: number;
  max_course_duration_months: number;
  location_type: string;
  expected_salary_min: number;
  work_style: string;
}

export interface AptitudeSummary {
  total_score: number;
  percentage: number;
  logical_score: number;
  numerical_score: number;
  verbal_score: number;
  analytical_score: number;
  problem_solving_score: number;
  completed_at?: string;
}

export interface RoadmapStep {
  step: number;
  phase: string;
  title: string;
  description: string;
  skills?: string[];
  projects?: string[];
  deliverables?: string[];
  roles?: string[];
  recommended_timeline?: string;
  guidance_note?: string;
}

export interface StudentProfileData {
  student_id: number;
  student_code: string;
  full_name: string;
  email: string;
  completion_percentage: number;
  has_profile: boolean;
  has_skills: boolean;
  has_interests: boolean;
  has_strengths: boolean;
  has_academics: boolean;
  has_preferences: boolean;
  has_aptitude: boolean;
  education_level?: string;
  education_status?: string;
  background_stream?: string;
  career_transition?: string;
  stream?: string;
  gpa_or_percentage?: number;
  school_college?: string;
  graduation_year?: number;
  skills: StudentSkill[];
  interests: StudentInterest[];
  strengths: StudentStrength[];
  academic_records: AcademicRecord[];
  preferences?: Preferences;
  aptitude_summary?: AptitudeSummary;
}

export interface Question {
  id: number;
  category: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
}

export interface AssessmentResult {
  id: number;
  logical_score: number;
  numerical_score: number;
  verbal_score: number;
  analytical_score: number;
  problem_solving_score: number;
  total_score: number;
  percentage: number;
  completed_at: string;
  category_breakdown: Record<string, { score: number; correct?: number; total?: number }>;
}

export interface SkillGapItem {
  id: number;
  skill_id: number;
  skill_name: string;
  category: string;
  current_level: number;
  required_level: number;
  gap: number;
  priority: 'High' | 'Medium' | 'Low' | 'None';
  learning_recommendation?: string;
}

export interface Course {
  id: number;
  title: string;
  provider: string;
  duration_weeks: number;
  approximate_cost: number;
  eligibility: string;
  description?: string;
  mode: string;
  certification_type: string;
  level: string;
  skills_covered: string[];
}

export interface Recommendation {
  id: number;
  career_id: number;
  career_title: string;
  category: string;
  description: string;
  salary_range: string;
  job_outlook: string;
  overall_score: number;
  interest_match: number;
  skill_match: number;
  academic_match: number;
  aptitude_match: number;
  strength_match: number;
  preference_match: number;
  is_eligible: boolean;
  eligibility_notes?: string;
  reasons: string[];
  required_skills: { skill_id: number; name: string; required_level: number }[];
  skill_gaps: SkillGapItem[];
  related_courses: Course[];
  job_roles: string[];
  is_skill_first?: boolean;
  learning_roadmap?: RoadmapStep[];
  alternative_pathways?: string[];
  qualification_guidance?: string;
}

export interface CareerDetail {
  id: number;
  title: string;
  category: string;
  description: string;
  salary_range: string;
  job_outlook: string;
  minimum_education: string;
  required_stream: string;
  job_roles: string[];
  is_skill_first?: boolean;
  learning_roadmap?: RoadmapStep[];
  alternative_pathways?: string[];
  qualification_guidance?: string;
  match_score?: number;
  sub_scores?: Record<string, number>;
  is_eligible?: boolean;
  eligibility_notes?: string;
  why_it_matches?: string[];
  required_skills: { skill_id: number; name: string; category: string; required_level: number }[];
  student_skills: { skill_id: number; name: string; proficiency_level: number }[];
  skill_gaps: SkillGapItem[];
  recommended_courses: Course[];
  ai_explanation?: string;
}

export interface CareerComparison {
  id: number;
  title: string;
  category: string;
  description: string;
  salary_range: string;
  job_outlook: string;
  overall_score: number;
  interest_match: number;
  skill_match: number;
  academic_match: number;
  aptitude_match: number;
  preference_match: number;
  education_required: string;
  average_course_cost: number;
  average_course_duration_weeks: number;
  job_roles: string[];
  required_skills_count: number;
  skill_gap_count: number;
  skills_summary: { name: string; required: number; current: number }[];
  courses_summary: { title: string; duration: number; cost: number }[];
}

export interface FamilyReport {
  id: number;
  report_token: string;
  student_id: number;
  student_name: string;
  student_code: string;
  education_level?: string;
  aptitude_summary?: AptitudeSummary;
  top_recommendations: Recommendation[];
  student_preferred_career?: { id: number; title: string; category: string; salary_range: string };
  parent_preferred_career?: { id: number; title: string; category: string; salary_range: string };
  final_family_career?: { id: number; title: string; category: string; salary_range: string };
  student_notes?: string;
  parent_notes?: string;
  consensus_status: 'discussing' | 'aligned' | 'finalized';
  created_at: string;
  updated_at: string;
}

export interface MasterOptions {
  skills: { id: number; name: string; category: string; description?: string }[];
  interests: { id: number; name: string; category: string; description?: string }[];
  strengths: { id: number; name: string; category: string; description?: string }[];
  education_levels: string[];
  education_statuses?: string[];
  background_streams?: string[];
  career_transitions?: string[];
  streams: string[];
  work_environments: string[];
  industries: string[];
}
