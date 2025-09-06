import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const TermsConditions = () => {
  return (
    <motion.div
  initial={{ opacity: 0, y: 50, scale: 0.95 }}   // Start slightly down and smaller
  animate={{ opacity: 1, y: 0, scale: 1 }}       // Fade in, slide up, scale to normal
  exit={{ opacity: 0, y: -50, scale: 0.95 }}    // Fade out and slide up a little
  transition={{ duration: 0.8, ease: "easeInOut" }} // Slightly longer duration with easing
>

    <main role="main" aria-label="Terms and Conditions content" className="min-h-screen bg-[#ECE1D6]/20 dark:bg-gray-900/20 py-24 px-6 flex justify-center">
      <div role="region"  aria-labelledby="terms-heading"   className="max-w-4xl w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-lg p-8 transition-all duration-300">
        <h1  id="terms-heading"  className="text-3xl md:text-4xl font-bold mb-6 text-center text-[#000000]">
          Terms & Conditions
        </h1>
        <p className="mb-4 text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed">
          By using <span className="font-semibold">SmartLearnHub</span>, you agree to the following terms:
        </p>
        <ul className="list-disc ml-6 mb-4 text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed space-y-2">
          <li tabIndex={0}>You may access and use our content for personal and educational purposes only.</li>
          <li tabIndex={0}>You are not allowed to redistribute our content without permission.</li>
          <li tabIndex={0}>We reserve the right to update or modify the terms at any time without notice.</li>
          <li tabIndex={0}>All intellectual property on this site belongs to SmartLearnHub.</li>
        </ul>
        <p className="mb-4 text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed">
          Continued use of the site constitutes acceptance of these terms. For any questions, contact us at 
          <a href="mailto:info@smartlearnhub.com" className="text-[#d599ca] underline ml-1 hover:text-pink-500 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 rounded"aria-label="Send email to SmartLearnHub">
            info@smartlearnhub.com
          </a>.
        </p>
      </div>
    </main>
    </motion.div>
  );
};

export default TermsConditions;
