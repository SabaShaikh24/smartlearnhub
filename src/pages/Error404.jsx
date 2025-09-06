import React from "react";
import { NavLink } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const Error404 = () => {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-r from-[#ECE1D6]/30 via-[#F5E9E0]/20 to-[#ECE1D6]/30 dark:bg-gray-900/20 px-6"role="main" aria-label="Page not found error"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
    >
      {/* Animated background circles */}
      <motion.div
        className="absolute w-96 h-96 bg-[#D9C4B0]/30 rounded-full top-[-10%] left-[-10%] blur-3xl"
        animate={{ x: ["0%", "20%", "0%"], y: ["0%", "15%", "0%"] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-72 h-72 bg-[#D59B99]/20 rounded-full bottom-[-10%] right-[-10%] blur-2xl"
        animate={{ x: ["0%", "-15%", "0%"], y: ["0%", "-10%", "0%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Bouncing 404 */}
      <motion.div
        className="flex items-center justify-center w-64 h-64 sm:w-80 sm:h-80 bg-white/80 dark:bg-gray-800/80 rounded-full shadow-lg mb-8"  role="presentation"
        animate={{ y: ["0%", "-15%", "0%"], rotate: ["0deg", "10deg", "0deg"] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-6xl sm:text-8xl font-bold text-[#D59B99]" aria-hidden="true">404</span>
      </motion.div>

      {/* Message */}
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-[#4B4B4B] dark:text-gray-100 text-center">
        Oops! Page Not Found
      </h1>
      <p className="text-gray-700 dark:text-gray-550 mb-6 text-center text-base sm:text-lg px-4" role="alert">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>

      {/* Navigation Button */}
      
      <NavLink
        to="/"
        className="bg-[#D59B99] text-white px-6 py-3 rounded-lg shadow-lg hover:bg-[#c47371] transition-all duration-300 font-semibold  focus:outline-none focus:ring-2 focus:ring-[#D59B99] focus:ring-offset-2"  aria-label="Go back to homepage"
      >
        Go Back Home
      </NavLink>
      
    </motion.div>
  );
};

export default Error404;
