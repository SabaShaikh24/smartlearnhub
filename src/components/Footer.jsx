import React from 'react';
import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiMail, FiLinkedin } from "react-icons/fi";

const Footer = () => {
  return (
    <footer 
      className="bg-[#ECE1D6]/80 dark:bg-gray-900/80 backdrop-blur-md 
                 text-[#4B4B4B] dark:text-gray-300 mt-20 shadow-inner 
                 rounded-t-2xl transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Logo Section */}
        <div className="flex flex-col items-start gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#D9C4B0] flex items-center justify-center 
                            overflow-hidden transform transition-transform duration-300 
                            hover:scale-110 hover:rotate-3">
              <img src="/fa.svg" alt="SmartLearnHub logo" className="w-8 h-8" />
            </div>
            <span className="font-semibold text-lg select-none">SmartLearnHub</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-400">
            Helping students access curated notes, tutorials, and learning resources all in one place.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold mb-4 text-[#4B4B4B] dark:text-gray-200">Quick Links</h3>
          <nav aria-label="Footer Navigation" className="flex flex-col gap-2 text-xs sm:text-sm">
            <Link 
              to="/about" 
              className="hover:text-[#D59B99] dark:hover:text-pink-300 
                         transition-transform duration-300 hover:scale-105 
                         focus-visible:ring-2 focus-visible:ring-[#D59B99] rounded-md px-1"
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="hover:text-[#D59B99] dark:hover:text-pink-300 
                         transition-transform duration-300 hover:scale-105 
                         focus-visible:ring-2 focus-visible:ring-[#D59B99] rounded-md px-1"
            >
              Contact
            </Link>
            <Link 
              to="/privacy" 
              className="hover:text-[#D59B99] dark:hover:text-pink-300 
                         transition-transform duration-300 hover:scale-105 
                         focus-visible:ring-2 focus-visible:ring-[#D59B99] rounded-md px-1"
            >
              Privacy
            </Link>
            <Link 
              to="/termsconditions" 
              className="hover:text-[#D59B99] dark:hover:text-pink-300 
                         transition-transform duration-300 hover:scale-105 
                         focus-visible:ring-2 focus-visible:ring-[#D59B99] rounded-md px-1"
            >
              Terms & Conditions
            </Link>
          </nav>
        </div>

        {/* Social Icons */}
        <div>
          <h3 className="font-semibold mb-4 text-[#4B4B4B] dark:text-gray-200">Follow Us</h3>
          <div className="flex gap-4">
            <a 
              href="https://github.com/" 
              aria-label="GitHub"
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-[#D59B99] dark:hover:text-pink-300 
                         hover:scale-110 transition-transform duration-300 
                         focus-visible:ring-2 focus-visible:ring-[#D59B99] rounded-md p-1"
            >
              <FiGithub size={20} />
            </a>
            <a 
              href="https://twitter.com" 
              aria-label="Twitter"
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-[#D59B99] dark:hover:text-pink-300 
                         hover:scale-110 transition-transform duration-300 
                         focus-visible:ring-2 focus-visible:ring-[#D59B99] rounded-md p-1"
            >
              <FiTwitter size={20} />
            </a>
            <a 
              href="https://linkedin.com/company/your-page" 
              aria-label="LinkedIn"
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-[#D59B99] dark:hover:text-pink-300 
                         hover:scale-110 transition-transform duration-300 
                         focus-visible:ring-2 focus-visible:ring-[#D59B99] rounded-md p-1"
            >
              <FiLinkedin size={20} />
            </a>
            <a 
              href="mailto:info@smartlearnhub.com" 
              aria-label="Email"
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-[#D59B99] dark:hover:text-pink-300 
                         hover:scale-110 transition-transform duration-300 
                         focus-visible:ring-2 focus-visible:ring-[#D59B99] rounded-md p-1"
            >
              <FiMail size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-[#C2AA94] mt-6 text-center py-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-[#cf72bbbe]">
        &copy; {new Date().getFullYear()} SmartLearnHub. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
