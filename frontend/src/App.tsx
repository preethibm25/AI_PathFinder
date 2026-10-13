import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { LandingPage } from './pages/LandingPage';
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { StudentProfilePage } from './pages/StudentProfilePage';
import { AptitudeAssessmentPage } from './pages/AptitudeAssessmentPage';
import { AnalysisPage } from './pages/AnalysisPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { CareerDetailPage } from './pages/CareerDetailPage';
import { SkillGapPage } from './pages/SkillGapPage';
import { CoursesPage } from './pages/CoursesPage';
import { CareerComparisonPage } from './pages/CareerComparisonPage';
import { FamilyReportPage } from './pages/FamilyReportPage';
import { ParentDashboard } from './pages/ParentDashboard';
import { AdminDashboard } from './pages/AdminDashboard';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />

              {/* Student Routes */}
              <Route
                path="/student/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/profile"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/assessment"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <AptitudeAssessmentPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/analyse"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <AnalysisPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/recommendations"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <RecommendationsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/career/:id"
                element={
                  <ProtectedRoute allowedRoles={['student', 'parent', 'admin']}>
                    <CareerDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/skill-gap"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <SkillGapPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/courses"
                element={
                  <ProtectedRoute allowedRoles={['student', 'parent']}>
                    <CoursesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/compare"
                element={
                  <ProtectedRoute allowedRoles={['student', 'parent']}>
                    <CareerComparisonPage />
                  </ProtectedRoute>
                }
              />

              {/* Shared Family Decision-Support Route */}
              <Route
                path="/family/report"
                element={
                  <ProtectedRoute allowedRoles={['student', 'parent', 'admin']}>
                    <FamilyReportPage />
                  </ProtectedRoute>
                }
              />

              {/* Parent Portal */}
              <Route
                path="/parent/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['parent']}>
                    <ParentDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Admin Portal */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
