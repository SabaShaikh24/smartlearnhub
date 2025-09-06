import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";




const About = () => {
     

  return (
    
      <motion.div
       id="about"
        role="region"                        // Tells screen readers this is a "section"
       aria-label="About SmartLearnHub"
     initial={{ opacity: 0, y: 50, scale: 0.95 }}   // Start slightly down and smaller
     animate={{ opacity: 1, y: 0, scale: 1 }}       // Fade in, slide up, scale to normal
     exit={{ opacity: 0, y: -50, scale: 0.95 }}    // Fade out and slide up a little
    transition={{ duration: 0.8, ease: "easeInOut" }}  // Animation duration
    >
    <div id="about" className="min-h-screen bg-[#ECE1D6]/20 dark:bg-gray-900/20 py-12 px-6 flex justify-center">
      <div className="max-w-4xl w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-lg p-8 transition-all duration-300">
        <h1  id="about-heading" className="text-3xl md:text-4xl font-bold mb-6 text-[#000000]">
          About SmartLearnHub
        </h1>
        <p className="text-black-700  mb-4 text-base md:text-lg leading-relaxed">
          SmartLearnHub is your go-to platform for accessing <b>curated notes, tutorials, and study resources** for B.Sc. CS/IT students.</b>
        </p>
        <p className="text-black-700  mb-4 text-base md:text-lg leading-relaxed">
          Our mission is to help students <b>learn faster and smarter</b> by providing organized, topic-wise resources along with AI-powered assistance.
        </p>
        <p className="text-black-700 mb-4 text-base md:text-lg leading-relaxed">
          Whether you want to revise concepts quickly, find tutorials, or interact with peers, SmartLearnHub ensures you have <b>everything in one place.</b>
        </p>
        
      </div>
    </div>
    </motion.div>
    
  );
};

export default About;
