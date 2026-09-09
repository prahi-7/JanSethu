import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

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
import CreateTeam from './components/student/CreateTeam';
import TeamDetail from './components/student/TeamDetails';
import StudentProblemDetail from './components/student/StudentProblemDetail';
import CreateProject from './components/student/CreateProject';

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
import IndustryProjectDetail from './components/industry/IndustryProjectDetail';
import IndustryProblemDetail from './components/industry/IndustryProblemDetail';
import AssignMentor from './components/industry/AssignMentor';
import FundProject from './components/industry/FundProject';

// Government Components
import GovernmentDashboard from './components/government/GovernmentDashboard';
import GovernmentProblemDetail from './components/government/GovernmentDetail';

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
                boxShadow:
                  '0 10px 30px rgba(0,0,0,0.1)',
                border:
                  '1px solid #e5e7eb',
              },

              success: {
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#ffffff'
                },
              },

              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#ffffff'
                },
              },
            }}
          />

          <Routes>

            {/* ============================================
                PUBLIC
            ============================================ */}

            <Route
              path="/"
              element={<Home />}
            />

            <Route
              path="/how-it-works"
              element={<HowItWorks />}
            />

            <Route
              path="/about"
              element={<About />}
            />

            <Route
              path="/solved-problems"
              element={<SolvedProblems />}
            />

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/register"
              element={<Register />}
            />


            {/* ============================================
                CITIZEN
            ============================================ */}

            <Route
              path="/citizen/dashboard"
              element={<CitizenDashboard />}
            />

            <Route
              path="/citizen/report"
              element={<ReportProblem />}
            />

            <Route
              path="/citizen/problems"
              element={<MyProblems />}
            />

            <Route
              path="/citizen/problem/:id"
              element={<ProblemDetail />}
            />

            <Route
              path="/citizen/solutions"
              element={<Solutions />}
            />

            <Route
              path="/citizen/track/:id"
              element={<TrackProblem />}
            />


            {/* ============================================
                UNIVERSITY
            ============================================ */}

            <Route
              path="/university/dashboard"
              element={<UniversityDashboard />}
            />

            <Route
              path="/university/login"
              element={<StudentLogin />}
            />

            <Route
              path="/university/register"
              element={<StudentRegister />}
            />


            {/* ============================================
                STUDENT
            ============================================ */}

            <Route
              path="/student/dashboard"
              element={<StudentDashboard />}
            />

            <Route
              path="/student/find-problems"
              element={<FindProblems />}
            />

            <Route
              path="/student/my-projects"
              element={<MyProjects />}
            />

            <Route
              path="/student/project/:id"
              element={<ProjectDetail />}
            />

            <Route
              path="/student/solution-library"
              element={<SolutionLibrary />}
            />

            <Route
              path="/student/teams"
              element={<UniversityTeams />}
            />

            <Route
              path="/student/teams/create"
              element={<CreateTeam />}
            />

            <Route
              path="/student/teams/:teamId"
              element={<TeamDetail />}
            />

            <Route
              path="/student/chat/:teamId"
              element={<TeamChat />}
            />

            <Route
              path="/student/problem/:id"
              element={<StudentProblemDetail />}
            />

            <Route
              path="/student/create-project"
              element={<CreateProject />}
            />


            {/* ============================================
                ADMIN
            ============================================ */}

            <Route
              path="/admin/dashboard"
              element={<AdminDashboard />}
            />

            <Route
              path="/admin/problems"
              element={<ManageProblems />}
            />

            <Route
              path="/admin/users"
              element={<ManageUsers />}
            />

            <Route
              path="/admin/analytics"
              element={<Analytics />}
            />

            <Route
              path="/admin/map"
              element={<ProblemMap />}
            />

            <Route
              path="/admin/settings"
              element={<AdminSettings />}
            />

            <Route
              path="/admin/cpgrams"
              element={<CpgramsIntegration />}
            />


            {/* ============================================
                INDUSTRY
            ============================================ */}

            <Route
              path="/industry/dashboard"
              element={<IndustryDashboard />}
            />

            <Route
              path="/industry/projects"
              element={<IndustryProjects />}
            />

            <Route
              path="/industry/project/:id"
              element={<IndustryProjectDetail />}
            />

            <Route
              path="/industry/problem/:id"
              element={<IndustryProblemDetail />}
            />

            <Route
              path="/industry/assign-mentor/:projectId"
              element={<AssignMentor />}
            />

            <Route
              path="/industry/fund/:projectId"
              element={<FundProject />}
            />


            {/* ============================================
                GOVERNMENT
            ============================================ */}

            <Route
              path="/government/dashboard"
              element={<GovernmentDashboard />}
            />

            <Route
              path="/government/problems"
              element={<GovernmentDashboard />}
            />

            <Route
              path="/government/problems/:id"
              element={<GovernmentProblemDetail />}
            />


            {/* ============================================
                404
            ============================================ */}

            <Route
              path="*"
              element={<Navigate to="/" />}
            />

          </Routes>

        </div>

      </AuthProvider>
    </Router>
  );
}

export default App;