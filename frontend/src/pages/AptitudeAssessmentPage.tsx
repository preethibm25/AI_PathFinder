import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { assessmentApi } from '../services/api';
import { Question, AssessmentResult } from '../types';
import {
  BrainCircuit,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Send,
  Sparkles,
  HelpCircle,
  RotateCcw
} from 'lucide-react';

export const AptitudeAssessmentPage: React.FC = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const res = await assessmentApi.getQuestions();
        setQuestions(res.data);
      } catch (err: any) {
        setError("Failed to load aptitude questions.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const categories = ['All', 'Logical Reasoning', 'Numerical Ability', 'Verbal Ability', 'Analytical Thinking', 'Problem Solving'];

  const filteredQuestions = activeCategory === 'All'
    ? questions
    : questions.filter(q => q.category === activeCategory);

  const currentQ = filteredQuestions[currentIndex] || filteredQuestions[0];

  const handleSelectOption = (questionId: number, optionLetter: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionLetter
    }));
  };

  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await assessmentApi.submitAssessment(selectedAnswers);
      setResult(res.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-slate-500 font-medium">Loading 30 aptitude diagnostic questions...</p>
      </div>
    );
  }

  // If result is displayed
  if (result) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-10 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-700 mx-auto flex items-center justify-center shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Aptitude Evaluation Completed
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Overall Score: {result.percentage}%
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              You answered <strong>{result.total_score}</strong> out of {questions.length} questions correctly across all five cognitive domains.
            </p>
          </div>

          {/* Category Breakdown Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-left">
            {[
              { cat: 'Logical Reasoning', score: result.logical_score },
              { cat: 'Numerical Ability', score: result.numerical_score },
              { cat: 'Verbal Ability', score: result.verbal_score },
              { cat: 'Analytical Thinking', score: result.analytical_score },
              { cat: 'Problem Solving', score: result.problem_solving_score },
            ].map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-xs font-semibold text-slate-700 block truncate">{item.cat}</span>
                <div className="flex justify-between items-baseline">
                  <span className="text-xl font-bold text-teal-700">{item.score}%</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    item.score >= 70 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {item.score >= 70 ? 'Strong' : 'Average'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/student/analyse')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2 transition-all"
            >
              <span>Proceed to AI Career Analysis</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setResult(null);
                setSelectedAnswers({});
                setCurrentIndex(0);
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Diagnostic</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPct = Math.round((answeredCount / (questions.length || 1)) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-800">
              Diagnostic Assessment
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Answered: <strong>{answeredCount}</strong> / {questions.length} ({progressPct}%)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Aptitude & Cognitive Assessment
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            30 verified questions across 5 core categories. Takes approximately 15 minutes.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting || answeredCount === 0}
          className="px-6 py-2.5 rounded-xl font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-md shadow-teal-600/20 flex items-center gap-2 transition-all disabled:opacity-50 text-sm"
        >
          {submitting ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Send className="w-4 h-4" />
          )}
          <span>Submit Assessment</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-teal-500 to-indigo-600 rounded-full transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        ></div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setCurrentIndex(0);
            }}
            className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Question Card */}
      {currentQ && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex justify-between items-center text-xs text-slate-400 border-b border-slate-100 pb-3">
            <span className="font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg">
              {currentQ.category}
            </span>
            <span>
              Question {currentIndex + 1} of {filteredQuestions.length}
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {currentQ.question_text}
          </h3>

          {/* Options A, B, C, D */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            {[
              { opt: 'A', text: currentQ.option_a },
              { opt: 'B', text: currentQ.option_b },
              { opt: 'C', text: currentQ.option_c },
              { opt: 'D', text: currentQ.option_d },
            ].map(({ opt, text }) => {
              const isSelected = selectedAnswers[currentQ.id] === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleSelectOption(currentQ.id, opt)}
                  className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    isSelected
                      ? 'border-teal-500 bg-teal-50/60 ring-2 ring-teal-500/20 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                    isSelected ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {opt}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-slate-800 pt-0.5">
                    {text}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Nav buttons */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-100">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-40"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            {currentIndex < filteredQuestions.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                <span>Next Question</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <span>Submit & View Results</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Question Number Matrix */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Question Navigation Matrix</h4>
        <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-15 gap-1.5">
          {filteredQuestions.map((q, idx) => {
            const isAnswered = selectedAnswers[q.id] !== undefined;
            const isCurrent = idx === currentIndex;
            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-full aspect-square rounded-lg font-bold text-xs transition-colors flex items-center justify-center ${
                  isCurrent
                    ? 'ring-2 ring-teal-500 bg-slate-900 text-white'
                    : isAnswered
                    ? 'bg-teal-100 text-teal-800'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
