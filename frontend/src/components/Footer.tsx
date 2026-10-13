import React from 'react';
import { Compass, ShieldCheck, HeartHandshake, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <span className="font-bold text-base text-white">PathFinder AI</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              AI-Enabled Career Counselling and Family Decision-Support Platform for Vocational Education.
              Guiding students and parents with transparent weighted recommendations, verifiable skill gap roadmaps, and collaborative family consensus.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400/90 bg-amber-950/40 border border-amber-800/50 p-2.5 rounded-lg max-w-md">
              <HeartHandshake className="w-5 h-5 flex-shrink-0" />
              <span>
                <strong>Core Philosophy:</strong> AI recommends and explains; the ultimate career decision remains entirely with the student and family.
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">Core Modules</h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-teal-400 transition-colors">6-Input Student Profile</li>
              <li className="hover:text-teal-400 transition-colors">5-Pillar Aptitude Assessment</li>
              <li className="hover:text-teal-400 transition-colors">Weighted Scoring Engine</li>
              <li className="hover:text-teal-400 transition-colors">Skill-Gap Diagnostic</li>
              <li className="hover:text-teal-400 transition-colors">Vocational Course Directory</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">Family & Trust</h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-teal-400 transition-colors">Parent Decision Dashboard</li>
              <li className="hover:text-teal-400 transition-colors">Secure Student Code Linking</li>
              <li className="hover:text-teal-400 transition-colors">Side-by-Side Career Matrix</li>
              <li className="hover:text-teal-400 transition-colors">Shared Consensus Tracking</li>
              <li className="hover:text-teal-400 transition-colors">Privacy & Data Isolation</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 PathFinder AI. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              Role-Based JWT Security
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Transparent Scoring
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
