import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaBars, 
  FaTimes,
  FaBullhorn,
  FaInfoCircle,
  FaCheckCircle,
  FaSignOutAlt,
  FaUserCircle,
  FaHome
} from 'react-icons/fa';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'How It Works', path: '/how-it-works', icon: <FaBullhorn /> },
    { name: 'About', path: '/about', icon: <FaInfoCircle /> },
    { name: 'Solved Problems', path: '/solved-problems', icon: <FaCheckCircle /> },
  ];

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    const roleMap = {
      citizen: '/citizen/dashboard',
      student: '/student/dashboard',
      university: '/university/dashboard',
      admin: '/admin/dashboard',
      government: '/government/dashboard',
      industry: '/industry/dashboard',
    };
    return roleMap[user.role] || '/login';
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-[#FFCABE] fixed top-0 left-0 right-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="w-10 h-10 bg-[#FFCABE] rounded-lg flex items-center justify-center shadow-md shadow-[#FFCABE]/30 group-hover:shadow-lg transition-all group-hover:scale-105">
            <span className="text-[#8B5E5E] font-bold text-xl">JS</span>
          </div>
          <span className="text-xl font-bold text-gray-700 hidden sm:block group-hover:text-[#FFCABE] transition-colors">
            Jan<span className="text-[#FFCABE]">Sethu</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-gray-600 hover:text-[#D4A09A] transition-colors flex items-center space-x-1 text-sm font-medium"
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}

          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <Link
                to={getDashboardLink()}
                className="text-gray-600 hover:text-[#D4A09A] transition-colors text-sm font-medium flex items-center gap-1"
              >
                <FaHome /> Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-red-500 transition-colors flex items-center gap-1 text-sm font-medium"
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="text-gray-600 hover:text-[#D4A09A] transition-colors px-3 py-2 text-sm font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-[#FFCABE] text-[#8B5E5E] px-6 py-2 rounded-full text-sm font-semibold hover:shadow-lg shadow-[#FFCABE]/30 transition-all hover:scale-105"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-gray-600 hover:text-[#D4A09A] transition-colors"
        >
          {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-[#FFCABE] py-4 px-4 shadow-lg">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-gray-600 hover:text-[#D4A09A] transition-colors flex items-center space-x-2 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                <Link
                  to={getDashboardLink()}
                  className="text-[#D4A09A] font-semibold py-2 flex items-center space-x-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaHome /> Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-red-500 py-2 flex items-center space-x-2 border-t border-gray-100 pt-3"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-[#FFCABE] text-[#8B5E5E] px-6 py-2 rounded-full text-center font-semibold"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;