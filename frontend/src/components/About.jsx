import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaHeart, 
  FaUsers, 
  FaCheckCircle, 
  FaRocket,
  FaGlobe,
  FaHandshake,
  FaLightbulb,
  FaShieldAlt,
  FaQuoteLeft,
  FaArrowLeft
} from 'react-icons/fa';
import Navbar from './common/Navbar';
import Footer from './common/Footer';

const About = () => {
  const stats = [
    { number: '0', label: 'Problems Solved', icon: <FaCheckCircle className="text-green-400" /> },
    { number: '0', label: 'Active Projects', icon: <FaRocket className="text-blue-400" /> },
    { number: '0', label: 'Solutions Reused', icon: <FaLightbulb className="text-yellow-400" /> },
    { number: '0', label: 'Communities Benefited', icon: <FaUsers className="text-purple-400" /> },
    { number: '0', label: 'Universities', icon: <FaUsers className="text-orange-400" /> },
    { number: '0', label: 'Industry Partners', icon: <FaHandshake className="text-green-400" /> },
  ];

  const values = [
    {
      icon: <FaUsers className="text-3xl text-pink-400" />,
      title: 'Citizen First',
      description: 'Every problem reported by a citizen is heard and addressed with priority.',
      bg: 'bg-[#FFF5F2]',
      border: 'border-[#FFCABE]'
    },
    {
      icon: <FaHandshake className="text-3xl text-blue-400" />,
      title: 'Collaboration',
      description: 'Universities, industry, and government work together to build solutions.',
      bg: 'bg-blue-50',
      border: 'border-blue-200'
    },
    {
      icon: <FaLightbulb className="text-3xl text-yellow-400" />,
      title: 'Innovation',
      description: 'Student teams develop innovative solutions with industry mentorship.',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200'
    },
    {
      icon: <FaGlobe className="text-3xl text-purple-400" />,
      title: 'Nationwide Impact',
      description: 'A national platform solving problems across India.',
      bg: 'bg-purple-50',
      border: 'border-purple-200'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F2] via-white to-blue-50 pt-16">
      <Navbar />
      <div className="container mx-auto px-4 md:px-6 pt-20 pb-12 md:pt-28 md:pb-20">
        {/* Back to Home */}
        <Link to="/" className="inline-flex items-center gap-2 text-[#FFCABE] hover:text-pink-700 transition-colors mb-6 md:mb-10 text-sm group">
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>

        <div className="text-center mb-10 md:mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 md:mb-4">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFCABE] to-blue-500">JanSethu</span>
          </h1>
          <p className="text-sm md:text-base lg:text-lg text-gray-500 max-w-2xl mx-auto">
            People's Bridge to Solutions - A national platform for collaborative problem-solving
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-gradient-to-r from-[#FFF5F2] to-blue-50 rounded-3xl p-6 md:p-10 lg:p-12 border border-pink-100 mb-10 md:mb-16">
          <div className="max-w-3xl mx-auto text-center">
            <FaQuoteLeft className="text-4xl text-pink-400 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 md:mb-4">Our Mission</h2>
            <p className="text-sm md:text-base lg:text-lg text-gray-600 leading-relaxed">
              JanSethu is a national platform that connects citizens with universities, 
              industry experts, and government to solve grassroots problems collaboratively.
              Our mission is to empower every citizen to report problems and connect with 
              the right people to build solutions that create lasting impact across India.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-10 md:mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-3 md:p-4 text-center hover:shadow-md transition-all hover:border-[#FFCABE]">
              <div className="flex justify-center text-xl md:text-2xl mb-1 md:mb-2">{stat.icon}</div>
              <div className="text-lg md:text-xl font-bold text-gray-700">{stat.number}</div>
              <div className="text-[10px] md:text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="mb-10 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8 md:mb-12">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFCABE] to-blue-500">Core Values</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {values.map((value, index) => (
              <div key={index} className={`${value.bg} rounded-2xl p-6 border ${value.border} hover:shadow-lg transition-all`}>
                <div className="flex justify-center mb-3">{value.icon}</div>
                <h3 className="text-base md:text-lg font-semibold text-gray-700 text-center mb-2">{value.title}</h3>
                <p className="text-xs md:text-sm text-gray-500 text-center leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-[#FFCABE] via-[#E8B5A9] to-purple-500 rounded-3xl p-6 md:p-10 lg:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 md:mb-4">Join the Movement</h2>
          <p className="text-sm md:text-base text-white/80 mb-6 md:mb-8 max-w-2xl mx-auto">
            Be part of India's largest collaborative problem-solving platform.
          </p>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            <Link
              to="/login"
              className="px-6 py-2.5 md:px-8 md:py-3 bg-white text-[#D4A09A] rounded-full font-semibold hover:shadow-lg transition-all hover:scale-105 text-sm md:text-base"
            >
              Login Now
            </Link>
            <Link
              to="/register"
              className="px-6 py-2.5 md:px-8 md:py-3 bg-transparent text-white rounded-full font-semibold border-2 border-white hover:bg-white hover:text-[#D4A09A] transition-all text-sm md:text-base"
            >
              Register as Student
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;