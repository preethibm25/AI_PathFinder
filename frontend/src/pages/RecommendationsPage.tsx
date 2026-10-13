import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { recommendationApi } from '../services/api';
import { Recommendation } from '../types';
import {
  Compass,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  BrainCircuit,
  Layers,
  Search,
  Check,
  TrendingUp,
  Award,
  RefreshCw
} from 'lucide-react';

export const RecommendationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filterSkillFirstOnly, setFilterSkillFirstOnly] = useState(false);
  const [comparisonList, setComparisonList] = useState<number[]>([]);

  const handleRecalculate = async () => {
    try {
      setRefreshing(true);
      setError(null);
      const res = await recommendationApi.generate();
      setRecommendations(res.data);
    } catch (err: any) {
      setError("Failed to recalculate recommendations. Try again.");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const fetchRecs = async () => {
      try {
        setLoading(true);
        const res = await recommendationApi.getAll();
        setRecommendations(res.data);
      } catch (err: any) {
        setError("Failed to fetch recommendations. Try running the analysis engine.");
      } finally {
        setLoading(false);
      }
    };
    fetchRecs();
  }, []);

  const categories = ['All', ...Array.from(new Set(recommendations.map(r => r.category)))];

  const filtered = recommendations.filter((r) => {
    const matchSkillFirst = !filterSkillFirstOnly || r.is_skill_first;
    const matchCat = selectedCategory === 'All' || r.category === selectedCategory;
    const matchSearch =
      r.career_title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase());
    return matchSkillFirst && matchCat && matchSearch;
  });

  const handleToggleCompare = (id: number) => {
    if (comparisonList.includes(id)) {
      setComparisonList(comparisonList.filter(item => item !== id));
    } else {
      if (comparisonList.length >= 4) {
        alert("You can compare up to 4 careers simultaneously.");
        return;
      }
      setComparisonList([...comparisonList, id]);
    }
  };

  const handleLaunchCompare = () => {
    if (comparisonList.length < 2) {
      alert("Please select at least 2 careers to compare.");
      return;
    }
    navigate('/student/compare', { state: { selectedCareerIds: comparisonList } });
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-slate-500 font-medium">Computing transparent weighted career rankings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            Ranked Recommendations
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Personalized Career Matches
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Calculated dynamically using your 6 student profile inputs and 30-question aptitude assessment.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Floating Compare Bar Trigger */}
          {comparisonList.length > 0 && (
            <div className="flex items-center gap-3 bg-slate-900 text-white p-2.5 px-4 rounded-2xl shadow-xl">
              <span className="text-xs font-semibold">
                {comparisonList.length} career{comparisonList.length > 1 ? 's' : ''} selected
              </span>
              <button
                onClick={handleLaunchCompare}
                className="px-3.5 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold text-xs flex items-center gap-1 transition-colors"
              >
                <span>Compare Side-by-Side</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}

          <button
            onClick={handleRecalculate}
            disabled={refreshing}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md flex items-center gap-2 transition-all disabled:opacity-60 cursor-pointer"
            title="Recalculate career recommendations using your latest profile and aptitude data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Recalculating...' : '⚡ Recalculate AI Matches'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between">
          <span>{error}</span>
          <Link to="/student/analyse" className="font-bold underline">
            Run Analysis Now
          </Link>
        </div>
      )}

      {/* Skill-First Guidance & Employer Eligibility Disclaimer */}
      <div className="bg-gradient-to-r from-violet-50 via-indigo-50/60 to-teal-50/40 border border-violet-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3 shadow-sm">
        <Sparkles className="w-5 h-5 text-violet-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-slate-700">
          <p className="font-bold text-slate-900 text-sm">
            Skill-First Career Guidance & Transparent Eligibility Notice
          </p>
          <p className="leading-relaxed">
            Students entering technology from non-IT streams or without a formal CS degree can pursue our <strong>Skill-First Pathways</strong> based on verified skills and portfolio readiness.
          </p>
          <p className="text-[11px] text-slate-500 pt-0.5">
            <strong>Important Disclaimer:</strong> Degree and qualification requirements vary by employer and role. Check specific job eligibility before applying. The final career decision remains with the student and family.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search careers or keywords..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs">
          <button
            onClick={() => setFilterSkillFirstOnly(!filterSkillFirstOnly)}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors flex items-center gap-1 ${
              filterSkillFirstOnly
                ? 'bg-violet-600 text-white shadow-sm'
                : 'bg-violet-100 text-violet-800 hover:bg-violet-200'
            }`}
          >
            <span>⚡ Skill-First Tech Careers</span>
          </button>

          <span className="text-slate-400 text-xs whitespace-nowrap">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat && !filterSkillFirstOnly
                  ? 'bg-teal-600 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Career Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((rec, index) => {
          const isSelected = comparisonList.includes(rec.career_id);
          const gapCount = rec.skill_gaps.filter(g => g.gap > 0).length;

          let matchBadge = { label: 'High Match', color: 'bg-teal-100 text-teal-800 border-teal-200' };
          if (rec.overall_score >= 85) {
            matchBadge = { label: 'Strong Fit', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
          } else if (rec.overall_score < 70) {
            matchBadge = { label: 'Moderate Fit', color: 'bg-amber-100 text-amber-800 border-amber-200' };
          }

          return (
            <div
              key={rec.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-lg hover:border-teal-500/40 transition-all flex flex-col justify-between p-6 space-y-4 relative"
            >
              {/* Rank Badge */}
              <div className="flex justify-between items-start">
                <span className="text-xs font-mono font-bold text-slate-400">
                  Rank #{index + 1}
                </span>

                <div className="flex flex-wrap items-center gap-1.5 justify-end">
                  {rec.is_skill_first && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-100 text-violet-800 border border-violet-200">
                      ⚡ Skill-First
                    </span>
                  )}
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${matchBadge.color}`}>
                    {matchBadge.label}
                  </span>
                  {!rec.is_eligible && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                      Skills to Develop
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Category */}
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 tracking-tight">
                  {rec.career_title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{rec.category}</p>
                <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                  {rec.description}
                </p>
              </div>

              {/* Score Breakdown Bar */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="font-semibold text-slate-700">Weighted Match Score</span>
                  <span className="text-xl font-black text-teal-600">{rec.overall_score}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-indigo-600 rounded-full"
                    style={{ width: `${rec.overall_score}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-3 gap-1 pt-1 text-[10px] text-slate-500 text-center">
                  <span className="bg-slate-50 py-0.5 rounded">Int: {rec.interest_match}%</span>
                  <span className="bg-slate-50 py-0.5 rounded">Skill: {rec.skill_match}%</span>
                  <span className="bg-slate-50 py-0.5 rounded">Apt: {rec.aptitude_match}%</span>
                </div>
              </div>

              {/* Supporting Reasons */}
              {rec.reasons && rec.reasons.length > 0 && (
                <div className="space-y-1 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Why You Match
                  </span>
                  <p className="text-xs text-slate-700 flex items-start gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{rec.reasons[0]}</span>
                  </p>
                </div>
              )}

              {/* Salary & Gaps Footer */}
              <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-slate-100">
                <div>
                  <span className="text-[10px] uppercase text-slate-400 block font-semibold">Salary Outlook</span>
                  <span className="font-bold text-slate-800 text-xs">{rec.salary_range}</span>
                </div>

                <div>
                  <span className="text-[10px] uppercase text-slate-400 block font-semibold text-right">Skill Gaps</span>
                  <span className={`text-xs font-bold ${gapCount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {gapCount > 0 ? `${gapCount} to acquire` : 'None (Ready)'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleToggleCompare(rec.career_id)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1 transition-colors ${
                    isSelected
                      ? 'bg-slate-900 border-slate-900 text-white'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {isSelected ? <Check className="w-3.5 h-3.5" /> : null}
                  <span>{isSelected ? 'In Compare' : 'Add Compare'}</span>
                </button>

                <Link
                  to={`/student/career/${rec.career_id}`}
                  className="py-2 px-3 rounded-xl text-xs font-bold bg-teal-50 hover:bg-teal-100 text-teal-800 text-center flex items-center justify-center gap-1 transition-colors"
                >
                  <span>Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
