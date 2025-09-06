import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const Loader = () => {
  const dotVariants = {
    animate: {
      rotate: 360,
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: "linear",
      },
    },
  };

  return (
    <div className="fixed inset-0 bg-[#ECE1D6]/80 dark:bg-gray-900/90 flex items-center justify-center z-50 "
    role="status"
  aria-live="polite"
  aria-label="Content is loading"
  >
    <span className="sr-only">Loading...</span>
      <div className="relative w-20 h-20 sm:w-24 sm:h-24">
        {/* Orbiting dots */}
        <motion.div
          className="absolute w-full h-full flex items-center justify-center"
          variants={dotVariants}
          animate="animate"
        >
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 sm:w-4 sm:h-4 bg-[#D59B99] rounded-full"
              style={{
                top: 0,
                left: "50%",
                marginLeft: "-0.5rem",
                transformOrigin: "0 10px",
                rotate: `${i * 90}deg`,
              }}
            />
          ))}
        </motion.div>

        {/* Bouncing Logo */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#D9C4B0] flex items-center justify-center shadow-lg"
          animate={{
            y: ["0%", "-20%", "0%"],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
          style={{ transform: "translate(-50%, -50%)" }}
        >
          <img src="/fa.svg" alt="Logo" className="w-10 h-10 sm:w-12 sm:h-12" />
        </motion.div>
      </div>
    </div>
  );
};

export default Loader;
