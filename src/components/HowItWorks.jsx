import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaUser, 
  FaRobot, 
  FaLightbulb, 
  FaCheckCircle,
  FaArrowRight,
  FaMicrophone,
  FaCamera,
  FaVideo,
  FaMapMarkerAlt,
  FaArrowLeft
} from 'react-icons/fa';
import Navbar from './common/Navbar';
import Footer from './common/Footer';

const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: 'Report a Problem',
      description: 'Citizens can report issues using multiple methods - text, voice recording in any language, photos, or videos. Even works without internet!',
      icon: <FaUser className="text-4xl text-pink-400" />,
      details: ['📝 Text description', '🎤 Voice recording', '📸 Photo upload', '🎥 Video upload', '📍 GPS location'],
      bg: 'bg-[#FFF5F2]',
      border: 'border-[#FFCABE]'
    },
    {
      number: '02',
      title: 'AI Analysis & Matching',
      description: 'Our AI automatically categorizes problems, detects duplicates, finds similar solutions, and matches them to the best teams.',
      icon: <FaRobot className="text-4xl text-blue-400" />,
      details: ['🤖 Auto-categorization', '🔍 Duplicate detection', '📊 Priority scoring', '🎯 Smart matching', '♻️ Solution replication'],
      bg: 'bg-blue-50',
      border: 'border-blue-200'
    },
    {
      number: '03',
      title: 'Collaborative Solution Building',
      description: 'University students form teams, get mentorship from industry experts, and develop innovative solutions with real-world impact.',
      icon: <FaLightbulb className="text-4xl text-yellow-400" />,
      details: ['👥 Team formation', '👨‍🏫 Industry mentorship', '💬 Team chat', '📈 Progress tracking', '🏆 Gamification'],
      bg: 'bg-yellow-50',
      border: 'border-yellow-200'
    },
    {
      number: '04',
      title: 'Deploy & Verify',
      description: 'Solutions are deployed in communities, verified by citizens, and stored in the solution library for future replication.',
      icon: <FaCheckCircle className="text-4xl text-green-400" />,
      details: ['🚀 Solution deployment', '✅ Citizen verification', '📚 Solution library', '♻️ Auto-replication', '📊 Impact tracking'],
      bg: 'bg-green-50',
      border: 'border-green-200'
    }
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
            How <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFCABE] to-blue-500">JanSethu</span> Works
          </h1>
          <p className="text-sm md:text-base lg:text-lg text-gray-500 max-w-2xl mx-auto">
            A complete ecosystem for citizen problem-solving - from reporting to solution deployment
          </p>
        </div>

        <div className="space-y-8 md:space-y-12 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className={`${step.bg} rounded-3xl p-6 md:p-8 border ${step.border} shadow-sm hover:shadow-md transition-all`}>
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white/80 rounded-2xl flex items-center justify-center shadow-md border border-gray-100">
                    {step.icon}
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-gray-300 mt-2 text-center">{step.number}</div>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">{step.title}</h2>
                  <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4 leading-relaxed">{step.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {step.details.map((detail, idx) => (
                      <span key={idx} className="text-xs md:text-sm text-gray-600 bg-white/70 px-3 py-1 rounded-full border border-gray-100">
                        {detail}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10 md:mt-16 bg-gradient-to-r from-[#FFF5F2] to-blue-50 rounded-3xl p-6 md:p-8 border border-pink-100">
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">Ready to Get Started?</h3>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            <Link
              to="/login"
              className="px-6 py-2.5 md:px-8 md:py-3 bg-gradient-to-r from-[#FFCABE] to-[#E8B5A9] text-white rounded-full font-semibold hover:shadow-lg transition-all hover:scale-105 text-sm md:text-base"
            >
              Login Now
            </Link>
            <Link
              to="/register"
              className="px-6 py-2.5 md:px-8 md:py-3 bg-white text-[#D4A09A] rounded-full font-semibold border-2 border-[#FFCABE] hover:shadow-lg transition-all hover:scale-105 text-sm md:text-base"
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

export default HowItWorks;