import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { recommendationApi } from '../services/api';
import {
  BrainCircuit,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Layers,
  Target,
  FileCheck2,
  Award,
  BookOpen
} from 'lucide-react';

interface Stage {
  id: number;
  label: string;
  detail: string;
  icon: any;
}

const STAGES: Stage[] = [
  { id: 1, label: 'Profile Collected', detail: 'Extracting student qualification, schooling, and location factors.', icon: FileCheck2 },
  { id: 2, label: 'Aptitude Analysed', detail: 'Synthesizing Logical, Numerical, Verbal, and Problem Solving metrics.', icon: BrainCircuit },
  { id: 3, label: 'Interests Analysed', detail: 'Matching preferred vocational fields against career domains.', icon: Target },
  { id: 4, label: 'Skills Analysed', detail: 'Evaluating tool proficiencies and foundational competencies.', icon: Layers },
  { id: 5, label: 'Academics Analysed', detail: 'Verifying minimum qualifications and stream prerequisites.', icon: Award },
  { id: 6, label: 'Career Database Matched', detail: 'Computing weighted compatibility across 20+ vocational occupations.', icon: Sparkles },
  { id: 7, label: 'Skill Gaps Identified', detail: 'Comparing required industry benchmarks vs student proficiency levels.', icon: Layers },
  { id: 8, label: 'Recommendations Generated', detail: 'Compiling ranked career cards, course roadmaps, and family reports.', icon: BookOpen },
];

export const AnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stageInterval: any;

    const runAnalysis = async () => {
      try {
        // Trigger stage animation progression
        stageInterval = setInterval(() => {
          setCurrentStage((prev) => {
            if (prev < STAGES.length) {
              return prev + 1;
            } else {
              clearInterval(stageInterval);
              return prev;
            }
          });
        }, 600);

        // Call real backend API
        await recommendationApi.generate();
        setTimeout(() => {
          setCompleted(true);
        }, 5000);
      } catch (err: any) {
        setError(err.response?.data?.detail || "Failed to generate AI recommendations.");
        clearInterval(stageInterval);
      }
    };

    runAnalysis();

    return () => {
      if (stageInterval) clearInterval(stageInterval);
    };
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-10 space-y-8">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center mx-auto shadow-lg shadow-teal-500/20 text-white">
            <BrainCircuit className="w-8 h-8 animate-pulse" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            AI Recommendation & Matching Engine
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
            Processing your 6 student input dimensions through transparent weighted formula calculations.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}

        {/* Processing Stages Checklist */}
        <div className="space-y-3">
          {STAGES.map((st) => {
            const Icon = st.icon;
            const isDone = currentStage >= st.id;
            const isCurrent = currentStage === st.id - 1;

            return (
              <div
                key={st.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                  isDone
                    ? 'border-teal-200 bg-teal-50/50'
                    : isCurrent
                    ? 'border-indigo-400 bg-indigo-50/40 ring-2 ring-indigo-400/20'
                    : 'border-slate-100 bg-slate-50/40 opacity-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    isDone ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {isDone ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{st.label}</h4>
                    <p className="text-xs text-slate-500 leading-snug">{st.detail}</p>
                  </div>
                </div>

                <div>
                  {isDone ? (
                    <span className="text-[11px] font-bold text-teal-700 uppercase bg-teal-100 px-2.5 py-0.5 rounded-full">
                      Done
                    </span>
                  ) : isCurrent ? (
                    <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <span className="text-[11px] text-slate-400">Waiting</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Completion Redirect */}
        <div className="text-center pt-2">
          {completed ? (
            <button
              onClick={() => navigate('/student/recommendations')}
              className="px-8 py-3.5 rounded-xl font-bold bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white shadow-xl shadow-teal-500/25 inline-flex items-center gap-2 transition-all animate-bounce"
            >
              <span>View Career Recommendations</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <p className="text-xs text-slate-400 flex items-center justify-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-teal-500 animate-ping"></span>
              Calculating weighted compatibility scores...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
