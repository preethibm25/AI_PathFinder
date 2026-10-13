import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { skillApi } from '../services/api';
import { SkillGapItem } from '../types';
import {
  Layers,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Filter
} from 'lucide-react';

export const SkillGapPage: React.FC = () => {
  const [gaps, setGaps] = useState<SkillGapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGaps = async () => {
      try {
        setLoading(true);
        const res = await skillApi.getGaps();
        setGaps(res.data);
      } catch (err: any) {
        setError("Failed to load skill-gap analysis.");
      } finally {
        setLoading(false);
      }
    };
    fetchGaps();
  }, []);

  const filtered = filterPriority === 'All'
    ? gaps
    : gaps.filter(g => g.priority === filterPriority);

  const priorityColors = {
    High: 'bg-rose-100 text-rose-800 border-rose-200',
    Medium: 'bg-amber-100 text-amber-800 border-amber-200',
    Low: 'bg-blue-100 text-blue-800 border-blue-200',
    None: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  };

  const levelLabels = ['None (0)', 'Beginner (1)', 'Elementary (2)', 'Intermediate (3)', 'Advanced (4)', 'Expert (5)'];

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-slate-500 font-medium">Analyzing industry skill benchmarks vs your profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-semibold">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            Skill Gap Diagnostic
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Skill-Gap & Readiness Analysis
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Compare your acquired abilities against the target proficiencies needed for your top recommended careers.
          </p>
        </div>

        <Link
          to="/student/courses"
          className="px-5 py-2.5 rounded-xl font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-md shadow-teal-600/20 flex items-center gap-2 transition-all text-xs"
        >
          <BookOpen className="w-4 h-4" />
          <span>Explore Recommended Courses</span>
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
          {error}
        </div>
      )}

      {/* Priority Filters */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-slate-400 font-medium flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Priority Filter:
        </span>
        {['All', 'High', 'Medium', 'Low'].map((p) => (
          <button
            key={p}
            onClick={() => setFilterPriority(p)}
            className={`px-3 py-1 rounded-xl font-semibold transition-colors ${
              filterPriority === p
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Skill Gaps List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h4 className="font-bold text-base text-slate-800">No Critical Skill Gaps Found!</h4>
            <p className="text-xs text-slate-500">
              You meet or exceed the entry requirements for your primary recommended career matches.
            </p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-indigo-400/40 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-slate-900">{item.skill_name}</h3>
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Bridging needed to reach required vocational standard
                  </p>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${priorityColors[item.priority]}`}>
                  {item.priority} Priority Gap (Delta: {item.gap})
                </span>
              </div>

              {/* Visual Levels Bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between items-center text-xs text-slate-600 font-semibold">
                  <span>Current: {levelLabels[item.current_level]}</span>
                  <span>Required: {levelLabels[item.required_level]}</span>
                </div>

                <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  {/* Required Target Marker */}
                  <div
                    className="absolute top-0 bottom-0 bg-indigo-200 rounded-full opacity-60"
                    style={{ width: `${(item.required_level / 5) * 100}%` }}
                  ></div>

                  {/* Student Current Marker */}
                  <div
                    className="h-full bg-teal-600 rounded-full relative z-10 transition-all duration-500"
                    style={{ width: `${(item.current_level / 5) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Actionable Learning Path */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-2.5 text-xs text-slate-700">
                <Sparkles className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900">Recommended Learning Action: </span>
                  <span>{item.learning_recommendation}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
