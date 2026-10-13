import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { profileApi, recommendationApi, familyApi } from '../services/api';
import { StudentProfileData, Recommendation } from '../types';
import {
  Compass,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  BrainCircuit,
  FileCheck2,
  Layers,
  Users2,
  TrendingUp,
  AlertTriangle,
  BookOpen,
  UserCheck,
  LogOut
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';

export const StudentDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<StudentProfileData | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [familyStatus, setFamilyStatus] = useState<string>('discussing');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [profRes, recRes, famRes] = await Promise.allSettled([
          profileApi.getProfile(),
          recommendationApi.getAll(),
          familyApi.getReport()
        ]);

        if (profRes.status === 'fulfilled') {
          setProfile(profRes.value.data);
        }
        if (recRes.status === 'fulfilled') {
          setRecommendations(recRes.value.data);
        }
        if (famRes.status === 'fulfilled') {
          setFamilyStatus(famRes.value.data.consensus_status);
        }
      } catch (err: any) {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-slate-500 font-medium">Loading your career dashboard...</p>
      </div>
    );
  }

  const topCareer = recommendations.length > 0 ? recommendations[0] : null;
  const topThree = recommendations.slice(0, 3);

  // Radar chart data for aptitude
  const aptitudeData = profile?.aptitude_summary ? [
    { subject: 'Logical', score: profile.aptitude_summary.logical_score, fullMark: 100 },
    { subject: 'Numerical', score: profile.aptitude_summary.numerical_score, fullMark: 100 },
    { subject: 'Verbal', score: profile.aptitude_summary.verbal_score, fullMark: 100 },
    { subject: 'Analytical', score: profile.aptitude_summary.analytical_score, fullMark: 100 },
    { subject: 'Problem Solving', score: profile.aptitude_summary.problem_solving_score, fullMark: 100 },
  ] : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-teal-950 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Student Dashboard</span>
            {user?.student_code && (
              <span className="font-mono bg-teal-950 px-2 py-0.5 rounded border border-teal-700/60">
                Code: {user.student_code}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.full_name}!
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
            Track your 6 input dimensions, review aptitude evaluation metrics, and explore transparent career recommendations with your family.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/student/assessment"
            className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-1.5"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>{profile?.has_aptitude ? 'Retake Aptitude Test' : 'Start Aptitude Test'}</span>
          </Link>
          <Link
            to="/family/report"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <Users2 className="w-4 h-4 text-amber-400" />
            <span>Family Decision Report</span>
          </Link>
          <button
            onClick={logout}
            className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 hover:text-rose-200 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Log Out of your student account"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Profile Completion */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">6 Inputs Completion</span>
            <span className="font-bold text-teal-600">{profile?.completion_percentage || 0}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${profile?.completion_percentage || 0}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-slate-500 pt-1">
            {profile?.completion_percentage === 100 ? (
              <span className="text-emerald-600 font-medium">✓ All 6 inputs configured</span>
            ) : (
              <Link to="/student/profile" className="text-teal-600 hover:underline">
                Complete missing inputs →
              </Link>
            )}
          </p>
        </div>

        {/* Aptitude Result */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Aptitude Score</span>
            <BrainCircuit className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">
              {profile?.aptitude_summary ? `${profile.aptitude_summary.percentage}%` : 'Pending'}
            </span>
            {profile?.aptitude_summary && (
              <span className="text-xs text-slate-500">
                ({profile.aptitude_summary.total_score} correct)
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500">
            {profile?.has_aptitude ? 'Diagnostics verified across 5 categories' : 'Take 30-question diagnostic'}
          </p>
        </div>

        {/* Top Match */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Top Match</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2 truncate">
            <span className="text-lg font-bold text-slate-900 truncate">
              {topCareer ? topCareer.career_title : 'Calculating...'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            {topCareer ? `${topCareer.overall_score}% Weighted Compatibility` : 'Complete profile to see match'}
          </p>
        </div>

        {/* Family Status */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wider">Family Consensus</span>
            <Users2 className="w-4 h-4 text-teal-600" />
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
              familyStatus === 'aligned' || familyStatus === 'finalized'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}>
              {familyStatus}
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            <Link to="/family/report" className="text-teal-600 hover:underline">
              View joint decision report →
            </Link>
          </p>
        </div>
      </div>

      {/* Main Grid: Recommendations & Radar Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Top Recommended Careers */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base text-slate-900">Top Career Recommendations</h3>
                <p className="text-xs text-slate-500">Calculated transparently using your six input dimensions</p>
              </div>
              <Link
                to="/student/recommendations"
                className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
              >
                <span>View All 20+</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recommendations.length === 0 ? (
              <div className="text-center py-10 space-y-3">
                <Compass className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-500">No recommendations generated yet.</p>
                <Link
                  to="/student/analyse"
                  className="inline-block px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-semibold"
                >
                  Run Analysis Engine
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {topThree.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-5 rounded-2xl border border-slate-200 hover:border-teal-500/50 hover:shadow-md transition-all space-y-3 bg-slate-50/50"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-base text-slate-900">{rec.career_title}</h4>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                            rec.is_eligible ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {rec.is_eligible ? 'Eligible' : 'Prerequisites Pending'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">{rec.category} • {rec.salary_range}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-2xl font-extrabold text-teal-600">{rec.overall_score}%</span>
                          <p className="text-[10px] text-slate-400 uppercase font-semibold">Match Score</p>
                        </div>
                        <Link
                          to={`/student/career/${rec.career_id}`}
                          className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm transition-colors"
                        >
                          Details
                        </Link>
                      </div>
                    </div>

                    {/* Reasons preview */}
                    {rec.reasons && rec.reasons.length > 0 && (
                      <div className="pt-2 border-t border-slate-200/60">
                        <p className="text-xs text-slate-600 flex items-start gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
                          <span>{rec.reasons[0]}</span>
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link
              to="/student/profile"
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-teal-500 shadow-sm text-center space-y-1 transition-all"
            >
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 mx-auto flex items-center justify-center">
                <Compass className="w-4 h-4" />
              </div>
              <h5 className="font-bold text-xs text-slate-800">6 Inputs</h5>
              <p className="text-[10px] text-slate-500">Edit Profile</p>
            </Link>

            <Link
              to="/student/skill-gap"
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-teal-500 shadow-sm text-center space-y-1 transition-all"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
              <h5 className="font-bold text-xs text-slate-800">Skill Gap</h5>
              <p className="text-[10px] text-slate-500">Missing Skills</p>
            </Link>

            <Link
              to="/student/courses"
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-teal-500 shadow-sm text-center space-y-1 transition-all"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <h5 className="font-bold text-xs text-slate-800">Courses</h5>
              <p className="text-[10px] text-slate-500">Training Paths</p>
            </Link>

            <Link
              to="/student/compare"
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-teal-500 shadow-sm text-center space-y-1 transition-all"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 mx-auto flex items-center justify-center">
                <BrainCircuit className="w-4 h-4" />
              </div>
              <h5 className="font-bold text-xs text-slate-800">Compare</h5>
              <p className="text-[10px] text-slate-500">Career Matrix</p>
            </Link>
          </div>
        </div>

        {/* Right Column (1 Col): Aptitude Radar Chart & Profile Pillars */}
        <div className="space-y-6">
          {/* Aptitude Radar */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base text-slate-900">Aptitude Profile</h3>
                <p className="text-xs text-slate-500">Cognitive category distribution</p>
              </div>
              <Link
                to="/student/assessment"
                className="text-xs font-semibold text-teal-600 hover:underline"
              >
                Diagnostic
              </Link>
            </div>

            {profile?.has_aptitude && aptitudeData.length > 0 ? (
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={aptitudeData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <Radar
                      name="Student Aptitude"
                      dataKey="score"
                      stroke="#0d9488"
                      fill="#14b8a6"
                      fillOpacity={0.4}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-10 space-y-3 bg-slate-50 rounded-2xl">
                <BrainCircuit className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs text-slate-500">Take the 30-question diagnostic to unlock your cognitive profile.</p>
                <Link
                  to="/student/assessment"
                  className="inline-block px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-semibold"
                >
                  Start Assessment
                </Link>
              </div>
            )}
          </div>

          {/* 6 Inputs Checklist */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-base text-slate-900">6 Input Dimensions</h3>
            <ul className="space-y-2.5 text-xs">
              {[
                { name: '1. Vocational Interests', active: profile?.has_interests },
                { name: '2. Skills & Proficiency', active: profile?.has_skills },
                { name: '3. Academic Records', active: profile?.has_academics },
                { name: '4. Personal Strengths', active: profile?.has_strengths },
                { name: '5. Career Preferences', active: profile?.has_preferences },
                { name: '6. Aptitude Assessment', active: profile?.has_aptitude },
              ].map((p, idx) => (
                <li key={idx} className="flex items-center justify-between py-1 border-b border-slate-100 last:border-0">
                  <span className="text-slate-700 font-medium">{p.name}</span>
                  {p.active ? (
                    <span className="flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Ready
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-amber-500 font-semibold text-[11px]">
                      <Clock className="w-3.5 h-3.5" />
                      Pending
                    </span>
                  )}
                </li>
              ))}
            </ul>
            <div className="pt-2">
              <Link
                to="/student/profile"
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
              >
                <span>Edit 6 Inputs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
