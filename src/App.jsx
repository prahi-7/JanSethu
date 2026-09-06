import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Auth Pages
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Citizen Components
import CitizenDashboard from './components/citizen/CitizenDashboard';
import ReportProblem from './components/citizen/ReportProblem';
import MyProblems from './components/citizen/MyProblems';
import ProblemDetail from './components/citizen/ProblemDetail';
import Solutions from './components/citizen/Solutions';
import TrackProblem from './components/citizen/TrackProblem';

// University Components
import UniversityDashboard from './components/university/UniversityDashboard';
import StudentLogin from './components/university/StudentLogin';
import StudentRegister from './components/university/StudentRegister';

// Student Components
import StudentDashboard from './components/student/StudentDashboard';
import FindProblems from './components/student/FindProblems';
import MyProjects from './components/student/MyProjects';
import ProjectDetail from './components/student/ProjectDetail';
import SolutionLibrary from './components/student/SolutionLibrary';
import UniversityTeams from './components/student/UniversityTeams';
import TeamChat from './components/student/TeamChat';

// Admin Components
import AdminDashboard from './components/admin/AdminDashboard';
import ManageProblems from './components/admin/ManageProblems';
import ManageUsers from './components/admin/ManageUsers';
import Analytics from './components/admin/Analytics';
import ProblemMap from './components/admin/ProblemMap';
import AdminSettings from './components/admin/AdminSettings';
import CpgramsIntegration from './components/admin/CpgramsIntegration';

// Industry Components
import IndustryDashboard from './components/industry/IndustryDashboard';
import IndustryProjects from './components/industry/IndustryProjects';
import AssignMentor from './components/industry/AssignMentor';
import FundProject from './components/industry/FundProject';

// Government Components
import GovernmentDashboard from './components/government/GovernmentDashboard';


// Landing Pages
import Home from './components/Home';
import HowItWorks from './components/HowItWorks';
import About from './components/About';
import SolvedProblems from './components/SolvedProblems';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#ffffff',
                color: '#1f2937',
                borderRadius: '12px',
                padding: '16px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb',
              },
              success: {
                iconTheme: { primary: '#22c55e', secondary: '#ffffff' },
              },
              error: {
                iconTheme: { primary: '#ef4444', secondary: '#ffffff' },
              },
            }}
          />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/about" element={<About />} />
            <Route path="/solved-problems" element={<SolvedProblems />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Citizen Routes */}
            <Route path="/citizen/dashboard" element={<CitizenDashboard />} />
            <Route path="/citizen/report" element={<ReportProblem />} />
            <Route path="/citizen/problems" element={<MyProblems />} />
            <Route path="/citizen/problem/:id" element={<ProblemDetail />} />
            <Route path="/citizen/solutions" element={<Solutions />} />
            <Route path="/citizen/track/:id" element={<TrackProblem />} />

            {/* University Routes */}
            <Route path="/university/dashboard" element={<UniversityDashboard />} />
            <Route path="/university/login" element={<StudentLogin />} />
            <Route path="/university/register" element={<StudentRegister />} />

            {/* Student Routes */}
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/find-problems" element={<FindProblems />} />
            <Route path="/student/my-projects" element={<MyProjects />} />
            <Route path="/student/project/:id" element={<ProjectDetail />} />
            <Route path="/student/solution-library" element={<SolutionLibrary />} />
            <Route path="/student/teams" element={<UniversityTeams />} />
            <Route path="/student/chat/:teamId" element={<TeamChat />} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/problems" element={<ManageProblems />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/analytics" element={<Analytics />} />
            <Route path="/admin/map" element={<ProblemMap />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/cpgrams" element={<CpgramsIntegration />} />

            {/* Industry Routes */}
            <Route path="/industry/dashboard" element={<IndustryDashboard />} />
            <Route path="/industry/projects" element={<IndustryProjects />} />
            <Route path="/industry/assign-mentor/:projectId" element={<AssignMentor />} />
            <Route path="/industry/fund/:projectId" element={<FundProject />} />

            {/* Government Routes */}
            <Route path="/government/dashboard" element={<GovernmentDashboard />} />


            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;