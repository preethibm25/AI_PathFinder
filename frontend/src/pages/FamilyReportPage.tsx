import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { familyApi } from '../services/api';
import { FamilyReport } from '../types';
import {
  Users2,
  HeartHandshake,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Send,
  Lock,
  Compass,
  Check,
  Award,
  Layers,
  Clock,
  Briefcase
} from 'lucide-react';

export const FamilyReportPage: React.FC = () => {
  const { user } = useAuth();
  const [report, setReport] = useState<FamilyReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Voting state
  const [selectedCareerId, setSelectedCareerId] = useState<number | null>(null);
  const [notes, setNotes] = useState<string>('');
  const [isFinalChoice, setIsFinalChoice] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await familyApi.getReport();
      setReport(res.data);
      if (user?.role === 'student' && res.data.student_preferred_career) {
        setSelectedCareerId(res.data.student_preferred_career.id);
        setNotes(res.data.student_notes || '');
      } else if (user?.role === 'parent' && res.data.parent_preferred_career) {
        setSelectedCareerId(res.data.parent_preferred_career.id);
        setNotes(res.data.parent_notes || '');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to load family report. If you are a parent, make sure you have linked to your student's account.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleSubmitVote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCareerId) {
      alert("Please choose a career option first.");
      return;
    }
    setSubmitting(true);
    setStatusMsg(null);
    try {
      const res = await familyApi.submitPreference({
        career_id: selectedCareerId,
        notes: notes,
        is_final_family_choice: isFinalChoice
      });
      setStatusMsg(res.data.message);
      await fetchReport();
      setTimeout(() => setStatusMsg(null), 4000);
    } catch (err: any) {
      alert(err.response?.data?.detail || "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-slate-500 font-medium">Loading collaborative family report...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 mx-auto flex items-center justify-center">
          <HeartHandshake className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Family Report Unavailable</h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">{error}</p>
      </div>
    );
  }

  const consensusBadges = {
    discussing: { label: 'In Family Discussion', color: 'bg-amber-100 text-amber-800 border-amber-200' },
    aligned: { label: 'Student & Parent Aligned', color: 'bg-teal-100 text-teal-800 border-teal-200' },
    finalized: { label: 'Final Family Consensus Reached', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' }
  };

  const badge = consensusBadges[report.consensus_status] || consensusBadges.discussing;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-teal-950 rounded-3xl p-6 sm:p-10 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
              <HeartHandshake className="w-3.5 h-3.5" />
              Family Decision-Support Platform
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${badge.color}`}>
              {badge.label}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Shared Decision Report: {report.student_name}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            This collaborative report is visible to both student and parent. Review options, verify course fees and durations, and record your choices.
          </p>
        </div>

        <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700 text-right text-xs space-y-1">
          <span className="text-slate-400 block font-semibold">Student Link Code</span>
          <span className="font-mono text-teal-300 font-bold text-sm">{report.student_code}</span>
          <span className="text-[10px] text-slate-400 block">Report Token: {report.report_token.slice(0, 8)}...</span>
        </div>
      </div>

      {statusMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Consensus Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Student Pick */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase text-teal-600 tracking-wider">
            Student's Preference
          </span>
          {report.student_preferred_career ? (
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">{report.student_preferred_career.title}</h3>
              <p className="text-xs text-slate-500">{report.student_preferred_career.category}</p>
              {report.student_notes && (
                <p className="text-xs text-slate-600 italic mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  "{report.student_notes}"
                </p>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No preference recorded yet.</p>
          )}
        </div>

        {/* Parent Pick */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase text-indigo-600 tracking-wider">
            Parent's Preference
          </span>
          {report.parent_preferred_career ? (
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">{report.parent_preferred_career.title}</h3>
              <p className="text-xs text-slate-500">{report.parent_preferred_career.category}</p>
              {report.parent_notes && (
                <p className="text-xs text-slate-600 italic mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  "{report.parent_notes}"
                </p>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No preference recorded yet.</p>
          )}
        </div>

        {/* Final Consensus */}
        <div className="bg-gradient-to-br from-teal-50 to-emerald-50 p-6 rounded-3xl border border-teal-200 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase text-emerald-800 tracking-wider">
            Final Family Commitment
          </span>
          {report.final_family_career ? (
            <div>
              <h3 className="text-lg font-extrabold text-emerald-950">{report.final_family_career.title}</h3>
              <span className="text-xs font-semibold text-emerald-800 block">{report.final_family_career.salary_range}</span>
              <p className="text-xs text-emerald-900 font-medium mt-2 bg-white/80 p-2.5 rounded-xl border border-teal-100">
                ✓ Shared family decision locked in. Next step: enroll in recommended course pathway.
              </p>
            </div>
          ) : (
            <p className="text-xs text-amber-800 italic">Discussion in progress. Final agreement pending.</p>
          )}
        </div>
      </div>

      {/* Top 3 Career Candidates Matrix */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <h3 className="font-extrabold text-lg text-slate-900">Top Recommended Vocational Paths for Family Review</h3>
          <p className="text-xs text-slate-500">Evaluated transparently across interests, skills, academics, and aptitude.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {report.top_recommendations.slice(0, 3).map((rec) => {
            const course = rec.related_courses && rec.related_courses.length > 0 ? rec.related_courses[0] : null;
            return (
              <div
                key={rec.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-black text-teal-600">{rec.overall_score}%</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{rec.job_outlook}</span>
                  </div>

                  <h4 className="font-extrabold text-base text-slate-900">{rec.career_title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2">{rec.description}</p>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-200/80 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Salary:</span>
                    <strong className="text-slate-800">{rec.salary_range}</strong>
                  </div>

                  {course && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Training:</span>
                        <strong className="text-slate-800">{course.duration_weeks} Weeks</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Approx Fee:</span>
                        <strong className="text-teal-700 font-bold">₹{course.approximate_cost.toLocaleString()}</strong>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Skill-First / Non-IT to Tech Career Pathway: Family Decision Support */}
      <div className="bg-gradient-to-br from-violet-50/70 via-indigo-50/50 to-teal-50/50 p-6 sm:p-8 rounded-3xl border border-violet-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-violet-200/70 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-violet-600 text-white flex items-center gap-1 shadow-sm">
                ⚡ Skill-First Pathway
              </span>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
                Non-IT to Tech Career Pathway Guide for Families
              </h3>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              How non-degree or non-IT students can prepare for tech careers through skill verification and portfolio building
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-violet-100 shadow-2xs space-y-1.5">
            <span className="text-[10px] font-bold text-violet-700 uppercase tracking-wider block">Stage 1: Foundation</span>
            <h4 className="font-bold text-sm text-slate-900">Core Practical Skills</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Targeted short vocational courses (10–16 weeks, ~₹12k–₹18k) focusing on hands-on tools (HTML/CSS, SQL, Figma, Python).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-violet-100 shadow-2xs space-y-1.5">
            <span className="text-[10px] font-bold text-violet-700 uppercase tracking-wider block">Stage 2: Practice</span>
            <h4 className="font-bold text-sm text-slate-900">Real-World Projects</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Constructing 3–5 working applications or live dashboards to solve real user problems instead of just textbook theory.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-violet-100 shadow-2xs space-y-1.5">
            <span className="text-[10px] font-bold text-violet-700 uppercase tracking-wider block">Stage 3: Proof</span>
            <h4 className="font-bold text-sm text-slate-900">Public Portfolio</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Deploying live demos and public GitHub repositories so employers can review actual code and design capability.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-violet-100 shadow-2xs space-y-1.5">
            <span className="text-[10px] font-bold text-violet-700 uppercase tracking-wider block">Stage 4: Entry</span>
            <h4 className="font-bold text-sm text-slate-900">Entry Opportunities</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Targeting junior roles, technical internships, and boutique agencies that evaluate candidates on skills rather than degrees.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/80 border border-violet-200/80 text-xs text-slate-700 space-y-1">
          <p className="font-bold text-slate-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-violet-600 flex-shrink-0" />
            <span>Family Decision Clarity & Employer Notice</span>
          </p>
          <p className="leading-relaxed text-[11px] text-slate-600">
            <strong>Important Reality Check:</strong> Degree and qualification requirements vary by employer and role. While legacy IT firms may require a university degree, startups, agencies, and freelance clients regularly hire skill-first candidates with proven portfolios.
          </p>
          <p className="text-[11px] text-slate-500 italic">
            This roadmap is an instructional preparation guide, not an employment guarantee. <strong>The final career decision remains with the student and family.</strong>
          </p>
        </div>
      </div>

      {/* Record Your Preference / Vote Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="font-extrabold text-lg text-slate-900">
            Record Your Voice ({user?.role === 'parent' ? 'Parent Preference' : 'Student Preference'})
          </h3>
          <p className="text-xs text-slate-500">
            Select the career you support and share your thoughts to help your family reach alignment.
          </p>
        </div>

        <form onSubmit={handleSubmitVote} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Select Preferred Career</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {report.top_recommendations.slice(0, 3).map((rec) => {
                const isSelected = selectedCareerId === rec.career_id;
                return (
                  <button
                    key={rec.career_id}
                    type="button"
                    onClick={() => setSelectedCareerId(rec.career_id)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-teal-500 bg-teal-50/60 ring-2 ring-teal-500/20 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm text-slate-900">{rec.career_title}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-teal-600" />}
                    </div>
                    <span className="text-xs text-teal-700 font-semibold">{rec.overall_score}% Match</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Family Discussion Comments / Rationale
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. The course duration fits our timeline and the salary outlook in this field is stable..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="final_choice"
              checked={isFinalChoice}
              onChange={(e) => setIsFinalChoice(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
            />
            <label htmlFor="final_choice" className="text-xs font-semibold text-slate-700 cursor-pointer">
              Lock this in as our agreed <strong>Final Family Decision</strong>
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting || !selectedCareerId}
            className="px-6 py-2.5 rounded-xl font-bold bg-slate-900 hover:bg-slate-800 text-white text-xs shadow-md transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            {submitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span>Save My Preference</span>
          </button>
        </form>
      </div>
    </div>
  );
};
