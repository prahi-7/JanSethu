import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaHome, 
  FaPlus, 
  FaList, 
  FaBook, 
  FaUsers, 
  FaChartBar, 
  FaMapMarkedAlt, 
  FaCog, 
  FaComments, 
  FaUser,
  FaSearch,
  FaProjectDiagram,
  FaUserShield,
  FaHandshake,
  FaDollarSign,
  FaUserTie,
  FaExternalLinkAlt,
  FaUniversity,
  FaBuilding,
  FaUserGraduate,
  FaCheckCircle,
  FaClock,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaBars,
  FaTimes
} from 'react-icons/fa';

const Sidebar = ({ role }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getMenuItems = () => {
    switch (role) {
      case 'citizen':
        return [
          { name: 'Dashboard', path: '/citizen/dashboard', icon: <FaHome /> },
          { name: 'Report Problem', path: '/citizen/report', icon: <FaPlus /> },
          { name: 'My Problems', path: '/citizen/problems', icon: <FaList /> },
          { name: 'Solutions', path: '/citizen/solutions', icon: <FaBook /> },
        ];

      case 'university':
        return [
          { name: 'Dashboard', path: '/university/dashboard', icon: <FaHome /> },
          { name: 'Student Login', path: '/university/login', icon: <FaSignInAlt /> },
          { name: 'Student Register', path: '/university/register', icon: <FaUserPlus /> },
        ];

      case 'student':
        return [
          { name: 'Dashboard', path: '/student/dashboard', icon: <FaHome /> },
          { name: 'Find Problems', path: '/student/find-problems', icon: <FaSearch /> },
          { name: 'My Projects', path: '/student/my-projects', icon: <FaProjectDiagram /> },
          { name: 'My Teams', path: '/student/teams', icon: <FaUsers /> },
          { name: 'Team Chat', path: '/student/chat/1', icon: <FaComments /> },
          { name: 'Solution Library', path: '/student/solution-library', icon: <FaBook /> },
        ];

      case 'admin':
        return [
          { name: 'Dashboard', path: '/admin/dashboard', icon: <FaHome /> },
          { name: 'Problems', path: '/admin/problems', icon: <FaList /> },
          { name: 'Users', path: '/admin/users', icon: <FaUsers /> },
          { name: 'Analytics', path: '/admin/analytics', icon: <FaChartBar /> },
          { name: 'Map', path: '/admin/map', icon: <FaMapMarkedAlt /> },
          { name: 'CPGRAMS', path: '/admin/cpgrams', icon: <FaExternalLinkAlt /> },
          { name: 'Settings', path: '/admin/settings', icon: <FaCog /> },
        ];

      case 'government':
        return [
          { name: 'Dashboard', path: '/government/dashboard', icon: <FaHome /> },
        ];

      case 'industry':
        return [
          { name: 'Dashboard', path: '/industry/dashboard', icon: <FaHome /> },
          { name: 'Projects', path: '/industry/projects', icon: <FaProjectDiagram /> },
          { name: 'Assign Mentor', path: '/industry/assign-mentor/1', icon: <FaUserTie /> },
          { name: 'Fund Project', path: '/industry/fund/1', icon: <FaDollarSign /> },
        ];

      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  const roleNames = {
    citizen: 'Citizen',
    student: 'Student',
    university: 'University',
    admin: 'Admin',
    government: 'Government',
    industry: 'Industry',
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      <button
        onClick={toggleMobileSidebar}
        className="md:hidden fixed bottom-4 right-4 z-50 bg-[#FFCABE] text-[#8B5E5E] p-3 rounded-full shadow-lg shadow-[#FFCABE]/30 hover:shadow-xl transition-all"
      >
        {isMobileOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      <aside 
        className={`
          fixed left-0 top-16 bottom-0 z-40
          w-64 bg-white/90 backdrop-blur-sm border-r border-[#FFCABE]
          transition-transform duration-300 ease-in-out
          overflow-y-auto
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
        style={{
          height: 'calc(100vh - 64px)',
          maxHeight: 'calc(100vh - 64px)',
        }}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center gap-2 px-4 py-2 mb-4 bg-[#FFF5F2] rounded-xl border border-[#FFCABE] flex-shrink-0">
            {role === 'admin' && <FaUserShield className="text-yellow-500" />}
            {role === 'citizen' && <FaUser className="text-[#D4A09A]" />}
            {role === 'student' && <FaUniversity className="text-[#D4A09A]" />}
            {role === 'university' && <FaUniversity className="text-[#D4A09A]" />}
            {role === 'industry' && <FaBuilding className="text-[#D4A09A]" />}
            {role === 'government' && <FaUserTie className="text-[#D4A09A]" />}
            <span className="text-sm text-gray-600 capitalize">
              {roleNames[role] || role || 'User'}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  location.pathname === item.path
                    ? 'bg-[#FFCABE] text-[#8B5E5E] font-semibold'
                    : 'text-gray-600 hover:bg-[#FFF5F2] hover:text-[#D4A09A]'
                }`}
                onClick={() => setIsMobileOpen(false)}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          <div className="flex-shrink-0 mt-4 pt-4 border-t border-[#FFCABE]">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all w-full"
            >
              <FaSignOutAlt className="text-xl" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/20 z-30"
          onClick={toggleMobileSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;