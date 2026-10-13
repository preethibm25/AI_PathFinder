import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminApi, careerApi, courseApi } from '../services/api';
import {
  ShieldAlert,
  Users2,
  BookOpen,
  HelpCircle,
  TrendingUp,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  LogOut
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { logout } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [careers, setCareers] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'careers' | 'courses' | 'questions'>('overview');

  // New Career Form State
  const [newCareer, setNewCareer] = useState({
    title: '',
    category: 'Information Technology',
    description: '',
    salary_range: '₹3.0 - 6.0 LPA',
    job_outlook: 'High Demand',
    minimum_education: '10th Standard',
    required_stream: 'Any',
    job_roles: 'Specialist, Assistant'
  });

  // New Course Form State
  const [newCourse, setNewCourse] = useState({
    title: '',
    provider: 'National Skill Development Corp',
    duration_weeks: 16,
    approximate_cost: 15000,
    eligibility: '10th Standard Pass',
    description: 'Hands-on practical training module',
    mode: 'Hybrid',
    certification_type: 'Industry Certificate',
    level: 'Beginner'
  });

  // New Question Form State
  const [newQuestion, setNewQuestion] = useState({
    category: 'Logical Reasoning',
    question_text: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_option: 'A',
    explanation: ''
  });

  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sRes, stuRes, cRes, courRes] = await Promise.all([
        adminApi.getStats(),
        adminApi.getStudents(),
        careerApi.getAll(),
        courseApi.getAll()
      ]);
      setStats(sRes.data);
      setStudents(stuRes.data);
      setCareers(cRes.data);
      setCourses(courRes.data);
    } catch (err) {
      console.error("Admin fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateCareer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.createCareer({
        ...newCareer,
        job_roles: newCareer.job_roles.split(',').map(r => r.trim()),
        preferred_interests: [newCareer.category],
        required_aptitude_profile: { "Logical": 60, "Numerical": 55, "Analytical": 60 }
      });
      setActionMsg("New career successfully added!");
      setNewCareer({
        title: '',
        category: 'Information Technology',
        description: '',
        salary_range: '₹3.0 - 6.0 LPA',
        job_outlook: 'High Demand',
        minimum_education: '10th Standard',
        required_stream: 'Any',
        job_roles: 'Specialist, Assistant'
      });
      fetchData();
      setTimeout(() => setActionMsg(null), 3000);
    } catch (err: any) {
      alert("Failed to add career: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleDeleteCareer = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this career?")) return;
    try {
      await adminApi.deleteCareer(id);
      setActionMsg("Career deleted.");
      fetchData();
      setTimeout(() => setActionMsg(null), 3000);
    } catch (err: any) {
      alert("Failed to delete career.");
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.createCourse({
        ...newCourse,
        skills_covered: ['Practical Vocational Core']
      });
      setActionMsg("New course successfully added!");
      fetchData();
      setTimeout(() => setActionMsg(null), 3000);
    } catch (err: any) {
      alert("Failed to add course: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleDeleteCourse = async (id: number) => {
    if (!window.confirm("Delete course?")) return;
    try {
      await adminApi.deleteCourse(id);
      setActionMsg("Course deleted.");
      fetchData();
      setTimeout(() => setActionMsg(null), 3000);
    } catch (err: any) {
      alert("Failed to delete course.");
    }
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.createQuestion(newQuestion);
      setActionMsg("Aptitude question successfully created!");
      setNewQuestion({
        category: 'Logical Reasoning',
        question_text: '',
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        correct_option: 'A',
        explanation: ''
      });
      setTimeout(() => setActionMsg(null), 3000);
    } catch (err: any) {
      alert("Failed to add question.");
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-slate-500 font-medium">Loading Administrator Console...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-semibold">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            Administrator Control Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Platform Operations & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage vocational database taxonomies, monitor student assessment pipelines, and view analytics.
          </p>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-700 hover:text-rose-900 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          title="Log out of Administrator Console"
        >
          <LogOut className="w-4 h-4 text-rose-600" />
          <span>Log Out</span>
        </button>
      </div>

      {actionMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{actionMsg}</span>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Students', val: stats?.total_students, color: 'text-teal-600' },
          { label: 'Parents', val: stats?.total_parents, color: 'text-indigo-600' },
          { label: 'Careers', val: stats?.total_careers, color: 'text-blue-600' },
          { label: 'Courses', val: stats?.total_courses, color: 'text-purple-600' },
          { label: 'Questions', val: stats?.total_questions, color: 'text-amber-600' },
          { label: 'Avg Score', val: `${stats?.average_aptitude_score}%`, color: 'text-emerald-600' },
        ].map((s, idx) => (
          <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">{s.label}</span>
            <span className={`text-xl font-extrabold ${s.color}`}>{s.val}</span>
          </div>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 space-x-2 text-xs sm:text-sm">
        {[
          { id: 'overview', label: 'Student Roster' },
          { id: 'careers', label: 'Manage Careers' },
          { id: 'courses', label: 'Manage Courses' },
          { id: 'questions', label: 'Add Aptitude Question' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-2.5 px-4 rounded-t-xl font-bold border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-teal-600 text-teal-700 bg-teal-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Student Roster */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-base text-slate-900">Registered Students</h3>
              <p className="text-xs text-slate-500">Live roster with aptitude progress and top recommendations</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 font-semibold border-b border-slate-200 uppercase">
                  <th className="p-4">Student</th>
                  <th className="p-4">Code</th>
                  <th className="p-4">Education</th>
                  <th className="p-4">Aptitude Status</th>
                  <th className="p-4">Top Career Match</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((stu) => (
                  <tr key={stu.id} className="hover:bg-slate-50/80">
                    <td className="p-4">
                      <strong className="text-slate-900 block">{stu.full_name}</strong>
                      <span className="text-[11px] text-slate-400">{stu.email}</span>
                    </td>
                    <td className="p-4 font-mono font-bold text-teal-700">{stu.student_code}</td>
                    <td className="p-4">{stu.education_level} ({stu.stream})</td>
                    <td className="p-4">
                      {stu.assessment_completed ? (
                        <span className="px-2 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800">
                          {stu.assessment_score}% Completed
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded font-medium bg-amber-100 text-amber-800">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="p-4 font-bold text-slate-800">
                      {stu.top_career ? `${stu.top_career} (${stu.top_match_score}%)` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Manage Careers */}
      {activeTab === 'careers' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Career Form */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900">Add New Career Record</h3>
            <form onSubmit={handleCreateCareer} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Career Title</label>
                <input
                  type="text"
                  required
                  value={newCareer.title}
                  onChange={(e) => setNewCareer({ ...newCareer, title: e.target.value })}
                  placeholder="e.g. Mechatronics Technician"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <input
                  type="text"
                  required
                  value={newCareer.category}
                  onChange={(e) => setNewCareer({ ...newCareer, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={newCareer.description}
                  onChange={(e) => setNewCareer({ ...newCareer, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Salary Range</label>
                  <input
                    type="text"
                    value={newCareer.salary_range}
                    onChange={(e) => setNewCareer({ ...newCareer, salary_range: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Min Education</label>
                  <input
                    type="text"
                    value={newCareer.minimum_education}
                    onChange={(e) => setNewCareer({ ...newCareer, minimum_education: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Typical Job Roles (comma-separated)</label>
                <input
                  type="text"
                  value={newCareer.job_roles}
                  onChange={(e) => setNewCareer({ ...newCareer, job_roles: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-colors"
              >
                + Create Career
              </button>
            </form>
          </div>

          {/* Careers List Table */}
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900">Active Careers ({careers.length})</h3>
            <div className="max-h-[500px] overflow-y-auto divide-y divide-slate-100">
              {careers.map((c) => (
                <div key={c.id} className="py-3 flex justify-between items-center text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{c.title}</h4>
                    <span className="text-slate-500">{c.category} • {c.salary_range}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteCareer(c.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                    title="Delete career"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Manage Courses */}
      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900">Add Vocational Course</h3>
            <form onSubmit={handleCreateCourse} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  placeholder="e.g. Certified Solar Technician Course"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Training Provider</label>
                <input
                  type="text"
                  required
                  value={newCourse.provider}
                  onChange={(e) => setNewCourse({ ...newCourse, provider: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duration (Wks)</label>
                  <input
                    type="number"
                    value={newCourse.duration_weeks}
                    onChange={(e) => setNewCourse({ ...newCourse, duration_weeks: parseInt(e.target.value) || 12 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cost (₹)</label>
                  <input
                    type="number"
                    value={newCourse.approximate_cost}
                    onChange={(e) => setNewCourse({ ...newCourse, approximate_cost: parseFloat(e.target.value) || 10000 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-colors"
              >
                + Create Course
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900">Active Courses ({courses.length})</h3>
            <div className="max-h-[500px] overflow-y-auto divide-y divide-slate-100">
              {courses.map((cour) => (
                <div key={cour.id} className="py-3 flex justify-between items-center text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{cour.title}</h4>
                    <span className="text-slate-500">{cour.provider} • {cour.duration_weeks} Wks • ₹{cour.approximate_cost}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteCourse(cour.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Add Aptitude Question */}
      {activeTab === 'questions' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm max-w-2xl mx-auto space-y-4">
          <h3 className="font-bold text-base text-slate-900">Create Aptitude Assessment Question</h3>
          <form onSubmit={handleCreateQuestion} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={newQuestion.category}
                onChange={(e) => setNewQuestion({ ...newQuestion, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
              >
                <option value="Logical Reasoning">Logical Reasoning</option>
                <option value="Numerical Ability">Numerical Ability</option>
                <option value="Verbal Ability">Verbal Ability</option>
                <option value="Analytical Thinking">Analytical Thinking</option>
                <option value="Problem Solving">Problem Solving</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Question Text</label>
              <textarea
                rows={2}
                required
                value={newQuestion.question_text}
                onChange={(e) => setNewQuestion({ ...newQuestion, question_text: e.target.value })}
                placeholder="Enter question statement..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Option A</label>
                <input
                  type="text"
                  required
                  value={newQuestion.option_a}
                  onChange={(e) => setNewQuestion({ ...newQuestion, option_a: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Option B</label>
                <input
                  type="text"
                  required
                  value={newQuestion.option_b}
                  onChange={(e) => setNewQuestion({ ...newQuestion, option_b: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Option C</label>
                <input
                  type="text"
                  required
                  value={newQuestion.option_c}
                  onChange={(e) => setNewQuestion({ ...newQuestion, option_c: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Option D</label>
                <input
                  type="text"
                  required
                  value={newQuestion.option_d}
                  onChange={(e) => setNewQuestion({ ...newQuestion, option_d: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Correct Option</label>
                <select
                  value={newQuestion.correct_option}
                  onChange={(e) => setNewQuestion({ ...newQuestion, correct_option: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="A">Option A</option>
                  <option value="B">Option B</option>
                  <option value="C">Option C</option>
                  <option value="D">Option D</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Explanation</label>
                <input
                  type="text"
                  value={newQuestion.explanation}
                  onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                  placeholder="Rationale..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-colors"
            >
              + Save Question to Database
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
