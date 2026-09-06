import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaBullhorn, 
  FaUsers, 
  FaLightbulb, 
  FaMapMarkedAlt,
  FaRocket,
  FaShieldAlt,
  FaHandshake,
  FaGlobe,
  FaCheck,
  FaSync,
  FaStar,
  FaArrowRight
} from 'react-icons/fa';
import Navbar from './common/Navbar';
import Footer from './common/Footer';

const Home = () => {
  const stats = [
    { number: '0', label: 'Problems Solved', icon: <FaCheck className="text-[#D4A09A]" />, bg: 'bg-[#FFF5F2]' },
    { number: '0', label: 'Active Projects', icon: <FaRocket className="text-[#D4A09A]" />, bg: 'bg-[#FFF5F2]' },
    { number: '0', label: 'Solutions Reused', icon: <FaSync className="text-[#D4A09A]" />, bg: 'bg-[#FFF5F2]' },
    { number: '0', label: 'Communities Benefited', icon: <FaUsers className="text-[#D4A09A]" />, bg: 'bg-[#FFF5F2]' },
  ];

  const steps = [
    {
      icon: <FaBullhorn className="text-3xl md:text-4xl text-[#D4A09A]" />,
      title: 'Report a Problem',
      description: 'Citizens report issues via text, voice, photo, or video – even without internet.',
      bg: 'bg-[#FFF5F2]',
    },
    {
      icon: <FaUsers className="text-3xl md:text-4xl text-[#D4A09A]" />,
      title: 'AI Matches to Teams',
      description: 'Our AI finds the perfect student team, mentor, and industry partner.',
      bg: 'bg-[#FFF5F2]',
    },
    {
      icon: <FaLightbulb className="text-3xl md:text-4xl text-[#D4A09A]" />,
      title: 'Build Solutions',
      description: 'University teams collaborate with industry experts to develop solutions.',
      bg: 'bg-[#FFF5F2]',
    },
    {
      icon: <FaMapMarkedAlt className="text-3xl md:text-4xl text-[#D4A09A]" />,
      title: 'Deploy & Verify',
      description: 'Solutions are deployed in communities and verified by citizens.',
      bg: 'bg-[#FFF5F2]',
    },
  ];

  const features = [
    {
      icon: <FaShieldAlt className="text-3xl text-[#D4A09A]" />,
      title: 'Secure & Trusted',
      description: 'Your data is protected with enterprise-grade security.',
      bg: 'bg-[#FFF5F2]',
    },
    {
      icon: <FaHandshake className="text-3xl text-[#D4A09A]" />,
      title: 'Collaborative',
      description: 'Connect with universities, industry, and government.',
      bg: 'bg-[#FFF5F2]',
    },
    {
      icon: <FaGlobe className="text-3xl text-[#D4A09A]" />,
      title: 'Nationwide',
      description: 'A national platform for solving problems across India.',
      bg: 'bg-[#FFF5F2]',
    },
    {
      icon: <FaRocket className="text-3xl text-[#D4A09A]" />,
      title: 'Impact-Driven',
      description: 'Every problem solved creates lasting impact.',
      bg: 'bg-[#FFF5F2]',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFF5F2] pt-16">
      <Navbar />

      <section className="relative pt-16 md:pt-28 pb-12 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#FFCABE] rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FFCABE] rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
          <div className="inline-block px-4 py-1.5 md:px-6 md:py-2 bg-[#FFCABE] text-[#8B5E5E] rounded-full text-xs md:text-sm font-semibold mb-4 md:mb-6 shadow-sm">
            🇮🇳 A National Platform for Citizen Problem-Solving
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
            <span className="text-[#D4A09A]">
              JanSethu
            </span>
            <br />
            <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-600 mt-2 block font-light">
              People's Bridge to Solutions
            </span>
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-500 mt-4 md:mt-6 max-w-2xl mx-auto px-4 leading-relaxed">
            A national platform connecting citizens with universities, industry, and government to solve grassroots problems collaboratively.
          </p>
          
          <div className="mt-6 md:mt-10 flex flex-wrap justify-center gap-3 md:gap-4">
            <Link
              to="/login"
              className="px-6 py-2.5 md:px-8 md:py-4 bg-[#FFCABE] text-[#8B5E5E] rounded-full font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 text-sm md:text-base shadow-[#FFCABE]/30"
            >
              Get Started 🚀
            </Link>
            <Link
              to="/how-it-works"
              className="px-6 py-2.5 md:px-8 md:py-4 bg-white text-[#D4A09A] rounded-full font-semibold shadow-md border border-[#FFCABE] hover:shadow-lg transition-all hover:scale-105 text-sm md:text-base"
            >
              Learn More
            </Link>
          </div>

          <div className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className={`${stat.bg} rounded-2xl shadow-sm border border-[#FFCABE] p-3 md:p-4 lg:p-6 hover:shadow-lg transition-all hover:scale-105`}>
                <div className="flex items-center justify-center gap-1 md:gap-2 mb-1 md:mb-2">
                  {stat.icon}
                  <div className="text-lg md:text-2xl lg:text-3xl font-bold text-gray-700">{stat.number}</div>
                </div>
                <div className="text-[10px] md:text-xs lg:text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 md:mb-4">
              How <span className="text-[#D4A09A]">JanSethu</span> Works
            </h2>
            <p className="text-sm md:text-base text-gray-500 max-w-2xl mx-auto">
              A simple 4-step process to turn citizen problems into real solutions
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center group">
                <div className={`${step.bg} w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-sm group-hover:shadow-lg transition-all group-hover:scale-110 border border-[#FFCABE]`}>
                  {step.icon}
                </div>
                <div className="text-base md:text-lg font-semibold text-gray-700">{step.title}</div>
                <p className="text-xs md:text-sm text-gray-500 mt-1 md:mt-2 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-[#FFF5F2]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 md:mb-4">
              Why <span className="text-[#D4A09A]">JanSethu</span>?
            </h2>
            <p className="text-sm md:text-base text-gray-500 max-w-2xl mx-auto">
              Built for citizens, powered by collaboration, designed for impact
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className={`${feature.bg} rounded-2xl p-6 border border-[#FFCABE] hover:shadow-lg transition-all`}>
                <div className="flex items-center justify-center w-16 h-16 rounded-xl mb-4 mx-auto bg-white/70">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-700 text-center mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 text-center leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-[#FFCABE]">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#8B5E5E] mb-3 md:mb-4">Ready to Make a Difference?</h2>
          <p className="text-sm md:text-base lg:text-lg text-[#8B5E5E]/80 mb-6 md:mb-10 max-w-2xl mx-auto">
            Join thousands of citizens, students, and industry experts solving problems together.
          </p>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            <Link
              to="/login"
              className="px-6 py-2.5 md:px-8 md:py-4 bg-white text-[#D4A09A] rounded-full font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 text-sm md:text-base"
            >
              Get Started 🚀
            </Link>
            <Link
              to="/register"
              className="px-6 py-2.5 md:px-8 md:py-4 bg-transparent text-[#8B5E5E] rounded-full font-semibold border-2 border-[#8B5E5E] hover:bg-[#8B5E5E] hover:text-white transition-all text-sm md:text-base"
            >
              Join as Student
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;