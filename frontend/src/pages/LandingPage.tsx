import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  BrainCircuit,
  HeartHandshake,
  CheckCircle2,
  Sparkles,
  Users2,
  TrendingUp,
  Award,
  Layers,
  ShieldCheck,
  Target,
  FileCheck
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(20,184,166,0.25),rgba(255,255,255,0))]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold tracking-wide">
              <Sparkles className="w-4 h-4 text-teal-400" />
              AI-Enabled Vocational Career Guidance & Family Support
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Empowering Students & Families with{' '}
              <span className="bg-gradient-to-r from-teal-400 via-indigo-300 to-teal-200 bg-clip-text text-transparent">
                Data-Driven Career Clarity
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Navigate vocational and technical career paths with transparent weighted scoring,
              structured aptitude diagnostics, actionable skill-gap roadmaps, and collaborative family decision reports.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white shadow-xl shadow-teal-500/25 flex items-center justify-center gap-2 group transition-all"
              >
                <span>Start Free Career Assessment</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors"
              >
                Sign In to Dashboard
              </Link>
            </div>

            {/* Demo Accounts Pill */}
            <div className="pt-6">
              <div className="inline-block p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
                <span className="font-semibold text-teal-400">Instant Demo Login:</span> Student:{' '}
                <code className="text-white font-mono">student@example.com</code> /{' '}
                <code className="text-white font-mono">student123</code> | Parent:{' '}
                <code className="text-white font-mono">parent@example.com</code> /{' '}
                <code className="text-white font-mono">parent123</code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Six Inputs Explanation Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-800">
            Methodology
          </div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            The 6-Input Student Evaluation Framework
          </h2>
          <p className="text-slate-600 text-sm">
            Our transparent recommendation engine combines six vital dimensions rather than relying on guesswork.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: '1. Vocational Interests (30%)',
              desc: 'Explores passion across Technology, Electrical Systems, Healthcare, Creative Design, and Heavy Industry.',
              icon: Target,
              accent: 'border-teal-500/30 bg-teal-50/50 text-teal-700'
            },
            {
              title: '2. Acquired Skills (20%)',
              desc: 'Self-reported proficiency ratings across technical toolsets, practical wiring, software, and soft skills.',
              icon: Layers,
              accent: 'border-indigo-500/30 bg-indigo-50/50 text-indigo-700'
            },
            {
              title: '3. Academic Performance (15%)',
              desc: 'Evaluates past marks, schooling stream (Science, Commerce, Arts, ITI), and board qualifications.',
              icon: Award,
              accent: 'border-blue-500/30 bg-blue-50/50 text-blue-700'
            },
            {
              title: '4. Aptitude Assessment (15%)',
              desc: 'Objective 30-question diagnostic evaluating Logical, Numerical, Verbal, Analytical, and Problem Solving aptitude.',
              icon: BrainCircuit,
              accent: 'border-purple-500/30 bg-purple-50/50 text-purple-700'
            },
            {
              title: '5. Core Personal Strengths (10%)',
              desc: 'Identifies behavioral assets such as manual dexterity, attention to detail, and troubleshooting tenacity.',
              icon: Sparkles,
              accent: 'border-emerald-500/30 bg-emerald-50/50 text-emerald-700'
            },
            {
              title: '6. Practical Preferences (10%)',
              desc: 'Captures preferred work environments, study duration limits, family budget caps, and target starting salaries.',
              icon: Compass,
              accent: 'border-amber-500/30 bg-amber-50/50 text-amber-700'
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-3"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.accent}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">{item.title}</h3>
                <p className="text-slate-600 text-xs leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Core Workflow Roadmap */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-semibold tracking-wider uppercase text-teal-400">
              Step-by-Step Pathway
            </span>
            <h2 className="text-3xl font-bold tracking-tight">From Assessment to Family Consensus</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 text-center">
            {[
              { step: '01', title: 'Register', desc: 'Create Student or Parent Account' },
              { step: '02', title: 'Assess', desc: 'Take 30-Question Aptitude Test' },
              { step: '03', title: 'Analyse', desc: 'Evaluate 6 Profiles Dimensions' },
              { step: '04', title: 'Recommend', desc: 'Rank Vocational Matches' },
              { step: '05', title: 'Skill Gap', desc: 'Pinpoint Missing Competencies' },
              { step: '06', title: 'Compare', desc: 'Side-by-Side Career Matrix' },
              { step: '07', title: 'Family Decision', desc: 'Align Student & Parent Goals' },
            ].map((st, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                <span className="text-xs font-mono font-bold text-teal-400 bg-teal-950 px-2 py-0.5 rounded-full border border-teal-800">
                  {st.step}
                </span>
                <h4 className="font-bold text-sm text-white">{st.title}</h4>
                <p className="text-[11px] text-slate-400 leading-snug">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Family Decision Support Highlight */}
      <section id="family-decision" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-teal-950 rounded-3xl p-8 sm:p-12 text-white border border-indigo-800/40 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold">
                <HeartHandshake className="w-4 h-4" />
                Collaborative Decision Engine
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-snug">
                Why Family Involvement Changes Everything
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Vocational education decisions fail when families are left in the dark about course costs, job stability, and real curriculum requirements.
                PathFinder AI bridges the communication gap by providing parents with a shared, transparent decision report.
              </p>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-200">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0" />
                  <span><strong>Zero-Stress Linking:</strong> Students share an invite code with parents to securely view reports.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0" />
                  <span><strong>Assessment Privacy:</strong> Parents can review career options but cannot modify student test answers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0" />
                  <span><strong>Joint Consensus:</strong> Both student and parent record their preferred options until shared agreement is reached.</span>
                </li>
              </ul>
              <div className="pt-2">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-semibold text-sm shadow-md transition-colors"
                >
                  <span>Experience Family Decision Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="bg-slate-900/90 rounded-2xl border border-slate-700/80 p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase text-slate-400">Sample Family Decision Consensus</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Consensus Status: Aligned
                </span>
              </div>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-teal-300">Student Preference:</span>
                    <span className="text-[10px] bg-teal-950 text-teal-300 px-2 py-0.5 rounded">92% Match</span>
                  </div>
                  <p className="font-bold text-sm text-white">Data Analyst</p>
                  <p className="text-slate-400 text-[11px] italic mt-1">"I enjoy working with statistics and Python to solve analytical puzzles."</p>
                </div>

                <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-indigo-300">Parent Preference:</span>
                    <span className="text-[10px] bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded">92% Match</span>
                  </div>
                  <p className="font-bold text-sm text-white">Data Analyst</p>
                  <p className="text-slate-400 text-[11px] italic mt-1">"Course duration is 16 weeks and fees are within our family budget."</p>
                </div>

                <div className="p-3.5 rounded-xl bg-gradient-to-r from-teal-950/90 to-indigo-950/90 border border-teal-500/40 text-center">
                  <span className="text-[10px] font-bold uppercase text-teal-400 tracking-wider">Final Family Commitment</span>
                  <p className="font-extrabold text-base text-white mt-0.5">Enrolling in NSDC Data Analytics Course</p>
                  <p className="text-[11px] text-teal-200 mt-1">Shared decision finalized on Oct 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Benefits */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Engineered for Transparency & Impact</h2>
          <p className="text-slate-600 text-sm">
            Designed to bridge the gap between vocational training institutes and family career aspirations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">100% Explainable AI</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              No black-box guesses. Students see the exact breakdown across interests, skills, academics, and aptitude that produced their career match.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Direct Course Pathways</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Identified skill gaps are mapped directly to verified vocational certifications (NSDC, ITI, Polytechnic) with realistic duration and cost disclosures.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Users2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Family Consensus Hub</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Parents can review career choices, evaluate ROI, and collaborate directly with the student, preventing dropout risks and family misalignment.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
