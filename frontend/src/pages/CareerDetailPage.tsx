import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { careerApi, familyApi } from '../services/api';
import { CareerDetail } from '../types';
import {
  Compass,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Layers,
  GraduationCap,
  BookOpen,
  Briefcase,
  TrendingUp,
  HeartHandshake,
  Check,
  FolderGit2
} from 'lucide-react';

export const CareerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [career, setCareer] = useState<CareerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [voteSaved, setVoteSaved] = useState(false);
  const [savingVote, setSavingVote] = useState(false);

  useEffect(() => {
    const fetchCareer = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await careerApi.getById(parseInt(id));
        setCareer(res.data);
      } catch (err: any) {
        setError("Failed to load career details.");
      } finally {
        setLoading(false);
      }
    };
    fetchCareer();
  }, [id]);

  const handleSelectPreference = async () => {
    if (!career) return;
    setSavingVote(true);
    try {
      await familyApi.submitPreference({
        career_id: career.id,
        notes: `Selected as student preference based on ${career.match_score || 85}% match score.`
      });
      setVoteSaved(true);
      setTimeout(() => setVoteSaved(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingVote(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-slate-500 font-medium">Loading career roadmap & AI explanation...</p>
      </div>
    );
  }

  if (!career) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-slate-600">Career not found.</p>
        <Link to="/student/recommendations" className="text-teal-600 font-bold underline">
          Back to recommendations
        </Link>
      </div>
    );
  }

  const priorityColors = {
    High: 'bg-rose-100 text-rose-800 border-rose-200',
    Medium: 'bg-amber-100 text-amber-800 border-amber-200',
    Low: 'bg-blue-100 text-blue-800 border-blue-200',
    None: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Button */}
      <Link
        to="/student/recommendations"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Career Recommendations</span>
      </Link>

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-6 sm:p-10 text-white border border-slate-700/80 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/40">
              {career.category}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              {career.job_outlook}
            </span>
            {career.is_skill_first && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/30 text-violet-300 border border-violet-400/50 flex items-center gap-1">
                ⚡ Skill-First Pathway
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {career.title}
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            {career.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-2">
            <span className="bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-700 font-semibold">
              💰 Salary Range: {career.salary_range}
            </span>
            <span className="bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-700 font-semibold">
              🎓 Minimum Education: {career.minimum_education}
            </span>
          </div>
        </div>

        {/* Right Match Score Badge & Family Vote */}
        <div className="bg-slate-800/90 p-5 rounded-2xl border border-slate-700 text-center space-y-3 min-w-[200px] shadow-lg">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
            Compatibility Score
          </span>
          <span className="text-4xl font-black bg-gradient-to-r from-teal-400 to-emerald-300 bg-clip-text text-transparent">
            {career.match_score}%
          </span>
          <p className="text-[11px] text-slate-300">
            {career.is_skill_first
              ? 'Skill-First Pathway Supported'
              : (career.is_eligible ? 'Meets Baseline Prerequisites' : 'Alternative Pathway Recommended')}
          </p>

          <button
            onClick={handleSelectPreference}
            disabled={savingVote}
            className="w-full py-2 px-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            {voteSaved ? (
              <>
                <Check className="w-3.5 h-3.5 text-slate-900" />
                <span>Marked in Family Report</span>
              </>
            ) : (
              <>
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>Vote as My Preference</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grid: AI Explanation & Sub-Scores */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): AI Narrative & Reasons */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Explanation Box */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-base text-slate-900">
                AI Career Counselling Explanation
              </h3>
            </div>

            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-5 rounded-2xl border border-slate-100">
              {career.ai_explanation}
            </div>
          </div>

          {/* Skill-First / Career Guidance Preparation Roadmap */}
          {career.learning_roadmap && career.learning_roadmap.length > 0 && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-violet-600 text-white flex items-center gap-1 shadow-sm">
                      ⚡ Skill-First Pathway
                    </span>
                    <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
                      Step-by-Step Preparation Roadmap
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Structured path: Foundation Skills → Practice Projects → Portfolio Development → Possible Entry Roles
                  </p>
                </div>
              </div>

              {/* 4 Steps Progression */}
              <div className="space-y-4">
                {career.learning_roadmap.map((step) => (
                  <div
                    key={step.step}
                    className="p-5 rounded-2xl border border-slate-200/90 bg-slate-50/60 hover:bg-slate-50 transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-xl bg-violet-600 text-white font-black text-xs flex items-center justify-center shadow-md shadow-violet-500/20">
                          {step.step}
                        </span>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-violet-700 tracking-wider">
                            Phase {step.step}: {step.phase}
                          </span>
                          <h4 className="font-bold text-sm text-slate-900">{step.title}</h4>
                        </div>
                      </div>

                      {step.recommended_timeline && (
                        <span className="text-[11px] font-semibold text-slate-600 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
                          ⏱ {step.recommended_timeline}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed pl-10">
                      {step.description}
                    </p>

                    {step.skills && step.skills.length > 0 && (
                      <div className="pl-10 flex flex-wrap gap-1.5 pt-1">
                        <span className="text-[10px] font-semibold text-slate-400 self-center mr-1">Key Focus:</span>
                        {step.skills.map((s, idx) => (
                          <span key={idx} className="px-2.5 py-0.5 rounded-lg text-[10px] font-semibold bg-white border border-slate-200 text-slate-700">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}

                    {step.projects && step.projects.length > 0 && (
                      <div className="pl-10 space-y-1.5 pt-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                          Recommended Practice Projects:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {step.projects.map((proj, idx) => (
                            <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                              <span className="font-medium text-[11px]">{proj}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {step.deliverables && step.deliverables.length > 0 && (
                      <div className="pl-10 space-y-1.5 pt-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                          Portfolio Deliverables:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {step.deliverables.map((deliv, idx) => (
                            <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800">
                              <FolderGit2 className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                              <span className="font-medium text-[11px]">{deliv}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {step.roles && step.roles.length > 0 && (
                      <div className="pl-10 space-y-1.5 pt-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                          Potential Entry Roles (Portfolio Evaluated):
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {step.roles.map((r, idx) => (
                            <span key={idx} className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-50 border border-emerald-200 text-emerald-800">
                              💼 {r}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Employer Notice inside Roadmap */}
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-xs text-amber-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0" />
                  <span>Employer Qualification & Guidance Notice</span>
                </p>
                <p className="leading-relaxed text-[11px] text-amber-900/90">
                  {career.qualification_guidance || "Degree and qualification requirements vary by employer and role. Check specific job eligibility before applying."}
                </p>
                <p className="text-[10px] text-amber-800/80 italic pt-0.5">
                  This roadmap is a structured learning and preparation guide, not an employment guarantee. The final career decision remains with the student and family.
                </p>
              </div>
            </div>
          )}

          {/* Alternative Stepping-Stone Pathways */}
          {career.alternative_pathways && career.alternative_pathways.length > 0 && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-bold text-base text-slate-900">Alternative Stepping-Stone Pathways</h3>
                <p className="text-xs text-slate-500">Accessible routes if traditional university prerequisites are currently unmet</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {career.alternative_pathways.map((pathway, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-medium text-slate-700 leading-snug">{pathway}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skill Gap Analysis Table */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">Required Skills vs Your Current Skills</h3>
                <p className="text-xs text-slate-500">Skill-gap diagnostic for {career.title}</p>
              </div>
              <Link to="/student/skill-gap" className="text-xs text-teal-600 font-semibold hover:underline">
                Full Diagnostic →
              </Link>
            </div>

            <div className="space-y-3">
              {career.skill_gaps.map((sg) => (
                <div
                  key={sg.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <span className="font-bold text-sm text-slate-900">{sg.skill_name}</span>
                      <span className="text-[10px] text-slate-500 ml-2">({sg.category})</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <span>Current: <strong>Lvl {sg.current_level}</strong></span>
                      <span>Target: <strong>Lvl {sg.required_level}</strong></span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${priorityColors[sg.priority]}`}>
                        {sg.priority} Gap ({sg.gap})
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-snug">
                    {sg.learning_recommendation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Vocational Courses */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">Recommended Vocational Courses</h3>
                <p className="text-xs text-slate-500">Targeted programs to close skill gaps and gain certification</p>
              </div>
              <Link to="/student/courses" className="text-xs text-teal-600 font-semibold hover:underline">
                View All Courses →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {career.recommended_courses.map((course) => (
                <div
                  key={course.id}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-teal-500/50 transition-all bg-white space-y-2 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                      {course.provider}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 mt-1">{course.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{course.description}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700">⏱ {course.duration_weeks} Weeks</span>
                    <span className="font-bold text-teal-700">₹{course.approximate_cost.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Sub-Scores & Job Roles */}
        <div className="space-y-6">
          {/* Sub-scores Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900">6 Dimension Sub-Scores</h3>
            <div className="space-y-3 text-xs">
              {[
                { label: 'Interest Match', weight: '30%', score: career.sub_scores?.interest || 75 },
                { label: 'Skill Match', weight: '20%', score: career.sub_scores?.skill || 70 },
                { label: 'Academic Match', weight: '15%', score: career.sub_scores?.academic || 80 },
                { label: 'Aptitude Match', weight: '15%', score: career.sub_scores?.aptitude || 75 },
                { label: 'Strength Match', weight: '10%', score: career.sub_scores?.strength || 70 },
                { label: 'Preference Match', weight: '10%', score: career.sub_scores?.preference || 70 },
              ].map((sub, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between items-center text-slate-700 font-medium">
                    <span>{sub.label} ({sub.weight})</span>
                    <span className="font-bold text-teal-700">{sub.score}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-500 rounded-full"
                      style={{ width: `${sub.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Job Roles */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-base text-slate-900">Typical Job Roles</h3>
            <ul className="space-y-2 text-xs">
              {career.job_roles.map((role, idx) => (
                <li key={idx} className="flex items-center gap-2 text-slate-700">
                  <Briefcase className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                  <span>{role}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Family Decision Callout */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 p-5 rounded-3xl space-y-3">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
              <HeartHandshake className="w-4 h-4" />
              <span>Family Decision Tip</span>
            </div>
            <p className="text-xs text-amber-900/90 leading-relaxed">
              Compare this career with 1 or 2 alternative options in the Family Decision Report before committing to course fees.
            </p>
            <Link
              to="/family/report"
              className="inline-block text-xs font-bold text-amber-800 underline hover:text-amber-900"
            >
              Open Shared Family Report →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
