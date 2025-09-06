import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const PrivacyPolicy = () => {
  return (
    <motion.div
  initial={{ opacity: 0, y: 50, scale: 0.95 }}   // Start slightly down and smaller
  animate={{ opacity: 1, y: 0, scale: 1 }}       // Fade in, slide up, scale to normal
  exit={{ opacity: 0, y: -50, scale: 0.95 }}    // Fade out and slide up a little
  transition={{ duration: 0.8, ease: "easeInOut" }} // Slightly longer duration with easing
>

    <main role="main" aria-label="Privacy Policy content"
           className="min-h-screen bg-[#ECE1D6]/20 dark:bg-gray-900/20 py-24 px-4 flex justify-center overflow-auto">
      <div role="region" aria-labelledby="privacy-policy-heading" className="max-w-4xl w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-lg p-8 transition-all duration-300 sm:px-6">
        <h1  id="privacy-policy-heading" className="text-3xl md:text-4xl font-bold mb-6 text-center text-[#e38eb4]">
          Privacy Policy
        </h1>
        <p className="mb-4 sm:text-lg text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed">
          At <span className="font-semibold">SmartLearnHub</span>, your privacy is important to us. 
          We collect minimal personal data such as email addresses to send newsletters and updates.
        </p>
        <p className="mb-4 text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed">
          We do not share your data with third parties without your consent. You may unsubscribe from our mailing list anytime.
        </p>
        <p className="mb-4 text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed">
          We use cookies to improve user experience and track website usage in an anonymous manner.
        </p>
        <p className="mb-4 text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed">
          By using our website, you agree to this Privacy Policy. For any queries, contact us at 
          <a href="mailto:info@smartlearnhub.com" className="text-[#db81c7] underline ml-1 hover:text-pink-500 transition-colors  focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 rounded">
            info@smartlearnhub.com
          </a>.
        </p>
      </div>
    </main>
    </motion.div>
  );
};

export default PrivacyPolicy;
