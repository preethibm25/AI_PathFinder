import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { familyApi } from '../services/api';
import { FamilyReport } from '../types';
import {
  HeartHandshake,
  Users2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  BrainCircuit,
  Lock,
  Layers,
  Sparkles,
  BookOpen,
  LogOut
} from 'lucide-react';

export const ParentDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [report, setReport] = useState<FamilyReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [studentCodeInput, setStudentCodeInput] = useState('');
  const [linking, setLinking] = useState(false);
  const [linkMsg, setLinkMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await familyApi.getReport();
      setReport(res.data);
    } catch (err: any) {
      // If no student linked yet, report will fail with 404
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleLinkStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentCodeInput.trim()) return;
    setLinking(true);
    setLinkMsg(null);

    try {
      const res = await familyApi.linkStudent(studentCodeInput.trim());
      setLinkMsg({ type: 'success', text: res.data.message });
      setStudentCodeInput('');
      await fetchReport();
    } catch (err: any) {
      setLinkMsg({
        type: 'error',
        text: err.response?.data?.detail || "Linking failed. Please check the student code."
      });
    } finally {
      setLinking(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Parent Decision Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {user?.full_name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Review your child's career aptitude diagnostics, inspect course fee schedules, and collaborate on final career choices.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs bg-slate-800/80 px-4 py-2.5 rounded-2xl border border-slate-700 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-teal-400 flex-shrink-0" />
            <span>Student Assessment Integrity Protected (Read-Only)</span>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 hover:text-rose-200 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Log out of Parent Hub"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Link Student Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div>
          <h3 className="font-bold text-base text-slate-900">Link with Your Student's Account</h3>
          <p className="text-xs text-slate-500">
            Ask your student for their unique 8-character invitation code (e.g. <code>STU-88219</code>) from their dashboard.
          </p>
        </div>

        {linkMsg && (
          <div className={`p-4 rounded-xl text-xs flex items-center gap-2 border ${
            linkMsg.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-700'
          }`}>
            {linkMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            )}
            <span>{linkMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleLinkStudent} className="flex flex-col sm:flex-row gap-3 max-w-lg">
          <input
            type="text"
            required
            value={studentCodeInput}
            onChange={(e) => setStudentCodeInput(e.target.value)}
            placeholder="Enter Student Code (e.g. STU-88219)"
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button
            type="submit"
            disabled={linking}
            className="px-6 py-2.5 rounded-xl font-bold bg-teal-600 hover:bg-teal-500 text-white text-xs shadow-md transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {linking ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Users2 className="w-4 h-4" />
            )}
            <span>Link Student</span>
          </button>
        </form>
      </div>

      {/* Linked Student Overview */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-500">
          Checking linked student records...
        </div>
      ) : report ? (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-teal-600 tracking-wider">
                  Linked Student Profile
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
                  {report.student_name}
                </h3>
                <p className="text-xs text-slate-500">
                  ID: <span className="font-mono font-bold text-slate-700">{report.student_code}</span> • Qualification: {report.education_level || '12th Standard'}
                </p>
              </div>

              <Link
                to="/family/report"
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <span>Open Full Decision Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Aptitude Snapshot */}
            {report.aptitude_summary ? (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <BrainCircuit className="w-4 h-4 text-teal-600" />
                    Cognitive Aptitude Diagnostic Result
                  </span>
                  <span className="text-teal-700 font-extrabold">{report.aptitude_summary.percentage}% Overall</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[11px] pt-1">
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 block">Logical</span>
                    <strong className="text-slate-800">{report.aptitude_summary.logical_score}%</strong>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 block">Numerical</span>
                    <strong className="text-slate-800">{report.aptitude_summary.numerical_score}%</strong>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 block">Verbal</span>
                    <strong className="text-slate-800">{report.aptitude_summary.verbal_score}%</strong>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 block">Analytical</span>
                    <strong className="text-slate-800">{report.aptitude_summary.analytical_score}%</strong>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 block">Problem Solving</span>
                    <strong className="text-slate-800">{report.aptitude_summary.problem_solving_score}%</strong>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">Student has not yet completed the aptitude test.</p>
            )}

            {/* Top 3 Recommendations Preview */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-slate-900">Top Recommended Vocational Careers</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {report.top_recommendations.slice(0, 3).map((rec) => (
                  <div
                    key={rec.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-teal-400/50 transition-all space-y-2 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-black text-teal-600">{rec.overall_score}%</span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-semibold">
                          {rec.salary_range}
                        </span>
                      </div>
                      <h5 className="font-bold text-sm text-slate-900 mt-1">{rec.career_title}</h5>
                      <p className="text-xs text-slate-500 line-clamp-2">{rec.description}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                      <span className="text-[11px] text-slate-400">
                        {rec.related_courses && rec.related_courses[0] ? `⏱ ${rec.related_courses[0].duration_weeks} wks` : 'Vocational'}
                      </span>
                      <Link
                        to={`/student/career/${rec.career_id}`}
                        className="text-xs font-bold text-teal-600 hover:underline"
                      >
                        View Info →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 text-center space-y-3">
          <HeartHandshake className="w-10 h-10 text-slate-400 mx-auto" />
          <h4 className="font-bold text-slate-700">No Student Linked Yet</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Please enter your student's unique invitation code above to begin reviewing their recommendations.
          </p>
        </div>
      )}
    </div>
  );
};
