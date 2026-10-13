import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  FileCheck2,
  BrainCircuit,
  BarChart3,
  Award,
  Layers,
  Users2,
  ShieldAlert,
  Sparkles,
  BookOpen
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-teal-400 via-indigo-200 to-white bg-clip-text text-transparent">
                PathFinder AI
              </span>
              <span className="hidden sm:block text-[10px] text-teal-400 font-medium tracking-wider uppercase">
                Vocational Decision Platform
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/') ? 'text-teal-400 bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  Home
                </Link>
                <a
                  href="#how-it-works"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                >
                  6-Input Framework
                </a>
                <a
                  href="#family-decision"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                >
                  Family Support
                </a>
              </>
            ) : user?.role === 'student' ? (
              <>
                <Link
                  to="/student/dashboard"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/student/dashboard') ? 'text-teal-400 bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  to="/student/profile"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/student/profile') ? 'text-teal-400 bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <UserIcon className="w-4 h-4" />
                  6 Inputs
                </Link>
                <Link
                  to="/student/assessment"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/student/assessment') ? 'text-teal-400 bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <FileCheck2 className="w-4 h-4" />
                  Aptitude Test
                </Link>
                <Link
                  to="/student/recommendations"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/student/recommendations') ? 'text-teal-400 bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-teal-400" />
                  Careers
                </Link>
                <Link
                  to="/student/skill-gap"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/student/skill-gap') ? 'text-teal-400 bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  Skill Gap
                </Link>
                <Link
                  to="/student/courses"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/student/courses') ? 'text-teal-400 bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  Courses
                </Link>
                <Link
                  to="/student/compare"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/student/compare') ? 'text-teal-400 bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <BrainCircuit className="w-4 h-4" />
                  Compare
                </Link>
                <Link
                  to="/family/report"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/family/report') ? 'text-teal-400 bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Users2 className="w-4 h-4 text-amber-400" />
                  Family Report
                </Link>
              </>
            ) : user?.role === 'parent' ? (
              <>
                <Link
                  to="/parent/dashboard"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/parent/dashboard') ? 'text-teal-400 bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Users2 className="w-4 h-4 text-amber-400" />
                  Parent Decision Hub
                </Link>
                <Link
                  to="/family/report"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/family/report') ? 'text-teal-400 bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <FileCheck2 className="w-4 h-4" />
                  Shared Career Report
                </Link>
              </>
            ) : (
              <Link
                to="/admin"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive('/admin') ? 'text-teal-400 bg-slate-800' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                Admin Dashboard
              </Link>
            )}
          </nav>

          {/* Right Action buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {!isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-200 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white shadow-md shadow-teal-500/25 transition-all"
                >
                  Get Started Free
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {user?.role === 'student' && user.student_code && (
                  <span className="hidden xl:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono bg-teal-950/80 text-teal-300 border border-teal-800">
                    ID: {user.student_code}
                  </span>
                )}
                <div className="flex items-center gap-3 pl-3 border-l border-slate-700">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-medium text-white leading-tight">{user?.full_name}</p>
                    <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">
                      {user?.role}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Log Out of your account"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/30 hover:border-rose-500/50 hover:text-rose-200 transition-all shadow-sm cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-400" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-2">
          {!isAuthenticated ? (
            <>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
              >
                Home
              </Link>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-semibold bg-teal-600 text-white text-center"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              {user?.role === 'student' && (
                <>
                  <Link
                    to="/student/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/student/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
                  >
                    6 Profile Inputs
                  </Link>
                  <Link
                    to="/student/assessment"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
                  >
                    Aptitude Assessment
                  </Link>
                  <Link
                    to="/student/recommendations"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
                  >
                    Career Matches
                  </Link>
                  <Link
                    to="/student/skill-gap"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
                  >
                    Skill Gap Analysis
                  </Link>
                  <Link
                    to="/student/courses"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
                  >
                    Vocational Courses
                  </Link>
                  <Link
                    to="/student/compare"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
                  >
                    Compare Careers
                  </Link>
                  <Link
                    to="/family/report"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
                  >
                    Family Decision Report
                  </Link>
                </>
              )}
              {user?.role === 'parent' && (
                <>
                  <Link
                    to="/parent/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
                  >
                    Parent Dashboard
                  </Link>
                  <Link
                    to="/family/report"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
                  >
                    Family Career Report
                  </Link>
                </>
              )}
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
                >
                  Admin Portal
                </Link>
              )}
              <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
                <span className="text-xs text-slate-400">Signed in as {user?.email}</span>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/30"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span>Log Out</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
};
