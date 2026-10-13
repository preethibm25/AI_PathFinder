import React, { useState, useEffect } from 'react';
import { courseApi } from '../services/api';
import { Course } from '../types';
import {
  BookOpen,
  Search,
  Clock,
  Award,
  Filter,
  CheckCircle2,
  DollarSign,
  Layers
} from 'lucide-react';

export const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedMode, setSelectedMode] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await courseApi.getAll();
        setCourses(res.data);
      } catch (err: any) {
        console.error("Failed to load courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filtered = courses.filter((c) => {
    const matchMode = selectedMode === 'All' || c.mode === selectedMode;
    const matchLevel = selectedLevel === 'All' || c.level === selectedLevel;
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.provider.toLowerCase().includes(search.toLowerCase()) ||
      (c.skills_covered && c.skills_covered.some(s => s.toLowerCase().includes(search.toLowerCase())));
    return matchMode && matchLevel && matchSearch;
  });

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-slate-500 font-medium">Loading vocational course registry...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
          Vocational Training Directory
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Recommended Vocational Courses & Certifications
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Recognized government and industry vocational programs (NSDC, ITI, Polytechnic, DGCA) with verified fee schedules.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, provider, or skill..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs w-full md:w-auto">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Mode:</span>
            {['All', 'Hybrid', 'Offline', 'Online'].map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMode(m)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  selectedMode === m ? 'bg-slate-900 text-white font-semibold' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Level:</span>
            {['All', 'Beginner', 'Intermediate'].map((l) => (
              <button
                key={l}
                onClick={() => setSelectedLevel(l)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  selectedLevel === l ? 'bg-slate-900 text-white font-semibold' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-3xl border border-slate-200 hover:border-teal-500/40 shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start gap-2">
                <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                  {course.mode} • {course.level}
                </span>
                <span className="text-sm font-extrabold text-teal-700">
                  ₹{course.approximate_cost.toLocaleString()}
                </span>
              </div>

              <h3 className="font-bold text-base text-slate-900 leading-snug">
                {course.title}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {course.provider}
              </p>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {course.description}
              </p>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
              <div className="flex justify-between text-slate-600">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Duration:
                </span>
                <span className="font-bold text-slate-800">{course.duration_weeks} Weeks</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-slate-400" />
                  Eligibility:
                </span>
                <span className="font-semibold text-slate-800 truncate max-w-[170px]" title={course.eligibility}>
                  {course.eligibility}
                </span>
              </div>

              {/* Skills Covered Pills */}
              {course.skills_covered && course.skills_covered.length > 0 && (
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Skills Covered:</span>
                  <div className="flex flex-wrap gap-1">
                    {course.skills_covered.map((sk, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
