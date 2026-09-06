import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaGithub, 
  FaTwitter, 
  FaLinkedin, 
  FaYoutube,
  FaHeart,
  FaFacebook,
  FaInstagram
} from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#FFF5F2] border-t border-[#FFCABE] text-gray-700">
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-3 md:mb-4">
              <div className="w-10 h-10 bg-[#FFCABE] rounded-lg flex items-center justify-center shadow-md">
                <span className="text-[#8B5E5E] font-bold text-xl">JS</span>
              </div>
              <span className="text-xl font-bold text-gray-700">Jan<span className="text-[#D4A09A]">Sethu</span></span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              JanSethu is a national platform empowering citizens to report problems and 
              connect with universities, industry experts, and government to build solutions 
              for a better India.
            </p>
            <div className="flex space-x-4 mt-3 md:mt-4">
              <a href="#" className="text-gray-400 hover:text-[#D4A09A] transition-colors text-xl">
                <FaFacebook />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#D4A09A] transition-colors text-xl">
                <FaTwitter />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#D4A09A] transition-colors text-xl">
                <FaInstagram />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#D4A09A] transition-colors text-xl">
                <FaLinkedin />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#D4A09A] transition-colors text-xl">
                <FaYoutube />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-3 md:mb-4 text-gray-700">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/how-it-works" className="text-gray-500 hover:text-[#D4A09A] transition-colors">How It Works</Link></li>
              <li><Link to="/about" className="text-gray-500 hover:text-[#D4A09A] transition-colors">About Us</Link></li>
              <li><Link to="/solved-problems" className="text-gray-500 hover:text-[#D4A09A] transition-colors">Solved Problems</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-3 md:mb-4 text-gray-700">For Users</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/citizen/report" className="text-gray-500 hover:text-[#D4A09A] transition-colors">Report a Problem</Link></li>
              <li><Link to="/register" className="text-gray-500 hover:text-[#D4A09A] transition-colors">Register as Student</Link></li>
              <li><Link to="/register" className="text-gray-500 hover:text-[#D4A09A] transition-colors">Register as Industry</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-3 md:mb-4 text-gray-700">Get in Touch</h4>
            <ul className="space-y-2 md:space-y-3 text-sm">
              <li className="flex items-start space-x-3"><span className="text-gray-400">📍</span><span className="text-gray-500">India</span></li>
              <li className="flex items-start space-x-3"><span className="text-gray-400">📧</span><span className="text-gray-500">support@jansethu.in</span></li>
              <li className="flex items-start space-x-3"><span className="text-gray-400">📞</span><span className="text-gray-500">+91 12345 67890</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#FFCABE] mt-6 md:mt-8 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {currentYear} JanSethu. All rights reserved.</p>
          <div className="flex items-center space-x-4 mt-2 md:mt-0">
            <Link to="/privacy" className="hover:text-gray-700 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-gray-700 transition-colors">Terms of Service</Link>
            <Link to="/faq" className="hover:text-gray-700 transition-colors">FAQ</Link>
          </div>
          <p className="flex items-center space-x-1 mt-2 md:mt-0">
            Made with <FaHeart className="text-red-400 animate-pulse" /> in India
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;