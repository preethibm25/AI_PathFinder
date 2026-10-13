import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { careerApi } from '../services/api';
import { CareerComparison } from '../types';
import {
  Compass,
  ArrowLeft,
  BrainCircuit,
  Sparkles,
  Layers,
  GraduationCap,
  Clock,
  DollarSign,
  Briefcase,
  CheckCircle2,
  XCircle,
  Plus
} from 'lucide-react';

export const CareerComparisonPage: React.FC = () => {
  const location = useLocation();
  const [availableCareers, setAvailableCareers] = useState<{ id: number; title: string }[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>(() => {
    return (location.state as any)?.selectedCareerIds || [1, 2]; // Default Data Analyst & Web Dev
  });
  const [comparisonData, setComparisonData] = useState<CareerComparison[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDropdown = async () => {
      try {
        const res = await careerApi.getAll();
        setAvailableCareers(res.data.map((c: any) => ({ id: c.id, title: c.title })));
      } catch (err) {
        console.error(err);
      }
    };
    fetchDropdown();
  }, []);

  useEffect(() => {
    const fetchComparison = async () => {
      if (selectedIds.length < 2) return;
      try {
        setLoading(true);
        const res = await careerApi.compare(selectedIds);
        setComparisonData(res.data);
      } catch (err) {
        console.error("Comparison request failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchComparison();
  }, [selectedIds]);

  const handleAddCareer = (id: number) => {
    if (!selectedIds.includes(id)) {
      if (selectedIds.length >= 4) {
        alert("You can compare a maximum of 4 careers at once.");
        return;
      }
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleRemoveCareer = (id: number) => {
    if (selectedIds.length <= 2) {
      alert("At least 2 careers must remain in the comparison matrix.");
      return;
    }
    setSelectedIds(selectedIds.filter(item => item !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-semibold">
            <BrainCircuit className="w-3.5 h-3.5 text-purple-600" />
            Side-by-Side Evaluation
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Career Comparison Matrix
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Compare duration, investment cost, required skills, and aptitude fit side-by-side to make confident family decisions.
          </p>
        </div>

        {/* Add Career Dropdown */}
        <div className="flex items-center gap-2">
          <select
            onChange={(e) => {
              if (e.target.value) handleAddCareer(parseInt(e.target.value));
            }}
            value=""
            className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="" disabled>+ Add Career to Compare</option>
            {availableCareers
              .filter(c => !selectedIds.includes(c.id))
              .map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-xs text-slate-500">Generating multi-career matrix...</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-3xl border border-slate-200 shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                <th className="p-5 font-bold uppercase tracking-wider text-slate-400 w-44">
                  Dimension / Metric
                </th>
                {comparisonData.map((c) => (
                  <th key={c.id} className="p-5 min-w-[240px] border-l border-slate-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-extrabold text-base text-slate-900">{c.title}</h3>
                        <span className="text-[10px] text-slate-500 block mt-0.5">{c.category}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveCareer(c.id)}
                        className="text-slate-400 hover:text-rose-500 p-1"
                        title="Remove from comparison"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Match Score */}
              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50/40">Weighted Match Score</td>
                {comparisonData.map((c) => (
                  <td key={c.id} className="p-4 border-l border-slate-100">
                    <span className="text-2xl font-black text-teal-600">{c.overall_score}%</span>
                    <span className="text-[11px] text-slate-400 block font-semibold">AI Calculated Compatibility</span>
                  </td>
                ))}
              </tr>

              {/* Sub-Score Fit Breakdown */}
              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50/40">Sub-Score Fit</td>
                {comparisonData.map((c) => (
                  <td key={c.id} className="p-4 border-l border-slate-100 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Interest:</span>
                      <strong className="text-slate-800">{c.interest_match}%</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Skill:</span>
                      <strong className="text-slate-800">{c.skill_match}%</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Aptitude:</span>
                      <strong className="text-slate-800">{c.aptitude_match}%</strong>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Salary Expectation */}
              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50/40">Salary Outlook</td>
                {comparisonData.map((c) => (
                  <td key={c.id} className="p-4 border-l border-slate-100 font-bold text-slate-800">
                    {c.salary_range}
                  </td>
                ))}
              </tr>

              {/* Education Requirement */}
              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50/40">Minimum Education</td>
                {comparisonData.map((c) => (
                  <td key={c.id} className="p-4 border-l border-slate-100 font-medium text-slate-700">
                    {c.education_required}
                  </td>
                ))}
              </tr>

              {/* Course Duration & Cost */}
              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50/40">Training Program</td>
                {comparisonData.map((c) => (
                  <td key={c.id} className="p-4 border-l border-slate-100 space-y-1">
                    <p className="font-semibold text-slate-800">Avg Duration: {c.average_course_duration_weeks} Weeks</p>
                    <p className="text-teal-700 font-bold">Avg Cost: ₹{c.average_course_cost.toLocaleString()}</p>
                  </td>
                ))}
              </tr>

              {/* Skill Gap Readiness */}
              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50/40">Skill Gaps to Bridge</td>
                {comparisonData.map((c) => (
                  <td key={c.id} className="p-4 border-l border-slate-100">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      c.skill_gap_count === 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {c.skill_gap_count === 0 ? '✓ Ready (0 Gaps)' : `${c.skill_gap_count} Gaps to Bridge`}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Primary Job Roles */}
              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50/40">Primary Job Roles</td>
                {comparisonData.map((c) => (
                  <td key={c.id} className="p-4 border-l border-slate-100">
                    <ul className="space-y-1 text-slate-600">
                      {c.job_roles.slice(0, 3).map((r, i) => (
                        <li key={i}>• {r}</li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>

              {/* Action Buttons */}
              <tr>
                <td className="p-4 bg-slate-50/40 font-bold text-slate-700">Action</td>
                {comparisonData.map((c) => (
                  <td key={c.id} className="p-4 border-l border-slate-100">
                    <Link
                      to={`/student/career/${c.id}`}
                      className="inline-block w-full py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-center text-xs shadow-sm transition-colors"
                    >
                      View Deep Dive
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
